"use client";

import React from "react";
import { FiMenu, FiX } from "react-icons/fi";
import type { ViewId } from "@/components/dashboard/Sidebar";

// Mapa de etiquetas de vista → título legible
const VIEW_LABELS: Record<ViewId, string> = {
    inicio: "Inicio",
    agregar: "Agregar Registro",
    buscar: "Buscar Registro",
    calificacion: "Calificación",
};

interface HeaderProps {
    view: ViewId;
    isMobileMenuOpen: boolean;
    onToggleMobileMenu: () => void;
}

export default function Header({ view, isMobileMenuOpen, onToggleMobileMenu }: HeaderProps) {
    return (
        <header className="h-19 bg-white border-b border-gray-200 flex items-center justify-between px-6 sticky top-0 z-40">
            <div className="flex items-center gap-3">
                {/* Botón hamburguesa — solo visible en móvil */}
                <button
                    onClick={onToggleMobileMenu}
                    className="lg:hidden text-gray-500 hover:text-gray-800 p-1 hover:bg-gray-100 rounded"
                    aria-label="Abrir menú"
                >
                    {isMobileMenuOpen
                        ? <FiX className="w-5 h-5" />
                        : <FiMenu className="w-5 h-5" />
                    }
                </button>

                {/* Título del módulo activo */}
                <h1 className="text-sm font-bold text-gray-900 uppercase tracking-wide">
                    {VIEW_LABELS[view]}
                </h1>
            </div>
        </header>
    );
}
