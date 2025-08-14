import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'

export default function Help() {
  const navigate = useNavigate()
  const [searchQuery, setSearchQuery] = useState('')
  const [expandedId, setExpandedId] = useState(null)

  const faqs = [
    {
      id: 1,
      question: 'Como posso criar uma nova conta?',
      answer: 'Para criar uma nova conta, clique no botão "Registrar" na página inicial e preencha seus dados pessoais.'
    },
    {
      id: 2,
      question: 'Como redefinir minha senha?',
      answer: 'Você pode redefinir sua senha clicando em "Esqueci minha senha" na tela de login e seguindo as instruções enviadas ao seu e-mail.'
    },
    {
      id: 3,
      question: 'Como entrar em contato com o suporte?',
      answer: 'Você pode entrar em contato conosco através do e-mail suporte@exemplo.com ou pelo telefone 0800-123-4567.'
    },
    // Adicione mais perguntas conforme necessário
  ]

  const filteredFaqs = faqs.filter(faq =>
    faq.question.toLowerCase().includes(searchQuery.toLowerCase())
  )

  return (
    <div className="fixed inset-0 bg-gradient-to-br from-indigo-50 via-white to-blue-50">
      {/* Header */}
      <div className="fixed top-0 left-0 right-0 z-10 px-4 py-3 bg-white/80 backdrop-blur-md border-b">
        <div className="max-w-5xl mx-auto flex items-center gap-3">
          <button onClick={() => navigate(-1)} className="p-2 text-gray-700 hover:bg-gray-100 rounded-full">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <h1 className="text-2xl font-bold text-gray-800">Central de Ajuda</h1>
        </div>
      </div>

      {/* Content */}
      <div className="pt-20 pb-10 overflow-y-auto">
        <div className="max-w-5xl mx-auto px-4">
          {/* Hero / Search */}
          <div className="rounded-2xl bg-gradient-to-r from-indigo-600 to-blue-500 text-white p-6 md:p-8 shadow-sm">
            <h2 className="text-xl md:text-2xl font-semibold">Como podemos ajudar?</h2>
            <p className="opacity-90 mt-1 text-sm md:text-base">Pesquise por tópicos ou navegue nas categorias abaixo.</p>
            <div className="mt-4">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Pesquisar pergunta..."
                  className="w-full px-4 py-3 rounded-xl text-gray-800 focus:outline-none focus:ring-4 focus:ring-white/40"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </span>
              </div>
            </div>
          </div>

          {/* Quick Links */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mt-6">
            {[
              { t: 'Conta', i: '👤' },
              { t: 'Segurança', i: '🔐' },
              { t: 'Pagamentos', i: '💳' },
              { t: 'Marketplace', i: '🛍️' },
            ].map((c, idx) => (
              <div key={idx} className="rounded-xl border bg-white p-4 hover:shadow-md transition">
                <div className="text-2xl">{c.i}</div>
                <div className="text-sm mt-2 text-gray-700 font-medium">{c.t}</div>
              </div>
            ))}
          </div>

          {/* FAQ List */}
          <div className="mt-6 space-y-2">
            {filteredFaqs.map((faq) => (
              <div
                key={faq.id}
                className="bg-white border border-gray-200 rounded-xl overflow-hidden"
              >
                <button
                  onClick={() => setExpandedId(expandedId === faq.id ? null : faq.id)}
                  className="w-full px-4 py-4 flex items-center justify-between hover:bg-gray-50 transition-all"
                >
                  <span className="text-gray-800 font-medium">{faq.question}</span>
                  <svg
                    className={`w-6 h-6 text-gray-500 transform transition-transform ${expandedId === faq.id ? 'rotate-180' : ''}`}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>
                {expandedId === faq.id && (
                  <div className="px-4 py-3 border-t border-gray-200 bg-gray-50">
                    <p className="text-gray-700">{faq.answer}</p>
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Contact Card */}
          <div className="mt-8 rounded-2xl border bg-white p-6 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <h3 className="text-lg font-semibold text-gray-800">Não encontrou o que procurava?</h3>
              <p className="text-gray-600 mt-1">Fale com nosso suporte. Respondemos normalmente em até 24h úteis.</p>
            </div>
            <div className="flex gap-2">
              <a href="mailto:suporte@skyvenda.com" className="px-4 py-2 rounded-lg border text-gray-700 hover:bg-gray-50">Email</a>
              <a href="/contato" className="px-4 py-2 rounded-lg bg-indigo-600 text-white hover:bg-indigo-700">Abrir ticket</a>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
