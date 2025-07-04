import React from 'react'
import AdsMore from '../../components/ads/ads'
import ByCategory from '../../components/products/by_category'
import JustForYou from '../../components/products/just_for_you'
import MixedFeed from '../../components/MixedFeed'
import PublicacoesCarousel from '../../components/PublicacoesCarousel'
import NhonguistasCarousel from '../../components/NhonguistasCarousel'
import PromotionalBanners from '../../components/products/PromotionalBanners'
import MainLayout from '../../components/layout/MainLayout'

function shuffle(arr){return arr.map(v=>({v,sort:Math.random()})).sort((a,b)=>a.sort-b.sort).map(({v})=>v);}

export default function Home() {
  const sections=shuffle([
            <NhonguistasCarousel key="vend"/>,
            <PublicacoesCarousel key="pubs"/>,
            <MixedFeed key="mix"/>
          ]);

  return (
    <MainLayout>
      <div className="pt-[60px] md:pt-[60px]"> {/* Ajuste para o header fixo */}
        <div className="container mx-auto py-2 gap-4">
          <AdsMore/>
          <ByCategory/>
          <PromotionalBanners/>
          {/* seções dinâmicas serão inseridas abaixo */}
        </div>
        <div className="bg-white w-full px-3 space-y-6">
          {sections}
        </div>
      </div>
    </MainLayout>
  )
}
