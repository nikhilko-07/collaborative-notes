import axios from "axios";

export const BASE_URL = "http://localhost:9000/api";

const clientServer = axios.create({
    baseURL: BASE_URL,
});

export default clientServer;