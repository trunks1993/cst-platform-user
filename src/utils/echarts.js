import Echarts from 'echarts';
import _ from 'lodash';

export function getBarChart(optionSet = []) {
  let optionData = [],xAxisData = [], seriesData1 = [], seriesData2 = [],maxYAxis = 0;
  if (optionSet.length) {
    optionData = optionSet.map(i => {
      return i.label;
    });
    xAxisData = optionSet[0].data.map(e => {
      return e.key;
    });
    seriesData1 = optionSet[0].data.map(e => {
      return +e.value;
    });
    seriesData2 = optionSet[1].data.map(e => {
      return +e.value;
    });
    maxYAxis = Math.max.apply(Math, seriesData1.concat(seriesData2));
  }

  const option = {
    tooltip: {
      trigger: 'axis',
    },
    grid: {
      left: '12%',
      right: '7%'
    },
    legend: {
      right: '6%',
      top: '10%',
      itemWidth: 8,
      itemHeight: 8,
      itemGap: 30,
      icon: 'rectangle',
      textStyle: {
        color: '#fff'
      },
      data: optionData,
    },
    xAxis: [
      {
        type: 'category',
        data: xAxisData,
        axisLabel: {
          textStyle: {
            color: '#FFFFFF',
          },
        },
        axisLine: {
          lineStyle: {
            color: '#054792', // X轴及其文字颜色
            width: 0.5
          }
        },
        axisTick: {
          show: false
        },
        splitLine: {
          show: true,
          lineStyle: {
            color: '#054792',
            width: 0.5
          }
        }
      }
    ],
    yAxis: [
      {
        type: 'value',
        name: '',
        min: 0,
        max: maxYAxis,
        interval: 10,
        axisLabel: {
          textStyle: {
            color: '#FFFFFF',
          },
        },
        axisLine: {
          lineStyle: {
            color: '#054792', // Y轴及其文字颜色
            width: 0.5
          }
        },
        axisTick: {
          show: false
        },
        splitLine: { // 分割线颜色修改
          lineStyle: {
            color: '#054792',
            width: 0.5
          }
        }
      }
    ],
    series: [
      {
        name: optionData[0],
        type: 'bar',
        data: seriesData1,
        barWidth: 12, // 柱子宽度
        itemStyle: {
          emphasis: {
            barBorderRadius: 30
          },
          normal: {
            barBorderRadius: [10, 10, 10, 10],
          }
        },
        color: {
          type: 'linear',
          x: 0,
          y: 0,
          x2: 0,
          y2: 1,
          colorStops: [{
            offset: 0,
            color: '#00FFED'
          },{
            offset: 1,
            color: '#0082EA'
          }],
        }
      },
      {
        name: optionData[1],
        type: 'bar',
        data: seriesData2,
        barWidth: 12, // 柱子宽度
        itemStyle: {
          emphasis: {
            barBorderRadius: 30
          },
          normal: {
            barBorderRadius: [10, 10, 10, 10],
          }
        },
        color: {
          type: 'linear',
          x: 0,
          y: 0,
          x2: 0,
          y2: 1,
          colorStops: [{
            offset: 0,
            color: '#91C50F'
          },{
            offset: 1,
            color: '#F4CB48'
          }],
        }
      }
    ]
  };
  return option;
}

