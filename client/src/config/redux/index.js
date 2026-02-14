import axios from "axios";

export const BASE_URL = "https://collaborative-notes-cx4x.vercel.app";

const clientServer = axios.create({
    baseURL: BASE_URL,
});

export default clientServer;
