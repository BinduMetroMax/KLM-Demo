import axios from 'axios';
import React, { useState } from 'react';

function App() {
    const [mobile, setMobile] = useState<string>("8050692348");
    const [otp, setOtp] = useState<string>('');

    const handleSendOtp = () => {
        console.log(mobile);
        try {
            axios.post("/api/admin/auth/login", {
                mobile
            })
        } catch (error) {
            console.log(error, "PHONE ERROR");
        }
    };

    const handleVerifyOtp = () => {
        try {
            console.log(otp);
            axios.post("/api/admin/auth/validate", {
                otp: otp,
                mobile: "8050692348",
                forAdmin: true,
                loginSource: "adminWeb"
            })
        } catch (error) {
            console.log(error, "OTP ERROR");
        }

    };

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
        </div>


    );
}

export default App;