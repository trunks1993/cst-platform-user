import Cookies from 'js-cookie';

const isCs = (process.env.REACT_APP_ENV === 'cs');

const TokenKey = isCs ? 'CSTOKEN' : 'USERTOKEN';

export const getToken = () => Cookies.get(TokenKey);

export const setToken = token => Cookies.set(TokenKey, token);

export const removeToken = () => Cookies.remove(TokenKey);
