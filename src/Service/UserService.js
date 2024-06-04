import axios from '../Service/axios';


const fetchAlluser = (page) => {
    return axios.get(`api/users?page=${page}`);


}
const postCreateUser = (name, job) => {
    return axios.post("/api/users", { name, job })
}
const putUpdateUser = (name, job) => {
    return axios.put("/api/users/2", { name, job })
}
const loginApi = async (email, password) => {

    // return axios.post("/api/login", { email, password })
    try {
        const response = await axios.post("/api/login", {
            email: email,
            password: password,
        });
        return response.data;
    } catch (error) {
        if (error.response) {
            // Return the response in case of error from server
            return error.response;
        } else {
            // Handle unexpected errors
            console.error("API error:", error);
            throw error;
        }
    }
};

export { fetchAlluser, postCreateUser, putUpdateUser, loginApi };