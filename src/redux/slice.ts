import powerbiVisualsApi from "powerbi-visuals-api";
import VisualUpdateOptions = powerbiVisualsApi.extensibility.visual.VisualUpdateOptions;
import DataView = powerbiVisualsApi.DataView;
import IVisualHost = powerbiVisualsApi.extensibility.visual.IVisualHost
import IViewport = powerbiVisualsApi.IViewport;
import ISelectionManager = powerbiVisualsApi.extensibility.ISelectionManager;


import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import { IVisualSettings, VisualSettings } from "../settings";
import { Table, convertData, createDataset } from "../utils";
import { EChartOption } from "echarts";

export interface VisualState {
    host: IVisualHost;
    selectionManager: ISelectionManager;
    options: VisualUpdateOptions;
    settings: IVisualSettings;
    viewport: IViewport;
    dataset: EChartOption.Dataset;
    table: Table;
    dataView: DataView;
    settingsHasLoaded: boolean;
}

const initialState: VisualState = {
    settingsHasLoaded: false,
    host: undefined,
    selectionManager: undefined,
    options: undefined,
    settings: VisualSettings.getDefault() as VisualSettings,
    dataset: {},
    table: {
        columns: [],
        rows: []
    },
    dataView: null,
    viewport: {
        height: 0,
        width: 0
    }
}

export const slice = createSlice({
    name: 'options',
    initialState,
    reducers: {
        setHost: (state, action: PayloadAction<IVisualHost>) => {
            state.host = action.payload
            state.selectionManager = state.host.createSelectionManager();
        },
        setOptions: (state, action: PayloadAction<VisualUpdateOptions>) => {
            state.options = action.payload;
            if (!state.options.dataViews[0]) {
                return;
            }
            state.dataView = state.options.dataViews[0];
            state.dataset = createDataset(state.dataView);
            state.table = convertData(state.dataView, state.host);
        },
        setSettings: (state, action: PayloadAction<IVisualSettings>) => {
            state.settings = action.payload;
        },
        setViewport: (state, action: PayloadAction<IViewport>) => {
            state.viewport = action.payload;
        }
    },
})

// Action creators are generated for each case reducer function
export const { setHost, setOptions, setViewport, setSettings } = slice.actions

export default slice.reducer