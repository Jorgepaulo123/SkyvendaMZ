import React from 'react'
import { SellersGrid } from './sellergrid'
import { BestSellers } from '../../components/ads/BestSellers'

export default function Sellers() {
  return (
    <div className='p-1'>
      {/* Mobile view: Only show SellersGrid */}
      <div className='block md:hidden'>
        <SellersGrid/>
      </div>
      
      {/* Desktop view: Show both components side by side */}
      <div className='hidden md:flex flex-row gap-4'>
        <div className='w-9/12'>
          <SellersGrid/>
        </div>
        <div className='w-3/12'>
          <BestSellers/>
        </div>
      </div>
    </div>
  )
}
