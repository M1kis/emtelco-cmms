import React, { useState, useEffect } from 'react';
import { 
  X, 
  Wrench, 
  Camera, 
  CheckCircle2, 
  ArrowRight, 
  ArrowLeft, 
  Upload, 
  Trash2, 
  Download,
  Layers,
  Sparkles
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { useData } from '../../context/DataContext';
import { useAuth } from '../../context/AuthContext';
import { DEFAULT_CHECKLIST_TEMPLATES } from '../../lib/mockData';
import { generateMaintenancePDF } from '../../lib/pdfGenerator';
import { SignaturePad } from '../ui/SignaturePad';

const COMMON_SUPPLIES = [
  'Aire comprimido',
  'Alcohol isopropílico dieléctrico',
  'Pasta térmica Arctic MX-4',
  'Paño de microfibra antiestático',
  'Patch cord Cat 6A',
  'Conectores RJ45',
  'Amarres plásticos'
];

export const MaintenanceWizardModal = ({ isOpen, onClose, preselectedAsset = null, preselectedProg = null }) => {
  const { activos, categorias, sedes, executeMantenimiento } = useData();
  const { currentUser } = useAuth();

  const [step, setStep] = useState(1);
  const [selectedAssetId, setSelectedAssetId] = useState(preselectedAsset?.id || (activos[0]?.id || ''));
  const [technicianName, setTechnicianName] = useState(currentUser?.nombre || 'Técnico TICS');
  const [durationMinutes, setDurationMinutes] = useState(45);
  const [tipoMantenimiento, setTipoMantenimiento] = useState(preselectedProg?.tipo_mantenimiento || 'PREVENTIVO');
  const [fechaEjecucion, setFechaEjecucion] = useState(new Date().toISOString().split('T')[0]);
  const [estadoFinal, setEstadoFinal] = useState('OPERATIVO');
  const [conformidadUsuario, setConformidadUsuario] = useState('');
  const [selectedSupplies, setSelectedSupplies] = useState([]);
  const [digitalSignature, setDigitalSignature] = useState(null);

  const [checklist, setChecklist] = useState([]);
  const [customTaskInput, setCustomTaskInput] = useState('');

  const [diagnostico, setDiagnostico] = useState('');
  const [actividades, setActividades] = useState('');
  const [observaciones, setObservaciones] = useState('');

  const [fotoAntes, setFotoAntes] = useState(null);
  const [fotoAntesPreview, setFotoAntesPreview] = useState('');
  const [fotoDespues, setFotoDespues] = useState(null);
  const [fotoDespuesPreview, setFotoDespuesPreview] = useState('');

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [completedMantenimiento, setCompletedMantenimiento] = useState(null);

  useEffect(() => {
    if (preselectedAsset) {
      setSelectedAssetId(preselectedAsset.id);
    }
  }, [preselectedAsset]);

  const currentAsset = activos.find(a => a.id === selectedAssetId);
  const currentCategory = categorias.find(c => c.id === currentAsset?.categoria_id);
  const currentSede = sedes.find(s => s.id === currentAsset?.sede_id);

  useEffect(() => {
    if (currentCategory) {
      const templateTasks = DEFAULT_CHECKLIST_TEMPLATES[currentCategory.codigo] || DEFAULT_CHECKLIST_TEMPLATES.COMPUTO;
      setChecklist(templateTasks.map(t => ({ tarea: t, hecho: true })));
    }
    if (currentAsset?.responsable) {
      setConformidadUsuario(currentAsset.responsable);
    }
  }, [selectedAssetId, currentCategory]);

  if (!isOpen) return null;

  const handleToggleTask = (index) => {
    setChecklist(prev => prev.map((item, idx) => idx === index ? { ...item, hecho: !item.hecho } : item));
  };

  const handleAddCustomTask = () => {
    if (!customTaskInput.trim()) return;
    setChecklist(prev => [...prev, { tarea: customTaskInput.trim(), hecho: true }]);
    setCustomTaskInput('');
  };

  const handleToggleSupply = (supply) => {
    if (selectedSupplies.includes(supply)) {
      setSelectedSupplies(prev => prev.filter(s => s !== supply));
    } else {
      setSelectedSupplies(prev => [...prev, supply]);
    }
  };

  const handleFileChange = (e, tipo) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const previewUrl = URL.createObjectURL(file);
    if (tipo === 'FOTO_ANTES') {
      setFotoAntes(file);
      setFotoAntesPreview(previewUrl);
    } else {
      setFotoDespues(file);
      setFotoDespuesPreview(previewUrl);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const fotosParaSubir = [];
      if (fotoAntes) {
        fotosParaSubir.push({
          file: fotoAntes,
          tipo: 'FOTO_ANTES',
          descripcion: 'Evidencia inicial antes del mantenimiento'
        });
      }
      if (fotoDespues) {
        fotosParaSubir.push({
          file: fotoDespues,
          tipo: 'FOTO_DESPUES',
          descripcion: 'Evidencia final tras mantenimiento preventivo'
        });
      }

      const suppliesText = selectedSupplies.length > 0 ? ` Insumos utilizados: ${selectedSupplies.join(', ')}.` : '';
      const fullObservations = `${observaciones || 'Equipo 100% operativo.'}${suppliesText}`;

      const mantenimientoData = {
        activo_id: selectedAssetId,
        programacion_id: preselectedProg?.id || null,
        tecnico_id: currentUser?.id,
        tecnico_nombre: technicianName,
        fecha_ejecucion: fechaEjecucion,
        tiempo_minutos: Number(durationMinutes) || 45,
        tipo: tipoMantenimiento,
        checklist,
        diagnostico: diagnostico || 'Mantenimiento preventivo completado según protocolo TICS.',
        actividades_realizadas: actividades || 'Limpieza física, optimización lógica, verificación de seguridad y test de conectividad.',
        observaciones: fullObservations,
        estado_final_equipo: estadoFinal,
        conformidad_usuario: conformidadUsuario || 'Usuario / Supervisor en Sitio',
        firma_digital: digitalSignature
      };

      const result = await executeMantenimiento(mantenimientoData, fotosParaSubir);
      setCompletedMantenimiento(result);
      setStep(5);

      confetti({
        particleCount: 70,
        spread: 60,
        origin: { y: 0.6 }
      });

    } catch (err) {
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-zinc-950/60 backdrop-blur-xs overflow-y-auto">
      <div className="bg-white rounded-xl shadow-xl max-w-2xl w-full max-h-[90vh] flex flex-col overflow-hidden border border-zinc-200 animate-in fade-in zoom-in-98 duration-100">
        
        {/* Header */}
        <div className="px-5 py-3.5 border-b border-zinc-200 flex items-center justify-between bg-white">
          <div>
            <div className="flex items-center gap-2">
              <span className="font-mono text-xs text-zinc-400">Paso 0{step} / 04</span>
              <span className="text-zinc-300">&bull;</span>
              <h3 className="text-sm font-semibold text-zinc-900">
                {step === 1 ? 'Selección de Activo' :
                 step === 2 ? 'Protocolo de Actividades' :
                 step === 3 ? 'Diagnóstico & Evidencias' :
                 step === 4 ? 'Firma & Conformidad' : 'Acta Certificada'}
              </h3>
            </div>
          </div>
          
          <button 
            onClick={onClose} 
            className="p-1 text-zinc-400 hover:text-zinc-700 rounded hover:bg-zinc-100"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-5 overflow-y-auto flex-1 space-y-4 text-xs">
          
          {/* PASO 1: Selección de Activo */}
          {step === 1 && (
            <div className="space-y-3.5">
              <div>
                <label className="block text-zinc-700 font-semibold mb-1">
                  Activo a Intervenir *
                </label>
                <select
                  className="w-full px-3 py-2 text-xs border border-zinc-300 rounded-md focus:outline-none focus:border-zinc-800 bg-white font-medium text-zinc-800"
                  value={selectedAssetId}
                  onChange={e => setSelectedAssetId(e.target.value)}
                >
                  {activos.map(a => (
                    <option key={a.id} value={a.id}>
                      [{a.codigo_inventario}] {a.nombre} &bull; {a.marca} {a.modelo}
                    </option>
                  ))}
                </select>
              </div>

              {/* Ficha Resumen */}
              {currentAsset && (
                <div className="bg-zinc-50 p-3.5 rounded-md border border-zinc-200 space-y-2">
                  <div className="flex items-center justify-between border-b border-zinc-200/80 pb-2">
                    <span className="font-mono text-xs font-semibold text-zinc-900 bg-white px-1.5 py-0.5 rounded border border-zinc-200">
                      {currentAsset.codigo_inventario}
                    </span>
                    <span className="text-zinc-500 font-mono text-[11px]">S/N: {currentAsset.serial}</span>
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 text-[11px] text-zinc-600">
                    <p><strong>Tipo:</strong> {currentCategory?.nombre}</p>
                    <p><strong>Sede:</strong> {currentSede?.nombre.split('-')[0]}</p>
                    <p><strong>Ubicación:</strong> {currentAsset.ubicacion_detalle || 'General'}</p>
                    <p><strong>Responsable:</strong> {currentAsset.responsable || 'TICS'}</p>
                    <p><strong>Último:</strong> {currentAsset.ultimo_mantenimiento || 'Nunca'}</p>
                    <p><strong>Frecuencia:</strong> {currentAsset.frecuencia_mantenimiento_meses} meses</p>
                  </div>
                </div>
              )}

              {/* Parámetros */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-1">
                <div>
                  <label className="block text-zinc-700 font-semibold mb-1">
                    Técnico Responsable *
                  </label>
                  <input
                    type="text"
                    required
                    className="w-full px-2.5 py-1.5 border border-zinc-300 rounded-md focus:outline-none focus:border-zinc-800"
                    value={technicianName}
                    onChange={e => setTechnicianName(e.target.value)}
                  />
                </div>

                <div>
                  <label className="block text-zinc-700 font-semibold mb-1">
                    Fecha de Ejecución *
                  </label>
                  <input
                    type="date"
                    required
                    className="w-full px-2.5 py-1.5 border border-zinc-300 rounded-md focus:outline-none focus:border-zinc-800 font-mono"
                    value={fechaEjecucion}
                    onChange={e => setFechaEjecucion(e.target.value)}
                  />
                </div>

                <div>
                  <label className="block text-zinc-700 font-semibold mb-1">
                    Tiempo Empleado (Min)
                  </label>
                  <input
                    type="number"
                    min="5"
                    max="480"
                    className="w-full px-2.5 py-1.5 border border-zinc-300 rounded-md focus:outline-none focus:border-zinc-800 font-mono"
                    value={durationMinutes}
                    onChange={e => setDurationMinutes(e.target.value)}
                  />
                </div>
              </div>
            </div>
          )}

          {/* PASO 2: Checklist */}
          {step === 2 && (
            <div className="space-y-3.5">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-semibold text-zinc-900">
                    Protocolo Preventivo ({currentCategory?.nombre})
                  </h4>
                  <p className="text-[11px] text-zinc-500">
                    Marca las tareas efectuadas durante la revisión
                  </p>
                </div>
                <span className="font-mono text-[11px] text-zinc-600 bg-zinc-100 px-2 py-0.5 rounded">
                  {checklist.filter(c => c.hecho).length} / {checklist.length} verificadas
                </span>
              </div>

              {/* Insumos */}
              <div>
                <label className="block font-semibold text-zinc-700 mb-1.5 flex items-center gap-1.5 text-[11px]">
                  <Layers className="w-3.5 h-3.5 text-zinc-500" />
                  <span>Insumos y Repuestos Utilizados</span>
                </label>
                <div className="flex flex-wrap gap-1.5">
                  {COMMON_SUPPLIES.map(supply => (
                    <button
                      key={supply}
                      type="button"
                      onClick={() => handleToggleSupply(supply)}
                      className={`text-[11px] px-2 py-0.5 rounded border transition-all ${
                        selectedSupplies.includes(supply)
                          ? 'bg-zinc-900 text-white border-zinc-900 font-medium'
                          : 'bg-white text-zinc-600 border-zinc-200 hover:bg-zinc-50'
                      }`}
                    >
                      {supply}
                    </button>
                  ))}
                </div>
              </div>

              {/* Lista */}
              <div className="space-y-1.5 bg-zinc-50 p-3 rounded-md border border-zinc-200 max-h-56 overflow-y-auto">
                {checklist.map((item, idx) => (
                  <label
                    key={idx}
                    className={`flex items-start gap-2.5 p-2 rounded border cursor-pointer transition-colors ${
                      item.hecho ? 'bg-white border-zinc-300 text-zinc-800' : 'bg-zinc-100/50 border-zinc-200 text-zinc-400'
                    }`}
                  >
                    <input
                      type="checkbox"
                      checked={item.hecho}
                      onChange={() => handleToggleTask(idx)}
                      className="mt-0.5 rounded text-zinc-900 focus:ring-0"
                    />
                    <span className="leading-snug">{item.tarea}</span>
                  </label>
                ))}
              </div>

              {/* Añadir */}
              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="Agregar otra tarea realizada..."
                  className="flex-1 px-2.5 py-1.5 border border-zinc-300 rounded-md focus:outline-none focus:border-zinc-800"
                  value={customTaskInput}
                  onChange={e => setCustomTaskInput(e.target.value)}
                  onKeyDown={e => e.key === 'Enter' && handleAddCustomTask()}
                />
                <button
                  type="button"
                  onClick={handleAddCustomTask}
                  className="px-3 py-1.5 bg-zinc-900 hover:bg-zinc-800 text-white rounded-md font-medium"
                >
                  Agregar
                </button>
              </div>
            </div>
          )}

          {/* PASO 3: Diagnóstico y Fotos */}
          {step === 3 && (
            <div className="space-y-3.5">
              <div>
                <label className="block font-semibold text-zinc-700 mb-1">
                  Diagnóstico Técnico Inicial *
                </label>
                <textarea
                  rows="2"
                  required
                  placeholder="Estado general de salud, temperatura, hallazgos de polvo..."
                  className="w-full px-2.5 py-1.5 border border-zinc-300 rounded-md focus:outline-none focus:border-zinc-800"
                  value={diagnostico}
                  onChange={e => setDiagnostico(e.target.value)}
                />
              </div>

              <div>
                <label className="block font-semibold text-zinc-700 mb-1">
                  Actividades Ejecutadas *
                </label>
                <textarea
                  rows="2"
                  required
                  placeholder="Detalle de procedimiento (limpieza, soplado, actualización)..."
                  className="w-full px-2.5 py-1.5 border border-zinc-300 rounded-md focus:outline-none focus:border-zinc-800"
                  value={actividades}
                  onChange={e => setActividades(e.target.value)}
                />
              </div>

              {/* Evidencias */}
              <div>
                <h4 className="font-semibold text-zinc-700 mb-2 flex items-center gap-1.5 text-[11px]">
                  <Camera className="w-3.5 h-3.5 text-zinc-500" />
                  <span>Evidencias Fotográficas (Antes / Después)</span>
                </h4>

                <div className="grid grid-cols-2 gap-3">
                  {/* Foto ANTES */}
                  <div className="border border-dashed border-zinc-300 rounded-md p-2.5 text-center bg-zinc-50 hover:bg-zinc-100 transition-colors">
                    <p className="text-[11px] font-semibold text-zinc-700 mb-1">Foto Antes</p>
                    {fotoAntesPreview ? (
                      <div className="relative rounded overflow-hidden border border-zinc-200">
                        <img src={fotoAntesPreview} alt="Antes" className="w-full h-24 object-cover" />
                        <button
                          type="button"
                          onClick={() => { setFotoAntes(null); setFotoAntesPreview(''); }}
                          className="absolute top-1 right-1 p-1 bg-zinc-900 text-white rounded-full hover:bg-rose-600"
                        >
                          <Trash2 className="w-3 h-3" />
                        </button>
                      </div>
                    ) : (
                      <label className="cursor-pointer block py-3">
                        <Upload className="w-5 h-5 text-zinc-400 mx-auto mb-1 stroke-[1.5]" />
                        <span className="text-[11px] text-zinc-600 font-medium">Subir foto inicial</span>
                        <input
                          type="file"
                          accept="image/*"
                          capture="environment"
                          className="hidden"
                          onChange={e => handleFileChange(e, 'FOTO_ANTES')}
                        />
                      </label>
                    )}
                  </div>

                  {/* Foto DESPUÉS */}
                  <div className="border border-dashed border-zinc-300 rounded-md p-2.5 text-center bg-zinc-50 hover:bg-zinc-100 transition-colors">
                    <p className="text-[11px] font-semibold text-zinc-700 mb-1">Foto Después</p>
                    {fotoDespuesPreview ? (
                      <div className="relative rounded overflow-hidden border border-zinc-200">
                        <img src={fotoDespuesPreview} alt="Después" className="w-full h-24 object-cover" />
                        <button
                          type="button"
                          onClick={() => { setFotoDespues(null); setFotoDespuesPreview(''); }}
                          className="absolute top-1 right-1 p-1 bg-zinc-900 text-white rounded-full hover:bg-rose-600"
                        >
                          <Trash2 className="w-3 h-3" />
                        </button>
                      </div>
                    ) : (
                      <label className="cursor-pointer block py-3">
                        <Upload className="w-5 h-5 text-zinc-400 mx-auto mb-1 stroke-[1.5]" />
                        <span className="text-[11px] text-zinc-600 font-medium">Subir foto final</span>
                        <input
                          type="file"
                          accept="image/*"
                          capture="environment"
                          className="hidden"
                          onChange={e => handleFileChange(e, 'FOTO_DESPUES')}
                        />
                      </label>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* PASO 4: Firma & Cierre */}
          {step === 4 && (
            <div className="space-y-3.5">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-zinc-700 mb-1">
                    Estado Final del Equipo *
                  </label>
                  <select
                    className="w-full px-2.5 py-1.5 border border-zinc-300 rounded-md focus:outline-none focus:border-zinc-800 bg-white font-medium"
                    value={estadoFinal}
                    onChange={e => setEstadoFinal(e.target.value)}
                  >
                    <option value="OPERATIVO">🟢 Operativo 100%</option>
                    <option value="EN_REVISION">🔵 En Revisión</option>
                    <option value="EN_MANTENIMIENTO">🟡 Requiere Repuesto</option>
                  </select>
                </div>

                <div>
                  <label className="block font-semibold text-zinc-700 mb-1">
                    Receptor / Visto Bueno
                  </label>
                  <input
                    type="text"
                    placeholder="Nombre de quien recibe..."
                    className="w-full px-2.5 py-1.5 border border-zinc-300 rounded-md focus:outline-none focus:border-zinc-800"
                    value={conformidadUsuario}
                    onChange={e => setConformidadUsuario(e.target.value)}
                  />
                </div>
              </div>

              {/* Firma Digital */}
              <SignaturePad 
                onSaveSignature={setDigitalSignature}
                initialSignature={digitalSignature}
              />

              <div>
                <label className="block font-semibold text-zinc-700 mb-1">
                  Observaciones al Usuario
                </label>
                <textarea
                  rows="2"
                  placeholder="Recomendaciones de cuidado..."
                  className="w-full px-2.5 py-1.5 border border-zinc-300 rounded-md focus:outline-none focus:border-zinc-800"
                  value={observaciones}
                  onChange={e => setObservaciones(e.target.value)}
                />
              </div>
            </div>
          )}

          {/* PASO 5: Éxito */}
          {step === 5 && completedMantenimiento && (
            <div className="py-6 text-center space-y-3 animate-in fade-in">
              <div className="w-12 h-12 rounded-full bg-zinc-100 text-zinc-900 flex items-center justify-center mx-auto border border-zinc-200">
                <CheckCircle2 className="w-6 h-6 stroke-[1.5]" />
              </div>

              <div>
                <span className="font-mono text-xs font-semibold bg-zinc-100 text-zinc-900 px-2 py-0.5 rounded border border-zinc-200">
                  {completedMantenimiento.codigo_acta}
                </span>
                <h3 className="text-base font-bold text-zinc-900 mt-2">
                  Mantenimiento Certificado con Éxito
                </h3>
                <p className="text-xs text-zinc-500 max-w-sm mx-auto mt-1">
                  El activo <strong className="text-zinc-800">{currentAsset?.codigo_inventario}</strong> quedó actualizado y su próximo mantenimiento fue agendado en el cronograma.
                </p>
              </div>

              <div className="pt-2 flex justify-center gap-2">
                <button
                  onClick={() => generateMaintenancePDF(completedMantenimiento, currentAsset, currentSede)}
                  className="flex items-center gap-1.5 px-4 py-2 bg-zinc-900 hover:bg-zinc-800 text-white font-medium rounded-md transition-colors"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Descargar Acta PDF</span>
                </button>

                <button
                  onClick={onClose}
                  className="px-4 py-2 bg-zinc-100 hover:bg-zinc-200 text-zinc-700 font-medium rounded-md transition-colors"
                >
                  Cerrar
                </button>
              </div>
            </div>
          )}

        </div>

        {/* Footer Navigation */}
        {step < 5 && (
          <div className="px-5 py-3 bg-zinc-50 border-t border-zinc-200 flex items-center justify-between">
            {step > 1 ? (
              <button
                type="button"
                onClick={() => setStep(step - 1)}
                className="flex items-center gap-1 px-3 py-1.5 text-xs font-medium text-zinc-600 hover:bg-zinc-200 rounded transition-colors"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>Anterior</span>
              </button>
            ) : (
              <button
                type="button"
                onClick={onClose}
                className="px-3 py-1.5 text-xs font-medium text-zinc-600 hover:bg-zinc-200 rounded transition-colors"
              >
                Cancelar
              </button>
            )}

            {step < 4 ? (
              <button
                type="button"
                onClick={() => setStep(step + 1)}
                className="flex items-center gap-1 px-4 py-1.5 bg-zinc-900 hover:bg-zinc-800 text-white text-xs font-medium rounded transition-colors"
              >
                <span>Siguiente</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            ) : (
              <button
                type="button"
                disabled={isSubmitting}
                onClick={handleSubmit}
                className="flex items-center gap-1.5 px-4 py-1.5 bg-zinc-900 hover:bg-zinc-800 text-white text-xs font-medium rounded transition-colors disabled:opacity-50"
              >
                <span>{isSubmitting ? 'Guardando...' : 'Finalizar y Certificar'}</span>
              </button>
            )}
          </div>
        )}

      </div>
    </div>
  );
};
