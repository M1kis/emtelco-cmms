-- ================================================================
-- EMTELCO CMMS - ESQUEMA DE BASE DE DATOS PARA SUPABASE (POSTGRESQL)
-- Proyecto de Grado: Registro y Control de Mantenimiento Preventivo TICS
-- CUN 2026 - Deiver Pedrozo Alvarado & German Augusto Muñoz Melón
-- ================================================================

-- 1. EXTENSIONES
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 2. TABLA DE SEDES
CREATE TABLE IF NOT EXISTS public.sedes (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    nombre VARCHAR(150) NOT NULL,
    ciudad VARCHAR(100) NOT NULL,
    direccion TEXT,
    contacto VARCHAR(100),
    telefono VARCHAR(50),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 3. TABLA DE CATEGORÍAS DE ACTIVOS
CREATE TABLE IF NOT EXISTS public.categorias_activos (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    nombre VARCHAR(100) NOT NULL UNIQUE,
    codigo VARCHAR(20) NOT NULL UNIQUE,
    descripcion TEXT,
    icono VARCHAR(50) DEFAULT 'Monitor',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 4. TABLA DE USUARIOS / TÉCNICOS (2 PERFILES: ADMIN Y TÉCNICO)
CREATE TABLE IF NOT EXISTS public.usuarios_app (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    auth_user_id UUID,
    nombre VARCHAR(150) NOT NULL,
    email VARCHAR(150) NOT NULL UNIQUE,
    rol VARCHAR(50) NOT NULL DEFAULT 'TECNICO', -- 'ADMIN', 'TECNICO'
    cargo VARCHAR(100) DEFAULT 'Soporte Técnico',
    sede_id UUID REFERENCES public.sedes(id) ON DELETE SET NULL,
    telefono VARCHAR(50),
    activo BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 5. TABLA DE ACTIVOS TECNOLÓGICOS (EQUIPOS)
CREATE TABLE IF NOT EXISTS public.activos (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    codigo_inventario VARCHAR(50) NOT NULL UNIQUE, -- Ej: EMT-CMP-1042
    serial VARCHAR(100) NOT NULL UNIQUE,
    nombre VARCHAR(150) NOT NULL,
    categoria_id UUID NOT NULL REFERENCES public.categorias_activos(id) ON DELETE RESTRICT,
    marca VARCHAR(100) NOT NULL,
    modelo VARCHAR(100) NOT NULL,
    especificaciones JSONB DEFAULT '{}'::jsonb, -- CPU, RAM, Disco, SO, IP, MAC
    sede_id UUID NOT NULL REFERENCES public.sedes(id) ON DELETE RESTRICT,
    ubicacion_detalle VARCHAR(150),
    responsable VARCHAR(150),
    estado VARCHAR(50) NOT NULL DEFAULT 'OPERATIVO', -- 'OPERATIVO', 'EN_MANTENIMIENTO', 'EN_REVISION', 'DE_BAJA'
    frecuencia_mantenimiento_meses INT DEFAULT 3,
    fecha_ingreso DATE DEFAULT CURRENT_DATE,
    ultimo_mantenimiento DATE,
    proximo_mantenimiento DATE,
    observaciones TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 6. TABLA DE PROGRAMACIÓN DE MANTENIMIENTOS (CRONOGRAMA)
CREATE TABLE IF NOT EXISTS public.programaciones (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    activo_id UUID NOT NULL REFERENCES public.activos(id) ON DELETE CASCADE,
    tecnico_asignado_id UUID REFERENCES public.usuarios_app(id) ON DELETE SET NULL,
    fecha_programada DATE NOT NULL,
    estado VARCHAR(50) NOT NULL DEFAULT 'PROGRAMADO', -- 'PROGRAMADO', 'EN_PROCESO', 'COMPLETADO', 'ATRASADO', 'CANCELADO'
    prioridad VARCHAR(20) DEFAULT 'MEDIA', -- 'ALTA', 'MEDIA', 'BAJA'
    tipo_mantenimiento VARCHAR(50) DEFAULT 'PREVENTIVO', -- 'PREVENTIVO', 'RUTINARIO', 'CORRECTIVO_PROGRAMADO'
    notas TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 7. TABLA DE MANTENIMIENTOS EJECUTADOS (ÓRDENES DE TRABAJO / ACTAS)
CREATE TABLE IF NOT EXISTS public.mantenimientos (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    codigo_acta VARCHAR(50) NOT NULL UNIQUE, -- Ej: ACT-2026-0101
    programacion_id UUID REFERENCES public.programaciones(id) ON DELETE SET NULL,
    activo_id UUID NOT NULL REFERENCES public.activos(id) ON DELETE CASCADE,
    tecnico_id UUID REFERENCES public.usuarios_app(id) ON DELETE SET NULL,
    tecnico_nombre VARCHAR(150) NOT NULL,
    fecha_ejecucion DATE NOT NULL DEFAULT CURRENT_DATE,
    tiempo_minutos INT DEFAULT 45,
    tipo VARCHAR(50) DEFAULT 'PREVENTIVO',
    checklist JSONB NOT NULL DEFAULT '[]'::jsonb,
    diagnostico TEXT NOT NULL,
    actividades_realizadas TEXT NOT NULL,
    observaciones TEXT,
    estado_final_equipo VARCHAR(50) DEFAULT 'OPERATIVO',
    conformidad_usuario VARCHAR(150),
    firma_digital TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 8. TABLA DE EVIDENCIAS FOTOGRÁFICAS Y ARCHIVOS
CREATE TABLE IF NOT EXISTS public.evidencias_mantenimiento (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    mantenimiento_id UUID NOT NULL REFERENCES public.mantenimientos(id) ON DELETE CASCADE,
    tipo VARCHAR(50) NOT NULL, -- 'FOTO_ANTES', 'FOTO_DESPUES', 'ACTA_FIRMADA'
    url_archivo TEXT NOT NULL,
    descripcion TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 9. CONFIGURACIÓN DE POLÍTICAS DE SEGURIDAD (RLS)
ALTER TABLE public.sedes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.categorias_activos ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.usuarios_app ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.activos ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.programaciones ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.mantenimientos ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.evidencias_mantenimiento ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Permitir lectura general sedes" ON public.sedes;
DROP POLICY IF EXISTS "Permitir mutacion sedes" ON public.sedes;
CREATE POLICY "Permitir lectura general sedes" ON public.sedes FOR SELECT USING (true);
CREATE POLICY "Permitir mutacion sedes" ON public.sedes FOR ALL USING (true);

DROP POLICY IF EXISTS "Permitir lectura general categorias" ON public.categorias_activos;
DROP POLICY IF EXISTS "Permitir mutacion categorias" ON public.categorias_activos;
CREATE POLICY "Permitir lectura general categorias" ON public.categorias_activos FOR SELECT USING (true);
CREATE POLICY "Permitir mutacion categorias" ON public.categorias_activos FOR ALL USING (true);

DROP POLICY IF EXISTS "Permitir lectura general usuarios" ON public.usuarios_app;
DROP POLICY IF EXISTS "Permitir mutacion usuarios" ON public.usuarios_app;
CREATE POLICY "Permitir lectura general usuarios" ON public.usuarios_app FOR SELECT USING (true);
CREATE POLICY "Permitir mutacion usuarios" ON public.usuarios_app FOR ALL USING (true);

DROP POLICY IF EXISTS "Permitir lectura general activos" ON public.activos;
DROP POLICY IF EXISTS "Permitir mutacion activos" ON public.activos;
CREATE POLICY "Permitir lectura general activos" ON public.activos FOR SELECT USING (true);
CREATE POLICY "Permitir mutacion activos" ON public.activos FOR ALL USING (true);

DROP POLICY IF EXISTS "Permitir lectura general programaciones" ON public.programaciones;
DROP POLICY IF EXISTS "Permitir mutacion programaciones" ON public.programaciones;
CREATE POLICY "Permitir lectura general programaciones" ON public.programaciones FOR SELECT USING (true);
CREATE POLICY "Permitir mutacion programaciones" ON public.programaciones FOR ALL USING (true);

DROP POLICY IF EXISTS "Permitir lectura general mantenimientos" ON public.mantenimientos;
DROP POLICY IF EXISTS "Permitir mutacion mantenimientos" ON public.mantenimientos;
CREATE POLICY "Permitir lectura general mantenimientos" ON public.mantenimientos FOR SELECT USING (true);
CREATE POLICY "Permitir mutacion mantenimientos" ON public.mantenimientos FOR ALL USING (true);

DROP POLICY IF EXISTS "Permitir lectura general evidencias" ON public.evidencias_mantenimiento;
DROP POLICY IF EXISTS "Permitir mutacion evidencias" ON public.evidencias_mantenimiento;
CREATE POLICY "Permitir lectura general evidencias" ON public.evidencias_mantenimiento FOR SELECT USING (true);
CREATE POLICY "Permitir mutacion evidencias" ON public.evidencias_mantenimiento FOR ALL USING (true);

-- 10. BUCKET DE STORAGE PARA FOTOS DE EVIDENCIAS
INSERT INTO storage.buckets (id, name, public)
VALUES ('evidencias-mantenimiento', 'evidencias-mantenimiento', true)
ON CONFLICT (id) DO UPDATE SET public = true;

DROP POLICY IF EXISTS "Permitir subida publica fotos evidencias" ON storage.objects;
DROP POLICY IF EXISTS "Permitir lectura publica fotos evidencias" ON storage.objects;

CREATE POLICY "Permitir subida publica fotos evidencias"
ON storage.objects FOR INSERT
WITH CHECK (bucket_id = 'evidencias-mantenimiento');

CREATE POLICY "Permitir lectura publica fotos evidencias"
ON storage.objects FOR SELECT
USING (bucket_id = 'evidencias-mantenimiento');

-- 11. DATOS SEMILLA (SEED DATA)
INSERT INTO public.sedes (id, nombre, ciudad, direccion, contacto, telefono) VALUES
('a1111111-1111-4111-8111-111111111111', 'Sede Principal - Colombia Calle 50', 'Medellín', 'Calle 50 # 51-20 Centro', 'Coordinación TICS Medellín', '+57 604 4440000'),
('a2222222-2222-4222-8222-222222222222', 'Sede Operaciones - Envigado', 'Envigado', 'Carrera 48 # 26 Sur 18', 'Soporte Técnico Envigado', '+57 604 4440001'),
('a3333333-3333-4333-8333-333333333333', 'Sede Corporativa - Bogotá Calle 100', 'Bogotá D.C.', 'Calle 100 # 19-61', 'Líder TI Bogotá', '+57 601 7440000'),
('a4444444-4444-4444-8444-444444444444', 'Sede Norte - Barranquilla', 'Barranquilla', 'Cra 53 # 82-86', 'Soporte Técnico Costa', '+57 605 3850000')
ON CONFLICT (id) DO NOTHING;

INSERT INTO public.categorias_activos (id, nombre, codigo, descripcion, icono) VALUES
('c1111111-1111-4111-8111-111111111111', 'Equipos de Cómputo', 'COMPUTO', 'Laptops, PCs de escritorio, All-in-One y estaciones de trabajo', 'Laptop'),
('c2222222-2222-4222-8222-222222222222', 'Dispositivos Móviles', 'MOVILES', 'Smartphones corporativos, tablets para técnicos y lectores', 'Smartphone'),
('c3333333-3333-4333-8333-333333333333', 'Redes y Telecomunicaciones', 'REDES', 'Racks de comunicaciones, switches, routers, firewalls y APs', 'Network'),
('c4444444-4444-4444-8444-444444444444', 'Servidores y Data Center', 'SERVIDORES', 'Servidores rackeables, NAS, UPS y unidades de almacenamiento', 'Server')
ON CONFLICT (id) DO NOTHING;

-- 2 PERFILES OFICIALES: ADMIN Y MIGUEL RUEDA (SOPORTE TÉCNICO)
INSERT INTO public.usuarios_app (id, nombre, email, rol, cargo, sede_id, telefono) VALUES
('11111111-1111-4111-8111-111111111111', 'Administrador TICS', 'admin.tics@emtelco.com.co', 'ADMIN', 'Líder / Administrador TICS', 'a1111111-1111-4111-8111-111111111111', '+57 300 123 4567'),
('22222222-2222-4222-8222-222222222222', 'Miguel Rueda', 'miguel.rueda@emtelco.com.co', 'TECNICO', 'Soporte Técnico', 'a1111111-1111-4111-8111-111111111111', '+57 312 888 9900')
ON CONFLICT (id) DO NOTHING;

INSERT INTO public.activos (id, codigo_inventario, serial, nombre, categoria_id, marca, modelo, especificaciones, sede_id, ubicacion_detalle, responsable, estado, frecuencia_mantenimiento_meses, fecha_ingreso, ultimo_mantenimiento, proximo_mantenimiento) VALUES
('d1111111-1111-4111-8111-111111111111', 'EMT-CMP-1042', 'NXK6EAA001', 'Laptop Dell Latitude 5420 - Operación', 'c1111111-1111-4111-8111-111111111111', 'Dell', 'Latitude 5420', '{"cpu": "Intel Core i7-1185G7", "ram": "16GB DDR4", "disco": "512GB NVMe SSD", "so": "Windows 11 Pro 64-bit", "ip": "192.168.10.45"}'::jsonb, 'a1111111-1111-4111-8111-111111111111', 'Piso 3 - Operaciones BPO Isla 2', 'Laura Restrepo - Asesora de Servicio', 'OPERATIVO', 3, '2025-01-15', '2026-05-10', '2026-08-10'),
('d2222222-2222-4222-8222-222222222222', 'EMT-CMP-1088', '8CG0123XYZ', 'PC HP ProDesk 400 G7 - Supervisión', 'c1111111-1111-4111-8111-111111111111', 'HP', 'ProDesk 400 G7', '{"cpu": "Intel Core i5-10500", "ram": "16GB DDR4", "disco": "256GB SSD + 1TB HDD", "so": "Windows 11 Pro", "ip": "192.168.10.88"}'::jsonb, 'a1111111-1111-4111-8111-111111111111', 'Piso 2 - Sala de Monitoreo', 'Supervisor de Campaña', 'OPERATIVO', 3, '2024-11-20', '2026-06-01', '2026-09-01'),
('d3333333-3333-4333-8333-333333333333', 'EMT-MOV-0315', 'R58M90ABCDE', 'Samsung Galaxy A54 5G - Soporte Terreno', 'c2222222-2222-4222-8222-222222222222', 'Samsung', 'Galaxy A54 5G', '{"ram": "8GB", "almacenamiento": "256GB", "so": "Android 14 / One UI 6", "imei": "358941205847120"}'::jsonb, 'a2222222-2222-4222-8222-222222222222', 'Móvil Asignado a Técnico en Sitio', 'Miguel Rueda - Soporte Técnico', 'OPERATIVO', 6, '2025-03-10', '2026-03-15', '2026-09-15'),
('d4444444-4444-4444-8444-444444444444', 'EMT-RED-0012', 'FCW2219B0GH', 'Switch Core Cisco Catalyst 2960X-48FPS', 'c3333333-3333-4333-8333-333333333333', 'Cisco', 'Catalyst 2960X-48FPS-L', '{"puertos": "48 puertos Gigabit PoE+ + 4 SFP", "so": "Cisco IOS 15.2", "ip_gestion": "10.0.0.12", "vlan": "VLAN 10, 20, 30"}'::jsonb, 'a1111111-1111-4111-8111-111111111111', 'Data Center Piso 1 - Rack 02 Unidad 18', 'Área de Redes y Telecomunicaciones', 'OPERATIVO', 2, '2024-05-10', '2026-06-20', '2026-08-20'),
('d5555555-5555-4555-8555-555555555555', 'EMT-RED-0044', 'RACK-BOG-P2', 'Rack de Telecomunicaciones Piso 2 Bogotá', 'c3333333-3333-4333-8333-333333333333', 'Panduit', 'Gabinete 42U 800x1000mm', '{"capacidad": "42U", "pdu": "2x PDU APC con monitoreo IP", "organizadores": "Verticales y horizontales alta densidad"}'::jsonb, 'a3333333-3333-4333-8333-333333333333', 'Piso 2 - Cuarto Técnico MDF Bogotá', 'Miguel Rueda - Soporte Técnico', 'EN_MANTENIMIENTO', 3, '2024-08-14', '2026-04-10', '2026-07-10'),
('d6666666-6666-4666-8666-666666666666', 'EMT-SRV-0003', '7KJ8MN2', 'Servidor Dell PowerEdge R740 - Telefonía IP', 'c4444444-4444-4444-8444-444444444444', 'Dell', 'PowerEdge R740', '{"cpu": "2x Intel Xeon Gold 6248R", "ram": "128GB ECC DDR4", "almacenamiento": "4x 1.92TB SSD SAS RAID 10", "so": "VMware ESXi 7.0 / Asterisk PBX"}'::jsonb, 'a1111111-1111-4111-8111-111111111111', 'Data Center Principal - Rack 01 U12', 'Administración Sistemas TI', 'OPERATIVO', 2, '2024-02-01', '2026-07-01', '2026-09-01')
ON CONFLICT (id) DO NOTHING;

INSERT INTO public.mantenimientos (id, codigo_acta, activo_id, tecnico_nombre, fecha_ejecucion, tiempo_minutos, tipo, checklist, diagnostico, actividades_realizadas, observaciones, estado_final_equipo, conformidad_usuario) VALUES
('e1111111-1111-4111-8111-111111111111', 'ACT-2026-0101', 'd1111111-1111-4111-8111-111111111111', 'Miguel Rueda', '2026-05-10', 45, 'PREVENTIVO', 
'[{"tarea": "Limpieza física externa e interna con aire comprimido", "hecho": true}, {"tarea": "Actualización de parches de seguridad y antivirus corporativo", "hecho": true}, {"tarea": "Diagnóstico de salud del disco SSD (SMART 100% Ok)", "hecho": true}, {"tarea": "Verificación de pasta térmica y temperatura del procesador", "hecho": true}, {"tarea": "Prueba de conectividad de red y VPN de contact center", "hecho": true}]'::jsonb,
'Equipo en óptimas condiciones de hardware. Se detectó acumulación moderada de polvo en rejillas de ventilación y 3 actualizaciones de Windows pendientes.',
'Se realizó desensamble preventivo, soplado de disipador térmico, limpieza de teclado y pantalla con líquido dieléctrico. Se instalaron actualizaciones acumulativas y se optimizó inicio del sistema.',
'Equipo entregado al asesor 100% operativo.', 'OPERATIVO', 'Laura Restrepo - Asesora BPO')
ON CONFLICT (id) DO NOTHING;
