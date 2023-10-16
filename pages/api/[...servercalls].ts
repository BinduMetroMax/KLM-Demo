import axios, { AxiosError, AxiosInstance, AxiosResponse } from "axios";
import { NextApiRequest, NextApiResponse } from "next";




export default async function server_calls(req: NextApiRequest, res: NextApiResponse) {
    console.log(req,"REQUEST FROM SERVER");

    const axiosAPI: AxiosInstance = axios.create({
        baseURL: 'http://localhost:4001',
        headers: {
            Authorization: 'Bearer ' + "hello"
        }

        // other configuration options
    });

    let url: string = req?.url?.replace("/api", "")!


    const axios_instance = () => {
        switch (req.method) {
            case "POST":
                return axiosAPI.post(url, req.body)
            case "GET":
                return axiosAPI.get(url)
            case "PATCH":
                return axiosAPI.patch(url, req.body)
            case "DELETE":
                return axiosAPI.delete(url)
            default:
                return axiosAPI.get(url)
        }
    }


    await axios_instance().then((axiosRes: AxiosResponse) => {
        res.status(axiosRes?.status).json(axiosRes?.data)
    }).catch((err: AxiosError) => {
        res.status(err?.response?.status!).json(err?.response?.data!)
    })
}