import axios from 'axios';
import React, { useState } from 'react';

function App() {
    const [phoneNumber, setPhoneNumber] = useState<string>('');
    const [code, setcodep] = useState<string>('');
    const [step, setStep] = useState<number>(1); // 1 for phone number, 2 for OTP

    const handleSendOtp = () => {
        console.log(phoneNumber);
        try {
            axios.post("/api/auth/otp-login", {
                phoneNumber: "1234567890"
            })
            setTimeout(() => {
                setStep(2); // Switch to the OTP step
            }, 1000);
        } catch (error) {
            console.log(error, "PHONE ERROR");
        }
    };

    const handleVerifyOtp = () => {
        try {
            console.log(code);
            axios.post("/api/auth/validate", {
                code: "123456",
                phone: "1234567890"
            })
        } catch (error) {
            console.log(error, "OTP ERROR");
        }

    };

    const apiCallthwithCookie = () => {
        axios.get("/api/dashboard", {
            withCredentials: false
        }).then((res) => console.log(res, "USERS DATA"))
    }

    return (
        <div className="App">
            {step === 1 && (
                <div>
                    <h2>Enter Phone Number</h2>
                    <input
                        type="text"
                        placeholder="Phone Number"
                        value={phoneNumber}
                        onChange={(e) => setPhoneNumber(e.target.value)}
                    />
                    <button onClick={handleSendOtp}>Send OTP</button>
                </div>
            )}
            {step === 2 && (
                <div>
                    <h2>Enter OTP</h2>
                    <input
                        type="text"
                        placeholder="OTP"
                        value={code}
                        onChange={(e) => setcodep(e.target.value)}
                    />
                    <button onClick={handleVerifyOtp}>Verify OTP</button>
                </div>
            )}
            <button onClick={apiCallthwithCookie}>Call Api</button>
        </div>


    );
}

export default App;
