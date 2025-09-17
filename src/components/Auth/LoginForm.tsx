import React, { useState } from 'react';
import { BarChart3, Eye, EyeOff, Mail, Lock } from 'lucide-react';

interface LoginFormProps {
  onLogin: (email: string, password: string) => void;
  onToggleMode: () => void;
  loading: boolean;
  error: string;
}

export const LoginForm: React.FC<LoginFormProps> = ({ onLogin, onToggleMode, loading, error }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [asAdmin, setAsAdmin] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
  // For demo: allow toggling admin mode
  const loginEmail = asAdmin ? `admin+${email}` : email;
  onLogin(loginEmail, password);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 flex items-center justify-center p-4 animate-gradient-x">
      <div className="max-w-md w-full animate-fade-in">
        <div className="bg-gray-800/50 backdrop-blur-lg rounded-2xl shadow-2xl p-8 border border-gray-700/50 
          hover:border-gray-600/50 transition-all duration-500 hover:shadow-indigo-500/10">
          <div className="text-center mb-8">
            <div className="flex items-center justify-center space-x-3 mb-6 animate-slide-down">
              <div className="p-3 bg-indigo-500/10 rounded-xl group transition-all duration-300 hover:bg-indigo-500/20">
                <BarChart3 className="h-10 w-10 text-indigo-400 group-hover:text-indigo-300 transition-colors animate-pulse" />
              </div>
              <h1 className="text-3xl font-bold text-white tracking-tight">
                <span className="bg-gradient-to-r from-indigo-400 to-purple-400 text-transparent bg-clip-text">
                  Charts.AI
                </span>
              </h1>
            </div>
            <p className="text-indigo-300/90 text-lg animate-fade-in-up">Welcome</p>
            <p className="text-gray-400 text-sm mt-1 animate-fade-in-up delay-100">Sign in to your account</p>
          </div>

          {error && (
            <div className="mb-6 p-4 bg-red-500/10 border border-red-500/20 rounded-xl backdrop-blur-sm animate-shake">
              <p className="text-red-400 text-sm">{error}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="flex items-center justify-center space-x-3 text-sm">
              <label className="inline-flex items-center space-x-2 text-gray-300">
                <input type="checkbox" checked={asAdmin} onChange={(e) => setAsAdmin(e.target.checked)} className="rounded text-indigo-500" />
                <span>Login as ADMIN</span>
              </label>
            </div>
            <div className="animate-fade-in-up delay-200">
              <label htmlFor="email" className="block text-sm font-medium text-gray-300 mb-2">
                Email Address
              </label>
              <div className="relative group">
                <div className="absolute inset-0 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-lg blur opacity-10 
                  group-hover:opacity-20 transition-opacity duration-500"></div>
                <div className="relative bg-gray-900/50 rounded-lg">
                  <Mail className="absolute left-3 top-3 h-5 w-5 text-gray-400 group-hover:text-indigo-400 transition-colors duration-300" />
                  <input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="block w-full pl-10 pr-4 py-3 bg-transparent border border-gray-700 rounded-lg 
                      text-gray-100 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 
                      focus:border-transparent transition-all duration-300 hover:border-gray-600"
                    placeholder="Enter your email"
                    required
                  />
                </div>
              </div>
            </div>

            <div className="animate-fade-in-up delay-300">
              <label htmlFor="password" className="block text-sm font-medium text-gray-300 mb-2">
                Password
              </label>
              <div className="relative group">
                <div className="absolute inset-0 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-lg blur opacity-10 
                  group-hover:opacity-20 transition-opacity duration-500"></div>
                <div className="relative bg-gray-900/50 rounded-lg">
                  <Lock className="absolute left-3 top-3 h-5 w-5 text-gray-400 group-hover:text-indigo-400 transition-colors duration-300" />
                  <input
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="block w-full pl-10 pr-12 py-3 bg-transparent border border-gray-700 rounded-lg 
                      text-gray-100 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 
                      focus:border-transparent transition-all duration-300 hover:border-gray-600"
                    placeholder="Enter your password"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-3 text-gray-400 hover:text-indigo-400 transition-colors duration-300"
                  >
                    {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                  </button>
                </div>
              </div>
            </div>

            <div className="animate-fade-in-up delay-400">
              <button
                type="submit"
                disabled={loading}
                className="relative w-full group overflow-hidden rounded-lg p-0.5 transition-all duration-300 hover:scale-[1.02]"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-indigo-500 to-purple-500 group-hover:from-indigo-400 
                  group-hover:to-purple-400 transition-all duration-500"></div>
                <div className="relative bg-gray-900 text-gray-100 py-3 px-4 rounded-md font-medium group-hover:bg-transparent 
                  transition-all duration-300 group-hover:text-white"
                >
                  <span className="relative z-10 flex items-center justify-center">
                    {loading ? (
                      <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                    ) : null}
                    {loading ? 'Signing in...' : 'Sign In'}
                  </span>
                </div>
              </button>
            </div>

            <div className="mt-8 text-center animate-fade-in-up delay-500">
              <p className="text-gray-400">
                Don't have an account?{' '}
                <button
                  onClick={onToggleMode}
                  className="text-indigo-400 hover:text-indigo-300 font-medium relative group"
                >
                  <span>Sign up</span>
                  <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-indigo-400 group-hover:w-full transition-all duration-300"></span>
                </button>
              </p>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};