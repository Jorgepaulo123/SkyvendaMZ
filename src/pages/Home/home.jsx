import React from 'react'
import MobileFeed from '../../components/feed/MobileFeed'
import MainLayout from '../../components/layout/MainLayout'

export default function Home() {

  return (
    <MainLayout>
      <div className="bg-gray-50 min-h-screen">
        {/* Feed principal - sem padding para mobile, como rede social */}
        <MobileFeed />
      </div>
    </MainLayout>
  )
}
