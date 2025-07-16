"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";

export default function ProfilePage() {

    const [isLoggedIn, setIsLoggedIn] = useState(false)
    const [userData, setUserData] = useState<{ username: string; email: string; visitedParks: string[] } | null>(null)

    const router = useRouter()

    //check if user is logged in
    useEffect(() => {
        const checkLoginStatus = async () => {
            try {
                const res = await fetch("/api/users/me")
                const data = await res.json()
                if (res.ok && data?.data) {
                    setIsLoggedIn(true)
                    setUserData(data.data)
                } else {
                    setIsLoggedIn(false)
                }
            } catch (error: any) {
                toast.error("Invalid or expired token")
            }
        }

        checkLoginStatus()
    }, [])

    return (
        <div>
            <h1 className="text-center text-4xl text-bold">User Profile</h1>
            <div className="border text-center m-8 ml-30 mr-30 py-2">
                <p>Personal Information </p>
                {userData ? (
                    <ul>
                        <li>Username: {userData.username}</li>
                        <li>Email: {userData.email}</li>
                    </ul>
                ) : (
                    <div className="fixed inset-0 flex items-center justify-center bg-white z-50">
                        <div className="border-4 border-[#B1AB86] rounded-lg p-8 shadow-lg text-center">
                            <p className="text-lg font-semibold mb-2">...Loading User Information</p>
                        </div>
                    </div>
                )}
            </div>
            <p className="text-center mb-8 text-xl text-bold">Parks I have visited: </p>
            {userData?.visitedParks?.length > 0 ? (
                <ul className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 ml-5 mr-5">
                    {userData.visitedParks.map((park: any, index: number) => (
                        <li key={index} className="border rounded-lg p-4 shadow">
                            <h3 className="font-bold mb-2">{park.parkName}</h3>
                            {park.imageUrl && (
                                <img
                                    src={park.imageUrl}
                                    alt={park.parkName}
                                    className="w-full h-48 object-cover rounded"
                                />
                            )}
                        </li>
                    ))}
                </ul>
            ) : (
                <p className="text-gray-500 italic">No parks visited yet.</p>
            )}

        </div>
    )
}