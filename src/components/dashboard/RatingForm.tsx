import React, { useState, type ReactNode } from "react";

export default function RatingForm() {
    return (
        <div className="w-full max-w-4xl mx-auto space-y-5">
            <div className="pb-3 border-b border-gray-200">
                <h2 className="text-xs font-bold text-gray-800 uppercase tracking-wide">Calificación de Tickets</h2>
                <p className="text-[10px] text-gray-400 mt-0.5">
                    Evalúa los tickets que han sido resueltos. Solo puedes calificar tickets en estado <strong>Resuelto</strong> o <strong>Cerrado</strong>.
                </p>
            </div>
            <div className="space-y-1.5 pb-2">
                <label htmlFor="zone" className="text-[11px] font-bold text-slate-400 uppercase tracking-wider ml-1">
                  Zona Administrativa
                </label>
              </div>

            </div>
    );
}
