import React from 'react'
import AdaptiveFeed from '../../components/feed/AdaptiveFeed'
import MainLayout from '../../components/layout/MainLayout'

export default function Home() {

  return (
    <MainLayout>
      <div className="bg-gray-50 min-h-screen">
        {/* Feed adaptativo - mobile estilo rede social, desktop estilo Instagram */}
        <AdaptiveFeed />
      </div>
    </MainLayout>
  )
}
