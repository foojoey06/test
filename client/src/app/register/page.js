"use client"
import React, { useState, useEffect } from "react";
import Link from 'next/link';
import styles from "@/app/form.css";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { signIn, signOut, useSession } from "next-auth/react";

const REGISTER = () => {
    const { data: session, status } = useSession();
    const [loading, setLoading] = useState(false);
    const [username, setUsername] = useState(session?.user?.name || '');

    const [passwordValid, setPasswordValid] = useState({
        lowercase: false,
        uppercase: false,
        number: false,
        special: false,
        length: false
    });

    useEffect(() => {
        if (session?.user?.name) {
            setUsername(session.user.name);
        }
    }, [session]);

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
    };

    const handleUsernameChange = (event) => {
        setUsername(event.target.value);
    };

    const handleSubmit = async (event) => {
        event.preventDefault();

        const form = event.target;
        const formData = new FormData(form);

        formData.set('username', username); 

        if (!passwordValid.lowercase || !passwordValid.uppercase || !passwordValid.number || !passwordValid.special || !passwordValid.length) {
            toast.error("Password does not meet the requirements.");
            return;
        }

        try {
            setLoading(true); 
            const response = await fetch('http://localhost:8000/register', {
                method: 'POST',
                body: formData
            });

            if (response.ok) {
                const message = await response.json();
                alert(message.message);
                await signOut(); 
                window.location.href = '/login';
            } else {
                const errorData = await response.json();
                toast.error(errorData.error);
            }
        } catch (error) {
            console.error('Error:', error);
            toast.error("Failed to register: " + error);
        } finally {
            setLoading(false); // Reset loading state
        }
    };

    return (
        <div>
            {status === "loading" && <p>Loading...</p>} {/* Display loading state while session is loading */}
            {status === "authenticated" && (
                <div className="wrapper">
                    <div className="title">
                        REGISTER
                    </div>
                    <form onSubmit={handleSubmit}>
                        <div className="field">
                            <label>username</label>
                            <input type="text" name="username" value={username} onChange={handleUsernameChange} required />
                        </div>
                        <div className="field">
                            <input type="text" name="email" value={session?.user?.email || ''} required readOnly />
                            <label>email</label>
                        </div>
                        <div className="field">
                            <input type="password" name="password" required onChange={handlePasswordChange} />
                            <label>password</label>
                        </div>
                        <div className="field">
                            <input type="submit" value="REGISTER" disabled={loading} />
                        </div>
                        <div className="signup-link">
                            Already Have Account?&nbsp;
                            <Link href="/login">
                                Login
                            </Link>
                            <button onClick={() => signOut()}>Want to use another Google Account?</button>
                        </div>
                    </form>
                    <div id="message">
                        <p className={passwordValid.lowercase ? "valid" : "invalid"}>A <b>lowercase</b> letter</p>
                        <p className={passwordValid.uppercase ? "valid" : "invalid"}>A <b>capital (uppercase)</b> letter</p>
                        <p className={passwordValid.number ? "valid" : "invalid"}>A <b>number</b></p>
                        <p className={passwordValid.special ? "valid" : "invalid"}>A <b>special character</b></p> {/* Display special character validation */}
                        <p className={passwordValid.length ? "valid" : "invalid"}>Minimum <b>8 characters</b></p>
                    </div>
                </div>
            )}
            {status === "unauthenticated" && (
                <div>
                    <p>Please Login with Google First To Get Your Email</p>
                    <button onClick={() => signIn()}>Sign In With Google</button>
                </div>
            )}
            <ToastContainer />
        </div>
    );
};

export default REGISTER;
