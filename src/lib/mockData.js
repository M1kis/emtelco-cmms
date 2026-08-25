// Datos iniciales de demostración contextualizados en EMTELCO S.A.S. (Colombia)
// Con identificadores UUID hexadecimales compatibles con PostgreSQL

export const INITIAL_SEDES = [
  {
    id: 'a1111111-1111-4111-8111-111111111111',
    nombre: 'Sede Principal - Colombia Calle 50',
    ciudad: 'Medellín',
    direccion: 'Calle 50 # 51-20 Centro',
    contacto: 'Coordinación TICS Medellín',
    telefono: '+57 (604) 444-0000',
    total_equipos: 145
  },
  {
    id: 'a2222222-2222-4222-8222-222222222222',
    nombre: 'Sede Operaciones - Envigado',
    ciudad: 'Envigado',
    direccion: 'Carrera 48 # 26 Sur 18',
    contacto: 'Soporte Técnico Envigado',
    telefono: '+57 (604) 444-0001',
    total_equipos: 98
  },
  {
    id: 'a3333333-3333-4333-8333-333333333333',
    nombre: 'Sede Corporativa - Bogotá Calle 100',
    ciudad: 'Bogotá D.C.',
    direccion: 'Calle 100 # 19-61',
    contacto: 'Líder TI Bogotá',
    telefono: '+57 (601) 744-0000',
    total_equipos: 120
  },
  {
    id: 'a4444444-4444-4444-8444-444444444444',
    nombre: 'Sede Norte - Barranquilla',
    ciudad: 'Barranquilla',
    direccion: 'Cra 53 # 82-86',
    contacto: 'Soporte Técnico Costa',
    telefono: '+57 (605) 385-0000',
    total_equipos: 64
  }
];

export const INITIAL_CATEGORIES = [
  {
    id: 'c1111111-1111-4111-8111-111111111111',
    nombre: 'Equipos de Cómputo',
    codigo: 'COMPUTO',
    descripcion: 'Laptops, PCs de escritorio, All-in-One y estaciones de trabajo de contact center',
    icono: 'Laptop'
  },
  {
    id: 'c2222222-2222-4222-8222-222222222222',
    nombre: 'Dispositivos Móviles',
    codigo: 'MOVILES',
    descripcion: 'Smartphones corporativos, tablets para técnicos en sitio y supervisores',
    icono: 'Smartphone'
  },
  {
    id: 'c3333333-3333-4333-8333-333333333333',
    nombre: 'Redes y Telecomunicaciones',
    codigo: 'REDES',
    descripcion: 'Racks de comunicaciones, switches Cisco, routers, firewalls y Access Points',
    icono: 'Network'
  },
  {
    id: 'c4444444-4444-4444-8444-444444444444',
    nombre: 'Servidores y Data Center',
    codigo: 'SERVIDORES',
    descripcion: 'Servidores rackeables, sistemas de almacenamiento NAS/SAN y UPS centrales',
    icono: 'Server'
  }
];

// Dos perfiles oficiales para la versión final: 1 Admin y 1 Técnico (Miguel Rueda - Soporte Técnico)
export const INITIAL_USERS = [
  {
    id: '11111111-1111-4111-8111-111111111111',
    nombre: 'Administrador TICS',
    email: 'admin.tics@emtelco.com.co',
    rol: 'ADMIN',
    cargo: 'Líder / Administrador TICS',
    sede_id: 'a1111111-1111-4111-8111-111111111111',
    telefono: '+57 300 123 4567'
  },
  {
    id: '22222222-2222-4222-8222-222222222222',
    nombre: 'Miguel Rueda',
    email: 'miguel.rueda@emtelco.com.co',
    rol: 'TECNICO',
    cargo: 'Soporte Técnico',
    sede_id: 'a1111111-1111-4111-8111-111111111111',
    telefono: '+57 312 888 9900'
  }
];

