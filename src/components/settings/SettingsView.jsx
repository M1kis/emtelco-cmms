import React, { useState } from 'react';
import { 
  Building2, 
  Plus, 
  Users, 
  Database, 
  MapPin, 
  Phone
} from 'lucide-react';
import { useData } from '../../context/DataContext';
import { useAuth } from '../../context/AuthContext';

export const SettingsView = ({ onOpenSupabaseModal }) => {
  const { sedes, addSede, isSupabaseActive, activos } = useData();
  const { availableUsers } = useAuth();

  const [showAddSedeModal, setShowAddSedeModal] = useState(false);
  const [newSede, setNewSede] = useState({
    nombre: '',
    ciudad: '',
    direccion: '',
    contacto: '',
    telefono: ''
  });

  const handleCreateSede = (e) => {
    e.preventDefault();
    if (!newSede.nombre || !newSede.ciudad) return;
    addSede(newSede);
    setNewSede({ nombre: '', ciudad: '', direccion: '', contacto: '', telefono: '' });
    setShowAddSedeModal(false);
  };

  return (
    <div className="space-y-4 animate-in fade-in duration-150">
      
      {/* Header */}
      <div className="pb-2 border-b border-zinc-200/70">
        <h2 className="text-xl font-bold text-zinc-900 tracking-tight">
          Configuración & Sedes
        </h2>
        <p className="text-xs text-zinc-500">
          Administración de sedes, personal técnico y estado de la base de datos
        </p>
      </div>

      {/* Database card */}
      <div className="bg-white p-4 rounded-lg border border-zinc-200/80 shadow-2xs flex flex-col md:flex-row md:items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-md bg-zinc-100 text-zinc-900 flex items-center justify-center font-semibold shrink-0">
            <Database className="w-4 h-4" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-semibold text-zinc-900">Base de Datos PostgreSQL (Supabase)</span>
              <span className={`text-[10px] font-mono font-semibold px-1.5 py-0.2 rounded ${
                isSupabaseActive ? 'bg-emerald-50 text-emerald-800 border border-emerald-200' : 'bg-amber-50 text-amber-800 border border-amber-200'
              }`}>
                {isSupabaseActive ? 'Conectado' : 'Modo Local'}
              </span>
            </div>
            <p className="text-[11px] text-zinc-500 mt-0.5">
              {isSupabaseActive 
                ? 'Sincronización en la nube activa con almacenamiento de evidencias fotográficas.' 
                : 'Almacenamiento local en navegador. Puedes conectar tu base de datos Supabase en cualquier momento.'}
            </p>
          </div>
        </div>

        <button
          onClick={onOpenSupabaseModal}
          className="btn-interactive px-3 py-1.5 bg-zinc-900 hover:bg-zinc-800 text-white rounded-md text-xs font-medium shrink-0 self-start md:self-auto shadow-2xs"
        >
          Configuración DB
        </button>
      </div>

      {/* Sedes */}
      <div className="bg-white p-4 rounded-lg border border-zinc-200/80 shadow-2xs space-y-3">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-xs font-bold text-zinc-800 uppercase tracking-wider flex items-center gap-1.5">
              <Building2 className="w-3.5 h-3.5 text-zinc-500" />
              <span>Sedes Operativas EMTELCO ({sedes.length})</span>
            </h3>
            <p className="text-[11px] text-zinc-500">Puntos de atención donde opera el soporte técnico</p>
          </div>

          <button
            onClick={() => setShowAddSedeModal(true)}
            className="btn-interactive flex items-center gap-1 px-2.5 py-1 bg-zinc-900 hover:bg-zinc-800 text-white text-xs font-medium rounded-md shadow-2xs"
          >
            <Plus className="w-3 h-3" />
            <span>Nueva Sede</span>
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 text-xs">
          {sedes.map(sede => {
            const count = activos.filter(a => a.sede_id === sede.id).length;
            return (
              <div key={sede.id} className="interactive-card p-3 rounded-md border border-zinc-200/70 bg-zinc-50 hover:bg-white transition-all">
                <div className="flex items-center justify-between mb-1.5">
                  <span className="font-semibold text-zinc-900">{sede.nombre}</span>
                  <span className="font-mono text-[10px] text-zinc-600 bg-white px-1.5 py-0.2 rounded border border-zinc-200">
                    {count} activos
                  </span>
                </div>
                <div className="space-y-0.5 text-[11px] text-zinc-500">
                  <p className="flex items-center gap-1">
                    <MapPin className="w-3 h-3 text-zinc-400" />
                    <span>{sede.ciudad} &bull; {sede.direccion}</span>
                  </p>
                  <p className="flex items-center gap-1">
                    <Phone className="w-3 h-3 text-zinc-400" />
                    <span>{sede.contacto} ({sede.telefono})</span>
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Usuarios */}
      <div className="bg-white p-4 rounded-lg border border-zinc-200/80 shadow-2xs space-y-3">
        <div>
          <h3 className="text-xs font-bold text-zinc-800 uppercase tracking-wider flex items-center gap-1.5">
            <Users className="w-3.5 h-3.5 text-zinc-500" />
            <span>Personal Técnico & Administradores ({availableUsers.length})</span>
          </h3>
          <p className="text-[11px] text-zinc-500">Usuarios autorizados en el sistema CMMS</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 text-xs">
          {availableUsers.map(user => (
            <div key={user.id} className="interactive-card p-3.5 rounded-md border border-zinc-200/70 bg-zinc-50 hover:bg-white transition-all flex items-center gap-3">
              <img 
                src={user.avatar} 
                alt={user.nombre} 
                className="w-10 h-10 rounded-full object-cover grayscale contrast-125 border border-zinc-200"
              />
              <div className="min-w-0">
                <p className="font-semibold text-zinc-900 truncate">{user.nombre}</p>
                <p className="text-[11px] text-zinc-500 truncate">{user.cargo}</p>
                <span className="font-mono text-[9px] uppercase font-semibold text-zinc-500 bg-white px-1.5 py-0.2 rounded border border-zinc-200 inline-block mt-1">
                  {user.rol}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Créditos de Tesis */}
      <div className="p-4 rounded-lg border border-zinc-200 bg-white text-xs space-y-1 text-zinc-600">
        <div className="flex items-center justify-between font-mono text-[10px] text-zinc-400 uppercase">
          <span>Corporación Unificada Nacional de Educación Superior (CUN)</span>
          <span>2026</span>
        </div>
        <p className="font-semibold text-zinc-900">
          Trabajo de Grado 3 &ndash; Modelos de Innovación Ingeniería de Sistemas
        </p>
        <p className="text-[11px] text-zinc-500 italic">
          "Desarrollo de un aplicativo web para el registro y control del mantenimiento preventivo realizado por el área de TICS de la empresa EMTELCO"
        </p>
        <p className="text-[11px] text-zinc-500 pt-1">
          Autores: <strong>Deiver Alejandro Pedrozo Alvarado</strong> (CC. 1085036927) &bull; <strong>German Augusto Muñoz Melón</strong> (CC. 1098688271)
        </p>
      </div>

      {/* Modal Nueva Sede */}
      {showAddSedeModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-zinc-950/60 backdrop-blur-xs">
          <div className="bg-white rounded-xl shadow-xl max-w-sm w-full p-5 space-y-3 text-xs border border-zinc-200 animate-in fade-in zoom-in-98 duration-100">
            <h3 className="font-semibold text-zinc-900 text-sm">Agregar Sede EMTELCO</h3>
            
            <form onSubmit={handleCreateSede} className="space-y-2.5">
              <div>
                <label className="block text-zinc-700 font-semibold mb-1">Nombre *</label>
                <input 
                  type="text" 
                  required
                  placeholder="Ej. Sede Operaciones Itagüí"
                  className="w-full px-2.5 py-1.5 border border-zinc-300 rounded-md focus:outline-none focus:border-zinc-800"
                  value={newSede.nombre}
                  onChange={e => setNewSede({ ...newSede, nombre: e.target.value })}
                />
              </div>

              <div>
                <label className="block text-zinc-700 font-semibold mb-1">Ciudad *</label>
                <input 
                  type="text" 
                  required
                  placeholder="Medellín, Cali..."
                  className="w-full px-2.5 py-1.5 border border-zinc-300 rounded-md focus:outline-none focus:border-zinc-800"
                  value={newSede.ciudad}
                  onChange={e => setNewSede({ ...newSede, ciudad: e.target.value })}
                />
              </div>

              <div>
                <label className="block text-zinc-700 font-semibold mb-1">Dirección</label>
                <input 
                  type="text" 
                  placeholder="Calle / Carrera"
                  className="w-full px-2.5 py-1.5 border border-zinc-300 rounded-md focus:outline-none focus:border-zinc-800"
                  value={newSede.direccion}
                  onChange={e => setNewSede({ ...newSede, direccion: e.target.value })}
                />
              </div>

              <div>
                <label className="block text-zinc-700 font-semibold mb-1">Contacto</label>
                <input 
                  type="text" 
                  placeholder="Responsable TICS"
                  className="w-full px-2.5 py-1.5 border border-zinc-300 rounded-md focus:outline-none focus:border-zinc-800"
                  value={newSede.contacto}
                  onChange={e => setNewSede({ ...newSede, contacto: e.target.value })}
                />
              </div>

              <div className="pt-2 border-t flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowAddSedeModal(false)}
                  className="btn-interactive px-2.5 py-1 text-zinc-600 font-medium hover:bg-zinc-100 rounded"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="btn-interactive px-3 py-1 bg-zinc-900 text-white font-medium rounded shadow-2xs"
                >
                  Guardar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
