import React, { useState } from 'react';
import { 
  X, 
  Laptop, 
  Save, 
  Cpu, 
  HardDrive, 
  Shield, 
  AlertCircle,
  Camera,
  Upload,
  Trash2,
  Image as ImageIcon
} from 'lucide-react';
import { useData } from '../../context/DataContext';
import { uploadEvidenceImage } from '../../lib/supabase';

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
      imagen_url: '',
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

  const [imagenPreview, setImagenPreview] = useState(initialData?.imagen_url || '');
  const [isUploading, setIsUploading] = useState(false);

  if (!isOpen) return null;

  const handleImageUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const previewUrl = URL.createObjectURL(file);
    setImagenPreview(previewUrl);
    setIsUploading(true);

    try {
      const uploadedUrl = await uploadEvidenceImage(file);
      setFormData(prev => ({
        ...prev,
        imagen_url: uploadedUrl || previewUrl
      }));
    } catch (err) {
      console.warn('Error subiendo imagen, usando URL local:', err);
      setFormData(prev => ({
        ...prev,
        imagen_url: previewUrl
      }));
    } finally {
      setIsUploading(false);
    }
  };

  const handleRemoveImage = () => {
    setImagenPreview('');
    setFormData(prev => ({
      ...prev,
      imagen_url: ''
    }));
  };

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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-zinc-950/60 backdrop-blur-xs overflow-y-auto">
      <div className="bg-white rounded-xl shadow-xl max-w-2xl w-full max-h-[90vh] flex flex-col overflow-hidden border border-zinc-200 animate-in fade-in zoom-in-98 duration-100 text-xs">
        
        {/* Modal Header */}
        <div className="px-5 py-3.5 border-b border-zinc-200 flex items-center justify-between bg-white">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-md bg-zinc-100 text-zinc-900 flex items-center justify-center font-bold">
              <Laptop className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-semibold text-zinc-900">
                {initialData ? 'Editar Equipo' : 'Registrar Nuevo Equipo'}
              </h3>
              <p className="text-[11px] text-zinc-500">Ingresa los datos generales y la fotografía del equipo</p>
            </div>
          </div>
          <button onClick={onClose} className="p-1 text-zinc-400 hover:text-zinc-700 rounded hover:bg-zinc-100 cursor-pointer">
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Modal Body */}
        <form onSubmit={handleSubmit} className="p-5 space-y-4 overflow-y-auto flex-1">
          
          {/* FOTOGRAFÍA DEL EQUIPO (SOLO UNA) */}
          <div>
            <label className="block text-zinc-700 font-semibold mb-1 flex items-center gap-1.5">
              <Camera className="w-3.5 h-3.5 text-zinc-600" />
              <span>Fotografía del Equipo</span>
            </label>

            {imagenPreview ? (
              <div className="relative rounded-lg overflow-hidden border border-zinc-200 bg-zinc-50 flex items-center justify-center max-h-48 group">
                <img 
                  src={imagenPreview} 
                  alt="Vista previa del equipo" 
                  className="max-h-44 w-auto object-contain rounded"
                />
                <button
                  type="button"
                  onClick={handleRemoveImage}
                  className="absolute top-2 right-2 p-1.5 bg-zinc-900/80 hover:bg-rose-600 text-white rounded-full transition-colors cursor-pointer"
                  title="Eliminar imagen"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            ) : (
              <label className="border border-dashed border-zinc-300 hover:border-zinc-500 rounded-lg p-4 text-center bg-zinc-50 hover:bg-zinc-100/80 transition-colors cursor-pointer block">
                <Upload className="w-6 h-6 text-zinc-400 mx-auto mb-1.5 stroke-[1.5]" />
                <p className="text-xs font-semibold text-zinc-800">Seleccionar o tomar fotografía del equipo</p>
                <p className="text-[11px] text-zinc-400 mt-0.5">JPG, PNG o WEBP (Foto única para la ficha técnica)</p>
                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handleImageUpload}
                />
              </label>
            )}
          </div>

          {/* Datos de Placa y Serial */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-zinc-700 font-semibold mb-1">
                Código Placa / Inventario *
              </label>
              <input 
                type="text" 
                required
                className="w-full px-2.5 py-1.5 border border-zinc-300 rounded-md focus:outline-none focus:border-zinc-800 font-mono font-semibold text-zinc-900"
                value={formData.codigo_inventario}
                onChange={e => setFormData({ ...formData, codigo_inventario: e.target.value })}
              />
            </div>

            <div>
              <label className="block text-zinc-700 font-semibold mb-1">
                Número de Serie (S/N) *
              </label>
              <input 
                type="text" 
                required
                placeholder="Ej. NXK6EAA001928"
                className="w-full px-2.5 py-1.5 border border-zinc-300 rounded-md focus:outline-none focus:border-zinc-800 font-mono"
                value={formData.serial}
                onChange={e => setFormData({ ...formData, serial: e.target.value })}
              />
            </div>
          </div>

          {/* Nombre y Categoría */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-zinc-700 font-semibold mb-1">
                Nombre Descriptivo *
              </label>
              <input 
                type="text" 
                required
                placeholder="Ej. Laptop Dell Latitude 5420"
                className="w-full px-2.5 py-1.5 border border-zinc-300 rounded-md focus:outline-none focus:border-zinc-800"
                value={formData.nombre}
                onChange={e => setFormData({ ...formData, nombre: e.target.value })}
              />
            </div>

            <div>
              <label className="block text-zinc-700 font-semibold mb-1">
                Categoría del Activo *
              </label>
              <select
                className="w-full px-2.5 py-1.5 border border-zinc-300 rounded-md focus:outline-none focus:border-zinc-800 bg-white font-medium"
                value={formData.categoria_id}
                onChange={e => setFormData({ ...formData, categoria_id: e.target.value })}
              >
                {categorias.map(cat => (
                  <option key={cat.id} value={cat.id}>{cat.nombre}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Marca, Modelo y Frecuencia */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="block text-zinc-700 font-semibold mb-1">Marca *</label>
              <input 
                type="text" 
                required
                placeholder="Dell, HP, Cisco..."
                className="w-full px-2.5 py-1.5 border border-zinc-300 rounded-md focus:outline-none focus:border-zinc-800"
                value={formData.marca}
                onChange={e => setFormData({ ...formData, marca: e.target.value })}
              />
            </div>

            <div>
              <label className="block text-zinc-700 font-semibold mb-1">Modelo *</label>
              <input 
                type="text" 
                required
                placeholder="Latitude 5420..."
                className="w-full px-2.5 py-1.5 border border-zinc-300 rounded-md focus:outline-none focus:border-zinc-800"
                value={formData.modelo}
                onChange={e => setFormData({ ...formData, modelo: e.target.value })}
              />
            </div>

            <div>
              <label className="block text-zinc-700 font-semibold mb-1">Frecuencia Prev. (Meses)</label>
              <select
                className="w-full px-2.5 py-1.5 border border-zinc-300 rounded-md focus:outline-none focus:border-zinc-800 bg-white"
                value={formData.frecuencia_mantenimiento_meses}
                onChange={e => setFormData({ ...formData, frecuencia_mantenimiento_meses: Number(e.target.value) })}
              >
                <option value={1}>Cada 1 mes</option>
                <option value={2}>Cada 2 meses</option>
                <option value={3}>Cada 3 meses (Trimestral)</option>
                <option value={6}>Cada 6 meses (Semestral)</option>
                <option value={12}>Cada 12 meses (Anual)</option>
              </select>
            </div>
          </div>

          {/* Sede, Ubicación y Responsable */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="block text-zinc-700 font-semibold mb-1">Sede *</label>
              <select
                className="w-full px-2.5 py-1.5 border border-zinc-300 rounded-md focus:outline-none focus:border-zinc-800 bg-white"
                value={formData.sede_id}
                onChange={e => setFormData({ ...formData, sede_id: e.target.value })}
              >
                {sedes.map(s => (
                  <option key={s.id} value={s.id}>{s.nombre.split('-')[0]}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-zinc-700 font-semibold mb-1">Ubicación Detalle</label>
              <input 
                type="text" 
                placeholder="Piso 3, Puesto 12..."
                className="w-full px-2.5 py-1.5 border border-zinc-300 rounded-md focus:outline-none focus:border-zinc-800"
                value={formData.ubicacion_detalle}
                onChange={e => setFormData({ ...formData, ubicacion_detalle: e.target.value })}
              />
            </div>

            <div>
              <label className="block text-zinc-700 font-semibold mb-1">Usuario / Responsable</label>
              <input 
                type="text" 
                placeholder="Nombre del asesor..."
                className="w-full px-2.5 py-1.5 border border-zinc-300 rounded-md focus:outline-none focus:border-zinc-800"
                value={formData.responsable}
                onChange={e => setFormData({ ...formData, responsable: e.target.value })}
              />
            </div>
          </div>

          {/* Estado y Observaciones */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-zinc-700 font-semibold mb-1">Estado Operativo</label>
              <select
                className="w-full px-2.5 py-1.5 border border-zinc-300 rounded-md focus:outline-none focus:border-zinc-800 bg-white font-medium"
                value={formData.estado}
                onChange={e => setFormData({ ...formData, estado: e.target.value })}
              >
                <option value="OPERATIVO">🟢 Operativo</option>
                <option value="EN_MANTENIMIENTO">🟡 En Mantenimiento</option>
                <option value="EN_REVISION">🔵 En Revisión</option>
                <option value="DE_BAJA">🔴 De Baja</option>
              </select>
            </div>

            <div>
              <label className="block text-zinc-700 font-semibold mb-1">Observaciones</label>
              <input 
                type="text" 
                placeholder="Notas adicionales..."
                className="w-full px-2.5 py-1.5 border border-zinc-300 rounded-md focus:outline-none focus:border-zinc-800"
                value={formData.observaciones}
                onChange={e => setFormData({ ...formData, observaciones: e.target.value })}
              />
            </div>
          </div>

          {/* Footer Buttons */}
          <div className="pt-3 border-t border-zinc-200 flex items-center justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="btn-interactive px-3 py-1.5 font-medium text-zinc-600 hover:bg-zinc-100 rounded cursor-pointer"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={isUploading}
              className="btn-interactive px-4 py-1.5 bg-zinc-900 hover:bg-zinc-800 text-white font-medium rounded shadow-2xs cursor-pointer disabled:opacity-50"
            >
              {initialData ? 'Guardar Cambios' : 'Registrar Equipo'}
            </button>
          </div>

        </form>

      </div>
    </div>
  );
};
