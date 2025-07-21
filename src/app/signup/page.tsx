"use client";
import Link from "next/link";
import React, { useEffect } from "react";
import { useRouter } from "next/navigation";
import { toast } from "react-hot-toast"
import axios from "axios";

export default function SignupPage() {

    const router = useRouter();

    const [user, setUser] = React.useState({
        email: "",
        password: "",
        username: "",
    })

    const [buttonDisabled, setButtonDisabled] = React.useState(false);
    const [loading, setLoading] = React.useState(false);

    const onSignup = async () => {
        try {
            setLoading(true);
            const response = await axios.post("/api/users/signup", user);
            router.push("/login");
        }
        catch (error: any) {
            toast.error(error.message);

        }
        finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        if (user.email.length > 0 && user.password.length > 0 && user.username.length > 0) {
            setButtonDisabled(false);
        } else {
            setButtonDisabled(true);
        }
    }, [user]);

    return (
        <div className="flex items-center justify-center mt-15">
            <div className="flex flex-col items-center space-y-6 w-full max-w-md p-6 rounded shadow-lg">
                <h1 className="text-center text-lg font-semibold">{loading ? "processing" : "Please fill out the form to register"}</h1>
                <hr className="w-full"/>

                <div className="w-full">
                    <div className="flex items-center justify-between mb-4">
                        <label htmlFor="username" className="w-1/3 text-right pr-2">Username</label>
                        <input
                            id="username"
                            type="text"
                            value={user.username}
                            onChange={(e) => setUser({ ...user, username: e.target.value })}
                            placeholder="username"
                            className="w-2/3 border rounded px-2 py-1"
                        />
                    </div>

                    <div className="flex items-center justify-between mb-6">
                        <label htmlFor="email" className="w-1/3 text-right pr-2">Email</label>
                        <input
                            id="email"
                            type="text"
                            value={user.email}
                            onChange={(e) => setUser({ ...user, email: e.target.value })}
                            placeholder="email"
                            className="w-2/3 border rounded px-2 py-1"
                        />
                    </div>

                    <div className="flex items-center justify-between mb-6">
                        <label htmlFor="password" className="w-1/3 text-right pr-2">Password</label>
                        <input
                            id="password"
                            type="password"
                            value={user.password}
                            onChange={(e) => setUser({ ...user, password: e.target.value })}
                            placeholder="password"
                            className="w-2/3 border rounded px-2 py-1"
                        />
                    </div>

                    <div className="flex justify-center gap-4">
                        <button onClick={onSignup}
                            className="border rounded py-2 px-4 bg-[#B1AB86] hover:bg-[#819067] hover:text-white">
                            {buttonDisabled ? "Signup" : "Signup"}
                        </button>
                        <Link href="/login" className="border rounded py-2 px-4 bg-[#B1AB86] hover:bg-[#819067] hover:text-white">Go To Login Page</Link>
                    </div>
                </div>
            </div>
        </div>
    )
}