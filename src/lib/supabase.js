import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

export const isSupabaseConfigured = () => {
  return Boolean(
    supabaseUrl && 
    supabaseAnonKey && 
    supabaseUrl !== 'https://tu-proyecto.supabase.co' && 
    supabaseUrl.startsWith('https://')
  );
};

export const supabase = isSupabaseConfigured()
  ? createClient(supabaseUrl, supabaseAnonKey)
  : null;

/**
 * Sube una imagen de evidencia al bucket de Supabase Storage.
 * Si Supabase no está configurado, convierte a Data URL / Base64 para almacenamiento local.
 */
export async function uploadEvidenceImage(file, folder = 'evidencias') {
  if (!file) return null;

  if (isSupabaseConfigured() && supabase) {
    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `${folder}/${Date.now()}_${Math.random().toString(36).substring(2, 9)}.${fileExt}`;

      const { data, error } = await supabase.storage
        .from('evidencias-mantenimiento')
        .upload(fileName, file, {
          cacheControl: '3600',
          upsert: false
        });

      if (error) {
        console.warn('Error subiendo imagen a Supabase Storage:', error.message);
        // Fallback a Base64
        return await convertFileToBase64(file);
      }

      // Obtener URL pública
      const { data: { publicUrl } } = supabase.storage
        .from('evidencias-mantenimiento')
        .getPublicUrl(fileName);

      return publicUrl;
    } catch (err) {
      console.warn('Fallback a Base64 por error en Storage:', err);
      return await convertFileToBase64(file);
    }
  }

  // Fallback local a Base64
  return await convertFileToBase64(file);
}

function convertFileToBase64(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = error => reject(error);
  });
}
