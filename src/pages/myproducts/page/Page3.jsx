import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Rocket } from 'lucide-react';
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import api from '../../../api/api';
import { useToast } from '../../../hooks/use-toast';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

// Pricing configuration
const PRICING = {
  ofertas_diarias: {
    price: 100,
    label: 'Oferta Diária',
    value: 'ofertas_diarias'
  },
  melhores_boladas: {
    price: 150,
    label: 'Melhores Boladas',
    value: 'melhores_boladas'
  },
  para_si: {
    price: 80,
    label: 'Para Si',
    value: 'para_si'
  }
};

const formatCurrency = (value) => {
  return new Intl.NumberFormat('pt-MZ', {
    style: 'currency',
    currency: 'MZN'
  }).format(value);
};

const calculateTotal = (tipo, dias) => {
  return PRICING[tipo].price * dias;
};

export default function Page3({ selectedProduct, onBack, token }) {
  // Individual state constants for each input
  const [titulo, setTitulo] = useState(selectedProduct?.title || '');
  const [descricao, setDescricao] = useState(selectedProduct?.description || '');
  const [dias, setDias] = useState(1);
  const [tipo, setTipo] = useState('ofertas_diarias'); // Default to ofertas_diarias
  const [submitLoading, setSubmitLoading] = useState(false);
  const toast=useToast()

  const handleSubmit = (e) => {
    e.preventDefault()

    setSubmitLoading(true);
    const data = {
        titulo: titulo,
        descricao: descricao,
        dias: dias,
        tipo: tipo,
        produto_id: selectedProduct?.id,
      };

    
    api.post('/produtos/promover',data, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'accept': 'application/json',
        'Content-Type': 'application/json'
      }
    })
    .then((res) => {
      toast({
        title:"Produto Promovido com sucesso"
      })
    })
    .catch((err) => {
      console.log("erro ao turbinar", err);
    })
    .finally(() => {
      setSubmitLoading(false);
    });
  };

  // Pricing Summary Component
  const PricingSummary = () => {
    const pricePerDay = PRICING[tipo].price;
    const total = calculateTotal(tipo, dias);

    return (
      <div className="mt-6 space-y-4 p-4 bg-indigo-50 rounded-lg">
        <div className="flex justify-between text-sm">
          <span className="text-gray-600">Preço por dia:</span>
          <span className="font-medium">{formatCurrency(pricePerDay)}</span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-gray-600">Duração:</span>
          <span className="font-medium">{dias} {dias === 1 ? 'dia' : 'dias'}</span>
        </div>
        <div className="pt-4 border-t border-indigo-100">
          <div className="flex justify-between">
            <span className="font-semibold text-gray-900">Total:</span>
            <span className="font-bold text-lg text-indigo-600">{formatCurrency(total)}</span>
          </div>
        </div>
      </div>
    );
  };

  // Ad Preview Component
  const AdPreview = () => (
    <Card className="w-full bg-white shadow-md">
      <CardHeader>
        <CardTitle className="text-lg font-semibold">Preview do Anúncio</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <h3 className="text-xl font-bold text-gray-900">{titulo || 'Título do anúncio'}</h3>
          <p className="text-gray-600 text-sm">{descricao || 'Descrição do anúncio'}</p>
        </div>
        
        <div className="flex gap-2">
          <Badge variant="secondary">
            {dias} {dias === 1 ? 'dia' : 'dias'}
          </Badge>
          <Badge variant="outline">{PRICING[tipo].label}</Badge>
        </div>

        <div className="mt-4 p-4 bg-gray-50 rounded-lg">
          <p className="text-sm text-gray-500">
            Seu anúncio aparecerá em destaque por {dias} {dias === 1 ? 'dia' : 'dias'} na seção de {PRICING[tipo].label}
          </p>
        </div>

        <PricingSummary />
      </CardContent>
    </Card>
  );

  // Turbo Form Component
  const TurboForm = () => (
    <Card className="w-full bg-white shadow-md">
      <CardHeader>
        <CardTitle className="text-lg font-semibold">Detalhes do Anúncio</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-4">
            <Input
              placeholder="Título do anúncio"
              value={titulo}
              onChange={(e) => setTitulo(e.target.value)}
            />
            
            <Textarea
              placeholder="Descrição do anúncio"
              value={descricao}
              onChange={(e) => setDescricao(e.target.value)}
              className="min-h-[120px] resize-none"
            />

            <Select 
              value={dias.toString()} 
              onValueChange={(value) => setDias(parseInt(value))}
            >
              <SelectTrigger>
                <SelectValue placeholder="Selecione a duração" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="1">1 dia</SelectItem>
                <SelectItem value="2">2 dias</SelectItem>
                <SelectItem value="3">3 dias</SelectItem>
                <SelectItem value="4">4 dias</SelectItem>
              </SelectContent>
            </Select>

            <Select 
              value={tipo} 
              onValueChange={setTipo}
            >
              <SelectTrigger>
                <SelectValue placeholder="Selecione o posicionamento" />
              </SelectTrigger>
              <SelectContent>
                {Object.entries(PRICING).map(([key, { label, price }]) => (
                  <SelectItem key={key} value={key}>
                    {label} - {formatCurrency(price)}/dia
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Button 
              type="submit"
              className={`w-full bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-6 ${submitLoading ? 'opacity-50' : ''}`}
              disabled={submitLoading}
            >
              <Rocket className="mr-2 h-5 w-5" />
              {submitLoading ? 'Turbinando...' : 'Turbinar Agora'}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );

  return (
    <div className="bg-gray-50 rounded-lg shadow-lg min-h-[calc(100vh-100px)] overflow-y-auto">
      <div className="p-4 sm:p-6 border-b sticky top-0 bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/80 z-10">
        <div className="flex items-center gap-3">
          <button
            className="flex justify-center items-center hover:bg-indigo-100 rounded-full p-2 transition-colors"
            onClick={onBack}
            aria-label="Voltar"
          >
            <ArrowLeft className="h-5 w-5 text-indigo-600" />
          </button>
          <div className="flex items-center gap-2">
            <Rocket className="h-6 w-6 text-indigo-600 animate-pulse" />
            <h2 className="text-xl font-semibold text-gray-900">
              Turbinar a bolada - <span className="font-bold text-indigo-600">{selectedProduct?.title}</span>
            </h2>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto p-4 sm:p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <AdPreview />
          <TurboForm />
        </div>
      </div>
    </div>
  );
}