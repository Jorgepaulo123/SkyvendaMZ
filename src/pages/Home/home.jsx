import React from 'react'
import Header2 from '../../components/header/header2'
import AdsMore from '../../components/ads/ads'
import ByCategory from '../../components/products/by_category'
import Banner from '../../components/products/banner'
import JustForYou from '../../components/products/just_for_you'
import FeaturedProducts from '../../components/FeaturedProducts'

export default function Home() {
  return (
    <div className=''>
        <Header2/>
        <div className="container mx-auto py-2 gap-4">
            <AdsMore/>
            <ByCategory/>
            <Banner/>
        </div>
        <div className="bg-white w-full px-3">
            <FeaturedProducts/>
        </div>
    </div>
  )
}
