import React, { useState } from 'react';
import { X, Database, CheckCircle2, AlertCircle, Copy, ExternalLink, Code2 } from 'lucide-react';
import { useData } from '../../context/DataContext';

export const SupabaseConfigModal = ({ isOpen, onClose }) => {
  const { isSupabaseActive } = useData();
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const copyEnvSample = () => {
    navigator.clipboard.writeText(`VITE_SUPABASE_URL=https://tu-proyecto.supabase.co\nVITE_SUPABASE_ANON_KEY=tu-anon-key-aqui`);
    setCopied(true);
    setTimeout(() => setCopied(false), 3000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/70 backdrop-blur-sm overflow-y-auto">
      <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        
        {/* Header */}
        <div className="px-6 py-4 bg-slate-900 text-white flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-500 text-slate-950 flex items-center justify-center font-bold">
              <Database className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white">Estado de Conexión: Supabase BaaS</h3>
              <p className="text-xs text-slate-400">Base de Datos PostgreSQL en la Nube y Storage de Evidencias</p>
            </div>
          </div>
          <button onClick={onClose} className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-5 text-xs">
          
          {/* Estado actual */}
          <div className={`p-4 rounded-xl border flex items-start gap-3 ${
            isSupabaseActive ? 'bg-emerald-50 border-emerald-200 text-emerald-900' : 'bg-amber-50 border-amber-200 text-amber-900'
          }`}>
            {isSupabaseActive ? (
              <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
            ) : (
              <AlertCircle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
            )}
            <div>
              <h4 className="font-bold text-sm">
                {isSupabaseActive ? '✅ Conexión a Supabase Activa y Sincronizada' : '⚡ Modo Demostración Local Activo (Offline / LocalStorage)'}
              </h4>
              <p className="mt-1 leading-relaxed">
                {isSupabaseActive 
                  ? 'Todas las operaciones de inventario, mantenimientos y subida de fotos se están sincronizando directamente con la base de datos PostgreSQL de Supabase en la nube.'
                  : 'El aplicativo está funcionando con almacenamiento local de alto rendimiento. Para conectar tu base de datos Supabase en minutos, sigue los pasos a continuación.'}
              </p>
            </div>
          </div>

          {/* Pasos para conectar Supabase */}
          <div className="space-y-3">
            <h4 className="font-bold text-slate-800 uppercase text-[11px]">
              Pasos para conectar Supabase en 3 minutos:
            </h4>

            <div className="space-y-2.5">
              <div className="p-3 bg-slate-50 rounded-lg border border-slate-200">
                <span className="font-bold text-slate-800 block mb-0.5">1. Crear proyecto en Supabase</span>
                <p className="text-slate-600">
                  Ingresa a <a href="https://supabase.com" target="_blank" rel="noreferrer" className="text-emerald-600 underline font-semibold inline-flex items-center gap-0.5">supabase.com <ExternalLink className="w-3 h-3" /></a> y crea una organización y proyecto gratuito.
                </p>
              </div>

              <div className="p-3 bg-slate-50 rounded-lg border border-slate-200">
                <span className="font-bold text-slate-800 block mb-0.5">2. Ejecutar Script SQL de 1 Clic</span>
                <p className="text-slate-600">
                  Abre el archivo <strong className="text-slate-800 font-mono">supabase/schema.sql</strong> del proyecto, copia todo su contenido y pégalo en el menú <strong>SQL Editor</strong> de Supabase. Dale clic a <strong>RUN</strong>.
                </p>
              </div>

              <div className="p-3 bg-slate-50 rounded-lg border border-slate-200">
                <span className="font-bold text-slate-800 block mb-0.5">3. Configurar variables en .env</span>
                <p className="text-slate-600 mb-2">
                  En el panel de Supabase ve a <strong>Project Settings &rarr; API</strong> y copia la URL y Anon Key en tu archivo <code className="font-mono bg-white px-1 py-0.5 rounded border border-slate-300">.env</code>:
                </p>
                <div className="bg-slate-900 text-emerald-400 p-2.5 rounded-lg font-mono flex items-center justify-between">
                  <pre className="text-[11px] overflow-x-auto">VITE_SUPABASE_URL=https://tu-proyecto.supabase.co{"\n"}VITE_SUPABASE_ANON_KEY=tu-anon-key</pre>
                  <button
                    onClick={copyEnvSample}
                    className="p-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded text-xs flex items-center gap-1 shrink-0 ml-2"
                  >
                    <Copy className="w-3.5 h-3.5" />
                    <span>{copied ? 'Copiado!' : 'Copiar'}</span>
                  </button>
                </div>
              </div>
            </div>
          </div>

        </div>

        {/* Footer */}
        <div className="px-6 py-4 bg-slate-50 border-t border-slate-200 flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2 bg-slate-800 hover:bg-slate-700 text-white rounded-lg font-bold text-xs"
          >
            Entendido
          </button>
        </div>

      </div>
    </div>
  );
};
