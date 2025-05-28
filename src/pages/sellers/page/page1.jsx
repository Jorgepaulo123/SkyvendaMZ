import React from 'react'
import { ProductCardSkeleton2 } from '../../skeleton/productcardskeleton2'
import { ProductCard } from '../../cards/ProductCard'

export default function Page1({loading,myproducts,handleEdit}) {
  return (
    <div className="bg-white rounded-lg shadow h-[calc(100vh-100px)]">
          <div className="p-4 border-b">
            <h2 className="text-lg font-semibold text-gray-900">Meus Produtos</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 p-4">
            {loading ? (
              <>
                {[...Array(4)].map((_, index) => (
                  <ProductCardSkeleton2 key={index} />
                ))}
              </>
            ) : (
              <>
                {myproducts.length === 0 ? (
                  <p>Nenhum produto encontrado</p>
                ) : (
                  myproducts.map((product) => (
                    <ProductCard
                      key={product.id}
                      product={product}
                      onEdit={handleEdit}
                      onDelete={() => handleDelete(product.slug,product.title)}
                    />
                  ))
                )}
              </>
            )}
          </div>
        </div>
  )
}
