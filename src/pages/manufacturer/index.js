import React, { useState, useContext, useRef } from 'react';
import Grid from './Grid';
import Panel from './Panel';
import TagViews from '@/components/TagViews/test';
import PropertyPanel from './PropertyPanel';
import { UserContext } from '@/utils/contexts';

import { Select,Icon } from 'antd';
import { showConfirm } from '@/utils';

// API
import { saveGroupConfig, getSelectParent, queryByConfigId, deleteConfig, saveInfo, updateStauts } from '@/api/cs_api';
import _ from 'lodash';

import { Modal, Form, Input, Message } from 'antd';
import { getToken } from '../../utils/auth';
// const { Option } = AutoComplete;
const formItemLayout = {
  labelCol: {
    xs: { span: 24 },
    sm: { span: 8 },
  },
  wrapperCol: {
    xs: { span: 24 },
    sm: { span: 12 },
  },
};

const operates = [
  {
    key: 'build',
    label: '新建分组',
    iconType: 'plus',
    callback: function(fn, state) {
      fn(!state);
    }
  },
  {
    key: 'build',
    label: '新建配置',
    iconType: 'folder-add',
    callback: function(fn, state) {
      fn(!state);
    }
  },
  {
    key: 'save',
    label: '保存',
    iconType: 'file-protect',
    callback: function(fn) {
      fn();
    }
  },
  {
    key: 'delete',
    label: '删除',
    iconType: 'delete',
    callback: function(a) {
      console.log('删除啊', a);
    }
  },
  {
    key: 'reset',
    label: '重置',
    iconType: 'redo',
    callback: function() {
      console.log('重置啊');
    }
  },
  {
    key: 'publish',
    label: '发布',
    iconType: 'cloud-upload',
    callback: function() {
      console.log('发布啊');
    }
  }
];

