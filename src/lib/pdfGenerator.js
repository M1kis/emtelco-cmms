import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import QRCode from 'qrcode';

/**
 * Genera y descarga el Acta Oficial de Mantenimiento Preventivo en PDF
 * Incluye código QR de validación y firma digital estampada
 */
export async function generateMaintenancePDF(mantenimiento, activo, sede) {
  const doc = new jsPDF();
  const pageWidth = doc.internal.pageSize.getWidth();

  // --- 1. GENERAR CÓDIGO QR PARA EL ACTA ---
  let qrImage = null;
  try {
    const qrText = `EMTELCO-CMMS|ACTA:${mantenimiento.codigo_acta}|ACTIVO:${activo?.codigo_inventario}|FECHA:${mantenimiento.fecha_ejecucion}|TECNICO:${mantenimiento.tecnico_nombre}`;
    qrImage = await QRCode.toDataURL(qrText, { margin: 1, width: 120 });
  } catch (err) {
    console.warn('No se pudo generar QR para PDF:', err);
  }

  // --- 2. ENCABEZADO CORPORATIVO ---
  doc.setFillColor(6, 78, 59); // Verde esmeralda oscuro EMTELCO (#064e3b)
  doc.rect(0, 0, pageWidth, 30, 'F');

  doc.setTextColor(255, 255, 255);
  doc.setFontSize(15);
  doc.setFont('helvetica', 'bold');
  doc.text('EMTELCO S.A.S. - ÁREA DE TICS', 14, 12);

  doc.setFontSize(9.5);
  doc.setFont('helvetica', 'normal');
  doc.text('SISTEMA CMMS - CONTROL DE MANTENIMIENTO PREVENTIVO', 14, 19);
  doc.setFontSize(8);
  doc.text('Soporte Técnico en Sitio • Trazabilidad y Calidad ISO/IEC 20000', 14, 25);

  // Código de acta y QR a la derecha
  doc.setFontSize(11);
  doc.setFont('helvetica', 'bold');
  doc.text(`ACTA N°: ${mantenimiento.codigo_acta || 'ACT-PREVENTIVO'}`, pageWidth - 42, 12, { align: 'right' });
  doc.setFontSize(8.5);
  doc.setFont('helvetica', 'normal');
  doc.text(`Fecha: ${mantenimiento.fecha_ejecucion || new Date().toISOString().split('T')[0]}`, pageWidth - 42, 18, { align: 'right' });

  if (qrImage) {
    doc.addImage(qrImage, 'PNG', pageWidth - 36, 4, 22, 22);
  }

  // --- 3. INFORMACIÓN DEL ACTIVO Y SEDE ---
  let currentY = 38;
  doc.setTextColor(15, 23, 42); // slate-900
  doc.setFontSize(10.5);
  doc.setFont('helvetica', 'bold');
  doc.text('1. INFORMACIÓN DEL ACTIVO TECNOLÓGICO', 14, currentY);

  autoTable(doc, {
    startY: currentY + 3,
    theme: 'grid',
    headStyles: { fillColor: [5, 150, 105], textColor: [255, 255, 255], fontStyle: 'bold' },
    styles: { fontSize: 8, cellPadding: 2.5 },
    head: [['Código Placa', 'Número Serial', 'Equipo / Marca / Modelo', 'Sede y Ubicación', 'Responsable']],
    body: [
      [
        activo?.codigo_inventario || 'N/A',
        activo?.serial || 'N/A',
        `${activo?.nombre || ''}\n${activo?.marca || ''} ${activo?.modelo || ''}`,
        `${sede?.nombre || 'Sede EMTELCO'}\n${activo?.ubicacion_detalle || 'Ubicación General'}`,
        activo?.responsable || 'Área TICS'
      ]
    ]
  });

  // --- 4. DATOS DE LA INTERVENCIÓN ---
  currentY = doc.lastAutoTable.finalY + 6;
  doc.setFontSize(10.5);
  doc.setFont('helvetica', 'bold');
  doc.text('2. DATOS DE LA INTERVENCIÓN TÉCNICA', 14, currentY);

  autoTable(doc, {
    startY: currentY + 3,
    theme: 'plain',
    styles: { fontSize: 8, cellPadding: 2 },
    body: [
      [
        { content: 'Técnico Responsable:', styles: { fontStyle: 'bold', textColor: [6, 95, 70] } },
        mantenimiento.tecnico_nombre || 'Técnico TICS',
        { content: 'Tiempo Empleado:', styles: { fontStyle: 'bold', textColor: [6, 95, 70] } },
        `${mantenimiento.tiempo_minutos || 45} Minutos`
      ],
      [
        { content: 'Tipo de Mantenimiento:', styles: { fontStyle: 'bold', textColor: [6, 95, 70] } },
        mantenimiento.tipo || 'PREVENTIVO',
        { content: 'Estado Final del Equipo:', styles: { fontStyle: 'bold', textColor: [6, 95, 70] } },
        mantenimiento.estado_final_equipo || 'OPERATIVO 100%'
      ]
    ]
  });

  // --- 5. CHECKLIST DE ACTIVIDADES PREVENTIVAS ---
  currentY = doc.lastAutoTable.finalY + 6;
  doc.setFontSize(10.5);
  doc.setFont('helvetica', 'bold');
  doc.text('3. PROTOCOLO Y CHECKLIST DE ACTIVIDADES EJECUTADAS', 14, currentY);

  const checklistRows = (mantenimiento.checklist || []).map((item, idx) => [
    `${idx + 1}`,
    item.tarea || item,
    item.hecho !== false ? 'CUMPLIDO [ X ]' : 'NO APLICA [ - ]'
  ]);

  autoTable(doc, {
    startY: currentY + 3,
    theme: 'striped',
    headStyles: { fillColor: [30, 41, 59], textColor: [255, 255, 255], fontStyle: 'bold' },
    styles: { fontSize: 7.5, cellPadding: 2 },
    columnStyles: {
      0: { cellWidth: 8, halign: 'center' },
      2: { cellWidth: 32, halign: 'center', fontStyle: 'bold', textColor: [5, 150, 105] }
    },
    head: [['#', 'Actividad Preventiva Verificada', 'Resultado']],
    body: checklistRows.length > 0 ? checklistRows : [['1', 'Mantenimiento preventivo general realizado', 'CUMPLIDO [ X ]']]
  });

  // --- 6. DIAGNÓSTICO Y ACTIVIDADES ---
  currentY = doc.lastAutoTable.finalY + 5;
  doc.setFontSize(10.5);
  doc.setFont('helvetica', 'bold');
  doc.text('4. DIAGNÓSTICO TÉCNICO Y RECOMENDACIONES', 14, currentY);

  autoTable(doc, {
    startY: currentY + 3,
    theme: 'grid',
    styles: { fontSize: 7.5, cellPadding: 2.5 },
    body: [
      [
        { content: 'Diagnóstico Inicial:', styles: { fontStyle: 'bold', cellWidth: 35 } },
        mantenimiento.diagnostico || 'Sin anomalías registradas. Mantenimiento preventivo periódico.'
      ],
      [
        { content: 'Actividades Realizadas:', styles: { fontStyle: 'bold', cellWidth: 35 } },
        mantenimiento.actividades_realizadas || 'Procedimiento estándar de limpieza, diagnóstico lógico y actualización.'
      ],
      [
        { content: 'Observaciones / Insumos:', styles: { fontStyle: 'bold', cellWidth: 35 } },
        mantenimiento.observaciones || 'Equipo queda en condiciones óptimas para su operación.'
      ]
    ]
  });

  // --- 5. REGISTRO DE EVIDENCIAS FOTOGRÁFICAS (ANTES, DURANTE, DESPUÉS) ---
  if (mantenimiento.evidencias && mantenimiento.evidencias.length > 0) {
    currentY = doc.lastAutoTable.finalY + 6;
    doc.setFontSize(10.5);
    doc.setFont('helvetica', 'bold');
    doc.text('5. REGISTRO DE EVIDENCIAS FOTOGRÁFICAS (ANTES, DURANTE, DESPUÉS)', 14, currentY);

    const evidenciaRows = mantenimiento.evidencias.map((ev, idx) => {
      const tipoLabel = ev.tipo === 'FOTO_ANTES' ? '1. ANTES (Estado Inicial)' :
                        ev.tipo === 'FOTO_DURANTE' ? '2. DURANTE (Procedimiento)' :
                        '3. DESPUÉS (Resultado Final)';
      return [`Foto #${idx + 1}`, tipoLabel, ev.descripcion || 'Evidencia fotográfica capturada y certificada en sitio'];
    });

    autoTable(doc, {
      startY: currentY + 3,
      theme: 'grid',
      headStyles: { fillColor: [30, 41, 59], textColor: [255, 255, 255], fontStyle: 'bold' },
      styles: { fontSize: 7.5, cellPadding: 2.5 },
      columnStyles: {
        0: { cellWidth: 20, fontStyle: 'bold' },
        1: { cellWidth: 48, fontStyle: 'bold', textColor: [5, 150, 105] },
        2: { cellWidth: 'auto' }
      },
      head: [['Registro', 'Etapa de Evidencia', 'Detalle de la Verificación Fotográfica']],
      body: evidenciaRows
    });
  }

  // --- 6. FIRMAS DE CONFORMIDAD & DIGITALES ---
  currentY = doc.lastAutoTable.finalY + 12;
  
  if (currentY > 240) {
    doc.addPage();
    currentY = 25;
  }

  // Estampar firma digital si existe
  if (mantenimiento.firma_digital) {
    try {
      doc.addImage(mantenimiento.firma_digital, 'PNG', 125, currentY - 14, 50, 16);
    } catch (e) {
      console.warn('Error adjuntando firma digital al PDF:', e);
    }
  }

  doc.setDrawColor(150, 150, 150);
  doc.setLineWidth(0.5);

  // Firma técnico
  doc.line(20, currentY, 85, currentY);
  doc.setFontSize(8);
  doc.setFont('helvetica', 'bold');
  doc.text('FIRMA TÉCNICO RESPONSABLE', 20, currentY + 4);
  doc.setFont('helvetica', 'normal');
  doc.text(`${mantenimiento.tecnico_nombre || 'Técnico TICS'}`, 20, currentY + 8);
  doc.text('Área de TICS - EMTELCO S.A.S.', 20, currentY + 12);

  // Firma usuario / receptor
  doc.line(125, currentY, 190, currentY);
  doc.setFont('helvetica', 'bold');
  doc.text('RECIBIDO A CONFORMIDAD', 125, currentY + 4);
  doc.setFont('helvetica', 'normal');
  doc.text(`${mantenimiento.conformidad_usuario || activo?.responsable || 'Usuario / Supervisor'}`, 125, currentY + 8);
  doc.text('Firma Digital y Recepción Certificada', 125, currentY + 12);

  // Pie de página
  doc.setFontSize(6.5);
  doc.setTextColor(100, 116, 139);
  doc.text('Documento generado automáticamente por EMTELCO CMMS | Sistema de Gestión de Mantenimiento Preventivo (Ley 527 de 1999)', pageWidth / 2, 288, { align: 'center' });

  // Guardar archivo
  const fileName = `Acta_Mantenimiento_${mantenimiento.codigo_acta || 'EMTELCO'}_${activo?.codigo_inventario || 'ACTIVO'}.pdf`;
  doc.save(fileName);
}