export function getLineChart(optionSet = []) {
  let optionData = [], seriesData1 = [], seriesData2 = [],maxYAxis = 0;
  if (optionSet.length) {
    optionData = optionSet.map(i => {
      return i.label;
    });
    seriesData1 = optionSet[0].data.map(e => {
      return +e.value;
    });
    seriesData2 = optionSet[1].data.map(e => {
      return +e.value;
    });
    maxYAxis = Math.max.apply(Math, seriesData1.concat(seriesData2));
  }
  // option
  const option = {
    // color: ['#D53A35'],
    tooltip: {
      trigger: 'axis',
      formatter: function(params) {
        const date = new Date();
        const year = date.getFullYear();
        const month = date.getMonth() + 1;
        const day = date.getDate();
        return ` ${year}-${month}-${day} <br> 在监警力: ${params[0].value}人`;
      }
    },
    grid: {
      left: '12%',
      right: '7%'
    },
    legend: {
      right: '6%',
      top: '10%',
      itemWidth: 8,
      itemHeight: 8,
      itemGap: 30,
      icon: 'rectangle',
      textStyle: {
        color: '#fff'
      },
      data: optionData,
    },
    // grid: {
    //   left: '3%',
    //   right: '4%',
    //   bottom: '3%',
    //   containLabel: true
    // },
    xAxis: {
      type: 'category',
      name: '',
      boundaryGap: false,
      axisLabel: {
        textStyle: {
          color: '#FFFFFF',
        },
      },
      axisLine: {
        lineStyle: {
          color: '#054792', // X轴及其文字颜色
          width: 0.5
        }
      },
      axisTick: {
        show: false
      },
      splitLine: {
        show: true,
        lineStyle: {
          color: '#054792',
          width: 0.5
        }
      },
      data: []
    },
    yAxis: {
      type: 'value',
      name: '',
      min: 0,
      max: maxYAxis,
      interval: 10,
      axisLabel: {
        textStyle: {
          color: '#FFFFFF',
        },
      },
      axisTick: {
        show: false
      },
      axisLine: {
        lineStyle: {
          color: '#054792', // Y轴及其文字颜色
          width: 0.5
        }
      },
      splitLine: { // 分割线颜色修改
        lineStyle: {
          color: '#054792',
          width: 0.5
        }
      }
    },
    series: [{
      name: optionData[0],
      type: 'line',
      // symbol: 'circle',
      smooth: true,
      symbolSize: 5,
      sampling: 'average',
      itemStyle: {
        normal: {
          color: '#91C50F'
        }
      },
      data: seriesData1
    },{
      name: optionData[1],
      type: 'line',
      // symbol: 'circle',
      smooth: true,
      symbolSize: 5,
      sampling: 'average',
      itemStyle: {
        normal: {
          color: '#00BBF4'
        }
      },
      areaStyle: {
        color: {
          type: 'linear',
          x: 0,
          y: 0,
          x2: 0,
          y2: 1,
          colorStops: [{
            offset: 0,
            color: 'rgba(0,195,255,1)'
          },{
            offset: 1,
            color: 'rgba(0,195,255,0)'
          }],
        }
      },
      data: seriesData2
    }
    ]
  };
  return option;
}

export function getPieChart(optionSet = []) {

  // eslint-disable-next-line array-callback-return
  const legendArr = optionSet.map((e,i) => {
    const x = i % 2 === 0 ? '55%' : '75%';
    return {
      orient: 'vertical',
      icon: 'circle',
      x: x,
      y: 20 + parseInt(i / 2) * 15 + '%', // 0 1 => 20,2 3 => 35, 4 5 => 50, 6 7 => 65
      align: 'left',
      itemWidth: 10,
      itemHeight: 10,
      data: [e.name],
      textStyle: {
        fontSize: 12,
        color: '#fff'
      }
    };
  });
  const option = {
    color: ['#00FFFF', '#556FB5', '#FACD89', '#0068B7', '#F29B76', '#22AC38', '#AA89BD', '#004986'],
    tooltip: {
      trigger: 'item',
      formatter: '<br/>{b} : {c} ({d}%)'
    },
    legend: legendArr,
    calculable: true,
    series: [
      {
        name: '半径模式',
        type: 'pie',
        radius: [20, 90],
        center: ['32%', '50%'],
        roseType: 'radius',
        label: {
          normal: {
            show: false
          },
          emphasis: {
            show: true
          }
        },
        lableLine: {
          normal: {
            show: false
          },
          emphasis: {
            show: true
          }
        },
        data: optionSet
      }
    ]
  };
  return option;
}

