import React from 'react';
import { BarChart3, LogOut, Settings, User } from 'lucide-react';
import { authUtils } from '../../utils/auth';

interface HeaderProps {
  currentPage: string;
  onNavigate: (page: string) => void;
  onLogout: () => void;
}

const Header: React.FC<HeaderProps> = ({ currentPage, onNavigate, onLogout }) => {
  const user = authUtils.getUser();
  
  return (
    <header className="bg-gradient-to-r from-indigo-600 to-purple-600 shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          <div className="flex items-center space-x-8">
            <div className="flex items-center space-x-3">
              <BarChart3 className="h-8 w-8 text-white" />
              <h1 className="text-2xl font-bold text-white tracking-tight">Charts.AI</h1>
            </div>
            
            <nav className="hidden md:flex space-x-6">
              <button
                onClick={() => onNavigate('dashboard')}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                  currentPage === 'dashboard'
                    ? 'text-white bg-white/20 shadow-inner'
                    : 'text-white/80 hover:text-white hover:bg-white/10'
                }`}
              >
                Dashboard
              </button>
              <button
                onClick={() => onNavigate('analytics')}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                  currentPage === 'analytics'
                    ? 'text-white bg-white/20 shadow-inner'
                    : 'text-white/80 hover:text-white hover:bg-white/10'
                }`}
              >
                Analytics
              </button>
              <button
                onClick={() => onNavigate('history')}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                  currentPage === 'history'
                    ? 'text-white bg-white/20 shadow-inner'
                    : 'text-white/80 hover:text-white hover:bg-white/10'
                }`}
              >
                History
              </button>
              {user?.role === 'admin' && (
                <button
                  onClick={() => onNavigate('admin')}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                    currentPage === 'admin'
                      ? 'text-white bg-white/20 shadow-inner'
                      : 'text-white/80 hover:text-white hover:bg-white/10'
                  }`}
                >
                  Admin
                </button>
              )}
            </nav>
          </div>
          
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-3 bg-white/10 px-4 py-2 rounded-lg">
              <User className="h-5 w-5 text-white/80" />
              <span className="text-sm text-white">{user?.name}</span>
            </div>
            
            <div className="flex items-center space-x-2">
              <button
                onClick={() => onNavigate('settings')}
                className="p-2 text-white/80 hover:text-white hover:bg-white/10 rounded-lg transition-all duration-200"
                aria-label="Settings"
              >
                <Settings className="h-5 w-5" />
              </button>
              <button
                onClick={onLogout}
                className="p-2 text-white/80 hover:text-white hover:bg-red-400/20 rounded-lg transition-all duration-200"
                aria-label="Logout"
              >
                <LogOut className="h-5 w-5" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
