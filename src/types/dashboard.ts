// ─────────────────────────────────────────────────────────────────────────────
// Tipos del sistema ITIL — Sielse
// Basados en el formulario "Registro de Incidentes" del sistema SIELSE Comercial
// ─────────────────────────────────────────────────────────────────────────────

export interface RecordItem {
    // ── Identificación ──────────────────────────────────────────────────────
    id:        string;   // Nro. Incidente (generado automáticamente, ej. TKT-3841)
    status:   'Registrado' | 'En Atención' | 'Resuelto' | 'Cerrado';
    createdAt: string;   // Fecha y hora de registro

    // ── Datos del Solicitante ────────────────────────────────────────────────
    usuario:        string;  // Nombre de usuario del sistema (ej. sielsedoc)
    nombreUsuario:  string;  // Nombre completo (ej. User1)
    empresa:        string;  // Código de la empresa (ej. 1)
    nombreEmpresa:  string;  // Nombre de la empresa (ej. ELECTRO SUR ESTE S.A.A)
    sucursal:       string;  // Código de sucursal (ej. 1)
    nombreSucursal: string;  // Nombre de la sucursal (ej. Cusco)
    area:           string;  // Código de área (ej. 125)
    nombreArea:     string;  // Nombre del área (ej. Atención Clientela)
    anexo:          string;  // Número de anexo telefónico (opcional)
    ip:             string;  // IP del equipo del solicitante (ej. 10.1.1.105)

    // ── Solicitud ────────────────────────────────────────────────────────────
    servicio:       string;  // Servicio ITIL (ej. SIELSE Comercial)
    modulo:         string;  // Módulo del sistema (ej. ATENCION CLIENTELA)
    descripcion:    string;  // Descripción detallada del incidente / solicitud
}

export interface RecordRating {
    id:          string;
    recordId:    string;
    rating:      number;   // 1 a 5 estrellas
    comments:    string;
    recommended: 'si' | 'no';
    createdAt:   string;
}
