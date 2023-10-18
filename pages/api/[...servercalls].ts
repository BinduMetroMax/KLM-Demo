import axios, { AxiosInstance } from "axios";
import { NextApiRequest, NextApiResponse } from "next";
import parseCookie from "utils/cookieParser";

const backendApiBaseUrl = "https://dev-api.lmd.innowyze.in";
let access_token: string;
let refresh_token: string;

const apiWithAuth: AxiosInstance = axios.create({
    baseURL: backendApiBaseUrl,
    withCredentials: true,
    headers: {
        Authorization: "",
    },
});

async function refreshAccessToken(refreshToken: string) {
    await axios.post("/auth/refresh", {
        refresh_token: refreshToken,
    });
    apiWithAuth.defaults.headers['Authorization'] = `Bearer ${access_token}`;
}

export default async function server_calls(req: NextApiRequest, res: NextApiResponse) {

    const tokenFromCookie = parseCookie(req.headers.cookie);

    access_token = tokenFromCookie.access_token
    refresh_token = tokenFromCookie.refresh_token

    try {
        const url: string = req.url!.replace("/api", "");

        apiWithAuth.defaults.headers['Authorization'] = `Bearer ${access_token}`;

        const axiosResponse = await apiWithAuth.request({
            url,
            method: req.method,
            data: req.body,
        });

        if (axiosResponse.headers["set-cookie"]) {
            res.setHeader("Set-Cookie", axiosResponse.headers["set-cookie"]);
        }

        res.status(axiosResponse.status).json(axiosResponse.data);

    } catch (err: any) {
        if (err.response?.status === 401) {
            try {
                await refreshAccessToken(refresh_token);
                const response = await apiWithAuth.request(err.config);
                res.status(response.status).json(response.data);
            } catch (refreshError) {
                res.status(401).json("Access token and refresh token are invalid.");
            }
        } else {
            res
                .status(err.response?.status || 500)
                .json(err.response?.data || "An error occurred");
        }
    }
}
