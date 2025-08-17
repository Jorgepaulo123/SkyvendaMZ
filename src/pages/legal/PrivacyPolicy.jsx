import React from 'react';
import { Link } from 'react-router-dom';

export default function PrivacyPolicy() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 py-10">
      <div className="max-w-4xl mx-auto bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl p-6 sm:p-10">
        <h1 className="text-3xl sm:text-4xl font-extrabold text-gray-900 mb-4">Política de Privacidade – Skyvenda</h1>
        <p className="text-gray-600 mb-8">
          Última atualização: {new Date().toLocaleDateString()}
        </p>

        <div className="prose prose-indigo max-w-none">
          <h2>1. Introdução</h2>
          <p>
            A Skyvenda é uma plataforma que conecta compradores e vendedores. Valorizamos a
            sua privacidade e transparência. Esta Política explica quais dados coletamos, por que
            coletamos, como usamos, com quem compartilhamos e quais direitos você possui.
          </p>

          <h2>2. Dados que coletamos</h2>
          <ul>
            <li>
              <strong>Dados de conta e perfil:</strong> nome, username, email, foto de perfil e outras
              informações fornecidas voluntariamente.
            </li>
            <li>
              <strong>Dados de verificação de identidade:</strong> informações como data de nascimento e
              documentos/fotos enviados para fins de verificação e prevenção a fraudes.
            </li>
            <li>
              <strong>Dados de uso e técnicos:</strong> logs de acesso, IP, identificadores de dispositivo,
              páginas visitadas, cliques, eventos de navegação e cookies.
            </li>
            <li>
              <strong>Comunicações:</strong> mensagens trocadas pela plataforma, notificações, e contato
              com o suporte.
            </li>
            <li>
              <strong>Pagamentos e transações:</strong> valores, estado do pagamento, identificadores de
              transação e carteiras; não armazenamos dados sensíveis de cartões.
            </li>
            <li>
              <strong>Integrações de terceiros:</strong> por exemplo, Google Login para autenticação.
            </li>
          </ul>

          <h2>3. Bases legais e finalidades</h2>
          <p>Tratamos seus dados com base em:</p>
          <ul>
            <li><strong>Execução de contrato</strong> (prestação do serviço da plataforma);</li>
            <li><strong>Consentimento</strong> (por exemplo, marketing, certas funcionalidades opcionais);</li>
            <li><strong>Interesse legítimo</strong> (segurança, prevenção a fraudes, melhorias);</li>
            <li><strong>Cumprimento de obrigação legal</strong> (ex.: demandas regulatórias e fiscais).</li>
          </ul>
          <p>Usamos seus dados para:</p>
          <ul>
            <li>Criar e manter sua conta; autenticação (incl. OAuth/Google);</li>
            <li>Operar funcionalidades de compra e venda e a sua carteira;</li>
            <li>Comunicar atualizações, notificações e mensagens relevantes;</li>
            <li>Personalizar a experiência e recomendar conteúdo/produtos;</li>
            <li>Prevenir abuso, spam e violações dos termos; verificar identidade quando necessário;</li>
            <li>Produzir relatórios estatísticos e melhorar a plataforma.</li>
          </ul>

          <h2>4. Compartilhamento de dados</h2>
          <ul>
            <li>
              <strong>Provedores de serviço</strong> (hospedagem, armazenamento, analytics, pagamentos,
              anti-fraude), sempre sob obrigações contratuais de segurança e confidencialidade.
            </li>
            <li>
              <strong>Parceiros de autenticação</strong> (como Google) quando você usa login social.
            </li>
            <li>
              <strong>Autoridades públicas</strong> quando houver base legal ou obrigação de divulgação.
            </li>
            <li>
              <strong>Transferências internacionais</strong> podem ocorrer conforme necessário e com
              salvaguardas adequadas.
            </li>
          </ul>

          <h2>5. Cookies e tecnologias similares</h2>
          <p>
            Utilizamos cookies para autenticação, segurança, preferências, estatísticas e melhorias.
            Você pode gerenciar cookies no seu navegador; alguns cookies são essenciais para o
            funcionamento do serviço.
          </p>

          <h2>6. Retenção e descarte</h2>
          <p>
            Mantemos os dados pelo tempo necessário às finalidades informadas e para cumprir
            obrigações legais. Após esse período, excluímos ou anonimizamos de modo seguro.
          </p>

          <h2>7. Seus direitos</h2>
          <p>
            Conforme a legislação aplicável, você pode ter direitos de acesso, correção, exclusão,
            portabilidade, limitação e oposição ao tratamento, além de retirar consentimento quando
            aplicável. Para exercer, entre em contato pelos canais abaixo.
          </p>

          <h2>8. Segurança</h2>
          <p>
            Adotamos medidas técnicas e organizacionais para proteger seus dados. Nenhum sistema é
            100% seguro; trabalhamos continuamente para aprimorar controles e monitoramento.
          </p>

          <h2>9. Menores de idade</h2>
          <p>
            Nosso serviço não é destinado a menores de idade sem consentimento e supervisão dos
            responsáveis. Caso identifiquemos contas de menores sem autorização, poderemos removê-las.
          </p>

          <h2>10. Alterações desta política</h2>
          <p>
            Podemos atualizar esta Política de tempos em tempos. Avisaremos mudanças relevantes por
            meio do site/aplicativo ou por e-mail.
          </p>

          <h2>11. Contato</h2>
          <p>
            Dúvidas ou solicitações sobre privacidade? Fale conosco pelo aplicativo ou pelo canal de
            suporte indicado na plataforma.
          </p>
        </div>

        <div className="mt-10 text-sm text-gray-600">
          <p>
            Leia também os nossos <Link to="/termos" className="text-indigo-600 hover:underline">Termos de Serviço</Link>.
          </p>
        </div>
      </div>
    </div>
  );
}
