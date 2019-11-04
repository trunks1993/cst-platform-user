import React, { useEffect } from 'react';
import ReactEcharts from 'echarts-for-react';
import { getBarChart, getLineChart, getPieChart, getVisualMap, getGauge, getProgress6, getProgress7 } from '@/utils/echarts';
import { getFunnelEcharts } from '@/utils/echarts/FUNNEL_ECHARTS';
import { DOM_TYPE_BAR, DOM_TYPE_LINE, DOM_TYPE_PIE, DOM_TYPE_VIS, DOM_TYPE_GAUGE, DOM_TYPE_PRO6, DOM_TYPE_PRO7 } from '@/utils/const';
import { applySingleEchartsInfo } from '@/api/index';
import { Icon } from 'antd';
import TypeProgress from '@/components/TypeProgress';
import _ from 'lodash';
import { DOM_TYPE_FUNNEL } from '../../utils/const';

const types = {
  [DOM_TYPE_BAR]: getBarChart,
  [DOM_TYPE_LINE]: getLineChart,
  [DOM_TYPE_PIE]: getPieChart,
  [DOM_TYPE_VIS]: getVisualMap,
  [DOM_TYPE_GAUGE]: getGauge,
  [DOM_TYPE_PRO6]: getProgress6,
  [DOM_TYPE_PRO7]: getProgress7,
  [DOM_TYPE_FUNNEL]: getFunnelEcharts,
};

// eslint-disable-next-line complexity
export default ({ data, index, optionList = [], formInfo, setFormInfo, isCs = true, isHome }) => {
  let optionSet = [];
  optionSet = data.cdsOdbcValue ? JSON.parse(data.cdsOdbcValue) : [];
  const handleIsUpdate = (UpdateHz, id) => {
    if (UpdateHz && id) {
      setInterval(() => {
        applySingleEchartsInfo(id).then(res => {
          optionSet = res.data;
        });
      }, +UpdateHz * 1000);
    }
  };
  const option = isCs ? types[data.cfiType || 3](optionSet) : types[data.cfiType || 3](optionSet);

  const component = data.cfiType > DOM_TYPE_GAUGE ? (
    <TypeProgress type={data.cfiType}
      data={optionList.length ? optionList : optionSet} />
  ) : (<ReactEcharts
    option={option}
    notMerge
    lazyUpdate
    style={{ width: '100%',height: '100%',paddingTop: '30px' }}
  />);
  useEffect(() => {
    !isCs && handleIsUpdate(data.cfiUpdateHz, data.cfiId || data.cfiConfigId);
  });
  return (
    <>
      <img className="bg-icon" src={require('@/assets/images/temp/1.png')} alt="" />
      <img className="bg-icon" src={require('@/assets/images/temp/1.png')} alt="" />
      <img className="bg-icon" src={require('@/assets/images/temp/1.png')} alt="" />
      <img className="bg-icon" src={require('@/assets/images/temp/1.png')} alt="" />
      <img className="bg-icon" src={require('@/assets/images/temp/2.png')} alt="" />
      <img className="bg-icon" src={require('@/assets/images/temp/2.png')} alt="" />
      {/* <Icon type="close" style={{ position: 'absolute',right: 0, top: 0, color: '#fff', zIndex: '999' }} onClick={() => {
        let _idx;
        formInfo.map((e,i) => {
          if (JSON.parse(e.cfiLayout).i === index) {
            _idx = i;
          }
        });
        formInfo.splice(_idx,1);
        setFormInfo(_.clone(formInfo));
      }} /> */}
      <img className="bg-close" style={{ display: isHome ? 'none' : 'block' }} src={require('@/assets/images/temp/bg-close.png')} alt="" onClick={e => {
        let _idx;
        formInfo.map((e,i) => {
          if (JSON.parse(e.cfiLayout).i === index) {
            _idx = i;
          }
        });
        formInfo.splice(_idx,1);
        setFormInfo(_.clone(formInfo));
      }} />
      { data.cfiType === DOM_TYPE_GAUGE && <img className="bg-eGauge" src={require('@/assets/images/temp/bg-img.png')} alt="" /> }
      <div className="title-box">{ data.cfiName }</div>
      {component}
    </>
  );
};
