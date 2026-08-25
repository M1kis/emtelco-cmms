import React from 'react';
import { 
  LayoutDashboard, 
  Laptop, 
  Wrench, 
  X, 
  Plus
} from 'lucide-react';
import { useData } from '../../context/DataContext';

export const Sidebar = ({ 
  currentTab, 
  setCurrentTab, 
  mobileOpen, 
  setMobileOpen,
  onOpenNewMaintenanceModal 
}) => {
  const { kpis } = useData();

  const navItems = [
    { id: 'dashboard', label: 'Inicio', icon: LayoutDashboard, count: null },
    { id: 'activos', label: 'Inventario de Equipos', icon: Laptop, count: kpis.totalActivos },
    { id: 'mantenimientos', label: 'Mantenimientos & Actas', icon: Wrench, count: kpis.totalMantenimientos },
  ];

  return (
    <>
      {/* Backdrop Mobile */}
      {mobileOpen && (
        <div 
          className="fixed inset-0 bg-zinc-950/60 backdrop-blur-xs z-40 lg:hidden transition-opacity duration-200"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside className={`
        fixed top-0 bottom-0 left-0 z-50 w-64 bg-[#0c0c0e] text-zinc-300 flex flex-col transition-transform duration-250 ease-out border-r border-zinc-800/80
        ${mobileOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
      `}>
        
        {/* Brand Header */}
        <div className="px-5 py-4 border-b border-zinc-800/60 flex items-center justify-between">
          <div className="group cursor-pointer" onClick={() => setCurrentTab('dashboard')}>
            <div className="flex items-center gap-1.5 leading-none">
              <span className="font-bold text-zinc-100 text-sm tracking-tight group-hover:text-white transition-colors">EMTELCO</span>
            </div>
            <p className="text-[10px] text-zinc-500 mt-1">Gestión Preventiva de Equipos</p>
          </div>

          <button 
            onClick={() => setMobileOpen(false)}
            className="lg:hidden p-1.5 text-zinc-500 hover:text-zinc-200 rounded-md hover:bg-zinc-800/50 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Acciones Rápidas */}
        <div className="p-3 border-b border-zinc-800/40">
          <button
            onClick={() => {
              onOpenNewMaintenanceModal();
              setMobileOpen(false);
            }}
            className="btn-interactive w-full flex items-center justify-center gap-2 py-2 px-3 bg-zinc-100 hover:bg-white text-zinc-950 rounded-md text-xs font-semibold shadow-xs"
          >
            <Plus className="w-3.5 h-3.5 stroke-[2.5]" />
            <span>Nuevo Mantenimiento</span>
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-2.5 py-3 space-y-1 overflow-y-auto">
          <div className="px-2.5 py-1 text-[10px] font-mono uppercase tracking-wider text-zinc-600">
            Menú Principal
          </div>

          {navItems.map((item) => {
            const Icon = item.icon;
            const active = currentTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => {
                  setCurrentTab(item.id);
                  setMobileOpen(false);
                }}
                className={`w-full flex items-center justify-between px-2.5 py-2.5 rounded-md text-xs font-medium transition-all duration-150 group ${
                  active 
                    ? 'bg-zinc-800/90 text-white font-semibold shadow-2xs translate-x-0.5' 
                    : 'text-zinc-400 hover:bg-zinc-900/80 hover:text-zinc-100 hover:translate-x-0.5'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <Icon className={`w-4 h-4 stroke-[1.75] transition-colors duration-150 ${active ? 'text-zinc-100' : 'text-zinc-500 group-hover:text-zinc-300'}`} />
                  <span>{item.label}</span>
                </div>
                {item.count !== null && (
                  <span className={`text-[10px] font-mono font-semibold px-1.5 py-0.2 rounded transition-all ${
                    active ? 'bg-zinc-700 text-zinc-200' : 'text-zinc-500 group-hover:text-zinc-400'
                  }`}>
                    {item.count}
                  </span>
                )}
              </button>
            );
          })}
        </nav>

        {/* Minimal Footer Info */}
        <div className="p-3 border-t border-zinc-800/60 text-[11px] text-zinc-500">
          <div className="flex items-center justify-between">
            <span>Soporte Técnico</span>
            <span className="font-mono text-[10px] text-zinc-600">v1.0</span>
          </div>
        </div>

      </aside>
    </>
  );
};
