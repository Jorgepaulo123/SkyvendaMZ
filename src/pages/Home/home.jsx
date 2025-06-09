import React from 'react'
import AdsMore from '../../components/ads/ads'
import ByCategory from '../../components/products/by_category'
import JustForYou from '../../components/products/just_for_you'
import FeaturedProducts from '../../components/FeaturedProducts'
import PromotionalBanners from '../../components/products/PromotionalBanners'
import MainLayout from '../../components/layout/MainLayout'

export default function Home() {
  return (
    <MainLayout>
      <div className="pt-[60px] md:pt-[60px]"> {/* Ajuste para o header fixo */}
        <div className="container mx-auto py-2 gap-4">
          <AdsMore/>
          <ByCategory/>
          <PromotionalBanners/>
        </div>
        <div className="bg-white w-full px-3">
          <FeaturedProducts/>
        </div>
      </div>
    </MainLayout>
  )
}
