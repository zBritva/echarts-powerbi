import Handlebars from "handlebars"
import JSON5 from 'json5'

import { format } from "d3-format"
import { min, max, filter, median, mean, sum } from "d3-array"

import { utcFormat, timeFormat, utcParse } from "d3-time-format"

import { select } from "d3-selection"

import { axisBottom, axisLeft, axisRight, axisTop, Axis } from "d3-axis"

import { 
    scaleLinear,
    scaleBand,
    scaleLog,
    scaleOrdinal,
    ScaleLinear,
    ScaleBand,
    ScaleOrdinal,
    ScaleLogarithmic,
    scalePoint,
    scalePow,
    scaleQuantize,
    scaleDiverging,
    scaleTime,
    scaleThreshold,
    scaleRadial,
    scaleSequential
} from "d3-scale";
import { Table } from "src/utils";

const dateFormats = new Map<string, (date: Date) => string>()
const utcFormats = new Map<string, (date: Date) => string>()
const numberFormats = new Map<string, (date: number) => string>()

export type ScaleType = 'linear' | 'band' | 'log' | 'ordinal';
export type Scale = ScaleLinear<number, number> | ScaleLogarithmic<number, number> | ScaleBand<string> | ScaleOrdinal<string, number>

const scales = new Map<string, Scale>()
const axes = new Map<string, Axis<unknown>>()
const variables = new Map<string, number | string | Date | boolean>()
const axisFunctions = { axisBottom, axisLeft, axisRight, axisTop }
const globals = new Map<string, unknown>();

const scaleFunctions = {
    scaleBand,
    scaleLinear,
    scaleLog,
    scaleOrdinal,
    scaleDiverging,
    scalePoint,
    scaleQuantize,
    scalePow,
    scaleSequential,
    scaleThreshold,
    scaleTime,
    scaleRadial
}

export function hardReset() {
    axes.clear();
    scales.clear();
    variables.clear();
}

export function registerVariable(name: string, value: string) {
    variables.set(name, value);
}

export function unregisterVariable(name: string) {
    variables.delete(name);
}

export function registerGlobal(name: string, value: unknown) {
    globals.set(name, value)
}

Handlebars.registerHelper('resetScales', function () {
    scales.clear();
});

Handlebars.registerHelper('resetAxes', function () {
    axes.clear();
});

Handlebars.registerHelper('format', function (context: unknown, formatString: unknown) {
    if (context === null) {
        return 'null';
    }
    if (typeof formatString === 'string') {
        if (typeof context === 'number') {
            let formatter: (date: number) => string = null
            if (numberFormats.has(formatString)) {
                formatter = numberFormats.get(formatString)
            } else {
                formatter = format(formatString)
                numberFormats.set(formatString, formatter)
            }
            return formatter(context)
        } else {
            return 'Value is not number'
        }
    } else {
        return 'Wrong format'
    }
})

const dateParser = utcParse('%Y-%m-%dT%H:%M:%S.%LZ');

Handlebars.registerHelper('utcFormat', function (context: unknown, formatString: unknown) {
    if (context === null) {
        return 'null';
    }
    if (typeof formatString === 'string') {
        if (typeof context === 'string') {
            context = dateParser(context)
        }
        if (typeof context === 'object' && context instanceof Date) {
            let formatter: (date: Date) => string = null
            if (utcFormats.has(formatString)) {
                formatter = utcFormats.get(formatString)
            } else {
                formatter = utcFormat(formatString)
                utcFormats.set(formatString, formatter)
            }
            return formatter(context)
        }
    } else {
        return 'Wrong format'
    }
})

Handlebars.registerHelper('timeFormat', function (context: unknown, formatString: unknown) {
    if (context === null) {
        return 'null';
    }
    if (typeof formatString === 'string') {
        if (typeof context === 'object' && context instanceof Date) {
            let formatter: (date: Date) => string = null
            if (dateFormats.has(formatString)) {
                formatter = dateFormats.get(formatString)
            } else {
                formatter = timeFormat(formatString)
                dateFormats.set(formatString, formatter)
            }
            return formatter(context)
        }
    } else {
        return 'Wrong format'
    }
})

Handlebars.registerHelper('useScale', function (
    id: string,
    ...args: unknown[]
) {
    if (typeof id === 'string' && id !== '' && scales.has(id)) {
        const scale = scales.get(id);
        return scale.call(scale, ...args)
    } else {
        return 'Wrong scale ID'
    }
})

Handlebars.registerHelper('array', (...options) => {
    options.pop()
    return options
})

Handlebars.registerHelper('parse', (...options) => {
    options.pop()
    return JSON.parse(options.pop());
})

Handlebars.registerHelper('map', (array, key) => {
    return array.map(o => o[key]);
})

