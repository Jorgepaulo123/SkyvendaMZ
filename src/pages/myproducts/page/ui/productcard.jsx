import React from 'react';
import { Link } from 'react-router-dom';
import { useState } from 'react';
import { Eye, Heart, MoreVertical, Pencil, Earth, Handshake, MessageCircle, Trash2, RefreshCcw, Clock, CheckCircle2, Sparkles } from 'lucide-react';
import { Button } from '../../../../components/ui/button';
import api from '../../../../api/api';
import { base_url } from '../../../../api/api';
import ConfirmDelete from '../../../../components/Dialogs/AlertDelete';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '../../../../components/ui/dropdown-menu';
import { useAuth } from '../../../../context/AuthContext';
import { useToast } from '../../../../hooks/use-toast';


export default function ProductCard({ product, onEdit, onDelete, onTurbo }) {
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [selectedProduct, setSelectedProduct] = useState(null);
    const [updatingProduct, setUpdatingProduct] = useState(false);
    const { token } = useAuth();
    const {toast} = useToast();

    const handleCloseDialog = () => {
        setIsDialogOpen(false);
        setSelectedProduct(null);
    };

    const handleNegociar = (product) => {
        setUpdatingProduct(true);
        api.put(`/produtos/${product.id}/negociavel?negociavel=true`, {}, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        })
        .then((res) => {
            console.log('Produto marcado como negociável:', res);
            // Atualizar o estado ou interface, se necessário
        })
        .catch((err) => {
            console.error('Erro ao tornar o produto negociável:', err);
        })
        .finally(() => {
            setUpdatingProduct(false);
        });
    };

    const handleActivateProduct = (product) => {
        setUpdatingProduct(true);
        api.post(`/produtos/${product.id}/renovar`, {}, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        })
        .then((res) => {
            toast({
                title: 'Produto ativado com sucesso',
            })

            // Update the product status if you have a callback from parent
            if (typeof onProductUpdate === 'function') {
                onProductUpdate({
                    ...product,
                    ativo: true,
                    expiration_date: res.data.nova_data_expiracao
                });
            }
        })
        .catch((err) => {

            toast({
                title: 'Erro ao ativar o produto',
            })
        })
        .finally(() => {
            setUpdatingProduct(false);
        });
    };

    function formatNumber(num) {
        if (num >= 1000000) {
            return (num / 1000000).toFixed(1) + 'M';
        }
        if (num >= 1000) {
            return (num / 1000).toFixed(1) + 'K';
        }
        return num.toString();
    }

    return (
        <div
            className="flex bg-white rounded-xl shadow-sm hover:shadow-md transition-all duration-200 overflow-hidden border border-gray-100"
            style={{ maxHeight: '130px', height: '100%', width: '100%' }}
        >
            <div className="relative w-1/3 shrink-0">
                <div className="h-full overflow-hidden">
                    <img
                        src={product.thumb}
                        onError={(e) => (e.target.src = `${base_url}/default.png`)}
                        alt={product.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
                    />
                </div>
                {product.views > 1000 && (
                    <div className="absolute top-2 left-2 bg-yellow-500 text-white px-2 py-1 rounded-full text-xs font-medium flex items-center gap-1">
                        <Sparkles className="w-3 h-3" />
                        Destaque
                    </div>
                )}
            </div>

            <div className="flex-grow p-2">
                <div className="flex items-start justify-between gap-2 mb-2">
                    <div className="truncate">
                        <div className="flex items-center gap-2 mb-1">
                            <span
                                className={`
                                    px-2 py-1 rounded-full text-xs font-medium flex items-center gap-1
                                    ${product.active ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}
                                `}
                            >
                                {product.active ? (
                                    <>
                                        <CheckCircle2 className="w-3 h-3" />
                                        Activo
                                    </>
                                ) : (
                                    <>
                                        <Clock className="w-3 h-3" />
                                        Desativado
                                    </>
                                )}
                            </span>
                        </div>
                        <h3
                            className="font-semibold text-gray-900 group-hover:text-blue-600 transition-colors truncate"
                            title={product.title}
                        >
                            {product.title}
                        </h3>
                    </div>

                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button
                                variant="ghost"
                                size="icon"
                                className="h-8 w-8 p-0 hover:bg-transparent text-gray-400 hover:text-gray-600"
                            >
                                <MoreVertical className="w-4 h-4" />
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="w-48">
                            <DropdownMenuItem onClick={() => onEdit(product)} className="gap-2">
                                <Pencil className="w-4 h-4" />
                                Editar
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => onTurbo(product)} className="gap-2">
                            <Earth className="w-4 h-4" />
                            Turbinar a boldada
                            </DropdownMenuItem>
                            {!product.ativo && (
                                <DropdownMenuItem 
                                    onClick={() => handleActivateProduct(product)} 
                                    className="gap-2"
                                    disabled={updatingProduct}
                                >
                                    <RefreshCcw className="w-4 h-4" />
                                    {updatingProduct ? 'Ativando...' : 'Ativar a bolada'}
                                </DropdownMenuItem>
                            )}
                            {!product.negociavel && (
                                <DropdownMenuItem onClick={() => handleNegociar(product)} className="gap-2">
                                    <Handshake className="w-4 h-4" />
                                    Tornar Negociável
                                </DropdownMenuItem>
                            )}
                            <DropdownMenuItem
                                onClick={() => {
                                    setSelectedProduct(product);
                                    setIsDialogOpen(true);
                                }}
                                className="text-red-600 gap-2"
                            >
                                <Trash2 className="w-4 h-4" />
                                Excluir
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                </div>

                <div className="flex flex-wrap items-center gap-2 mb-3 text-xs text-gray-600">
                    <span className="flex items-center gap-1 bg-gray-50 px-2 py-1 rounded-full">
                        <Eye className="w-3 h-3" />
                        {formatNumber(product.views)}
                    </span>
                    <span className="flex items-center gap-1 bg-gray-50 px-2 py-1 rounded-full">
                        <Heart className="w-3 h-3" />
                        {formatNumber(product.likes)}
                    </span>
                    <span className="flex items-center gap-1 bg-gray-50 px-2 py-1 rounded-full">
                        <MessageCircle className="w-3 h-3" />
                        {product?.comments?.length || 0}
                    </span>
                </div>

                <div className="flex items-center gap-1 text-xs text-gray-500 truncate">
                    <Clock className="w-3 h-3" />
                    <span>Publicado a {product.time}</span>
                </div>
            </div>

            <ConfirmDelete
                isOpen={isDialogOpen}
                onClose={handleCloseDialog}
                product={selectedProduct}
                onDelete={onDelete}
            />
        </div>
    );
}
