import axios from "axios";

export const api = axios.create({
    baseURL: "http://10.220.184.9:5000/api/v1",
})