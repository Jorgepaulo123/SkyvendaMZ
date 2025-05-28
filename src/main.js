import './index.css';
import { setupCounter } from './counter.js';
import { renderProducts } from './products.js';

document.querySelector('#app').innerHTML = `
  <div class="container mx-auto px-4 py-8">
    <header class="mb-8">
      <h1 class="text-4xl font-bold text-center text-blue-600">SkyVenda MZ</h1>
      <p class="text-xl text-center text-gray-600">Seu E-commerce de Confiança</p>
    </header>
    <main>
      <div id="products" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"></div>
    </main>
  </div>
  
`;

renderProducts();
