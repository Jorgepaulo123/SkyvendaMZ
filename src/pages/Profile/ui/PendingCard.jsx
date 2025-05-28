import React, { useContext } from 'react';
import { Clock, AlertCircle, Shield, HourglassIcon, User } from 'lucide-react';
import BlueSparkLogo from '../../../components/svg/bluesparkmz';
import { AuthContext } from '../../../context/AuthContext';

export function PendingCard() {
  const { user } = useContext(AuthContext);
  
  // Usar o ID único real da API ou um valor padrão
  const skId = user?.id_unico || 'sk-206680973';
  
  // Tipo de usuário (pode ser obtido do contexto de autenticação)
  const userType = user?.tipo || 'Loja';
  
  return (
    <div className="w-full">
      <div className="bg-gradient-to-br from-amber-50 to-orange-50 rounded-lg p-5 shadow-lg border border-amber-100 relative overflow-hidden">
        {/* Marca d'água do logo e texto no fundo */}
        <div className="absolute inset-0 flex items-center justify-center overflow-hidden">
          {/* Logo como marca d'água */}
          <div className="absolute -right-10 -bottom-10 opacity-10">
            <svg width="200" height="200" viewBox="0 0 120 40">
              <path d="M 57.807 23.71 L 52.881 23.71 L 61.889 10.368 L 59.463 19.604 L 64.39 19.604 L 55.385 32.945 L 57.807 23.71 Z" fill="#F59E0B"/>
            </svg>
          </div>
          
          {/* Texto SkyVenda MZ como marca d'água */}
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <p className="text-5xl font-bold text-amber-200 opacity-25 transform -rotate-12 select-none">
              SkyVenda MZ
            </p>
          </div>
        </div>
        
        {/* Cabeçalho com logo e título */}
        <div className="flex items-center justify-between mb-4 border-b border-amber-100 pb-3">
          <div className="flex items-center">
            <div className="text-amber-600 font-bold text-lg">
              <span className="text-amber-600">Sky</span>
              <span className="text-gray-700">Venda</span>
              <span className="text-amber-600 text-xs ml-1">MZ</span>
            </div>
          </div>
          <div className="flex items-center">
            <div className="bg-amber-100 p-1 rounded-full">
              <Shield className="w-4 h-4 text-amber-600" />
            </div>
            <span className="text-xs font-medium text-amber-600 ml-1">Pendente</span>
          </div>
        </div>
        
        {/* Certificado de Identidade */}
        <div className="bg-white rounded-lg p-4 mb-4 border border-amber-50 shadow-sm">
          <div className="flex justify-between items-start">
            <div>
              <h2 className="text-xl font-bold text-gray-800 flex items-center">
                {user?.nome || 'Jorge'}
              </h2>
              <div className="mt-1 space-y-1">
                <p className="text-xs text-gray-500 flex items-center">
                  <span className="font-medium text-gray-700 mr-2">SK ID:</span> 
                  <span className="font-mono">{skId}</span>
                </p>
                <p className="text-xs text-gray-500 flex items-center">
                  <span className="font-medium text-gray-700 mr-2">Tipo:</span> 
                  <span className="bg-amber-50 text-amber-700 px-2 py-0.5 rounded-full text-xs">{userType}</span>
                </p>
              </div>
            </div>
            
            {/* Selo de Verificação Pendente */}
            <div className="relative">
              <div className="w-16 h-16 relative">
                <div className="absolute inset-0 bg-gradient-to-br from-amber-400 to-amber-600 rounded-full opacity-10 animate-pulse"></div>
                <div className="absolute inset-2 bg-white rounded-full flex items-center justify-center">
                  <Clock className="w-8 h-8 text-amber-500" />
                </div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Informações de Tempo */}
        <div className="bg-white rounded-lg p-3 shadow-sm border border-amber-100 mb-4">
          <div className="flex items-center space-x-2 text-amber-600">
            <AlertCircle className="w-5 h-5" />
            <p className="text-sm">Tempo estimado de revisão: 24-48h</p>
          </div>
          <div className="mt-2 w-full bg-gray-100 rounded-full h-1.5">
            <div className="bg-amber-500 h-1.5 rounded-full w-1/3 animate-pulse"></div>
          </div>
          <p className="text-xs text-gray-600 mt-2">
            Você receberá uma notificação assim que a verificação for concluída.
          </p>
        </div>
        
        {/* Grid de ícones de funcionalidades */}
        <div className="grid grid-cols-3 gap-2 mb-4">
          <div className="bg-amber-50 p-2 rounded-lg flex flex-col items-center opacity-60">
            <Clock className="w-4 h-4 text-amber-600 mb-1" />
            <p className="text-xs font-medium text-amber-700">Aguardando</p>
          </div>
          <div className="bg-amber-50 p-2 rounded-lg flex flex-col items-center opacity-60">
            <AlertCircle className="w-4 h-4 text-amber-600 mb-1" />
            <p className="text-xs font-medium text-amber-700">Pendente</p>
          </div>
          <div className="bg-amber-50 p-2 rounded-lg flex flex-col items-center opacity-60">
            <User className="w-4 h-4 text-amber-600 mb-1" />
            <p className="text-xs font-medium text-amber-700">Perfil</p>
          </div>
        </div>
        
        {/* Rodapé com logo da BlueSpark */}
        <div className="mt-4 pt-3 border-t border-amber-100 flex justify-end">
          <div className="w-24">
            <BlueSparkLogo />
          </div>
        </div>
      </div>
    </div>
  );
}