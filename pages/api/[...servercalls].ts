import axios, { AxiosError, AxiosInstance, AxiosResponse } from "axios";
import { NextApiRequest, NextApiResponse } from "next";
import { parseCookie, parseTokens } from "utils/cookieParser";

const backendApiBaseUrl = "http://localhost:4005";
// const backendApiBaseUrl = "https://dev-api.lmd.innowyze.in";

const axiosApiInstance: AxiosInstance = axios.create({
    baseURL: backendApiBaseUrl,
});

export default async function server_calls(
    req: NextApiRequest,
    res: NextApiResponse
) {
    const tokenFromCookie = parseCookie(req.headers.cookie);

    const { access_token, refresh_token } = tokenFromCookie;

    const openApiEndPoints = ["/api/admin/auth/login", "/api/admin/auth/validate"]

    // Function to send request and handle response
    const sendRequest = async (token: string) => {

        axiosApiInstance.defaults.headers["Authorization"] = `Bearer ${token}`;

        const axiosResponse = await axiosApiInstance.request({
            ...req,
            url: req.url!.replace("/api", ""),
            method: req.method,
            data: req.body,
        });

        // Set cookie if present in the response header
        if (axiosResponse.headers["set-cookie"]) {
            res.setHeader("Set-Cookie", axiosResponse.headers["set-cookie"]);
        }

        res.status(axiosResponse.status).json(axiosResponse.data);
    };

    try {

        if (access_token) {

            await sendRequest(access_token);

        } else if (refresh_token && !openApiEndPoints.includes(req.url || "")) {

            const refresh_res: AxiosResponse = await axiosApiInstance.post("/admin/auth/refresh-token", null, {
                headers: { "Authorization": `Bearer ${refresh_token}` }
            });

            if (refresh_res.headers["set-cookie"]) {
                res.setHeader("Set-Cookie", refresh_res.headers["set-cookie"]);
            }

            const updatedAccessToken = parseTokens(refresh_res.headers["set-cookie"])?.access_token;

            if (updatedAccessToken) {
                await sendRequest(updatedAccessToken);
            } else {
                throw new Error("Failed to refresh access token");
            }
        } else {
            await sendRequest("");
        }
    } catch (error: any) {

        res.status(error.response?.status || 500).json(error.response?.data || 'Internal Server Error');
    }
}
