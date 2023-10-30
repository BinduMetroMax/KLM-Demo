import axios from 'axios';
import React, { useState } from 'react';
import { useAxios } from 'src/hooks/useAxios';

function App() {
    const [mobile, setMobile] = useState<string>("8050692348");
    const [otp, setOtp] = useState<string>('');
    const axiosApi = useAxios()

    const handleSendOtp = () => {
        console.log(mobile);
        try {
            axiosApi.post("/admin/auth/login", {
                mobile
            })
        } catch (error) {
            console.log(error, "PHONE ERROR");
        }
    };

    const handleVerifyOtp = () => {
        try {
            console.log(otp);
            axiosApi.post("/admin/auth/validate", {
                otp: otp,
                mobile: "8050692348",
                forAdmin: true,
                loginSource: "adminWeb"
            })
        } catch (error) {
            console.log(error, "OTP ERROR");
        }

    };

    const handleFetch = async () => {

        axiosApi.get("/admin/user/profile").then((res: any) => {
            console.log(res, "USERPROFILEAPI");
        })

    }

    const sendFile = (e: any) => {

        console.log(e.target.files);

        let formData = new FormData();

        formData.append("excelFile", e.target.files[0])

        axiosApi.post("/driver/bulk-upload", formData).then((res: any) => console.log(res))

    }

    return (
        <div className="App">
            <div>
                <h2>Enter Phone Number</h2>
                <input
                    type="text"
                    placeholder="Phone Number"
                    value={mobile}
                    onChange={(e) => setMobile(e.target.value)}
                />
                <button onClick={handleSendOtp}>Send OTP</button>
            </div>
            <div>
                <h2>Enter OTP</h2>
                <input
                    type="text"
                    placeholder="OTP"
                    value={otp}
                    onChange={(e) => setOtp(e.target.value)}
                />
                <button onClick={handleVerifyOtp}>Verify OTP</button>
            </div>

            <button onClick={handleFetch}>Fetch Profile</button>

            <input type="file" onChange={sendFile} />
        </div>


    );
}

export default App;