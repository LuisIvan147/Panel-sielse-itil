"use client";

import React, { useState, useEffect } from "react";
import { RecordItem, RecordRating } from "@/types/dashboard";
import { FiSearch, FiUser, FiMonitor, FiCheckCircle, FiMessageSquare, FiArrowLeft } from "react-icons/fi";

interface RatingFormProps {
  records: RecordItem[];
  ratings: RecordRating[];
  onUpdateStatus: (id: string, newStatus: RecordItem["status"]) => void;
  onAddRating: (rating: RecordRating) => void;
}

const STATUS_STYLES: Record<string, string> = {
  Registrado: "text-gray-700 bg-gray-100 border-gray-300",
  Revisión: "text-gray-700 bg-gray-100 border-gray-300",
  Calificado: "text-gray-700 bg-gray-100 border-gray-300",
  Cerrado: "text-gray-500 bg-gray-50 border-gray-200",
};

export default function RatingForm({ records, ratings, onUpdateStatus, onAddRating }: RatingFormProps) {
  const [selectedRecordId, setSelectedRecordId] = useState<string | null>(records[0]?.id ?? null);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("Todos");
  const [comments, setComments] = useState("");
  const [imagenSeleccionada, setImagenSeleccionada] = useState<string | null>(null);

  // Control de vista en móvil: true = mostrando detalle, false = mostrando lista
  const [showMobileDetail, setShowMobileDetail] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  // Detectar si estamos en móvil según el breakpoint 'lg' de Tailwind (1024px)
  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 1024);
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);

  const selectedRecord = records.find((r) => r.id === selectedRecordId);
  const selectedRating = selectedRecord ? ratings.find((r) => r.recordId === selectedRecord.id) : null;

  const filtered = records.filter((rec) => {
    const q = searchTerm.toLowerCase();
    const matchesSearch =
      rec.id.toLowerCase().includes(q) ||
      rec.nombreUsuario.toLowerCase().includes(q) ||
      rec.servicio.toLowerCase().includes(q);
    const hasRating = ratings.some((r) => r.recordId === rec.id);
    const matchesStatus =
      statusFilter === "Todos" ||
      (statusFilter === "Respondidos" && hasRating) ||
      (statusFilter === "Pendientes" && !hasRating);
    return matchesSearch && matchesStatus;
  });

  const handleSelectRecord = (id: string) => {
    setSelectedRecordId(id);
    const rating = ratings.find((r) => r.recordId === id);
    setComments(rating?.comments ?? "");

    if (isMobile) setShowMobileDetail(true);
  };

  const handleBackToList = () => {
    setShowMobileDetail(false);
    setSelectedRecordId(null);
  };

  const handleSubmitResponse = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedRecordId || !comments.trim()) return;
    onAddRating({
      id: `rat_${Date.now()}`,
      recordId: selectedRecordId,
      rating: 5,
      comments,
      recommended: "si",
      createdAt: new Date().toLocaleString("es-PE", { timeZone: "America/Lima" }),
    });
    onUpdateStatus(selectedRecordId, "Calificado");
    // En móvil, después de guardar podríamos volver a la lista
    if (isMobile) handleBackToList();
  };

  // Contenido del panel de detalle (reutilizado tanto en desktop como en móvil)
  const detailPanel = selectedRecord ? (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center border-b border-gray-200 pb-2">
        <div>
          <h3 className="text-sm font-semibold text-gray-800">Ticket #{selectedRecord.id}</h3>
          <p className="text-[11px] text-gray-500 mt-0.5">Registrado: {selectedRecord.createdAt}</p>
        </div>
        <div className="flex items-center gap-2 mt-2 sm:mt-0">
          <span className="text-[11px] font-medium text-gray-500">Estado:</span>
          <select
            value={selectedRecord.status}
            onChange={(e) => onUpdateStatus(selectedRecord.id, e.target.value as RecordItem["status"])}
            className="text-xs px-2 py-1 border border-gray-300 rounded-sm bg-white focus:outline-none focus:border-gray-600"
          >
            <option value="Registrado">Registrado</option>
            <option value="Revisión">En Revisión</option>
            <option value="Calificado">Calificado</option>
            <option value="Cerrado">Cerrado</option>
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
        <div>
          <span className="text-[10px] font-semibold text-gray-500 uppercase">Solicitante</span>
          <p className="text-gray-800 mt-0.5 flex items-center gap-1">
            <FiUser className="w-3.5 h-3.5 text-gray-400" />
            {selectedRecord.nombreUsuario} <span className="text-gray-400">({selectedRecord.usuario})</span>
          </p>
          <span className="text-[10px] font-semibold text-gray-500 uppercase mt-2 block">Empresa / Sucursal</span>
          <p className="text-gray-800">{selectedRecord.nombreEmpresa} — {selectedRecord.nombreSucursal}</p>
        </div>
        <div>
          <span className="text-[10px] font-semibold text-gray-500 uppercase">Servicio / Módulo</span>
          <p className="text-gray-800 mt-0.5">{selectedRecord.servicio} / {selectedRecord.modulo}</p>
          <span className="text-[10px] font-semibold text-gray-500 uppercase mt-2 block">IP de Origen</span>
          <p className="text-gray-800 font-mono flex items-center gap-1">
            <FiMonitor className="w-3.5 h-3.5 text-gray-400" />
            {selectedRecord.ip}
          </p>
        </div>
      </div>

      <div>
        <span className="text-[10px] font-semibold text-gray-500 uppercase">Descripción de la Incidencia</span>
        <div className="mt-1 p-3 bg-white border border-gray-200 rounded-sm text-xs text-gray-700 whitespace-pre-wrap leading-relaxed">
          {selectedRecord.descripcion}
        </div>
      </div>

      <div>
        <span className="text-[10px] font-semibold text-gray-500 uppercase">Archivos Adjuntos</span>
        {selectedRecord.archivos.length} 
        <div className="mt-1 flex flex-wrap gap-2">
          {selectedRecord.archivos.map((file, index) => (
            <img 
            src={file.url} 
            alt={file.nombre} 
            key={index} 
            onClick={()=> setImagenSeleccionada(file.url)}
            className="w-60 h-70 object-cover rounded" 
            />
          ))}
        </div>
        {imagenSeleccionada && (
          <div className="mt-3">
            <img 
              src={imagenSeleccionada} 
              alt="Imagen Seleccionada" 
              className="w-full h-full object-contain rounded" 
            />
          </div>
        )}
      </div>

      <div className="border-t border-gray-200 pt-3">
        {selectedRating ? (
          <div className="space-y-3">
            <div className="flex justify-between items-start">
              <div className="flex items-center gap-1.5 text-gray-700">
                <FiCheckCircle className="w-4 h-4" />
                <span className="text-xs font-semibold uppercase">Respuesta Registrada</span>
              </div>
              <span className="text-[10px] text-gray-500">{selectedRating.createdAt}</span>
            </div>
            <div className="p-3 bg-white border border-gray-200 rounded-sm text-xs text-gray-700 italic">
              &quot;{selectedRating.comments}&quot;
            </div>
            <button
              onClick={() => {
                setComments(selectedRating.comments);
                onUpdateStatus(selectedRecord.id, "Revisión");
              }}
              className="text-xs font-medium text-gray-700 hover:text-gray-900 flex items-center gap-1"
            >
              <FiMessageSquare className="w-3.5 h-3.5" /> Editar respuesta
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmitResponse} className="space-y-3">
            <label className="text-[10px] font-semibold text-gray-500 uppercase block">
              Añadir Respuesta o Nota
            </label>
            <textarea
              rows={4}
              value={comments}
              onChange={(e) => setComments(e.target.value)}
              placeholder="Describe la solución o comentario..."
              className="w-full px-3 py-2 text-xs border border-gray-300 rounded-sm focus:outline-none focus:border-gray-600 bg-white resize-none"
              required
            />
            <button
              type="submit"
              className="bg-gray-800 hover:bg-gray-900 text-white text-xs font-semibold uppercase px-4 py-1.5 rounded-sm transition-colors"
            >
              Guardar Respuesta
            </button>
          </form>
        )}
      </div>
    </div>
  ) : (
    <div className="flex items-center justify-center h-full text-xs text-gray-400">
      Seleccione un ticket de la lista para ver sus detalles.
    </div>
  );

  return (
    <div className="w-full h-full flex flex-col">

      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 mb-3">
        <div>
          <h2 className="text-sm font-semibold text-gray-800">Gestión de Tickets de Soporte</h2>
          <p className="text-xs text-gray-500 mt-0.5">Visualización, respuesta y cambio de estado</p>
        </div>
        <div className="flex gap-2 items-center w-full sm:w-auto">
          <div className="relative flex-1 sm:flex-initial">
            <FiSearch className="absolute left-2.5 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input
              type="text"
              placeholder="Buscar ticket, usuario o servicio..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-8 pr-3 py-1.5 text-xs border border-gray-300 rounded-sm focus:outline-none focus:border-gray-600 bg-white"
            />
          </div>
          <div className="flex gap-0.5">
            {["Todos", "Pendientes", "Respondidos"].map((tab) => (
              <button
                key={tab}
                onClick={() => setStatusFilter(tab)}
                className={`text-xs font-medium px-3 py-1.5 rounded-sm transition-colors ${
                  statusFilter === tab
                    ? "bg-gray-800 text-white"
                    : "bg-white text-gray-600 border border-gray-300 hover:bg-gray-50"
                }`}
              >
                {tab}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="flex-1 border border-gray-300 rounded-sm bg-white overflow-hidden">
        <div className="hidden lg:grid lg:grid-cols-5 h-full">
          {/* Lista de tickets */}
          <div className="col-span-2 border-r border-gray-200 flex flex-col h-full">
            <div className="grid grid-cols-12 gap-1 px-3 py-2 bg-gray-50 border-b border-gray-200 text-[11px] font-semibold text-gray-600 uppercase tracking-wide">
              <div className="col-span-2">ID</div>
              <div className="col-span-5">Usuario / Servicio</div>
              <div className="col-span-3">Estado</div>
              <div className="col-span-2 text-right">Resp.</div>
            </div>
            <div className="flex-1 overflow-y-auto divide-y divide-gray-100">
              {filtered.length === 0 ? (
                <div className="p-6 text-center text-xs text-gray-400">No se encontraron tickets.</div>
              ) : (
                filtered.map((rec) => {
                  const isSelected = rec.id === selectedRecordId;
                  const hasResponse = ratings.some((r) => r.recordId === rec.id);
                  return (
                    <button
                      key={rec.id}
                      onClick={() => handleSelectRecord(rec.id)}
                      className={`w-full grid grid-cols-12 gap-1 px-3 py-2.5 text-xs text-left transition-colors ${
                        isSelected
                          ? "bg-gray-100 border-l-2 border-gray-800"
                          : "border-l-2 border-transparent hover:bg-gray-50"
                      }`}
                    >
                      <div className="col-span-2 font-mono text-gray-800 font-medium">{rec.id}</div>
                      <div className="col-span-5 truncate">
                        <span className="text-gray-800 font-medium">{rec.nombreUsuario}</span>
                        <span className="text-gray-400 ml-1">— {rec.servicio}</span>
                      </div>
                      <div className="col-span-3">
                        <span className={`inline-block px-1.5 py-0.5 text-[10px] font-medium rounded-sm border ${STATUS_STYLES[rec.status]}`}>
                          {rec.status}
                        </span>
                      </div>
                      <div className="col-span-2 text-right">
                        {hasResponse ? (
                          <span className="text-[10px] text-gray-700 bg-gray-100 border border-gray-300 px-1.5 py-0.5 rounded-sm font-medium">Sí</span>
                        ) : (
                          <span className="text-[10px] text-gray-400 bg-gray-50 border border-gray-200 px-1.5 py-0.5 rounded-sm">—</span>
                        )}
                      </div>
                    </button>
                  );
                })
              )}
            </div>
          </div>

          <div className="col-span-3 p-4 bg-gray-50/30 overflow-y-auto">
            {detailPanel}
          </div>
        </div>

        <div className="lg:hidden h-full relative">
          {!showMobileDetail ? (

            <div className="flex flex-col h-full">
              <div className="grid grid-cols-12 gap-1 px-3 py-2 bg-gray-50 border-b border-gray-200 text-[11px] font-semibold text-gray-600 uppercase tracking-wide">
                <div className="col-span-3">ID</div>
                <div className="col-span-5">Usuario / Servicio</div>
                <div className="col-span-2">Estado</div>
                <div className="col-span-2 text-right">Resp.</div>
              </div>
              <div className="flex-1 overflow-y-auto divide-y divide-gray-100">
                {filtered.length === 0 ? (
                  <div className="p-6 text-center text-xs text-gray-400">No se encontraron tickets.</div>
                ) : (
                  filtered.map((rec) => {
                    const hasResponse = ratings.some((r) => r.recordId === rec.id);
                    return (
                      <button
                        key={rec.id}
                        onClick={() => handleSelectRecord(rec.id)}
                        className="w-full grid grid-cols-12 gap-1 px-3 py-2.5 text-xs text-left border-l-2 border-transparent hover:bg-gray-50"
                      >
                        <div className="col-span-3 font-mono text-gray-800 font-medium">{rec.id}</div>
                        <div className="col-span-5 truncate">
                          <span className="text-gray-800 font-medium">{rec.nombreUsuario}</span>
                          <span className="text-gray-400 ml-1">— {rec.servicio}</span>
                        </div>
                        <div className="col-span-2">
                          <span className={`inline-block px-1.5 py-0.5 text-[10px] font-medium rounded-sm border ${STATUS_STYLES[rec.status]}`}>
                            {rec.status}
                          </span>
                        </div>
                        <div className="col-span-2 text-right">
                          {hasResponse ? (
                            <span className="text-[10px] text-gray-700 bg-gray-100 border border-gray-300 px-1.5 py-0.5 rounded-sm font-medium">Sí</span>
                          ) : (
                            <span className="text-[10px] text-gray-400 bg-gray-50 border border-gray-200 px-1.5 py-0.5 rounded-sm">—</span>
                          )}
                        </div>
                      </button>
                    );
                  })
                )}
              </div>
            </div>
          ) : (
            
            <div className="flex flex-col h-full">
              <div className="flex items-center gap-2 px-4 py-2 bg-gray-50 border-b border-gray-200">
                <button
                  onClick={handleBackToList}
                  className="text-gray-700 hover:text-gray-900 flex items-center gap-1 text-xs font-medium"
                >
                  <FiArrowLeft className="w-4 h-4" />
                  Volver a la lista
                </button>
              </div>
              <div className="flex-1 overflow-y-auto p-4 bg-white">
                {detailPanel}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}