import React, { useState } from 'react';
import { 
  X, 
  Laptop, 
  Calendar, 
  MapPin, 
  User, 
  Wrench, 
  CheckCircle2, 
  FileText, 
  Cpu, 
  HardDrive, 
  History, 
  Download,
  QrCode,
  AlertCircle
} from 'lucide-react';
import { useData } from '../../context/DataContext';
import { generateMaintenancePDF } from '../../lib/pdfGenerator';
import { AssetQrModal } from './AssetQrModal';

export const AssetDetailModal = ({ asset, isOpen, onClose, onExecuteMaintenance }) => {
  const { categorias, sedes, mantenimientos } = useData();
  const [isQrModalOpen, setIsQrModalOpen] = useState(false);

  if (!isOpen || !asset) return null;

  const categoria = categorias.find(c => c.id === asset.categoria_id);
  const sede = sedes.find(s => s.id === asset.sede_id);
  const historialMantenimientos = mantenimientos.filter(m => m.activo_id === asset.id);

  const getStatusBadge = (status) => {
    switch (status) {
      case 'OPERATIVO':
        return <span className="bg-emerald-100 text-emerald-800 text-xs font-bold px-2.5 py-0.5 rounded-full border border-emerald-300">🟢 Operativo</span>;
      case 'EN_MANTENIMIENTO':
        return <span className="bg-amber-100 text-amber-800 text-xs font-bold px-2.5 py-0.5 rounded-full border border-amber-300">🟡 En Mantenimiento</span>;
      case 'EN_REVISION':
        return <span className="bg-blue-100 text-blue-800 text-xs font-bold px-2.5 py-0.5 rounded-full border border-blue-300">🔵 En Revisión</span>;
      case 'DE_BAJA':
        return <span className="bg-rose-100 text-rose-800 text-xs font-bold px-2.5 py-0.5 rounded-full border border-rose-300">🔴 De Baja</span>;
      default:
        return <span className="bg-slate-100 text-slate-800 text-xs font-bold px-2.5 py-0.5 rounded-full">{status}</span>;
    }
  };

  return (
    <>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm overflow-y-auto">
        <div className="bg-white rounded-2xl shadow-2xl max-w-3xl w-full max-h-[90vh] flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-150">
          
          {/* Header */}
          <div className="px-6 py-4 bg-slate-900 text-white flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center border border-emerald-500/30">
                <Laptop className="w-5 h-5" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-mono font-bold bg-emerald-500 text-slate-950 px-2 py-0.5 rounded">
                    {asset.codigo_inventario}
                  </span>
                  <span className="text-xs text-slate-400">S/N: {asset.serial}</span>
                </div>
                <h3 className="text-base font-bold text-white mt-0.5">{asset.nombre}</h3>
              </div>
            </div>
            
            <div className="flex items-center gap-2">
              <button onClick={onClose} className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800">
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Content */}
          <div className="p-6 overflow-y-auto space-y-6 flex-1">
            
            {/* Fila superior: Estado y fechas */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 bg-slate-50 p-4 rounded-xl border border-slate-200">
              <div>
                <span className="text-[11px] font-bold text-slate-500 uppercase">Estado Actual</span>
                <div className="mt-1">{getStatusBadge(asset.estado)}</div>
              </div>

              <div>
                <span className="text-[11px] font-bold text-slate-500 uppercase">Último Mantenimiento</span>
                <p className="text-xs font-bold text-slate-800 mt-1 flex items-center gap-1">
                  <Calendar className="w-3.5 h-3.5 text-emerald-600" />
                  {asset.ultimo_mantenimiento || 'Sin registro previo'}
                </p>
              </div>

              <div>
                <span className="text-[11px] font-bold text-slate-500 uppercase">Próximo Programado</span>
                <p className="text-xs font-bold text-purple-700 mt-1 flex items-center gap-1">
                  <Calendar className="w-3.5 h-3.5 text-purple-600" />
                  {asset.proximo_mantenimiento || 'Por programar'}
                </p>
              </div>
            </div>

            {/* Fotografía del equipo */}
            {asset.imagen_url && (
              <div className="bg-slate-50 p-3 rounded-xl border border-slate-200 flex flex-col items-center justify-center">
                <span className="text-[10px] font-bold text-slate-500 uppercase self-start mb-1.5">Fotografía del Equipo Registrado</span>
                <img 
                  src={asset.imagen_url} 
                  alt={asset.nombre} 
                  className="max-h-48 rounded-lg border border-slate-200 object-contain"
                />
              </div>
            )}

            {/* Información General & Ubicación */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider">Ubicación y Asignación</h4>
                <div className="text-xs space-y-1.5 bg-white p-3 rounded-lg border border-slate-200">
                  <p className="flex items-center gap-2 text-slate-700">
                    <MapPin className="w-3.5 h-3.5 text-slate-400" />
                    <span><strong>Sede:</strong> {sede?.nombre} ({sede?.ciudad})</span>
                  </p>
                  <p className="flex items-center gap-2 text-slate-700">
                    <MapPin className="w-3.5 h-3.5 text-slate-400" />
                    <span><strong>Ubicación Detalle:</strong> {asset.ubicacion_detalle || 'N/A'}</span>
                  </p>
                  <p className="flex items-center gap-2 text-slate-700">
                    <User className="w-3.5 h-3.5 text-slate-400" />
                    <span><strong>Responsable:</strong> {asset.responsable || 'Área TICS'}</span>
                  </p>
                </div>
              </div>

              <div className="space-y-2">
                <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider">Detalles de Fabricante</h4>
                <div className="text-xs space-y-1.5 bg-white p-3 rounded-lg border border-slate-200">
                  <p className="text-slate-700"><strong>Marca:</strong> {asset.marca}</p>
                  <p className="text-slate-700"><strong>Modelo:</strong> {asset.modelo}</p>
                  <p className="text-slate-700"><strong>Categoría:</strong> {categoria?.nombre}</p>
                  <p className="text-slate-700"><strong>Frecuencia Prev.:</strong> Cada {asset.frecuencia_mantenimiento_meses} meses</p>
                </div>
              </div>
            </div>

            {/* Ficha Técnica Hardware/Software */}
            {asset.especificaciones && (
              <div>
                <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                  <Cpu className="w-4 h-4 text-emerald-600" />
                  <span>Ficha Técnica y Especificaciones Lógicas</span>
                </h4>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 bg-slate-50 p-3 rounded-xl border border-slate-200 text-xs">
                  {Object.entries(asset.especificaciones).map(([k, v]) => (
                    <div key={k} className="p-2 bg-white rounded border border-slate-200">
                      <span className="text-[10px] uppercase font-bold text-slate-400 block">{k}</span>
                      <span className="font-semibold text-slate-800 truncate block">{String(v)}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Historial de Mantenimientos */}
            <div>
              <div className="flex items-center justify-between mb-3">
                <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center gap-1.5">
                  <History className="w-4 h-4 text-emerald-600" />
                  <span>Historial de Mantenimientos Realizados ({historialMantenimientos.length})</span>
                </h4>
              </div>

              {historialMantenimientos.length === 0 ? (
                <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl text-center text-xs text-slate-500">
                  Este equipo no registra mantenimientos previos aún.
                </div>
              ) : (
                <div className="space-y-2">
                  {historialMantenimientos.map((m) => (
                    <div 
                      key={m.id} 
                      className="p-3.5 bg-slate-50 hover:bg-emerald-50/50 border border-slate-200 rounded-xl flex items-center justify-between gap-3 text-xs transition-colors"
                    >
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-mono font-bold text-emerald-700">{m.codigo_acta}</span>
                          <span className="font-bold text-slate-800">{m.fecha_ejecucion}</span>
                          <span className="text-slate-500">• {m.tiempo_minutos} min</span>
                        </div>
                        <p className="text-slate-600 mt-1">
                          <strong>Técnico:</strong> {m.tecnico_nombre}
                        </p>
                        <p className="text-slate-500 text-[11px] line-clamp-1 mt-0.5">
                          {m.diagnostico}
                        </p>
                      </div>

                      <button
                        onClick={() => generateMaintenancePDF(m, asset, sede)}
                        className="flex items-center gap-1 px-3 py-1.5 bg-white hover:bg-slate-100 text-slate-700 border border-slate-300 rounded-lg text-xs font-semibold shrink-0 transition-colors"
                        title="Descargar Acta Oficial en PDF"
                      >
                        <Download className="w-3.5 h-3.5 text-emerald-600" />
                        <span>Acta PDF</span>
                      </button>
                    </div>
                  ))}
                </div>
              )}
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
              onClick={() => {
                onClose();
                onExecuteMaintenance(asset);
              }}
              className="flex items-center gap-2 px-5 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold rounded-lg shadow-md transition-all active:scale-95"
            >
              <Wrench className="w-4 h-4" />
              <span>Ejecutar Mantenimiento a este Activo</span>
            </button>
          </div>

        </div>
      </div>

      {isQrModalOpen && (
        <AssetQrModal
          asset={asset}
          isOpen={isQrModalOpen}
          onClose={() => setIsQrModalOpen(false)}
        />
      )}
    </>
  );
};
