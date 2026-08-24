import React, { useState } from 'react';
import { X, Laptop, Save, Cpu, HardDrive, Shield, AlertCircle } from 'lucide-react';
import { useData } from '../../context/DataContext';

export const AssetFormModal = ({ isOpen, onClose, initialData = null }) => {
  const { categorias, sedes, addActivo, updateActivo } = useData();

  const [formData, setFormData] = useState(() => {
    if (initialData) return initialData;
    return {
      codigo_inventario: `EMT-CMP-${Math.floor(1000 + Math.random() * 9000)}`,
      serial: '',
      nombre: '',
      categoria_id: categorias[0]?.id || '',
      marca: '',
      modelo: '',
      sede_id: sedes[0]?.id || '',
      ubicacion_detalle: '',
      responsable: '',
      estado: 'OPERATIVO',
      frecuencia_mantenimiento_meses: 3,
      especificaciones: {
        cpu: '',
        ram: '',
        disco: '',
        so: '',
        ip: ''
      },
      observaciones: ''
    };
  });

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (initialData) {
      updateActivo(initialData.id, formData);
    } else {
      addActivo(formData);
    }
    onClose();
  };

  const handleSpecChange = (key, value) => {
    setFormData(prev => ({
      ...prev,
      especificaciones: {
        ...prev.especificaciones,
        [key]: value
      }
    }));
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm overflow-y-auto">
      <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        
        {/* Modal Header */}
        <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between bg-slate-50">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-emerald-100 text-emerald-700 flex items-center justify-center">
              <Laptop className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-800">
                {initialData ? 'Editar Activo Tecnológico' : 'Registrar Nuevo Activo TICS'}
              </h3>
              <p className="text-xs text-slate-500">Ingresa las especificaciones y ubicación del equipo</p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-200">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4 overflow-y-auto flex-1">
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                Código Placa / Inventario *
              </label>
              <input 
                type="text" 
                required
                className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:outline-none font-mono font-bold text-emerald-800"
                value={formData.codigo_inventario}
                onChange={e => setFormData({ ...formData, codigo_inventario: e.target.value })}
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                Número de Serie (S/N) *
              </label>
              <input 
                type="text" 
                required
                placeholder="Ej. 8CG0123XYZ"
                className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                value={formData.serial}
                onChange={e => setFormData({ ...formData, serial: e.target.value })}
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
              Nombre Descriptivo del Equipo *
            </label>
            <input 
              type="text" 
              required
              placeholder="Ej. Laptop Dell Latitude 5420 - Puesto 14"
              className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:outline-none"
              value={formData.nombre}
              onChange={e => setFormData({ ...formData, nombre: e.target.value })}
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                Categoría *
              </label>
              <select
                className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:outline-none bg-white"
                value={formData.categoria_id}
                onChange={e => setFormData({ ...formData, categoria_id: e.target.value })}
              >
                {categorias.map(c => (
                  <option key={c.id} value={c.id}>{c.nombre}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                Marca *
              </label>
              <input 
                type="text" 
                required
                placeholder="Dell, HP, Cisco, Samsung..."
                className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                value={formData.marca}
                onChange={e => setFormData({ ...formData, marca: e.target.value })}
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                Modelo *
              </label>
              <input 
                type="text" 
                required
                placeholder="Latitude 5420, Catalyst 2960..."
                className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                value={formData.modelo}
                onChange={e => setFormData({ ...formData, modelo: e.target.value })}
              />
            </div>
          </div>

          {/* Sede y Ubicación */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                Sede EMTELCO *
              </label>
              <select
                className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:outline-none bg-white"
                value={formData.sede_id}
                onChange={e => setFormData({ ...formData, sede_id: e.target.value })}
              >
                {sedes.map(s => (
                  <option key={s.id} value={s.id}>{s.nombre}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                Ubicación / Piso / Puesto
              </label>
              <input 
                type="text" 
                placeholder="Piso 3 Isla 4, Rack MDF..."
                className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                value={formData.ubicacion_detalle}
                onChange={e => setFormData({ ...formData, ubicacion_detalle: e.target.value })}
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                Responsable Asignado
              </label>
              <input 
                type="text" 
                placeholder="Nombre de asesor / área"
                className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                value={formData.responsable}
                onChange={e => setFormData({ ...formData, responsable: e.target.value })}
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                Estado Operativo
              </label>
              <select
                className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:outline-none bg-white font-medium"
                value={formData.estado}
                onChange={e => setFormData({ ...formData, estado: e.target.value })}
              >
                <option value="OPERATIVO">🟢 OPERATIVO</option>
                <option value="EN_MANTENIMIENTO">🟡 EN MANTENIMIENTO</option>
                <option value="EN_REVISION">🟠 EN REVISIÓN</option>
                <option value="DE_BAJA">🔴 DE BAJA</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                Frecuencia Prev. (Meses)
              </label>
              <select
                className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:outline-none bg-white"
                value={formData.frecuencia_mantenimiento_meses}
                onChange={e => setFormData({ ...formData, frecuencia_mantenimiento_meses: Number(e.target.value) })}
              >
                <option value="1">Cada 1 mes</option>
                <option value="2">Cada 2 meses</option>
                <option value="3">Cada 3 meses (Trimestral)</option>
                <option value="6">Cada 6 meses (Semestral)</option>
                <option value="12">Cada 12 meses (Anual)</option>
              </select>
            </div>
          </div>

          {/* Especificaciones Técnicas */}
          <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-3">
            <h4 className="text-xs font-bold text-slate-700 uppercase flex items-center gap-1.5">
              <Cpu className="w-4 h-4 text-emerald-600" />
              <span>Especificaciones Técnicas (Ficha de Hardware/Software)</span>
            </h4>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-[11px] font-medium text-slate-600 mb-0.5">CPU / Procesador</label>
                <input 
                  type="text" 
                  placeholder="Intel Core i7 / Xeon Gold / Snapdragon"
                  className="w-full px-2.5 py-1.5 text-xs border border-slate-300 rounded-md bg-white focus:outline-none focus:ring-1 focus:ring-emerald-500"
                  value={formData.especificaciones?.cpu || ''}
                  onChange={e => handleSpecChange('cpu', e.target.value)}
                />
              </div>

              <div>
                <label className="block text-[11px] font-medium text-slate-600 mb-0.5">Memoria RAM</label>
                <input 
                  type="text" 
                  placeholder="16GB DDR4 / 32GB ECC"
                  className="w-full px-2.5 py-1.5 text-xs border border-slate-300 rounded-md bg-white focus:outline-none focus:ring-1 focus:ring-emerald-500"
                  value={formData.especificaciones?.ram || ''}
                  onChange={e => handleSpecChange('ram', e.target.value)}
                />
              </div>

              <div>
                <label className="block text-[11px] font-medium text-slate-600 mb-0.5">Almacenamiento / Disco</label>
                <input 
                  type="text" 
                  placeholder="512GB NVMe SSD / 2TB SAS RAID"
                  className="w-full px-2.5 py-1.5 text-xs border border-slate-300 rounded-md bg-white focus:outline-none focus:ring-1 focus:ring-emerald-500"
                  value={formData.especificaciones?.disco || ''}
                  onChange={e => handleSpecChange('disco', e.target.value)}
                />
              </div>

              <div>
                <label className="block text-[11px] font-medium text-slate-600 mb-0.5">Sistema Operativo / Firmware / IP</label>
                <input 
                  type="text" 
                  placeholder="Windows 11 Pro / Cisco IOS / 192.168.10.X"
                  className="w-full px-2.5 py-1.5 text-xs border border-slate-300 rounded-md bg-white focus:outline-none focus:ring-1 focus:ring-emerald-500"
                  value={formData.especificaciones?.so || ''}
                  onChange={e => handleSpecChange('so', e.target.value)}
                />
              </div>
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
              Observaciones Iniciales
            </label>
            <textarea 
              rows="2"
              placeholder="Notas sobre garantías, accesorios o condiciones particulares..."
              className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:outline-none"
              value={formData.observaciones}
              onChange={e => setFormData({ ...formData, observaciones: e.target.value })}
            />
          </div>

          {/* Footer Buttons */}
          <div className="pt-4 border-t border-slate-200 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-lg transition-colors"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="flex items-center gap-2 px-5 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold rounded-lg shadow-md transition-all active:scale-95"
            >
              <Save className="w-4 h-4" />
              <span>{initialData ? 'Guardar Cambios' : 'Registrar Activo'}</span>
            </button>
          </div>

        </form>

      </div>
    </div>
  );
};
