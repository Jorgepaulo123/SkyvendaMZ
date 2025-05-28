import React, { useEffect, useState, useContext } from 'react';
import { useParams } from 'react-router-dom';
import { HomeContext } from '../../context/HomeContext';
import { ModernCard } from '../../components/cards/ModernCard';
import ModernCardSkeleton from '../../components/skeleton/ModernCardSkeleton';

export default function ProductProvince() {
  const { province } = useParams(); // Obtém a província da URL
  const [loading, setLoading] = useState(false); // Estado de carregamento
  const [error, setError] = useState(null); // Estado de erro

  const { loadProvinceProducts, provinceProducts } = useContext(HomeContext); // Funções e dados do contexto

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        setError(null);

        // Carrega os produtos da província utilizando o contexto
        await loadProvinceProducts(province);
      } catch (err) {
        setError('Erro ao carregar os produtos. Por favor, tente novamente.');
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [province, loadProvinceProducts]);

  // Obtém os produtos da província do estado do contexto
  const products = provinceProducts[province] || [];

  return (
    <div className="p-8">
      <label>
        Produtos de: <span className="font-bold">{province}</span>
      </label>

      <div className="container">
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 pt-4">
            {[...Array(4)].map((_, index) => (
              <ModernCardSkeleton key={index} />
            ))}
          </div>
        ) : error ? (
          <p>{error}</p>
        ) : (
          <div className="py-5">
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
              {products.map((product) => (
                <ModernCard key={product.id} product={product} />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
