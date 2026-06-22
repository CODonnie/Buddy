import axios from "axios";

export const api = axios.create({
    baseURL: "http://10.120.143.9:5000/api/v1"
})