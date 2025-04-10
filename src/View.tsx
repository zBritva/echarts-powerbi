import React from "react";
import JSON5 from 'json5'
import * as echarts from "echarts";


import 'echarts-gl';
import { transform } from 'echarts-stat';
echarts.registerTransform(transform.histogram);
echarts.registerTransform(transform.clustering);


import { ErrorViewer } from "./Error";
import Layout from "antd/es/layout/layout";
import { applyData, applyFormatter, getTheFirstDataset } from "./utils";

export interface ViewerProps {
    onClick?: (params: any) => void;
    onMouseOver?: (params: any) => void;
    onMouseOut?: (params: any) => void;
    onContextMenu?: (params: any) => void;
    width: number;
    height: number;
    // echart?: echarts.EChartOption;
    echartJSON: string;
    dataset: echarts.EChartOption.Dataset | echarts.EChartOption.Dataset[];
}

/* eslint-disable max-lines-per-function */
export const Viewer: React.FC<ViewerProps> = ({ height, width, echartJSON, dataset, onClick, onMouseOver, onMouseOut, onContextMenu }) => {

    const mainDiv = React.useRef<HTMLDivElement>();
    const chartInstance = React.useRef<echarts.EChartsType>();
    const echart = React.useRef<echarts.EChartOption>({});
    
    const [error, setError] = React.useState<string>(null);
    const [parsingError, setParsingError] = React.useState<string>(null);

    // Parse chart options
    React.useEffect(() => {
        try {
            setParsingError(null);
            let parsed = JSON5.parse(echartJSON);
            parsed = applyData(parsed, getTheFirstDataset(dataset));
            echart.current = applyFormatter(parsed);
            echart.current.dataset = dataset;
        } catch(e) {
            setParsingError(e.message);
            console.error(e);
            echart.current = {};
        }
    }, [echartJSON, dataset, setParsingError, getTheFirstDataset]);

    // Create the echarts instance
    React.useEffect(() => {
        try {
            setError(null);
            chartInstance.current = echarts.init(mainDiv.current, null, {
                height,
                width,
            });

            chartInstance.current.on("click", (params) => {
                if (onClick) {
                    onClick(params);
                }
            });

            chartInstance.current.on("mouseover", (params) => {
                if (onMouseOver) {
                    onMouseOver(params);
                }
            });

            chartInstance.current.on("mouseout", (params) => {
                if (onMouseOut) {
                    onMouseOut(params);
                }
            });

            chartInstance.current.on("contextmenu", (params) => {
                if (onContextMenu) {
                    onContextMenu(params);
                }
            });
        }
        catch(e) {
            setError(e.message);
            console.error(e);
            echart.current = {};
        }

        return () => {
            chartInstance.current.dispose();
        };
    }, [echartJSON, setError]);

    // Draw the chart
    React.useEffect(() => {
        try {
            chartInstance.current.setOption(echart.current);
        } catch (e) {
            setError(e.message);
            console.log('parse error', e);
        }
    }, [echart, chartInstance, dataset, echartJSON, setError]);

    // handle resize
    React.useEffect(() => {
        chartInstance.current?.resize({
            height,
            width
        })
    }, [height, width, chartInstance, echart]);

    return (
        <>
            {parsingError ? (
            <>
                <ErrorViewer error={parsingError} height={height} width={width} json={echartJSON}/>
            </>
            ) : null }
            {error ? (
            <>
                <ErrorViewer error={error} height={height} width={width} json={echartJSON}/>
            </>
            ) : null }
            <Layout className={parsingError || error ? "hidden" : ""} style={{backgroundColor: 'transparent'}}>
                <div
                    ref={mainDiv}
                    onContextMenu={(event) => {
                        onContextMenu({event: {
                            event
                        }})
                    }}
                    id="main"
                    style={{
                        height: `${height}px`,
                        width: `${width}px`,
                    }}
                ></div>
            </Layout>
        </>
    );
};
