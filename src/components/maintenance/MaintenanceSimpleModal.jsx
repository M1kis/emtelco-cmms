import React, { useState, useEffect } from 'react';
import { 
  X, 
  Wrench, 
  CheckCircle2, 
  Download, 
  FileText,
  Clock,
  Calendar,
  Layers
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { useData } from '../../context/DataContext';
import { useAuth } from '../../context/AuthContext';
import { generateMaintenancePDF } from '../../lib/pdfGenerator';

const DEFAULT_TASKS = [
  'Limpieza física interna y externa (soplado y eliminación de polvo)',
  'Actualización de parches del sistema operativo y antivirus',
  'Diagnóstico de salud del disco y memoria',
  'Verificación de temperatura y ventiladores',
  'Prueba de conectividad y periféricos'
];

export const MaintenanceSimpleModal = ({ isOpen, onClose, preselectedAsset = null }) => {
  const { activos, sedes, executeMantenimiento } = useData();
  const { currentUser } = useAuth();

  const [selectedAssetId, setSelectedAssetId] = useState(preselectedAsset?.id || (activos[0]?.id || ''));
  const [technicianName, setTechnicianName] = useState(currentUser?.nombre || 'Miguel Rueda');
  const [fechaEjecucion, setFechaEjecucion] = useState(new Date().toISOString().split('T')[0]);
  const [tiempoMinutos, setTiempoMinutos] = useState(45);
  const [estadoFinal, setEstadoFinal] = useState('OPERATIVO');
  const [conformidadUsuario, setConformidadUsuario] = useState('');
  
  const [checklist, setChecklist] = useState(DEFAULT_TASKS.map(t => ({ tarea: t, hecho: true })));
  const [diagnostico, setDiagnostico] = useState('Mantenimiento preventivo periódico ejecutado sin novedades.');
  const [actividades, setActividades] = useState('Limpieza física, optimización de archivos temporales y prueba de funcionamiento general.');
  const [observaciones, setObservaciones] = useState('Equipo operativo y en óptimas condiciones.');

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [completedMantenimiento, setCompletedMantenimiento] = useState(null);

  useEffect(() => {
    if (preselectedAsset) {
      setSelectedAssetId(preselectedAsset.id);
      if (preselectedAsset.responsable) {
        setConformidadUsuario(preselectedAsset.responsable);
      }
    }
  }, [preselectedAsset]);

  if (!isOpen) return null;

  const currentAsset = activos.find(a => a.id === selectedAssetId);
  const currentSede = sedes.find(s => s.id === currentAsset?.sede_id);

  const handleToggleTask = (index) => {
    setChecklist(prev => prev.map((item, idx) => idx === index ? { ...item, hecho: !item.hecho } : item));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const mantenimientoData = {
        activo_id: selectedAssetId,
        tecnico_id: currentUser?.id,
        tecnico_nombre: technicianName,
        fecha_ejecucion: fechaEjecucion,
        tiempo_minutos: Number(tiempoMinutos) || 45,
        tipo: 'PREVENTIVO',
        checklist,
        diagnostico,
        actividades_realizadas: actividades,
        observaciones,
        estado_final_equipo: estadoFinal,
        conformidad_usuario: conformidadUsuario || 'Usuario / Responsable del Equipo'
      };

      const result = await executeMantenimiento(mantenimientoData, []);
      setCompletedMantenimiento(result);

      confetti({
        particleCount: 50,
        spread: 60,
        origin: { y: 0.6 }
      });

    } catch (err) {
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-zinc-950/60 backdrop-blur-xs overflow-y-auto">
      <div className="bg-white rounded-xl shadow-xl max-w-lg w-full overflow-hidden border border-zinc-200 animate-in fade-in zoom-in-98 duration-100 text-xs">
        
        {/* Header */}
        <div className="px-5 py-3.5 border-b border-zinc-200 flex items-center justify-between bg-white">
          <div className="flex items-center gap-2">
            <Wrench className="w-4 h-4 text-zinc-800" />
            <h3 className="font-semibold text-zinc-900 text-sm">
              {completedMantenimiento ? 'Mantenimiento Certificado' : 'Registrar Mantenimiento Preventivo'}
            </h3>
          </div>
          <button onClick={onClose} className="p-1 text-zinc-400 hover:text-zinc-700 rounded hover:bg-zinc-100">
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Body */}
        {completedMantenimiento ? (
          <div className="p-6 text-center space-y-4">
            <div className="w-12 h-12 rounded-full bg-zinc-100 text-zinc-900 flex items-center justify-center mx-auto border border-zinc-200">
              <CheckCircle2 className="w-6 h-6 stroke-[1.5]" />
            </div>

            <div>
              <span className="font-mono text-xs font-semibold bg-zinc-100 text-zinc-900 px-2 py-0.5 rounded border border-zinc-200">
                {completedMantenimiento.codigo_acta}
              </span>
              <h3 className="text-base font-bold text-zinc-900 mt-2">
                ¡Acta Generada con Éxito!
              </h3>
              <p className="text-xs text-zinc-500 max-w-sm mx-auto mt-1">
                El equipo <strong className="text-zinc-800">{currentAsset?.codigo_inventario}</strong> ha sido actualizado en el sistema.
              </p>
            </div>

            <div className="pt-2 flex justify-center gap-2">
              <button
                onClick={() => generateMaintenancePDF(completedMantenimiento, currentAsset, currentSede)}
                className="btn-interactive flex items-center gap-1.5 px-4 py-2 bg-zinc-900 hover:bg-zinc-800 text-white font-medium rounded-md shadow-2xs"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Descargar Acta PDF</span>
              </button>
              <button
                onClick={onClose}
                className="btn-interactive px-4 py-2 bg-zinc-100 hover:bg-zinc-200 text-zinc-700 font-medium rounded-md"
              >
                Cerrar
              </button>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="p-5 space-y-3.5 max-h-[80vh] overflow-y-auto">
            
            {/* Activo */}
            <div>
              <label className="block text-zinc-700 font-semibold mb-1">
                Equipo a Intervenir *
              </label>
              <select
                className="w-full px-2.5 py-1.5 border border-zinc-300 rounded-md focus:outline-none focus:border-zinc-800 bg-white font-medium text-zinc-800"
                value={selectedAssetId}
                onChange={e => setSelectedAssetId(e.target.value)}
              >
                {activos.map(a => (
                  <option key={a.id} value={a.id}>
                    [{a.codigo_inventario}] {a.nombre} &bull; {a.marca} ({a.responsable || 'General'})
                  </option>
                ))}
              </select>
            </div>

            {/* Técnico & Fecha */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-zinc-700 font-semibold mb-1">Técnico Responsable</label>
                <input
                  type="text"
                  required
                  className="w-full px-2.5 py-1.5 border border-zinc-300 rounded-md focus:outline-none focus:border-zinc-800"
                  value={technicianName}
                  onChange={e => setTechnicianName(e.target.value)}
                />
              </div>

              <div>
                <label className="block text-zinc-700 font-semibold mb-1">Fecha</label>
                <input
                  type="date"
                  required
                  className="w-full px-2.5 py-1.5 border border-zinc-300 rounded-md focus:outline-none focus:border-zinc-800 font-mono"
                  value={fechaEjecucion}
                  onChange={e => setFechaEjecucion(e.target.value)}
                />
              </div>
            </div>

            {/* Checklist Rápido */}
            <div>
              <label className="block text-zinc-700 font-semibold mb-1.5">
                Tareas Realizadas ({checklist.filter(c => c.hecho).length}/{checklist.length})
              </label>
              <div className="space-y-1 bg-zinc-50 p-2.5 rounded-md border border-zinc-200">
                {checklist.map((item, idx) => (
                  <label
                    key={idx}
                    className="flex items-center gap-2 p-1 rounded hover:bg-zinc-100/60 cursor-pointer text-zinc-700 select-none"
                  >
                    <input
                      type="checkbox"
                      checked={item.hecho}
                      onChange={() => handleToggleTask(idx)}
                      className="rounded text-zinc-900 focus:ring-0"
                    />
                    <span className="truncate">{item.tarea}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Diagnóstico / Observaciones */}
            <div>
              <label className="block text-zinc-700 font-semibold mb-1">Diagnóstico / Hallazgos</label>
              <textarea
                rows="2"
                required
                className="w-full px-2.5 py-1.5 border border-zinc-300 rounded-md focus:outline-none focus:border-zinc-800"
                value={diagnostico}
                onChange={e => setDiagnostico(e.target.value)}
              />
            </div>

            {/* Estado final y Conformidad */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-zinc-700 font-semibold mb-1">Estado Final</label>
                <select
                  className="w-full px-2.5 py-1.5 border border-zinc-300 rounded-md focus:outline-none focus:border-zinc-800 bg-white font-medium"
                  value={estadoFinal}
                  onChange={e => setEstadoFinal(e.target.value)}
                >
                  <option value="OPERATIVO">🟢 Operativo 100%</option>
                  <option value="EN_MANTENIMIENTO">🟡 Requiere Repuesto</option>
                  <option value="EN_REVISION">🔵 En Revisión</option>
                </select>
              </div>

              <div>
                <label className="block text-zinc-700 font-semibold mb-1">Recibido por (Usuario)</label>
                <input
                  type="text"
                  placeholder="Nombre de quien recibe..."
                  className="w-full px-2.5 py-1.5 border border-zinc-300 rounded-md focus:outline-none focus:border-zinc-800"
                  value={conformidadUsuario}
                  onChange={e => setConformidadUsuario(e.target.value)}
                />
              </div>
            </div>

            {/* Footer buttons */}
            <div className="pt-3 border-t border-zinc-200 flex items-center justify-end gap-2">
              <button
                type="button"
                onClick={onClose}
                className="btn-interactive px-3 py-1.5 font-medium text-zinc-600 hover:bg-zinc-100 rounded"
              >
                Cancelar
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="btn-interactive px-4 py-1.5 bg-zinc-900 hover:bg-zinc-800 text-white font-medium rounded shadow-2xs disabled:opacity-50"
              >
                {isSubmitting ? 'Guardando...' : 'Completar y Generar Acta'}
              </button>
            </div>

          </form>
        )}

      </div>
    </div>
  );
};
