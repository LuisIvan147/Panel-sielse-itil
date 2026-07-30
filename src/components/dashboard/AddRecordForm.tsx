"use client";

import React, { useState } from "react";
import { FiSave, FiLoader } from "react-icons/fi";
import { RecordItem } from "@/types/dashboard";

interface AddRecordFormProps {
  onAddRecord: (record: RecordItem) => void;
  onNavigateToSearch: () => void;
}

const INITIAL_FORM = {
  usuario: "",
  nombreUsuario: "",
  empresa: "",
  nombreEmpresa: "",
  sucursal: "",
  nombreSucursal: "",
  area: "",
  nombreArea: "",
  anexo: "",
  ip: "",
  servicio: "",
  modulo: "",
  descripcion: "",
};

type FormState = typeof INITIAL_FORM;
type FormErrors = Partial<Record<keyof FormState, string>>;

const REQUIRED_FIELDS: (keyof FormState)[] = [
  "usuario", "nombreUsuario", "empresa", "nombreEmpresa",
  "sucursal", "nombreSucursal", "area", "nombreArea",
  "ip", "servicio", "modulo", "descripcion",
];

const FIELD_LABELS: Record<keyof FormState, string> = {
  usuario: "Usuario",
  nombreUsuario: "Nombre completo",
  empresa: "Cód. Empresa",
  nombreEmpresa: "Nombre Empresa",
  sucursal: "Cód. Sucursal",
  nombreSucursal: "Nombre Sucursal",
  area: "Cód. Área",
  nombreArea: "Nombre Área",
  anexo: "Anexo",
  ip: "IP del Equipo",
  servicio: "Servicio",
  modulo: "Módulo",
  descripcion: "Descripción",
};

// ── Subcomponente campo inline ────────────────────────────────────────────────
interface FieldProps {
  id: keyof FormState;
  label: string;
  value: string;
  error?: string;
  required?: boolean;
  placeholder?: string;
  disabled?: boolean;
  onChange: (id: keyof FormState, value: string) => void;
  type?: "text" | "textarea";
  colSpan?: "1" | "2" | "3";
}

function Field({ id, label, value, error, required, placeholder, disabled, onChange, type = "text", colSpan = "1" }: FieldProps) {
  const spanClass = colSpan === "3" ? "col-span-3" : colSpan === "2" ? "col-span-2" : "col-span-1";
  const baseInput = `w-full px-2.5 py-1.5 text-xs rounded border transition-colors focus:outline-none focus:border-gray-700 bg-white ${error ? "border-red-300" : "border-gray-200"
    }`;

  return (
    <div className={`flex flex-col gap-0.5 ${spanClass}`}>
      <label htmlFor={id} className="text-[10px] font-semibold text-gray-500 uppercase tracking-wider">
        {label} {required && <span className="text-red-400">*</span>}
      </label>
      {type === "textarea" ? (
        <textarea
          id={id} rows={3} value={value} placeholder={placeholder}
          onChange={(e) => onChange(id, e.target.value)}
          disabled={disabled}
          className={`${baseInput} resize-none`}
        />
      ) : (
        <input
          id={id} type="text" value={value} placeholder={placeholder}
          onChange={(e) => onChange(id, e.target.value)}
          disabled={disabled}
          className={baseInput}
        />
      )}
      {error && <p className="text-[10px] text-red-400 mt-0.5">{error}</p>}
    </div>
  );
}

