import React from 'react';
import { useNavigate } from 'react-router-dom';

export default function Privacy() {
  const navigate = useNavigate();

  return (
    <div className="w-full h-full p-6 overflow-y-auto">
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
        <h1 className="text-2xl font-bold text-gray-800">Política de Compra via SkyWallet</h1>
      </div>

      <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100 space-y-6 max-w-none prose prose-gray">
        <h2>📜 Política de Compra via SkyWallet – SkyVenda</h2>

        <h3>1. Introdução</h3>
        <p>
          A SkyWallet é a carteira digital oficial da plataforma SkyVenda. Ao utilizar a SkyWallet para efetuar compras, o usuário concorda com os termos descritos nesta Política, que tem como objetivo garantir segurança, transparência e confiança nas transações realizadas entre compradores e vendedores.
        </p>

        <h3>2. Funcionamento da Compra com SkyWallet</h3>
        <h4>2.1 Depósito de Fundos</h4>
        <ul className="list-disc pl-5">
          <li>O comprador deve carregar sua SkyWallet por meio de métodos autorizados (ex: M-Pesa, e-Mola, depósitos bancários).</li>
          <li>O valor depositado é convertido automaticamente para o saldo disponível da carteira.</li>
        </ul>

        <h4>2.2 Início do Pedido</h4>
        <ul className="list-disc pl-5">
          <li>Ao realizar uma compra, o valor correspondente ao produto é congelado automaticamente na SkyWallet do comprador.</li>
          <li>Esse valor não será liberado ao vendedor imediatamente, garantindo proteção ao comprador.</li>
        </ul>

        <h3>3. Confirmação do Pedido</h3>
        <h4>3.1 Ação do Vendedor</h4>
        <ul className="list-disc pl-5">
          <li>O vendedor receberá uma notificação com os detalhes do pedido e poderá <strong>Aceitar</strong> ou <strong>Rejeitar</strong> o pedido:</li>
          <li>Se aceitar, o valor permanece congelado até o término do processo.</li>
          <li>Se rejeitar, o valor é imediatamente descongelado e devolvido ao saldo do comprador.</li>
        </ul>

        <h3>4. Entrega do Produto</h3>
        <h4>4.1 Confirmação de Entrega</h4>
        <ul className="list-disc pl-5">
          <li>Após aceitar o pedido, o vendedor deve realizar a entrega do produto ao comprador.</li>
          <li>A entrega poderá ser confirmada através de um código único de verificação (Token de Entrega) fornecido ao comprador.</li>
          <li>Esse código deve ser inserido pelo vendedor no sistema para sinalizar que a entrega foi concluída.</li>
        </ul>

        <h4>4.2 Validação da Entrega</h4>
        <ul className="list-disc pl-5">
          <li>O comprador terá até 6 dias para confirmar o recebimento do produto após a entrega.</li>
          <li>Caso o comprador não confirme dentro desse prazo, e não haja contestação, o valor será automaticamente liberado ao vendedor.</li>
        </ul>

        <h3>5. Liberação de Pagamento</h3>
        <p>O pagamento será liberado ao vendedor somente quando:</p>
        <ul className="list-disc pl-5">
          <li>O comprador confirmar a recepção do produto no sistema;</li>
          <li>Ou o prazo de 6 dias terminar sem contestação por parte do comprador.</li>
        </ul>

        <h3>6. Cancelamento de Pedido</h3>
        <ul className="list-disc pl-5">
          <li>O comprador poderá cancelar um pedido apenas se ele ainda não tiver sido aceito pelo vendedor.</li>
          <li>Após a aceitação do vendedor, o cancelamento dependerá de uma análise interna e poderá exigir evidências ou comunicação entre as partes.</li>
        </ul>

        <h3>7. Segurança e Responsabilidade</h3>
        <ul className="list-disc pl-5">
          <li>O sistema SkyVenda não se responsabiliza pela entrega física dos produtos, sendo essa uma responsabilidade do vendedor.</li>
          <li>O sistema atua apenas como intermediário financeiro, protegendo ambas as partes até o encerramento do pedido.</li>
          <li>O código de entrega é pessoal e intransferível, e o comprador é totalmente responsável pela sua guarda e uso correto.</li>
        </ul>

        <h3>8. Casos de Disputa</h3>
        <p>
          Em caso de conflito entre comprador e vendedor, o sistema SkyVenda disponibiliza um canal de suporte para mediação. A decisão final poderá levar em consideração: mensagens no sistema, prova de entrega, código de validação e outras evidências.
        </p>

        <h3>9. Atualizações</h3>
        <p>
          A SkyVenda reserva-se o direito de alterar esta Política a qualquer momento, visando melhorar a segurança e experiência dos usuários. As atualizações serão comunicadas previamente por meio da plataforma.
        </p>
      </div>
    </div>
  );
}
