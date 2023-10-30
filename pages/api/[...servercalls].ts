import axios, { AxiosInstance, AxiosResponse } from "axios";
import { NextApiRequest, NextApiResponse } from "next";
import { parseCookie, parseTokens } from "utils/cookieParser";


const backendApiBaseUrl = "http://localhost:4005";
let access_token: string;
let refresh_token: string;

const axiosApiInstance: AxiosInstance = axios.create({
    baseURL: backendApiBaseUrl,
});


export default async function server_calls(
    req: NextApiRequest,
    res: NextApiResponse
) {


    const tokenFromCookie = parseCookie(req.headers.cookie);

    access_token = tokenFromCookie.access_token;
    refresh_token = tokenFromCookie.refresh_token;

    const openApiEndPoints = [
        "/api/admin/auth/login", "/api/admin/auth/validate"
    ]

    try {

        const url: string = req.url!.replace("/api", "");


        if (access_token) {

            axiosApiInstance.defaults.headers["Authorization"] = `Bearer ${access_token}`;

            const axiosResponse = await axiosApiInstance.request({
                // ...req,
                url,
                method: req.method,
                data: req.body,
            });
            if (axiosResponse.headers["set-cookie"]) {
                res.setHeader("Set-Cookie", axiosResponse.headers["set-cookie"]);
            }

            res.status(axiosResponse.status).json(axiosResponse.data);


        } else if (!openApiEndPoints.includes(req.url || "")) {

            let updatedAccessToken: string | undefined = "";

            axiosApiInstance.defaults.headers["Authorization"] = `Bearer ${refresh_token}`;

            await axiosApiInstance.post("/admin/auth/refresh-token").then(async (refresh_res: AxiosResponse) => {

                updatedAccessToken = parseTokens(refresh_res.headers["set-cookie"])?.access_token

                if (refresh_res.headers["set-cookie"]) {
                    res.setHeader("Set-Cookie", refresh_res.headers["set-cookie"]);
                }


                axiosApiInstance.defaults.headers["Authorization"] = `Bearer ${updatedAccessToken}`;

                const axiosResponse = await axiosApiInstance.request({
                    url,
                    method: req.method,
                    data: req.body,
                });


                res.status(axiosResponse.status).json(axiosResponse.data);

            }).catch((error: any) => {

                res.status(error.response?.status).json(error.response?.data);
            })

        } else {
            const axiosResponse = await axiosApiInstance.request({
                url,
                method: req.method,
                data: req.body,
            });
            if (axiosResponse.headers["set-cookie"]) {
                res.setHeader("Set-Cookie", axiosResponse.headers["set-cookie"]);
            }

            res.status(axiosResponse.status).json(axiosResponse.data);
        }

    } catch (error: any) {

        res.status(error.response?.status).json(error.response?.data);
    }
}
