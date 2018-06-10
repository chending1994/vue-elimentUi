import axios from 'axios';

import { Message } from 'element-ui';
const myaxios = {};
myaxios.install = function (Vue) {
  const instance = axios.create({
    baseURL: 'http://localhost:8888/api/private/v1/',
    timeout: 3000
    // headers: {'X-Custom-Header': 'foobar'}
  });
  // 设置axios的拦截器
  instance.interceptors.request.use(function(config) {
    if (config.url.toLocaleLowerCase() !== 'login') {
      const token = sessionStorage.getItem('token');
      config.headers.Authorization = token;
    }
    return config;
  }, function(error) {
    return Promise.reject(error);
  });

  instance.interceptors.response.use(function(response) {
    // 当获取到服务器的响应后，并且再提交给请求动作之前
    const { data: { meta: { status, msg } } } = response;
    // 针对不同错误码，可以做出不同的提示
    if (status !== 200 && status !== 201) {
      Message.error(msg);
    }
    return response;
  }, function(error) {
    return Promise.reject(error);
  });
  // 设置Vue实例的属性
  Vue.prototype.$http = instance;
};

export default myaxios;
