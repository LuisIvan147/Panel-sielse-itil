"use client";

import React, { useState } from "react";
import { RecordItem, RecordRating } from "@/types/dashboard";
import { FiSearch, FiCalendar, FiInfo, FiUser, FiMonitor, FiMessageSquare, FiCheckCircle } from "react-icons/fi";

interface RatingFormProps {
    records: RecordItem[];
    ratings: RecordRating[];
    onUpdateStatus: (id: string, newStatus: RecordItem["status"]) => void;
    onAddRating: (rating: RecordRating) => void;
}

export default function RatingForm({ records, ratings, onUpdateStatus, onAddRating }: RatingFormProps) {
    const [selectedRecordId, setSelectedRecordId] = useState<string | null>(
        records.length > 0 ? records[0].id : null
    );
    const [searchTerm, setSearchTerm] = useState("");
    const [statusFilter, setStatusFilter] = useState<string>("Todos");

    // Form state for comment/response
    const [comments, setComments] = useState("");

    // Selected record details
    const selectedRecord = records.find((r) => r.id === selectedRecordId);
    const selectedRating = selectedRecord ? ratings.find((r) => r.recordId === selectedRecord.id) : null;

    // Filtered records list for sidebar
    const filteredRecords = records.filter((rec) => {
        const q = searchTerm.toLowerCase();
        const matchesSearch =
            rec.id.toLowerCase().includes(q) ||
            rec.nombreUsuario.toLowerCase().includes(q) ||
            rec.servicio.toLowerCase().includes(q);

        const ratingInfo = ratings.find((r) => r.recordId === rec.id);
        const matchesStatus =
            statusFilter === "Todos" ||
            (statusFilter === "Respondidos" && ratingInfo) ||
            (statusFilter === "Pendientes" && !ratingInfo);

        return matchesSearch && matchesStatus;
    });

    const getStatusBadgeStyle = (status: RecordItem["status"]) => {
        switch (status) {
            case "Registrado":
                return "bg-blue-50 text-blue-700 border-blue-100";
            case "Revisión":
                return "bg-amber-50 text-amber-700 border-amber-100";
            case "Calificado":
                return "bg-emerald-50 text-emerald-700 border-emerald-100";
            case "Cerrado":
                return "bg-gray-100 text-gray-700 border-gray-200";
            default:
                return "bg-gray-50 text-gray-500 border-gray-150";
        }
    };

    const handleSelectRecord = (id: string) => {
        setSelectedRecordId(id);
        const currentRating = ratings.find((r) => r.recordId === id);
        setComments(currentRating ? currentRating.comments : "");
    };

    const handleSubmitResponse = (e: React.FormEvent) => {
        e.preventDefault();
        if (!selectedRecordId) return;

        const newRating: RecordRating = {
            id: `rat_${Date.now()}`,
            recordId: selectedRecordId,
            rating: 5, // Default rating value
            comments: comments,
            recommended: "si", // Default recommendation value
            createdAt: new Date().toLocaleString("es-PE", { timeZone: "America/Lima" }),
        };

        onAddRating(newRating);
    };

    return (
        <div className="w-full space-y-4">
            {/* Header */}
            <div className="border-b border-gray-200 pb-3">
                <h2 className="text-xs font-bold text-gray-800 uppercase tracking-wide">
                    Panel de Respuestas y Estados - Soporte Técnico
                </h2>
                <p className="text-[10px] text-gray-400 mt-0.5">
                    Visualiza los tickets registrados, añade respuestas/notas y gestiona sus estados.
                </p>
            </div>

            {/* Split Screen Layout */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
                {/* Left Side: Simple Ticket List */}
                <div className="lg:col-span-4 bg-white border border-gray-200 rounded-lg flex flex-col h-[550px] overflow-hidden">
                    <div className="p-3 border-b border-gray-150 space-y-2 bg-gray-50/50">
                        <div className="relative">
                            <FiSearch className="absolute left-2.5 top-1/2 -translate-y-1/2 text-gray-400 w-3 h-3" />
                            <input
                                type="text"
                                placeholder="Buscar por ID o usuario..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-full pl-8 pr-2.5 py-1 text-xs rounded border border-gray-200 focus:outline-none focus:border-gray-800 bg-white"
                            />
                        </div>
                        <div className="flex gap-1">
                            {["Todos", "Pendientes", "Respondidos"].map((tab) => (
                                <button
                                    key={tab}
                                    type="button"
                                    onClick={() => setStatusFilter(tab)}
                                    className={`flex-1 text-[9px] font-bold py-1 px-1.5 rounded transition-all ${
                                        statusFilter === tab
                                            ? "bg-gray-800 text-white"
                                            : "bg-white text-gray-500 border border-gray-200 hover:bg-gray-50"
                                    }`}
                                >
                                    {tab}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Scrollable list */}
                    <div className="flex-1 overflow-y-auto divide-y divide-gray-100">
                        {filteredRecords.length === 0 ? (
                            <div className="p-8 text-center text-gray-400 text-xs flex flex-col items-center justify-center h-full">
                                <FiInfo className="w-5 h-5 text-gray-300 mb-1" />
                                <span>No se encontraron tickets.</span>
                            </div>
                        ) : (
                            filteredRecords.map((rec) => {
                                const isSelected = rec.id === selectedRecordId;
                                const hasResponse = ratings.some((r) => r.recordId === rec.id);
                                return (
                                    <button
                                        key={rec.id}
                                        type="button"
                                        onClick={() => handleSelectRecord(rec.id)}
                                        className={`w-full text-left p-3 text-xs transition-colors flex flex-col gap-1 border-l-2 ${
                                            isSelected
                                                ? "bg-blue-50/30 border-l-blue-600"
                                                : "border-l-transparent hover:bg-gray-50"
                                        }`}
                                    >
                                        <div className="flex justify-between items-center">
                                            <span className="font-bold text-blue-600">{rec.id}</span>
                                            <span className="text-[9px] text-gray-400">{rec.fecha}</span>
                                        </div>
                                        <div className="font-semibold text-gray-700 truncate">{rec.nombreUsuario}</div>
                                        <div className="text-[10px] text-gray-500 truncate">{rec.servicio}</div>
                                        <div className="flex justify-between items-center mt-1">
                                            <span
                                                className={`px-1.5 py-0.2 rounded border text-[9px] font-bold ${getStatusBadgeStyle(
                                                    rec.status
                                                )}`}
                                            >
                                                {rec.status}
                                            </span>
                                            {hasResponse ? (
                                                <span className="text-[9px] text-emerald-600 font-semibold bg-emerald-50 px-1.5 py-0.5 rounded border border-emerald-100">
                                                    Respondido
                                                </span>
                                            ) : (
                                                <span className="text-[9px] text-amber-600 font-semibold bg-amber-50 px-1.5 py-0.5 rounded border border-amber-100">
                                                    Pendiente
                                                </span>
                                            )}
                                        </div>
                                    </button>
                                );
                            })
                        )}
                    </div>
                </div>

                {/* Right Side: Simple Details & Response Form */}
                <div className="lg:col-span-8">
                    {selectedRecord ? (
                        <div className="bg-white border border-gray-200 rounded-lg p-5 space-y-4">
                            {/* Record Header */}
                            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center border-b border-gray-100 pb-3 gap-2">
                                <div>
                                    <h3 className="text-xs font-bold text-gray-800 uppercase tracking-wider">
                                        Detalle del Ticket #{selectedRecord.id}
                                    </h3>
                                    <p className="text-[9px] text-gray-400 mt-0.5">
                                        Registrado: {selectedRecord.createdAt}
                                    </p>
                                </div>

                                {/* Status Selector */}
                                <div className="flex items-center gap-2">
                                    <span className="text-[9px] font-bold text-gray-400 uppercase">Estado:</span>
                                    <select
                                        value={selectedRecord.status}
                                        onChange={(e) =>
                                            onUpdateStatus(selectedRecord.id, e.target.value as RecordItem["status"])
                                        }
                                        className="text-xs px-2 py-1 border border-gray-200 rounded bg-white font-medium focus:outline-none focus:border-gray-800"
                                    >
                                        <option value="Registrado">Registrado</option>
                                        <option value="Revisión">En Revisión</option>
                                        <option value="Calificado">Calificado</option>
                                        <option value="Cerrado">Cerrado</option>
                                    </select>
                                </div>
                            </div>

                            {/* Info Summary */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs bg-gray-50/50 p-3 rounded border border-gray-100">
                                <div>
                                    <div className="text-[10px] text-gray-400 font-bold uppercase">Solicitante</div>
                                    <div className="font-semibold text-gray-700 mt-0.5 flex items-center gap-1">
                                        <FiUser className="w-3 h-3 text-gray-400" />
                                        {selectedRecord.nombreUsuario} ({selectedRecord.usuario})
                                    </div>
                                    <div className="text-[10px] text-gray-400 font-bold uppercase mt-2">Empresa / Sucursal</div>
                                    <div className="text-gray-700 font-medium mt-0.5">
                                        {selectedRecord.nombreEmpresa} — {selectedRecord.nombreSucursal}
                                    </div>
                                </div>
                                <div>
                                    <div className="text-[10px] text-gray-400 font-bold uppercase">Servicio / Módulo</div>
                                    <div className="font-semibold text-gray-700 mt-0.5">
                                        {selectedRecord.servicio} / {selectedRecord.modulo}
                                    </div>
                                    <div className="text-[10px] text-gray-400 font-bold uppercase mt-2">IP de Origen</div>
                                    <div className="text-gray-700 font-mono mt-0.5 flex items-center gap-1">
                                        <FiMonitor className="w-3 h-3 text-gray-400" />
                                        {selectedRecord.ip}
                                    </div>
                                </div>
                            </div>

                            {/* Ticket Description */}
                            <div className="space-y-1">
                                <span className="text-[9px] font-bold text-gray-400 uppercase tracking-wider">
                                    Descripción de la Incidencia
                                </span>
                                <div className="p-3 bg-gray-50 border border-gray-100 rounded text-xs text-gray-600 whitespace-pre-wrap">
                                    {selectedRecord.descripcion}
                                </div>
                            </div>

                            {/* Comments/Response Section */}
                            <div className="border-t border-gray-100 pt-3">
                                {selectedRating ? (
                                    <div className="space-y-3">
                                        <div className="bg-emerald-50/30 border border-emerald-100 rounded p-3">
                                            <div className="flex justify-between items-center mb-1">
                                                <span className="text-[9px] font-bold text-emerald-800 uppercase tracking-wide flex items-center gap-1">
                                                    <FiCheckCircle className="w-3.5 h-3.5 text-emerald-600" /> Respuesta Guardada
                                                </span>
                                                <span className="text-[9px] text-gray-400 font-medium">
                                                    {selectedRating.createdAt}
                                                </span>
                                            </div>
                                            <p className="text-xs text-gray-700 italic bg-white p-2.5 rounded border border-emerald-50">
                                                &quot;{selectedRating.comments}&quot;
                                            </p>
                                        </div>

                                        <button
                                            type="button"
                                            onClick={() => {
                                                setComments(selectedRating.comments);
                                                onUpdateStatus(selectedRecord.id, "Revisión");
                                                alert("Modo edición de respuesta activado.");
                                            }}
                                            className="text-[10px] text-blue-600 hover:text-blue-800 font-bold uppercase flex items-center gap-1"
                                        >
                                            <FiMessageSquare className="w-3.5 h-3.5" /> Editar Respuesta
                                        </button>
                                    </div>
                                ) : (
                                    <form onSubmit={handleSubmitResponse} className="space-y-3">
                                        <div>
                                            <label
                                                htmlFor="comments"
                                                className="text-[9px] font-bold text-gray-400 uppercase tracking-wider block mb-1"
                                            >
                                                Escribir Respuesta / Notas de Soporte
                                            </label>
                                            <textarea
                                                id="comments"
                                                rows={4}
                                                required
                                                value={comments}
                                                onChange={(e) => setComments(e.target.value)}
                                                placeholder="Escribe la solución, respuesta o anotación para este ticket..."
                                                className="w-full px-2.5 py-2 text-xs rounded border border-gray-200 focus:outline-none focus:border-gray-800 bg-white resize-none"
                                            />
                                        </div>

                                        <button
                                            type="submit"
                                            className="bg-gray-800 hover:bg-gray-900 text-white text-[10px] font-bold uppercase tracking-wider px-4 py-2 rounded transition"
                                        >
                                            Guardar Respuesta
                                        </button>
                                    </form>
                                )}
                            </div>
                        </div>
                    ) : (
                        <div className="bg-white border border-gray-200 rounded-lg p-10 text-center flex flex-col items-center justify-center h-[300px]">
                            <FiInfo className="w-8 h-8 text-gray-300 mb-2" />
                            <p className="text-xs text-gray-400">
                                Selecciona un ticket del listado para gestionar su estado y añadir respuestas.
                            </p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}