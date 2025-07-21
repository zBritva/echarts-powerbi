
"use strict";

import { dataViewObjectsParser } from "powerbi-visuals-utils-dataviewutils";
import DataViewObjectsParser = dataViewObjectsParser.DataViewObjectsParser;

export interface IVisualSettings {
    chart: Chart;
}

export class VisualSettings extends DataViewObjectsParser implements IVisualSettings {
    public chart: Chart = new Chart();
}

export class Chart {
    public echart: string = "{}";
    public resources: string = "[]";
    public tutorial: string = "";
}
