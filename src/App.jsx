import React, { useState } from 'react';
import { AuthProvider } from './context/AuthContext';
import { DataProvider, useData } from './context/DataContext';
import { Header } from './components/layout/Header';
import { Sidebar } from './components/layout/Sidebar';
import { DashboardView } from './components/dashboard/DashboardView';
import { AssetsView } from './components/assets/AssetsView';
import { AssetFormModal } from './components/assets/AssetFormModal';
import { AssetDetailModal } from './components/assets/AssetDetailModal';
import { AssetScannerModal } from './components/assets/AssetScannerModal';
import { MaintenanceView } from './components/maintenance/MaintenanceView';
import { MaintenanceWizardModal } from './components/maintenance/MaintenanceWizardModal';
import { ScheduleView } from './components/schedule/ScheduleView';
import { ScheduleModal } from './components/schedule/ScheduleModal';
import { ReportsView } from './components/reports/ReportsView';
import { SettingsView } from './components/settings/SettingsView';
import { SupabaseConfigModal } from './components/settings/SupabaseConfigModal';
import { CommandPalette } from './components/common/CommandPalette';
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
  const [isCommandPaletteOpen, setIsCommandPaletteOpen] = useState(false);
  const [isScannerOpen, setIsScannerOpen] = useState(false);
  const [detailAsset, setDetailAsset] = useState(null);

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
    <div className="min-h-screen bg-[#fafafa] flex flex-col lg:flex-row text-zinc-900 selection:bg-zinc-200">
      
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
      <div className="flex-1 lg:pl-64 flex flex-col min-w-0">
        
        {/* Header Superior */}
        <Header 
          currentView={tabTitles[currentTab] || 'EMTELCO CMMS'}
          onOpenMobileMenu={() => setMobileSidebarOpen(true)}
          onOpenSupabaseModal={() => setIsSupabaseModalOpen(true)}
          onOpenCommandPalette={() => setIsCommandPaletteOpen(true)}
          onOpenScannerModal={() => setIsScannerOpen(true)}
        />

        {/* Notificación Toast Flotante Minimalista */}
        {notification && (
          <div className="fixed bottom-5 right-5 z-50 animate-in slide-in-from-bottom-3 fade-in duration-200">
            <div className={`px-3.5 py-2.5 rounded-lg shadow-xl flex items-center gap-2.5 border text-xs ${
              notification.type === 'success' ? 'bg-zinc-900 text-white border-zinc-700' :
              notification.type === 'info' ? 'bg-zinc-900 text-white border-zinc-700' :
              'bg-zinc-900 text-white border-rose-600'
            }`}>
              {notification.type === 'success' ? <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" /> :
               notification.type === 'info' ? <Info className="w-4 h-4 text-blue-400 shrink-0" /> :
               <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />}
              <span className="font-medium text-zinc-100">{notification.message}</span>
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

        {/* Footer Minimalista */}
        <footer className="py-4 px-8 border-t border-zinc-200/70 text-center text-[11px] text-zinc-400 bg-white/50 flex flex-col sm:flex-row items-center justify-between gap-2 max-w-7xl mx-auto w-full">
          <span>EMTELCO CMMS &bull; Gestión Preventiva TICS 2026</span>
          <span className="font-mono text-zinc-400 text-[10px]">CUN Ingeniería de Sistemas &bull; Trabajo de Grado</span>
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

      {isCommandPaletteOpen && (
        <CommandPalette
          isOpen={isCommandPaletteOpen}
          onClose={setIsCommandPaletteOpen}
          onNavigate={(tab) => setCurrentTab(tab)}
          onOpenNewMaintenance={() => {
            setPreselectedAsset(null);
            setPreselectedProg(null);
            setIsMaintenanceWizardOpen(true);
          }}
          onOpenNewAsset={() => setIsAssetModalOpen(true)}
          onOpenAssetDetail={(asset) => setDetailAsset(asset)}
        />
      )}

      {isScannerOpen && (
        <AssetScannerModal
          isOpen={isScannerOpen}
          onClose={() => setIsScannerOpen(false)}
          onSelectAssetForMaintenance={(asset) => handleExecuteMaintenance(asset)}
          onSelectAssetForDetail={(asset) => setDetailAsset(asset)}
        />
      )}

      {detailAsset && (
        <AssetDetailModal
          isOpen={Boolean(detailAsset)}
          onClose={() => setDetailAsset(null)}
          asset={detailAsset}
          onExecuteMaintenance={handleExecuteMaintenance}
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
