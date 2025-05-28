import React from 'react';
import { useParams } from 'react-router-dom';

function CategoryPage() {
  const { categoria, subcategoria } = useParams();

  return (
    <div>
      <h1>A categoria é: {categoria}</h1>
      <h2>A subcategoria é: {subcategoria}</h2>
    </div>
  );
}

export default CategoryPage;
