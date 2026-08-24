import React, { useState, useMemo } from 'react';
import { 
  Plus, 
  CalendarDays, 
  AlertTriangle, 
  CheckCircle2, 
  Clock, 
  Wrench, 
  Calendar
} from 'lucide-react';
import { useData } from '../../context/DataContext';
import { ScheduleModal } from './ScheduleModal';

export const ScheduleView = ({ onExecuteMaintenanceFromProg }) => {
  const { programaciones, activos, sedes } = useData();

  const [statusFilter, setStatusFilter] = useState('ALL');
  const [selectedSede, setSelectedSede] = useState('ALL');
  const [isModalOpen, setIsModalOpen] = useState(false);

  const hoy = new Date().toISOString().split('T')[0];

  const filteredProgramaciones = useMemo(() => {
    return programaciones.filter(p => {
      const act = activos.find(a => a.id === p.activo_id);
      const isOverdue = p.estado === 'ATRASADO' || (p.estado === 'PROGRAMADO' && p.fecha_programada < hoy);
      
      let matchStatus = true;
      if (statusFilter === 'ATRASADOS') matchStatus = isOverdue;
      else if (statusFilter === 'PROGRAMADOS') matchStatus = p.estado === 'PROGRAMADO' && !isOverdue;
      else if (statusFilter === 'COMPLETADOS') matchStatus = p.estado === 'COMPLETADO';

      const matchSede = selectedSede === 'ALL' || (act && act.sede_id === selectedSede);

      return matchStatus && matchSede;
    }).sort((a, b) => new Date(a.fecha_programada) - new Date(b.fecha_programada));
  }, [programaciones, activos, statusFilter, selectedSede, hoy]);

  return (
    <div className="space-y-4 animate-in fade-in duration-150">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-2 border-b border-zinc-200/70">
        <div>
          <h2 className="text-xl font-bold text-zinc-900 tracking-tight">
            Cronograma y Planificación Preventiva
          </h2>
          <p className="text-xs text-zinc-500">
            {programaciones.length} tareas programadas en el calendario
          </p>
        </div>

        <button
          onClick={() => setIsModalOpen(true)}
          className="btn-interactive flex items-center gap-1.5 px-3 py-1.5 bg-zinc-900 hover:bg-zinc-800 text-white text-xs font-medium rounded-md shadow-2xs self-start sm:self-auto"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>Programar Tarea</span>
        </button>
      </div>

      {/* Toolbar */}
      <div className="bg-white p-3 rounded-lg border border-zinc-200/80 shadow-2xs flex flex-col sm:flex-row gap-2.5">
        <div className="flex items-center gap-1.5 overflow-x-auto text-xs flex-1">
          <button
            onClick={() => setStatusFilter('ALL')}
            className={`btn-interactive px-2.5 py-1 rounded text-[11px] font-medium transition-all shrink-0 ${
              statusFilter === 'ALL' ? 'bg-zinc-900 text-white' : 'text-zinc-600 hover:bg-zinc-100 hover:text-zinc-900'
            }`}
          >
            Todos ({programaciones.length})
          </button>
          
          <button
            onClick={() => setStatusFilter('ATRASADOS')}
            className={`btn-interactive px-2.5 py-1 rounded text-[11px] font-medium transition-all shrink-0 ${
              statusFilter === 'ATRASADOS' ? 'bg-zinc-900 text-white' : 'text-zinc-600 hover:bg-zinc-100 hover:text-zinc-900'
            }`}
          >
            Vencidos
          </button>

          <button
            onClick={() => setStatusFilter('PROGRAMADOS')}
            className={`btn-interactive px-2.5 py-1 rounded text-[11px] font-medium transition-all shrink-0 ${
              statusFilter === 'PROGRAMADOS' ? 'bg-zinc-900 text-white' : 'text-zinc-600 hover:bg-zinc-100 hover:text-zinc-900'
            }`}
          >
            Pendientes
          </button>

          <button
            onClick={() => setStatusFilter('COMPLETADOS')}
            className={`btn-interactive px-2.5 py-1 rounded text-[11px] font-medium transition-all shrink-0 ${
              statusFilter === 'COMPLETADOS' ? 'bg-zinc-900 text-white' : 'text-zinc-600 hover:bg-zinc-100 hover:text-zinc-900'
            }`}
          >
            Completados
          </button>
        </div>

        <select
          className="px-2.5 py-1 text-xs border border-zinc-200 rounded-md bg-white focus:outline-none focus:border-zinc-800 text-zinc-700 font-medium shrink-0 transition-colors hover:border-zinc-300"
          value={selectedSede}
          onChange={e => setSelectedSede(e.target.value)}
        >
          <option value="ALL">Todas las Sedes</option>
          {sedes.map(s => (
            <option key={s.id} value={s.id}>{s.nombre.split('-')[0]}</option>
          ))}
        </select>
      </div>

      {/* Lista */}
      {filteredProgramaciones.length === 0 ? (
        <div className="bg-white rounded-lg p-10 text-center border border-zinc-200 text-xs text-zinc-500">
          No hay tareas programadas con este criterio.
        </div>
      ) : (
        <div className="space-y-2">
          {filteredProgramaciones.map(prog => {
            const act = activos.find(a => a.id === prog.activo_id);
            const sede = sedes.find(s => s.id === act?.sede_id);
            const isOverdue = prog.estado === 'ATRASADO' || (prog.estado === 'PROGRAMADO' && prog.fecha_programada < hoy);
            const isCompleted = prog.estado === 'COMPLETADO';

            return (
              <div 
                key={prog.id}
                className={`interactive-card bg-white rounded-lg p-3.5 border transition-all flex flex-col md:flex-row md:items-center justify-between gap-3 text-xs ${
                  isOverdue ? 'border-amber-300 bg-amber-50/20 hover:border-amber-400' : 'border-zinc-200/80 shadow-2xs hover:border-zinc-300'
                }`}
              >
                <div className="flex items-start gap-3">
                  <span className={`w-2 h-2 rounded-full mt-1.5 shrink-0 ${
                    isCompleted ? 'bg-zinc-400' : isOverdue ? 'bg-amber-500 animate-pulse' : 'bg-emerald-500'
                  }`} />

                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-mono font-semibold text-zinc-900 bg-zinc-100 px-1.5 py-0.2 rounded text-[11px] border border-zinc-200">
                        {act?.codigo_inventario}
                      </span>
                      <h4 className="font-semibold text-zinc-900">{act?.nombre}</h4>
                      <span className="text-[10px] font-mono text-zinc-400 uppercase">
                        Prioridad {prog.prioridad}
                      </span>
                    </div>

                    <p className="text-[11px] text-zinc-500 mt-0.5">
                      {sede?.nombre.split('-')[0]} &bull; {act?.ubicacion_detalle || 'General'}
                    </p>

                    {prog.notas && (
                      <p className="text-[11px] text-zinc-600 mt-1 italic">
                        "{prog.notas}"
                      </p>
                    )}
                  </div>
                </div>

                <div className="flex items-center justify-between md:justify-end gap-3 shrink-0 pt-2 md:pt-0 border-t md:border-t-0 border-zinc-100">
                  <div className="text-left md:text-right">
                    <span className="font-mono text-xs font-semibold text-zinc-800">
                      {prog.fecha_programada}
                    </span>
                    <p className="text-[10px] text-zinc-400">
                      {isCompleted ? 'Completado' : isOverdue ? 'Atrasado' : 'Agendado'}
                    </p>
                  </div>

                  {!isCompleted && (
                    <button
                      onClick={() => onExecuteMaintenanceFromProg(act, prog)}
                      className="btn-interactive flex items-center gap-1 px-2.5 py-1 bg-zinc-900 hover:bg-zinc-800 text-white rounded text-xs font-medium shadow-2xs"
                    >
                      <Wrench className="w-3 h-3" />
                      <span>Ejecutar</span>
                    </button>
                  )}
                </div>

              </div>
            );
          })}
        </div>
      )}

      {/* Modal */}
      {isModalOpen && (
        <ScheduleModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
        />
      )}

    </div>
  );
};
