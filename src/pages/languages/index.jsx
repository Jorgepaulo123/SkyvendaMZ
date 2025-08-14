import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'

export default function Languages() {
  const navigate = useNavigate()
  const [selectedLanguage, setSelectedLanguage] = useState(1) // Default to Portuguese (PT)

  const languages = [
    { id: 1, name: 'Português (PT)', flag: '🇵🇹', disabled: false },
    { id: 2, name: 'Português (BR)', flag: '🇧🇷', disabled: true },
    { id: 3, name: 'English', flag: '🇬🇧', disabled: true },
    { id: 4, name: 'Español', flag: '🇪🇸', disabled: true },
  ]

  return (
    <div className="fixed inset-0 bg-gradient-to-br from-indigo-50 via-white to-blue-50">
      {/* Fixed Header */}
      <div className="fixed top-0 left-0 right-0 z-10 flex items-center justify-between p-4 bg-white/80 backdrop-blur-md border-b">
        <div className="flex items-center gap-2">
          <button onClick={() => navigate(-1)} className="p-2 text-gray-700">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <h1 className="text-2xl font-bold text-gray-800">Idiomas</h1>
        </div>
      </div>

      {/* Content */}
      <div className="pt-20 pb-6 h-full overflow-y-auto px-4">
        <div className="bg-white border border-gray-200 rounded-lg overflow-hidden shadow-sm">
          {languages.map((language) => (
            <button
              key={language.id}
              onClick={() => { if (!language.disabled) setSelectedLanguage(language.id); }}
              disabled={language.disabled}
              className={`w-full px-4 py-4 flex items-center justify-between border-b last:border-b-0 transition-all ${language.disabled ? 'cursor-not-allowed bg-gray-50' : 'hover:bg-gray-50'}`}
            >
              <div className="flex items-center gap-3">
                <span className="text-2xl">{language.flag}</span>
                <span className={`text-gray-700 ${language.disabled ? 'opacity-50' : ''}`}>{language.name}</span>
              </div>
              {selectedLanguage === language.id && (
                <svg className="w-6 h-6 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              )}
              {language.disabled && (
                <span className="ml-2 text-xs px-2 py-1 rounded-full bg-gray-100 text-gray-500 border">Indisponível</span>
              )}
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}
