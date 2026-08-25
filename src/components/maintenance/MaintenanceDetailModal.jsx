import React from 'react';
import { 
  X, 
  Wrench, 
  Calendar, 
  User, 
  Clock, 
  CheckCircle2, 
  Download, 
  FileText, 
  Camera, 
  Laptop 
} from 'lucide-react';
import { useData } from '../../context/DataContext';
import { generateMaintenancePDF } from '../../lib/pdfGenerator';

export const MaintenanceDetailModal = ({ mantenimiento, isOpen, onClose }) => {
  const { activos, sedes } = useData();

  if (!isOpen || !mantenimiento) return null;

  const activo = activos.find(a => a.id === mantenimiento.activo_id);
  const sede = sedes.find(s => s.id === activo?.sede_id);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm overflow-y-auto">
      <div className="bg-white rounded-2xl shadow-2xl max-w-3xl w-full max-h-[90vh] flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        
        {/* Header */}
        <div className="px-6 py-4 bg-emerald-900 text-white flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-500 text-slate-950 flex items-center justify-center font-bold">
              <Wrench className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-mono font-bold bg-white text-emerald-950 px-2 py-0.5 rounded">
                  {mantenimiento.codigo_acta}
                </span>
                <span className="text-xs text-emerald-200">Tipo: {mantenimiento.tipo}</span>
              </div>
              <h3 className="text-base font-bold text-white mt-0.5">
                Acta de Mantenimiento Preventivo
              </h3>
            </div>
          </div>
          
          <button onClick={onClose} className="p-1.5 text-emerald-200 hover:text-white rounded-lg hover:bg-emerald-800">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <div className="p-6 overflow-y-auto space-y-5 flex-1 text-xs">
          
          {/* Fila superior */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 bg-slate-50 p-3.5 rounded-xl border border-slate-200">
            <div>
              <span className="text-slate-400 font-bold block uppercase text-[10px]">Fecha Ejecución</span>
              <p className="font-bold text-slate-800 flex items-center gap-1 mt-0.5">
                <Calendar className="w-3.5 h-3.5 text-emerald-600" />
                {mantenimiento.fecha_ejecucion}
              </p>
            </div>

            <div>
              <span className="text-slate-400 font-bold block uppercase text-[10px]">Técnico Responsable</span>
              <p className="font-bold text-slate-800 flex items-center gap-1 mt-0.5">
                <User className="w-3.5 h-3.5 text-emerald-600" />
                {mantenimiento.tecnico_nombre}
              </p>
            </div>

            <div>
              <span className="text-slate-400 font-bold block uppercase text-[10px]">Duración</span>
              <p className="font-bold text-slate-800 flex items-center gap-1 mt-0.5">
                <Clock className="w-3.5 h-3.5 text-emerald-600" />
                {mantenimiento.tiempo_minutos} Minutos
              </p>
            </div>

            <div>
              <span className="text-slate-400 font-bold block uppercase text-[10px]">Estado Final</span>
              <span className="inline-block mt-0.5 font-bold text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded">
                {mantenimiento.estado_final_equipo || 'OPERATIVO'}
              </span>
            </div>
          </div>

          {/* Datos del Activo */}
          <div className="p-3.5 bg-white border border-slate-200 rounded-xl space-y-1">
            <h4 className="font-bold text-slate-800 uppercase text-[11px] flex items-center gap-1.5 mb-2">
              <Laptop className="w-4 h-4 text-emerald-600" />
              <span>Activo Intervenido</span>
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-slate-700">
              <p><strong>Equipo:</strong> {activo?.nombre} ({activo?.marca} {activo?.modelo})</p>
              <p><strong>Placa / Serial:</strong> {activo?.codigo_inventario} / {activo?.serial}</p>
              <p><strong>Sede:</strong> {sede?.nombre} ({sede?.ciudad})</p>
              <p><strong>Ubicación:</strong> {activo?.ubicacion_detalle || 'General'}</p>
            </div>
          </div>

          {/* Checklist de Actividades */}
          <div>
            <h4 className="font-bold text-slate-800 uppercase text-[11px] mb-2">
              Checklist y Protocolo Verificado ({mantenimiento.checklist?.length || 0} ítems)
            </h4>
            <div className="space-y-1.5 bg-slate-50 p-3 rounded-xl border border-slate-200 max-h-48 overflow-y-auto">
              {mantenimiento.checklist?.map((c, i) => (
                <div key={i} className="flex items-center gap-2 text-slate-700 bg-white p-2 rounded border border-slate-100">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                  <span className="font-medium">{c.tarea || c}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Diagnóstico & Observaciones */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200">
              <h5 className="font-bold text-slate-800 uppercase text-[10px] mb-1">Diagnóstico Inicial</h5>
              <p className="text-slate-600 leading-relaxed">{mantenimiento.diagnostico}</p>
            </div>
            <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200">
              <h5 className="font-bold text-slate-800 uppercase text-[10px] mb-1">Actividades Realizadas</h5>
              <p className="text-slate-600 leading-relaxed">{mantenimiento.actividades_realizadas}</p>
            </div>
          </div>

          {/* Evidencias Fotográficas */}
          {mantenimiento.evidencias && mantenimiento.evidencias.length > 0 && (
            <div>
              <h4 className="font-bold text-slate-800 uppercase text-[11px] mb-2 flex items-center gap-1.5">
                <Camera className="w-4 h-4 text-emerald-600" />
                <span>Evidencias Fotográficas Registradas en Sitio</span>
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {mantenimiento.evidencias.map((ev, idx) => (
                  <div key={idx} className="border border-slate-200 rounded-xl overflow-hidden bg-slate-50">
                    <img src={ev.url_archivo} alt={ev.descripcion} className="w-full h-32 object-cover" />
                    <div className="p-2">
                      <span className="text-[10px] font-bold text-zinc-800 bg-zinc-100 px-1.5 py-0.5 rounded border border-zinc-200">
                        {ev.tipo === 'FOTO_ANTES' ? '📸 1. Antes' :
                         ev.tipo === 'FOTO_DURANTE' ? '🔧 2. Durante' :
                         '✨ 3. Después'}
                      </span>
                      <p className="text-[11px] text-slate-600 mt-1 line-clamp-2">{ev.descripcion}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Conformidad */}
          <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl flex items-center justify-between">
            <div>
              <span className="text-[10px] font-bold text-emerald-800 uppercase">Recibido a Conformidad por</span>
              <p className="font-bold text-emerald-950 text-xs">{mantenimiento.conformidad_usuario || activo?.responsable || 'Usuario / Supervisor'}</p>
            </div>
            <span className="text-xs font-bold text-emerald-700 bg-white px-2.5 py-1 rounded-lg border border-emerald-200">
              Certificado Válido
            </span>
          </div>

        </div>

        {/* Footer */}
        <div className="px-6 py-4 bg-slate-50 border-t border-slate-200 flex items-center justify-between">
          <button
            onClick={onClose}
            className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-200 rounded-lg transition-colors"
          >
            Cerrar
          </button>

          <button
            onClick={() => generateMaintenancePDF(mantenimiento, activo, sede)}
            className="flex items-center gap-2 px-5 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold rounded-lg shadow-md transition-all active:scale-95"
          >
            <Download className="w-4 h-4" />
            <span>Descargar Acta PDF</span>
          </button>
        </div>

      </div>
    </div>
  );
};