export const INITIAL_ACTIVOS = [
  {
    id: 'd1111111-1111-4111-8111-111111111111',
    codigo_inventario: 'EMT-CMP-1042',
    serial: 'NXK6EAA0019283',
    nombre: 'Laptop Dell Latitude 5420 - Operación BPO',
    categoria_id: 'c1111111-1111-4111-8111-111111111111',
    marca: 'Dell',
    modelo: 'Latitude 5420',
    especificaciones: {
      cpu: 'Intel Core i7-1185G7 @ 3.00GHz',
      ram: '16GB DDR4 3200MHz',
      disco: '512GB NVMe M.2 SSD',
      so: 'Windows 11 Pro 64-bit',
      ip: '192.168.10.45',
      mac: 'E4:54:E8:A2:3B:10'
    },
    sede_id: 'a1111111-1111-4111-8111-111111111111',
    ubicacion_detalle: 'Piso 3 - Campaña BPO Isla 4 Puesto 12',
    responsable: 'Laura Restrepo - Asesora de Servicio',
    estado: 'OPERATIVO',
    frecuencia_mantenimiento_meses: 3,
    fecha_ingreso: '2025-01-15',
    ultimo_mantenimiento: '2026-05-10',
    proximo_mantenimiento: '2026-08-10',
    observaciones: 'Equipo en comodato operativo. Requiere soplado periódico por alta afluencia.'
  },
  {
    id: 'd2222222-2222-4222-8222-222222222222',
    codigo_inventario: 'EMT-CMP-1088',
    serial: '8CG0123XYZ901',
    nombre: 'PC HP ProDesk 400 G7 - Supervisión',
    categoria_id: 'c1111111-1111-4111-8111-111111111111',
    marca: 'HP',
    modelo: 'ProDesk 400 G7 Microtower',
    especificaciones: {
      cpu: 'Intel Core i5-10500 @ 3.10GHz',
      ram: '16GB DDR4',
      disco: '256GB SSD + 1TB HDD Seagate',
      so: 'Windows 11 Pro',
      ip: '192.168.10.88',
      mac: '3C:52:82:11:44:99'
    },
    sede_id: 'a1111111-1111-4111-8111-111111111111',
    ubicacion_detalle: 'Piso 2 - Sala de Monitoreo y Calidad',
    responsable: 'Julián Zapata - Supervisor TICS',
    estado: 'OPERATIVO',
    frecuencia_mantenimiento_meses: 3,
    fecha_ingreso: '2024-11-20',
    ultimo_mantenimiento: '2026-06-01',
    proximo_mantenimiento: '2026-09-01',
    observaciones: 'Monitores dobles conectados vía DisplayPort.'
  },
  {
    id: 'd3333333-3333-4333-8333-333333333333',
    codigo_inventario: 'EMT-MOV-0315',
    serial: 'R58M90ABCD881',
    nombre: 'Samsung Galaxy A54 5G - Soporte Terreno',
    categoria_id: 'c2222222-2222-4222-8222-222222222222',
    marca: 'Samsung',
    modelo: 'Galaxy A54 5G Enterprise Edition',
    especificaciones: {
      ram: '8GB',
      almacenamiento: '256GB Interno',
      so: 'Android 14 / One UI 6.1',
      imei: '358941205847120',
      bateria_salud: '96%'
    },
    sede_id: 'a2222222-2222-4222-8222-222222222222',
    ubicacion_detalle: 'Móvil Asignado a Soporte Técnico en Terreno',
    responsable: 'Miguel Rueda - Soporte Técnico',
    estado: 'OPERATIVO',
    frecuencia_mantenimiento_meses: 6,
    fecha_ingreso: '2025-03-10',
    ultimo_mantenimiento: '2026-03-15',
    proximo_mantenimiento: '2026-09-15',
    observaciones: 'Incluye funda de alto impacto y protector cerámico.'
  },
  {
    id: 'd4444444-4444-4444-8444-444444444444',
    codigo_inventario: 'EMT-RED-0012',
    serial: 'FCW2219B0GH98',
    nombre: 'Switch Core Cisco Catalyst 2960X-48FPS',
    categoria_id: 'c3333333-3333-4333-8333-333333333333',
    marca: 'Cisco Systems',
    modelo: 'Catalyst 2960X-48FPS-L Gigabit PoE+',
    especificaciones: {
      puertos: '48x Gigabit PoE+ (370W) + 4x 1G SFP',
      so: 'Cisco IOS 15.2(7)E',
      ip_gestion: '10.0.0.12',
      vlan: 'VLAN 10 (Datos), 20 (Voz IP), 30 (Gestión)',
      firmware: '15.2.7.E1'
    },
    sede_id: 'a1111111-1111-4111-8111-111111111111',
    ubicacion_detalle: 'Data Center Piso 1 - Gabinete 02 Unidad 18',
    responsable: 'Área de Redes y Telecomunicaciones',
    estado: 'OPERATIVO',
    frecuencia_mantenimiento_meses: 2,
    fecha_ingreso: '2024-05-10',
    ultimo_mantenimiento: '2026-06-20',
    proximo_mantenimiento: '2026-08-20',
    observaciones: 'Equipo crítico para la continuidad de la telefonía IP.'
  },
  {
    id: 'd5555555-5555-4555-8555-555555555555',
    codigo_inventario: 'EMT-RED-0044',
    serial: 'RACK-BOG-P2-01',
    nombre: 'Rack de Telecomunicaciones Piso 2 Bogotá',
    categoria_id: 'c3333333-3333-4333-8333-333333333333',
    marca: 'Panduit',
    modelo: 'Gabinete Servidores y Red 42U 800x1000mm',
    especificaciones: {
      capacidad: '42 Unidades de Rack',
      pdu: '2x PDU Monitoreable APC IP 16A',
      extractores: '4x Ventiladores superiores 220V',
      patch_panels: '6x Patch Panels Cat 6A 24 puertos'
    },
    sede_id: 'a3333333-3333-4333-8333-333333333333',
    ubicacion_detalle: 'Piso 2 - Cuarto Técnico MDF Central Bogotá',
    responsable: 'Miguel Rueda - Soporte Técnico',
    estado: 'EN_MANTENIMIENTO',
    frecuencia_mantenimiento_meses: 3,
    fecha_ingreso: '2024-08-14',
    ultimo_mantenimiento: '2026-04-10',
    proximo_mantenimiento: '2026-07-10',
    observaciones: 'En proceso de peinado y rotulación de patch cords de fibra óptica.'
  },
  {
    id: 'd6666666-6666-4666-8666-666666666666',
    codigo_inventario: 'EMT-SRV-0003',
    serial: '7KJ8MN2PE740',
    nombre: 'Servidor Dell PowerEdge R740 - Telefonía PBX',
    categoria_id: 'c4444444-4444-4444-8444-444444444444',
    marca: 'Dell EMC',
    modelo: 'PowerEdge R740 2U Rack',
    especificaciones: {
      cpu: '2x Intel Xeon Gold 6248R 24-Cores @ 3.0GHz',
      ram: '128GB (4x32GB) RDIMM 3200MHz ECC',
      almacenamiento: '4x 1.92TB SAS SSD en RAID 10',
      idrac: 'iDRAC9 Enterprise con IP 10.0.0.8',
      so: 'VMware ESXi 7.0 Update 3'
    },
    sede_id: 'a1111111-1111-4111-8111-111111111111',
    ubicacion_detalle: 'Data Center Principal - Rack 01 U12-U14',
    responsable: 'Administrador TICS',
    estado: 'OPERATIVO',
    frecuencia_mantenimiento_meses: 2,
    fecha_ingreso: '2024-02-01',
    ultimo_mantenimiento: '2026-07-01',
    proximo_mantenimiento: '2026-09-01',
    observaciones: 'Aloja las máquinas virtuales de grabación y tarificación de llamadas.'
  }
];

