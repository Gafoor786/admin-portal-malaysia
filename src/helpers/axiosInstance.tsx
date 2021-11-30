/* eslint-disable import/no-anonymous-default-export */
import axios, { AxiosRequestConfig } from "axios";
// import { ACCESS_DENIED } from "@constants/actionTypes";
// import { useHistory } from "react-router-dom";
import { StatusCodes } from "@utilities/apis";
import { Get } from "@utilities/storage";
import { StorageKeys } from "@data/constants";

const enableJWTUsingCookie = false;

const httpClient = (history: any) => {
  // const baseURL = process.env.REACT_APP_BACKEND_URL;
  // const history = useHistory();


  let headers: any = {};

  if (!enableJWTUsingCookie) {
    // headers.Authorization = `Bearer ${localStorage.token}`;
    headers.Authorization = `${Get(StorageKeys.TOKEN)}`;
  }

  // headers["Access-Control-Allow-Credentials"] = true;
  // headers["Access-Control-Allow-Origin"] = '*'
  // headers["Access-Control-Allow-Origin"] = 'https://dev.dfk2rrzsjbwio.amplifyapp.com/'

  // headers = {
  //   ...headers,
  //   "Access-Control-Allow-Origin": "*"
  // }
  // if (isFormData) {
  //   headers["Content-Type"] = "multipart/form-data";

  // }



  // Bind selected server
  //headers["X-SERVER-WIMX"] = `${localStorage["X-SERVER-WIMX"]}`;

  const axiosInstance = axios.create({
    //baseURL: baseURL,
    headers,
    withCredentials: enableJWTUsingCookie // working with API auto origin
  });

  // axiosInstance.defaults.withCredentials = true;

  axiosInstance.interceptors.response.use((response) => {
    return response;
  }, (error) => {
    // Do something with response error
    console.error(error)
    if (error.response.status === StatusCodes.UnAuthorized) {
      console.log('Got unauthorized')
      // const temp = Get<AuthState>(StorageKeys.PERSISTED_STATE);
      // Save(StorageKeys.PERSISTED_STATE, {
      //   ...temp,
      //   authenticated: false
      // });
      // // auth.logout();
      // history.replace('/login');
    }
    else if (error.response.status === StatusCodes.BadRequest) {
      console.log('Got bad req')
      //auth.logout();
      // history.replace('/login');
    }
    return Promise.reject(error.response);
  });

  // const post = async (history: any, url: string, params: any) => {
  //   return await httpClient(history).post(url, params).then(res => {
  //     return Promise.resolve(res);
  //   })
  //     .catch(error => {
  //       return Promise.reject(error);
  //     })
  // }

  return axiosInstance;
};


export const post = async (history: any, url: string, params: any, config?: AxiosRequestConfig) => {

  return await httpClient(history).post(url, params, {
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded' // 'application/json'
    },

    ...config,
  }).then(res => {

    return Promise.resolve(res);
  })
    .catch(error => {
      if (error.status === StatusCodes.BadRequest) {
        // const erMsg = error.data as ErrorResponse;
        //Toast.show(erMsg.ErrorMessage, 'short', "bottom").subscribe()
      }

      return Promise.reject(error);
    })
}

export const get = async (history: any, url: string, config?: AxiosRequestConfig) => {

  return await httpClient(history).get(url, {
    headers: {
      'Content-Type': 'application/json'
    },

    ...config,
  }).then(res => {

    return Promise.resolve(res);
  })
    .catch(error => {
      if (error.status === StatusCodes.BadRequest) {
        // const erMsg = error.data as ErrorResponse;
        //Toast.show(erMsg.ErrorMessage, 'short', "bottom").subscribe()
      }

      return Promise.reject(error);
    })
}

export const put = async (history: any, url: string, params: any, config?: AxiosRequestConfig) => {

  return await httpClient(history).put(url, params, {
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded' // 'application/json'
    },

    ...config,
  }).then(res => {

    return Promise.resolve(res);
  })
    .catch(error => {
      if (error.status === StatusCodes.BadRequest) {
        // const erMsg = error.data as ErrorResponse;
        //Toast.show(erMsg.ErrorMessage, 'short', "bottom").subscribe()
      }

      return Promise.reject(error);
    })
}
