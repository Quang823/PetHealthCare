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
const loginApi = (email, password) => {
<<<<<<< HEAD

    return axios.post("/api/login", { email, password })
=======
    
    return axios.post("/auth/login", { email, password })
>>>>>>> master
}
export { fetchAlluser, postCreateUser, putUpdateUser, loginApi };