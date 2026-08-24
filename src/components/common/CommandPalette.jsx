import React, { useState, useEffect } from 'react';
import { 
  Search, 
  Laptop, 
  Wrench, 
  CalendarDays, 
  FileText, 
  Building2, 
  ArrowRight,
  Plus,
  Command,
  X
} from 'lucide-react';
import { useData } from '../../context/DataContext';

export const CommandPalette = ({ 
  isOpen, 
  onClose, 
  onNavigate, 
  onOpenNewMaintenance, 
  onOpenNewAsset,
  onOpenAssetDetail
}) => {
  const { activos, mantenimientos } = useData();
  const [query, setQuery] = useState('');

  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        onClose ? onClose(!isOpen) : null;
      }
      if (e.key === 'Escape' && isOpen) {
        onClose(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const filteredAssets = activos.filter(a => 
    a.nombre.toLowerCase().includes(query.toLowerCase()) ||
    a.codigo_inventario.toLowerCase().includes(query.toLowerCase()) ||
    a.serial.toLowerCase().includes(query.toLowerCase())
  ).slice(0, 5);

  const quickNav = [
    { label: 'Ir al Dashboard', tab: 'dashboard', icon: Laptop },
    { label: 'Ver Inventario de Activos', tab: 'activos', icon: Laptop },
    { label: 'Ver Mantenimientos y Actas', tab: 'mantenimientos', icon: Wrench },
    { label: 'Ver Cronograma Preventivo', tab: 'cronograma', icon: CalendarDays },
    { label: 'Ver Reportes & SLA', tab: 'reportes', icon: FileText },
    { label: 'Sedes y Configuración', tab: 'sedes', icon: Building2 },
  ].filter(n => n.label.toLowerCase().includes(query.toLowerCase()));

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-20 px-4 bg-zinc-950/60 backdrop-blur-xs">
      <div className="bg-white rounded-xl shadow-2xl max-w-lg w-full overflow-hidden border border-zinc-200 animate-in fade-in zoom-in-98 duration-100">
        
        {/* Search Bar */}
        <div className="flex items-center px-3.5 py-3 border-b border-zinc-200 gap-2.5">
          <Search className="w-4 h-4 text-zinc-400 shrink-0" />
          <input
            type="text"
            autoFocus
            placeholder="Buscar activos, páginas o acciones (Ej. 'Dell', 'Cronograma')..."
            className="w-full text-xs bg-transparent focus:outline-none text-zinc-900 placeholder:text-zinc-400"
            value={query}
            onChange={e => setQuery(e.target.value)}
          />
          <span className="text-[10px] font-mono text-zinc-400 bg-zinc-100 px-1.5 py-0.5 rounded border border-zinc-200 shrink-0">
            ESC
          </span>
        </div>

        {/* Results Body */}
        <div className="max-h-80 overflow-y-auto p-2 space-y-3 text-xs">
          
          {/* Quick Actions */}
          {!query && (
            <div>
              <p className="px-2 py-1 text-[10px] font-semibold text-zinc-400 uppercase tracking-wider">
                Acciones Rápidas
              </p>
              <div className="space-y-0.5">
                <button
                  onClick={() => {
                    onOpenNewMaintenance();
                    onClose(false);
                  }}
                  className="w-full flex items-center justify-between px-2.5 py-2 rounded-md hover:bg-zinc-100 text-zinc-700 transition-colors text-left"
                >
                  <div className="flex items-center gap-2">
                    <Wrench className="w-3.5 h-3.5 text-zinc-500" />
                    <span>Registrar Nuevo Mantenimiento</span>
                  </div>
                  <span className="text-[10px] font-mono text-zinc-400">Crear Acta</span>
                </button>

                <button
                  onClick={() => {
                    onOpenNewAsset();
                    onClose(false);
                  }}
                  className="w-full flex items-center justify-between px-2.5 py-2 rounded-md hover:bg-zinc-100 text-zinc-700 transition-colors text-left"
                >
                  <div className="flex items-center gap-2">
                    <Plus className="w-3.5 h-3.5 text-zinc-500" />
                    <span>Registrar Nuevo Activo Tecnológico</span>
                  </div>
                  <span className="text-[10px] font-mono text-zinc-400">Nuevo Equipo</span>
                </button>
              </div>
            </div>
          )}

          {/* Activos encontrados */}
          {filteredAssets.length > 0 && (
            <div>
              <p className="px-2 py-1 text-[10px] font-semibold text-zinc-400 uppercase tracking-wider">
                Activos Coincidentes ({filteredAssets.length})
              </p>
              <div className="space-y-0.5">
                {filteredAssets.map(asset => (
                  <button
                    key={asset.id}
                    onClick={() => {
                      onOpenAssetDetail(asset);
                      onClose(false);
                    }}
                    className="w-full flex items-center justify-between px-2.5 py-2 rounded-md hover:bg-zinc-100 text-zinc-800 transition-colors text-left"
                  >
                    <div className="min-w-0 pr-2">
                      <div className="flex items-center gap-1.5">
                        <span className="font-mono font-semibold text-zinc-900 bg-zinc-100 px-1 py-0.2 rounded text-[11px] border border-zinc-200">
                          {asset.codigo_inventario}
                        </span>
                        <span className="truncate font-medium">{asset.nombre}</span>
                      </div>
                      <p className="text-[10px] text-zinc-400 truncate mt-0.5">{asset.marca} {asset.modelo} &bull; S/N: {asset.serial}</p>
                    </div>
                    <ArrowRight className="w-3 h-3 text-zinc-400 shrink-0" />
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Navegación */}
          {quickNav.length > 0 && (
            <div>
              <p className="px-2 py-1 text-[10px] font-semibold text-zinc-400 uppercase tracking-wider">
                Navegación del Sistema
              </p>
              <div className="space-y-0.5">
                {quickNav.map(nav => {
                  const Icon = nav.icon;
                  return (
                    <button
                      key={nav.tab}
                      onClick={() => {
                        onNavigate(nav.tab);
                        onClose(false);
                      }}
                      className="w-full flex items-center justify-between px-2.5 py-2 rounded-md hover:bg-zinc-100 text-zinc-700 transition-colors text-left"
                    >
                      <div className="flex items-center gap-2">
                        <Icon className="w-3.5 h-3.5 text-zinc-500" />
                        <span>{nav.label}</span>
                      </div>
                      <ArrowRight className="w-3 h-3 text-zinc-400" />
                    </button>
                  );
                })}
              </div>
            </div>
          )}

        </div>

        {/* Footer */}
        <div className="px-3.5 py-2 bg-zinc-50 border-t border-zinc-200 text-[11px] text-zinc-400 flex items-center justify-between">
          <span>Usa <kbd className="font-mono bg-white px-1 py-0.2 rounded border border-zinc-200">↑</kbd> <kbd className="font-mono bg-white px-1 py-0.2 rounded border border-zinc-200">↓</kbd> para navegar</span>
          <span className="font-mono text-[10px]">EMTELCO CMMS Search</span>
        </div>

      </div>
    </div>
  );
};
