import React, { useEffect, useState } from 'react';
import { Avatar, AvatarFallback, AvatarImage } from '../components/ui/avatar';
import { Send, Heart, MessageCircle, MoreHorizontal, ChevronLeft, ChevronRight, Pencil, Trash2 } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import api from '../api/api';
import { useToast } from '../hooks/use-toast';
import { cn } from '../lib/utils';
import { Button } from '../components/ui/button';
import { Link } from 'react-router-dom';
import { AdsColumn } from '../components/ads/ads_column';

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../components/ui/dropdown-menu";
import { Label } from "../components/ui/label";
import { Input } from "../components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../components/ui/select";

export default function PublicationsPage() {
  const [publications, setPublications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [publicationText, setPublicationText] = useState('');
  const [commentText, setCommentText] = useState('');
  const [currentPublication, setCurrentPublication] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [perPage] = useState(10);
  const [showComments, setShowComments] = useState(false);
  const [comments, setComments] = useState([]);
  const [loadingComments, setLoadingComments] = useState(false);
  const [gradientStyle, setGradientStyle] = useState('');
  const [showPublicationDialog, setShowPublicationDialog] = useState(false);
  const [bestBoladas, setBestBoladas] = useState([]);
  const [loadingAds, setLoadingAds] = useState(false);
  const { user, token } = useAuth();
  const { toast } = useToast();

  // Gradient styles array
  const gradientStyles = [
    'bg-gradient-to-r from-pink-600 via-purple-600 to-blue-600',
    'bg-gradient-to-r from-green-500 via-teal-500 to-blue-500',
    'bg-gradient-to-r from-orange-500 via-red-500 to-pink-500',
    'bg-gradient-to-r from-blue-500 via-cyan-500 to-teal-500',
    'bg-gradient-to-r from-purple-500 via-pink-500 to-red-500'
  ];

  // Function to get random gradient style
  const getRandomGradient = () => {
    const randomIndex = Math.floor(Math.random() * gradientStyles.length);
    return gradientStyles[randomIndex];
  };

  // Set document title
  useEffect(() => {
    document.title = "Publicações | SkyVenda MZ";
  }, []);

  // Fetch publications
  const fetchPublications = async (page = 1) => {
    try {
      setLoading(true);
      const response = await api.get('/publicacoes/listar', {
        params: {
          page,
          per_page: perPage,
          user_id: user?.id // Send user_id as query parameter
        },
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      // Use the liked field from the API response
      const publicacoesProcessadas = response.data.publicacoes.map(pub => ({
        ...pub,
        deu_like: pub.liked, // API returns 'liked' field
        likes_count: pub.likes_count,
        comentarios_count: pub.comentarios_count
      }));

      setPublications(publicacoesProcessadas);
      setTotalPages(response.data.total_pages);
      setCurrentPage(response.data.current_page);
    } catch (error) {
      console.error('Error fetching publications:', error);
      toast({
        variant: "destructive",
        title: "Erro",
        description: "Não foi possível carregar as publicações"
      });
      setPublications([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPublications(currentPage);
  }, [currentPage, perPage, token]);

  // Fetch "melhores boladas" ads
  useEffect(() => {
    let isMounted = true;
    const loadAds = async () => {
      try {
        setLoadingAds(true);
        const res = await api.get('/produtos/anuncios/tipo', {
          params: { tipo_anuncio: 'melhores_boladas', limit: 10 },
        });
        if (isMounted) {
          const data = Array.isArray(res?.data) ? res.data : [];
          setBestBoladas(data);
        }
      } catch (err) {
        console.error('Erro ao buscar melhores boladas:', err);
      } finally {
        if (isMounted) setLoadingAds(false);
      }
    };
    loadAds();
    return () => {
      isMounted = false;
    };
  }, [token]);

  // Handle page change
  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setCurrentPage(newPage);
    }
  };

  // Submit new publication
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!publicationText.trim()) {
      toast({
        variant: "destructive",
        title: "Campo vazio",
        description: "Por favor, escreva algo para publicar."
      });
      return;
    }

    if (publicationText.trim().split(' ').length > 10) {
      toast({
        variant: "destructive",
        title: "Texto muito longo",
        description: "A publicação não pode ter mais de 10 palavras."
      });
      return;
    }

    try {
      setIsSubmitting(true);
      const formData = new URLSearchParams();
      formData.append('conteudo', publicationText);

      if (currentPublication) {
        // Edit existing publication
        await api.put(`/publicacoes/${currentPublication.id}`, formData, {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/x-www-form-urlencoded'
          }
        });

        // Update the publication in the state
        setPublications(prevPublications => {
          return prevPublications.map(pub => {
            if (pub.id === currentPublication.id) {
              return {
                ...pub,
                conteudo: publicationText
              };
            }
            return pub;
          });
        });

        toast({
          variant: "success",
          title: "Atualizado!",
          description: "Sua publicação foi atualizada com sucesso."
        });
      } else {
        // Create new publication
        formData.append('gradient_style', getRandomGradient());
        await api.post('/publicacoes/form', formData, {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/x-www-form-urlencoded'
          }
        });

        // Refresh publications after posting
        await fetchPublications(1);

        toast({
          variant: "success",
          title: "Publicado!",
          description: "Sua publicação foi criada com sucesso."
        });
      }

      // Reset form
      setPublicationText('');
      setCurrentPublication(null);
      setShowPublicationDialog(false);
    } catch (error) {
      console.error('Error with publication:', error);
      toast({
        variant: "destructive",
        title: currentPublication ? "Erro ao atualizar" : "Erro ao publicar",
        description: error.response?.data?.detail || `Não foi possível ${currentPublication ? 'atualizar' : 'criar'} a publicação.`
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handle like
  const handleLike = async (publicationId) => {
    if (!user) {
      toast({
        variant: "destructive",
        title: "Erro",
        description: "Você precisa estar logado para curtir uma publicação"
      });
      return;
    }

    try {
      await api.post(`/publicacoes/${publicationId}/like`, {}, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      // Update the publications state to reflect the like
      setPublications(prevPublications => {
        return prevPublications.map(pub => {
          if (pub.id === publicationId) {
            const newDeuLike = !pub.deu_like;
            return {
              ...pub,
              deu_like: newDeuLike,
              likes_count: newDeuLike ? pub.likes_count + 1 : pub.likes_count - 1
            };
          }
          return pub;
        });
      });
    } catch (error) {
      console.error('Error liking publication:', error);
      toast({
        variant: "destructive",
        title: "Erro",
        description: "Não foi possível curtir a publicação"
      });
    }
  };

  // Delete publication
  const handleDeletePublication = async (publicationId) => {
    if (!window.confirm("Tem certeza que deseja excluir esta publicação?")) {
      return;
    }

    try {
      await api.delete(`/publicacoes/${publicationId}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      // Remove the publication from the list
      setPublications(prev => prev.filter(pub => pub.id !== publicationId));

      toast({
        variant: "success",
        title: "Publicação excluída",
        description: "Sua publicação foi excluída com sucesso."
      });
    } catch (error) {
      console.error('Error deleting publication:', error);
      toast({
        variant: "destructive",
        title: "Erro",
        description: "Não foi possível excluir a publicação."
      });
    }
  };

  // View comments for a publication
  const handleViewComments = async (publicationId) => {
    setCurrentPublication(publicationId);
    setShowComments(true);
    setLoadingComments(true);

    try {
      const response = await api.get(`/publicacoes/${publicationId}/comentarios`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      setComments(response.data);
    } catch (error) {
      console.error('Error fetching comments:', error);
      toast({
        variant: "destructive",
        title: "Erro",
        description: "Não foi possível carregar os comentários"
      });
      setComments([]);
    } finally {
      setLoadingComments(false);
    }
  };

  // Add comment to a publication
  const handleAddComment = async (e) => {
    e.preventDefault();

    if (!commentText.trim()) {
      toast({
        variant: "destructive",
        title: "Campo vazio",
        description: "Por favor, escreva algo para comentar."
      });
      return;
    }

    try {
      setIsSubmitting(true);
      const response = await api.post(`/publicacoes/${currentPublication}/comentarios`, 
        new URLSearchParams({ conteudo: commentText }), // Send as form data
        {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/x-www-form-urlencoded'
          }
        }
      );

      // Add the new comment to the list
      setComments(prev => [response.data.comentario, ...prev]);

      // Update comment count in the publication
      setPublications(prevPublications => {
        return prevPublications.map(pub => {
          if (pub.id === currentPublication) {
            return {
              ...pub,
              comentarios_count: (pub.comentarios_count || 0) + 1
            };
          }
          return pub;
        });
      });

      // Clear comment text
      setCommentText('');

      toast({
        variant: "success",
        title: "Comentário adicionado",
        description: "Seu comentário foi adicionado com sucesso."
      });
    } catch (error) {
      console.error('Error adding comment:', error);
      toast({
        variant: "destructive",
        title: "Erro",
        description: "Não foi possível adicionar o comentário."
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  // Close comments modal
  const handleCloseComments = () => {
    setShowComments(false);
    setComments([]);
    setCurrentPublication(null);
    setCommentText('');
  };

  // Delete comment
  const handleDeleteComment = async (commentId) => {
    if (!window.confirm("Tem certeza que deseja excluir este comentário?")) {
      return;
    }

    try {
      await api.delete(`/publicacoes/comentarios/${commentId}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      // Remove the comment from the list
      setComments(prev => prev.filter(comment => comment.id !== commentId));

      // Update comment count in the publication
      setPublications(prevPublications => {
        return prevPublications.map(pub => {
          if (pub.id === currentPublication) {
            return {
              ...pub,
              comentarios_count: Math.max(0, (pub.comentarios_count || 0) - 1)
            };
          }
          return pub;
        });
      });

      toast({
        variant: "success",
        title: "Comentário excluído",
        description: "Seu comentário foi excluído com sucesso."
      });
    } catch (error) {
      console.error('Error deleting comment:', error);
      toast({
        variant: "destructive",
        title: "Erro",
        description: "Não foi possível excluir o comentário."
      });
    }
  };

  // Handle share
  const handleShare = async (publicationId) => {
    try {
      await api.post(`/publicacoes/${publicationId}/share`, {}, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      // Update the publications state to reflect the share
      setPublications(prevPublications => {
        return prevPublications.map(pub => {
          if (pub.id === publicationId) {
            return {
              ...pub,
              shares_count: (pub.shares_count || 0) + 1
            };
          }
          return pub;
        });
      });

      toast({
        title: "Compartilhado!",
        description: "Publicação compartilhada com sucesso."
      });
    } catch (error) {
      console.error('Error sharing publication:', error);
      toast({
        variant: "destructive",
        title: "Erro",
        description: "Não foi possível compartilhar a publicação"
      });
    }
  };

  // Add these new functions
  const handleEditPublication = async (publication) => {
    // Implement edit logic
    setPublicationText(publication.conteudo);
    setCurrentPublication(publication);
    setShowPublicationDialog(true);
  };

  const handleReportPublication = async (publicationId) => {
    toast({
      title: "Reportar publicação",
      description: "Funcionalidade em desenvolvimento.",
    });
  };

  // Render pagination controls
  const renderPagination = () => {
    return (
      <div className="flex items-center justify-center space-x-2 mt-6 mb-8">
        <Button
          variant="outline"
          size="sm"
          onClick={() => handlePageChange(currentPage - 1)}
          disabled={currentPage === 1 || loading}
        >
          <ChevronLeft className="h-4 w-4" />
        </Button>

        <div className="flex items-center space-x-1">
          {[...Array(totalPages)].map((_, index) => {
            const pageNumber = index + 1;
            // Show only current page, first, last, and one page before and after current
            if (
              pageNumber === 1 ||
              pageNumber === totalPages ||
              (pageNumber >= currentPage - 1 && pageNumber <= currentPage + 1)
            ) {
              return (
                <Button
                  key={pageNumber}
                  variant={currentPage === pageNumber ? "default" : "outline"}
                  size="sm"
                  onClick={() => handlePageChange(pageNumber)}
                  disabled={loading}
                  className={cn(
                    "min-w-[2rem]",
                    currentPage === pageNumber && "bg-blue-500 text-white hover:bg-blue-600"
                  )}
                >
                  {pageNumber}
                </Button>
              );
            } else if (
              pageNumber === currentPage - 2 ||
              pageNumber === currentPage + 2
            ) {
              return <span key={pageNumber}>...</span>;
            }
            return null;
          })}
        </div>

        <Button
          variant="outline"
          size="sm"
          onClick={() => handlePageChange(currentPage + 1)}
          disabled={currentPage === totalPages || loading}
        >
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>
    );
  };

  // Render comments section
  const renderComments = () => {
    if (!showComments) return null;

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-lg shadow-lg w-full max-w-lg max-h-[80vh] flex flex-col">
          <div className="p-4 border-b border-gray-100 flex items-center justify-between">
            <h3 className="text-lg font-medium">Comentários</h3>
            <button 
              onClick={handleCloseComments}
              className="text-gray-500 hover:text-gray-700"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          <div className="p-4 border-b border-gray-100">
            <form onSubmit={handleAddComment} className="flex space-x-2">
              <input
                type="text"
                value={commentText}
                onChange={(e) => setCommentText(e.target.value)}
                placeholder="Escreva um comentário..."
                className="flex-1 px-3 py-2 border rounded-lg"
                disabled={isSubmitting}
              />
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? "Enviando..." : "Enviar"}
              </Button>
            </form>
          </div>

          <div className="flex-1 overflow-y-auto p-4">
            {loadingComments ? (
              <div className="flex justify-center items-center h-32">
                <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-500"></div>
              </div>
            ) : comments.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-gray-500">Nenhum comentário ainda. Seja o primeiro a comentar!</p>
              </div>
            ) : (
              <div className="space-y-4">
                {comments.map((comment) => (
                  <div key={comment.id} className="bg-gray-50 rounded-lg p-3">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center space-x-2">
                        <Avatar className="h-6 w-6">
                          <AvatarImage 
                            src={comment.usuario?.foto_perfil} 
                            alt={comment.usuario?.nome} 
                          />
                          <AvatarFallback>
                            {comment.usuario?.nome?.charAt(0).toUpperCase() || "U"}
                          </AvatarFallback>
                        </Avatar>
                        <span className="font-medium text-sm">{comment.usuario?.nome || comment.usuario?.username}</span>
                        <span className="text-xs text-gray-500">
                          {comment.data_criacao ? new Date(comment.data_criacao).toLocaleString() : "Agora"}
                        </span>
                      </div>

                      {/* Delete button - only show for user's own comments */}
                      {user && comment.usuario && comment.usuario.id === user.id && (
                        <button 
                          onClick={() => handleDeleteComment(comment.id)}
                          className="text-gray-400 hover:text-red-500 transition-colors"
                          title="Excluir comentário"
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                          </svg>
                        </button>
                      )}
                    </div>
                    <p className="text-gray-700 text-sm">{comment.conteudo}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    );
  };

  // Render publications
  const renderPublications = () => {
    if (loading) {
      return (
        <div className="bg-white rounded-lg shadow-sm p-8 text-center mb-6">
          <div className="animate-pulse flex flex-col items-center">
            <div className="h-12 w-12 bg-gray-200 rounded-full mb-3"></div>
            <div className="h-4 w-48 bg-gray-200 rounded mb-2"></div>
            <div className="h-3 w-32 bg-gray-200 rounded"></div>
          </div>
        </div>
      );
    }

    if (!publications || publications.length === 0) {
      return (
        <div className="text-center py-10">
          <MessageCircle className="h-12 w-12 mx-auto mb-3 text-gray-300" />
          <h3 className="text-lg font-medium text-gray-700 mb-1">Nenhuma publicação encontrada</h3>
          <p className="text-gray-500">Seja o primeiro a compartilhar uma ideia!</p>
        </div>
      );
    }

    return publications.map((publication, index) => {
      // Use o gradiente da publicação ou um padrão se não existir
      const gradientClass = publication.gradient_style || 'bg-gradient-to-r from-pink-600 via-purple-600 to-blue-600';

      const publicationCard = (
        <div
          key={`pub-${publication.id}`}
          className={`rounded-lg border border-gray-100 shadow-sm overflow-hidden transition-all hover:shadow-md mb-6 ${gradientClass}`}
        >
          {/* Header with user info */}
          <div className="flex items-center justify-between p-4 border-b border-white/10">
            <div className="flex items-center space-x-3">
              <Avatar className="h-10 w-10 ring-2 ring-white">
                <AvatarImage
                  src={publication.usuario?.foto_perfil}
                  alt={publication.usuario?.nome}
                />
                <AvatarFallback>
                  {publication.usuario?.nome?.charAt(0).toUpperCase() || "U"}
                </AvatarFallback>
              </Avatar>
              <div>
                <p className="font-medium leading-none text-white">{publication.usuario?.nome || publication.usuario?.username}</p>
                <p className="text-xs text-white/70 mt-1">
                  {publication.tempo || "Agora mesmo"}
                </p>
              </div>
            </div>

            {/* Three dots menu */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button className="text-white/80 hover:text-white focus:outline-none">
                  <MoreHorizontal className="h-5 w-5" />
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-48">
                {user && publication.usuario?.id === user.id ? (
                  <>
                    <DropdownMenuItem
                      onClick={() => handleEditPublication(publication)}
                      className="flex items-center space-x-2 cursor-pointer"
                    >
                      <Pencil className="h-4 w-4" />
                      <span>Editar publicação</span>
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={() => handleDeletePublication(publication.id)}
                      className="flex items-center space-x-2 cursor-pointer text-red-600 focus:text-red-600"
                    >
                      <Trash2 className="h-4 w-4" />
                      <span>Eliminar publicação</span>
                    </DropdownMenuItem>
                  </>
                ) : (
                  <DropdownMenuItem
                    onClick={() => handleReportPublication(publication.id)}
                    className="flex items-center space-x-2 cursor-pointer"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4">
                      <path d="M13 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V9z"></path>
                      <polyline points="13 2 13 9 20 9"></polyline>
                    </svg>
                    <span>Reportar publicação</span>
                  </DropdownMenuItem>
                )}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          {/* Publication content */}
          <div className="p-6">
            <p className="text-white text-center text-xl font-semibold">{publication.conteudo}</p>
          </div>

          {/* Actions */}
          <div className="px-4 py-3 bg-white/10 backdrop-blur-md border-t border-white/20 flex items-center justify-between">
            <div className="flex items-center space-x-6">
              <button
                className={`flex items-center space-x-2 text-white/90 hover:text-red-300 transition-colors`}
                onClick={() => handleLike(publication.id)}
              >
                <Heart
                  className={`h-5 w-5 ${publication.deu_like ? 'fill-red-300' : ''}`}
                />
                <span className="text-sm font-medium">{publication.likes_count || 0}</span>
              </button>
              <button
                className="flex items-center space-x-2 text-white/90 hover:text-blue-300 transition-colors"
                onClick={() => handleViewComments(publication.id)}
              >
                <MessageCircle className="h-5 w-5" />
                <span className="text-sm font-medium">{publication.comentarios_count || 0}</span>
              </button>
              <button
                className="flex items-center space-x-2 text-white/90 hover:text-green-300 transition-colors"
                onClick={() => handleShare(publication.id)}
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5">
                  <path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8"></path>
                  <polyline points="16 6 12 2 8 6"></polyline>
                  <line x1="12" y1="2" x2="12" y2="15"></line>
                </svg>
                <span className="text-sm font-medium">{publication.shares_count || 0}</span>
              </button>
              <button className="flex items-center space-x-2 text-white/90 hover:text-yellow-300 transition-colors">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5">
                  <polyline points="15 10 20 15 15 20"></polyline>
                  <path d="M4 4v7a4 4 0 0 0 4 4h12"></path>
                </svg>
                <span className="text-sm font-medium">Responder</span>
              </button>
            </div>
          </div>
        </div>
      );

      const shouldShowInlineAd = (index + 1) % 3 === 0 && bestBoladas.length > 0;
      if (!shouldShowInlineAd) return publicationCard;
      const adIndex = Math.max(0, Math.floor((index + 1) / 3) - 1);
      const ad = bestBoladas[adIndex % bestBoladas.length];
      const produto = ad?.produto || {};
      const adKey = `inline-ad-${ad?.anuncio?.id || adIndex}`;
      const adCard = (
        <Link key={adKey} to={produto?.slug ? `/post/${produto.slug}` : '#'} className="no-underline">
          <div className="rounded-lg border border-gray-100 bg-white overflow-hidden shadow-sm hover:shadow-md transition-all mb-6">
            <div className="p-4 border-b border-gray-100">
              <span className="text-xs font-semibold text-purple-600">Melhores Boladas</span>
            </div>
            <div className="flex items-center gap-4 p-4">
              <img
                src={produto?.capa || produto?.thumb}
                onError={(e) => { e.currentTarget.src = '/default.png'; }}
                alt={produto?.nome || 'Produto'}
                className="w-24 h-24 object-cover rounded"
              />
              <div className="flex-1">
                <p className="font-medium text-gray-900 line-clamp-1">{produto?.nome}</p>
                <p className="text-sm text-gray-500 line-clamp-2">{produto?.descricao}</p>
                {produto?.preco ? (
                  <div className="text-indigo-600 font-bold mt-1">{`${produto.preco} MT`}</div>
                ) : null}
              </div>
            </div>
          </div>
        </Link>
      );
      return [publicationCard, adCard];
    });
  };

  return (
    <div className="flex min-h-screen bg-gray-50">
      <div className="flex flex-col flex-1 overflow-hidden">
        <main className="flex flex-1 overflow-hidden">
          {/* Main content area - Publications */}
          <div className="flex-1 overflow-y-auto px-6">
            <div className="max-w-3xl mx-auto">
              <h1 className="text-2xl font-bold text-gray-900 mb-6">Publicações</h1>
              
              {/* Publication form */}
              <div className="bg-white rounded-lg border border-gray-100 shadow-sm p-4 mb-6">
                <div className="flex gap-3">
                  <Avatar className="h-10 w-10 shrink-0">
                    <AvatarImage 
                      src={user?.perfil ? `https://storage.googleapis.com/meu-novo-bucket-123/perfil/${user.perfil}` : null} 
                      alt={user?.nome} 
                    />
                    <AvatarFallback>
                      {user?.nome?.split(" ").map(n => n[0]).join("").toUpperCase() || "U"}
                    </AvatarFallback>
                  </Avatar>
                  
                  <Dialog open={showPublicationDialog} onOpenChange={setShowPublicationDialog}>
                    <DialogTrigger asChild>
                      <div className="relative flex-1">
                        <input
                          type="text"
                          placeholder="Em que estás a pensar?"
                          className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500 pr-12 cursor-pointer"
                          readOnly
                        />
                      </div>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-[500px]">
                      <DialogHeader>
                        <DialogTitle>Criar publicação</DialogTitle>
                      </DialogHeader>
                      <form onSubmit={handleSubmit} className="space-y-4">
                        <div className="flex items-center space-x-3 p-2">
                          <Avatar className="h-10 w-10">
                            <AvatarImage 
                              src={user?.perfil ? `https://storage.googleapis.com/meu-novo-bucket-123/perfil/${user.perfil}` : null} 
                              alt={user?.nome} 
                            />
                            <AvatarFallback>
                              {user?.nome?.split(" ").map(n => n[0]).join("").toUpperCase() || "U"}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <p className="font-semibold">{user?.nome || user?.username}</p>
                            <div className="inline-flex items-center px-2 py-1 bg-gray-100 rounded-full text-xs text-gray-600">
                              <span>{user?.nome || user?.username}</span>
                            </div>
                          </div>
                        </div>
                        <textarea
                          value={publicationText}
                          onChange={(e) => setPublicationText(e.target.value)}
                          placeholder="Em que estás a pensar?"
                          className="w-full h-32 p-3 border rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-blue-500"
                          maxLength={100}
                        />
                        <div className="flex justify-end">
                          <Button
                            type="submit"
                            disabled={isSubmitting}
                            className="w-full bg-blue-600 hover:bg-blue-700 text-white"
                          >
                            {isSubmitting ? "Publicando..." : "Publicar"}
                          </Button>
                        </div>
                      </form>
                    </DialogContent>
                  </Dialog>
                </div>
              </div>
              
              {/* Publications list */}
              <div className="space-y-6">
                {loading ? (
                  // Loading skeleton
                  [...Array(3)].map((_, index) => (
                    <div key={index} className="animate-pulse bg-white rounded-lg shadow-sm p-4">
                      <div className="flex items-center space-x-3 mb-4">
                        <div className="rounded-full bg-gray-200 h-10 w-10"></div>
                        <div className="flex-1 space-y-2">
                          <div className="h-4 bg-gray-200 rounded w-1/4"></div>
                          <div className="h-3 bg-gray-200 rounded w-1/6"></div>
                        </div>
                      </div>
                      <div className="h-4 bg-gray-200 rounded w-3/4 mb-3"></div>
                      <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                    </div>
                  ))
                ) : renderPublications()}
                
                {/* Pagination */}
                {!loading && publications.length > 0 && renderPagination()}
              </div>
            </div>
          </div>
          
          {/* Right side - Anúncios: Melhores Boladas */}
          <div className="hidden md:block md:w-[300px] bg-white shadow-sm border-l border-gray-100">
            <div className="p-4 border-b border-gray-100">
              <h2 className="text-lg font-medium">Anúncios</h2>
            </div>
            <div className="p-4">
              {loadingAds ? (
                <div className="animate-pulse space-y-3">
                  <div className="h-24 bg-gray-100 rounded" />
                  <div className="h-24 bg-gray-100 rounded" />
                  <div className="h-24 bg-gray-100 rounded" />
                </div>
              ) : bestBoladas.length > 0 ? (
                <AdsColumn ads={bestBoladas} />
              ) : (
                <div className="text-sm text-gray-500">Sem anúncios no momento.</div>
              )}
            </div>
          </div>
        </main>
      </div>
      
      {/* Comments modal */}
      {renderComments()}
    </div>
  );
} 