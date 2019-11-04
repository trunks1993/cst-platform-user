import React, { useState, useEffect } from 'react';
import PanelTitle from '@/components/PanelTitle';
import { selectByDataSource, isExistSameName } from '@/api/cs_api';
import { tempArr } from '@/config';
import { Select, Radio, Message } from 'antd';
import { DOM_TYPE_BAR } from '@/utils/const';
import _ from 'lodash';
import { getToken } from '../../utils/auth';
const { Option } = Select;

// eslint-disable-next-line complexity
const PropertyPanel = ({ visible, formInfo, selectId, setFormInfo, setDsIdOptions, dsIdOptions }) => {
  // const TYPE = tempData.type;
  // 点击面板标题进行收缩
  const dom1 = document.getElementsByClassName('expand-active');

  // 展开属性面板
  const [expandPropPanel, setExpandPropPanel] = useState(false);

  // 展开应用套件
  const [expandAppConfigPanel, setExpandAppConfigPanel] = useState(false);

  // 名称
  const [cfiName, setCfiName] = useState('');

  // 图表类型绑定
  const [cfiType, setCfiType] = useState(DOM_TYPE_BAR);

  // 更新
  const [cfiIsUpdate, setCfiIsUpdate] = useState(1);

  // 数据源类型
  const [cdsOdbcType, setCdsOdbcType] = useState('1');

  // 数据源id
  const [cfiDatasourceId, setCfiDatasourceId] = useState('0');

  // 修改时间
  const [cfiUpdateHz, setCfiUpdateHz] = useState('');
  // 数据源绑定
  // const [cusDataSource, setCusDataSource] = useState({ cdsOdbcType: 1, cdsOdbcValue: [], cdsRemark: '' });

  // 事件
  const [cfiEvent, setCfiEvent] = useState({ glass: 1, filter: 1, export: 1, detail: 1 });

  useEffect(() => {
    const o = formInfo.find(v => JSON.parse(v.cfiLayout).i === selectId);
    if (o) {
      setCfiType(o.cfiType);
      setCfiEvent(JSON.parse(o.cfiEvent));
      setCfiName(o.cfiName);
      setCfiIsUpdate(o.cfiIsUpdate);
      setCfiDatasourceId(o.cfiDatasourceId);
      selectByDataSource(o.cfiType, '1', cdsOdbcType).then(res => {
        setDsIdOptions(res.data);
      });
      console.log(o);
      setCfiUpdateHz(o.cfiUpdateHz ? o.cfiUpdateHz : '');
    }
  }, [cdsOdbcType, formInfo, selectId, setDsIdOptions]);
  const _debounce = (fn, wait) => {
    let timer = null;
    return function() {
      const context = this;
      const args = arguments;
      if (timer) {
        clearTimeout(timer);
        timer = null;
      }
      timer = setTimeout(() => {
        fn.apply(context, args);
      }, wait);
    };
  };
  return (
    <div className="property-panel" style={{ transform: `translate(${ visible ? 0 : '300px'})`, padding: visible ? '40px 0 8px 0' : '40px 6px 8px 6px' }}>
      <div className="panel-box">
        <div className="property-container" style={{ maxHeight: expandPropPanel ? '40px' : '1000px' }}>
          <PanelTitle label="属性面板" onTitleClick={() => {
            dom1[0].style.paddingTop = !expandPropPanel ? 0 : '8px';
            setTimeout(() => {
              setExpandPropPanel(!expandPropPanel);
            }, 50);
          }} />

          <div className="property-content expand-active">
            <span className="property-content-btn">功能名</span>
            <input value={cfiName } disabled={!selectId} onChange={e => {
              setCfiName(e.target.value);
              const t = _.clone(formInfo);
              const item = t.find(v => JSON.parse(v.cfiLayout).i === selectId);
              item.cfiName = e.target.value;
              setFormInfo(t);
            }} />
          </div>

          <div className="property-content">
            <span className="property-content-btn">图表类型</span>
            <span className="property-content-disable">{_.find(tempArr, v => v.cfiType === cfiType).name}</span>
          </div>

          <div className="property-content">
            <span className="property-content-btn">数据更新</span>
            <Select className="select" disabled={!selectId} value={cfiIsUpdate} onChange={e => {
              const t = _.clone(formInfo);
              const item = t.find(v => JSON.parse(v.cfiLayout).i === selectId);
              item.cfiIsUpdate = e;
              setFormInfo(t);
            }}>
              <Option value={1}>不更新</Option>
              <Option value={2}>定时更新</Option>
            </Select>
          </div>
          <div className="property-content" style={{ display: cfiIsUpdate === 2 ? 'flex' : 'none' }}>
            <span className="property-content-btn">更新时间</span>
            {/* <Input addonAfter="秒" defaultValue="mysite" /> */}
            {/* <DatePicker style={{ width: '138px' }} value={moment(cfiUpdateHz, 'YYYY-MM-DD')} onChange={(date, dateString) => {
              console.log(dateString);
              setCfiUpdateHz(dateString);
              const t = _.clone(formInfo);
              const item = t.find(v => JSON.parse(v.cfiLayout).i === selectId);
              console.log(item);
              item.cfiUpdateHz = dateString;
              setFormInfo(t);
            }} /> */}
            <input value={cfiUpdateHz} style={{ width: 'calc(100% - 90px)' }} disabled={!selectId} onChange={e => {
              if (isNaN(e.target.value)) {
                Message.warning('请输入正确的格式');
                setCfiUpdateHz('');
              } else if (e.target.value <= 0){
                Message.warning('请输入大于0的正整数');
                setCfiUpdateHz('');
              } else {
                setCfiUpdateHz(+e.target.value);
                const t = _.clone(formInfo);
                const item = t.find(v => JSON.parse(v.cfiLayout).i === selectId);
                item.cfiUpdateHz = +e.target.value;
                setFormInfo(t);
              }
            }} /> <span style={{ marginLeft: '10px' }}>秒</span>
          </div>
          <div className="property-content">
            <span className="property-content-btn">数据源</span>
            <Select className="select" disabled={!selectId} value={cdsOdbcType} onChange={e => {
              setCdsOdbcType(e);
            }}>
              <Option value={'1'}>自定义</Option>
              <Option value={'2'}>URL</Option>
              <Option value={'3'}>SQL</Option>
            </Select>
          </div>

          <div className="property-content">
            <span className="property-content-btn">数据绑定</span>
            <Select className="select" disabled={!selectId} value={cfiDatasourceId} onChange={e => {
              const t = _.clone(formInfo);
              const item = t.find(v => JSON.parse(v.cfiLayout).i === selectId);
              item.cfiDatasourceId = e;
              setFormInfo(t);
              setCfiDatasourceId(e);
            }}>
              <Option value={'0'}>选择绑定数据</Option>
              {
                _.map(dsIdOptions, v => (
                  <Option key={v.cdsOdbcId} value={v.cdsOdbcId}>{v.cdsRemark}</Option>
                ))
              }
            </Select>
          </div>
        </div>

        <img
          className="img-line"
          src={require('../../assets/images/l-panel.png')}
          alt=""
        />

        <div className="property-container" style={{ maxHeight: expandAppConfigPanel ? '40px' : '1000px' }}>
          <PanelTitle label="应用套件" onTitleClick={() => {
            console.log(dom1);
            dom1[1].style.marginTop = !expandAppConfigPanel ? 0 : '8px';
            setTimeout(() => {
              setExpandAppConfigPanel(!expandAppConfigPanel);
            }, 50);
          }} />

          <div className="application-config expand-active">
            <span className="radio-title">放大</span>
            <Radio.Group disabled={!selectId} onChange={e => {
              const d = _.assign({}, cfiEvent, { glass: e.target.value });
              setCfiEvent(d);
              const item = formInfo.find(v => JSON.parse(v.cfiLayout).i === selectId);
              item.cfiEvent = JSON.stringify(d);
              setFormInfo(formInfo);
            }} value={cfiEvent.glass} >
              <Radio className="radio-style" value={1}>启用</Radio>
              <Radio className="radio-style" value={2}>禁用</Radio>
            </Radio.Group>
          </div>

          <div className="application-config">
            <span className="radio-title">过滤</span>
            <Radio.Group disabled={!selectId} onChange={e => {
              const d = _.assign({}, cfiEvent, { filter: e.target.value });
              setCfiEvent(d);

              const item = formInfo.find(v => JSON.parse(v.cfiLayout).i === selectId);
              item.cfiEvent = JSON.stringify(d);
              setFormInfo(formInfo);
            }} value={cfiEvent.filter}>
              <Radio className="radio-style" value={1}>启用</Radio>
              <Radio className="radio-style" value={2}>禁用</Radio>
            </Radio.Group>
          </div>

          <div className="application-config">
            <span className="radio-title">导出</span>
            <Radio.Group disabled={!selectId} onChange={e => {
              const d = _.assign({}, cfiEvent, { export: e.target.value });
              setCfiEvent(d);

              const item = formInfo.find(v => JSON.parse(v.cfiLayout).i === selectId);
              item.cfiEvent = JSON.stringify(d);
              setFormInfo(formInfo);
            }} value={cfiEvent.export}>
              <Radio className="radio-style" value={1} >启用</Radio>
              <Radio className="radio-style" value={2}>禁用</Radio>
            </Radio.Group>
          </div>

          <div className="application-config">
            <span className="radio-title">明细</span>
            <Radio.Group disabled={!selectId} onChange={e => {
              const d = _.assign({}, cfiEvent, { detail: e.target.value });
              const item = formInfo.find(v => JSON.parse(v.cfiLayout).i === selectId);
              item.cfiEvent = JSON.stringify(d);
              setFormInfo(formInfo);
              setCfiEvent(d);
            }} value={cfiEvent.detail}>
              <Radio className="radio-style" value={1}>启用</Radio>
              <Radio className="radio-style" value={2}>禁用</Radio>
            </Radio.Group>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PropertyPanel;
