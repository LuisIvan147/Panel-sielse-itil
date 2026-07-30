"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

// Tipos
import { RecordItem, RecordRating } from "@/types/dashboard";

// Datos de prueba (simulados mientras no hay backend)
import { MOCK_RECORDS, MOCK_RATINGS } from "@/data/mockData";

// Componentes de Layout
import Sidebar, { type ViewId } from "@/components/dashboard/Sidebar";
import Header from "@/components/dashboard/Header";

// Vistas
import WelcomeView from "@/components/dashboard/WelcomeView";
import AddRecordForm from "@/components/dashboard/AddRecordForm";
import RatingForm from "@/components/dashboard/RatingForm";
import SearchRecords from "@/components/dashboard/SearchRecords";

// ─────────────────────────────────────────────────────────────────────────────

export default function DashboardPage() {
    const router = useRouter();

    // Estado de navegación
    const [view, setView] = useState<ViewId>("inicio");
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    // Estado del usuario autenticado
    const [currentUser, setCurrentUser] = useState("Luchis");

    // Estado global de datos
    const [records, setRecords] = useState<RecordItem[]>(MOCK_RECORDS);
    const [ratings, setRatings] = useState<RecordRating[]>(MOCK_RATINGS);

    // Leer usuario desde localStorage al cargar
    useEffect(() => {
        const stored = localStorage.getItem("user");
        if (!stored) return;
        try {
            const parsed = JSON.parse(stored);
            if (parsed?.username) {
                setTimeout(() => setCurrentUser(parsed.username), 0);
            }
        } catch {
            // si el JSON está corrupto, ignoramos y usamos el valor por defecto
        }
    }, []);

    // ── Handlers ─────────────────────────────────────────────────────────────

    const handleLogout = () => {
        localStorage.removeItem("user");
        router.push("/");
    };

    const handleAddRecord = (r: RecordItem) => setRecords((prev) => [r, ...prev]);
    const handleAddRating = (r: RecordRating) => setRatings((prev) => [r, ...prev]);
    const handleUpdateStatus = (id: string, status: RecordItem["status"]) =>
        setRecords((prev) => prev.map((r) => (r.id === id ? { ...r, status } : r)));

    // ── Estadísticas para la vista de Inicio ─────────────────────────────────

    const stats = {
        totalTickets: records.length,
        openTickets: records.filter((r) => r.status === "Registrado").length,
        progressTickets: records.filter((r) => r.status === "En Atención").length,
        averageRating: ratings.length > 0
            ? (ratings.reduce((acc, r) => acc + r.rating, 0) / ratings.length).toFixed(1)
            : "N/A",
    };

    // ── Render ────────────────────────────────────────────────────────────────

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

                <main className="flex-1 p-5 md:p-6 max-w-5xl w-full mx-auto">

                    {view === "inicio" && (
                        <WelcomeView
                            currentUser={currentUser}
                            stats={stats}
                            onNavigate={(v) => setView(v)}
                        />
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
                            onAddRating={handleAddRating}
                            onNavigateToSearch={() => setView("buscar")}
                        />
                    )}

                </main>
            </div>
        </div>
    );
}