export function getVisualMap(optionSet = []) {
  const ary = _.flattenDepth(_.map(optionSet, item => {
    const o = item.data;
    const pary = [];
    pary.push(_.map(o, v => {
      const ary = _.map(_.keys(v), k => v[k]);
      return ary;
    }));
    return pary;
  }), 1);

  console.log(ary);
  const legendData = optionSet.map(e => {
    return e.label;
  });
  const colorArr = ['#F86AC8','#F3BA0B','#75D385'];
  const seriesData = ary.map((e, i) => {
    console.log(e);
    return {
      name: optionSet[i].label,
      data: e,
      type: 'scatter',
      label: {
        emphasis: {
          show: true,
          formatter: function(param) {
            return '设备报警类别：\n'
            + param.data[i + 1];
          },
          position: 'top'
        }
      },
      itemStyle: {
        normal: {
          shadowBlur: 10,
          shadowColor: 'rgba(120, 36, 50, 0.5)',
          shadowOffsetY: 5,
          color: colorArr[i]
        }
      }
    };
  });
  const option = {
    grid: {
      left: '12%',
      right: '7%'
    },
    legend: {
      data: legendData,
      right: '6%',
      top: '10%',
      itemWidth: 8,
      itemHeight: 8,
      itemGap: 30,
      icon: 'rectangle',
      textStyle: {
        color: '#fff'
      }
    },
    xAxis: {
      type: 'value',
      name: '',
      axisLabel: {
        textStyle: {
          color: '#FFFFFF',
        },
      },
      axisLine: {
        lineStyle: {
          color: '#054792', // Y轴及其文字颜色
          fontSize: 12,
          width: 0.5
        }
      },
      axisTick: {
        show: false
      },
      splitLine: { // 分割线颜色修改
        lineStyle: {
          color: '#054792',
          width: 0.5
        }
      }
    },
    yAxis: {
      type: 'value',
      name: '',
      axisLabel: {
        textStyle: {
          color: '#FFFFFF',
        },
      },
      axisTick: {
        show: false
      },
      axisLine: {
        lineStyle: {
          color: '#054792', // Y轴及其文字颜色
          fontSize: 12,
          width: 0.5
        }
      },
      splitLine: { // 分割线颜色修改
        lineStyle: {
          color: '#054792',
          width: 0.5
        }
      }
    },
    visualMap: {
      show: false,
      max: 100,
      inRange: {
        symbolSize: [1, 10]
      }
    },
    series: seriesData
  };
  return option;
}

export function getGauge(optionSet = 0){
  console.log(optionSet);
  const option = {
    title: {
      text: '安全指数',
      left: 'center', // 标题位置
      bottom: '35%',
      textStyle: {
        color: '#fff',
        fontSize: 10
      }
    },
    // backgroundColor: '#1b1b1b',
    tooltip: {
      formatter: '{a} <br/>{c} {b}'
    },
    series: [
      {
        name: '安全指数',
        type: 'gauge',
        min: 0,
        max: 100,
        splitNumber: 10,
        radius: '50%',
        center: ['49.5%', '48%'],
        axisLine: {// 坐标轴线
          lineStyle: {// 属性lineStyle控制线条样式
            color: [[1,new Echarts.graphic.LinearGradient(0, 0, 1, 0, [
              {
                offset: 0.1,
                color: '#08C7FB'
              },
              {
                offset: 0.4,
                color: '#00FF2A'
              },
              {
                offset: 0.7,
                color: '#FFCD05'
              },{
                offset: 1,
                color: '#FF2400'
              }
            ])]],
            width: 8,
            // shadowColor : '#fff', //默认透明
            shadowBlur: 10
          }
        },
        axisLabel: { // 坐标轴小标记
          textStyle: {// 属性lineStyle控制线条样式
            // fontWeight: 'bolder',
            color: '#fff',
            // shadowColor: '#fff', // 默认透明
            shadowBlur: 10
          }
        },
        axisTick: {// 坐标轴小标记
          length: 15, // 属性length控制线长
          lineStyle: {// 属性lineStyle控制线条样式
            color: 'auto',
            // shadowColor: '#fff', // 默认透明
            shadowBlur: 10
          }
        },
        splitLine: {// 分隔线
          length: 20,// 属性length控制线长
          lineStyle: {// 属性lineStyle（详见lineStyle）控制线条样式
            width: 1,
            color: '#08C7FB',
            // shadowColor: '#fff', // 默认透明
            shadowBlur: 10
          }
        },
        pointer: {// 分隔线
          // shadowColor: '#fff',// 默认透明
          shadowBlur: 5
        },
        detail: {
          width: 40,
          height: 22,
          rich: {

          },
          backgroundColor: [[1,new Echarts.graphic.LinearGradient(0, 0, 1, 0, [
            {
              offset: 0.1,
              color: '#08C7FB'
            },
            {
              offset: 0.4,
              color: '#00FF2A'
            },
            {
              offset: 0.7,
              color: '#FFCD05'
            },{
              offset: 1,
              color: '#FF2400'
            }
          ])]],
          borderWidth: 1,
          borderColor: '#07A6FF',
          fontSize: 12,
          color: '#fff',
          offsetCenter: [0, '50%'], // x, y，单位px
          formatter: '{value}%'
        },
        data: [ { value: optionSet } ]
      }
    ]
  };
  return option;
}

export function getProgress6(optionSet = []){
  console.log(optionSet);
};
export function getProgress7(optionSet = []){
  console.log(optionSet);
};
