import React from 'react';
import { 
  Laptop, 
  Wrench, 
  CalendarClock, 
  ArrowRight, 
  Plus, 
  FileDown, 
  CheckCircle2,
  AlertTriangle,
  Smartphone,
  Network,
  Server
} from 'lucide-react';
import { useData } from '../../context/DataContext';
import { generateConsolidatedReportPDF } from '../../lib/pdfGenerator';

export const DashboardView = ({ 
  onNavigate, 
  onOpenNewMaintenanceModal, 
  onOpenNewAssetModal 
}) => {
  const { kpis, activos, mantenimientos, sedes, categorias } = useData();

  const getCategoryCount = (codigo) => {
    const cat = categorias.find(c => c.codigo === codigo);
    if (!cat) return 0;
    return activos.filter(a => a.categoria_id === cat.id).length;
  };

  const hoy = new Date().toISOString().split('T')[0];
  const proximosVencer = activos.filter(a => a.proximo_mantenimiento && a.proximo_mantenimiento <= hoy || !a.ultimo_mantenimiento).slice(0, 4);

  return (
    <div className="space-y-6 animate-in fade-in duration-150">
      
      {/* 1. Header Minimalista */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-zinc-200/70">
        <div>
          <h2 className="text-xl font-bold text-zinc-900 tracking-tight">
            Panel de Control
          </h2>
          <p className="text-xs text-zinc-500 mt-0.5">
            Seguimiento preventivo y estado del parque tecnológico
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => onOpenNewAssetModal()}
            className="btn-interactive flex items-center gap-1.5 px-3 py-1.5 bg-white hover:bg-zinc-50 hover:border-zinc-300 text-zinc-700 font-medium rounded-md text-xs border border-zinc-200 shadow-2xs"
          >
            <Plus className="w-3.5 h-3.5 text-zinc-500" />
            <span>Agregar Equipo</span>
          </button>
          
          <button
            onClick={onOpenNewMaintenanceModal}
            className="btn-interactive flex items-center gap-1.5 px-3.5 py-1.5 bg-zinc-900 hover:bg-zinc-800 text-white font-medium rounded-md text-xs shadow-2xs"
          >
            <Wrench className="w-3.5 h-3.5" />
            <span>Nuevo Mantenimiento</span>
          </button>
        </div>
      </div>

      {/* 2. Cuadrícula de 3 KPIs Esenciales */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5">
        
        {/* KPI 1 */}
        <div 
          onClick={() => onNavigate('activos')}
          className="interactive-card bg-white rounded-lg p-4 border border-zinc-200/80 cursor-pointer shadow-2xs group"
        >
          <div className="flex items-center justify-between text-zinc-500 mb-2">
            <span className="text-[11px] font-medium uppercase tracking-wider group-hover:text-zinc-700 transition-colors">Total Equipos</span>
            <Laptop className="w-4 h-4 stroke-[1.5] text-zinc-400 group-hover:text-zinc-700 transition-colors" />
          </div>
          <div className="flex items-baseline justify-between">
            <span className="text-2xl font-bold font-mono tracking-tight text-zinc-900">{activos.length}</span>
            <span className="text-[11px] text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded font-mono border border-emerald-100">
              {kpis.activosOperativos} activos
            </span>
          </div>
          <p className="text-[11px] text-zinc-400 mt-2">En inventario de la empresa</p>
        </div>

        {/* KPI 2 */}
        <div 
          onClick={() => onNavigate('mantenimientos')}
          className="interactive-card bg-white rounded-lg p-4 border border-zinc-200/80 cursor-pointer shadow-2xs group"
        >
          <div className="flex items-center justify-between text-zinc-500 mb-2">
            <span className="text-[11px] font-medium uppercase tracking-wider group-hover:text-zinc-700 transition-colors">Mantenimientos Realizados</span>
            <CheckCircle2 className="w-4 h-4 stroke-[1.5] text-zinc-400 group-hover:text-zinc-700 transition-colors" />
          </div>
          <div className="flex items-baseline justify-between">
            <span className="text-2xl font-bold font-mono tracking-tight text-zinc-900">{mantenimientos.length}</span>
            <span className="text-[11px] text-zinc-500 font-mono">
              Actas generadas
            </span>
          </div>
          <p className="text-[11px] text-zinc-400 mt-2">Certificadas y con soporte PDF</p>
        </div>

        {/* KPI 3 */}
        <div 
          onClick={() => onNavigate('activos')}
          className="interactive-card bg-white rounded-lg p-4 border border-zinc-200/80 cursor-pointer shadow-2xs group"
        >
          <div className="flex items-center justify-between text-zinc-500 mb-2">
            <span className="text-[11px] font-medium uppercase tracking-wider group-hover:text-zinc-700 transition-colors">Próximos a Mantenimiento</span>
            <CalendarClock className="w-4 h-4 stroke-[1.5] text-zinc-400 group-hover:text-zinc-700 transition-colors" />
          </div>
          <div className="flex items-baseline justify-between">
            <span className="text-2xl font-bold font-mono tracking-tight text-zinc-900">{proximosVencer.length}</span>
            <span className="text-[11px] text-amber-700 bg-amber-50 px-1.5 py-0.5 rounded font-mono border border-amber-200">
              Atención recomendada
            </span>
          </div>
          <p className="text-[11px] text-zinc-400 mt-2">Equipos para programar revisión</p>
        </div>

      </div>

      {/* 3. Dos Columnas: Próximos Equipos a Revisar & Últimos Mantenimientos */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        
        {/* Próximos Equipos */}
        <div className="bg-white rounded-lg border border-zinc-200/80 p-4 shadow-2xs">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-xs font-bold text-zinc-800 uppercase tracking-wider">
              Equipos que Requieren Mantenimiento
            </h3>
            <button 
              onClick={() => onNavigate('activos')}
              className="text-xs text-zinc-500 hover:text-zinc-900 font-medium hover:underline"
            >
              Ver Inventario &rarr;
            </button>
          </div>

          <div className="divide-y divide-zinc-100">
            {proximosVencer.length === 0 ? (
              <p className="py-4 text-center text-xs text-zinc-400">Todos los equipos están al día con sus mantenimientos.</p>
            ) : (
              proximosVencer.map(a => (
                <div key={a.id} className="py-2.5 flex items-center justify-between gap-3 text-xs">
                  <div>
                    <div className="flex items-center gap-1.5">
                      <span className="font-mono font-semibold text-zinc-900 bg-zinc-100 px-1.5 py-0.2 rounded text-[11px] border border-zinc-200">
                        {a.codigo_inventario}
                      </span>
                      <span className="font-medium text-zinc-800 truncate">{a.nombre}</span>
                    </div>
                    <p className="text-[11px] text-zinc-400 mt-0.5">
                      {a.marca} {a.modelo} &bull; Responsable: {a.responsable || 'General'}
                    </p>
                  </div>

                  <button
                    onClick={() => onOpenNewMaintenanceModal(a)}
                    className="btn-interactive px-2.5 py-1 bg-zinc-900 hover:bg-zinc-800 text-white rounded text-xs font-medium shrink-0"
                  >
                    Atender
                  </button>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Últimos Mantenimientos */}
        <div className="bg-white rounded-lg border border-zinc-200/80 p-4 shadow-2xs">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-xs font-bold text-zinc-800 uppercase tracking-wider">
              Últimas Actas Registradas
            </h3>
            <button 
              onClick={() => onNavigate('mantenimientos')}
              className="text-xs text-zinc-500 hover:text-zinc-900 font-medium hover:underline"
            >
              Ver Todas &rarr;
            </button>
          </div>

          <div className="divide-y divide-zinc-100">
            {mantenimientos.slice(0, 4).map(m => {
              const act = activos.find(a => a.id === m.activo_id);
              return (
                <div key={m.id} className="py-2.5 flex items-center justify-between gap-3 text-xs">
                  <div>
                    <div className="flex items-center gap-1.5">
                      <span className="font-mono font-semibold text-zinc-900">{m.codigo_acta}</span>
                      <span className="text-zinc-400">&bull;</span>
                      <span className="font-medium text-zinc-700 truncate">{act?.nombre}</span>
                    </div>
                    <p className="text-[11px] text-zinc-400 mt-0.5">
                      {m.tecnico_nombre} &bull; {m.fecha_ejecucion}
                    </p>
                  </div>

                  <span className="font-mono text-[11px] text-zinc-500 bg-zinc-100 px-2 py-0.5 rounded shrink-0">
                    {m.tiempo_minutos} min
                  </span>
                </div>
              );
            })}
          </div>
        </div>

      </div>

    </div>
  );
};
