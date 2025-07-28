/* eslint-disable max-lines-per-function */
import React, { useCallback, useRef, useState } from "react";
import * as Handlebars from "handlebars";
import JSON5 from 'json5'
import * as echarts from 'echarts';

import powerbiApi from "powerbi-visuals-api";
import DataView = powerbiApi.DataView;

import { ErrorViewer } from "./Error";

import { Button, Flex, Layout, Menu, MenuProps, theme, Tabs, Input, Table } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import { uncommentCodeComments } from "./utils";
// import { Mapping } from "./Mapping";
import { Viewer } from "./View";

import { schemas } from './charts';
import { hardReset, registerGlobal } from "./handlebars/helpers";
import { useAppSelector } from "./redux/hooks";

import { LoadDataFromFile, replaceResourceName } from "./utils/base64loader";

import { registerVariable, unregisterVariable } from "./handlebars/helpers";

import AceEditor from "react-ace";

import "ace-builds/src-noconflict/mode-json5";
import "ace-builds/src-noconflict/mode-json";
import "ace-builds/src-noconflict/theme-github";
import "ace-builds/src-noconflict/ext-language_tools";

import 'echarts-gl';
import { transform } from 'echarts-stat';
echarts.registerTransform(transform.histogram);
echarts.registerTransform(transform.clustering);

const { Content, Sider } = Layout;

const chartTree = {
    'Current': [],
    'Line': [
        'Basic Line Chart',
        'Smoothed Line Chart',
        'Basic area chart',
        'Stacked Area Chart'
    ],
    'Bar': [
        'Basic Bar Chart',
        'Bar with Background',
        'Axis Align with Tick',
        'Waterfall Chart',
        'Bar Chart with Negative Value',
        'Bar Label Rotation',
        'Stacked Horizontal Bar',
        'Stacked Bar Chart on Polar'
    ],
    'Pie': [
        'Doughnut Chart',
        'Half Doughnut Chart',
        'Half Pie Chart',
    ],
    'Scatter': [
        'Scatter',
        // 'Clustering Process'
    ],
    'Candlestick': [
        'Basic Candlestick',
    ],
    'Radar': [
        'Basic Radar Chart',
        'AQI - Radar'
    ],
    // 'Boxplot': [
    //     'Basic Boxplot',
    // ],
    'Heatmap': [
        'Basic Heatmap'
    ],
    // 'Tree': [
    //     'Basic Tree',
    // ],
    // 'Treemap': [
    //     'Basic Treemap',
    // ],
    // 'Sunburst': [
    //     'Basic Sunburst',
    // ],
    // 'Sankey': [
    //     'Basic Sankey',
    // ],
    // 'Funnel': [
    //     'Basic Funnel',
    // ],
    'Gauge': [
        'Basic Gauge',
    ],
    'Coming soon...': [
        'Boxplot',
        'Gauge',
        'Funnel',
        'Sankey',
        'Sunburst',
        'Treemap',
        'Tree',
        'Clustering Process'
    ]
}

export interface Resource {
    size: string,
    name: string,
    value: string | ArrayBuffer | null
}

export interface QuickChartProps {
    width: number;
    height: number;
    dataset: echarts.EChartOption.Dataset;
    dataView: DataView;
    current: string;
    resources: Resource[];
    onSave: (json: string, tutorial: string, resources: Resource[]) => void;
}

