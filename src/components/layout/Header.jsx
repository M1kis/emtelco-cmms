import React, { useState } from 'react';
import { 
  Database, 
  Menu, 
  ChevronDown,
  Search,
  QrCode
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useData } from '../../context/DataContext';

export const Header = ({ 
  onOpenMobileMenu, 
  currentView, 
  onOpenSupabaseModal,
  onOpenCommandPalette,
  onOpenScannerModal
}) => {
  const { currentUser, switchUser, availableUsers } = useAuth();
  const { isSupabaseActive } = useData();
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);

  return (
    <header className="sticky top-0 z-30 bg-white/85 backdrop-blur-md border-b border-zinc-200/80 px-4 lg:px-8 py-2.5 transition-all">
      <div className="flex items-center justify-between gap-4 max-w-7xl mx-auto">
        
        {/* Izquierda: Menú Mobile + Breadcrumb */}
        <div className="flex items-center gap-3">
          <button 
            onClick={onOpenMobileMenu}
            className="lg:hidden p-1.5 rounded-md text-zinc-600 hover:bg-zinc-100 hover:text-zinc-900 transition-colors focus:outline-none"
            aria-label="Abrir menú"
          >
            <Menu className="w-5 h-5 stroke-[1.5]" />
          </button>

          <div className="flex items-center gap-2 text-xs select-none">
            <span className="text-zinc-400 font-medium hidden sm:inline hover:text-zinc-600 transition-colors">EMTELCO</span>
            <span className="text-zinc-300 hidden sm:inline">/</span>
            <span className="text-zinc-400 font-medium hidden sm:inline hover:text-zinc-600 transition-colors">TICS</span>
            <span className="text-zinc-300 hidden sm:inline">/</span>
            <span className="font-semibold text-zinc-900 tracking-tight">{currentView}</span>
          </div>
        </div>

        {/* Centro/Búsqueda Rápida (Desktop) */}
        <button
          onClick={onOpenCommandPalette}
          className="hidden md:flex items-center gap-3 px-3 py-1.5 rounded-md border border-zinc-200 hover:border-zinc-300 bg-zinc-50/70 hover:bg-zinc-100 text-zinc-400 text-xs transition-all w-64 justify-between"
        >
          <div className="flex items-center gap-2">
            <Search className="w-3.5 h-3.5 text-zinc-400" />
            <span className="text-zinc-500 font-normal">Buscar activos o menú...</span>
          </div>
          <kbd className="font-mono text-[10px] text-zinc-500 bg-white px-1.5 py-0.2 rounded border border-zinc-200 shadow-2xs">
            Ctrl K
          </kbd>
        </button>

        {/* Derecha: Scanner + Estado DB + Selector de Usuario */}
        <div className="flex items-center gap-2">
          
          {/* Botón QR Scanner Rápido */}
          <button
            onClick={onOpenScannerModal}
            className="btn-interactive flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[11px] font-medium border border-zinc-200 hover:border-zinc-300 hover:bg-zinc-50 text-zinc-700 bg-white shadow-2xs"
            title="Escanear o buscar código QR"
          >
            <QrCode className="w-3.5 h-3.5 text-zinc-600" />
            <span className="hidden sm:inline">Escanear QR</span>
          </button>

          {/* Status Database */}
          <button
            onClick={onOpenSupabaseModal}
            className="btn-interactive flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[11px] font-medium border border-zinc-200 hover:border-zinc-300 hover:bg-zinc-50 text-zinc-700 bg-white shadow-2xs group"
            title="Estado de conexión Supabase"
          >
            <span className={`w-1.5 h-1.5 rounded-full transition-transform duration-200 group-hover:scale-125 ${isSupabaseActive ? 'bg-emerald-500' : 'bg-amber-500'}`} />
            <span className="hidden lg:inline">
              {isSupabaseActive ? 'Supabase Conectado' : 'Modo Local'}
            </span>
          </button>

          {/* User selector */}
          <div className="relative">
            <button
              onClick={() => setUserDropdownOpen(!userDropdownOpen)}
              className="btn-interactive flex items-center gap-2 p-1 pr-2 rounded-full hover:bg-zinc-100/80 border border-zinc-200 hover:border-zinc-300 transition-all text-left shadow-2xs"
            >
              <img 
                src={currentUser?.avatar} 
                alt={currentUser?.nombre} 
                className="w-6 h-6 rounded-full object-cover grayscale contrast-125"
              />
              <span className="text-xs font-medium text-zinc-800 hidden sm:inline">
                {currentUser?.nombre?.split(' ')[0]}
              </span>
              <span className="text-[10px] text-zinc-500 uppercase font-mono px-1.5 py-0.2 bg-zinc-100 rounded border border-zinc-200/50">
                {currentUser?.rol}
              </span>
              <ChevronDown className={`w-3.5 h-3.5 text-zinc-400 stroke-[1.5] transition-transform duration-200 ${userDropdownOpen ? 'rotate-180 text-zinc-700' : ''}`} />
            </button>

            {userDropdownOpen && (
              <div 
                className="absolute right-0 mt-2 w-64 bg-white rounded-lg shadow-lg border border-zinc-200 py-1.5 z-50 animate-in fade-in slide-in-from-top-1 duration-150"
                onClick={() => setUserDropdownOpen(false)}
              >
                <div className="px-3 py-1.5 border-b border-zinc-100">
                  <p className="text-[10px] font-semibold text-zinc-400 uppercase tracking-wider">
                    Cambiar Perfil de Usuario
                  </p>
                </div>

                <div className="py-1">
                  {availableUsers.map((user) => (
                    <button
                      key={user.id}
                      onClick={() => switchUser(user.id)}
                      className={`w-full text-left px-3 py-2 flex items-center justify-between text-xs transition-colors duration-100 ${
                        currentUser?.id === user.id ? 'bg-zinc-100 font-semibold text-zinc-900' : 'text-zinc-600 hover:bg-zinc-50 hover:text-zinc-900'
                      }`}
                    >
                      <div className="truncate">
                        <p className="truncate">{user.nombre}</p>
                        <p className="text-[10px] text-zinc-400 font-normal">{user.cargo}</p>
                      </div>
                      <span className="text-[10px] font-mono text-zinc-500 bg-zinc-100 px-1.5 py-0.5 rounded ml-2 border border-zinc-200/50">
                        {user.rol}
                      </span>
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

        </div>
      </div>
    </header>
  );
};
