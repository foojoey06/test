"use client"
import React, { useState } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import styles from "@/app/form.css";

function ResetPassword({ params }) {
    const [newpassword, setNewPassword] = useState("");
    const [passwordValid, setPasswordValid] = useState({
        lowercase: false,
        uppercase: false,
        number: false,
        special: false,
        length: false
    });

    const handleFormSubmit = async (e) => {
        e.preventDefault();
        if (!passwordValid.lowercase || !passwordValid.uppercase || !passwordValid.number || !passwordValid.special || !passwordValid.length) {
            toast.error("Password does not meet the requirements.");
            return;
        }
        try {
            const response = await fetch('http://localhost:8000/forgetpassword', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ newpassword, token: params.token })
            });

            const data = await response.json();

            if (response.ok) {
                toast.success(data.message);
                window.location.href = '/login';
            } else {
                toast.error(data.error);
            }
        } catch (error) {
            toast.error("An error occurred while sending the reset password.");
        }
    }

    const handlePasswordChange = (event) => {
        const password = event.target.value;
        const lowerCaseLetters = /[a-z]/g;
        const upperCaseLetters = /[A-Z]/g;
        const numbers = /[0-9]/g;
        const specials = /[^A-Za-z0-9]/g;

        setPasswordValid({
            lowercase: lowerCaseLetters.test(password),
            uppercase: upperCaseLetters.test(password),
            number: numbers.test(password),
            special: specials.test(password),
            length: password.length >= 8
        });

        setNewPassword(password);
    };

    return (
        <div>
            <h1>Reset Password</h1>
            <form onSubmit={handleFormSubmit}>
                New Password :
                <input type='password' name="newpassword" value={newpassword} onChange={handlePasswordChange} />
                <button type="submit">Reset Password</button>
            </form>
            <div id="message">
                <p className={passwordValid.lowercase ? "valid" : "invalid"}>A <b>lowercase</b> letter</p>
                <p className={passwordValid.uppercase ? "valid" : "invalid"}>A <b>capital (uppercase)</b> letter</p>
                <p className={passwordValid.number ? "valid" : "invalid"}>A <b>number</b></p>
                <p className={passwordValid.special ? "valid" : "invalid"}>A <b>special character</b></p>
                <p className={passwordValid.length ? "valid" : "invalid"}>Minimum <b>8 characters</b></p>
            </div>
            <ToastContainer />
        </div>
    )
}

export default ResetPassword;