export const INITIAL_PROGRAMACIONES = [
  {
    id: 'f1111111-1111-4111-8111-111111111111',
    activo_id: 'd1111111-1111-4111-8111-111111111111',
    tecnico_asignado_id: '22222222-2222-4222-8222-222222222222',
    fecha_programada: '2026-08-28',
    estado: 'PROGRAMADO',
    prioridad: 'MEDIA',
    tipo_mantenimiento: 'PREVENTIVO',
    notas: 'Mantenimiento preventivo periódico trimestral y verificación de disco.'
  },
  {
    id: 'f2222222-2222-4222-8222-222222222222',
    activo_id: 'd4444444-4444-4444-8444-444444444444',
    tecnico_asignado_id: '22222222-2222-4222-8222-222222222222',
    fecha_programada: '2026-08-25',
    estado: 'PROGRAMADO',
    prioridad: 'ALTA',
    tipo_mantenimiento: 'PREVENTIVO',
    notas: 'Revisión de fuentes de poder redundantes, limpieza de extractores y backup de configuración Cisco IOS.'
  },
  {
    id: 'f3333333-3333-4333-8333-333333333333',
    activo_id: 'd5555555-5555-4555-8555-555555555555',
    tecnico_asignado_id: '22222222-2222-4222-8222-222222222222',
    fecha_programada: '2026-07-10',
    estado: 'ATRASADO',
    prioridad: 'ALTA',
    tipo_mantenimiento: 'PREVENTIVO',
    notas: 'Atrasado por mudanza de sede Bogotá. Urge inspección de temperatura y cableado estructurado.'
  },
  {
    id: 'f4444444-4444-4444-8444-444444444444',
    activo_id: 'd6666666-6666-4666-8666-666666666666',
    tecnico_asignado_id: '11111111-1111-4111-8111-111111111111',
    fecha_programada: '2026-09-01',
    estado: 'PROGRAMADO',
    prioridad: 'ALTA',
    tipo_mantenimiento: 'PREVENTIVO',
    notas: 'Ventana de mantenimiento en fin de semana para actualización de VMware ESXi.'
  }
];

