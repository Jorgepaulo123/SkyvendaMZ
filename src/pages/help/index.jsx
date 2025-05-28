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
    <div className="fixed inset-0 bg-gradient-to-br from-pink-100 via-white to-red-50">
      {/* Fixed Header */}
      <div className="fixed top-0 left-0 right-0 z-10 flex items-center justify-between p-4 bg-gradient-to-r from-pink-50 to-red-50 shadow-sm">
        <div className="flex items-center gap-2">
          <button onClick={() => navigate(-1)} className="p-2 text-gray-700">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <h1 className="text-2xl font-bold text-gray-700">Ajuda</h1>
        </div>
      </div>

      {/* Content */}
      <div className="pt-20 pb-6 h-full overflow-y-auto px-4">
        {/* Search Bar */}
        <div className="mb-4">
          <input
            type="text"
            placeholder="Pesquisar pergunta..."
            className="w-full px-4 py-2 rounded-lg border border-gray-200 bg-white/80 backdrop-blur-sm focus:outline-none focus:ring-2 focus:ring-pink-200"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        {/* FAQ List */}
        <div className="space-y-2">
          {filteredFaqs.map((faq) => (
            <div
              key={faq.id}
              className="bg-white/80 backdrop-blur-sm border border-gray-200 rounded-lg overflow-hidden"
            >
              <button
                onClick={() => setExpandedId(expandedId === faq.id ? null : faq.id)}
                className="w-full px-4 py-4 flex items-center justify-between hover:bg-white/90 transition-all"
              >
                <span className="text-gray-700">{faq.question}</span>
                <svg
                  className={`w-6 h-6 text-gray-500 transform transition-transform ${
                    expandedId === faq.id ? 'rotate-180' : ''
                  }`}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>
              {expandedId === faq.id && (
                <div className="px-4 py-3 border-t border-gray-200 bg-white/60">
                  <p className="text-gray-600">{faq.answer}</p>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
