import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'

export default function InputSearchMobile() {
  const navigate = useNavigate()
  const [searchQuery, setSearchQuery] = useState('')

  useEffect(() => {
    // Redireciona para home se a largura da tela for maior que 768px (tablet/desktop)
    if (window.innerWidth > 768) {
      navigate('/')
    }
  }, [navigate])

  const handleSearch = (e) => {
    e.preventDefault()
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery.trim())}`)
    }
  }

  return (
    <div className="fixed inset-0 bg-gradient-to-br from-pink-100 via-white to-red-50">
      <div className="fixed top-0 left-0 right-0 z-10 p-4 bg-gradient-to-r from-pink-50 to-red-50 shadow-sm">
        <form onSubmit={handleSearch} className="flex items-center gap-2">
          <button 
            type="button"
            onClick={() => navigate(-1)} 
            className="p-2 text-gray-700"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          
          <div className="flex-1 flex items-center gap-2">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Pesquisar produtos..."
              className="w-full px-4 py-2 rounded-full bg-white/70 backdrop-blur-sm focus:outline-none focus:bg-white/90 transition-colors"
              autoFocus
            />
            <button 
              type="submit"
              className="p-2 text-gray-600"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
