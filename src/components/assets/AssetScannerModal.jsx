import React, { useState } from 'react';
import { 
  X, 
  QrCode, 
  Search, 
  Camera, 
  ArrowRight, 
  Laptop, 
  CheckCircle2,
  Wrench
} from 'lucide-react';
import { useData } from '../../context/DataContext';

export const AssetScannerModal = ({ isOpen, onClose, onSelectAssetForMaintenance, onSelectAssetForDetail }) => {
  const { activos, sedes } = useData();
  const [codeQuery, setCodeQuery] = useState('');
  const [scanning, setScanning] = useState(false);

  if (!isOpen) return null;

  const foundAsset = activos.find(a => 
    a.codigo_inventario.toLowerCase() === codeQuery.trim().toLowerCase() ||
    a.serial.toLowerCase() === codeQuery.trim().toLowerCase() ||
    a.id === codeQuery.trim()
  );

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-zinc-950/60 backdrop-blur-xs">
      <div className="bg-white rounded-xl shadow-2xl max-w-md w-full overflow-hidden border border-zinc-200 animate-in fade-in zoom-in-98 duration-100 text-xs">
        
        {/* Header */}
        <div className="px-5 py-3.5 border-b border-zinc-200 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <QrCode className="w-4 h-4 text-zinc-700" />
            <h3 className="font-semibold text-zinc-900 text-sm">Escáner / Búsqueda Rápida de Activo</h3>
          </div>
          <button onClick={onClose} className="p-1 text-zinc-400 hover:text-zinc-700 rounded hover:bg-zinc-100">
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Body */}
        <div className="p-5 space-y-4">
          
          {/* Cámara simulada o input rápido */}
          <div className="border border-zinc-200 rounded-lg p-4 bg-zinc-50 text-center space-y-3">
            <div className="w-16 h-16 rounded-full bg-zinc-900 text-white flex items-center justify-center mx-auto shadow-xs">
              <Camera className="w-8 h-8 stroke-[1.5]" />
            </div>
            <div>
              <h4 className="font-semibold text-zinc-900">Escanear Etiqueta QR del Equipo</h4>
              <p className="text-[11px] text-zinc-500 max-w-xs mx-auto mt-0.5">
                Ingresa o escanea el código de placa corporativa (Ej: <span className="font-mono text-zinc-700 font-semibold">EMT-CMP-1042</span>)
              </p>
            </div>

            <div className="relative">
              <Search className="w-3.5 h-3.5 text-zinc-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                autoFocus
                placeholder="Ingresar código de inventario o serial..."
                className="w-full pl-8 pr-3 py-2 text-xs border border-zinc-300 rounded-md focus:outline-none focus:border-zinc-900 bg-white font-mono"
                value={codeQuery}
                onChange={e => setCodeQuery(e.target.value)}
              />
            </div>

            {/* Accesos rápidos de prueba */}
            <div className="flex flex-wrap items-center justify-center gap-1.5 pt-1">
              <span className="text-[10px] text-zinc-400">Placas de prueba:</span>
              {activos.slice(0, 3).map(a => (
                <button
                  key={a.id}
                  onClick={() => setCodeQuery(a.codigo_inventario)}
                  className="font-mono text-[10px] text-zinc-600 hover:text-zinc-950 bg-white hover:bg-zinc-100 px-1.5 py-0.5 rounded border border-zinc-200 transition-colors"
                >
                  {a.codigo_inventario}
                </button>
              ))}
            </div>
          </div>

          {/* Resultado si se encuentra el equipo */}
          {foundAsset && (
            <div className="bg-white border border-emerald-300 rounded-lg p-3.5 space-y-2.5 shadow-xs animate-in fade-in">
              <div className="flex items-center justify-between">
                <span className="font-mono text-xs font-semibold text-zinc-900 bg-zinc-100 px-2 py-0.5 rounded border border-zinc-200">
                  {foundAsset.codigo_inventario}
                </span>
                <span className="text-[11px] font-semibold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                  {foundAsset.estado}
                </span>
              </div>

              <div>
                <h4 className="font-bold text-zinc-900 text-xs">{foundAsset.nombre}</h4>
                <p className="text-[11px] text-zinc-500 font-mono">
                  {foundAsset.marca} {foundAsset.modelo} &bull; S/N: {foundAsset.serial}
                </p>
                <p className="text-[11px] text-zinc-600 mt-1">
                  Ubicación: <strong>{foundAsset.ubicacion_detalle || 'General'}</strong>
                </p>
              </div>

              <div className="pt-2 border-t border-zinc-100 flex items-center gap-2">
                <button
                  onClick={() => {
                    onSelectAssetForDetail(foundAsset);
                    onClose();
                  }}
                  className="btn-interactive flex-1 py-1.5 px-3 bg-zinc-100 hover:bg-zinc-200 text-zinc-800 font-medium rounded text-xs transition-colors text-center"
                >
                  Ver Ficha Técnica
                </button>

                <button
                  onClick={() => {
                    onSelectAssetForMaintenance(foundAsset);
                    onClose();
                  }}
                  className="btn-interactive flex-1 flex items-center justify-center gap-1.5 py-1.5 px-3 bg-zinc-900 hover:bg-zinc-800 text-white font-medium rounded text-xs transition-colors"
                >
                  <Wrench className="w-3.5 h-3.5" />
                  <span>Mantenimiento</span>
                </button>
              </div>
            </div>
          )}

        </div>

      </div>
    </div>
  );
};