export const INITIAL_MANTENIMIENTOS = [
  {
    id: 'e1111111-1111-4111-8111-111111111111',
    codigo_acta: 'ACT-2026-0101',
    programacion_id: null,
    activo_id: 'd1111111-1111-4111-8111-111111111111',
    tecnico_id: '22222222-2222-4222-8222-222222222222',
    tecnico_nombre: 'Miguel Rueda',
    fecha_ejecucion: '2026-05-10',
    tiempo_minutos: 45,
    tipo: 'PREVENTIVO',
    checklist: [
      { tarea: 'Limpieza física externa e interna con aire comprimido y alcohol isopropílico', hecho: true },
      { tarea: 'Actualización de parches de seguridad de Windows y antivirus corporativo', hecho: true },
      { tarea: 'Diagnóstico de salud del disco SSD (SMART 100% Sin sectores defectuosos)', hecho: true },
      { tarea: 'Verificación de pasta térmica y temperatura del procesador (42°C idle)', hecho: true },
      { tarea: 'Prueba de conectividad de red LAN, WiFi y VPN corporativa EMTELCO', hecho: true },
      { tarea: 'Validación de periféricos (teclado, touchpad, cargador original)', hecho: true }
    ],
    diagnostico: 'Equipo en muy buen estado físico y lógico. Se detectó polvo moderado en ductos de disipación y 2 actualizaciones acumulativas pendientes.',
    actividades_realizadas: 'Se procedió al soplado interno del ventilador, cambio de pasta térmica Arctic MX-4, limpieza de pantalla con paño de microfibra, optimización de archivos temporales del sistema y aplicación de parches de seguridad.',
    observaciones: 'Se recomienda al usuario mantener despejada la base de refrigeración de la laptop.',
    estado_final_equipo: 'OPERATIVO',
    conformidad_usuario: 'Laura Restrepo - Asesora de Operaciones BPO',
    evidencias: [
      {
        id: 'ev-01',
        tipo: 'FOTO_ANTES',
        url_archivo: 'https://images.unsplash.com/photo-1588872657578-7efd1f1555ed?w=800&auto=format&fit=crop&q=80',
        descripcion: 'Estado inicial: ventilación con polvo y suciedad en cubierta'
      },
      {
        id: 'ev-01-b',
        tipo: 'FOTO_DURANTE',
        url_archivo: 'https://images.unsplash.com/photo-1597872200969-2b65d56bd16b?w=800&auto=format&fit=crop&q=80',
        descripcion: 'Procedimiento técnico: soplado interno, cambio de pasta y parches'
      },
      {
        id: 'ev-02',
        tipo: 'FOTO_DESPUES',
        url_archivo: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=800&auto=format&fit=crop&q=80',
        descripcion: 'Estado final: equipo limpio, libre de polvo y con pruebas de rendimiento aprobadas'
      }
    ]
  },
  {
    id: 'e2222222-2222-4222-8222-222222222222',
    codigo_acta: 'ACT-2026-0142',
    programacion_id: null,
    activo_id: 'd4444444-4444-4444-8444-444444444444',
    tecnico_id: '22222222-2222-4222-8222-222222222222',
    tecnico_nombre: 'Miguel Rueda',
    fecha_ejecucion: '2026-06-20',
    tiempo_minutos: 60,
    tipo: 'PREVENTIVO',
    checklist: [
      { tarea: 'Inspección de luces LED de estado y fuentes de poder redundantes', hecho: true },
      { tarea: 'Limpieza de filtros y rejillas de ventilación del switch', hecho: true },
      { tarea: 'Verificación de tablas de reenvío MAC y errores CRC en puertos', hecho: true },
      { tarea: 'Extracción de backup del archivo running-config hacia servidor TFTP', hecho: true },
      { tarea: 'Medición de potencia y consumo PoE de teléfonos IP conectados', hecho: true }
    ],
    diagnostico: 'Switch operando sin errores de hardware. Consumo PoE al 58% de su capacidad total.',
    actividades_realizadas: 'Limpieza externa, fijación de anclajes al rack, verificación de patch cables y respaldo exitoso de la configuración en el repositorio seguro.',
    observaciones: 'Todos los 48 puertos gigabit funcionando dentro de los parámetros de calidad.',
    estado_final_equipo: 'OPERATIVO',
    conformidad_usuario: 'Ingeniería TICS EMTELCO',
    evidencias: [
      {
        id: 'ev-03',
        tipo: 'FOTO_ANTES',
        url_archivo: 'https://images.unsplash.com/photo-1544197150-b99a580bb7a8?w=800&auto=format&fit=crop&q=80',
        descripcion: 'Switch Cisco en gabinete rack antes de inspección'
      },
      {
        id: 'ev-03-b',
        tipo: 'FOTO_DURANTE',
        url_archivo: 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=800&auto=format&fit=crop&q=80',
        descripcion: 'Procedimiento técnico: limpieza de extractores y peinado de cables'
      },
      {
        id: 'ev-04',
        tipo: 'FOTO_DESPUES',
        url_archivo: 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=800&auto=format&fit=crop&q=80',
        descripcion: 'Gabinete y puertos con patch cords organizados y certificados'
      }
    ]
  }
];

