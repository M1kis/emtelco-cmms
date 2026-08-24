import React, { useState } from 'react';
import { AuthProvider } from './context/AuthContext';
import { DataProvider, useData } from './context/DataContext';
import { Header } from './components/layout/Header';
import { Sidebar } from './components/layout/Sidebar';
import { DashboardView } from './components/dashboard/DashboardView';
import { AssetsView } from './components/assets/AssetsView';
import { AssetFormModal } from './components/assets/AssetFormModal';
import { MaintenanceView } from './components/maintenance/MaintenanceView';
import { MaintenanceWizardModal } from './components/maintenance/MaintenanceWizardModal';
import { ScheduleView } from './components/schedule/ScheduleView';
import { ScheduleModal } from './components/schedule/ScheduleModal';
import { ReportsView } from './components/reports/ReportsView';
import { SettingsView } from './components/settings/SettingsView';
import { SupabaseConfigModal } from './components/settings/SupabaseConfigModal';
import { CheckCircle2, AlertCircle, Info } from 'lucide-react';

function MainLayout() {
  const [currentTab, setCurrentTab] = useState('dashboard');
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

  // Estados de Modales Globales
  const [isMaintenanceWizardOpen, setIsMaintenanceWizardOpen] = useState(false);
  const [preselectedAsset, setPreselectedAsset] = useState(null);
  const [preselectedProg, setPreselectedProg] = useState(null);

  const [isAssetModalOpen, setIsAssetModalOpen] = useState(false);
  const [isScheduleModalOpen, setIsScheduleModalOpen] = useState(false);
  const [isSupabaseModalOpen, setIsSupabaseModalOpen] = useState(false);

  const { notification } = useData();

  // Nombres legibles para el Header
  const tabTitles = {
    dashboard: 'Panel General & KPIs',
    activos: 'Inventario de Activos Tecnológicos',
    mantenimientos: 'Gestión de Mantenimientos y Actas',
    cronograma: 'Cronograma y Calendario Preventivo',
    reportes: 'Reportes e Indicadores de Gestión',
    sedes: 'Sedes y Configuración del Sistema'
  };

  // Disparadores entre módulos
  const handleExecuteMaintenance = (asset, prog = null) => {
    setPreselectedAsset(asset);
    setPreselectedProg(prog);
    setIsMaintenanceWizardOpen(true);
  };

  return (
    <div className="min-h-screen bg-slate-100 flex flex-col lg:flex-row">
      
      {/* Sidebar fijo a la izquierda */}
      <Sidebar 
        currentTab={currentTab} 
        setCurrentTab={setCurrentTab}
        mobileOpen={mobileSidebarOpen}
        setMobileOpen={setMobileSidebarOpen}
        onOpenNewMaintenanceModal={() => {
          setPreselectedAsset(null);
          setPreselectedProg(null);
          setIsMaintenanceWizardOpen(true);
        }}
        onOpenNewAssetModal={() => setIsAssetModalOpen(true)}
      />

      {/* Contenido Principal con margen para Sidebar */}
      <div className="flex-1 lg:pl-72 flex flex-col min-w-0">
        
        {/* Header Superior */}
        <Header 
          currentView={tabTitles[currentTab] || 'EMTELCO CMMS'}
          onOpenMobileMenu={() => setMobileSidebarOpen(true)}
          onOpenSupabaseModal={() => setIsSupabaseModalOpen(true)}
        />

        {/* Notificación Toast Flotante */}
        {notification && (
          <div className="fixed bottom-5 right-5 z-50 animate-in slide-in-from-bottom-5 fade-in duration-200">
            <div className={`px-4 py-3 rounded-xl shadow-2xl flex items-center gap-3 border ${
              notification.type === 'success' ? 'bg-emerald-900 text-white border-emerald-700' :
              notification.type === 'info' ? 'bg-slate-900 text-white border-slate-700' :
              'bg-rose-900 text-white border-rose-700'
            }`}>
              {notification.type === 'success' ? <CheckCircle2 className="w-5 h-5 text-emerald-400" /> :
               notification.type === 'info' ? <Info className="w-5 h-5 text-blue-400" /> :
               <AlertCircle className="w-5 h-5 text-rose-400" />}
              <span className="text-xs font-semibold">{notification.message}</span>
            </div>
          </div>
        )}

        {/* Vista Activa */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto">
          {currentTab === 'dashboard' && (
            <DashboardView 
              onNavigate={setCurrentTab}
              onOpenNewMaintenanceModal={() => {
                setPreselectedAsset(null);
                setPreselectedProg(null);
                setIsMaintenanceWizardOpen(true);
              }}
              onOpenNewAssetModal={() => setIsAssetModalOpen(true)}
              onOpenScheduleModal={() => setIsScheduleModalOpen(true)}
            />
          )}

          {currentTab === 'activos' && (
            <AssetsView 
              onExecuteMaintenance={handleExecuteMaintenance}
            />
          )}

          {currentTab === 'mantenimientos' && (
            <MaintenanceView 
              onOpenWizard={() => {
                setPreselectedAsset(null);
                setPreselectedProg(null);
                setIsMaintenanceWizardOpen(true);
              }}
              isWizardOpen={isMaintenanceWizardOpen}
              onCloseWizard={() => {
                setIsMaintenanceWizardOpen(false);
                setPreselectedAsset(null);
                setPreselectedProg(null);
              }}
              preselectedAsset={preselectedAsset}
            />
          )}

          {currentTab === 'cronograma' && (
            <ScheduleView 
              onExecuteMaintenanceFromProg={(asset, prog) => handleExecuteMaintenance(asset, prog)}
            />
          )}

          {currentTab === 'reportes' && (
            <ReportsView />
          )}

          {currentTab === 'sedes' && (
            <SettingsView 
              onOpenSupabaseModal={() => setIsSupabaseModalOpen(true)}
            />
          )}
        </main>

        {/* Footer simple */}
        <footer className="py-4 px-8 border-t border-slate-200 text-center text-xs text-slate-400 bg-white/50">
          EMTELCO CMMS &copy; 2026 &bull; Trabajo de Grado CUN - Modelos de Innovación &bull; TICS Mantenimiento Preventivo
        </footer>

      </div>

      {/* Modales Globales */}
      {isMaintenanceWizardOpen && (
        <MaintenanceWizardModal 
          isOpen={isMaintenanceWizardOpen}
          onClose={() => {
            setIsMaintenanceWizardOpen(false);
            setPreselectedAsset(null);
            setPreselectedProg(null);
          }}
          preselectedAsset={preselectedAsset}
          preselectedProg={preselectedProg}
        />
      )}

      {isAssetModalOpen && (
        <AssetFormModal 
          isOpen={isAssetModalOpen}
          onClose={() => setIsAssetModalOpen(false)}
        />
      )}

      {isScheduleModalOpen && (
        <ScheduleModal 
          isOpen={isScheduleModalOpen}
          onClose={() => setIsScheduleModalOpen(false)}
        />
      )}

      {isSupabaseModalOpen && (
        <SupabaseConfigModal 
          isOpen={isSupabaseModalOpen}
          onClose={() => setIsSupabaseModalOpen(false)}
        />
      )}

    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <DataProvider>
        <MainLayout />
      </DataProvider>
    </AuthProvider>
  );
}
