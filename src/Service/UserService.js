import axios from '../Service/axios';


const fetchAllpet = (page) => {
    return axios.get(`api/users?page=${page}`);


}
const postCreatePet = (name, job) => {
    return axios.post("/api/users", { name, job })
}
const putUpdatePet = (name, job) => {
    return axios.put("/api/users/2", { name, job })
}



const putUpdateUser = (userID, name, email, password, phone, address) => {
    return axios.put(`http://localhost:8080/account/getaccount/${userID}`, { name, email, password, phone, address })
}
const loginApi = (email, password) => {


    return axios.post("auth/login", { email, password })

}
const UserInforApi = (userID, name, email, password, phone, address) => {
    return axios.get(`http://localhost:8080/account/getaccount/${userID}`, { userID, name, email, password, phone, address })

}
const ResetAccPassword = (email, password) => {
    return axios.put("account/reset-password", { email, password })
}

const getOTP = (email) => {
    return axios.put("account/forgot-password", { email })
}
const VerifyOtp = (email, otp) => {
    return axios.put("account/verify-otp", { email, otp })
}

export { fetchAllpet, postCreatePet, putUpdatePet, loginApi, UserInforApi, putUpdateUser, ResetAccPassword, getOTP, VerifyOtp };