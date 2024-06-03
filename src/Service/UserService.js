import axios from 'axios';


const fetchAlluser = (page) => {
    return axios.get(`api/users?page=${page}`);


}
const postCreateUser = (name, job) => {
    return axios.post("/api/users", { name, job })
}
const putUpdateUser = (name, job) => {
    return axios.put("/api/users/2", { name, job })
}
const loginApi = (email, password) => {
    return axios.post("/api/login", { email, password })
}
export { fetchAlluser, postCreateUser, putUpdateUser, loginApi };