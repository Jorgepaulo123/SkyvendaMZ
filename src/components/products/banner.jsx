import { ArrowRight } from 'lucide-react';
import React, { useEffect, useRef, useState } from 'react';

function useInView(options = {}) {
  const [isInView, setIsInView] = useState(false);
  const elementRef = useRef(null);

  useEffect(() => {
    const element = elementRef.current;
    if (!element) return;

    const observer = new IntersectionObserver(([entry]) => {
      setIsInView(entry.isIntersecting);
    }, {
      threshold: 0.1,
      ...options
    });

    observer.observe(element);

    return () => {
      if (element) {
        observer.unobserve(element);
      }
    };
  }, [options]);

  return [elementRef, isInView];
}

export default function Banner() {
  const [ref, isInView] = useInView();

  return (
    <div className="container mx-auto py-8 px-2 md:px-0" ref={ref}>
      <div className="grid grid-cols-1 md:grid-cols-2 h-[300px] sm:h-[280px] md:h-[185px] lg:h-[220px] gap-5">
        {/* First Banner */}
        <div className="relative h-full rounded-2xl bg-banner1 overflow-hidden group">
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-black/50 to-black/50" />
          <div className="absolute inset-0 p-8 flex flex-col justify-between items-end text-right">
            <div className={`transform transition-all duration-700 delay-300 max-w-[60%] ${
              isInView ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'
            }`}>
              <span className="inline-block bg-white/10 text-white text-sm px-4 py-1 rounded-full mb-4">
                MAIS VENDIDOS
              </span>
              <h1 className="text-white font-bold text-4xl mb-2 transform transition-all duration-700 delay-500">
                Nova coleção
              </h1>
              <p className="text-sm text-white/90 transform transition-all duration-700 delay-700">
                Liquidação com até 30% de desconto
              </p>
            </div>
            <button className="btn-arrow transform translate-y-20 opacity-0 motion-safe:animate-slideUp bg-white rounded-full flex gap-2 p-2 px-4">
              <span>Ver Agora</span>
              <span className="arrow-icon">
                <ArrowRight className="w-4 h-4 text-white" />
              </span>
            </button>
          </div>
        </div>

        {/* Second Banner */}
        <div className="relative h-full rounded-2xl bg-banner2 overflow-hidden group">
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-black/50 to-black/50" />
          <div className="absolute inset-0 p-8 flex flex-col justify-between items-end text-right">
            <div className={`transform transition-all duration-700 delay-500 max-w-[60%] ${
              isInView ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'
            }`}>
              <span className="inline-block bg-white/10 text-white text-sm px-4 py-1 rounded-full mb-4">
                O VENDEDOR DO MÊS
              </span>
              <h1 className="text-white font-bold text-4xl mb-2 transform transition-all duration-700 delay-700">
                China Bluetooth
              </h1>
              <p className="text-sm text-white/90 transform transition-all duration-700 delay-900">
                Palestrante
              </p>
            </div>
            <button className="btn-arrow transform translate-y-20 opacity-0 motion-safe:animate-slideUp bg-white rounded-full flex gap-2 p-2 px-4">
              <span>Ver Agora</span>
              <span className="arrow-icon">
                <ArrowRight className="w-4 h-4 text-white" />
              </span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}