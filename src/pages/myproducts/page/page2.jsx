import React, { useEffect, useState, useRef, useContext } from 'react';
import 'react-quill/dist/quill.snow.css';
import ReactQuill from 'react-quill';

import { Input } from '@/components/ui/input';
import { Label } from "@/components/ui/label";
import { useToast } from '../../../hooks/use-toast';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { CATEGORIES,SUBCATEGORIES } from '../../../data/consts';
import api from '../../../api/api';
import { ArrowLeft, Pencil, ImageIcon, Loader } from 'lucide-react';
import { HomeContext } from '../../../context/HomeContext';
import { AdsColumn } from '../../../components/ads/ads_column';
import { base_url } from '../../../data/consts';


export function Page2({ selectedProduct, onBack, token,setSelectedProduct}) {
  const [productName, setProductName] = useState('');
  const [price, setPrice] = useState('');
  const [category, setCategory] = useState('');
  const [stock, setStock] = useState('');
  const [estado, setEstado] = useState('');
  const [type, setType] = useState('');
  const [description, setDescription] = useState('');
  const [content, setContent] = useState('');
  const [saveLoading, setSaveLoading] = useState(false);
  const { toast } = useToast();
  const [isHovering, setIsHovering] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);
  const fileInputRef = useRef(null);
  const {changeImage,addProducts,ads}=useContext(HomeContext)
  const [updatingImage, setUpdatingImage] = useState(false);

  const handleContentChange = (value) => {
    setContent(value);
  };

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



  const handleImageClick = () => {
    if (isEditing) {
      handlePostImage();
    } else {
      fileInputRef.current?.click();
    }
  };
  const handleImageSelect = async (event) => {
    const file = event.target.files[0];
    if (file) {
      setSelectedImage(file);
      setIsEditing(true);
      setUpdatingImage(true);
      
      const formData = new FormData();
      formData.append('capa', file);

      try {
        const res = await api.put(`/produtos/${selectedProduct?.slug}/capa`, formData, {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'multipart/form-data'
          }
        });
        
        changeImage(selectedProduct.slug, res.data.capa);
        setSelectedProduct({
          ...selectedProduct,
          thumb: res.data.capa
        });

        toast({
          title: "Imagem atualizada com sucesso!",
          description: "A nova imagem foi salva.",
        });

        setIsEditing(false);
        setSelectedImage(null);
      } catch (error) {
        toast({
          title: "Erro ao atualizar imagem",
          description: "Tente novamente mais tarde.",
          variant: "destructive",
        });
      } finally {
        setUpdatingImage(false);
      }
    }
  };
  
  const handlePostImage = async () => {
    if (!selectedImage) return;

    const formData = new FormData();
    formData.append('capa', selectedImage);

    try {
      const res = await api.put(`/produtos/${selectedProduct?.slug}/capa`, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'multipart/form-data'
        }
      });
      
      changeImage(selectedProduct.slug, res.data.capa);
      setSelectedProduct({
        ...selectedProduct,
        thumb: res.data.capa
      });

      toast({
        title: "Imagem atualizada com sucesso!",
        description: "A nova imagem foi salva.",
      });
      setIsEditing(false);
      setSelectedImage(null);
    } catch (error) {
      toast({
        title: "Erro ao atualizar imagem",
        description: "Tente novamente mais tarde.",
        variant: "destructive",
      });
    }
  };

  const handleSubmit = async () => {
    const formData = new FormData();
    // Always send name and text fields
    if (productName !== undefined && productName !== null) formData.append('nome', String(productName));
    if (estado) formData.append('estado', String(estado));
    if (description !== undefined && description !== null) formData.append('descricao', String(description));
    if (content !== undefined && content !== null) formData.append('detalhes', String(content));
    if (type) formData.append('tipo', String(type));
    if (category) formData.append('categoria', String(category));
    if (typeof selectedProduct?.disponiblidade === 'string') {
      formData.append('disponiblidade', selectedProduct.disponiblidade);
    }

    // Only send numeric fields if user provided a finite number
    const priceNum = price === '' ? null : Number(price);
    if (priceNum !== null && Number.isFinite(priceNum)) {
      formData.append('preco', String(priceNum));
    }
    const stockNum = stock === '' ? null : Number(parseInt(stock));
    if (stockNum !== null && Number.isFinite(stockNum)) {
      formData.append('quantidade_estoque', String(stockNum));
    }
    setSaveLoading(true);

    try {
      const res = await api.put(`/produtos/${selectedProduct?.slug}`, formData, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      const updatedProduct = {
        ...selectedProduct,
        title: productName,
        price: parseFloat(price),
        stock: parseInt(stock),
        estado: estado,
        description: description,
        content: content,
        type: type,
        category: category
      };
      
      addProducts(prevProducts => 
        prevProducts.map(product => 
          product.slug === selectedProduct.slug ? updatedProduct : product
        )
      );

      toast({
        title: "Produto atualizado com sucesso!",
        description: "As alterações foram salvas.",
      });
      onBack();
    } catch (err) {
      toast({
        title: "Erro ao atualizar produto",
        description: "Tente novamente mais tarde.",
        variant: "destructive",
      });
    } finally {
      setSaveLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow h-[calc(100vh-100px)] overflow-y-auto">
      <div className="p-4 border-b sticky top-0 bg-white z-10">
        <div className="flex items-center gap-2">
          <button
            className="flex justify-center items-center hover:bg-indigo-100 rounded-full p-2 transition-colors"
            onClick={onBack}
            aria-label="Voltar"
          >
            <ArrowLeft className="h-5 w-5 text-indigo-600" />
          </button>
          <div className="flex items-center gap-2">
            <Pencil className="h-6 w-6 text-indigo-600" />
            <h2 className="text-xl font-semibold text-gray-900">
              Editar Produto - <span className="font-bold text-indigo-600 ">{selectedProduct?.title}</span>
            </h2>
          </div>
        </div>
      </div>
      {selectedProduct && (
        <div className="flex flex-col lg:flex-row gap-6 p-4">
          <div 
            className="relative w-full lg:w-[500px] h-[500px] bg-gray-100 rounded-lg overflow-hidden"
            onMouseEnter={() => setIsHovering(true)}
            onMouseLeave={() => setIsHovering(false)}
          >
            <img
              src={selectedImage ? URL.createObjectURL(selectedImage) : `${selectedProduct?.thumb}`}
              onError={(e) => e.target.src = `${base_url}/default.png`}
              alt={selectedProduct?.title}
              className="w-full h-full object-cover border"
            />
            
            {(isHovering || isEditing) && (
              <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                <Button
                  onClick={handleImageClick}
                  className="bg-white text-black hover:bg-gray-200 flex items-center gap-2"
                  disabled={updatingImage}
                >
                  {updatingImage ? (
                    <Loader className="h-5 w-5 animate-spin" />
                  ) : (
                    <ImageIcon className="h-5 w-5" />
                  )}
                  {isEditing ? 'Guardar Imagem' : 'Editar Imagem'}
                </Button>
              </div>
            )}
            
            <input
              type="file"
              ref={fileInputRef}
              className="hidden"
              accept="image/*"
              onChange={handleImageSelect}
            />
          </div>

          <div className="flex-1 space-y-6 h-[500px] w-[400px] flex">
            <div className="space-y-4 overflow-y-scroll h-[500px] w-full px-5">
              <div>
                <Label htmlFor="productName">Nome do Produto</Label>
                <Input
                  id="productName"
                  type="text"
                  value={productName}
                  onChange={(e) => setProductName(e.target.value)}
                  placeholder="Ex: iPhone 14 Pro"
                  className="mt-1"
                />
              </div>

              <div>
                <Label htmlFor="price">Preço</Label>
                <Input
                  id="price"
                  type="number"
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                  placeholder="0.00"
                  className="mt-1"
                />
              </div>

              <div>
                <Label htmlFor="category">Categoria</Label>
                <Select value={category} onValueChange={(value) => setCategory(value)}>
                  <SelectTrigger className="mt-1">
                    <SelectValue placeholder="Selecione uma categoria" />
                  </SelectTrigger>
                  <SelectContent>
                    {CATEGORIES.map((cat) => (
                      <SelectItem key={cat} value={cat}>
                        {cat}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="type">Subcategoria</Label>
                <Select value={type} onValueChange={(value) => setType(value)}>
                  <SelectTrigger className="mt-1">
                    <SelectValue placeholder="Selecione uma subcategoria" />
                  </SelectTrigger>
                  <SelectContent>
                    {category && SUBCATEGORIES[category]?.map((subcat) => (
                      <SelectItem key={subcat} value={subcat}>
                        {subcat}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="stock">Quantidade em Estoque</Label>
                <Input
                  id="stock"
                  type="number"
                  value={stock}
                  onChange={(e) => setStock(e.target.value)}
                  placeholder="0"
                  className="mt-1"
                />
              </div>

              <div>
                <Label htmlFor="estado">Estado</Label>
                <Select value={estado} onValueChange={(value) => setEstado(value)}>
                  <SelectTrigger className="mt-1">
                    <SelectValue placeholder="Selecione o estado" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Novo">Novo</SelectItem>
                    <SelectItem value="Bolada">Bolada</SelectItem>
                    <SelectItem value="Seminovo">Seminovo</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="content">Detalhes</Label>
                <div className="mt-1">
                  <ReactQuill
                    theme="snow"
                    value={content}
                    onChange={handleContentChange}
                    className="h-64"
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="description">Descrição</Label>
                <textarea
                  id="description"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full mt-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                  rows="4"
                  placeholder="Descreva seu produto..."
                />
              </div>
            </div>

            <div className="bg-white p-4 border-t w-[500px] flex justify-center items-center flex-col gap-2">
              {!saveLoading ? (
                <Button onClick={handleSubmit} className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-semibold">
                  Salvar Alterações
                </Button>
              ) : (
                <Button className="w-full opacity-50 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold">
                  Salvando...
                </Button>
              )}
              <AdsColumn ads={ads}/>
              
            </div>
          </div>
        </div>
      )}
    </div>
  );
}