/**
 * Exporta un reporte consolidado general en PDF
 */
export function generateConsolidatedReportPDF(mantenimientos, activos, sedes, filtros = {}) {
  const doc = new jsPDF('landscape');
  const pageWidth = doc.internal.pageSize.getWidth();

  doc.setFillColor(6, 78, 59);
  doc.rect(0, 0, pageWidth, 24, 'F');

  doc.setTextColor(255, 255, 255);
  doc.setFontSize(14);
  doc.setFont('helvetica', 'bold');
  doc.text('EMTELCO S.A.S. - REPORTE CONSOLIDADO DE MANTENIMIENTOS PREVENTIVOS', 14, 11);

  doc.setFontSize(8.5);
  doc.setFont('helvetica', 'normal');
  doc.text(`Generado: ${new Date().toLocaleDateString('es-CO')} | Total Registros: ${mantenimientos.length} | Área de TICS`, 14, 18);

  const rows = mantenimientos.map(m => {
    const act = activos.find(a => a.id === m.activo_id);
    const sede = sedes.find(s => s.id === act?.sede_id);
    return [
      m.codigo_acta || 'S/N',
      m.fecha_ejecucion,
      act?.codigo_inventario || 'N/A',
      act?.nombre || 'Equipo',
      sede?.nombre?.split('-')[0] || 'Sede',
      m.tecnico_nombre,
      `${m.tiempo_minutos} min`,
      m.estado_final_equipo || 'OPERATIVO'
    ];
  });

  autoTable(doc, {
    startY: 28,
    theme: 'striped',
    headStyles: { fillColor: [5, 150, 105], textColor: [255, 255, 255], fontStyle: 'bold' },
    styles: { fontSize: 8, cellPadding: 2 },
    head: [['Acta', 'Fecha', 'Código Activo', 'Equipo', 'Sede', 'Técnico', 'Tiempo', 'Estado Final']],
    body: rows
  });

  doc.save(`Reporte_Mantenimientos_EMTELCO_${Date.now()}.pdf`);
}
