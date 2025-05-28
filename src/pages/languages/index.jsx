import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'

export default function Languages() {
  const navigate = useNavigate()
  const [selectedLanguage, setSelectedLanguage] = useState(1) // Default to Portuguese (PT)

  const languages = [
    { id: 1, name: 'Português (PT)', flag: '🇵🇹' },
    { id: 2, name: 'Português (BR)', flag: '🇧🇷' },
    { id: 3, name: 'English', flag: '🇬🇧' },
    { id: 4, name: 'Español', flag: '🇪🇸' },
  ]

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
          <h1 className="text-2xl font-bold text-gray-700">Idiomas Disponíveis</h1>
        </div>
      </div>

      {/* Content */}
      <div className="pt-20 pb-6 h-full overflow-y-auto px-4">
        <div className="bg-white/80 backdrop-blur-sm border border-gray-200 rounded-lg">
          {languages.map((language) => (
            <button
              key={language.id}
              onClick={() => setSelectedLanguage(language.id)}
              className="w-full px-4 py-4 flex items-center justify-between border-b last:border-b-0 hover:bg-white/90 transition-all"
            >
              <div className="flex items-center gap-3">
                <span className="text-2xl">{language.flag}</span>
                <span className="text-gray-700">{language.name}</span>
              </div>
              {selectedLanguage === language.id && (
                <svg className="w-6 h-6 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              )}
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}
