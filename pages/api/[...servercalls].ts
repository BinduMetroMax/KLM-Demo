import axios, { AxiosInstance, AxiosResponse } from "axios";
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

    const { exp }: any = jwt_decode(refreshToken);

    const isRefreshTokenExpired = Math.floor(Date.now() / 1000) > exp;

    // console.log(isRefreshTokenExpired);

    apiAxiosInstance.post("/api/admin/auth/refresh-token", {
        headers: {
            Authorization: "Bearer " + refresh_token,
        },
    });

};

export default async function server_calls(
    req: NextApiRequest,
    res: NextApiResponse
) {
    // console.log(req);

    const tokenFromCookie = parseCookie(req.headers.cookie);

    console.log(tokenFromCookie);

    access_token = tokenFromCookie.access_token;
    refresh_token = tokenFromCookie.refresh_token;

    console.log(access_token);
    console.log(refresh_token);

    try {

        const url: string = req.url!.replace("/api", "");



        if (access_token) {
            // console.log("ONLY ACCESS TOKEN");
            apiAxiosInstance.defaults.headers["Authorization"] = `Bearer ${access_token}`;

            const axiosResponse = await apiAxiosInstance.request({
                url,
                method: req.method,
                data: req.body,
            });

            if (axiosResponse.headers["set-cookie"]) {
                res.setHeader("Set-Cookie", axiosResponse.headers["set-cookie"]);
            }

            res.status(axiosResponse.status).json(axiosResponse.data);

        } else {
            console.log("ONLY REFRESH ");
            // apiAxiosInstance.defaults.headers["Authorization"] = `Bearer ${getUpdatedAccesstoken(refresh_token)}`;

            await apiAxiosInstance.post("/api/admin/auth/refresh-token").then((refresh_res: AxiosResponse) => {
                refresh_res.headers

                if (refresh_res.headers["set-cookie"]) {
                    res.setHeader("Set-Cookie", refresh_res.headers["set-cookie"]);
                }

            })

        }



        // console.log(axiosResponse.data);



    } catch (error: any) {

        res.status(error.response?.status).json(error.response?.data);
    }
}
