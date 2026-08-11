"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { RecordItem, RecordRating } from "@/types/dashboard";
import { MOCK_RECORDS, MOCK_RATINGS } from "@/data/mockData";

import Sidebar, { type ViewId } from "@/components/dashboard/Sidebar";
import Header from "@/components/dashboard/Header";

import WelcomeView from "@/components/dashboard/WelcomeView";
import AddRecordForm from "@/components/dashboard/AddRecordForm";
import RatingForm from "@/components/dashboard/RatingForm";
import SearchRecords from "@/components/dashboard/SearchRecords";

export default function DashboardPage() {
    const router = useRouter();

    const [view, setView] = useState<ViewId>("inicio");
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [currentUser, setCurrentUser] = useState("Luchis");
    const [records, setRecords] = useState<RecordItem[]>(MOCK_RECORDS);
    const [ratings, setRatings] = useState<RecordRating[]>(MOCK_RATINGS);
    useEffect(() => {
        const stored  = localStorage.getItem("user");
        if (!stored) return;
        try {
            const parsed = JSON.parse(stored);
            if (parsed?.username) {
                setCurrentUser(parsed.username);
            }
        } catch {
            // si el JSON está corrupto, ignoramos y usamos el valor por defecto
        }
    }, []);


    const handleLogout = () => {
        localStorage.removeItem("user");
        router.push("/");
    };

    const handleAddRecord = (r: RecordItem) => setRecords((prev) => [r, ...prev]);
    const handleUpdateStatus = (id: string, status: RecordItem["status"]) =>
        setRecords((prev) => prev.map((r) => (r.id === id ? { ...r, status } : r)));

    const handleAddRating = (newRating: RecordRating) => {
        setRatings((prev) => {
            const exists = prev.some((r) => r.recordId === newRating.recordId);
            if (exists) {
                return prev.map((r) => r.recordId === newRating.recordId ? newRating : r);
            }
            return [newRating, ...prev];
        });
        handleUpdateStatus(newRating.recordId, "Calificado");
    };

    return (
        <div className="flex min-h-screen bg-gray-50 text-gray-700 font-sans">

            <Sidebar
                view={view}
                currentUser={currentUser}
                isMobileOpen={isMobileMenuOpen}
                onNavigate={setView}
                onLogout={handleLogout}
                onCloseMobile={() => setIsMobileMenuOpen(false)}
            />

            <div className="flex-1 flex flex-col min-w-0">
                <Header
                    view={view}
                    isMobileMenuOpen={isMobileMenuOpen}
                    onToggleMobileMenu={() => setIsMobileMenuOpen((v) => !v)}
                />

                <main className="flex-1 p-2 md:p-6 max-w-7xl w-full mx-auto">

                    {view === "inicio" && (
                        <WelcomeView onNavigate={(v) => setView(v)} />
                    )}

                    {view === "agregar" && (
                        <AddRecordForm
                            onAddRecord={handleAddRecord}
                            onNavigateToSearch={() => setView("buscar")}
                        />
                    )}

                    {view === "buscar" && (
                        <SearchRecords
                            records={records}
                            ratings={ratings}
                            onUpdateStatus={handleUpdateStatus}
                        />
                    )}

                    {view === "calificacion" && (
                        <RatingForm
                            records={records}
                            ratings={ratings}
                            onUpdateStatus={handleUpdateStatus}
                            onAddRating={handleAddRating}
                        />
                    )}

                </main>
            </div>
        </div>
    );
}
