import axios from "axios";

export const api = axios.create({
    baseURL: "http://10.176.19.9:5000/api/v1",
})