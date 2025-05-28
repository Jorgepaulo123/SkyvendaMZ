import React, { useState, useEffect, useContext } from "react";
import { AuthContext } from "../../context/AuthContext";
import { HomeContext } from "../../context/HomeContext";
import api from "../../api/api";
import 'react-quill/dist/quill.snow.css';
import { useToast } from "../../hooks/use-toast";
import Page1 from './page/page1';
import { Page2 } from './page/page2';
import Page3 from './page/Page3';

export default function MyProducts() {
  const [loading, setLoading] = useState(true);
  const { myproducts, addProducts } = useContext(HomeContext);
  const {  token } = useContext(AuthContext);
  const [page, setPage] = useState(1);
  const [selectedProduct, setSelectedProduct] = useState(null);
  
  // States for each input field
  const [productName, setProductName] = useState('');
  const [price, setPrice] = useState('');
  const [category, setCategory] = useState('');
  const [stock, setStock] = useState('');
  const [estado, setEstado] = useState('');
  const [type, setType] = useState('');
  const [description, setDescription] = useState('');
  const [content, setContent] = useState('');
  


  useEffect(() => {
    if (selectedProduct) {
      setProductName(selectedProduct.title || '');
      setPrice(selectedProduct.price || '');
      setCategory(selectedProduct.category || '');
      setStock(selectedProduct.stock || 0);
      setEstado(selectedProduct.estado || '');
      setType(selectedProduct.type || '');
      setDescription(selectedProduct.description || '');
      setContent(selectedProduct.content || '');
    }
  }, [selectedProduct]);
  const handleEdit = (product) => {
    setSelectedProduct(product);
    setPage(2);
  };
  const handleTurbo=(product)=>{
    setSelectedProduct(product);
    setPage(3);
    
  }



  useEffect(() => {
    if (!token && myproducts) return;
    if(myproducts?.length>=1){
      setLoading(false)
    }else{
      api.get(`produtos/produtos/?skip=0&limit=20`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((res) => {
        addProducts(Array.isArray(res.data.produtos) ? res.data.produtos : []);
      })
      .catch((err) => {
        console.error('Erro ao buscar produtos:', err);
        addProducts([]);
      })
      .finally(() => setLoading(false));
    }

    
  }, [token]);

  

  return (
    <div className="p-4 overflow-hidden">
      {page === 1 ? (
        <Page1 loading={loading} myproducts={myproducts} handleEdit={handleEdit} handleTurbo={handleTurbo}/>
      ) : page==2 ?(
        <Page2
          selectedProduct={selectedProduct}
          onBack={() => setPage(1)}
          token={token}
          setSelectedProduct={setSelectedProduct}
  />
      ):(
        <>
          {selectedProduct && (
            <Page3 
            selectedProduct={selectedProduct}
            onBack={() => setPage(1)}
            token={token}/>
          )}
        </>
      )}
    </div>
  );
}