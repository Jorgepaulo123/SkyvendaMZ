import React, { useContext, useEffect, useState } from 'react';
import { CheckCircle, Shield, Award, User, Store, ShoppingBag, CreditCard, Clock, Star } from 'lucide-react';
import BlueSparkLogo from '../../../components/svg/bluesparkmz';
import { AuthContext } from '../../../context/AuthContext';

export function VerifiedCard() {
  const { user, token } = useContext(AuthContext);
  const [stats, setStats] = useState({
    total_vendas: 0,
    total_compras: 0,
    media_estrelas: 0,
    total_avaliacoes: 0
  });
  
  // Buscar estatísticas do usuário da API
  useEffect(() => {
    if (token) {
      fetch('https://skyvendas-production.up.railway.app/usuario/estatisticas', {
        headers: {
          'accept': 'application/json',
          'Authorization': `Bearer ${token}`
        }
      })
      .then(response => response.json())
      .then(data => {
        if (data && data.estatisticas) {
          setStats(data.estatisticas);
        }
      })
      .catch(error => console.error('Erro ao buscar estatísticas:', error));
    }
  }, [token]);
  
  // Usar o ID único real da API ou um valor padrão
  const skId = user?.id_unico || 'sk-206680973';
  
  // Tipo de usuário (pode ser obtido do contexto de autenticação)
  const userType = user?.tipo || 'nhonguista';
  
  return (
    <div className="w-full">
      <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-lg p-5 shadow-lg border border-indigo-100 relative overflow-hidden">
        {/* Marca d'água do logo e texto no fundo */}
        <div className="absolute inset-0 flex items-center justify-center overflow-hidden">
          {/* Logo como marca d'água */}
          <div className="absolute -right-10 -bottom-10 opacity-10">
            <svg width="200" height="200" viewBox="0 0 120 40">
              <path d="M 57.807 23.71 L 52.881 23.71 L 61.889 10.368 L 59.463 19.604 L 64.39 19.604 L 55.385 32.945 L 57.807 23.71 Z" fill="#516DFF"/>
            </svg>
          </div>
          
          {/* Texto SkyVenda MZ como marca d'água */}
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <p className="text-5xl font-bold text-indigo-200 opacity-25 transform -rotate-12 select-none">
              SkyVenda MZ
            </p>
          </div>
        </div>
        
        {/* Cabeçalho com logo e título */}
        <div className="flex items-center justify-between mb-4 border-b border-indigo-100 pb-3">
          <div className="flex items-center">
            <div className="text-indigo-600 font-bold text-lg">
              <span className="text-indigo-600">Sky</span>
              <span className="text-gray-700">Venda</span>
              <span className="text-indigo-600 text-xs ml-1">MZ</span>
            </div>
          </div>
          <div className="flex items-center">
            <div className="bg-indigo-100 p-1 rounded-full">
              <Shield className="w-4 h-4 text-indigo-600" />
            </div>
            <span className="text-xs font-medium text-indigo-600 ml-1">Verificado</span>
          </div>
        </div>
        
        {/* Certificado de Identidade */}
        <div className="bg-white rounded-lg p-4 mb-4 border border-indigo-50 shadow-sm">
          <div className="flex justify-between items-start">
            <div>
              <h2 className="text-xl font-bold text-gray-800 flex items-center">
                {user?.nome || 'Jorge'}
                <Award className="w-5 h-5 text-amber-500 ml-2" />
              </h2>
              <div className="mt-1 space-y-1">
                <p className="text-xs text-gray-500 flex items-center">
                  <span className="font-medium text-gray-700 mr-2">SK ID:</span> 
                  <span className="font-mono">{skId}</span>
                </p>
                <p className="text-xs text-gray-500 flex items-center">
                  <span className="font-medium text-gray-700 mr-2">Tipo:</span> 
                  <span className="bg-indigo-50 text-indigo-700 px-2 py-0.5 rounded-full text-xs">{userType}</span>
                </p>
              </div>
            </div>
            
            {/* Selo de Verificação */}
            <div className="relative">
              <div className="w-16 h-16 relative">
                <div className="absolute inset-0 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full opacity-10 animate-pulse"></div>
                <div className="absolute inset-2 bg-white rounded-full flex items-center justify-center">
                  <CheckCircle className="w-8 h-8 text-indigo-600" />
                </div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Opções de Loja */}
        <div className="grid grid-cols-2 gap-3 mb-4">
          <div className="bg-white p-3 rounded-lg shadow-sm hover:shadow transition-shadow">
            <div className="flex items-center">
              <Store className="w-5 h-5 text-indigo-500 mr-2" />
              <h3 className="font-semibold text-gray-800 text-sm">Loja Virtual</h3>
            </div>
            <p className="text-xs text-gray-600 mt-1">Gerencie seus produtos</p>
          </div>
          <div className="bg-white p-3 rounded-lg shadow-sm hover:shadow transition-shadow">
            <div className="flex items-center">
              <ShoppingBag className="w-5 h-5 text-indigo-500 mr-2" />
              <h3 className="font-semibold text-gray-800 text-sm">Marketplace</h3>
            </div>
            <p className="text-xs text-gray-600 mt-1">Compre e venda</p>
          </div>
        </div>

        {/* Estatísticas do usuário */}
        <div className="grid grid-cols-4 gap-2 mb-4">
          <div className="bg-indigo-50 p-2 rounded-lg flex flex-col items-center">
            <Store className="w-4 h-4 text-indigo-600 mb-1" />
            <p className="text-xs font-medium text-indigo-700">Vendas</p>
            <p className="text-lg font-bold text-indigo-800">{stats.total_vendas}</p>
          </div>
          <div className="bg-indigo-50 p-2 rounded-lg flex flex-col items-center">
            <ShoppingBag className="w-4 h-4 text-indigo-600 mb-1" />
            <p className="text-xs font-medium text-indigo-700">Compras</p>
            <p className="text-lg font-bold text-indigo-800">{stats.total_compras}</p>
          </div>
          <div className="bg-indigo-50 p-2 rounded-lg flex flex-col items-center">
            <Star className="w-4 h-4 text-amber-500 mb-1" />
            <p className="text-xs font-medium text-indigo-700">Estrelas</p>
            <p className="text-lg font-bold text-indigo-800">{stats.media_estrelas}</p>
          </div>
          <div className="bg-indigo-50 p-2 rounded-lg flex flex-col items-center">
            <User className="w-4 h-4 text-indigo-600 mb-1" />
            <p className="text-xs font-medium text-indigo-700">Avaliações</p>
            <p className="text-lg font-bold text-indigo-800">{stats.total_avaliacoes}</p>
          </div>
        </div>
        
        {/* Rodapé com logo da BlueSpark */}
        <div className="mt-4 pt-3 border-t border-indigo-100 flex justify-end">
          <div className="w-24">
            <BlueSparkLogo />
          </div>
        </div>
      </div>
    </div>
  );
}