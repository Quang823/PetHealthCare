import axios from "axios";

const instance = axios.create({
    baseURL: 'https://reqres.in/',
});

// Add a response interceptor
instance.interceptors.response.use(
    function (response) {
        // Any status code that lies within the range of 2xx causes this function to trigger
        // Do something with response data
        return response.data;
    },
    function (error) {
        let res = {};
        if (error.response) {
            // The request was made and the server responded with a status code
            // that falls out of the range of 2xx
            res.data = error.response.data;
            res.status = error.response.status;
            res.headers = error.response.headers;
        } else if (error.request) {
            // The request was made but no response was received
            // `error.request` is an instance of XMLHttpRequest in the browser 
            // and an instance of http.ClientRequest in node.js
            res.message = "No response received from server.";
        } else {
            // Something happened in setting up the request that triggered an Error
            res.message = error.message;
        }
        return Promise.reject(res);
    }
);

export default instance;
