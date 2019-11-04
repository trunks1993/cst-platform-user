import { login, getUserByToken } from '@/api/index';

import { setToken, removeToken } from '@/utils/auth';
import { Message } from 'antd';
// action types
export const types = {
  START_FETCH: 'user/START_FETCH',
  SET_ERROR: 'user/SET_ERROR',
  RECEIVE_DATA: 'user/RECEIVE_DATA',
  RECEIVE_TOKEN: 'user/RECEIVE_TOKEN'
};

// action creators
export const actions = {
  startFetch: () => ({ type: types.START_FETCH }),
  setError: error => ({ type: types.SET_ERROR, payload: error }),
  setUser: user => ({ type: types.RECEIVE_DATA, user }),
  setToken: token => ({ type: types.RECEIVE_TOKEN, token }),
  loginByUsername: (username, password) => dispatch => {
    // 首次 dispatch：更新应用的 state 来通知API 请求发起了
    dispatch(actions.startFetch());
    // 异步请求后端接口
    return login(username, password).then(
      res => {
        if (res.code !== '0') {
          Message.error(res.msg);
          dispatch(actions.setError(res.msg));
          return ;
        }
        setToken(res.data.token);
        return dispatch(actions.setToken(res.data.token));
      },
      error => dispatch(actions.setError(error))
    );
  },
  getUser: token => dispatch => {
    // 首次 dispatch：更新应用的 state 来通知API 请求发起了
    dispatch(actions.startFetch());
    // 异步请求后端接口
    return getUserByToken(token).then(
      res => dispatch(actions.setUser(res.data)),
      error => dispatch(actions.setError(error))
    );
  },
  loginOut: () => dispatch => {
    removeToken();
    return dispatch(actions.setUser({}));
  }
};

// 初始化state
const initialState = {
  isFetching: false,
  token: '',
  user: {},
  error: null,
};

// reducer
// eslint-disable-next-line complexity
export default function reducer(state = initialState, action) {
  switch (action.type) {
    case types.RECEIVE_DATA:
      return { ...state, isFetching: false, user: action.user };
    case types.START_FETCH:
      return { ...state, isFetching: true };
    case types.SET_ERROR:
      return { ...state, error: action.payload, isFetching: false };
    case types.RECEIVE_TOKEN:
      return { ...state, isFetching: false, token: action.token };
    default: return state;
  }
}
