import React, { useState, useMemo } from 'react';
import { 
  Plus, 
  Search, 
  Wrench, 
  Calendar, 
  Download, 
  Eye, 
  FileDown, 
  Camera
} from 'lucide-react';
import { useData } from '../../context/DataContext';
import { MaintenanceWizardModal } from './MaintenanceWizardModal';
import { MaintenanceDetailModal } from './MaintenanceDetailModal';
import { generateMaintenancePDF, generateConsolidatedReportPDF } from '../../lib/pdfGenerator';

export const MaintenanceView = ({ onOpenWizard, isWizardOpen, onCloseWizard, preselectedAsset }) => {
  const { mantenimientos, activos, sedes } = useData();

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedSede, setSelectedSede] = useState('ALL');
  const [selectedMantenimiento, setSelectedMantenimiento] = useState(null);

  const filteredMantenimientos = useMemo(() => {
    return mantenimientos.filter(m => {
      const act = activos.find(a => a.id === m.activo_id);
      const matchSearch = 
        m.codigo_acta.toLowerCase().includes(searchTerm.toLowerCase()) ||
        m.tecnico_nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (act && (act.nombre.toLowerCase().includes(searchTerm.toLowerCase()) || act.codigo_inventario.toLowerCase().includes(searchTerm.toLowerCase())));

      const matchSede = selectedSede === 'ALL' || (act && act.sede_id === selectedSede);

      return matchSearch && matchSede;
    });
  }, [mantenimientos, activos, searchTerm, selectedSede]);

  return (
    <div className="space-y-4 animate-in fade-in duration-150">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-2 border-b border-zinc-200/70">
        <div>
          <h2 className="text-xl font-bold text-zinc-900 tracking-tight">
            Órdenes de Mantenimiento Preventivo
          </h2>
          <p className="text-xs text-zinc-500">
            {mantenimientos.length} actas técnicas certificadas y archivadas
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => generateConsolidatedReportPDF(mantenimientos, activos, sedes)}
            className="btn-interactive flex items-center gap-1.5 px-3 py-1.5 bg-white hover:bg-zinc-50 hover:border-zinc-300 text-zinc-700 text-xs font-medium rounded-md border border-zinc-200 shadow-2xs"
          >
            <FileDown className="w-3.5 h-3.5 text-zinc-500" />
            <span>Exportar Todas</span>
          </button>

          <button
            onClick={onOpenWizard}
            className="btn-interactive flex items-center gap-1.5 px-3 py-1.5 bg-zinc-900 hover:bg-zinc-800 text-white text-xs font-medium rounded-md shadow-2xs"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Nuevo Mantenimiento</span>
          </button>
        </div>
      </div>

      {/* Toolbar */}
      <div className="bg-white p-3 rounded-lg border border-zinc-200/80 shadow-2xs flex flex-col md:flex-row gap-2.5">
        <div className="relative flex-1">
          <Search className="w-3.5 h-3.5 text-zinc-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input 
            type="text"
            placeholder="Buscar por código de acta, técnico o activo..."
            className="w-full pl-8 pr-3 py-1.5 text-xs border border-zinc-200 rounded-md focus:outline-none focus:border-zinc-800 bg-zinc-50/50 transition-colors"
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
          />
        </div>

        <select
          className="px-2.5 py-1.5 text-xs border border-zinc-200 rounded-md bg-white focus:outline-none focus:border-zinc-800 font-medium text-zinc-700 transition-colors hover:border-zinc-300"
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
      {filteredMantenimientos.length === 0 ? (
        <div className="bg-white rounded-lg p-10 text-center border border-zinc-200 text-xs text-zinc-500">
          No se encontraron actas de mantenimiento.
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
          {filteredMantenimientos.map(m => {
            const act = activos.find(a => a.id === m.activo_id);
            const sede = sedes.find(s => s.id === act?.sede_id);
            const tieneFotos = m.evidencias && m.evidencias.length > 0;

            return (
              <div 
                key={m.id}
                className="interactive-card bg-white rounded-lg border border-zinc-200/80 p-4 flex flex-col justify-between shadow-2xs"
              >
                <div>
                  <div className="flex items-center justify-between gap-2 mb-2">
                    <span className="font-mono text-xs font-semibold text-zinc-900 bg-zinc-100 px-2 py-0.5 rounded border border-zinc-200">
                      {m.codigo_acta}
                    </span>

                    <span className="text-[11px] text-zinc-500 font-mono flex items-center gap-1">
                      <Calendar className="w-3 h-3 text-zinc-400" />
                      {m.fecha_ejecucion}
                    </span>
                  </div>

                  <h3 className="text-xs font-semibold text-zinc-900 line-clamp-1">{act?.nombre}</h3>
                  <p className="text-[11px] text-zinc-500">
                    Placa: <strong className="font-mono text-zinc-700">{act?.codigo_inventario}</strong> &bull; Sede: {sede?.nombre.split('-')[0]}
                  </p>

                  <p className="text-xs text-zinc-600 line-clamp-2 mt-2.5 p-2 bg-zinc-50 rounded border border-zinc-100 italic">
                    "{m.diagnostico}"
                  </p>

                  <div className="mt-2.5 flex items-center justify-between text-[11px] text-zinc-500">
                    <span>
                      Técnico: <strong className="text-zinc-800">{m.tecnico_nombre}</strong>
                    </span>

                    <div className="flex items-center gap-2">
                      {tieneFotos && (
                        <span className="inline-flex items-center gap-1 text-[10px] text-zinc-600 bg-zinc-100 px-1.5 py-0.2 rounded border border-zinc-200/50">
                          <Camera className="w-3 h-3" />
                          {m.evidencias.length} fotos
                        </span>
                      )}
                      <span className="font-mono text-zinc-600 bg-zinc-50 px-1.5 py-0.2 rounded border border-zinc-200">
                        {m.tiempo_minutos} min
                      </span>
                    </div>
                  </div>
                </div>

                <div className="mt-3 pt-2.5 border-t border-zinc-100 flex items-center justify-between gap-1.5">
                  <button
                    onClick={() => setSelectedMantenimiento(m)}
                    className="btn-interactive flex-1 py-1 px-2 bg-zinc-50 hover:bg-zinc-100 hover:border-zinc-300 text-zinc-700 hover:text-zinc-900 rounded text-xs font-medium border border-zinc-200 text-center"
                  >
                    Ver Detalles
                  </button>

                  <button
                    onClick={() => generateMaintenancePDF(m, act, sede)}
                    className="btn-interactive flex items-center gap-1 py-1 px-2.5 bg-zinc-900 hover:bg-zinc-800 text-white rounded text-xs font-medium shadow-2xs"
                    title="Descargar Acta Oficial en PDF"
                  >
                    <Download className="w-3 h-3" />
                    <span>Acta PDF</span>
                  </button>
                </div>

              </div>
            );
          })}
        </div>
      )}

      {/* Modales */}
      {isWizardOpen && (
        <MaintenanceWizardModal
          isOpen={isWizardOpen}
          onClose={onCloseWizard}
          preselectedAsset={preselectedAsset}
        />
      )}

      {selectedMantenimiento && (
        <MaintenanceDetailModal
          isOpen={Boolean(selectedMantenimiento)}
          onClose={() => setSelectedMantenimiento(null)}
          mantenimiento={selectedMantenimiento}
        />
      )}

    </div>
  );
};
