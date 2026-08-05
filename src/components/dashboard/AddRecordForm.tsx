"use client";

import React, { useState, type ReactNode } from "react";
import { FiSave, FiLoader, FiFile, FiX, FiUpload } from "react-icons/fi";
import { RecordItem, ArchivoAdjunto } from "@/types/dashboard";
import { InputHTMLAttributes, SelectHTMLAttributes } from "react";

interface AddRecordFormProps {
  onAddRecord: (record: RecordItem) => void;
  onNavigateToSearch: () => void;
}

//Configuracion fecha con el dia de hoy
const hoy = new Date().toLocaleDateString("en-CA",{timeZone:"America/Lima"});

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
  fecha: hoy,
  descripcion: "",
  archivos: [] as ArchivoAdjunto[],
};

type FormState = typeof INITIAL_FORM;
type TextFieldKey = Exclude<keyof FormState, "archivos">;
type FormErrors = Partial<Record<TextFieldKey, string>>;

const REQUIRED_FIELDS: TextFieldKey[] = [
  "usuario", "nombreUsuario", "empresa", "nombreEmpresa",
  "sucursal", "nombreSucursal", "area", "nombreArea",
  "ip", "servicio", "modulo", "descripcion",
];

const FIELD_LABELS: Record<TextFieldKey, string> = {
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
  fecha: "Fecha",
  descripcion: "Descripción",
};

// ── Subcomponentes del formulario ─────────────────────────────────────────────

interface FieldProps {
  id: string;
  label: string;
  error?: string;
  required?: boolean;
  colSpan?: "1" | "2" | "3";
  children?: ReactNode;
}

function Field({ id, label, error, required, colSpan = "1", children }: FieldProps) {
  const spanClass = colSpan === "3" ? "col-span-3" : colSpan === "2" ? "col-span-2" : "col-span-1";

  return (
    <div className={`flex flex-col gap-0.5 ${spanClass}`}>
      <label htmlFor={id} className="text-[10px] font-semibold text-gray-500 uppercase tracking-wider">
        {label} {required && <span className="text-red-400">*</span>}
      </label>
      {React.isValidElement<{ error?: boolean }>(children)
        ? React.cloneElement(children, { error: Boolean(error) })
        : children}
      {error && <p className="text-[10px] text-red-400 mt-0.5">{error}</p>}
    </div>
  );
}

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  error?: boolean;
  numeric?: boolean;
}

function Input({ id, name, value, placeholder, onChange, disabled, error, numeric, maxLength, type = "text", ...rest }: InputProps) {
  const handleChange = numeric
    ? (e: React.ChangeEvent<HTMLInputElement>) => {
        const next = e.target.value.replace(/\D/g, "");
        onChange?.({ ...e, target: { ...e.target, name: name ?? "", value: next } });
      }
    : onChange;

  return (
    <input
      {...rest}
      id={id}
      name={name}
      type={type}
      inputMode={numeric ? "numeric" : rest.inputMode}
      value={value}
      placeholder={placeholder}
      onChange={handleChange}
      maxLength={maxLength ?? 100}
      disabled={disabled}
      className={`w-full px-2.5 py-1.5 text-xs rounded border transition-colors focus:outline-none focus:border-gray-700 bg-white ${error ? "border-red-300" : "border-gray-200"
        }`}
    />
  );
}

interface TextareaProps {
  id: string;
  name?: string;
  value: string;
  placeholder?: string;
  rows?: number;
  maxLength?: number;
  onChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  disabled?: boolean;
  error?: boolean;
}

function Textarea({ id, name, value, placeholder, rows = 3, maxLength, onChange, disabled, error }: TextareaProps) {
  return (
    <textarea
      id={id}
      name={name}
      rows={rows}
      maxLength={maxLength ?? 100}
      value={value}
      placeholder={placeholder}
      onChange={onChange}
      disabled={disabled}
      className={`w-full px-2.5 py-1.5 text-xs rounded border transition-colors focus:outline-none focus:border-gray-700 bg-white resize-none ${error ? "border-red-300" : "border-gray-200"
        }`}
    />
  );
}

interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  error?: boolean;
  children?: ReactNode;
}

function Select({ id, name, value, onChange, disabled, error, children, ...rest }: SelectProps) {
  return (
    <select
      {...rest}
      id={id}
      name={name}
      value={value}
      onChange={onChange}
      disabled={disabled}
      className={`w-full px-2.5 py-1.5 text-xs rounded border transition-colors focus:outline-none focus:border-gray-700 bg-white ${error ? "border-red-300" : "border-gray-200"
        }`}
    >
      {children}
    </select>
  );
}

