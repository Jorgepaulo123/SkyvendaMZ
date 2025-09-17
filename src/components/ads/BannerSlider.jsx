import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

const defaultBanners = [
  {
    id: 1,
    title: 'Ofertas Especiais',
    description: 'Descontos de até 50%',
    image: 'https://via.placeholder.com/400x200?text=Oferta+1',
    color: 'from-blue-500 to-purple-600'
  },
  {
    id: 2,
    title: 'Produtos Novos',
    description: 'Confira as novidades',
    image: 'https://via.placeholder.com/400x200?text=Novidade',
    color: 'from-green-500 to-blue-500'
  },
  {
    id: 3,
    title: 'Frete Grátis',
    description: 'Em compras acima de 1000 MT',
    image: 'https://via.placeholder.com/400x200?text=Frete+Gratis',
    color: 'from-orange-500 to-red-500'
  }
];

export default function BannerSlider({ banners = defaultBanners }) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);

  // Auto-play
  useEffect(() => {
    if (!isAutoPlaying) return;

    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % banners.length);
    }, 4000);

    return () => clearInterval(interval);
  }, [isAutoPlaying, banners.length]);

  const goToSlide = (index) => {
    setCurrentIndex(index);
    setIsAutoPlaying(false);
    setTimeout(() => setIsAutoPlaying(true), 5000);
  };

  const nextSlide = () => {
    setCurrentIndex((prev) => (prev + 1) % banners.length);
    setIsAutoPlaying(false);
    setTimeout(() => setIsAutoPlaying(true), 5000);
  };

  const prevSlide = () => {
    setCurrentIndex((prev) => (prev - 1 + banners.length) % banners.length);
    setIsAutoPlaying(false);
    setTimeout(() => setIsAutoPlaying(true), 5000);
  };

  if (!banners || banners.length === 0) return null;

  return (
    <div className="relative w-full h-48 md:rounded-lg overflow-hidden md:shadow-sm">
      {/* Slides */}
      <div 
        className="flex transition-transform duration-500 ease-in-out h-full"
        style={{ transform: `translateX(-${currentIndex * 100}%)` }}
      >
        {banners.map((banner, index) => (
          <div
            key={banner.id}
            className={`flex-shrink-0 w-full h-full bg-gradient-to-r ${banner.color} relative`}
          >
            {/* Background Image */}
            {banner.image && (
              <img
                src={banner.image}
                alt={banner.title}
                className="absolute inset-0 w-full h-full object-cover mix-blend-overlay"
              />
            )}
            
            {/* Content */}
            <div className="absolute inset-0 flex flex-col justify-center items-center text-center p-6">
              <h3 className="text-white text-xl font-bold mb-2">
                {banner.title}
              </h3>
              <p className="text-white text-sm opacity-90">
                {banner.description}
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* Navigation Arrows */}
      {banners.length > 1 && (
        <>
          <button
            onClick={prevSlide}
            className="absolute left-2 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-50 text-white p-2 rounded-full hover:bg-opacity-70 transition-opacity"
          >
            <ChevronLeft size={16} />
          </button>
          <button
            onClick={nextSlide}
            className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-50 text-white p-2 rounded-full hover:bg-opacity-70 transition-opacity"
          >
            <ChevronRight size={16} />
          </button>
        </>
      )}

      {/* Dots Indicator */}
      {banners.length > 1 && (
        <div className="absolute bottom-3 left-1/2 transform -translate-x-1/2 flex space-x-2">
          {banners.map((_, index) => (
            <button
              key={index}
              onClick={() => goToSlide(index)}
              className={`w-2 h-2 rounded-full transition-all ${
                index === currentIndex 
                  ? 'bg-white' 
                  : 'bg-white bg-opacity-50'
              }`}
            />
          ))}
        </div>
      )}
    </div>
  );
}