// ── Componente Principal ──────────────────────────────────────────────────────
export default function AddRecordForm({ onAddRecord, onNavigateToSearch }: AddRecordFormProps) {
  const [form, setForm] = useState<FormState>(INITIAL_FORM);
  const [errors, setErrors] = useState<FormErrors>({});
  const [isLoading, setIsLoading] = useState(false);
  const [successMsg, setSuccessMsg] = useState("");

  const handleChange = (field: keyof FormState, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) setErrors((prev) => ({ ...prev, [field]: "" }));
  };

  const validate = (): boolean => {
    const newErrors: FormErrors = {};
    REQUIRED_FIELDS.forEach((field) => {
      if (!form[field].trim()) newErrors[field] = `${FIELD_LABELS[field]} es obligatorio`;
    });
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    setIsLoading(true);

    setTimeout(() => {
      const newRecord: RecordItem = {
        id: `TKT-${Math.floor(1000 + Math.random() * 9000)}`,
        status: "Registrado",
        createdAt: new Date().toLocaleString("es-ES", {
          day: "2-digit", month: "2-digit", year: "numeric",
          hour: "2-digit", minute: "2-digit",
        }),
        ...form,
      };
      onAddRecord(newRecord);
      setIsLoading(false);
      setSuccessMsg(`Ticket creado: ${newRecord.id}`);
      setForm(INITIAL_FORM);
      setTimeout(() => setSuccessMsg(""), 4000);
    }, 800);
  };

  return (
    <div className="w-full max-w-4xl mx-auto">

      {/* Título */}
      <div className="flex items-center justify-between mb-5 pb-3 border-b border-gray-200">
        <div>
          <h2 className="text-xs font-bold text-gray-800 uppercase tracking-wide">Registro de Incidente</h2>
          <p className="text-[10px] text-gray-400 mt-0.5">Completa los datos para registrar el ticket en el sistema.</p>
        </div>
        <span className="text-[10px] font-semibold bg-gray-100 border border-gray-200 text-gray-500 px-2 py-0.5 rounded">
          Estado: Registrado
        </span>
      </div>

      {/* Mensaje de éxito */}
      {successMsg && (
        <div className="mb-4 p-3 bg-green-50 border border-green-200 rounded text-xs text-green-700 flex justify-between items-center">
          <span>✓ {successMsg}</span>
          <button type="button" onClick={onNavigateToSearch} className="font-bold underline hover:text-green-900">
            Ver en Buscador
          </button>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">

        {/* ── Datos del Solicitante ──────────────────────────────── */}
        <section>
          <p className="text-[9px] font-bold text-gray-400 uppercase tracking-widest mb-3">Datos del Solicitante</p>
          <div className="grid grid-cols-3 gap-x-4 gap-y-3">
            <Field id="usuario" label="sielsedoc" value={form.usuario} error={errors.usuario} required placeholder="sielsedoc" onChange={handleChange} disabled={isLoading} />
            <Field id="nombreUsuario" label="Nombre Completo" value={form.nombreUsuario} error={errors.nombreUsuario} required placeholder="User1" onChange={handleChange} disabled={isLoading} />
            <Field id="ip" label="IP del Equipo" value={form.ip} error={errors.ip} required placeholder="10.1.1.105" onChange={handleChange} disabled={isLoading} />

            <Field id="empresa" label="Empresa" value={form.empresa} error={errors.empresa} required placeholder="1" onChange={handleChange} disabled={isLoading} />
            <Field id="nombreEmpresa" label="Nombre Empresa" value={form.nombreEmpresa} error={errors.nombreEmpresa} required placeholder="ELECTRO SUR ESTE S.A.A" onChange={handleChange} disabled={isLoading} />
            <Field id="anexo" label="Anexo" value={form.anexo} placeholder="(opcional)" onChange={handleChange} disabled={isLoading} />

            <Field id="sucursal" label="Cód. Sucursal" value={form.sucursal} error={errors.sucursal} required placeholder="1" onChange={handleChange} disabled={isLoading} />
            <Field id="nombreSucursal" label="Nombre Sucursal" value={form.nombreSucursal} error={errors.nombreSucursal} required placeholder="Cusco" onChange={handleChange} disabled={isLoading} />
            <Field id="area" label="Área" value={form.area} error={errors.area} required placeholder="125" onChange={handleChange} disabled={isLoading} />

            <Field id="nombreArea" label="Nombre Área" value={form.nombreArea} error={errors.nombreArea} required placeholder="Atención Clientela" onChange={handleChange} disabled={isLoading} colSpan="2" />
          </div>
        </section>

        {/* ── Solicitud ──────────────────────────────────────────── */}
        <section>
          <p className="text-[9px] font-bold text-gray-400 uppercase tracking-widest mb-3">Solicitud</p>
          <div className="grid grid-cols-3 gap-x-4 gap-y-3">
            <Field id="servicio" label="Servicio" value={form.servicio} error={errors.servicio} required placeholder="SIELSE Comercial" onChange={handleChange} disabled={isLoading} />
            <Field id="modulo" label="Módulo" value={form.modulo} error={errors.modulo} required placeholder="ATENCION CLIENTELA - Administrador de Clientes" onChange={handleChange} disabled={isLoading} colSpan="2" />
            <Field id="descripcion" label="Descripción" value={form.descripcion} error={errors.descripcion} required
              placeholder="Describe detalladamente el incidente o solicitud..."
              onChange={handleChange} disabled={isLoading} type="textarea" colSpan="3"
            />
          </div>
        </section>

        {/* ── Acciones ───────────────────────────────────────────── */}
        <div className="flex justify-end gap-2 pt-2 border-t border-gray-100">
          <button
            type="button"
            onClick={() => { setForm(INITIAL_FORM); setErrors({}); setSuccessMsg(""); }}
            disabled={isLoading}
            className="px-4 py-1.5 text-xs font-semibold text-gray-500 border border-gray-200 hover:bg-gray-50 rounded transition-colors"
          >
            Limpiar
          </button>
          <button
            type="submit"
            disabled={isLoading}
            className="px-5 py-1.5 text-xs font-bold text-white bg-gray-900 hover:bg-gray-800 rounded transition-colors flex items-center gap-1.5 disabled:opacity-60"
          >
            {isLoading
              ? <><FiLoader className="animate-spin" /> Registrando...</>
              : <><FiSave /> Registrar</>
            }
          </button>
        </div>

      </form>
    </div>
  );
}