/* eslintd-isable max-lines-per-function */
export const QuickChart: React.FC<QuickChartProps> = ({ height, width, dataset: visualDataset, current, onSave, resources }) => {
    const [error] = React.useState<string>(null);
    const defaultSchema = schemas['Current'] || schemas['Basic Line Chart'];
    const isString = typeof defaultSchema == 'string';
    const [schema, setSchema] = React.useState<string>(isString ? defaultSchema : JSON5.stringify(defaultSchema, null, " "));
    const host = useAppSelector((state) => state.options.host);
    const settings = useAppSelector((state) => state.options.settings);

    const [resourceName, setResourceName] = useState<string>('');

    const [resourcesList, setResourcesList] = useState<Resource[]>(resources);

    const onRemoveResource = useCallback((index: number) => {
        unregisterVariable(resourcesList[index].name);
        resourcesList.splice(index, 1);
        setResourcesList([...resourcesList]);
    }, [resourcesList, setResourcesList]);

    const fileInput = useRef<HTMLInputElement>(null);

    const chartGroups: MenuProps['items'] = Object.keys(chartTree).map(
        (group) => {
            if (chartTree[group].length === 0) {
                return {
                    key: group,
                    label: `${group}`,
                };
            }
            return {
                key: group,
                label: `${group}`,

                children: chartTree[group].map((chart, j) => {
                    return {
                        key: chart,
                        label: `${chart}`,
                        disabled: group === 'Coming soon...',
                    };
                }),
            };
        },
    );

    const {
        token: { colorBgContainer },
    } = theme.useToken();

    const dataset = visualDataset;
    const table = useAppSelector((state) => state.options.table);
    const viewport = useAppSelector((state) => state.options.viewport);

    const template = React.useMemo(() => {
        const charttmpl = uncommentCodeComments(schema);
        return Handlebars.compile(charttmpl);
    }, [schema])

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
        Object.keys(resourcesList).forEach((key) => {
            registerVariable(resourcesList[key].name, resourcesList[key].value);
        })
        try {
            return template({
                table,
                dataset,
                viewport
            })
        } catch (err) {
            return `<h4>${err.message}</h4><pre>${err.stack}</pre>`
        }
    }, [host, table, viewport, template])

    const draft = React.useRef<string>(schema);
    const tutorial = React.useRef<string>(settings.chart.tutorial);

    const onApplySchema = React.useCallback(() => {
        setSchema(draft.current);
    }, [setSchema]);

    const onOpenSupport = React.useCallback(() => {
        host.launchUrl('https://donate.stripe.com/00w6oHbf06sg07M9bXgUM01');
    }, [host]);

    const onOpenDocs = React.useCallback(() => {
        host.launchUrl('https://ilfat-galiev.im/docs/echarts-visual');
    }, [host]);

    return (
        <>
            {error ? (
                <>
                    <ErrorViewer error={error} height={height} width={width} json={content} />
                </>
            ) : (
                <>
                    <Layout className="quick-chart" style={{ height: '100%', background: 'transparent' }}>
                        <Sider className="card" width={200} style={{ background: colorBgContainer, overflowY: 'scroll' }}>
                            <Menu
                                mode="inline"
                                defaultSelectedKeys={['Current']}
                                defaultOpenKeys={['sub1']}
                                style={{ height: '100%', borderRight: 0 }}
                                items={chartGroups}
                                onClick={(info) => {
                                    if (info.key === 'Current') {
                                        draft.current = current;
                                        setSchema(current);
                                    }
                                    else if (schemas[info.key]) {
                                        const isString = typeof schemas[info.key] == 'string';
                                        draft.current = isString ? (schemas[info.key] as string) : JSON5.stringify(schemas[info.key], null, " ");
                                        setSchema(draft.current);
                                    }
                                }}
                            />
                        </Sider>
                        <Layout style={{
                                padding: '0 0 15px 0',
                                overflowY: 'unset',
                                background: 'transparent',
                            }}>
                            <Content
                                style={{
                                    padding: 0,
                                    margin: 0,
                                    minHeight: 280,
                                    background: colorBgContainer
                                }}
                            >
                                <div className="card">
                                    <Flex vertical={false}>
                                        <Button type="primary" onClick={() => {
                                            setSchema(draft.current);
                                            onSave(draft.current, tutorial.current, resourcesList);
                                        }}>
                                            Save
                                        </Button>
                                        <Button className="apply" onClick={onApplySchema}>Apply</Button>
                                        <Button className="apply" danger type="default" onClick={onOpenSupport}>Support Dev by Stripe</Button>
                                        <a className="docs-link" onClick={onOpenDocs}>Documentation</a>
                                    </Flex>
                                </div>
                                <div className="card scroll-view">
                                    <div className="card">
                                        <h4 className="card-title">Preview</h4>
                                        <Viewer
                                            dataset={dataset}
                                            height={height * (9 / 10)}
                                            width={width - 300}
                                            echartJSON={content}
                                        />
                                    </div>
                                    <div className="card">
                                        <Tabs
                                            className="tabs-header"
                                            defaultActiveKey="1"
                                            items={[
                                                {
                                                    key: '1',
                                                    label: 'Configuration',
                                                    children: (
                                                        <>
                                                            <AceEditor
                                                                className="editor"
                                                                width="100%"
                                                                height={`${height * (9 / 10)}px`}
                                                                mode="json"
                                                                theme="github"
                                                                onChange={(edit) => {
                                                                    draft.current = edit;
                                                                }}
                                                                setOptions={{
                                                                    useWorker: false
                                                                }}
                                                                value={schema}
                                                                name="CONFIGURATION_ID"
                                                                editorProps={{ $blockScrolling: true }}
                                                            />
                                                        </>
                                                    )
                                                },
                                                {
                                                    key: '2',
                                                    label: 'Configuration output',
                                                    children: (
                                                        <>
                                                            <AceEditor
                                                                className="editor"
                                                                width="100%"
                                                                height={`${height * (9 / 10)}px`}
                                                                mode="json"
                                                                theme="github"
                                                                setOptions={{
                                                                    useWorker: false,
                                                                    readOnly: true
                                                                }}
                                                                value={content}
                                                                name="OUTPUT_ID"
                                                                editorProps={{ $blockScrolling: true }}
                                                            />
                                                        </>
                                                    )
                                                },
                                                {
                                                    key: '3',
                                                    label: 'Resources',
                                                    children: (
                                                        <>
                                                            <Flex vertical={true}>
                                                                <div
                                                                    style={{
                                                                        width:"100%",
                                                                        height: `${height * (9 / 10)}px`
                                                                    }}
                                                                >
                                                                    <Flex vertical={false} className="resource-loader">
                                                                        <input ref={fileInput} type="file" style={{display: 'none'}} onChange={async () => {
                                                                            const data = await LoadDataFromFile(fileInput.current);
                                                                            if (!data) return;
                                                                            const resource = {
                                                                                size: `${Math.round(fileInput.current.files[0].size / 1024)}kb`,
                                                                                name: replaceResourceName(resourceName || fileInput.current.files[0].name),
                                                                                value: data
                                                                            };
                                                                            resourcesList.push(resource);
                                                                            registerVariable(resource.name, resource.value);
                                                                            setResourcesList([...resourcesList]);
                                                                        }} />
                                                                        <Input value={resourceName} placeholder="Resource name" width={300} onChange={(value) => {
                                                                            setResourceName(value.target.value);
                                                                        }} />
                                                                        <Button onClick={() => fileInput.current.click()} className="resource-loader-button" type="primary" icon={<PlusOutlined />} />
                                                                    </Flex>
                                                                    <Table dataSource={resourcesList} columns={[
                                                                        {
                                                                            title: 'Resource name',
                                                                            dataIndex: 'name',
                                                                            key: 'name',
                                                                            render: (value: any, record: any, index: number) => <p className="user-select-all">{value}</p>
                                                                        },
                                                                        {
                                                                            title: 'Size',
                                                                            dataIndex: 'size',
                                                                            key: 'size',
                                                                        },
                                                                        {
                                                                            title: 'Action',
                                                                            dataIndex: '',
                                                                            key: 'remove',
                                                                            render: (value: any, record: any, index: number) => <Button onClick={() => onRemoveResource(index)}>Delete</Button>,
                                                                        }
                                                                    ]} />
                                                                </div>
                                                            </Flex>

                                                        </>
                                                    )
                                                },
                                                // {
                                                //     key: '4',
                                                //     label: 'Introduction template',
                                                //     children: (
                                                //         <>
                                                //             <AceEditor
                                                //                 className="editor"
                                                //                 width="100%"
                                                //                 height={`${height * (9 / 10)}px`}
                                                //                 mode="html"
                                                //                 theme="github"
                                                //                 setOptions={{
                                                //                     useWorker: false,
                                                //                     readOnly: false
                                                //                 }}
                                                //                 value={settings.chart.tutorial}
                                                //                 onChange={(edit) => {
                                                //                     tutorial.current = edit;
                                                //                 }}
                                                //                 name="TEMPLATE_OUTPUT_ID"
                                                //                 editorProps={{ $blockScrolling: true }}
                                                //             />
                                                //         </>
                                                //     )
                                                // },
                                            ]}
                                        />
                                    </div>
                                </div>
                            </Content>
                        </Layout>
                    </Layout>
                </>
            )}

        </>
    );
};
