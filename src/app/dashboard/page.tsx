"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";
import DashboardContent from "./components/DashboardContent";
import DashboardHeader from "./components/DashboardHeader";
import DashboardSidebar from "./components/DashboardSidebar";

export default function DashboardPage() {
    const router = useRouter();

    const handleLogout = () => {
        localStorage.removeItem("user");
        localStorage.removeItem("userToken");
        localStorage.removeItem("isAuthenticated");

        router.push("/");
    };

    useEffect(() => {
        const auth = localStorage.getItem("isAuthenticated");

        if (auth !== "true") {
            router.replace("/login");
        }
    }, [router]);

    return (
        <div className="flex min-h-screen bg-white text-black">
            <DashboardSidebar onLogout={handleLogout} />

            <div className="flex-1 flex flex-col">
                <DashboardHeader />
                <DashboardContent />
            </div>
        </div>
    );
}
