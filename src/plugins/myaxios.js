import axios from 'axios';

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
    return response;
  }, function(error) {
    return Promise.reject(error);
  });
  // 设置Vue实例的属性
  Vue.prototype.$http = instance;
};

export default myaxios;
