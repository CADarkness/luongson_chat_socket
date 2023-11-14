const { BEARER } = require('./constants');
const { default: axios } = require('axios');

axios.defaults.baseURL = process.env.API_URL  ?? `http://localhost:5555/api`;

axios.defaults.headers.post["Content-Type"] = "application/json";

axios.interceptors.request.use(
  function (config) {
    return config;
  },
  function (error) {
    //save error log here
    console.log("Request error: " + error);
    return Promise.reject(error);
  }
);

axios.interceptors.response.use(
  function (response) {
    return response.data ? response.data : response;
  },
  function (error) {
    console.log("Response error: " + error);
    return Promise.reject(error);
  }
);

const setAuthorization = (token) => {
  axios.defaults.headers.common["Authorization"] =
    BEARER + token.replace(/"/g, "");
};

class AxiosClient {
  get = async (url, config) => {
    return axios.get(url, { ...config });
  };

  post = (url, data, config) => {
    return axios.post(url, data, { ...config });
  };

  put = (url, data, config) => {
    return axios.put(url, data, { ...config });
  };

  delete = (url, config) => {
    return axios.delete(url, { ...config });
  };
}

// exports.setAuthorization = setAuthorization
module.exports = {
  AxiosClient,
  setAuthorization
}
