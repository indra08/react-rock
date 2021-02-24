import axios from 'axios';
import RepoUtil from '../helper/RepoUtil';

const Api = axios.create({
  baseURL: 'http://gmedia.bz/gereja/api/',
  headers: {
    Accept: 'application/json',
    'Content-Type': 'application/json',
    'Auth-Key': 'gmedia_church',
    'Client-Service': 'front_end_client',
  },
});

// Intercept all requests
Api.interceptors.request.use(
  async (request) => {
    const session = await RepoUtil.GetAsObject('@session');

    //console.log(session);

    if (session != null) {
      request.headers.common['User-id'] = session.id_jemaat;
      request.headers.common['Token'] = session.token;
    }

    if (request.data) {
      console.log('request ', JSON.stringify(request.data));
    } else {
      console.log('request no data');
    }
    return request;
  },
  (error) => Promise.reject(error),
);
// Intercept all responses
Api.interceptors.response.use(
  async (response) => {
    console.log('response', response.data);
    return response;
  },
  (error) => {
    let result = {
      status: 'E',
      message: `Error : ${JSON.stringify(error.response)}`,
    };
    // alert(error);
    console.log(error);
    if (error == 'Error: Network Error') {
      result = {
        status: 'E',
        message: 'Error : Cek Koneksi Anda.',
      };
    } else if (error.response.status) {
      switch (error.response.status) {
        case 401:
          result = {
            status: 'E',
            message: 'Error : Not Login or Token Expired.',
          };
          break;
        default:
          result = {status: 'E', message: 'Whoops, Something Bad happen. :)'};
          break;
      }
    }

    return Promise.reject(result);
  },
);

export default Api;