export const DEFAULT_CHECKLIST_TEMPLATES = {
  COMPUTO: [
    'Limpieza física externa de chasis, pantalla, teclado y mouse',
    'Soplado interno con aire comprimido de ventiladores y disipador',
    'Revisión y cambio de pasta térmica (si temperatura > 65°C en reposo)',
    'Verificación del estado de salud del disco duro / SSD (SMART)',
    'Eliminación de archivos temporales y optimización de arranque',
    'Actualización de parches críticos de seguridad del Sistema Operativo',
    'Escaneo y actualización de firmas de antivirus corporativo',
    'Prueba de conectividad de red local (LAN/Wi-Fi) y velocidad',
    'Validación de estado físico de cargador / fuente de poder y batería'
  ],
  MOVILES: [
    'Limpieza externa y desinfección de pantalla, puertos y micrófono',
    'Comprobación del estado de salud de la batería y ciclo de carga',
    'Verificación de puerto USB-C / Lightning y cable de carga',
    'Actualización de sistema operativo y parches de seguridad',
    'Limpieza de memoria caché y optimización de almacenamiento',
    'Verificación de funcionamiento de cámara frontal y trasera (para evidencias)',
    'Validación de señal celular 4G/5G, Wi-Fi y GPS'
  ],
  REDES: [
    'Inspección visual de LEDs de estado, alarmas y ventiladores',
    'Limpieza de polvo y soplado en rejillas y fuentes de alimentación',
    'Verificación de temperaturas internas y velocidad de fan (CLI)',
    'Comprobación de errores CRC, colisiones y estado de puertos',
    'Respaldo de la configuración actual (running-config) en servidor seguro',
    'Inspección de patch cords, conectores RJ45 y jumpers de fibra óptica',
    'Verificación del voltaje suministrado por la PDU o UPS del rack'
  ],
  SERVIDORES: [
    'Revisión de logs de hardware y alertas en iDRAC / iLO',
    'Inspección de fuentes de poder redundantes y cables de poder',
    'Monitoreo de estado de arreglo de discos RAID y consistencia',
    'Limpieza de filtros frontales y módulos de ventilación hot-swap',
    'Comprobación de uso de memoria RAM y diagnósticos de procesador',
    'Verificación de snapshots y estado de backups en máquinas virtuales',
    'Revisión de temperatura ambiente y disipación térmica del gabinete'
  ]
};
