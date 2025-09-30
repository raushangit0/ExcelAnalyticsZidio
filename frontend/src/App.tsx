import { useState } from 'react';
import { LoginForm } from './components/Auth/LoginForm';
import { RegisterForm } from './components/Auth/RegisterForm';
import Header from './components/Layout/Header';
import { Dashboard } from './components/Dashboard/Dashboard';
import { AnalyticsWorkspace } from './components/Analytics/AnalyticsWorkspace';
import { HistoryTable } from './components/History/HistoryTable';
import AdminPanel from './components/Admin/AdminPanel';
import { useAuth } from './hooks/useAuth';
import { AnalysisHistory } from './types';

function App() {
  const { user, loading, login, register, logout, isAuthenticated } = useAuth();
  const [authMode, setAuthMode] = useState<'login' | 'register'>('login');
  const [currentPage, setCurrentPage] = useState(() => 'dashboard');
  const [authError, setAuthError] = useState('');

  // Mock history data
  //check
  const mockHistory: AnalysisHistory[] = [
    {
      id: '1',
      fileName: 'sales_data_2024.xlsx',
      chartType: 'bar',
      xAxis: 'Month',
      yAxis: 'Revenue',
      createdAt: new Date(Date.now() - 24 * 60 * 60 * 1000),
      downloadCount: 3,
    },
    {
      id: '2',
      fileName: 'customer_analytics.xlsx',
      chartType: 'line',
      xAxis: 'Date',
      yAxis: 'Active Users',
      createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
      downloadCount: 1,
    },
  ];

  const handleAuth = async (emailOrName: string, emailOrPassword: string, password?: string) => {
    try {
      setAuthError('');
      if (authMode === 'login') {
        await login(emailOrName, emailOrPassword);
      } else {
        await register(emailOrName, emailOrPassword, password!);
      }
    } catch (error) {
      setAuthError(error instanceof Error ? error.message : 'Authentication failed');
    }
  };

  const handleHistoryAction = (action: 'view' | 'download' | 'delete', id: string) => {
    console.log(`${action} history item:`, id);
    // In a real app, these would be API calls
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return authMode === 'login' ? (
      <LoginForm
        onLogin={(email, password) => handleAuth(email, password)}
        onToggleMode={() => setAuthMode('register')}
        loading={loading}
        error={authError}
      />
    ) : (
      <RegisterForm
        onRegister={(name, email, password) => handleAuth(name, email, password)}
        onToggleMode={() => setAuthMode('login')}
        loading={loading}
        error={authError}
      />
    );
  }

  // If logged in and user is admin, default to admin page
  if (user?.role === 'admin' && currentPage !== 'admin') {
    setCurrentPage('admin');
  }

  const renderPage = () => {
    switch (currentPage) {
      case 'dashboard':
        return <Dashboard />;
      case 'analytics':
        return <AnalyticsWorkspace />;
      case 'history':
        return (
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="mb-8">
              <h1 className="text-3xl font-bold text-gray-900 mb-2">Analysis History</h1>
              <p className="text-gray-600">View and manage your previous analysis sessions</p>
            </div>
            <HistoryTable
              histories={mockHistory}
              onView={(id) => handleHistoryAction('view', id)}
              onDownload={(id) => handleHistoryAction('download', id)}
              onDelete={(id) => handleHistoryAction('delete', id)}
            />
          </div>
        );
      case 'admin':
        return user?.role === 'admin' ? <AdminPanel /> : <Dashboard />;
      case 'settings':
        return (
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h1 className="text-3xl font-bold text-gray-900 mb-2">Settings</h1>
              <p className="text-gray-600">User settings panel coming soon...</p>
            </div>
          </div>
        );
      default:
        return <Dashboard />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header
        currentPage={currentPage}
        onNavigate={setCurrentPage}
        onLogout={logout}
      />
      {renderPage()}
    </div>
  );
}

export default App;