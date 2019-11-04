import request from '@/utils/request';

// 获取所有配置组以及组的子节点
export function queryConfig(token, cfgName = '') {
  return request({
    url: '/v1/cusConfig/queryConfig',
    method: 'get',
    headers: {
      token
    },
    params: {
      cfgName
    }
  });
}

// 保存当前配置
export function saveGroupConfig(cfgParentId, cfgName) {
  return request({
    url: '/v1/cusConfig/addConfig',
    method: 'post',
    params: {
      cfgName,
      cfgParentId
    }
  });
}

// 根据当前配置的 id 查询配置项数据
export function queryByConfigId(configId) {
  return request({
    url: '/v1/cusConfig/queryByConfigId',
    method: 'get',
    params: {
      configId
    }
  });
}

// 查询组的信息
export function getSelectParent() {
  return request({
    url: '/v1/cusConfig/selectParent',
    method: 'get'
  });
}

export function saveInfo(arr) {
  return request({
    url: '/v1/cusFunctionInfo/saveInfo',
    method: 'post',
    data: arr
  });
}

// 查询数据源id /v1/cusDataSource/selectByDataSource
export function selectByDataSource(cdsChartId, cdsSystemId, cdsOdbcType) {
  return request({
    url: '/v1/cusDataSource/selectByDataSource',
    method: 'get',
    params: {
      cdsChartId,
      cdsSystemId,
      cdsOdbcType
    }
  });
}

export function updateStauts(cfgId, cfgStatus, cusFunctionInfos) {
  return request({
    url: '/v1/cusConfig/updateStatus',
    method: 'put',
    data: {
      cfgId,
      cfgStatus,
      cusFunctionInfos
    }
  });
}

// 删除组
export function deleteConfig(id, token) {
  return request({
    url: '/v1/cusConfig/deleteConfig',
    method: 'delete',
    header: {
      token
    },
    params: {
      id
    }
  });
}

export function isExistSameName(token, cfiName){
  return request({
    url: '/v1/cusConfig/deleteConfig',
    method: 'get',
    header: {
      token
    },
    params: {
      cfiName
    }
  });
}
