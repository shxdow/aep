import axios from 'axios';
import cookies from 'js-cookie';

axios.defaults.withCredentials = true;

const url = (endpoint) => `${global.SERVER_ADDRESS}${endpoint}`;

const addCookieToHeaders = (overrides = {}) => ({
  ...overrides,
  headers: {
    'x-csrftoken': cookies.get('csrftoken'),
    ...(overrides.headers || {}),
  },
});

export const post = async (endpoint, data, opts = {}) => {
  const result = await axios.post(url(endpoint), data, addCookieToHeaders(opts));
  return result;
};
post.noCookies = async (endpoint, data, opts = {}) => axios.post(url(endpoint), data, opts);

export const put = async (endpoint, data, opts = {}) => {
  const result = await axios.put(url(endpoint), data, addCookieToHeaders(opts));
  return result;
};
put.noCookies = async (endpoint, data, opts = {}) => axios.post(url(endpoint), data, opts);

export const get = async (endpoint, opts = {}) => axios.get(url(endpoint), opts);
