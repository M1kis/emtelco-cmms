import React from 'react';
import { 
  Laptop, 
  Wrench, 
  CalendarClock, 
  AlertTriangle, 
  CheckCircle2, 
  TrendingUp, 
  Clock, 
  ArrowRight, 
  Plus, 
  FileDown, 
  Smartphone, 
  Network, 
  Server
} from 'lucide-react';
import { useData } from '../../context/DataContext';
import { useAuth } from '../../context/AuthContext';
import { generateConsolidatedReportPDF } from '../../lib/pdfGenerator';

export const DashboardView = ({ 
  onNavigate, 
  onOpenNewMaintenanceModal, 
  onOpenNewAssetModal, 
  onOpenScheduleModal 
}) => {
  const { kpis, activos, mantenimientos, programaciones, sedes, categorias } = useData();

  const getCategoryCount = (codigo) => {
    const cat = categorias.find(c => c.codigo === codigo);
    if (!cat) return 0;
    return activos.filter(a => a.categoria_id === cat.id).length;
  };

  const urgentAlerts = programaciones.filter(
    p => p.estado === 'ATRASADO' || (p.estado === 'PROGRAMADO' && p.fecha_programada <= new Date().toISOString().split('T')[0])
  );

  return (
    <div className="space-y-6 animate-in fade-in duration-150">
      
      {/* 1. Header Minimalista */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-zinc-200/70">
        <div>
          <h2 className="text-xl font-bold text-zinc-900 tracking-tight">
            Resumen General de Infraestructura
          </h2>
          <p className="text-xs text-zinc-500 mt-0.5">
            Monitoreo y control preventivo de activos tecnológicos de EMTELCO
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => generateConsolidatedReportPDF(mantenimientos, activos, sedes)}
            className="btn-interactive flex items-center gap-1.5 px-3 py-1.5 bg-white hover:bg-zinc-50 hover:border-zinc-300 text-zinc-700 font-medium rounded-md text-xs border border-zinc-200 shadow-2xs transition-all"
          >
            <FileDown className="w-3.5 h-3.5 text-zinc-500" />
            <span>Exportar Informe</span>
          </button>
          
          <button
            onClick={onOpenNewMaintenanceModal}
            className="btn-interactive flex items-center gap-1.5 px-3.5 py-1.5 bg-zinc-900 hover:bg-zinc-800 text-white font-medium rounded-md text-xs shadow-2xs transition-all"
          >
            <Wrench className="w-3.5 h-3.5" />
            <span>Registrar Mantenimiento</span>
          </button>
        </div>
      </div>

      {/* 2. Banner de Alertas */}
      {urgentAlerts.length > 0 && (
        <div className="bg-zinc-50 border border-zinc-200/80 hover:border-amber-300/80 rounded-lg p-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs transition-colors duration-150 shadow-2xs">
          <div className="flex items-center gap-2.5">
            <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse shrink-0" />
            <div>
              <span className="font-semibold text-zinc-900">
                {urgentAlerts.length} mantenimiento(s) preventivo(s) pendiente(s) o vencido(s)
              </span>
              <span className="text-zinc-500 ml-1.5 hidden md:inline">
                Requiere atención de técnicos en sitio para mantener SLA operativo.
              </span>
            </div>
          </div>

          <button
            onClick={() => onNavigate('cronograma')}
            className="self-start sm:self-center text-xs font-semibold text-zinc-800 hover:text-zinc-950 inline-flex items-center gap-1 hover:translate-x-0.5 transition-transform"
          >
            <span>Ver Cronograma</span>
            <ArrowRight className="w-3 h-3" />
          </button>
        </div>
      )}

      {/* 3. Cuadrícula de KPIs */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3.5">
        
        {/* KPI 1 */}
        <div 
          onClick={() => onNavigate('activos')}
          className="interactive-card bg-white rounded-lg p-4 border border-zinc-200/80 cursor-pointer shadow-2xs group"
        >
          <div className="flex items-center justify-between text-zinc-500 mb-2">
            <span className="text-[11px] font-medium uppercase tracking-wider group-hover:text-zinc-700 transition-colors">Total Activos</span>
            <Laptop className="w-4 h-4 stroke-[1.5] text-zinc-400 group-hover:text-zinc-700 transition-colors" />
          </div>
          <div className="flex items-baseline justify-between">
            <span className="text-2xl font-bold font-mono tracking-tight text-zinc-900">{kpis.totalActivos}</span>
            <span className="text-[11px] text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded font-mono border border-emerald-100">
              {kpis.activosOperativos} ok
            </span>
          </div>
          <p className="text-[11px] text-zinc-400 mt-2">{sedes.length} sedes registradas</p>
        </div>

        {/* KPI 2 */}
        <div 
          onClick={() => onNavigate('reportes')}
          className="interactive-card bg-white rounded-lg p-4 border border-zinc-200/80 cursor-pointer shadow-2xs group"
        >
          <div className="flex items-center justify-between text-zinc-500 mb-2">
            <span className="text-[11px] font-medium uppercase tracking-wider group-hover:text-zinc-700 transition-colors">Cumplimiento SLA</span>
            <TrendingUp className="w-4 h-4 stroke-[1.5] text-zinc-400 group-hover:text-zinc-700 transition-colors" />
          </div>
          <div className="flex items-baseline justify-between">
            <span className="text-2xl font-bold font-mono tracking-tight text-zinc-900">{kpis.tasaCumplimiento}%</span>
            <span className="text-[11px] text-zinc-500 font-mono">
              {mantenimientos.length} actas
            </span>
          </div>
          <div className="w-full bg-zinc-100 rounded-full h-1 mt-2.5 overflow-hidden">
            <div 
              className="bg-zinc-800 h-1 rounded-full transition-all duration-500"
              style={{ width: `${kpis.tasaCumplimiento}%` }}
            />
          </div>
        </div>

        {/* KPI 3 */}
        <div 
          onClick={() => onNavigate('cronograma')}
          className="interactive-card bg-white rounded-lg p-4 border border-zinc-200/80 cursor-pointer shadow-2xs group"
        >
          <div className="flex items-center justify-between text-zinc-500 mb-2">
            <span className="text-[11px] font-medium uppercase tracking-wider group-hover:text-zinc-700 transition-colors">Programados</span>
            <CalendarClock className="w-4 h-4 stroke-[1.5] text-zinc-400 group-hover:text-zinc-700 transition-colors" />
          </div>
          <div className="flex items-baseline justify-between">
            <span className="text-2xl font-bold font-mono tracking-tight text-zinc-900">{kpis.pendientesCount}</span>
            <span className="text-[11px] text-zinc-600 bg-zinc-100 px-1.5 py-0.5 rounded font-mono border border-zinc-200/50">
              {kpis.proximosCount} prox.
            </span>
          </div>
          <p className="text-[11px] text-zinc-400 mt-2">En ventana preventiva</p>
        </div>

        {/* KPI 4 */}
        <div 
          onClick={() => onNavigate('mantenimientos')}
          className="interactive-card bg-white rounded-lg p-4 border border-zinc-200/80 cursor-pointer shadow-2xs group"
        >
          <div className="flex items-center justify-between text-zinc-500 mb-2">
            <span className="text-[11px] font-medium uppercase tracking-wider group-hover:text-zinc-700 transition-colors">Tiempo Promedio</span>
            <Clock className="w-4 h-4 stroke-[1.5] text-zinc-400 group-hover:text-zinc-700 transition-colors" />
          </div>
          <div className="flex items-baseline justify-between">
            <span className="text-2xl font-bold font-mono tracking-tight text-zinc-900">
              {kpis.tiempoPromedio} <span className="text-xs font-normal text-zinc-400">min</span>
            </span>
            <span className="text-[11px] text-zinc-500 font-mono">Protocolo</span>
          </div>
          <p className="text-[11px] text-zinc-400 mt-2">Intervención técnica estándar</p>
        </div>

      </div>

      {/* 4. Distribución de Activos por Categoría */}
      <div className="bg-white rounded-lg border border-zinc-200/80 p-4 shadow-2xs">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-xs font-bold text-zinc-800 uppercase tracking-wider">
            Distribución por Tipo de Activo
          </h3>
          <button 
            onClick={() => onNavigate('activos')}
            className="text-xs text-zinc-500 hover:text-zinc-900 font-medium inline-flex items-center gap-1 hover:translate-x-0.5 transition-transform"
          >
            <span>Ver Inventario</span>
            <ArrowRight className="w-3 h-3" />
          </button>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-2.5">
          <div 
            onClick={() => onNavigate('activos')}
            className="p-3 rounded-md bg-zinc-50 hover:bg-zinc-100/80 border border-zinc-200/60 hover:border-zinc-300 flex items-center justify-between cursor-pointer transition-all duration-150 group"
          >
            <div className="flex items-center gap-2.5">
              <Laptop className="w-4 h-4 text-zinc-600 group-hover:text-zinc-900 stroke-[1.75] transition-colors" />
              <span className="text-xs text-zinc-600 group-hover:text-zinc-900 font-medium transition-colors">Cómputo</span>
            </div>
            <span className="text-sm font-bold font-mono text-zinc-900">{getCategoryCount('COMPUTO')}</span>
          </div>

          <div 
            onClick={() => onNavigate('activos')}
            className="p-3 rounded-md bg-zinc-50 hover:bg-zinc-100/80 border border-zinc-200/60 hover:border-zinc-300 flex items-center justify-between cursor-pointer transition-all duration-150 group"
          >
            <div className="flex items-center gap-2.5">
              <Smartphone className="w-4 h-4 text-zinc-600 group-hover:text-zinc-900 stroke-[1.75] transition-colors" />
              <span className="text-xs text-zinc-600 group-hover:text-zinc-900 font-medium transition-colors">Móviles</span>
            </div>
            <span className="text-sm font-bold font-mono text-zinc-900">{getCategoryCount('MOVILES')}</span>
          </div>

          <div 
            onClick={() => onNavigate('activos')}
            className="p-3 rounded-md bg-zinc-50 hover:bg-zinc-100/80 border border-zinc-200/60 hover:border-zinc-300 flex items-center justify-between cursor-pointer transition-all duration-150 group"
          >
            <div className="flex items-center gap-2.5">
              <Network className="w-4 h-4 text-zinc-600 group-hover:text-zinc-900 stroke-[1.75] transition-colors" />
              <span className="text-xs text-zinc-600 group-hover:text-zinc-900 font-medium transition-colors">Redes / Racks</span>
            </div>
            <span className="text-sm font-bold font-mono text-zinc-900">{getCategoryCount('REDES')}</span>
          </div>

          <div 
            onClick={() => onNavigate('activos')}
            className="p-3 rounded-md bg-zinc-50 hover:bg-zinc-100/80 border border-zinc-200/60 hover:border-zinc-300 flex items-center justify-between cursor-pointer transition-all duration-150 group"
          >
            <div className="flex items-center gap-2.5">
              <Server className="w-4 h-4 text-zinc-600 group-hover:text-zinc-900 stroke-[1.75] transition-colors" />
              <span className="text-xs text-zinc-600 group-hover:text-zinc-900 font-medium transition-colors">Servidores</span>
            </div>
            <span className="text-sm font-bold font-mono text-zinc-900">{getCategoryCount('SERVIDORES')}</span>
          </div>
        </div>
      </div>

      {/* 5. Dos Columnas: Últimas Actas & Sedes */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        
        {/* Últimas Actas */}
        <div className="lg:col-span-2 bg-white rounded-lg border border-zinc-200/80 p-4 shadow-2xs">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-xs font-bold text-zinc-800 uppercase tracking-wider">
              Últimas Actas Certificadas
            </h3>
            <button 
              onClick={() => onNavigate('mantenimientos')}
              className="text-xs text-zinc-500 hover:text-zinc-900 font-medium hover:underline"
            >
              Ver Todas
            </button>
          </div>

          <div className="divide-y divide-zinc-100">
            {mantenimientos.slice(0, 4).map((m) => {
              const act = activos.find(a => a.id === m.activo_id);
              const sede = sedes.find(s => s.id === act?.sede_id);
              return (
                <div 
                  key={m.id}
                  onClick={() => onNavigate('mantenimientos')}
                  className="py-2.5 px-2 -mx-2 rounded hover:bg-zinc-50 transition-colors duration-100 flex items-center justify-between gap-3 text-xs cursor-pointer group"
                >
                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="font-mono font-semibold text-zinc-900 group-hover:text-zinc-950">{m.codigo_acta}</span>
                      <span className="text-zinc-400">&bull;</span>
                      <span className="font-medium text-zinc-700 truncate group-hover:text-zinc-900">{act?.nombre}</span>
                    </div>
                    <p className="text-[11px] text-zinc-400 truncate mt-0.5">
                      {m.tecnico_nombre} &bull; {sede?.nombre.split('-')[0]} &bull; {m.fecha_ejecucion}
                    </p>
                  </div>

                  <div className="text-right shrink-0">
                    <span className="font-mono text-[11px] text-zinc-500 bg-zinc-100 group-hover:bg-zinc-200/80 px-2 py-0.5 rounded transition-colors">
                      {m.tiempo_minutos} min
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Sedes */}
        <div className="bg-white rounded-lg border border-zinc-200/80 p-4 shadow-2xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-xs font-bold text-zinc-800 uppercase tracking-wider">
                Sedes EMTELCO
              </h3>
              <span className="text-[11px] font-mono text-zinc-400">{sedes.length} sedes</span>
            </div>

            <div className="space-y-2">
              {sedes.map((sede) => {
                const count = activos.filter(a => a.sede_id === sede.id).length;
                return (
                  <div 
                    key={sede.id} 
                    onClick={() => onNavigate('sedes')}
                    className="p-2.5 rounded bg-zinc-50 hover:bg-zinc-100/80 border border-zinc-200/60 hover:border-zinc-300 text-xs flex items-center justify-between cursor-pointer transition-all duration-150 group"
                  >
                    <div>
                      <p className="font-medium text-zinc-800 group-hover:text-zinc-950">{sede.nombre.split('-')[0]}</p>
                      <p className="text-[10px] text-zinc-400">{sede.ciudad}</p>
                    </div>
                    <span className="font-mono text-[11px] text-zinc-600 bg-white px-1.5 py-0.5 rounded border border-zinc-200 group-hover:border-zinc-300">
                      {count} act.
                    </span>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="mt-3 pt-2.5 border-t border-zinc-100 text-center">
            <button
              onClick={() => onNavigate('sedes')}
              className="text-xs font-medium text-zinc-600 hover:text-zinc-950 hover:underline"
            >
              Administrar Sedes &rarr;
            </button>
          </div>
        </div>

      </div>

    </div>
  );
};
