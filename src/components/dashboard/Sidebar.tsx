"use client";

import React from "react";
import { RiHome9Fill, RiAddCircleFill } from "react-icons/ri";
import { FaMagnifyingGlass } from "react-icons/fa6";
import { MdEditDocument } from "react-icons/md";
import { FiLogOut, FiX } from "react-icons/fi";
export type ViewId = "inicio" | "agregar" | "buscar" | "calificacion";

export const navigationItems = [
    { id: "inicio" as const, label: "Inicio", icon: RiHome9Fill },
    { id: "agregar" as const, label: "Agregar Registro", icon: RiAddCircleFill },
    { id: "buscar" as const, label: "Buscar Registro", icon: FaMagnifyingGlass },
    { id: "calificacion" as const, label: "Calificación", icon: MdEditDocument },
];

interface SidebarProps {
    view: ViewId;
    currentUser: string;
    isMobileOpen: boolean;
    onNavigate: (view: ViewId) => void;
    onLogout: () => void;
    onCloseMobile: () => void;
}

// --- Subcomponente: Lista de Navegación ---
interface NavListProps {
    view: ViewId;
    onNavigate: (view: ViewId) => void;
    onAfterNavigate?: () => void;
}

function NavList({ view, onNavigate, onAfterNavigate }: NavListProps) {
    return (
        <nav className="p-3 space-y-1">
            {navigationItems.map(({ id, label, icon: Icon }) => {
                const isActive = view === id;
                return (
                    <button
                        key={id}
                        onClick={() => { onNavigate(id); onAfterNavigate?.(); }}
                        className={`w-full flex items-center gap-3 px-3 py-2 rounded text-xs font-semibold transition-colors duration-150 ${isActive
                            ? "bg-gray-100 text-blue-900"
                            : "text-gray-500 hover:bg-gray-50 hover:text-gray-900"
                            }`}
                    >
                        <Icon className="text-base" />
                        {label}
                    </button>
                );
            })}
        </nav>
    );
}

// --- Subcomponente: Footer de usuario + logout ---
interface UserFooterProps {
    currentUser: string;
    onLogout: () => void;
}

function UserFooter({ currentUser, onLogout }: UserFooterProps) {
    return (
        <div className="p-4 border-t border-gray-100 bg-gray-50/50">
            <div className="flex items-center gap-2.5 mb-3.5 px-1">
                <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center font-semibold text-gray-700 text-xs">
                    {currentUser.charAt(0).toUpperCase()}
                </div>
                <div>
                    <span className="text-xs font-bold text-gray-800 block">{currentUser}</span>
                    <span className="text-[10px] text-gray-400 font-medium block">Admin de admins</span>
                </div>
            </div>
            <button
                onClick={onLogout}
                className="w-full flex items-center gap-2.5 px-3 py-2 text-xs font-semibold text-gray-500 hover:bg-red-50 hover:text-red-600 rounded transition-colors"
            >
                <FiLogOut className="text-base" />
                Cerrar Sesión
            </button>
        </div>
    );
}

// --- Componente Principal: Sidebar ---
export default function Sidebar({ view, currentUser, isMobileOpen, onNavigate, onLogout, onCloseMobile }: SidebarProps) {
    return (
        <>
            {/* Sidebar Escritorio */}
            <aside className="hidden lg:flex w-60 bg-white border-r border-gray-200 flex-col justify-between">
                <div>
                    {/* Logo / Marca */}
                    <div className="w-40 m-4 ">
                        <img src="./logo/logo.gif" alt="" />
                    </div>

                    <NavList view={view} onNavigate={onNavigate} />
                </div>

                <UserFooter currentUser={currentUser} onLogout={onLogout} />
            </aside>

            {/* Drawer Móvil */}
            {isMobileOpen && (
                <div
                    className="lg:hidden fixed inset-0 bg-gray-900/40 z-50"
                    onClick={onCloseMobile}
                >
                    <aside
                        className="w-50 bg-white h-full flex flex-col justify-between border-r border-gray-200"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <div>
                            <div className="p-4 border-b border-gray-100 flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                    <img src="./logo/logo.gif" alt="logo" className="w-25" />
                                </div>
                                <button
                                    onClick={onCloseMobile}
                                    className="p-1 text-gray-400 hover:text-gray-600 rounded"
                                >
                                    <FiX className="w-5 h-5" />
                                </button>
                            </div>
                            <NavList view={view} onNavigate={onNavigate} onAfterNavigate={onCloseMobile} />
                        </div>
                        <UserFooter currentUser={currentUser} onLogout={onLogout} />
                    </aside>
                </div>
            )}
        </>
    );
}
