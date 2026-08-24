import React, { createContext, useContext, useState, useEffect, useMemo } from 'react';
import { supabase, isSupabaseConfigured, uploadEvidenceImage } from '../lib/supabase';
import { 
  INITIAL_SEDES, 
  INITIAL_CATEGORIES, 
  INITIAL_ACTIVOS, 
  INITIAL_PROGRAMACIONES, 
  INITIAL_MANTENIMIENTOS 
} from '../lib/mockData';

const DataContext = createContext();

// Generador de UUID compatible con PostgreSQL
const generateUUID = () => {
  if (typeof crypto !== 'undefined' && crypto.randomUUID) {
    return crypto.randomUUID();
  }
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0;
    const v = c === 'x' ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
};

export const DataProvider = ({ children }) => {
  const isSupabaseActive = isSupabaseConfigured();

  // Estados locales con persistencia o fallback
  const [sedes, setSedes] = useState(() => {
    const s = localStorage.getItem('emtelco_cmms_sedes');
    return s ? JSON.parse(s) : INITIAL_SEDES;
  });

  const [categorias, setCategorias] = useState(() => {
    const c = localStorage.getItem('emtelco_cmms_categorias');
    return c ? JSON.parse(c) : INITIAL_CATEGORIES;
  });

  const [activos, setActivos] = useState(() => {
    const a = localStorage.getItem('emtelco_cmms_activos');
    return a ? JSON.parse(a) : INITIAL_ACTIVOS;
  });

  const [programaciones, setProgramaciones] = useState(() => {
    const p = localStorage.getItem('emtelco_cmms_programaciones');
    return p ? JSON.parse(p) : INITIAL_PROGRAMACIONES;
  });

  const [mantenimientos, setMantenimientos] = useState(() => {
    const m = localStorage.getItem('emtelco_cmms_mantenimientos');
    return m ? JSON.parse(m) : INITIAL_MANTENIMIENTOS;
  });

  const [loading, setLoading] = useState(false);
  const [notification, setNotification] = useState(null);

  const showToast = (message, type = 'success') => {
    setNotification({ message, type, id: Date.now() });
    setTimeout(() => setNotification(null), 4000);
  };

  // Guardar en localStorage cuando cambien los datos locales
  useEffect(() => {
    if (!isSupabaseActive) {
      localStorage.setItem('emtelco_cmms_sedes', JSON.stringify(sedes));
      localStorage.setItem('emtelco_cmms_categorias', JSON.stringify(categorias));
      localStorage.setItem('emtelco_cmms_activos', JSON.stringify(activos));
      localStorage.setItem('emtelco_cmms_programaciones', JSON.stringify(programaciones));
      localStorage.setItem('emtelco_cmms_mantenimientos', JSON.stringify(mantenimientos));
    }
  }, [sedes, categorias, activos, programaciones, mantenimientos, isSupabaseActive]);

  // Carga inicial desde Supabase si está activo
  useEffect(() => {
    if (!isSupabaseActive) return;

    const fetchSupabaseData = async () => {
      setLoading(true);
      try {
        const [
          { data: sData },
          { data: cData },
          { data: aData },
          { data: pData },
          { data: mData }
        ] = await Promise.all([
          supabase.from('sedes').select('*'),
          supabase.from('categorias_activos').select('*'),
          supabase.from('activos').select('*'),
          supabase.from('programaciones').select('*'),
          supabase.from('mantenimientos').select('*, evidencias_mantenimiento(*)')
        ]);

        if (sData && sData.length > 0) setSedes(sData);
        if (cData && cData.length > 0) setCategorias(cData);
        if (aData && aData.length > 0) setActivos(aData);
        if (pData && pData.length > 0) setProgramaciones(pData);
        if (mData && mData.length > 0) {
          const formattedM = mData.map(m => ({
            ...m,
            evidencias: m.evidencias_mantenimiento || []
          }));
          setMantenimientos(formattedM);
        }
      } catch (error) {
        console.warn('Error sincronizando con Supabase, usando estado local:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchSupabaseData();
  }, [isSupabaseActive]);

  // ================= ACTIVOS CRUD =================
  const addActivo = async (activoData) => {
    const newId = generateUUID();
    const nextDate = new Date();
    nextDate.setMonth(nextDate.getMonth() + (Number(activoData.frecuencia_mantenimiento_meses) || 3));

    const nuevoActivo = {
      id: newId,
      ...activoData,
      estado: activoData.estado || 'OPERATIVO',
      fecha_ingreso: activoData.fecha_ingreso || new Date().toISOString().split('T')[0],
      ultimo_mantenimiento: null,
      proximo_mantenimiento: nextDate.toISOString().split('T')[0],
      created_at: new Date().toISOString()
    };

    if (isSupabaseActive && supabase) {
      try {
        const { data, error } = await supabase
          .from('activos')
          .insert([nuevoActivo])
          .select()
          .single();
        if (error) throw error;
        setActivos(prev => [data, ...prev]);
      } catch (err) {
        console.error('Error insertando en Supabase:', err);
        setActivos(prev => [nuevoActivo, ...prev]);
      }
    } else {
      setActivos(prev => [nuevoActivo, ...prev]);
    }

    // Auto-programar primer mantenimiento
    addProgramacion({
      activo_id: nuevoActivo.id,
      fecha_programada: nuevoActivo.proximo_mantenimiento,
      prioridad: 'MEDIA',
      tipo_mantenimiento: 'PREVENTIVO',
      notas: 'Primer mantenimiento preventivo programado automáticamente tras registro.'
    });

    showToast('Activo tecnológico registrado correctamente');
    return nuevoActivo;
  };

  const updateActivo = async (id, updatedFields) => {
    if (isSupabaseActive && supabase) {
      try {
        await supabase.from('activos').update(updatedFields).eq('id', id);
      } catch (err) {
        console.error('Error actualizando en Supabase:', err);
      }
    }
    setActivos(prev => prev.map(a => a.id === id ? { ...a, ...updatedFields } : a));
    showToast('Activo actualizado con éxito');
  };

  const deleteActivo = async (id) => {
    if (isSupabaseActive && supabase) {
      try {
        await supabase.from('activos').delete().eq('id', id);
      } catch (err) {
        console.error('Error eliminando de Supabase:', err);
      }
    }
    setActivos(prev => prev.filter(a => a.id !== id));
    setProgramaciones(prev => prev.filter(p => p.activo_id !== id));
    showToast('Activo eliminado del inventario', 'info');
  };

  // ================= PROGRAMACIÓN DE MANTENIMIENTO =================
  const addProgramacion = async (progData) => {
    const newId = generateUUID();
    const nuevaProg = {
      id: newId,
      ...progData,
      estado: progData.estado || 'PROGRAMADO',
      created_at: new Date().toISOString()
    };

    if (isSupabaseActive && supabase) {
      try {
        const { data, error } = await supabase.from('programaciones').insert([nuevaProg]).select().single();
        if (!error && data) {
          setProgramaciones(prev => [data, ...prev]);
          showToast('Mantenimiento programado en el cronograma');
          return data;
        }
      } catch (err) {
        console.error(err);
      }
    }

    setProgramaciones(prev => [nuevaProg, ...prev]);
    showToast('Mantenimiento programado en el cronograma');
    return nuevaProg;
  };

  const updateProgramacionEstado = async (id, nuevoEstado) => {
    if (isSupabaseActive && supabase) {
      try {
        await supabase.from('programaciones').update({ estado: nuevoEstado }).eq('id', id);
      } catch (err) {
        console.error(err);
      }
    }
    setProgramaciones(prev => prev.map(p => p.id === id ? { ...p, estado: nuevoEstado } : p));
  };

  // ================= EJECUCIÓN DE MANTENIMIENTO =================
  const executeMantenimiento = async (mantData, fotosEvidencias = []) => {
    const newId = generateUUID();
    const nextCodeNumber = String(mantenimientos.length + 101).padStart(4, '0');
    const codigo_acta = `ACT-2026-${nextCodeNumber}`;

    // Subir fotos o convertir a URL
    const evidenciasSubidas = [];
    for (const foto of fotosEvidencias) {
      if (foto.file) {
        const url = await uploadEvidenceImage(foto.file);
        if (url) {
          evidenciasSubidas.push({
            id: generateUUID(),
            tipo: foto.tipo || 'FOTO_DESPUES',
            url_archivo: url,
            descripcion: foto.descripcion || 'Evidencia fotográfica en sitio'
          });
        }
      } else if (foto.url_archivo) {
        evidenciasSubidas.push(foto);
      }
    }

    const nuevoMantenimiento = {
      id: newId,
      codigo_acta,
      ...mantData,
      evidencias: evidenciasSubidas,
      created_at: new Date().toISOString()
    };

    // Actualizar activo correspondiente
    const activoRelacionado = activos.find(a => a.id === mantData.activo_id);
    const frecuencia = activoRelacionado?.frecuencia_mantenimiento_meses || 3;
    
    const fechaEjecucion = new Date(mantData.fecha_ejecucion || Date.now());
    const nextDate = new Date(fechaEjecucion);
    nextDate.setMonth(nextDate.getMonth() + frecuencia);

    const activoUpdate = {
      ultimo_mantenimiento: mantData.fecha_ejecucion,
      proximo_mantenimiento: nextDate.toISOString().split('T')[0],
      estado: mantData.estado_final_equipo || 'OPERATIVO'
    };

    updateActivo(mantData.activo_id, activoUpdate);

    // Si había una programación vinculada, marcarla como completada
    if (mantData.programacion_id) {
      updateProgramacionEstado(mantData.programacion_id, 'COMPLETADO');
    }

    // Programar la próxima fecha automáticamente
    addProgramacion({
      activo_id: mantData.activo_id,
      fecha_programada: nextDate.toISOString().split('T')[0],
      prioridad: 'MEDIA',
      tipo_mantenimiento: 'PREVENTIVO',
      notas: `Mantenimiento preventivo recurrente tras ejecución de acta ${codigo_acta}`
    });

    if (isSupabaseActive && supabase) {
      try {
        const { error } = await supabase.from('mantenimientos').insert([{
          id: nuevoMantenimiento.id,
          codigo_acta: nuevoMantenimiento.codigo_acta,
          programacion_id: nuevoMantenimiento.programacion_id,
          activo_id: nuevoMantenimiento.activo_id,
          tecnico_id: nuevoMantenimiento.tecnico_id,
          tecnico_nombre: nuevoMantenimiento.tecnico_nombre,
          fecha_ejecucion: nuevoMantenimiento.fecha_ejecucion,
          tiempo_minutos: nuevoMantenimiento.tiempo_minutos,
          tipo: nuevoMantenimiento.tipo,
          checklist: nuevoMantenimiento.checklist,
          diagnostico: nuevoMantenimiento.diagnostico,
          actividades_realizadas: nuevoMantenimiento.actividades_realizadas,
          observaciones: nuevoMantenimiento.observaciones,
          estado_final_equipo: nuevoMantenimiento.estado_final_equipo,
          conformidad_usuario: nuevoMantenimiento.conformidad_usuario,
          firma_digital: nuevoMantenimiento.firma_digital
        }]);

        if (!error && evidenciasSubidas.length > 0) {
          const evidenciasParaDb = evidenciasSubidas.map(ev => ({
            mantenimiento_id: nuevoMantenimiento.id,
            tipo: ev.tipo,
            url_archivo: ev.url_archivo,
            descripcion: ev.descripcion
          }));
          await supabase.from('evidencias_mantenimiento').insert(evidenciasParaDb);
        }
      } catch (err) {
        console.error('Error guardando mantenimiento en Supabase:', err);
      }
    }

    setMantenimientos(prev => [nuevoMantenimiento, ...prev]);
    showToast(`Mantenimiento ${codigo_acta} registrado y certificado exitosamente`);
    return nuevoMantenimiento;
  };

  // ================= SEDES CRUD =================
  const addSede = (sedeData) => {
    const newSede = {
      id: generateUUID(),
      ...sedeData,
      created_at: new Date().toISOString()
    };
    setSedes(prev => [...prev, newSede]);
    showToast('Sede agregada');
  };

  // ================= MÉTRICAS Y KPIS CALCULADOS =================
  const kpis = useMemo(() => {
    const totalActivos = activos.length;
    const activosOperativos = activos.filter(a => a.estado === 'OPERATIVO').length;
    const activosMantenimiento = activos.filter(a => a.estado === 'EN_MANTENIMIENTO').length;
    const totalMantenimientos = mantenimientos.length;

    const hoy = new Date().toISOString().split('T')[0];
    const enSieteDias = new Date();
    enSieteDias.setDate(enSieteDias.getDate() + 7);
    const limiteSieteDias = enSieteDias.toISOString().split('T')[0];

    const programados = programaciones.filter(p => p.estado === 'PROGRAMADO');
    const atrasados = programaciones.filter(p => p.estado === 'ATRASADO' || (p.estado === 'PROGRAMADO' && p.fecha_programada < hoy));
    const proximos = programaciones.filter(p => p.estado === 'PROGRAMADO' && p.fecha_programada >= hoy && p.fecha_programada <= limiteSieteDias);

    const completados = programaciones.filter(p => p.estado === 'COMPLETADO').length + mantenimientos.length;
    const baseTotal = programaciones.length + mantenimientos.length;
    const tasaCumplimiento = baseTotal > 0 ? Math.min(100, Math.round((completados / baseTotal) * 100)) : 100;

    const tiempoPromedio = mantenimientos.length > 0 
      ? Math.round(mantenimientos.reduce((acc, m) => acc + (Number(m.tiempo_minutos) || 45), 0) / mantenimientos.length) 
      : 45;

    return {
      totalActivos,
      activosOperativos,
      activosMantenimiento,
      totalMantenimientos,
      pendientesCount: programados.length,
      atrasadosCount: atrasados.length,
      proximosCount: proximos.length,
      tasaCumplimiento,
      tiempoPromedio
    };
  }, [activos, programaciones, mantenimientos]);

  return (
    <DataContext.Provider value={{
      sedes,
      categorias,
      activos,
      programaciones,
      mantenimientos,
      kpis,
      loading,
      notification,
      isSupabaseActive,
      addActivo,
      updateActivo,
      deleteActivo,
      addProgramacion,
      updateProgramacionEstado,
      executeMantenimiento,
      addSede,
      showToast
    }}>
      {children}
    </DataContext.Provider>
  );
};

export const useData = () => useContext(DataContext);
