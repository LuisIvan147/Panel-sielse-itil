"use client";

import React from "react";
import { FiPlusSquare, FiSearch, FiStar, FiActivity, FiAlertCircle, FiClock } from "react-icons/fi";

interface Stats {
    totalTickets: number;
    openTickets: number;
    progressTickets: number;
    averageRating: string;
}

interface WelcomeViewProps {
    currentUser: string;
    stats: Stats;
    onNavigate: (view: "agregar" | "buscar" | "calificacion") => void;
}

export default function WelcomeView({ currentUser, stats, onNavigate }: WelcomeViewProps) {
    const { totalTickets, openTickets, progressTickets, averageRating } = stats;

    return (
        <div className="space-y-5">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">

                <button
                    onClick={() => onNavigate("agregar")}
                    className="bg-gray-900 hover:bg-gray-800 text-white rounded p-5 flex flex-col items-start gap-2 transition-colors text-left">
                    <div>
                        <div className="text-xs font-bold tracking-wide">Agregar Registro</div>
                        <div className="text-[10px] text-gray-400 mt-0.5">Registrar nuevo incidente o solicitud</div>
                    </div>
                </button>

                <button
                    onClick={() => onNavigate("buscar")}
                    className="bg-white hover:bg-gray-50 text-gray-800 rounded p-5 flex flex-col items-start gap-2 transition-colors border border-gray-200 text-left">
                    <div>
                        <div className="text-xs font-bold tracking-wide">Buscar Registro</div>
                        <div className="text-[10px] text-gray-400 mt-0.5">Consultar estado de tickets</div>
                    </div>
                </button>

                <button
                    onClick={() => onNavigate("calificacion")}
                    className="bg-white hover:bg-gray-50 text-gray-800 rounded p-5 flex flex-col items-start gap-2 transition-colors border border-gray-200 text-left">
                    <div>
                        <div className="text-xs font-bold tracking-wide">Calificación</div>
                        <div className="text-[10px] text-gray-400 mt-0.5">Evaluar tickets de soporte recibidos</div>
                    </div>
                </button>

            </div>
        </div>
    );
}
