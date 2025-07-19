import React from 'react';

import powerbiApi from "powerbi-visuals-api";

import { Viewer } from './View';
import { Tutorial } from './Tutorial';
import { QuickChart, Resource } from './QuickChart';
import * as Handlebars from "handlebars";
import JSON5 from 'json5'

import { useAppSelector, useAppDispatch } from './redux/hooks';
import { setSettings } from './redux/slice';
import { IVisualSettings } from './settings';
import { uncommentCodeComments } from './utils';

import { hardReset, registerGlobal, registerVariable } from "./handlebars/helpers"

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface ApplicationProps {
}

/* eslint-disable max-lines-per-function */
export const Application: React.FC<ApplicationProps> = () => {

    const settings = useAppSelector((state) => state.options.settings);
    const option = useAppSelector((state) => state.options.options);
    const host = useAppSelector((state) => state.options.host);
    const selectionManager = useAppSelector((state) => state.options.selectionManager);

    const dataView = useAppSelector((state) => state.options.dataView);
    const viewport = useAppSelector((state) => state.options.viewport);
    
    const dataset = useAppSelector((state) => state.options.dataset);
    const table = useAppSelector((state) => state.options.table);

    const chart = useAppSelector((state) => state.options.settings.chart.echart);
    
    const dispatch = useAppDispatch();

    const persistProperty = React.useCallback((json_string: string, tutorial: string, resources: string) => {
        const instance: powerbiApi.VisualObjectInstance = {
            objectName: "chart",
            selector: undefined,
            properties: {
                echart: json_string,
                resources: resources,
                tutorial: tutorial
            }
        };

        host.persistProperties({
            replace: [
                instance
            ]
        });
    }, [host])

    const template = React.useMemo(() => {
        const charttmpl = uncommentCodeComments(chart);
        return Handlebars.compile(charttmpl);
    }, [chart, settings])

    const content = React.useMemo(() => {
        hardReset()
        Handlebars.unregisterHelper('useColor')
        Handlebars.registerHelper('useColor', function (val: string) {
            return host.colorPalette.getColor(val).value
        })
        Handlebars.unregisterHelper('useSelection')
        Handlebars.registerHelper('useSelection', function (index: number) {
            if (table[index] && typeof index === 'number') {
                return `data-selection=true data-index="${index}"`
            }
        })
        Handlebars.unregisterHelper('useSelectionClear')
        Handlebars.registerHelper('useSelectionClear', function () {
            return `data-selection-clear="true"`
        })
        registerGlobal('table', table)
        const resources: Resource[] = JSON5.parse(settings.chart.resources);
        Object.keys(resources).forEach((key) => {
            registerVariable(resources[key].name, resources[key].value);
        });
        try {
            return template({
                table,
                dataset,
                viewport
            })
        } catch (err) {
            return `<h4>${err.message}</h4><pre>${err.stack}</pre>`
        }
    }, [host, table, viewport, template, settings])

    const onClickHandler = React.useCallback((params) => {
        selectionManager?.select(table.rows[params.dataIndex].selection, params.event.ctrlKey || params.event.metaKey);
    }, [host, table, dataset]);

    const onMouseOverHandler = React.useCallback((params) => {
        const dataItems = [];
        switch (params.componentSubType) {
            case 'scatter':
                dataItems.push({
                    header: params['seriesName'] ?? '',
                    displayName: params.dimensionNames[0] ?? 'x',
                    value: params['value']?.[0],
                });
                dataItems.push({
                    header: params['seriesName'] ?? '',
                    displayName: params.dimensionNames[0] ?? 'y',
                    value: params['value']?.[1],
                });
                break;
            default:
                dataItems.push({
                    header: params['seriesName'] ?? '',
                    displayName: params['name'] ?? '',
                    value: params['value'] ?? '',
                });
                break;
        }

        host.tooltipService.hide({ immediately: true, isTouchEvent: false });
        host.tooltipService.show({
            coordinates: [params.event.offsetX, params.event.offsetY],
            dataItems: dataItems.filter((item) => item.value !== ''),
            isTouchEvent: false,
            identities: [
                table.rows[params.dataIndex].selection
            ],
        });
    }, [host, table, dataset]);

    const onMouseOutHandler = React.useCallback(() => {
        host.tooltipService.hide({ immediately: false, isTouchEvent: false});
    }, [host, table, dataset]);

    const onMouseContextMenuHandler = React.useCallback((params) => {
        host.tooltipService.hide({ immediately: false, isTouchEvent: false});
        if (params.dataIndex === undefined) {
            selectionManager?.showContextMenu(null, {
                x: params.event.event.clientX,
                y: params.event.event.clientY
            });
        } else {
            selectionManager?.showContextMenu(table.rows[params.dataIndex].selection, {
                x: params.event.event.clientX,
                y: params.event.event.clientY
            });
        }
        params.event.event.preventDefault();
        params.event.event.stopPropagation()
    }, [host, table, dataset]);

    if (option && option.editMode === powerbiApi.EditMode.Advanced && dataView && dataView.table) {
        return (
            <QuickChart
                dataset={dataset}
                height={option.viewport.height}
                width={option.viewport.width}
                dataView={dataView}
                current={chart}
                resources={JSON5.parse(settings.chart.resources)}
                onSave={(json, tutorial, resources) => {
                    const newSettings: IVisualSettings = JSON5.parse(JSON5.stringify(settings));
                    newSettings.chart.echart = json;
                    newSettings.chart.tutorial = tutorial; 
                    newSettings.chart.resources = JSON5.stringify(resources, null, "");
                    dispatch(setSettings(newSettings));
                    persistProperty(json, tutorial, newSettings.chart.resources);
                }}
            />
        );
    }
    
    if (!dataView || !dataView.categorical || !settings) {
        const categorical = dataView?.categorical;
        if (!dataView && !categorical || settings && settings.chart.echart === '{}') {
            return (
                <Tutorial
                    height={viewport.height}
                    width={viewport.width}
                    dataset={dataset}
                    host={host}
                    template={settings.chart.tutorial}
                    settings={settings}
                />
            )
        }
    }
    
    if (!option || !settings) {
        return (<h1>Loading...</h1>)
    }

    return (
        <>
            <Viewer
                onClick={onClickHandler}
                onMouseOver={onMouseOverHandler}
                onMouseOut={onMouseOutHandler}
                onContextMenu={onMouseContextMenuHandler}
                dataset={dataset}
                height={option.viewport.height}
                width={option.viewport.width}
                echartJSON={content}
            />
        </>
    );
}
