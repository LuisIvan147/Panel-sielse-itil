"use client";

import React, { useState } from "react";
import { FiSearch, FiCalendar, FiInfo, FiStar, FiMonitor } from "react-icons/fi";
import { RecordItem, RecordRating } from "@/types/dashboard";
import { MdDescription } from "react-icons/md";

interface SearchRecordsProps {
    records: RecordItem[];
    ratings: RecordRating[];
    onUpdateStatus: (id: string, newStatus: RecordItem["status"]) => void;
}

export default function SearchRecords({ records, ratings, onUpdateStatus }: SearchRecordsProps) {
    const [searchTerm, setSearchTerm]       = useState("");
    const [statusFilter, setStatusFilter]   = useState<string>("Todos");
    const [servicioFilter, setServicioFilter] = useState<string>("Todos");

    // ── Filtrado ─────────────────────────────────────────────────────────────
    const filteredRecords = records.filter((rec) => {
        const q = searchTerm.toLowerCase();
        const matchesSearch =
            rec.id.toLowerCase().includes(q) ||
            rec.usuario.toLowerCase().includes(q) ||
            rec.nombreUsuario.toLowerCase().includes(q) ||
            rec.descripcion.toLowerCase().includes(q) ||
            rec.servicio.toLowerCase().includes(q);

        const matchesStatus  = statusFilter   === "Todos" || rec.status   === statusFilter;
        const matchesServicio = servicioFilter === "Todos" || rec.servicio === servicioFilter;

        return matchesSearch && matchesStatus && matchesServicio;
    });

    const servicios = Array.from(new Set(records.map((r) => r.servicio)));

    // ── Helpers de estilo ────────────────────────────────────────────────────
    const getTicketRating = (id: string) => ratings.find((r) => r.recordId === id);

    const getStatusStyle = (status: RecordItem["status"]) => {
        switch (status) {
            case "Registrado":  return "";
            case "Revisión": return "";
            case "Calificado":    return "";
            case "Cerrado":     return "";
        }
    };

    return (
        <div className="w-full space-y-4">

            <div className="border-b border-gray-200 pb-3 flex flex-col sm:flex-row justify-between sm:items-center gap-2">
                <div>
                    <h2 className="text-xs font-bold text-gray-800 uppercase tracking-wide">Buscar Registro</h2>
                    <p className="text-[10px] text-gray-400 mt-0.5">Consulta y administra el historial de tickets del sistema.</p>
                </div>
                <span className="text-[10px] text-gray-500 font-semibold bg-gray-100 border border-gray-200 px-2 py-0.5 rounded self-start">
                    Mostrando {filteredRecords.length} de {records.length}
                </span>
            </div>

            <div className="flex flex-col sm:flex-row gap-2">
                <div className="flex-1 relative">
                    <FiSearch className="absolute left-2.5 top-1/2 -translate-y-1/2 text-gray-400 w-3.5 h-3.5" />
                    <input
                        type="text"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        placeholder="Buscar por ID, usuario, servicio o descripción..."
                        className="w-full pl-8 pr-3 py-1.5 rounded border border-gray-200 text-xs focus:outline-none focus:border-gray-800 transition-colors"
                    />
                </div>
                <select
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                    className="px-2 py-1.5 rounded border border-gray-200 bg-white text-xs focus:outline-none focus:border-gray-800"
                >
                    <option value="Todos">Todos los Estados</option>
                    <option value="Registrado">Registrado</option>
                    <option value="En Revisión">Revisión</option>
                    <option value="Calificado">Calificado</option>
                    <option value="Cerrado">Cerrado</option>
                </select>
                <select
                    value={servicioFilter}
                    onChange={(e) => setServicioFilter(e.target.value)}
                    className="px-2 py-1.5 rounded border border-gray-200 bg-white text-xs focus:outline-none focus:border-gray-800"
                >
                    <option value="Todos">Todos los Servicios</option>
                    {servicios.map((s) => <option key={s} value={s}>{s}</option>)}
                </select>
            </div>

            {/* Sin resultados */}
            {filteredRecords.length === 0 ? (
                <div className="bg-white rounded border border-gray-200 p-10 text-center flex flex-col items-center">
                    <FiInfo className="w-6 h-6 text-gray-300 mb-2" />
                    <p className="text-xs text-gray-400">No se encontraron tickets con los filtros actuales.</p>
                </div>
            ) : (
                <div className="space-y-3">
                    <div className="hidden md:block bg-white rounded border border-gray-200 overflow-hidden">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="bg-gray-100 border-b border-gray-300 text-[9px] font-bold text-gray-500 uppercase tracking-wider">
                                    <th className="px-3 py-2.5">Codigo/ Fecha</th>
                                    <th className="px-3 py-2.5">Estado</th>
                                    <th className="px-3 py-2.5">Servicio / Módulo</th>
                                    <th className="px-3 py-2.5">Solicitante / IP</th>
                                    <th className="px-3 py-2.5">Fecha</th>
                                    <th className="px-3 py-2.5">Empresa / Sucursal</th>
                                    <th className="px-3 py-2.5">Descripcion</th>
                                    <th className="px-3 py-2.5">Archivos</th>
                                    {/*<th className="px-3 py-2.5 text-right">Acción</th>*/}
                                    
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100 text-xs text-gray-600">
                                {filteredRecords.map((rec) => {
                                    const ratingInfo = getTicketRating(rec.id);
                                    return (
                                        <tr key={rec.id} className="hover:bg-gray-50/60 transition-colors">
                                            <td className="px-3 py-3 whitespace-nowrap">
                                                <div className="font-bold text-blue-600">{rec.id}</div>
                                                <div className="text-[9px] text-gray-400 flex items-center gap-0.5 mt-0.5">
                                                    <FiCalendar className="w-2.5 h-2.5" /> {rec.createdAt}
                                                </div>
                                            </td>
                                            <td className="px-1 py-3">
                                                <span className={`px-1 text-[10px] font-bold ${getStatusStyle(rec.status)}`}>
                                                    {rec.status}
                                                </span>
                                            </td>
                                            <td className="px-2 py-3 max-w-[180px]">
                                                <div className="text-gray-700 truncate">{rec.servicio}</div>
                                                <div className="text-[9px] text-gray-400 truncate mt-0.5">{rec.modulo}</div>
                                            </td>
                                            <td className="px-2 py-3">
                                                <div className="font-semibold text-gray-800">{rec.nombreUsuario}</div>
                                                <div className="text-[9px] text-gray-400 flex items-center gap-0.5 mt-0.5">
                                                    <FiMonitor className="w-2.5 h-2.5" /> {rec.ip}
                                                </div>
                                            </td>

                                            <td className="px-2 py3">
                                                <div className="font-semibold text-gray-700">{rec.fecha}</div>
                                            </td>

                                            <td className="px-2 py-3">
                                                <div className="text-gray-700">{rec.nombreEmpresa}</div>
                                                <div className="text-[9px] text-gray-400 mt-0.5">{rec.nombreSucursal} — {rec.nombreArea}</div>
                                            </td>

                                            <td className="px-2 py-3 max-w-sm">
                                                <div className="text-gray-600 line-clamp-2">{rec.descripcion}</div>
                                            </td>  

                                             
                                            
                                                <td className="px-3 py-3">
                                                {rec.archivos.length > 0 ? (
                                                    <div className="flex gap-1.5">
                                                    {rec.archivos.map((a) => (
                                                        <a key={a.url} href={a.url} target="_blank" rel="noreferrer" title={a.nombre}>
                                                        <img
                                                            src={a.url}
                                                            alt={a.nombre}
                                                            className="w-9 h-9 object-cover rounded border border-gray-200 hover:opacity-80 transition-opacity"
                                                        />
                                                        </a>
                                                    ))}
                                                    </div>
                                                ) : (
                                                    <span className="text-[10px] text-gray-300">—</span>
                                                )}
                                                </td>

                                            {/*<td className="px-3 py-3 text-right">
                                                <select
                                                    value={rec.status}
                                                    onChange={(e) => onUpdateStatus(rec.id, e.target.value as RecordItem["status"])}
                                                    className="px-1.5 py-0.5 text-[10px] rounded border border-gray-200 bg-white cursor-pointer"
                                                >
                                                    <option value="Registrado">Registrado</option>
                                                    <option value="Revisión">Revisión</option>
                                                    <option value="Calificado">Calificado</option>
                                                    <option value="Cerrado">Cerrado</option>
                                                </select>
                                            </td>*/}
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>

{/* Responsive */}
                    <div className="grid grid-cols-1 gap-2.5 md:hidden">
                        {filteredRecords.map((rec) => {
                            const ratingInfo = getTicketRating(rec.id);
                            return (
                                <div key={rec.id} className="bg-white p-4 rounded border border-gray-200 space-y-2 text-xs">
                                    <div className="flex justify-between items-center">
                                        <span className="font-bold text-blue-600">{rec.id}</span>
                                        <span className={`px-2 py-0.5 text-[9px] font-bold  border ${getStatusStyle(rec.status)}`}>
                                            {rec.status}
                                        </span>
                                    </div>
                                    <div className="grid grid-cols-2 gap-1.5 text-[10px]">
                                        <div><span className="text-gray-400">Usuario: </span><span className="font-medium text-gray-700">{rec.nombreUsuario}</span></div>
                                        <div><span className="text-gray-400">IP: </span><span className="font-medium text-gray-700">{rec.ip}</span></div>
                                        <div><span className="text-gray-400">Empresa: </span><span className="font-medium text-gray-700">{rec.nombreEmpresa}</span></div>
                                        <div><span className="text-gray-400">Sucursal: </span><span className="font-medium text-gray-700">{rec.nombreSucursal}</span></div>
                                        <div><span className="text-gray-400">Área: </span><span className="font-medium text-gray-700">{rec.nombreArea}</span></div>
                                        <div><span className="text-gray-400">Servicio: </span><span className="font-medium text-gray-700">{rec.servicio}</span></div>
                                    </div>
                                    <p className="text-[10px] text-gray-500 italic bg-gray-50 p-2 rounded border border-gray-100">
                                        &quot;{rec.descripcion}&quot;
                                    </p>
                                    {ratingInfo && (
                                        <div className="text-[10px] text-amber-700 bg-amber-50 border border-amber-100 p-1.5 rounded flex items-center gap-1.5">
                                            <FiStar className="fill-amber-400 text-amber-400 w-3 h-3" />
                                            <span className="font-bold">{ratingInfo.rating}/5</span>
                                            {ratingInfo.comments && <span className="italic truncate">{ratingInfo.comments}</span>}
                                        </div>
                                    )}
                                    <div className="flex justify-between items-center pt-1.5 border-t border-gray-100">
                                        <span className="text-[10px] text-gray-400">{rec.createdAt}</span>
                                        <select
                                            value={rec.status}
                                            onChange={(e) => onUpdateStatus(rec.id, e.target.value as RecordItem["status"])}
                                            className="px-1.5 py-0.5 text-[10px] rounded border border-gray-200 bg-white"
                                        >
                                            <option value="Registrado">Registrado</option>
                                            <option value="Revisión">Revisión</option>
                                            <option value="Calificado">Calificado</option>
                                            <option value="Cerrado">Cerrado</option>
                                        </select>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>
            )}
        </div>
    );
}
