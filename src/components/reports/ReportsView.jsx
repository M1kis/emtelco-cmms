import React, { useState, useMemo } from 'react';
import { 
  Download, 
  Filter, 
  FileDown
} from 'lucide-react';
import { useData } from '../../context/DataContext';
import { generateConsolidatedReportPDF, generateMaintenancePDF } from '../../lib/pdfGenerator';

export const ReportsView = () => {
  const { mantenimientos, activos, sedes, categorias, kpis } = useData();

  const [dateFrom, setDateFrom] = useState('');
  const [dateTo, setDateTo] = useState('');
  const [selectedSede, setSelectedSede] = useState('ALL');
  const [selectedCategory, setSelectedCategory] = useState('ALL');

  const filteredMantenimientos = useMemo(() => {
    return mantenimientos.filter(m => {
      const act = activos.find(a => a.id === m.activo_id);
      const matchFrom = !dateFrom || m.fecha_ejecucion >= dateFrom;
      const matchTo = !dateTo || m.fecha_ejecucion <= dateTo;
      const matchSede = selectedSede === 'ALL' || (act && act.sede_id === selectedSede);
      const matchCat = selectedCategory === 'ALL' || (act && act.categoria_id === selectedCategory);

      return matchFrom && matchTo && matchSede && matchCat;
    });
  }, [mantenimientos, activos, dateFrom, dateTo, selectedSede, selectedCategory]);

  const exportToCSV = () => {
    const headers = ['Codigo Acta', 'Fecha', 'Codigo Activo', 'Nombre Activo', 'Sede', 'Tecnico', 'Tiempo Minutos', 'Estado Final', 'Diagnostico'];
    const rows = filteredMantenimientos.map(m => {
      const act = activos.find(a => a.id === m.activo_id);
      const sede = sedes.find(s => s.id === act?.sede_id);
      return [
        `"${m.codigo_acta}"`,
        `"${m.fecha_ejecucion}"`,
        `"${act?.codigo_inventario || ''}"`,
        `"${act?.nombre || ''}"`,
        `"${sede?.nombre.split('-')[0] || ''}"`,
        `"${m.tecnico_nombre}"`,
        m.tiempo_minutos,
        `"${m.estado_final_equipo || 'OPERATIVO'}"`,
        `"${(m.diagnostico || '').replace(/"/g, '""')}"`
      ];
    });

    const csvContent = 'data:text/csv;charset=utf-8,\uFEFF' + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `Reporte_Mantenimiento_EMTELCO_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-4 animate-in fade-in duration-150">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-2 border-b border-zinc-200/70">
        <div>
          <h2 className="text-xl font-bold text-zinc-900 tracking-tight">
            Reportes & Métricas de Gestión TICS
          </h2>
          <p className="text-xs text-zinc-500">
            Auditoría de cumplimiento de SLA y tiempos de atención
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={exportToCSV}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-white hover:bg-zinc-50 text-zinc-700 text-xs font-medium rounded-md border border-zinc-200 shadow-2xs transition-colors"
          >
            <Download className="w-3.5 h-3.5 text-zinc-500" />
            <span>Excel (CSV)</span>
          </button>

          <button
            onClick={() => generateConsolidatedReportPDF(filteredMantenimientos, activos, sedes)}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-zinc-900 hover:bg-zinc-800 text-white text-xs font-medium rounded-md shadow-2xs transition-colors"
          >
            <FileDown className="w-3.5 h-3.5" />
            <span>Reporte PDF</span>
          </button>
        </div>
      </div>

      {/* Métricas rápidas */}
      <div className="grid grid-cols-3 gap-3 text-xs">
        <div className="bg-white p-3.5 rounded-lg border border-zinc-200/80 shadow-2xs">
          <span className="text-[10px] uppercase font-mono text-zinc-400 block">Total Filtrados</span>
          <span className="text-2xl font-bold font-mono text-zinc-900 mt-1 block">{filteredMantenimientos.length}</span>
          <p className="text-[11px] text-zinc-400 mt-1">Actas en el período</p>
        </div>

        <div className="bg-white p-3.5 rounded-lg border border-zinc-200/80 shadow-2xs">
          <span className="text-[10px] uppercase font-mono text-zinc-400 block">Tasa Cumplimiento</span>
          <span className="text-2xl font-bold font-mono text-zinc-900 mt-1 block">{kpis.tasaCumplimiento}%</span>
          <p className="text-[11px] text-zinc-400 mt-1">Disponibilidad SLA</p>
        </div>

        <div className="bg-white p-3.5 rounded-lg border border-zinc-200/80 shadow-2xs">
          <span className="text-[10px] uppercase font-mono text-zinc-400 block">Tiempo Promedio</span>
          <span className="text-2xl font-bold font-mono text-zinc-900 mt-1 block">{kpis.tiempoPromedio} <span className="text-xs font-normal text-zinc-400">min</span></span>
          <p className="text-[11px] text-zinc-400 mt-1">Por intervención</p>
        </div>
      </div>

      {/* Filtros */}
      <div className="bg-white p-3.5 rounded-lg border border-zinc-200/80 shadow-2xs space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="text-xs font-bold text-zinc-800 uppercase tracking-wider flex items-center gap-1.5">
            <Filter className="w-3.5 h-3.5 text-zinc-500" />
            <span>Filtros de Búsqueda</span>
          </h3>
          {(dateFrom || dateTo || selectedSede !== 'ALL' || selectedCategory !== 'ALL') && (
            <button
              onClick={() => { setDateFrom(''); setDateTo(''); setSelectedSede('ALL'); setSelectedCategory('ALL'); }}
              className="text-[11px] text-zinc-500 hover:text-zinc-900 underline"
            >
              Restablecer
            </button>
          )}
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-2.5 text-xs">
          <div>
            <label className="block text-zinc-500 text-[11px] mb-1">Desde</label>
            <input 
              type="date"
              className="w-full px-2.5 py-1.5 border border-zinc-200 rounded-md focus:outline-none focus:border-zinc-800 font-mono text-xs"
              value={dateFrom}
              onChange={e => setDateFrom(e.target.value)}
            />
          </div>

          <div>
            <label className="block text-zinc-500 text-[11px] mb-1">Hasta</label>
            <input 
              type="date"
              className="w-full px-2.5 py-1.5 border border-zinc-200 rounded-md focus:outline-none focus:border-zinc-800 font-mono text-xs"
              value={dateTo}
              onChange={e => setDateTo(e.target.value)}
            />
          </div>

          <div>
            <label className="block text-zinc-500 text-[11px] mb-1">Sede</label>
            <select
              className="w-full px-2.5 py-1.5 border border-zinc-200 rounded-md bg-white focus:outline-none focus:border-zinc-800 text-xs"
              value={selectedSede}
              onChange={e => setSelectedSede(e.target.value)}
            >
              <option value="ALL">Todas las Sedes</option>
              {sedes.map(s => (
                <option key={s.id} value={s.id}>{s.nombre.split('-')[0]}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-zinc-500 text-[11px] mb-1">Categoría</label>
            <select
              className="w-full px-2.5 py-1.5 border border-zinc-200 rounded-md bg-white focus:outline-none focus:border-zinc-800 text-xs"
              value={selectedCategory}
              onChange={e => setSelectedCategory(e.target.value)}
            >
              <option value="ALL">Todas las Categorías</option>
              {categorias.map(c => (
                <option key={c.id} value={c.id}>{c.nombre}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Tabla */}
      <div className="bg-white rounded-lg border border-zinc-200 shadow-2xs overflow-x-auto">
        {filteredMantenimientos.length === 0 ? (
          <div className="p-8 text-center text-xs text-zinc-500">
            No se encontraron registros con los filtros seleccionados.
          </div>
        ) : (
          <table className="w-full text-left text-xs">
            <thead className="bg-zinc-50 text-zinc-600 font-semibold border-b border-zinc-200 uppercase tracking-wider text-[10px]">
              <tr>
                <th className="p-3">Acta</th>
                <th className="p-3">Fecha</th>
                <th className="p-3">Activo</th>
                <th className="p-3">Sede</th>
                <th className="p-3">Técnico</th>
                <th className="p-3">Tiempo</th>
                <th className="p-3">Estado</th>
                <th className="p-3 text-right">PDF</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-100">
              {filteredMantenimientos.map(m => {
                const act = activos.find(a => a.id === m.activo_id);
                const sede = sedes.find(s => s.id === act?.sede_id);
                return (
                  <tr key={m.id} className="hover:bg-zinc-50/70 transition-colors">
                    <td className="p-3 font-mono font-semibold text-zinc-900">{m.codigo_acta}</td>
                    <td className="p-3 font-mono text-zinc-600">{m.fecha_ejecucion}</td>
                    <td className="p-3">
                      <p className="font-medium text-zinc-900">{act?.nombre}</p>
                      <p className="text-[11px] text-zinc-400 font-mono">{act?.codigo_inventario}</p>
                    </td>
                    <td className="p-3 text-zinc-600">{sede?.nombre.split('-')[0]}</td>
                    <td className="p-3 text-zinc-700">{m.tecnico_nombre}</td>
                    <td className="p-3 font-mono text-zinc-600">{m.tiempo_minutos} min</td>
                    <td className="p-3 font-mono text-[11px] text-emerald-800">{m.estado_final_equipo || 'OPERATIVO'}</td>
                    <td className="p-3 text-right">
                      <button
                        onClick={() => generateMaintenancePDF(m, act, sede)}
                        className="p-1 text-zinc-600 hover:text-zinc-900 hover:bg-zinc-100 rounded border border-zinc-200 inline-flex items-center gap-1"
                        title="Descargar PDF"
                      >
                        <Download className="w-3 h-3" />
                        <span className="text-[10px]">PDF</span>
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
      </div>

    </div>
  );
};
