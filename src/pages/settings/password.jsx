import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Lock, Eye, EyeOff, AlertTriangle, CheckCircle, Info } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import axios from 'axios';
import { toast } from 'react-hot-toast';

export default function PasswordSettings() {
  const navigate = useNavigate();
  const { token } = useAuth();
  const [loading, setLoading] = useState(false);
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  const handleUpdatePassword = async (e) => {
    e.preventDefault();
    
    // Reset states
    setError(null);
    setSuccess(false);
    
    // Validate passwords
    if (newPassword !== confirmPassword) {
      setError('As senhas não correspondem');
      toast.error('As senhas não correspondem');
      return;
    }

    if (newPassword.length < 6) {
      setError('A senha deve ter pelo menos 6 caracteres');
      toast.error('A senha deve ter pelo menos 6 caracteres');
      return;
    }

    try {
      setLoading(true);
      
      // Use the endpoint provided
      const response = await axios.put(
        `https://skyvendamz-1.onrender.com/usuario/atualizar_senha/?senha_atual=${encodeURIComponent(currentPassword)}&nova_senha=${encodeURIComponent(newPassword)}`,
        {},  // Empty body as parameters are in URL
        {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        }
      );
      
      // Handle success
      setSuccess(true);
      toast.success('Senha atualizada com sucesso');
      
      // Clear form
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
      
    } catch (error) {
      console.error('Erro ao atualizar senha:', error);
      
      // Handle specific error messages
      if (error.response) {
        if (error.response.status === 401) {
          setError('Senha atual incorreta');
          toast.error('Senha atual incorreta');
        } else {
          setError(error.response.data?.detail || 'Erro ao atualizar senha');
          toast.error(error.response.data?.detail || 'Erro ao atualizar senha');
        }
      } else {
        setError('Erro de conexão. Tente novamente mais tarde.');
        toast.error('Erro de conexão. Tente novamente mais tarde.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full h-full p-6">
      {/* Header with back button */}
      <div className="flex items-center gap-2 mb-6">
        <button 
          onClick={() => navigate(-1)} 
          className="p-2 text-gray-700 hover:bg-gray-100 rounded-full"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </button>
        <h1 className="text-2xl font-bold text-gray-800">Alterar Senha</h1>
      </div>

      <div className="space-y-8">
        {/* Password Change Form */}
        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
          <div className="mb-6">
            <h2 className="text-xl font-semibold text-gray-800">Alterar Senha</h2>
            <p className="text-gray-500 mt-1">Atualize sua senha para manter sua conta segura</p>
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6 flex items-start">
              <AlertTriangle className="w-5 h-5 text-red-500 mt-0.5 mr-3 flex-shrink-0" />
              <div>
                <h3 className="font-medium text-red-800">Erro</h3>
                <p className="text-red-700 text-sm mt-1">{error}</p>
              </div>
            </div>
          )}

          {success && (
            <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6 flex items-start">
              <CheckCircle className="w-5 h-5 text-green-500 mt-0.5 mr-3 flex-shrink-0" />
              <div>
                <h3 className="font-medium text-green-800">Sucesso</h3>
                <p className="text-green-700 text-sm mt-1">Sua senha foi atualizada com sucesso.</p>
              </div>
            </div>
          )}

          <form onSubmit={handleUpdatePassword} className="space-y-4">
            <div className="relative">
              <input
                type={showCurrentPassword ? 'text' : 'password'}
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                placeholder="Senha atual"
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 pl-10"
                required
              />
              <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
              <button
                type="button"
                onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400"
              >
                {showCurrentPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
              </button>
            </div>

            <div className="relative">
              <input
                type={showNewPassword ? 'text' : 'password'}
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="Nova senha"
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 pl-10"
                required
              />
              <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
              <button
                type="button"
                onClick={() => setShowNewPassword(!showNewPassword)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400"
              >
                {showNewPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
              </button>
            </div>

            <div className="relative">
              <input
                type={showConfirmPassword ? 'text' : 'password'}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Confirmar nova senha"
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 pl-10"
                required
              />
              <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400"
              >
                {showConfirmPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
              </button>
            </div>

            <button
              type="submit"
              className="w-full px-4 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
              disabled={loading}
            >
              {loading ? "Atualizando..." : "Atualizar Senha"}
            </button>
          </form>

          <div className="mt-6 p-4 bg-blue-50 border border-blue-100 rounded-lg flex items-start">
            <Info className="w-5 h-5 text-blue-500 mt-0.5 mr-3 flex-shrink-0" />
            <div>
              <h3 className="font-medium text-blue-800">Dicas de segurança</h3>
              <ul className="text-blue-700 text-sm mt-1 list-disc list-inside space-y-1">
                <li>Use uma senha forte com pelo menos 8 caracteres</li>
                <li>Combine letras maiúsculas, minúsculas, números e símbolos</li>
                <li>Evite usar informações pessoais como datas ou nomes</li>
                <li>Não use a mesma senha em vários sites</li>
                <li>Troque sua senha regularmente para maior segurança</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