// ── Componente Principal ──────────────────────────────────────────────────────
export default function AddRecordForm({ onAddRecord, onNavigateToSearch }: AddRecordFormProps) {
  const [form, setForm] = useState<FormState>(INITIAL_FORM);
  const [errors, setErrors] = useState<FormErrors>({});
  const [isLoading, setIsLoading] = useState(false);
  const [successMsg, setSuccessMsg] = useState("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const field = e.target.name as TextFieldKey;
    setForm((prev) => ({ ...prev, [field]: e.target.value }));
    if (errors[field]) setErrors((prev) => ({ ...prev, [field]: "" }));
  };

  const handleAddFiles = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files ?? []);
    if (files.length === 0) return;
    setForm((prev) => ({
      ...prev,
      archivos: [
        ...prev.archivos,
        ...files.map((f) => ({ nombre: f.name, tamano: f.size, tipo: f.type })),
      ],
    }));
    e.target.value = "";
  };

  const handleRemoveFile = (nombre: string) => {
    setForm((prev) => ({
      ...prev,
      archivos: prev.archivos.filter((a) => a.nombre !== nombre),
    }));
  };

  const formatSize = (bytes: number) =>
    bytes < 1024 ? `${bytes} B` : bytes < 1024 * 1024 ? `${(bytes / 1024).toFixed(1)} KB` : `${(bytes / (1024 * 1024)).toFixed(1)} MB`;

  const formatFecha = (iso: string) => {
    const [year, month, day] = iso.split("-");
    return `${day}/${month}/${year}`;
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
        id: `000102026${Math.floor(10 + Math.random() * 90)}`,
        status: "Registrado",
        createdAt: new Date().toLocaleString("es-ES", {
          day: "2-digit", month: "2-digit", year: "numeric",
          hour: "2-digit", minute: "2-digit",
        }),
        ...form,
        fecha: form.fecha ? formatFecha(form.fecha) : "",
      };
      onAddRecord(newRecord);
      setIsLoading(false);
      setSuccessMsg(`Ticket creado: ${newRecord.id}`);
      setForm(INITIAL_FORM);
      setTimeout(() => setSuccessMsg(""), 4000);
    }, 800);
  };

  return (
    <div className="w-full max-w-5xl mx-auto">

      {/* Título de los titulos  */}
      <div className="flex items-center justify-between mb-5 pb-3 border-b border-gray-200">
        <div>
          <h2 className="text-xs font-bold text-gray-800 uppercase tracking-wide">Registro de Incidente</h2>
          <p className="text-[10px] text-gray-400 mt-0.5">Completa los datos para registrar el ticket en el sistema.</p>
        </div>
        <span className="text-[10px] font-semibold bg-gray-100 border border-gray-200 text-gray-500 px-2 py-0.5 rounded">
          Estado: Nuevo Registro
        </span>
      </div>

      {successMsg && (
        <div className="mb-4 p-3 bg-green-50 border border-green-200 rounded text-xs text-green-700 flex justify-between items-center">
          <span>✓ {successMsg}</span>
          <button type="button" onClick={onNavigateToSearch} className="font-bold underline hover:text-green-900">
            Ver en Buscador
          </button>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">

        {/* ── Datos del Solicitante ────────────────────────────────____ */}
        <section>
          <p className="text-[9px] font-bold text-gray-400 uppercase tracking-widest mb-3">Datos del Solicitante</p>
          <div className="grid grid-cols-3 gap-x-4 gap-y-3">
            <Field 
            id="usuario" 
            label="sielsedoc" 
            error={errors.usuario} 
            required
            >
                <Input 
                  id="usuario"
                  name="usuario" 
                  value={form.usuario} 
                  placeholder="sielsedoc" 
                  onChange={handleChange}
                  disabled={isLoading}
                />
            </Field>
            <Field id="nombreUsuario" label="Nombre Completo" error={errors.nombreUsuario} required>
              <Input id="nombreUsuario" name="nombreUsuario" value={form.nombreUsuario} placeholder="User1" onChange={handleChange} disabled={isLoading}/>
            </Field>
            <Field id="ip" label="IP del Equipo" error={errors.ip} required>
              <Input id="ip" 
              name="ip" 
              value={form.ip} 
              placeholder="10.1.1.105" 
              onChange={handleChange} 
              disabled={isLoading}
              numeric
              />
            </Field>

            <Field id="empresa" label="Empresa" error={errors.empresa} required>
              <Input id="empresa" name="empresa" value={form.empresa} placeholder="1" onChange={handleChange} disabled={isLoading} />
            </Field>
            <Field id="nombreEmpresa" label="Nombre Empresa" error={errors.nombreEmpresa} required>
              <Input 
              id="nombreEmpresa" 
              name="nombreEmpresa"  
              value={form.nombreEmpresa} 
              placeholder="ELECTRO SUR ESTE S.A.A" 
              onChange={handleChange} 
              disabled={isLoading} />
            </Field>
            <Field id="anexo" label="Anexo">
              <Input id="anexo" name="anexo" value={form.anexo} placeholder="(xd)" onChange={handleChange} disabled={isLoading} />
            </Field>

            <Field id="sucursal" label="Cód. Sucursal" error={errors.sucursal} required>
              <Input id="sucursal" 
              name="sucursal" 
              value={form.sucursal} 
              placeholder="1" 
              onChange={handleChange} 
              disabled={isLoading} 
              numeric
              />
            </Field>
            <Field id="nombreSucursal" label="Nombre Sucursal" error={errors.nombreSucursal} required>
              <Input id="nombreSucursal" name="nombreSucursal" value={form.nombreSucursal} placeholder="Cusco/Arequipa/Puno...." onChange={handleChange} disabled={isLoading} />
            </Field>
            <Field id="area" label="Área" error={errors.area} required>
              <Input 
              id="area" 
              name="area" 
              value={form.area} 
              placeholder="125" 
              onChange={handleChange} disabled={isLoading} 
              numeric
              />
            </Field>

            <Field id="nombreArea" label="Nombre Área" error={errors.nombreArea} required colSpan="2">
              <Input 
              id="nombreArea" 
              name="nombreArea" 
              value={form.nombreArea} 
              placeholder="Atención Clientela" 
              onChange={handleChange} 
              disabled={isLoading}
              />
            </Field>

            <div></div>
          </div>
        </section>

        {/* ── Solicitud ──────────────────────────────────────────── */}
        <section>
          <p className="text-[9px] font-bold text-gray-400 uppercase tracking-widest mb-3">Solicitud</p>
          <div className="grid grid-cols-3 gap-x-4 gap-y-3">
            <Field id="servicio" label="Servicio" error={errors.servicio} required>
              <Select id="servicio" name="servicio" value={form.servicio} onChange={handleChange} disabled={isLoading}>
                <option value="">Seleccionar servicio</option>
                <option value="SIELSE Comercial">SIELSE Comercial</option>
                <option value="SIELSE ADMINISTRATIVO">SIELSE ADMINISTRATIVO</option>
                <option value="Gos">Gos</option>
              </Select>
            </Field>
            <Field id="modulo" label="Módulo" error={errors.modulo} required colSpan="2">
              <Input id="modulo" name="modulo" value={form.modulo} placeholder="ATENCION CLIENTELA - Administrador de Clientes" onChange={handleChange} disabled={isLoading} maxLength={120} />
            </Field>
            <Field id="fecha" label="Fecha" required>
              <Input
              id="fecha"
              name="fecha" 
              type="date"
              value={form.fecha}
              disabled
              />
            </Field>
            <Field id="descripcion" label="Descripción" error={errors.descripcion} required colSpan="3">
              <Textarea id="descripcion" name="descripcion" value={form.descripcion}
                placeholder="Describe detalladamente el incidente o solicitud..."
                onChange={handleChange} disabled={isLoading} maxLength={250} />
            </Field>

            <div className="col-span-3 flex flex-col gap-2">
              <label htmlFor="archivos" className="text-[10px] font-semibold text-gray-500 uppercase tracking-wider">
                Archivos adjuntos
              </label>
              <label
                htmlFor="archivos"
                className={`flex items-center justify-center gap-2 px-3 py-4 rounded border-2 border-dashed cursor-pointer transition-colors ${
                  isLoading ? "opacity-60 pointer-events-none" : "border-gray-300 bg-gray-50/50 hover:border-gray-400 hover:bg-gray-50"
                }`}
              >
                <FiUpload className="w-4 h-4 text-gray-400" />
                <span className="text-xs text-gray-500">
                  Haz clic para seleccionar archivos (opcional)
                </span>
              </label>
              <input
                id="archivos"
                type="file"
                multiple
                className="sr-only"
                disabled={isLoading}
                onChange={handleAddFiles}
              />
              {form.archivos.length > 0 && (
                <ul className="flex flex-col gap-1.5">
                  {form.archivos.map((file) => (
                    <li key={file.nombre} className="flex items-center gap-2 px-2.5 py-1.5 rounded border border-gray-200 bg-white text-xs">
                      <FiFile className="w-3.5 h-3.5 text-blue-500 shrink-0" />
                      <span className="text-gray-700 truncate flex-1">{file.nombre}</span>
                      <span className="text-[9px] text-gray-400 shrink-0">{formatSize(file.tamano)}</span>
                      <button
                        type="button"
                        onClick={() => handleRemoveFile(file.nombre)}
                        disabled={isLoading}
                        className="text-gray-400 hover:text-red-500 shrink-0"
                        aria-label={`Quitar ${file.nombre}`}
                      >
                        <FiX className="w-3.5 h-3.5" />
                      </button>
                    </li>
                  ))}
                </ul>
              )}
            </div>
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
