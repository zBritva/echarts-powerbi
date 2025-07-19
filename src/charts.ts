
export const schemas: {
    [key: string]: Record<string, any> | string
} = {
    "Basic Line Chart": `{
    "dataset": {
          "dimensions": ["Country", " Sales"],
    },
    xAxis: {
        type: 'category',
        // HBT data: {{{ column 'Country' }}},
    },
    yAxis: {
        type: 'value'
    },
    series: [
        {
            name: ' Sales',
            // HBT data: {{{ column ' Sales' }}},
            type: 'line'
        }
    ]
  }`,
    "Smoothed Line Chart": `{
    xAxis: {
        type: 'category',
        // HBT data: {{{ jsonArray (map table.rows 'Country') }}},
    },
    yAxis: {
        type: 'value'
    },
    series: [
        {
            name: ' Sales',
            // HBT data: {{{ jsonArray (map table.rows ' Sales') }}},
            type: 'line',
            smooth: true
        }
    ]
  }`,
    "Basic area chart": `{
    xAxis: {
        type: 'category',
        boundaryGap: false,
        // HBT data: {{{ jsonArray (map table.rows 'Country') }}},
    },
    yAxis: {
        type: 'value'
    },
    series: [
        {
            name: ' Sales',
            // HBT data: {{{ jsonArray (map table.rows ' Sales') }}},
            type: 'line',
            areaStyle: {}
        }
    ]
  }`,
    "Stacked Line": `{
    title: {
        text: 'Stacked Line'
    },
    tooltip: {
        trigger: 'axis'
    },
    legend: {
        // HBT data: {{{ jsonArray (map table.rows 'Country') }}},
    },
    grid: {
        left: '3%',
        right: '4%',
        bottom: '3%',
        containLabel: true
    },
    toolbox: {
        feature: {
          saveAsImage: {}
        }
    },
    xAxis: {
        type: 'category',
        boundaryGap: false,
        // HBT data: {{{ jsonArray (map table.rows 'Country') }}},
    },
    yAxis: {
        type: 'value'
    },
    series: [
        {
          name: 'Sales',
          type: 'line',
          stack: 'Total',
          // HBT data: {{{ jsonArray (map table.rows ' Sales') }}},
        },
        {
          name: 'Gross Sales',
          type: 'line',
          stack: 'Total',
          // HBT data: {{{ jsonArray (map table.rows 'Gross Sales') }}}
        }
    ]
  }`,
    "Stacked Area Chart": `{
    title: {
        text: 'Stacked Area Chart'
    },
    tooltip: {
        trigger: 'axis',
        axisPointer: {
            type: 'cross',
            label: {
                backgroundColor: '#6a7985'
            }
        }
    },
    legend: {
        // HBT data: {{{ jsonArray (map table.rows 'Country') }}}
    },
    toolbox: {
        feature: {
          saveAsImage: {}
        }
    },
    grid: {
        left: '3%',
        right: '4%',
        bottom: '3%',
        containLabel: true
    },
    xAxis: [
        {
            type: 'category',
            boundaryGap: false,
            // HBT data: {{{ jsonArray (map table.rows 'Country') }}}
        }
    ],
    yAxis: [
        {
            type: 'value'
        }
    ],
    series: [
        {
            name: 'Sales',
            type: 'line',
            stack: 'Total',
            areaStyle: {},
            emphasis: {
                focus: 'series'
            },
            // HBT data: {{{ jsonArray (map table.rows ' Sales') }}}
        },
        {
            name: 'Gross Sales',
            type: 'line',
            stack: 'Total',
            areaStyle: {},
            emphasis: {
                focus: 'series'
            },
            // HBT data: {{{ jsonArray (map table.rows 'Gross Sales') }}}
        }
    ]
  }`,
    "Basic Bar Chart": `{
    xAxis: {
        type: 'category',
        // HBT data: {{{ column 'Country' }}}
    },
    yAxis: {
       type: 'value'
    },
    series: [
        {
            name: ' Sales',
            // HBT data: {{{ column ' Sales' }}},
            type: 'bar'
        }
    ]
  }`,
    'Bar with Background': `{
    xAxis: {
        type: 'category',
        // HBT data: {{{ column 'Country' }}}
    },
    yAxis: {
        type: 'value'
    },
    series: [
        {
            name: ' Sales',
            // HBT data: {{{ column ' Sales' }}},
            type: 'bar',
            showBackground: true,
            backgroundStyle: {
                color: 'rgba(180, 180, 180, 0.2)'
            }
        }
    ]
  }`,
    'Axis Align with Tick': `{
    tooltip: {
        trigger: 'axis',
        axisPointer: {
            type: 'shadow'
        }
    },
    grid: {
        left: '3%',
        right: '4%',
        bottom: '3%',
        containLabel: true
    },
    xAxis: [
        {
            type: 'category',
            // HBT data: {{{ column 'Country' }}},
            axisTick: {
                alignWithLabel: true
            }
        }
    ],
    yAxis: [
        {
            type: 'value'
        }
    ],
    series: [
        {
            name: ' Sales',
            type: 'bar',
            barWidth: '60%',
            // HBT data: {{{ column ' Sales' }}},
        }
    ]
  }`,
    'Waterfall Chart': `{
    title: {
        text: 'Waterfall Chart',
    },
    tooltip: {
        trigger: 'axis',
        axisPointer: {
            type: 'shadow'
        }
    },
    grid: {
        left: '3%',
        right: '4%',
        bottom: '3%',
        containLabel: true
    },
    xAxis: {
        type: 'category',
        splitLine: { show: false },
        // HBT data: {{{ column 'Country' }}},
    },
    yAxis: {
        type: 'value'
    },
    series: [
        {
            name: ' Sales',
            type: 'bar',
            stack: 'Total',
            itemStyle: {
                borderColor: 'transparent',
                color: 'transparent'
            },
            emphasis: {
                itemStyle: {
                    borderColor: 'transparent',
                    color: 'transparent'
                }
            },
            // HBT data: {{{ column ' Sales' }}}
        },
        {
            name: 'Gross Sales',
            type: 'bar',
            stack: 'Total',
            label: {
                show: true,
                position: 'inside'
            },
            // HBT data: {{{ column 'Gross Sales' }}},
        }
    ]
  }`,
    'Bar Chart with Negative Value': `{
    title: {
        text: 'Bar Chart with Negative Value'
    },
    tooltip: {
        trigger: 'axis',
        axisPointer: {
            type: 'shadow'
        }
    },
    grid: {
        top: 80,
        bottom: 30
    },
    xAxis: {
        type: 'value',
        position: 'top',
        splitLine: {
            lineStyle: {
                type: 'dashed'
            }
        }
    },
    yAxis: {
        type: 'category',
        axisLine: { show: false },
        axisLabel: { show: false },
        axisTick: { show: false },
        splitLine: { show: false },
        // HBT data: {{{ column 'Country' }}},
    },
    series: [
        {
            name: ' Sales',
            type: 'bar',
            stack: 'Total',
            label: {
                show: true,
                formatter: '{b}'
            },
            data: [
                /* HBT
                {{#each table.rows}}
                  {
                    value: '{{#if @last}}-{{else}}{{/if}}{{{this.[ Sales]}}}',
                    label: 'right'
                  },
                {{/each}}
                */
            ]
        }
    ]
  }`,
    'Bar Label Rotation': `{
    tooltip: {
        trigger: 'axis',
        axisPointer: {
            type: 'shadow'
        }
    },
    legend: {
        // HBT data: {{{ column 'Country' }}},
    },
    toolbox: {
        show: true,
        orient: 'vertical',
        left: 'right',
        top: 'center',
        feature: {
            mark: { show: true },
            dataView: { show: true, readOnly: false },
            magicType: { show: true, type: ['line', 'bar', 'stack'] },
            restore: { show: true },
            saveAsImage: { show: true }
        }
    },
    xAxis: [
        {
            type: 'category',
            axisTick: { show: false },
            // HBT data: {{{ column 'Country' }}},
        }
    ],
    yAxis: [
        {
            type: 'value'
        }
    ],
    series: [
        {
            name: ' Sales',
            type: 'bar',
            barGap: 0,
            emphasis: {
               focus: 'series'
            },
            // HBT data: {{{ column ' Sales' }}},
        },
        {
            name: 'Gross Sales',
            type: 'bar',
            emphasis: {
                focus: 'series'
            },
            // HBT data: {{{ column 'Gross Sales' }}},
        },
    ]
  }`,
    'Stacked Horizontal Bar': `{
    tooltip: {
        trigger: 'axis',
        axisPointer: {
            // Use axis to trigger tooltip
            type: 'shadow' // 'shadow' as default; can also be 'line' or 'shadow'
        }
    },
    legend: {},
    grid: {
        left: '3%',
        right: '4%',
        bottom: '3%',
        containLabel: true
    },
    xAxis: {
        type: 'value'
    },
    yAxis: {
        type: 'category',
        // HBT data: {{{ column 'Country' }}},
    },
    series: [
        {
            name: ' Sales',
            type: 'bar',
            stack: 'total',
            label: {
                show: true
            },
            emphasis: {
                focus: 'series'
            },
            // HBT data: {{{ column ' Sales' }}},
        },
        {
            name: 'Gross Sales',
            type: 'bar',
            stack: 'total',
            label: {
                show: true
            },
            emphasis: {
                focus: 'series'
            },
            // HBT data: {{{ column 'Gross Sales' }}},
        },
    ]
  }`,
    'Stacked Bar Chart on Polar': `{
    angleAxis: {},
    radiusAxis: {
        type: 'category',
        // HBT data: {{{ column 'Country' }}},
        z: 10
    },
    polar: {},
    series: [
        {
            type: 'bar',
            // HBT data: {{{ column ' Sales' }}},
            coordinateSystem: 'polar',
            name: 'Sales',
            stack: 'a',
            emphasis: {
                focus: 'series'
            }
        },
        {
            type: 'bar',
            // HBT data: {{{ column 'Gross Sales' }}},
            coordinateSystem: 'polar',
            name: 'Gross Sales',
            stack: 'a',
            emphasis: {
                focus: 'series'
            }
        }
    ],
    legend: {
        show: true,
        // HBT data: {{{ column 'Country' }}},
    }
  }`,
    'Half Pie Chart': `{
    tooltip: {
        trigger: 'item'
    },
    legend: {
        top: '5%',
        left: 'center'
    },
    series: [
        {
            name: ' Sales',
            type: 'pie',
            radius: ['0%', '70%'],
            center: ['50%', '70%'],
            // adjust the start and end angle
            startAngle: 180,
            endAngle: 360,
            /* HBT
            data: [ 
            {{#each table.rows}}
              {  value: {{this.[ Sales]}}, name: '{{this.[Country]}}' },
            {{/each}}
            ]
            */ 
        }
    ]
  }`,
    'Doughnut Chart': `{
      tooltip: {
        trigger: 'item'
      },
      legend: {
        top: '5%',
        left: 'center'
      },
      series: [
          {
              name: ' Sales',
              type: 'pie',
              radius: ['40%', '70%'],
              center: ['50%', '50%'],
              avoidLabelOverlap: false,
              label: {
                show: false,
                position: 'center'
              },
              emphasis: {
                label: {
                  show: true,
                  fontSize: 40,
                  fontWeight: 'bold'
                }
              },
              labelLine: {
                show: false
              },
              /* HBT
              data: [ 
              {{#each table.rows}}
              {  value: {{this.[ Sales]}}, name: '{{this.[Country]}}' },
              {{/each}}
              ]
              */ 
          }
      ]
  }`,
    'Scatter': `{
    xAxis: {},
    yAxis: {},
    series: [
        {
            name: ' Sales and Gross Sales',
            symbolSize: 20,
            // HBT data: {{{ select ' Sales' 'Gross Sales' }}},
            type: 'scatter'
        }
    ]
  }`,
    'Clustering Process': `{
    dataset: [
        {
            transform: {
                type: 'ecStat:clustering',
                config: {
                    clusterCount: 6,
                    outputType: 'single',
                    outputClusterIndexDimension: 2
                }
            }
        }
    ],
    tooltip: {
        position: 'top'
    },
    visualMap: {
        type: 'piecewise',
        top: 'middle',
        min: 0,
        max: 6,
        left: 10,
        splitNumber: 6,
        dimension: 2,
        pieces: [
            /* HBT
              {{#each table.rows}}
              {
                value: i,
                label: 'cluster ' + i,
                color: COLOR_ALL[i]
              },
              {{/each}}
            */
        ]
    },
    grid: {
        left: 120
    },
    xAxis: {},
    yAxis: {},
    series: {
          name: ' Sales and Gross Sales',
          type: 'scatter',
          // HBT data: {{{ select ' Sales' 'Gross Sales' }}},
          symbolSize: 15,
          itemStyle: {
            borderColor: '#555'
          },
          datasetIndex: 1
      }
  }`,
    'Basic Candlestick': `{
    xAxis: {
        // HBT data: {{{ column 'Country' }}},
    },
    yAxis: {},
    series: [
        {
            name: ' Sales and Gross Sales',
            type: 'candlestick',
            // HBT data: {{{ select ' Sales' 'Gross Sales' }}},
        }
    ]
  }`,
    'Basic Radar Chart': `{
    title: {
        text: 'Basic Radar Chart'
    },
    legend: {
        data: ['Sales', 'Gross Sales']
    },
    radar: {
        // shape: 'circle',
        indicator: [
            /* HBT
              {{#each table.rows}}
              {
                max: 30000000,
                name: '{{this.[Country]}}'
              },
              {{/each}}
            */
        ]
    },
    series: [
        {
          name: 'Sales vs Gross Sales',
          type: 'radar',
          data: [
              {
                  // HBT value: {{{ column ' Sales' }}},
                  name: 'Sales'
              },
              {
                  // HBT value: {{{ column 'Gross Sales' }}},
                  name: 'Gross Sales'
              }
          ]
        }
    ]
  }`,
    'Half Doughnut Chart': `{
    tooltip: {
        trigger: 'item'
    },
    legend: {
        top: '5%',
        left: 'center'
    },
    series: [
        {
            name: ' Sales',
            type: 'pie',
            radius: ['40%', '70%'],
            center: ['50%', '70%'],
            // adjust the start and end angle
            startAngle: 180,
            endAngle: 360,
            /* HBT
            data: [ 
            {{#each table.rows}}
            {  value: {{this.[ Sales]}}, name: '{{this.[Country]}}' },
            {{/each}}
            ]
            */ 
        }
    ]
  }`,
    'AQI - Radar': `{
    backgroundColor: '#161627',
    title: {
        text: 'AQI - Radar',
        left: 'center',
        textStyle: {
            color: '#eee'
        }
    },
    legend: {
        bottom: 5,
        // HBT data: {{{ column 'Country' }}},
        itemGap: 20,
        textStyle: {
            color: '#fff',
            fontSize: 14
        },
        selectedMode: 'single'
    },
    radar: {
        indicator: [
            /* HBT
              {{#each table.rows}}
              {
                max: 14000000,
                name: '{{this.[Country]}}'
              },
              {{/each}}
            */
        ],
        shape: 'circle',
        splitNumber: 5,
        axisName: {
            color: 'rgb(238, 197, 102)'
        },
        splitLine: {
            lineStyle: {
                color: [
                    'rgba(238, 197, 102, 0.1)',
                    'rgba(238, 197, 102, 0.2)',
                    'rgba(238, 197, 102, 0.4)',
                    'rgba(238, 197, 102, 0.6)',
                    'rgba(238, 197, 102, 0.8)',
                    'rgba(238, 197, 102, 1)'
                ]
            }
        },
        splitArea: {
            show: false
        },
        axisLine: {
            lineStyle: {
                color: 'rgba(238, 197, 102, 0.5)'
            }
        }
    },
    series: [
      /* HBT
      {{#each table.rows}}
      {
          name: "{{this.[Country]}}",
          type: 'radar',
          lineStyle: {
              width: 1,
              opacity: 0.5
          },
          data: [],
          symbol: 'none',
          itemStyle: {
              color: "{{ useColor this.[Country] }}"
          },
          areaStyle: {
              opacity: 0.1
          }
      },
      {{/each}}
      */
    ]
  }`,
    'Basic Boxplot': {
        title: [
            {
                text: 'Michelson-Morley Experiment',
                left: 'center'
            },
            {
                text: 'upper: Q3 + 1.5 * IQR \nlower: Q1 - 1.5 * IQR',
                borderColor: '#999',
                borderWidth: 1,
                textStyle: {
                    fontWeight: 'normal',
                    fontSize: 14,
                    lineHeight: 20
                },
                left: '10%',
                top: '90%'
            }
        ],
        dataset: [
            {
                // prettier-ignore
                source: [
                    [850, 740, 900, 1070, 930, 850, 950, 980, 980, 880, 1000, 980, 930, 650, 760, 810, 1000, 1000, 960, 960],
                    [960, 940, 960, 940, 880, 800, 850, 880, 900, 840, 830, 790, 810, 880, 880, 830, 800, 790, 760, 800],
                    [880, 880, 880, 860, 720, 720, 620, 860, 970, 950, 880, 910, 850, 870, 840, 840, 850, 840, 840, 840],
                    [890, 810, 810, 820, 800, 770, 760, 740, 750, 760, 910, 920, 890, 860, 880, 720, 840, 850, 850, 780],
                    [890, 840, 780, 810, 760, 810, 790, 810, 820, 850, 870, 870, 810, 740, 810, 940, 950, 800, 810, 870]
                ]
            },
            {
                transform: {
                    type: 'boxplot',
                    config: { itemNameFormatter: 'expr {value}' }
                }
            },
            {
                fromDatasetIndex: 1,
                fromTransformResult: 1
            }
        ],
        tooltip: {
            trigger: 'item',
            axisPointer: {
                type: 'shadow'
            }
        },
        grid: {
            left: '10%',
            right: '10%',
            bottom: '15%'
        },
        xAxis: {
            type: 'category',
            boundaryGap: true,
            nameGap: 30,
            splitArea: {
                show: false
            },
            splitLine: {
                show: false
            }
        },
        yAxis: {
            type: 'value',
            name: 'km/s minus 299,000',
            splitArea: {
                show: true
            }
        },
        series: [
            {
                name: 'boxplot',
                type: 'boxplot',
                datasetIndex: 1
            },
            {
                name: 'outlier',
                type: 'scatter',
                datasetIndex: 2
            }
        ]
    },
    'Basic Heatmap': `{
    tooltip: {
        position: 'top'
    },
    grid: {
        height: '50%',
        top: '10%'
    },
    xAxis: {
        type: 'category',
        // HBT data: {{{ column 'Country' }}},
        splitArea: {
            show: true
        }
    },
    yAxis: {
        type: 'category',
        // HBT data: {{{ column 'Segment' }}},
        splitArea: {
            show: true
        }
    },
    visualMap: {
        min: 0,
        max: 10,
        calculable: true,
        orient: 'horizontal',
        left: 'center',
        bottom: '15%'
    },
    series: [
        {
            name: ' Sales',
            type: 'heatmap',
            // HBT data: {{{ column ' Sales' }}},
            label: {
                show: true
            },
            emphasis: {
                itemStyle: {
                    shadowBlur: 10,
                    shadowColor: 'rgba(0, 0, 0, 0.5)'
                }
            }
        }
    ]
  }`,
    'Basic Tree': {
        tooltip: {
            trigger: 'item',
            triggerOn: 'mousemove'
        },
        series: [
            {
                type: 'tree',
                data: [],
                top: '1%',
                left: '7%',
                bottom: '1%',
                right: '20%',
                symbolSize: 7,
                label: {
                    position: 'left',
                    verticalAlign: 'middle',
                    align: 'right',
                    fontSize: 9
                },
                leaves: {
                    label: {
                        position: 'right',
                        verticalAlign: 'middle',
                        align: 'left'
                    }
                },
                emphasis: {
                    focus: 'descendant'
                },
                expandAndCollapse: true,
                animationDuration: 550,
                animationDurationUpdate: 750
            }
        ]
    },
    'Basic Treemap': {
        title: {
            text: 'Disk Usage',
            left: 'center'
        },
        tooltip: {
            // formatter: function (info) {
            //   var value = info.value;
            //   var treePathInfo = info.treePathInfo;
            //   var treePath = [];
            //   for (var i = 1; i < treePathInfo.length; i++) {
            //     treePath.push(treePathInfo[i].name);
            //   }
            //   return [
            //     '<div class="tooltip-title">' +
            //       formatUtil.encodeHTML(treePath.join('/')) +
            //       '</div>',
            //     'Disk Usage: ' + formatUtil.addCommas(value) + ' KB'
            //   ].join('');
            // }
        },
        series: [
            {
                name: 'Disk Usage',
                type: 'treemap',
                visibleMin: 300,
                label: {
                    show: true,
                    formatter: '{b}'
                },
                itemStyle: {
                    borderColor: '#fff'
                },
                levels: [
                    {
                        itemStyle: {
                            borderWidth: 0,
                            gapWidth: 5
                        }
                    },
                    {
                        itemStyle: {
                            gapWidth: 1
                        }
                    },
                    {
                        colorSaturation: [0.35, 0.5],
                        itemStyle: {
                            gapWidth: 1,
                            borderColorSaturation: 0.6
                        }
                    }
                ],
                data: []
            }
        ]
    },
    'Basic Sunburst': {
        series: {
            type: 'sunburst',
            // emphasis: {
            //     focus: 'ancestor'
            // },
            data: [],
            radius: [0, '90%'],
            label: {
                rotate: 'radial'
            }
        }
    },
    'Basic Sankey': {
        series: {
            type: 'sankey',
            layout: 'none',
            emphasis: {
                focus: 'adjacency'
            },
            data: [
                {
                    name: 'a'
                },
                {
                    name: 'b'
                },
                {
                    name: 'a1'
                },
                {
                    name: 'a2'
                },
                {
                    name: 'b1'
                },
                {
                    name: 'c'
                }
            ],
            links: [
                {
                    source: 'a',
                    target: 'a1',
                    value: 5
                },
                {
                    source: 'a',
                    target: 'a2',
                    value: 3
                },
                {
                    source: 'b',
                    target: 'b1',
                    value: 8
                },
                {
                    source: 'a',
                    target: 'b1',
                    value: 3
                },
                {
                    source: 'b1',
                    target: 'a1',
                    value: 1
                },
                {
                    source: 'b1',
                    target: 'c',
                    value: 2
                }
            ]
        }
    },
    'Basic Funnel': {
        title: {
            text: 'Funnel'
        },
        tooltip: {
            trigger: 'item',
            formatter: '{a} <br/>{b} : {c}%'
        },
        toolbox: {
            feature: {
                dataView: { readOnly: false },
                restore: {},
                saveAsImage: {}
            }
        },
        legend: {
            data: ['Show', 'Click', 'Visit', 'Inquiry', 'Order']
        },
        series: [
            {
                name: 'Funnel',
                type: 'funnel',
                left: '10%',
                top: 60,
                bottom: 60,
                width: '80%',
                min: 0,
                max: 100,
                minSize: '0%',
                maxSize: '100%',
                sort: 'descending',
                gap: 2,
                label: {
                    show: true,
                    position: 'inside'
                },
                labelLine: {
                    length: 10,
                    lineStyle: {
                        width: 1,
                        type: 'solid'
                    }
                },
                itemStyle: {
                    borderColor: '#fff',
                    borderWidth: 1
                },
                emphasis: {
                    label: {
                        fontSize: 20
                    }
                },
                data: [
                    { value: 60, name: 'Visit' },
                    { value: 40, name: 'Inquiry' },
                    { value: 20, name: 'Order' },
                    { value: 80, name: 'Click' },
                    { value: 100, name: 'Show' }
                ]
            }
        ]
    },
    'Basic Gauge': {
        tooltip: {
            formatter: '{a} <br/>{b} : {c}%'
        },
        series: [
            {
                name: 'Pressure',
                type: 'gauge',
                detail: {
                    formatter: '{value}'
                },
                data: [
                    {
                        valuesrc: 'Sum of  Sales',
                        name: 'SCORE'
                    }
                ]
            }
        ]
    }
}