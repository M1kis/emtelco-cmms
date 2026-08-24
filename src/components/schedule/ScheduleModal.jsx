import React, { useState } from 'react';
import { X, CalendarDays } from 'lucide-react';
import { useData } from '../../context/DataContext';

export const ScheduleModal = ({ isOpen, onClose }) => {
  const { activos, addProgramacion } = useData();

  const [formData, setFormData] = useState({
    activo_id: activos[0]?.id || '',
    fecha_programada: new Date().toISOString().split('T')[0],
    prioridad: 'MEDIA',
    tipo_mantenimiento: 'PREVENTIVO',
    notas: 'Mantenimiento preventivo periódico.'
  });

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    addProgramacion(formData);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-zinc-950/60 backdrop-blur-xs overflow-y-auto">
      <div className="bg-white rounded-xl shadow-xl max-w-md w-full overflow-hidden border border-zinc-200 animate-in fade-in zoom-in-98 duration-100 text-xs">
        
        {/* Header */}
        <div className="px-5 py-3.5 border-b border-zinc-200 flex items-center justify-between">
          <h3 className="font-semibold text-zinc-900 text-sm">Programar Tarea de Mantenimiento</h3>
          <button onClick={onClose} className="p-1 text-zinc-400 hover:text-zinc-700 rounded hover:bg-zinc-100">
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-5 space-y-3.5">
          <div>
            <label className="block text-zinc-700 font-semibold mb-1">Activo Tecnológico *</label>
            <select
              className="w-full px-2.5 py-1.5 border border-zinc-300 rounded-md focus:outline-none focus:border-zinc-800 bg-white font-medium text-zinc-800"
              value={formData.activo_id}
              onChange={e => setFormData({ ...formData, activo_id: e.target.value })}
            >
              {activos.map(a => (
                <option key={a.id} value={a.id}>
                  [{a.codigo_inventario}] {a.nombre} &bull; {a.marca}
                </option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-zinc-700 font-semibold mb-1">Fecha Programada *</label>
              <input
                type="date"
                required
                className="w-full px-2.5 py-1.5 border border-zinc-300 rounded-md focus:outline-none focus:border-zinc-800 font-mono"
                value={formData.fecha_programada}
                onChange={e => setFormData({ ...formData, fecha_programada: e.target.value })}
              />
            </div>

            <div>
              <label className="block text-zinc-700 font-semibold mb-1">Prioridad</label>
              <select
                className="w-full px-2.5 py-1.5 border border-zinc-300 rounded-md focus:outline-none focus:border-zinc-800 bg-white"
                value={formData.prioridad}
                onChange={e => setFormData({ ...formData, prioridad: e.target.value })}
              >
                <option value="BAJA">Baja</option>
                <option value="MEDIA">Media</option>
                <option value="ALTA">Alta</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-zinc-700 font-semibold mb-1">Notas y Alcance</label>
            <textarea
              rows="2"
              placeholder="Instrucciones específicas..."
              className="w-full px-2.5 py-1.5 border border-zinc-300 rounded-md focus:outline-none focus:border-zinc-800"
              value={formData.notas}
              onChange={e => setFormData({ ...formData, notas: e.target.value })}
            />
          </div>

          <div className="pt-3 border-t border-zinc-200 flex items-center justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-3 py-1.5 font-medium text-zinc-600 hover:bg-zinc-100 rounded"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="px-3.5 py-1.5 bg-zinc-900 hover:bg-zinc-800 text-white font-medium rounded shadow-2xs"
            >
              Guardar en Cronograma
            </button>
          </div>
        </form>

      </div>
    </div>
  );
};
