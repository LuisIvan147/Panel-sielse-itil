"use client";

import React, { useState } from "react";
import { FiStar, FiLoader, FiCheckCircle, FiClock, FiAlertCircle } from "react-icons/fi";
import { RecordItem, RecordRating } from "@/types/dashboard";

interface RatingFormProps {
    records: RecordItem[];
    ratings: RecordRating[];
    onAddRating: (rating: RecordRating) => void;
    onNavigateToSearch: () => void;
}

const RATING_LABELS: Record<number, string> = {
    1: "Muy insatisfecho",
    2: "Insatisfecho",
    3: "Neutral",
    4: "Satisfecho",
    5: "Excelente servicio",
};

const STATUS_ICON: Record<RecordItem["status"], React.ReactNode> = {
    "Registrado": <FiAlertCircle className="w-3.5 h-3.5 text-blue-500" />,
    "En Atención": <FiClock className="w-3.5 h-3.5 text-purple-500" />,
    "Resuelto": <FiCheckCircle className="w-3.5 h-3.5 text-green-500" />,
    "Cerrado": <FiCheckCircle className="w-3.5 h-3.5 text-gray-400" />,
};

export default function RatingForm({ records, ratings, onAddRating, onNavigateToSearch }: RatingFormProps) {
    const ratedIds = new Set(ratings.map((r) => r.recordId));
    const pendingRecords = records.filter(
        (r) => (r.status === "Resuelto" || r.status === "Cerrado") && !ratedIds.has(r.id)
    );

    const [selectedRecord, setSelectedRecord] = useState<RecordItem | null>(null);
    const [starValue, setStarValue] = useState(0);
    const [hoverStar, setHoverStar] = useState(0);
    const [comments, setComments] = useState("");
    const [recommended, setRecommended] = useState<"si" | "no">("si");
    const [isLoading, setIsLoading] = useState(false);
    const [successMsg, setSuccessMsg] = useState("");
    const [errorMsg, setErrorMsg] = useState("");

    const selectTicket = (rec: RecordItem) => {
        setSelectedRecord(rec);
        setStarValue(0);
        setComments("");
        setRecommended("si");
        setErrorMsg("");
        setSuccessMsg("");
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setErrorMsg("");
        if (!selectedRecord) { setErrorMsg("Selecciona un ticket para calificar."); return; }
        if (starValue === 0) { setErrorMsg("Selecciona una calificación de 1 a 5 estrellas."); return; }

        setIsLoading(true);
        setTimeout(() => {
            const newRating: RecordRating = {
                id: `RTG-${Math.floor(1000 + Math.random() * 9000)}`,
                recordId: selectedRecord.id,
                rating: starValue,
                comments: comments.trim(),
                recommended,
                createdAt: new Date().toLocaleString("es-ES", {
                    day: "2-digit", month: "2-digit", year: "numeric",
                    hour: "2-digit", minute: "2-digit",
                }),
            };
            onAddRating(newRating);
            setIsLoading(false);
            setSuccessMsg(`Calificación enviada para ${selectedRecord.id}`);
            setSelectedRecord(null);
            setStarValue(0);
        }, 700);
    };

    return (
        <div className="w-full max-w-4xl mx-auto space-y-5">
            {/* Título */}
            <div className="pb-3 border-b border-gray-200">
                <h2 className="text-xs font-bold text-gray-800 uppercase tracking-wide">Calificación de Tickets</h2>
                <p className="text-[10px] text-gray-400 mt-0.5">
                    Evalúa los tickets que han sido resueltos. Solo puedes calificar tickets en estado <strong>Resuelto</strong> o <strong>Cerrado</strong>.
                </p>
            </div>

            {/* Mensaje de éxito */}
            {successMsg && (
                <div className="p-3 bg-green-50 border border-green-200 rounded text-xs text-green-700 flex justify-between items-center">
                    <span>✓ {successMsg}</span>
                    <button type="button" onClick={onNavigateToSearch} className="font-bold underline hover:text-green-900">
                        Ver en Buscador
                    </button>
                </div>
            )}

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
                {/* Panel Izquierdo: Lista de tickets */}
                <div className="space-y-4">
                    <div>
                        <p className="text-[9px] font-bold text-gray-400 uppercase tracking-widest mb-2">
                            Tickets pendientes de calificación ({pendingRecords.length})
                        </p>

                        {pendingRecords.length === 0 ? (
                            <div className="bg-white rounded border border-gray-200 p-8 text-center">
                                <FiCheckCircle className="w-6 h-6 text-gray-300 mx-auto mb-2" />
                                <p className="text-xs text-gray-400">No hay tickets pendientes de calificar.</p>
                            </div>
                        ) : (
                            <div className="space-y-2">
                                {pendingRecords.map((rec) => (
                                    <button
                                        key={rec.id}
                                        onClick={() => selectTicket(rec)}
                                        className={`w-full text-left p-3 rounded border transition-colors ${
                                            selectedRecord?.id === rec.id
                                                ? "border-gray-800 bg-gray-50"
                                                : "border-gray-200 bg-white hover:border-gray-300"
                                        }`}
                                    >
                                        <div className="flex justify-between items-center mb-1">
                                            <span className="text-[10px] font-bold text-blue-600">{rec.id}</span>
                                            <div className="flex items-center gap-1">
                                                {STATUS_ICON[rec.status]}
                                                <span className="text-[9px] text-gray-500">{rec.status}</span>
                                            </div>
                                        </div>
                                        <p className="text-[10px] font-semibold text-gray-700">{rec.nombreUsuario} — {rec.servicio}</p>
                                        <p className="text-[10px] text-gray-400 mt-0.5 line-clamp-1">{rec.descripcion}</p>
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>

                    {ratings.length > 0 && (
                        <div>
                            <p className="text-[9px] font-bold text-gray-400 uppercase tracking-widest mb-2">
                                Tickets calificados ({ratings.length})
                            </p>
                            <div className="space-y-1.5">
                                {ratings.map((r) => {
                                    const rec = records.find((x) => x.id === r.recordId);
                                    return (
                                        <div key={r.id} className="flex justify-between items-center p-2.5 bg-gray-50 rounded border border-gray-150 text-[10px]">
                                            <div>
                                                <span className="font-bold text-gray-600">{r.recordId}</span>
                                                {rec && <span className="text-gray-400 ml-1.5">— {rec.nombreUsuario}</span>}
                                            </div>
                                            <div className="flex items-center gap-0.5">
                                                {[1, 2, 3, 4, 5].map((s) => (
                                                    <FiStar key={s} className={`w-3 h-3 ${s <= r.rating ? "fill-amber-400 text-amber-400" : "text-gray-200"}`} />
                                                ))}
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    )}
                </div>

                {/* Panel Derecho: Formulario */}
                <div>
                    <p className="text-[9px] font-bold text-gray-400 uppercase tracking-widest mb-2">
                        Formulario de evaluación
                    </p>

                    {!selectedRecord ? (
                        <div className="bg-white rounded border border-gray-200 border-dashed p-8 text-center">
                            <FiStar className="w-6 h-6 text-gray-300 mx-auto mb-2" />
                            <p className="text-xs text-gray-400">Selecciona un ticket de la lista para calificarlo.</p>
                        </div>
                    ) : (
                        <div className="bg-white rounded border border-gray-200 p-4 space-y-4">
                            <div className="p-3 bg-gray-50 rounded border border-gray-100 text-[10px]">
                                <p className="font-bold text-gray-800">{selectedRecord.id}</p>
                                <p className="text-gray-500">{selectedRecord.nombreUsuario} · {selectedRecord.servicio}</p>
                                <p className="text-gray-400 mt-1 italic line-clamp-2">{selectedRecord.descripcion}</p>
                            </div>

                            <form onSubmit={handleSubmit} className="space-y-4">
                                {errorMsg && <p className="text-[10px] text-red-500 bg-red-50 p-2 rounded border border-red-200">{errorMsg}</p>}

                                <div className="flex flex-col items-center gap-2 py-4 bg-gray-50 rounded border border-gray-100">
                                    <span className="text-[10px] font-semibold text-gray-500 uppercase tracking-wider">¿Cómo fue el servicio?</span>
                                    <div className="flex gap-1">
                                        {[1, 2, 3, 4, 5].map((s) => {
                                            const active = hoverStar ? s <= hoverStar : s <= starValue;
                                            return (
                                                <button
                                                    key={s} type="button"
                                                    onClick={() => setStarValue(s)}
                                                    onMouseEnter={() => setHoverStar(s)}
                                                    onMouseLeave={() => setHoverStar(0)}
                                                    className="focus:outline-none"
                                                >
                                                    <FiStar className={`w-7 h-7 ${active ? "fill-amber-400 text-amber-400" : "text-gray-200"}`} />
                                                </button>
                                            );
                                        })}
                                    </div>
                                    {starValue > 0 && <span className="text-[10px] text-gray-500 font-medium">{RATING_LABELS[starValue]}</span>}
                                </div>

                                <div className="flex flex-col gap-1.5">
                                    <span className="text-[10px] font-semibold text-gray-500 uppercase tracking-wider">¿Recomendarías este soporte?</span>
                                    <div className="flex gap-4">
                                        {["si", "no"].map((opt) => (
                                            <label key={opt} className="flex items-center gap-1.5 text-xs text-gray-600 cursor-pointer">
                                                <input
                                                    type="radio" name="recommend" value={opt}
                                                    checked={recommended === opt}
                                                    onChange={() => setRecommended(opt as "si" | "no")}
                                                    className="w-3.5 h-3.5"
                                                />
                                                {opt === "si" ? "Sí" : "No"}
                                            </label>
                                        ))}
                                    </div>
                                </div>

                                <div className="flex flex-col gap-1">
                                    <label htmlFor="comments" className="text-[10px] font-semibold text-gray-500 uppercase tracking-wider">Comentarios</label>
                                    <textarea
                                        id="comments" rows={3} value={comments}
                                        onChange={(e) => setComments(e.target.value)}
                                        placeholder="Escribe tus sugerencias aquí..."
                                        className="w-full px-2.5 py-1.5 text-xs rounded border border-gray-200 resize-none focus:outline-none focus:border-gray-700"
                                    />
                                </div>

                                <div className="flex gap-2">
                                    <button
                                        type="button"
                                        onClick={() => setSelectedRecord(null)}
                                        className="flex-1 py-1.5 text-xs font-semibold text-gray-500 border border-gray-200 hover:bg-gray-50 rounded"
                                    >
                                        Cancelar
                                    </button>
                                    <button
                                        type="submit"
                                        disabled={isLoading}
                                        className="flex-1 py-1.5 text-xs font-bold text-white bg-gray-900 hover:bg-gray-800 rounded disabled:opacity-50"
                                    >
                                        {isLoading ? "Enviando..." : "Enviar Calificación"}
                                    </button>
                                </div>
                            </form>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
