import { lazy, Suspense } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Header } from './components/layout/Header';
import { Footer } from './components/layout/Footer';
import { SkipLink } from './components/layout/SkipLink';
import { ToastContainer } from './components/common/Toast';
import { ErrorBoundary } from './components/common/ErrorBoundary';
import { LoadingState } from './components/common/LoadingState';
import { useLifeData } from './hooks/useLifeData';
import { useToast } from './hooks/useToast';
import { useTheme } from './hooks/useTheme';
import { useLanguage } from './hooks/useLanguage';
import { ROUTES } from './constants';

// Critical initial pages loaded immediately
import { LandingPage } from './pages/Landing';
import { DashboardPage } from './pages/Dashboard';
import { AddEntryPage } from './pages/AddEntry';

// Code-split secondary pages for optimal bundle size & Core Web Vitals (LCP/INP)
const ReceiptPage = lazy(() => import('./pages/ReceiptPage').then(m => ({ default: m.ReceiptPage })));
const ActivitiesPage = lazy(() => import('./pages/ActivitiesPage').then(m => ({ default: m.ActivitiesPage })));
const ExpensesPage = lazy(() => import('./pages/ExpensesPage').then(m => ({ default: m.ExpensesPage })));
const GoalsPage = lazy(() => import('./pages/GoalsPage').then(m => ({ default: m.GoalsPage })));
const AnalyticsPage = lazy(() => import('./pages/AnalyticsPage').then(m => ({ default: m.AnalyticsPage })));
const InsightsPage = lazy(() => import('./pages/InsightsPage').then(m => ({ default: m.InsightsPage })));
const ProfilePage = lazy(() => import('./pages/ProfilePage').then(m => ({ default: m.ProfilePage })));
const ECellPage = lazy(() => import('./pages/ECellPage').then(m => ({ default: m.ECellPage })));
const NotFoundPage = lazy(() => import('./pages/NotFoundPage').then(m => ({ default: m.NotFoundPage })));

export function App() {
  const lifeData = useLifeData();
  const { toasts, addToast, removeToast } = useToast();
  const { theme, setTheme, currentConfig } = useTheme();
  const { language, setLanguage, t } = useLanguage();

  const handleShowToast = (title: string, message?: string, type: 'success' | 'error' | 'info' | 'warning' = 'success') => {
    addToast({ title, message, type });
  };

  return (
    <BrowserRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
      <div className="min-h-screen flex flex-col bg-neutral-950 text-neutral-100 selection:bg-amber-500 selection:text-neutral-950">
        <SkipLink />
        <Header
          currentTheme={theme}
          onSelectTheme={setTheme}
          currentLanguage={language}
          onSelectLanguage={setLanguage}
          t={t}
        />

        <ErrorBoundary fallbackTitle="Application Error Encountered" fallbackMessage="An error occurred inside the view router. You can reset state or navigate back safely.">
          <Suspense fallback={<LoadingState message="Loading ledger view..." minHeight="min-h-[500px]" />}>
            <Routes>
              <Route path={ROUTES.HOME} element={<DashboardPage lifeData={lifeData} t={t} />} />
              <Route path={ROUTES.DASHBOARD} element={<DashboardPage lifeData={lifeData} t={t} />} />
              <Route path={ROUTES.LANDING} element={<LandingPage themeConfig={currentConfig} language={language} />} />
              <Route path={ROUTES.ECELL} element={<ECellPage onShowToast={handleShowToast} />} />
              <Route path={ROUTES.ADD} element={<AddEntryPage lifeData={lifeData} onShowToast={handleShowToast} />} />
              <Route
                path={ROUTES.RECEIPT}
                element={
                  <ReceiptPage
                    lifeData={lifeData}
                    onShowToast={handleShowToast}
                    themeConfig={currentConfig}
                    currentTheme={theme}
                    onSelectTheme={setTheme}
                    currentLanguage={language}
                    onSelectLanguage={setLanguage}
                  />
                }
              />
              <Route path={ROUTES.ACTIVITIES} element={<ActivitiesPage lifeData={lifeData} onShowToast={handleShowToast} />} />
              <Route path={ROUTES.EXPENSES} element={<ExpensesPage lifeData={lifeData} onShowToast={handleShowToast} />} />
              <Route path={ROUTES.GOALS} element={<GoalsPage lifeData={lifeData} onShowToast={handleShowToast} />} />
              <Route path={ROUTES.ANALYTICS} element={<AnalyticsPage lifeData={lifeData} />} />
              <Route path={ROUTES.INSIGHTS} element={<InsightsPage lifeData={lifeData} />} />
              <Route
                path={ROUTES.PROFILE}
                element={
                  <ProfilePage
                    lifeData={lifeData}
                    onShowToast={handleShowToast}
                    currentTheme={theme}
                    onSelectTheme={setTheme}
                    currentLanguage={language}
                    onSelectLanguage={setLanguage}
                  />
                }
              />
              <Route path="*" element={<NotFoundPage />} />
            </Routes>
          </Suspense>
        </ErrorBoundary>

        <Footer />
        <ToastContainer toasts={toasts} onDismiss={removeToast} />
      </div>
    </BrowserRouter>
  );
}

export default App;
