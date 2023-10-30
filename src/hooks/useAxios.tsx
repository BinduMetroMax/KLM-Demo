import axios, { AxiosError, AxiosResponse } from "axios";

let Axios = axios.create({
    baseURL: "/api",
    withCredentials:false,
});

export const useAxios = () => {
    // Add a request interceptor
    Axios.interceptors.request.use(
        (config) => {
            // Do something before the request is sent
            return config;
        },
        (error: AxiosError) => {
            // Do something with the request error
            // console.log(error);

            return Promise.reject(error);
        }
    );

    // Add a response interceptor
    Axios.interceptors.response.use(
        (response: AxiosResponse) => {
            // Any status code that lies within the range of 2xx causes this function to trigger
            // Do something with the response data
            // console.log(response);
            return response;
        },
        (error: AxiosError) => {
            // Any status codes that fall outside the range of 2xx cause this function to trigger
            // Do something with the response error
            // console.log(error);
            return Promise.reject(error);
        }
    );

    return Axios;
};