export default () => {
  const [tempData, setTempData] = useState({});
  const [newModelVisible, handleNewModelVisible] = useState(false);

  const [newGroupVisible, handleNewGroupVisible] = useState(false);

  // 选择组
  const [groupId, setGroupId] = useState('');
  // 新建配置
  const [cfgName, setCfgName] = useState('');

  // 新建组
  // const [groupName, setGroupName] = useState('');

  const [formInfo, setFormInfo] = useState([]);// layouts
  const [selectId, setSelectId] = useState('');// layouts选中Id

  const [selectTag, setSelectTag] = useState({});// tags选中Id

  const [groupParents, setGroupParents] = useState([]);

  const [tags, setTags] = useState([]);

  // 数据源option
  const [dsIdOptions, setDsIdOptions] = useState([]);

  const childRef = useRef();


  const handleSave = () => {
    // const isNum = (typeof +groupId === 'number' && !isNaN(+groupId));
    // const id = isNum ? groupId : '';
    saveGroupConfig(groupId, cfgName).then(res => {
      Message.success('保存成功');
      childRef.current.fqueryConfig();
      handleNewModelVisible(false);
    });
  };

  const handleSaveGroup = () => {
    // const isNum = (typeof +groupId === 'number' && !isNaN(+groupId));
    // const id = isNum ? groupId : '';
    saveGroupConfig('', cfgName).then(res => {
      Message.success('保存成功');
      childRef.current.fqueryConfig();
      handleNewGroupVisible(false);
    });
  };

  const openNewModel = () => {
    handleNewModelVisible(!newModelVisible);
    getSelectParent().then(res => {
      setGroupParents(res.data);
    });
  };

  const openNewGroupModel = () => {
    handleNewGroupVisible(!newGroupVisible);
  };

  const user = useContext(UserContext);
  return (
    <div className="dashboard-container">
      <div className="dashboard-container-header">
        <div className="dashboard-container-header-title">
          <span className="label">个性化工作台</span>
          <img
            src={require('../../assets/images/bg-dashboard-headerl.png')}
            alt=""
          />
        </div>
        <div className="dashboard-container-header-btn">
          <img
            src={require('../../assets/images/bg-dashboard-header.png')}
            alt=""
          />
          <ul>
            {
              // eslint-disable-next-line complexity
              operates.map((item, idx) => <li key={idx} className="btn-item" onClick={(e) => {
                switch (e.target.innerText) {
                  case '新建分组':
                    // item.callback(handleShowModel, showModel);
                    openNewGroupModel();
                    break;
                  case '新建配置':
                    // item.callback(handleShowModel, showModel);
                    openNewModel();
                    break;
                  // eslint-disable-next-line no-duplicate-case
                  case '保存':
                    // 选择标签 模块不能为空
                    if (!selectTag.cfgId || formInfo.length === 0) return Message.error('系统未找到可用模板');
                    // 名字不能为空
                    let o = _.find(formInfo, v => _.trim(v.cfiName) === '');
                    if (o !== undefined) {
                      Message.error('功能名不能为空');
                      return setSelectId(JSON.parse(o.cfiLayout).i);
                    }

                    // 数据源未绑定
                    o = _.find(formInfo, v => v.cfiDatasourceId === '0');
                    if (o !== undefined) {
                      Message.error('请绑定数据');
                      return setSelectId(JSON.parse(o.cfiLayout).i);
                    }
                    saveInfo(formInfo).then(res => {
                      childRef.current.fqueryConfig();
                      Message.success(res.msg);
                    });
                    break;
                  case '删除':
                    if (!selectTag.cfgId) return Message.error('请选择要删除的配置');
                    showConfirm(function() {
                      deleteConfig(selectTag.cfgId,getToken()).then(res => {
                        if (res.code === '0') {
                          Message.success(res.msg);
                          childRef.current.fqueryConfig();
                          setTags(tags.filter(ele => {
                            return ele.cfgId !== selectTag.cfgId;
                          }));
                          setFormInfo([]);
                          setSelectTag({});
                        } else {
                          Message.error(res.msg);
                        }
                      }).catch(err => {
                        Message.error(err.msg);
                      });
                    }, () => setFormInfo(temp), '请问是否删除当前模块?');
                    break;
                  case '重置':
                    if (!selectTag.cfgId) return Message.error('请选择要重置的配置');
                    const temp = _.clone(formInfo);
                    setFormInfo([]);
                    showConfirm(function() {
                      queryByConfigId(selectTag.cfgId).then(res => {
                        if (res.data.length) setSelectId(JSON.parse(res.data[0].cfiLayout).i);
                        setFormInfo(res.data);
                      });
                    }, () => setFormInfo(temp), '请问是否重置当前配置?');
                    break;
                  case '发布':
                    if (!selectTag.cfgId || formInfo.length === 0) return Message.error('系统未找到可用模板');
                    updateStauts(selectTag.cfgId, 3, formInfo).then(res => {
                      if (res.code === '0') {
                        Message.success(res.msg);
                        childRef.current.fqueryConfig();
                      } else {
                        Message.error(res.msg);
                      }
                    });
                    break;
                  default:
                    return '';
                }
              }}> <Icon type={item.iconType} /> {item.label}</li>)
            }
          </ul>
        </div>
      </div>
      <div className="dashboard-container-body">
        <div className="dashboard-container-body-panel">
          {/* <div className="droppable-element" draggable unselectable="on" /> */}
          <Panel setTags={setTags} tags={tags}
            setSelectTag={setSelectTag} cRef={childRef} selectTag={selectTag} setSelectId={setSelectId} setTempData={setTempData} setFormInfo={setFormInfo} />
        </div>
        <div
          className="dashboard-container-body-content"
          style={{ position: 'relative' }}
        >
          <Modal centered visible={newModelVisible} footer={null}>
            <Form {...formItemLayout}>
              <Form.Item label="选择加组：">
                <Select
                  style={{ width: 200 }}
                  placeholder="请选择组名"
                  optionFilterProp="children"
                  onChange={e => setGroupId(e)}
                  value={groupId}
                >
                  {
                    groupParents.map(item => <Select.Option key={item.cfgId} value={item.cfgId}>{item.cfgName}</Select.Option>)
                  }
                </Select>
              </Form.Item>
              <Form.Item label="配置名">
                <Input
                  style={{ width: 200 }}
                  onChange={e => setCfgName(e.target.value)}
                  placeholder="请填写配置名"
                />
              </Form.Item>
              <Form.Item>
                <button className="global-btn" onClick={() => handleSave()}>确定</button>
                <button className="global-btn" onClick={() => { handleNewModelVisible(false); }}>取消</button>
              </Form.Item>
            </Form>
          </Modal>

          <Modal centered visible={newGroupVisible} footer={null}>
            <Form {...formItemLayout}>
              <Form.Item label="分组名">
                <Input
                  style={{ width: 200 }}
                  onChange={e => setCfgName(e.target.value)}
                  placeholder="请填写分组名"
                />
              </Form.Item>
              <Form.Item style={{ marginTop: '86px' }}>
                <button className="global-btn" onClick={() => handleSaveGroup()}>确定</button>
                <button className="global-btn" onClick={() => handleNewGroupVisible(false)}>取消</button>
              </Form.Item>
            </Form>
          </Modal>
          <TagViews tags={tags} setSelectId={setSelectId} setFormInfo={setFormInfo} setTags={setTags} selectTag={selectTag} setSelectTag={setSelectTag} />
          <Grid tempData={tempData} selectTag={selectTag} dsIdOptions={dsIdOptions} setSelectId={setSelectId} selectId={selectId} formInfo={formInfo} setFormInfo={setFormInfo} />
          <PropertyPanel selectId={selectId} dsIdOptions={dsIdOptions} setDsIdOptions={setDsIdOptions} setFormInfo={setFormInfo} formInfo={formInfo} visible />
        </div>
      </div>
    </div>
  );
};
