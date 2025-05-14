import axios from "axios";

const baseApiUrl = import.meta.env.VITE_BASE_API_URL

const httpInstance = axios.create({
    baseURL: baseApiUrl,
    headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' },
});

export default httpInstance;