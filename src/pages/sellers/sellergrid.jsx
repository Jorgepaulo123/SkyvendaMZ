import { SellerCard } from '../../components/cards/sellercard';
import api from '../../api/api';
import { AuthContext } from '../../context/AuthContext';
import { useContext, useEffect, useState } from 'react';
import { HomeContext } from '../../context/HomeContext';
import { SellerCardSkeleton } from '../../components/skeleton/SellerCardSkeleton';

export function SellersGrid() {
  const {user}=useContext(AuthContext);
  const {sellers,addSellers}=useContext(HomeContext)
  const [loading,setLoading]=useState(true)

  useEffect(()=>{
    if(sellers?.length>=1){
      console.log('passou no if')
      setLoading(false)
    }else{
      api.get(`usuario/usuarios/lojas?skip=0&limit=10&identificador_unico=${user?.id_unico}`).then(res=>{
        // console.log(res.data.usuarios)
        console.log('passou no else')
        addSellers(res.data.usuarios)
      }).catch(err=>{
        console.log(err.message)
      })

    }
    
  },[sellers])
  return (
    <div className="flex justify-center py-4 sm:py-6 md:py-10 px-2 sm:px-4">
      <div className="w-full max-w-3xl mx-auto space-y-3 sm:space-y-4">
        <h2 className="text-xl sm:text-2xl font-bold text-gray-800 mb-2 sm:mb-4">Nhonguistas</h2>
        {loading ? (
          <>
            {Array(6).fill().map((_, index) => (
              <SellerCardSkeleton key={index} />
            ))}
          </>
        ) : (
          <>
            {sellers.map((seller) => (
              <SellerCard key={seller.id} seller={seller} />
            ))}
          </>
        )}
      </div>
    </div>
  );
}
