import React from 'react'

export default function Notifications() {
  return (
    <div className="fixed inset-0 bg-gradient-to-br from-amber-50 via-white to-yellow-50">
      <div className="max-w-xl mx-auto px-4 pt-10">
        <div className="flex items-center gap-2 mb-6">
          <span className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-amber-100 text-amber-600">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M12 18.5A6.5 6.5 0 1012 5.5a6.5 6.5 0 000 13z" />
            </svg>
          </span>
          <h1 className="text-2xl font-bold text-gray-800">Preferências de Notificações</h1>
        </div>

        <div className="bg-white border border-amber-200 rounded-xl shadow-sm p-6">
          <div className="flex items-start gap-3">
            <div className="mt-0.5 text-amber-500">
              <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 2a10 10 0 100 20 10 10 0 000-20zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z" />
              </svg>
            </div>
            <div>
              <h2 className="text-lg font-semibold text-gray-800">Indisponível no momento</h2>
              <p className="text-gray-600 mt-1">
                Estamos trabalhando para disponibilizar a personalização de notificações. Em breve você poderá escolher quais alertas deseja receber por push, e-mail e dentro do app.
              </p>
              <div className="mt-4 inline-flex items-center gap-2 rounded-full border border-amber-200 bg-amber-50 px-3 py-1 text-sm text-amber-700">
                <span className="inline-block h-2 w-2 rounded-full bg-amber-400"></span>
                Em desenvolvimento
              </div>
            </div>
          </div>
        </div>

        <div className="mt-6 text-sm text-gray-500">
          Dica: você ainda receberá notificações importantes sobre segurança e transações.
        </div>
      </div>
    </div>
  )
}
