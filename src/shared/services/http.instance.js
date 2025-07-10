import axios from "axios";
import {authenticationInterceptor} from "@/iam/services/authentication.interceptor.js";

const baseApiUrl = import.meta.env.VITE_BASE_API_URL

const httpInstance = axios.create({
    baseURL: baseApiUrl,
    headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' },
});

// Add a request interceptor
httpInstance.interceptors.request.use(authenticationInterceptor);

export default httpInstance;
