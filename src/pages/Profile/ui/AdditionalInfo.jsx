import React from 'react';
import { BarChart2, Award, Gift, Zap, Shield, Star, Wallet, ArrowUpRight, ArrowDownLeft, History, CreditCard, BanknoteIcon, PiggyBank, ShoppingBag } from 'lucide-react';

export function AdditionalInfo() {
  return (
    <div className="w-full max-w-6xl mx-auto mt-12 px-4">
      {/* Carteira Digital */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-800 rounded-2xl p-8 shadow-lg mb-12 text-white">
        <div className="flex justify-between items-start mb-8">
          <div>
            <h2 className="text-2xl font-bold mb-2">Carteira Digital</h2>
            <p className="text-blue-100">Gerencie suas transações</p>
          </div>
          <CreditCard className="w-8 h-8" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white/10 backdrop-blur-lg rounded-xl p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold">Saldo Disponível</h3>
              <Wallet className="w-6 h-6" />
            </div>
            <p className="text-3xl font-bold">15.000,00 MZN</p>
          </div>
          <div className="bg-white/10 backdrop-blur-lg rounded-xl p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold">Depósitos</h3>
              <ArrowDownLeft className="w-6 h-6" />
            </div>
            <p className="text-3xl font-bold text-green-300">+8.500,00 MZN</p>
            <p className="text-sm text-blue-100">Último: 2.000,00 MZN</p>
          </div>
          <div className="bg-white/10 backdrop-blur-lg rounded-xl p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold">Levantamentos</h3>
              <ArrowUpRight className="w-6 h-6" />
            </div>
            <p className="text-3xl font-bold text-red-300">-3.500,00 MZN</p>
            <p className="text-sm text-blue-100">Último: 500,00 MZN</p>
          </div>
        </div>
      </div>

      {/* Ações Rápidas */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
        <button className="bg-white p-6 rounded-xl shadow-lg hover:shadow-xl transition-shadow flex items-center space-x-4">
          <div className="bg-green-100 p-3 rounded-lg">
            <BanknoteIcon className="w-6 h-6 text-green-600" />
          </div>
          <div className="text-left">
            <h3 className="font-semibold text-gray-800">Depositar</h3>
            <p className="text-sm text-gray-600">Adicionar fundos</p>
          </div>
        </button>
        <button className="bg-white p-6 rounded-xl shadow-lg hover:shadow-xl transition-shadow flex items-center space-x-4">
          <div className="bg-blue-100 p-3 rounded-lg">
            <PiggyBank className="w-6 h-6 text-blue-600" />
          </div>
          <div className="text-left">
            <h3 className="font-semibold text-gray-800">Levantar</h3>
            <p className="text-sm text-gray-600">Retirar fundos</p>
          </div>
        </button>
        <button className="bg-white p-6 rounded-xl shadow-lg hover:shadow-xl transition-shadow flex items-center space-x-4">
          <div className="bg-purple-100 p-3 rounded-lg">
            <History className="w-6 h-6 text-purple-600" />
          </div>
          <div className="text-left">
            <h3 className="font-semibold text-gray-800">Histórico</h3>
            <p className="text-sm text-gray-600">Ver transações</p>
          </div>
        </button>
      </div>

      {/* Histórico de Transações */}
      <div className="bg-white rounded-2xl p-8 shadow-lg mb-12">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-xl font-semibold text-gray-800">Últimas Transações</h3>
          <button className="text-blue-600 text-sm hover:underline">Ver todas</button>
        </div>
        <div className="space-y-4">
          <div className="flex items-center justify-between p-4 hover:bg-gray-50 rounded-lg transition-colors">
            <div className="flex items-center space-x-4">
              <div className="bg-green-100 p-2 rounded-lg">
                <ArrowDownLeft className="w-5 h-5 text-green-600" />
              </div>
              <div>
                <p className="font-medium text-gray-800">Depósito via M-Pesa</p>
                <p className="text-sm text-gray-500">Hoje, 14:30</p>
              </div>
            </div>
            <p className="font-semibold text-green-600">+2.000,00 MZN</p>
          </div>
          <div className="flex items-center justify-between p-4 hover:bg-gray-50 rounded-lg transition-colors">
            <div className="flex items-center space-x-4">
              <div className="bg-red-100 p-2 rounded-lg">
                <ArrowUpRight className="w-5 h-5 text-red-600" />
              </div>
              <div>
                <p className="font-medium text-gray-800">Levantamento Banco</p>
                <p className="text-sm text-gray-500">Ontem, 16:45</p>
              </div>
            </div>
            <p className="font-semibold text-red-600">-500,00 MZN</p>
          </div>
          <div className="flex items-center justify-between p-4 hover:bg-gray-50 rounded-lg transition-colors">
            <div className="flex items-center space-x-4">
              <div className="bg-blue-100 p-2 rounded-lg">
                <ShoppingBag className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <p className="font-medium text-gray-800">Venda Produto #1234</p>
                <p className="text-sm text-gray-500">22 Abril, 10:20</p>
              </div>
            </div>
            <p className="font-semibold text-blue-600">+1.500,00 MZN</p>
          </div>
        </div>
      </div>

      {/* Estatísticas */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
        <div className="bg-white rounded-xl p-6 shadow-lg">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-800">Desempenho da Loja</h3>
            <BarChart2 className="w-6 h-6 text-blue-500" />
          </div>
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Vendas este mês</span>
              <span className="font-semibold text-blue-600">32</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Valor Total</span>
              <span className="font-semibold text-blue-600">45.000,00 MZN</span>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-lg">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-800">Conquistas</h3>
            <Award className="w-6 h-6 text-purple-500" />
          </div>
          <div className="flex gap-2 flex-wrap">
            <span className="px-3 py-1 bg-purple-100 text-purple-600 rounded-full text-sm">Vendedor Top</span>
            <span className="px-3 py-1 bg-purple-100 text-purple-600 rounded-full text-sm">Entrega Rápida</span>
            <span className="px-3 py-1 bg-purple-100 text-purple-600 rounded-full text-sm">Cliente Satisfeito</span>
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-lg">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-800">Benefícios</h3>
            <Gift className="w-6 h-6 text-pink-500" />
          </div>
          <ul className="space-y-2">
            <li className="flex items-center text-gray-600">
              <Zap className="w-4 h-4 mr-2 text-pink-500" />
              <span>Destaque nos resultados</span>
            </li>
            <li className="flex items-center text-gray-600">
              <Shield className="w-4 h-4 mr-2 text-pink-500" />
              <span>Proteção ao vendedor</span>
            </li>
            <li className="flex items-center text-gray-600">
              <Star className="w-4 h-4 mr-2 text-pink-500" />
              <span>Programa de pontos</span>
            </li>
          </ul>
        </div>
      </div>

      {/* Dicas e Recomendações */}
      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl p-8 shadow-lg">
        <h3 className="text-xl font-semibold text-gray-800 mb-6">Dicas para Aumentar suas Vendas</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="bg-white rounded-xl p-6 shadow-md">
            <h4 className="font-semibold text-gray-800 mb-2">Fotos de Qualidade</h4>
            <p className="text-gray-600 text-sm">Tire fotos bem iluminadas e de vários ângulos dos seus produtos.</p>
          </div>
          <div className="bg-white rounded-xl p-6 shadow-md">
            <h4 className="font-semibold text-gray-800 mb-2">Descrições Detalhadas</h4>
            <p className="text-gray-600 text-sm">Forneça informações completas sobre seus produtos.</p>
          </div>
          <div className="bg-white rounded-xl p-6 shadow-md">
            <h4 className="font-semibold text-gray-800 mb-2">Preços Competitivos</h4>
            <p className="text-gray-600 text-sm">Pesquise o mercado e mantenha seus preços atrativos.</p>
          </div>
        </div>
      </div>
    </div>
  );
} 