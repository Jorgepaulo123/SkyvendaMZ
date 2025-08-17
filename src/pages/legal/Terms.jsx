import React from 'react';
import { Link } from 'react-router-dom';

export default function Terms() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 py-10">
      <div className="max-w-4xl mx-auto bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl p-6 sm:p-10">
        <h1 className="text-3xl sm:text-4xl font-extrabold text-gray-900 mb-4">Termos de Serviço – Skyvenda</h1>
        <p className="text-gray-600 mb-8">Última atualização: {new Date().toLocaleDateString()}</p>

        <div className="prose prose-indigo max-w-none">
          <h2>1. Aceitação</h2>
          <p>
            Ao usar a Skyvenda, você concorda com estes Termos e com nossa
            <Link to="/privacidade" className="text-indigo-600 hover:underline"> Política de Privacidade</Link>.
          </p>

          <h2>2. Serviço e intermediação</h2>
          <p>
            A Skyvenda é uma plataforma de intermediação entre compradores e vendedores.
            Não somos proprietários dos produtos, não controlamos qualidade, entrega,
            disponibilidade ou conformidade. Vendedores são os únicos responsáveis por
            anúncios, preços, estoque, prazos e entregas. Compradores devem avaliar com
            cautela os anúncios antes de concluir transações.
          </p>
          <p>
            A Skyvenda <strong>não se responsabiliza</strong> por:
          </p>
          <ul>
            <li>Entrega de produtos, prazos, extravios, avarias ou não conformidade;</li>
            <li>Qualidade, estado, autenticidade ou licitude dos itens anunciados;</li>
            <li>Pagamentos fora dos fluxos oficiais da plataforma;</li>
            <li>Negociações, mensagens e combinações feitas entre as partes;</li>
            <li>Descumprimento de obrigações de consumidores ou fornecedores.</li>
          </ul>

          <h2>3. Contas e segurança</h2>
          <ul>
            <li>Mantenha suas credenciais seguras e não compartilhe sua conta;</li>
            <li>Você é responsável por atividades realizadas na sua conta;</li>
            <li>Podemos solicitar verificação de identidade para segurança e prevenção a fraudes;</li>
            <li>Reservamo-nos o direito de suspender contas por violações dos Termos.</li>
          </ul>

          <h2>4. Conteúdo e anúncios</h2>
          <ul>
            <li>É proibido conteúdo ilícito, ofensivo, enganoso ou que viole direitos de terceiros;</li>
            <li>Devem ser respeitadas regras de categorias e políticas locais;</li>
            <li>Podemos remover anúncios que violem políticas, termos ou leis aplicáveis.</li>
          </ul>

          <h2>5. Pagamentos e taxas</h2>
          <p>
            Alguns serviços podem ter taxas. Valores e condições serão informados na plataforma.
            Transações devem ocorrer pelos meios oficiais. Pagamentos externos são de risco do usuário.
          </p>

          <h2>6. Comunicações</h2>
          <p>
            Ao usar a plataforma, você concorda em receber comunicações importantes sobre sua
            conta e transações. Preferências podem ser ajustadas nas configurações.
          </p>

          <h2>7. Limitação de responsabilidade</h2>
          <p>
            Em nenhuma hipótese a Skyvenda será responsável por danos indiretos, incidentais,
            consequenciais, lucros cessantes, perda de dados, interrupções ou danos relacionados a
            transações entre usuários. O uso do serviço é por sua conta e risco.
          </p>

          <h2>8. Propriedade intelectual</h2>
          <p>
            Marcas, logotipos, design e software da Skyvenda permanecem como propriedade
            exclusiva. Você não pode copiá-los, modificá-los ou usá-los sem autorização.
          </p>

          <h2>9. Rescisão</h2>
          <p>
            Podemos encerrar ou suspender o acesso por violação dos Termos, fraude, risco
            de segurança ou exigência legal. Você pode excluir sua conta a qualquer momento.
          </p>

          <h2>10. Alterações</h2>
          <p>
            Podemos atualizar estes Termos. Notificaremos mudanças relevantes pela plataforma
            ou por e-mail. O uso contínuo após alterações implica concordância.
          </p>

          <h2>11. Lei aplicável e disputas</h2>
          <p>
            Estes Termos são regidos pelas leis aplicáveis do seu país/região. Conflitos devem
            ser resolvidos preferencialmente de forma amigável. Persistindo, serão submetidos ao
            foro competente.
          </p>

          <h2>12. Contato</h2>
          <p>
            Fale conosco pelos canais oficiais de suporte da plataforma.
          </p>
        </div>

        <div className="mt-10 text-sm text-gray-600">
          <p>
            Veja também nossa <Link to="/privacidade" className="text-indigo-600 hover:underline">Política de Privacidade</Link>.
          </p>
        </div>
      </div>
    </div>
  );
}