Handlebars.registerHelper('min', (array) => {
    return min(array)
})
Handlebars.registerHelper('max', (array) => {
    return max(array)
})
Handlebars.registerHelper('mean', (array) => {
    return mean(array)
})
Handlebars.registerHelper('median', (array) => {
    return median(array)
})
Handlebars.registerHelper('sums', (array) => {
    return sum(array)
})
Handlebars.registerHelper('filter', (array, v, eq: string = '==') => {
    switch (eq) {
        case '>':
            return filter(array, (a) => a > v)
        case '>=':
            return filter(array, (a) => a >= v)
        case '<':
            return filter(array, (a) => a < v)
        case '<=':
            return filter(array, (a) => a <= v)       
        default:
            return filter(array, (a) => a === v)
    }
})

for (const axisFunc in axisFunctions) {
    Handlebars.registerHelper(axisFunc, (id, scaleID) => {
        if (scales.has(scaleID)) {
            const scale = scales.get(scaleID)
            const axis = axisFunctions[axisFunc](scale)
            axes.set(id, axis)
        }  else {
            return `Scale ${scaleID} not found`
        }
    })
}

for (const scaleFunc in scaleFunctions) {
    Handlebars.registerHelper(scaleFunc, (id: string, ...args: unknown[]) => {
        if (!scales.has(id)) {
            args.pop();
            const scale = scaleFunctions[scaleFunc].call(axisFunctions[scaleFunc], ...args)
            scales.set(id, scale)
        } else {
            return 'Scale redeclared'
        }
    })
}

Handlebars.registerHelper('useAxis', function (
    id: string
) {
    const axis = axes.get(id);
    if (axis) {
        // eslint-disable-next-line powerbi-visuals/no-http-string
        const group: SVGGElement = document.createElementNS('http://www.w3.org/2000/svg', 'g')
        axis(select(group));
        return decodeURI(group.innerHTML)
    }
})

Handlebars.registerHelper('setupAxis', function (
    id: string,
    method: string,
    ...args: any
) {
    const axis = axes.get(id);
    if (axis) {
        args.pop();
        if (method === 'tickFormat') {
            axis.tickFormat(format(args[0]));
        } else {
            axis[method].call(axis, ...args);
        }
    }
})

Handlebars.registerHelper('getScale', function (
    id: string,
    method: string,
    ...args: any
) {
    const scale = scales.get(id);
    if (scale) {
        args.pop();
        return scale[method].call(scale, ...args);
    }
})

Handlebars.registerHelper('setupScale', function (
    id: string,
    method: string,
    ...args: any
) {
    const scale = scales.get(id);
    if (scale) {
        args.pop();
        scale[method].call(scale, ...args);
    }
})

Handlebars.registerHelper('sum', function (
    a: number,
    b: number
) {
    return a + b
})

Handlebars.registerHelper('sub', function (
    a: number,
    b: number
) {
    return a - b
})

Handlebars.registerHelper('multiply', function (
    a: number,
    b: number
) {
    return a * b
})

Handlebars.registerHelper('divide', function (
    a: number,
    b: number
) {
    return a / b
})

Handlebars.registerHelper('var', function (
    name: string,
    value: number
) {
    variables.set(name, value)
})

Handlebars.registerHelper('val', function (
    name: string
) {
    return variables.get(name)
})

Handlebars.registerHelper('math', function (
    method: string,
    ...args: any[]
) {
    args.pop()
    if (args.length) {
        return Math[method].call(Math, args)
    } else {
        return Math[method]
    }
})

Handlebars.registerHelper('column', (name) => {
    const table: Table = globals.get('table') as Table
    const found = table.columns.find(c => c.displayName == name)
    if (found) {
        const column = table.rows.map(r => r[name]);
        return "[" + column.map(i => `"${i}"`).join(",") + "]"
    } else {
        return `Column "${name}" not found`
    }
})

Handlebars.registerHelper('select', (...options) => {
    options.pop()
    const table: Table = globals.get('table') as Table
    const columnNames = options
    const notFoundColumns = columnNames.filter(c => !table.columns.find(cc => cc.displayName == c));
    if (notFoundColumns.length > 0) {
        return `Column "${notFoundColumns.join(',')}" not found`
    } else {
        const column = table.rows.map(r => {
            const data = columnNames.map(names => r[names])
            return "[" + data.map(i => `"${i}"`).join(",") + "]"
        });
        return "[" + column.map(i => `${i}`).join(",") + "]"
    }
})

Handlebars.registerHelper('distinct', (name) => {
    const table: Table = globals.get('table') as Table
    const found = table.columns.find(c => c.displayName == name)
    if (found) {
        const column = table.rows.map(r => r[name]);
        return "[" + [...new Set(column)].map(i => `"${i}"`).join(",") + "]"
    } else {
        return `Column "${name}" not found`
    }
})

Handlebars.registerHelper('jsonArray', (...options) => {
    options.pop()
    const arr = options.pop();
    return "[" + arr.map(i => `"${i}"`).join(",") + "]";
})
