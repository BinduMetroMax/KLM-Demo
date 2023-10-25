import axios, { AxiosInstance } from "axios";
import { NextApiRequest, NextApiResponse } from "next";
import parseCookie from "utils/cookieParser";
import jwt_decode from "jwt-decode";




const backendApiBaseUrl = "http://localhost:4005";
let access_token: string;
let refresh_token: string;

const apiAxiosInstance: AxiosInstance = axios.create({
    baseURL: backendApiBaseUrl,
    // withCredentials: true,
    headers: {
        Authorization: "",
    },
});


const getUpdatedAccesstoken = async (refreshToken: string) => {

    let isRefreshTokenExpired = true;

    if (isRefreshTokenExpired) {
        const { exp }: any = jwt_decode(refreshToken);
        isRefreshTokenExpired = Math.floor(Date.now() / 1000) > exp;
        console.log(isRefreshTokenExpired);

    } else {
        const response = await apiAxiosInstance.get("/admin/auth/refresh-token", {
            headers: {
                Authorization: "Bearer " + refresh_token,
            },
        });

        console.log(response.headers);
    }
};

export default async function server_calls(
    req: NextApiRequest,
    res: NextApiResponse
) {
    console.log(req);

    const tokenFromCookie = parseCookie(req.headers.cookie);

    console.log(tokenFromCookie);

    access_token = tokenFromCookie.access_token;
    refresh_token = tokenFromCookie.refresh_token;

    console.log(access_token);
    console.log(refresh_token);

    try {
        let isAccessTokenExpired = true;

        const url: string = req.url!.replace("/api", "");

        if (access_token) {

            const { exp }: any = jwt_decode(access_token);
            isAccessTokenExpired = Math.floor(Date.now() / 1000) > exp;
            console.log(isAccessTokenExpired);
        }

        if (req.url !== "/admin/auth/login") {

            if (isAccessTokenExpired) {
                apiAxiosInstance.defaults.headers["Authorization"] = `Bearer ${getUpdatedAccesstoken(refresh_token)}`;
            } else {
                apiAxiosInstance.defaults.headers["Authorization"] = `Bearer ${access_token}`;
            }

        }

        const axiosResponse = await apiAxiosInstance.request({
            url,
            method: req.method,
            data: req.body,
        });

        console.log(axiosResponse.data);

        if (axiosResponse.headers["set-cookie"]) {
            res.setHeader("Set-Cookie", axiosResponse.headers["set-cookie"]);
        }

        res.status(axiosResponse.status).json(axiosResponse.data);

    } catch (error: any) {

        res.status(error.response?.status).json(error.response?.data);
    }
}
