import React, { useState, useMemo } from 'react';
import { 
  Plus, 
  Search, 
  Laptop, 
  Smartphone, 
  Network, 
  Server, 
  Eye, 
  Edit3, 
  Trash2, 
  MapPin, 
  User, 
  LayoutGrid, 
  List, 
  QrCode
} from 'lucide-react';
import { useData } from '../../context/DataContext';
import { useAuth } from '../../context/AuthContext';
import { AssetFormModal } from './AssetFormModal';
import { AssetDetailModal } from './AssetDetailModal';
import { AssetQrModal } from './AssetQrModal';

export const AssetsView = ({ onExecuteMaintenance }) => {
  const { activos, categorias, sedes, deleteActivo } = useData();
  const { isAdmin } = useAuth();

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('ALL');
  const [selectedSede, setSelectedSede] = useState('ALL');
  const [selectedStatus, setSelectedStatus] = useState('ALL');
  const [viewMode, setViewMode] = useState('grid');

  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingAsset, setEditingAsset] = useState(null);
  const [detailAsset, setDetailAsset] = useState(null);
  const [qrAsset, setQrAsset] = useState(null);

  const filteredAssets = useMemo(() => {
    return activos.filter(a => {
      const matchSearch = 
        a.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
        a.codigo_inventario.toLowerCase().includes(searchTerm.toLowerCase()) ||
        a.serial.toLowerCase().includes(searchTerm.toLowerCase()) ||
        a.marca.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (a.responsable && a.responsable.toLowerCase().includes(searchTerm.toLowerCase()));

      const matchCategory = selectedCategory === 'ALL' || a.categoria_id === selectedCategory;
      const matchSede = selectedSede === 'ALL' || a.sede_id === selectedSede;
      const matchStatus = selectedStatus === 'ALL' || a.estado === selectedStatus;

      return matchSearch && matchCategory && matchSede && matchStatus;
    });
  }, [activos, searchTerm, selectedCategory, selectedSede, selectedStatus]);

  const getCategoryIcon = (codigo) => {
    switch (codigo) {
      case 'COMPUTO': return Laptop;
      case 'MOVILES': return Smartphone;
      case 'REDES': return Network;
      case 'SERVIDORES': return Server;
      default: return Laptop;
    }
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'OPERATIVO':
        return <span className="inline-flex items-center gap-1.5 text-[11px] font-medium text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200/60 transition-colors"><span className="w-1.5 h-1.5 rounded-full bg-emerald-500" /> Operativo</span>;
      case 'EN_MANTENIMIENTO':
        return <span className="inline-flex items-center gap-1.5 text-[11px] font-medium text-amber-800 bg-amber-50 px-2 py-0.5 rounded border border-amber-200/60 transition-colors"><span className="w-1.5 h-1.5 rounded-full bg-amber-500" /> En Mantenimiento</span>;
      case 'EN_REVISION':
        return <span className="inline-flex items-center gap-1.5 text-[11px] font-medium text-blue-800 bg-blue-50 px-2 py-0.5 rounded border border-blue-200/60 transition-colors"><span className="w-1.5 h-1.5 rounded-full bg-blue-500" /> En Revisión</span>;
      case 'DE_BAJA':
        return <span className="inline-flex items-center gap-1.5 text-[11px] font-medium text-rose-800 bg-rose-50 px-2 py-0.5 rounded border border-rose-200/60 transition-colors"><span className="w-1.5 h-1.5 rounded-full bg-rose-500" /> De Baja</span>;
      default:
        return <span className="text-[11px] text-zinc-600 bg-zinc-100 px-2 py-0.5 rounded">{status}</span>;
    }
  };

  return (
    <div className="space-y-4 animate-in fade-in duration-150">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-2 border-b border-zinc-200/70">
        <div>
          <h2 className="text-xl font-bold text-zinc-900 tracking-tight">
            Inventario de Activos Tecnológicos
          </h2>
          <p className="text-xs text-zinc-500">
            {activos.length} activos registrados en el sistema CMMS
          </p>
        </div>

        <button
          onClick={() => {
            setEditingAsset(null);
            setIsFormOpen(true);
          }}
          className="btn-interactive flex items-center justify-center gap-1.5 px-3 py-1.5 bg-zinc-900 hover:bg-zinc-800 text-white text-xs font-medium rounded-md shadow-2xs self-start sm:self-auto"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>Registrar Activo</span>
        </button>
      </div>

      {/* Toolbar & Filters */}
      <div className="bg-white p-3 rounded-lg border border-zinc-200/80 shadow-2xs space-y-2.5">
        
        <div className="flex flex-col md:flex-row gap-2.5">
          <div className="relative flex-1">
            <Search className="w-3.5 h-3.5 text-zinc-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input 
              type="text"
              placeholder="Buscar por placa, serial, marca o responsable..."
              className="w-full pl-8 pr-3 py-1.5 text-xs border border-zinc-200 rounded-md focus:outline-none focus:border-zinc-800 bg-zinc-50/50 transition-colors"
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
            />
          </div>

          <select
            className="px-2.5 py-1.5 text-xs border border-zinc-200 rounded-md bg-white focus:outline-none focus:border-zinc-800 text-zinc-700 font-medium transition-colors hover:border-zinc-300"
            value={selectedSede}
            onChange={e => setSelectedSede(e.target.value)}
          >
            <option value="ALL">Todas las Sedes</option>
            {sedes.map(s => (
              <option key={s.id} value={s.id}>{s.nombre.split('-')[0]}</option>
            ))}
          </select>

          <select
            className="px-2.5 py-1.5 text-xs border border-zinc-200 rounded-md bg-white focus:outline-none focus:border-zinc-800 text-zinc-700 font-medium transition-colors hover:border-zinc-300"
            value={selectedStatus}
            onChange={e => setSelectedStatus(e.target.value)}
          >
            <option value="ALL">Todos los Estados</option>
            <option value="OPERATIVO">Operativo</option>
            <option value="EN_MANTENIMIENTO">En Mantenimiento</option>
            <option value="EN_REVISION">En Revisión</option>
            <option value="DE_BAJA">De Baja</option>
          </select>

          <div className="flex items-center gap-1 bg-zinc-100 p-0.5 rounded-md border border-zinc-200 shrink-0">
            <button
              onClick={() => setViewMode('grid')}
              className={`p-1 rounded transition-all ${viewMode === 'grid' ? 'bg-white shadow-2xs text-zinc-900 font-semibold' : 'text-zinc-500 hover:text-zinc-900'}`}
              title="Cuadrícula"
            >
              <LayoutGrid className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => setViewMode('table')}
              className={`p-1 rounded transition-all ${viewMode === 'table' ? 'bg-white shadow-2xs text-zinc-900 font-semibold' : 'text-zinc-500 hover:text-zinc-900'}`}
              title="Tabla"
            >
              <List className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Categorías tabs */}
        <div className="flex items-center gap-1.5 overflow-x-auto text-xs pt-1 border-t border-zinc-100">
          <button
            onClick={() => setSelectedCategory('ALL')}
            className={`btn-interactive px-2.5 py-1 rounded text-[11px] font-medium transition-all shrink-0 ${
              selectedCategory === 'ALL' ? 'bg-zinc-900 text-white' : 'text-zinc-600 hover:bg-zinc-100 hover:text-zinc-900'
            }`}
          >
            Todos ({activos.length})
          </button>

          {categorias.map(cat => {
            const count = activos.filter(a => a.categoria_id === cat.id).length;
            return (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`btn-interactive px-2.5 py-1 rounded text-[11px] font-medium transition-all shrink-0 ${
                  selectedCategory === cat.id ? 'bg-zinc-900 text-white' : 'text-zinc-600 hover:bg-zinc-100 hover:text-zinc-900'
                }`}
              >
                <span>{cat.nombre}</span>
                <span className="opacity-60 ml-1">({count})</span>
              </button>
            );
          })}
        </div>

      </div>

      {/* Grid or Table */}
      {filteredAssets.length === 0 ? (
        <div className="bg-white rounded-lg p-10 text-center border border-zinc-200 text-xs text-zinc-500">
          No se encontraron activos con los filtros seleccionados.
        </div>
      ) : viewMode === 'grid' ? (
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3.5">
          {filteredAssets.map(asset => {
            const cat = categorias.find(c => c.id === asset.categoria_id);
            const sede = sedes.find(s => s.id === asset.sede_id);
            const Icon = getCategoryIcon(cat?.codigo);

            return (
              <div 
                key={asset.id}
                className="interactive-card bg-white rounded-lg border border-zinc-200/80 p-4 flex flex-col justify-between shadow-2xs"
              >
                <div>
                  <div className="flex items-center justify-between gap-2 mb-2">
                    <div className="flex items-center gap-1.5">
                      <span className="font-mono text-xs font-semibold text-zinc-900 bg-zinc-100 px-1.5 py-0.5 rounded border border-zinc-200">
                        {asset.codigo_inventario}
                      </span>
                    </div>
                    {getStatusBadge(asset.estado)}
                  </div>

                  <h3 className="text-xs font-semibold text-zinc-900 line-clamp-1 mt-1">
                    {asset.nombre}
                  </h3>
                  <p className="text-[11px] text-zinc-500 font-mono">
                    {asset.marca} {asset.modelo} &bull; S/N: {asset.serial}
                  </p>

                  <div className="mt-2.5 py-2 border-y border-zinc-100 space-y-0.5 text-[11px] text-zinc-600">
                    <p className="flex items-center gap-1.5 truncate">
                      <MapPin className="w-3 h-3 text-zinc-400 shrink-0" />
                      <span>{sede?.nombre.split('-')[0]} &bull; {asset.ubicacion_detalle || 'General'}</span>
                    </p>
                    <p className="flex items-center gap-1.5 truncate">
                      <User className="w-3 h-3 text-zinc-400 shrink-0" />
                      <span>{asset.responsable || 'No asignado'}</span>
                    </p>
                  </div>

                  <div className="mt-2.5 flex items-center justify-between text-[11px]">
                    <span className="text-zinc-400">
                      Último: <strong className="text-zinc-700 font-mono">{asset.ultimo_mantenimiento || 'Nunca'}</strong>
                    </span>
                    <span className="text-zinc-600 font-mono bg-zinc-50 px-1.5 py-0.5 rounded border border-zinc-200">
                      Próx: {asset.proximo_mantenimiento || '-'}
                    </span>
                  </div>
                </div>

                <div className="mt-3 pt-2.5 border-t border-zinc-100 flex items-center justify-between gap-1.5">
                  <button
                    onClick={() => setDetailAsset(asset)}
                    className="btn-interactive flex-1 py-1 px-2 bg-zinc-50 hover:bg-zinc-100 text-zinc-700 hover:text-zinc-900 rounded text-xs font-medium border border-zinc-200 hover:border-zinc-300 text-center"
                  >
                    Ficha Técnica
                  </button>

                  <button
                    onClick={() => {
                      setEditingAsset(asset);
                      setIsFormOpen(true);
                    }}
                    className="btn-interactive p-1 hover:bg-zinc-100 text-zinc-600 hover:text-zinc-900 rounded border border-zinc-200 hover:border-zinc-300"
                    title="Editar"
                  >
                    <Edit3 className="w-3.5 h-3.5" />
                  </button>

                  {isAdmin && (
                    <button
                      onClick={() => {
                        if (confirm(`¿Eliminar activo ${asset.codigo_inventario}?`)) {
                          deleteActivo(asset.id);
                        }
                      }}
                      className="btn-interactive p-1 hover:bg-rose-50 text-zinc-400 hover:text-rose-600 rounded border border-zinc-200 hover:border-rose-200"
                      title="Eliminar"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>

              </div>
            );
          })}
        </div>
      ) : (

        <div className="bg-white rounded-lg border border-zinc-200 shadow-2xs overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-zinc-50 text-zinc-600 font-semibold border-b border-zinc-200 uppercase tracking-wider text-[10px]">
              <tr>
                <th className="p-3">Código</th>
                <th className="p-3">Activo / Modelo</th>
                <th className="p-3">Sede</th>
                <th className="p-3">Responsable</th>
                <th className="p-3">Estado</th>
                <th className="p-3">Próx. Mantenimiento</th>
                <th className="p-3 text-right">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-100">
              {filteredAssets.map(asset => {
                const sede = sedes.find(s => s.id === asset.sede_id);
                return (
                  <tr key={asset.id} className="hover:bg-zinc-50/80 transition-colors duration-100">
                    <td className="p-3 font-mono font-semibold text-zinc-900">
                      {asset.codigo_inventario}
                    </td>
                    <td className="p-3">
                      <p className="font-medium text-zinc-900">{asset.nombre}</p>
                      <p className="text-zinc-400 text-[11px] font-mono">{asset.marca} {asset.modelo} ({asset.serial})</p>
                    </td>
                    <td className="p-3 text-zinc-600">{sede?.nombre.split('-')[0]}</td>
                    <td className="p-3 text-zinc-600">{asset.responsable || '-'}</td>
                    <td className="p-3">{getStatusBadge(asset.estado)}</td>
                    <td className="p-3 font-mono text-zinc-700">{asset.proximo_mantenimiento || '-'}</td>
                    <td className="p-3 text-right">
                      <div className="flex items-center justify-end gap-1">
                        <button
                          onClick={() => setDetailAsset(asset)}
                          className="btn-interactive p-1 text-zinc-500 hover:text-zinc-900 hover:bg-zinc-100 rounded border border-zinc-200"
                          title="Ver Ficha"
                        >
                          <Eye className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => {
                            setEditingAsset(asset);
                            setIsFormOpen(true);
                          }}
                          className="btn-interactive p-1 text-zinc-500 hover:text-zinc-900 hover:bg-zinc-100 rounded border border-zinc-200"
                          title="Editar"
                        >
                          <Edit3 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      {/* Modales */}
      {isFormOpen && (
        <AssetFormModal
          isOpen={isFormOpen}
          onClose={() => setIsFormOpen(false)}
          initialData={editingAsset}
        />
      )}

      {detailAsset && (
        <AssetDetailModal
          isOpen={Boolean(detailAsset)}
          onClose={() => setDetailAsset(null)}
          asset={detailAsset}
          onExecuteMaintenance={onExecuteMaintenance}
        />
      )}

    </div>
  );
};
