import React from "react";

import * as echarts from "echarts";
import powerbiVisualsApi from "powerbi-visuals-api";
import IVisualHost = powerbiVisualsApi.extensibility.visual.IVisualHost
import { sanitizeHTML, uncommentCodeComments } from "./utils";
import { useAppSelector } from "./redux/hooks";
import { IVisualSettings } from "./settings";
import { registerGlobal, registerVariable } from "./handlebars/helpers";
import { Resource } from "./QuickChart";

export interface TutorialProps {
    width: number;
    height: number;
    dataset: echarts.EChartOption.Dataset | echarts.EChartOption.Dataset[] | null;
    host: IVisualHost;
    template: string;
    settings: IVisualSettings
}

/* eslint-disable max-lines-per-function */
export const Tutorial: React.FC<TutorialProps> = ({ height, width, host, template, settings }) => {

    const viewport = useAppSelector((state) => state.options.viewport);

    const dataset = useAppSelector((state) => state.options.dataset);
    const table = useAppSelector((state) => state.options.table);

    const compiledTemplate = React.useMemo(() => {
        const charttmpl = uncommentCodeComments(template);
        return Handlebars.compile(charttmpl);
    }, [template, settings])

    const content = React.useMemo(() => {
        Handlebars.unregisterHelper('useColor')
        Handlebars.registerHelper('useColor', function (val: string) {
            return host.colorPalette.getColor(val).value
        })
        registerGlobal('table', table)
        const resources: Resource[] = JSON.parse(settings.chart.resources);
        Object.keys(resources).forEach((key) => {
            registerVariable(resources[key].name, resources[key].value);
        });
        try {
            return compiledTemplate({
                table,
                dataset,
                viewport
            })
        } catch (err) {
            return `<h4>${err.message}</h4><pre>${err.stack}</pre>`
        }
    }, [host, table, viewport, template, settings])

    let maxSize = Math.min(width, height);

    const colors = React.useMemo(() => {
        const colors = [
            host.colorPalette.getColor("Cat1").value,
            host.colorPalette.getColor("Cat2").value,
            host.colorPalette.getColor("Cat3").value,
            host.colorPalette.getColor("Cat4").value,
            host.colorPalette.getColor("Cat5").value,
            host.colorPalette.getColor("Cat6").value,
            host.colorPalette.getColor("Cat7").value,
            host.colorPalette.getColor("Cat8").value,
        ];
        host.colorPalette.reset();
        return colors;
    }, [host]);

    let scale = 1;
    if (maxSize < 510) {

        scale = (maxSize / 510);

        maxSize = 510 * scale;
    }

    if (settings.chart.tutorial) {
        return (
            <>
                <div dangerouslySetInnerHTML={{
                    __html: sanitizeHTML(content)
                }}>

                </div>
            </>
        )
    }


    return (
        <>
            <div className="tutorial">
                <div className="home-info">
                    <div className="home-brand">Apache ECharts</div>
                    <div className="home-subtitle">An Open Source JavaScript Visualization Library</div>
                    <div className="home-btn-panel">
                        <a href="#" className="btn btn-main btn-index-home" onClick={(e) => {
                            host.launchUrl("https://ilfat-galiev.im/docs/echarts-visual/");
                            e.stopPropagation();
                            e.preventDefault();
                        }}>
                            Apache ECharts Visual Documentation
                        </a>
                    </div>
                    <div className="home-btn-panel">
                        <a href="#" className="btn btn-main btn-index-home" onClick={(e) => {
                            host.launchUrl("https://echarts.apache.org/en/index.html");
                            e.stopPropagation();
                            e.preventDefault();
                        }}>
                            Apache ECharts Documentation
                        </a>
                    </div>
                </div>

                <div className="apache-echart-logo">
                    {/* eslint-disable-next-line powerbi-visuals/no-http-string */}
                    <svg width={maxSize} height={maxSize} xmlns="http://www.w3.org/2000/svg" xmlnsXlink="http://www.w3.org/1999/xlink" version="1.1" baseProfile="full" viewBox={`0 0 ${maxSize} ${maxSize}`}>
                        <g transform={`translate(0,0) scale(${scale})`}>
                            <rect width={maxSize} height={maxSize} x="0" y="0" id="0" fill="none" fillOpacity="1"></rect>
                            <path d="M255 25.9A20 20 0 0 1 276.7 5.9A250 250 0 0 1 496.5 190.3A20 20 0 0 1 480.6 215.2L308.9 245.5A5 5 0 0 1 303.2 241.9A50 50 0 0 0 259.5 205.2A5 5 0 0 1 255 200.2Z" fill={colors[0]} stroke="white" strokeWidth="4" strokeLinejoin="round" style={{ transformOrigin: "255px 255px" }} className="zr0-cls-0"></path>
                            <path d="M443.3 221.8A18 18 0 0 1 464.3 238.1A210 210 0 0 1 393.8 412.6A18 18 0 0 1 367.4 409.6L287.2 299.3A5 5 0 0 1 287.9 292.6A50 50 0 0 0 304.8 250.8A5 5 0 0 1 308.9 245.5Z" fill={colors[1]} stroke="white" strokeWidth="4" strokeLinejoin="round" style={{ transformOrigin: "255px 255px" }} className="zr0-cls-1"></path>
                            <path d="M356.8 395.2A16 16 0 0 1 352.1 418.3A190 190 0 0 1 206.7 438.8A16 16 0 0 1 195.7 417.8L236.3 306.5A5 5 0 0 1 242.2 303.3A50 50 0 0 0 280.6 298A5 5 0 0 1 287.2 299.3Z" fill={colors[2]} stroke="white" strokeWidth="4" strokeLinejoin="round" style={{ transformOrigin: "255px 255px" }} className="zr0-cls-2"></path>
                            <path d="M201.9 401A14 14 0 0 1 182.8 408.9A170 170 0 0 1 103.7 332.6A14 14 0 0 1 110.9 313.2L204.2 275.5A5 5 0 0 1 210.5 277.9A50 50 0 0 0 233.7 300.2A5 5 0 0 1 236.3 306.5Z" fill={colors[3]} stroke="white" strokeWidth="4" strokeLinejoin="round" style={{ transformOrigin: "255px 255px" }} className="zr0-cls-3"></path>
                            <path d="M132.2 304.6A12 12 0 0 1 116.2 297A145 145 0 0 1 112.6 227.8A12 12 0 0 1 127.7 218.5L202.3 239.9A5 5 0 0 1 205.9 245.6A50 50 0 0 0 207.1 269.4A5 5 0 0 1 204.2 275.5Z" fill={colors[4]} stroke="white" strokeWidth="4" strokeLinejoin="round" style={{ transformOrigin: "255px 255px" }} className="zr0-cls-4"></path>
                            <path d="M144.9 223.4A10 10 0 0 1 138.3 210.2A125 125 0 0 1 160.7 173A10 10 0 0 1 175.4 172.6L217 215.6A5 5 0 0 1 217.1 222.3A50 50 0 0 0 208.4 236.9A5 5 0 0 1 202.3 239.9Z" fill={colors[5]} stroke="white" strokeWidth="4" strokeLinejoin="round" style={{ transformOrigin: "255px 255px" }} className="zr0-cls-5"></path>
                            <path d="M184.4 181.9A8 8 0 0 1 185 170.1A110 110 0 0 1 209.4 154.9A8 8 0 0 1 220.2 159.4L236.3 203.5A5 5 0 0 1 233.7 209.8A50 50 0 0 0 223.7 216A5 5 0 0 1 217 215.6Z" fill={colors[6]} stroke="white" strokeWidth="4" strokeLinejoin="round" style={{ transformOrigin: "255px 255px" }} className="zr0-cls-6"></path>
                            <path d="M222.9 166.8A6 6 0 0 1 226.9 159A100 100 0 0 1 248.6 155.2A6 6 0 0 1 255 161.2L255 200.2A5 5 0 0 1 250.5 205.2A50 50 0 0 0 242.2 206.7A5 5 0 0 1 236.3 203.5Z" fill={colors[7]} stroke="white" strokeWidth="4" strokeLinejoin="round" style={{ transformOrigin: "255px 255px" }} className="zr0-cls-7"></path>
                        </g>
                    </svg>
                </div>
            </div>
        </>
    );
};

