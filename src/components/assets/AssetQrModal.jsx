import React, { useEffect, useState, useRef } from 'react';
import QRCode from 'qrcode';
import { X, Printer, Download, QrCode, Laptop, Building2, Tag } from 'lucide-react';
import { useData } from '../../context/DataContext';

export const AssetQrModal = ({ asset, isOpen, onClose }) => {
  const { sedes, categorias } = useData();
  const [qrDataUrl, setQrDataUrl] = useState('');
  const printRef = useRef(null);

  useEffect(() => {
    if (!asset) return;

    // Generar información QR
    const qrPayload = JSON.stringify({
      placa: asset.codigo_inventario,
      serial: asset.serial,
      equipo: asset.nombre,
      sede_id: asset.sede_id,
      cmms_url: `https://emtelco-cmms.app/activo/${asset.codigo_inventario}`
    });

    QRCode.toDataURL(qrPayload, {
      width: 250,
      margin: 1,
      color: {
        dark: '#064e3b', // Verde EMTELCO
        light: '#ffffff'
      }
    })
    .then(url => setQrDataUrl(url))
    .catch(err => console.error(err));
  }, [asset]);

  if (!isOpen || !asset) return null;

  const sede = sedes.find(s => s.id === asset.sede_id);
  const categoria = categorias.find(c => c.id === asset.categoria_id);

  const handlePrint = () => {
    const printContent = printRef.current;
    const windowPrint = window.open('', '', 'left=0,top=0,width=800,height=900,toolbar=0,scrollbars=0,status=0');
    windowPrint.document.write(`
      <html>
        <head>
          <title>Etiqueta_Inventario_${asset.codigo_inventario}</title>
          <style>
            body { font-family: sans-serif; display: flex; justify-content: center; align-items: center; height: 100vh; margin: 0; background: #fff; }
            .tag { width: 340px; border: 2px solid #064e3b; border-radius: 8px; padding: 14px; text-align: center; }
            .header { background: #064e3b; color: white; padding: 6px; font-weight: bold; font-size: 14px; border-radius: 4px; }
            .code { font-size: 20px; font-weight: 800; font-family: monospace; color: #064e3b; margin: 8px 0; }
            .qr { width: 140px; height: 140px; margin: 6px auto; }
            .info { font-size: 11px; color: #333; line-height: 1.4; border-top: 1px dashed #ccc; padding-top: 6px; margin-top: 6px; text-align: left; }
          </style>
        </head>
        <body>
          <div class="tag">
            <div class="header">EMTELCO S.A.S. - TICS</div>
            <div class="code">${asset.codigo_inventario}</div>
            <img src="${qrDataUrl}" class="qr" />
            <div class="info">
              <strong>Equipo:</strong> ${asset.nombre}<br/>
              <strong>Marca/Modelo:</strong> ${asset.marca} ${asset.modelo}<br/>
              <strong>Serial:</strong> ${asset.serial}<br/>
              <strong>Sede:</strong> ${sede?.nombre || 'EMTELCO'}
            </div>
          </div>
        </body>
      </html>
    `);
    windowPrint.document.close();
    windowPrint.focus();
    setTimeout(() => {
      windowPrint.print();
      windowPrint.close();
    }, 250);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm overflow-y-auto">
      <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        
        {/* Header */}
        <div className="px-6 py-4 bg-slate-900 text-white flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-emerald-500/20 text-emerald-400 flex items-center justify-center border border-emerald-500/30">
              <QrCode className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white">Etiqueta de Inventario QR</h3>
              <p className="text-xs text-slate-400">Código de escaneo rápido en sitio</p>
            </div>
          </div>
          <button onClick={onClose} className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tag Preview */}
        <div className="p-6 flex flex-col items-center">
          
          <div 
            ref={printRef}
            className="w-full max-w-[320px] bg-white border-2 border-emerald-800 rounded-xl p-4 text-center shadow-md space-y-2"
          >
            <div className="bg-emerald-900 text-white text-xs font-bold py-1 px-2 rounded tracking-wider flex items-center justify-center gap-1">
              <Tag className="w-3 h-3" />
              <span>EMTELCO S.A.S. &bull; ÁREA TICS</span>
            </div>

            <div className="text-xl font-extrabold font-mono text-emerald-900 tracking-wider">
              {asset.codigo_inventario}
            </div>

            {qrDataUrl ? (
              <img src={qrDataUrl} alt="QR Activo" className="w-36 h-36 mx-auto rounded-lg border border-slate-200" />
            ) : (
              <div className="w-36 h-36 mx-auto bg-slate-100 animate-pulse rounded-lg" />
            )}

            <div className="text-[11px] text-slate-700 text-left border-t border-dashed border-slate-300 pt-2 space-y-0.5">
              <p className="truncate"><strong>Equipo:</strong> {asset.nombre}</p>
              <p className="truncate"><strong>Modelo:</strong> {asset.marca} {asset.modelo}</p>
              <p className="truncate"><strong>Serial:</strong> <span className="font-mono">{asset.serial}</span></p>
              <p className="truncate"><strong>Sede:</strong> {sede?.nombre.split('-')[0]}</p>
            </div>
          </div>

          <p className="text-xs text-slate-400 text-center mt-4">
            Imprime y adhiere esta etiqueta al equipo físico para que el técnico en terreno pueda escanearla e iniciar el mantenimiento de inmediato.
          </p>

        </div>

        {/* Footer */}
        <div className="px-6 py-4 bg-slate-50 border-t border-slate-200 flex items-center justify-between">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-200 rounded-lg transition-colors"
          >
            Cerrar
          </button>

          <button
            type="button"
            onClick={handlePrint}
            className="flex items-center gap-2 px-5 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold rounded-lg shadow-md transition-all active:scale-95"
          >
            <Printer className="w-4 h-4" />
            <span>Imprimir Etiqueta</span>
          </button>
        </div>

      </div>
    </div>
  );
};
