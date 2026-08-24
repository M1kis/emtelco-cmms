# EMTELCO CMMS - Plataforma de Gestión y Control de Mantenimiento Preventivo TICS

> **Proyecto de Grado:** *Desarrollo de un aplicativo web para el registro y control del mantenimiento preventivo realizado por el área de TICS de la empresa EMTELCO*  
> **Institución:** Corporación Unificada Nacional de Educación Superior (CUN)  
> **Autores:** Deiver Alejandro Pedrozo Alvarado (CC. 1085036927) & German Augusto Muñoz Melón (CC. 1098688271)  
> **Año:** 2026

---

## 🚀 Características Principales

1. **Dashboard & KPIs:** Tasa de disponibilidad operativa, cumplimiento de SLA, equipos por categoría y alertas de mantenimientos próximos o vencidos.
2. **Inventario de Activos Tecnológicos:** Hoja de vida 360°, ficha técnica (CPU, RAM, Disco, IP, SO), filtros por sede y categoría (Cómputo, Móviles, Redes/Racks, Servidores).
3. **Mantenimientos y Actas Certificadas:** Asistente de ejecución paso a paso, checklist dinámico por categoría, carga de evidencias fotográficas (Antes / Después) y descarga instantánea de **Actas en PDF**.
4. **Cronograma y Alertas:** Programación preventiva automática y visualización de semáforo de estados.
5. **Reportes y Auditoría:** Filtros por rango de fechas, sede, categoría y técnico, con exportación a PDF consolidado y Excel (CSV).
6. **Integración con Supabase:** Soporte para base de datos PostgreSQL en la nube y Storage de evidencias fotográficas, con modo demostración local sin configuración previa.

---

## 🛠️ Instrucciones de Ejecución

### 1. Iniciar en Modo Desarrollo Local
En la carpeta del proyecto `emtelco-cmms`:

```bash
npm run dev
```

Abre en tu navegador la URL que indica la consola (generalmente `http://localhost:5173`).

---

## 🗄️ Conexión con Supabase (Opcional - 3 minutos)

El sistema funciona de inmediato con datos de prueba precargados. Si deseas conectarlo a tu base de datos Supabase en la nube:

1. Ingresa a [supabase.com](https://supabase.com) y crea un nuevo proyecto.
2. Ve a la pestaña **SQL Editor** en el panel de Supabase.
3. Copia y pega el contenido del archivo [`supabase/schema.sql`](./supabase/schema.sql) y dale clic a **RUN**.
4. Ve a **Project Settings &rarr; API** y copia la **Project URL** y la **anon public key**.
5. Abre el archivo `.env` en la raíz del proyecto y agrégalas:
   ```env
   VITE_SUPABASE_URL=https://tu-proyecto.supabase.co
   VITE_SUPABASE_ANON_KEY=tu-anon-key
   ```
6. Reinicia `npm run dev`. ¡Listo! El indicador en el Header mostrará **Supabase Conectado**.
