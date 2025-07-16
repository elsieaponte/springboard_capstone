'use client';
import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";

export default function Navbar() {
    const [isLoggedIn, setIsLoggedIn] = useState(false)
    const [username, setUsername] = useState('')
    const router = useRouter()

    //check if user is logged in
    useEffect(() => {
        const checkLoginStatus = async () => {
            try {
                const res = await fetch("/api/users/me")
                const data = await res.json()
                if (res.ok && data?.data) {
                    setIsLoggedIn(true)
                    setUsername(data.data.username)
                } else {
                    setIsLoggedIn(false)
                }
            } catch (error: any) {
                toast.error("Invalid or expired token")
            }
        }

        checkLoginStatus()
    }, [])

    //onclick function for logout button
    const handleLogout = async () => {
        try {
            const res = await fetch("/api/users/logout")
            const data = await res.json()
            if (res.ok) {
                setIsLoggedIn(false)
                toast.success("Logged out")
                router.push("/")
            } else {
                toast.error(data.error || "Logout failed")
            }
        } catch (error: any) {
            toast.error("Invalid or expired token")
        }
    }


    return (
        <nav className="bg-[rgba(72,51,11,1)] text-white flex justify-between p-7 mb-5">
            <a href="/">NATIONAL PARKS</a>
            <ul className="flex gap-6">
                {!isLoggedIn ? (
                    <>
                        <li>
                            <Link href={'/login'}>LOGIN</Link>
                        </li>
                        <li>
                            <Link href={'/signup'}>SIGNUP</Link>
                        </li>
                    </>
                ) : (
                    <>
                        <li>
                            {isLoggedIn && <p>Welcome, {username.toUpperCase()}</p>}
                        </li>
                        <li>
                            <Link href={'/profile'}>Profile</Link>
                        </li>
                        <li>
                            <button
                                onClick={handleLogout}
                                className="cursor-pointer"
                            >
                                Logout
                            </button>

                        </li>
                    </>

                )}
            </ul>
        </nav>
    )
}