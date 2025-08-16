import React, { useContext, useState } from 'react';
import { XCircle, Shield, User, AlertTriangle, RefreshCw } from 'lucide-react';
import BlueSparkLogo from '../../../components/svg/bluesparkmz';
import { AuthContext } from '../../../context/AuthContext';
import ResubmitVerificationModal from './ResubmitVerificationModal';

export function RejectedCard() {
  const { user } = useContext(AuthContext);
  const [openModal, setOpenModal] = useState(false);
  
  // Usar o ID único real da API ou um valor padrão
  const skId = user?.id_unico || 'sk-206680973';
  
  // Tipo de usuário (pode ser obtido do contexto de autenticação)
  const userType = user?.tipo || 'nhonguista';
  
  // Abrir modal de reenvio
  const handleResubmit = () => setOpenModal(true);
  
  return (
    <div className="w-full">
      <div className="bg-gradient-to-br from-red-50 to-pink-50 rounded-lg p-5 shadow-lg border border-red-100 relative overflow-hidden">
        {/* Marca d'água do logo e texto no fundo */}
        <div className="absolute inset-0 flex items-center justify-center overflow-hidden pointer-events-none">
          {/* Logo como marca d'água */}
          <div className="absolute -right-10 -bottom-10 opacity-10">
            <svg width="200" height="200" viewBox="0 0 120 40">
              <path d="M 57.807 23.71 L 52.881 23.71 L 61.889 10.368 L 59.463 19.604 L 64.39 19.604 L 55.385 32.945 L 57.807 23.71 Z" fill="#EF4444"/>
            </svg>
          </div>
          
          {/* Texto SkyVenda MZ como marca d'água */}
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <p className="text-5xl font-bold text-red-200 opacity-25 transform -rotate-12 select-none">
              SkyVenda MZ
            </p>
          </div>
        </div>
        
        {/* Cabeçalho com logo e título */}
        <div className="flex items-center justify-between mb-4 border-b border-red-100 pb-3">
          <div className="flex items-center">
            <div className="text-red-600 font-bold text-lg">
              <span className="text-red-600">Sky</span>
              <span className="text-gray-700">Venda</span>
              <span className="text-red-600 text-xs ml-1">MZ</span>
            </div>
          </div>
          <div className="flex items-center">
            <div className="bg-red-100 p-1 rounded-full">
              <Shield className="w-4 h-4 text-red-600" />
            </div>
            <span className="text-xs font-medium text-red-600 ml-1">Recusado</span>
          </div>
        </div>
        
        {/* Certificado de Identidade */}
        <div className="bg-white rounded-lg p-4 mb-4 border border-red-50 shadow-sm">
          <div className="flex justify-between items-start">
            <div>
              <h2 className="text-xl font-bold text-gray-800 flex items-center">
                {user?.nome ?? '—'}
              </h2>
              <div className="mt-1 space-y-1">
                <p className="text-xs text-gray-500 flex items-center">
                  <span className="font-medium text-gray-700 mr-2">SK ID:</span> 
                  <span className="font-mono">{skId}</span>
                </p>
                <p className="text-xs text-gray-500 flex items-center">
                  <span className="font-medium text-gray-700 mr-2">Tipo:</span> 
                  <span className="bg-red-50 text-red-700 px-2 py-0.5 rounded-full text-xs">{userType}</span>
                </p>
              </div>
            </div>
            
            {/* Selo de Verificação Recusado */}
            <div className="relative">
              <div className="w-16 h-16 relative">
                <div className="absolute inset-0 bg-gradient-to-br from-red-400 to-red-600 rounded-full opacity-10 animate-pulse"></div>
                <div className="absolute inset-2 bg-white rounded-full flex items-center justify-center">
                  <XCircle className="w-8 h-8 text-red-500" />
                </div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Mensagem de Recusa */}
        <div className="bg-white rounded-lg p-4 mb-4 border border-red-50 shadow-sm">
          <div className="flex items-start space-x-3">
            <AlertTriangle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
            <div>
              <h3 className="font-medium text-gray-900">Verificação Recusada</h3>
              <p className="text-sm text-gray-600 mt-1">
                Sua verificação foi recusada. Isso pode acontecer pelos seguintes motivos:
              </p>
              <ul className="text-xs text-gray-600 mt-2 list-disc pl-4 space-y-1">
                <li>Documentos ilegíveis ou incompletos</li>
                <li>Informações inconsistentes</li>
                <li>Foto de perfil não corresponde ao documento</li>
                <li>Documento expirado ou inválido</li>
              </ul>
            </div>
          </div>
        </div>
        
        {/* Botão para reenviar */}
        <button 
          type="button"
          onClick={handleResubmit}
          className="w-full bg-red-600 text-white px-4 py-3 rounded-lg hover:bg-red-700 transition-colors duration-200 flex items-center justify-center font-medium"
        >
          <RefreshCw className="w-4 h-4 mr-2" />
          Reenviar Formulário
        </button>
        {openModal && (
          <ResubmitVerificationModal open={openModal} onClose={() => setOpenModal(false)} />
        )}
        
        {/* Rodapé com logo da BlueSpark */}
        <div className="mt-4 pt-3 border-t border-red-100 flex justify-end">
          <div className="w-24">
            <BlueSparkLogo />
          </div>
        </div>
      </div>
    </div>
  );
}
