import React, { useEffect, useState, useRef } from 'react';
import { useAuth } from '../../context/AuthContext';
import { FaCaretDown } from 'react-icons/fa';
import api from '../../api/api';
import { Loader, Loader2 } from 'lucide-react';
import toast from 'react-hot-toast';

export default function Edit() {
    const { user, token } = useAuth();
    const [fileImage, setFileImage] = useState(null);
    const [previewImage, setPreviewImage] = useState(null);
    const [uploading, setUploading] = useState(false);
    const [pageName, setPageName] = useState('');
    const [contact, setContact] = useState('');
    const [bio, setBio] = useState('');
    const [isOpen, setIsOpen] = useState(false);
    const [selectedGender, setSelectedGender] = useState('');
    const dropdownRef = useRef(null);
    const [saving,setSaving]=useState(false)
    

    useEffect(() => {
        if (user?.perfil) {
            setPreviewImage(`https://storage.googleapis.com/meu-novo-bucket-123/perfil/${user?.perfil}`);
            setContact(user?.contacto);
            setBio(user?.biografia);
            setPageName(user?.nome_pagina);
            setSelectedGender(user?.sexo);
        }
    }, [user]);

    useEffect(() => {
        function handleClickOutside(event) {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setIsOpen(false);
            }
        }

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setFileImage(file);
            setPreviewImage(URL.createObjectURL(file));
            setUploading(true);

            const formData = new FormData();
            formData.append('file', file);

            api.put('/info_usuario/perfil', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                    'Authorization': `Bearer ${token}`,
                    'accept': 'application/json',
                },
            })
                .then(() => {
                    setFileImage(null);
                })
                .catch((err) => {
                    console.error(err);
                })
                .finally(() => {
                    setUploading(false);
                });
        }
    };

    const handleSubmit = async () => {
        setSaving(true);
        try {
            const formData = new URLSearchParams();
            formData.append('username', user?.username || '');
            formData.append('email', user?.email || '');
            formData.append('contacto', contact);
            formData.append('biografia', bio);
            formData.append('sexo', selectedGender);
            formData.append('nome_pagina', pageName);
    
            await api.put('/usuario/atualizar', formData, {
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                    'Authorization': `Bearer ${token}`,
                    'accept': 'application/json',
                },
            });
    
            // Show success toast
            toast.success('Perfil atualizado com sucesso!');
        } catch (error) {
            console.error('Error updating profile:', error);
            if (error.response?.status === 400) {
                toast.error('Este contacto já existe!');
            } else {
                toast.error('Erro ao atualizar perfil');
            }
        } finally {
            setSaving(false);
        }
    };

    return (
        <>
            <div className="bg-white min-h-screen pb-[100px]">
                <div className="container px-4 py-6 sm:p-10 flex flex-col gap-6 sm:gap-8 max-w-[810px] mx-auto">
                    <h1 className="font-bold text-2xl sm:text-3xl">Editar perfil</h1>

                    <div className="bg-gray-200/50 rounded-xl sm:rounded-2xl flex flex-col sm:flex-row w-full sm:h-[80px] p-3 sm:p-4 px-4 sm:px-5 justify-between gap-3 sm:gap-0">
                        <div className="flex w-full gap-3 items-center">
                            <div className="relative">
                                {uploading && (
                                    <div className="w-[50px] h-[50px] bg-black/20 absolute z-10 rounded-full flex items-center justify-center">
                                        <Loader className='animate-spin text-white'/>
                                    </div>
                                )}
                                <img
                                    src={previewImage || "https://storage.googleapis.com/meu-novo-bucket-123/perfil/default.png"}
                                    onError={(e)=>e.target.src="https://storage.googleapis.com/meu-novo-bucket-123/perfil/default.png"}
                                    className="rounded-full aspect-square w-[50px] object-cover"
                                    alt="Perfil"
                                />
                            </div>
                            <div className="flex flex-col justify-center">
                                <h1 className="text-base sm:text-lg font-bold">{user?.username}</h1>
                                <span className="text-sm">{user?.name}</span>
                            </div>
                            <div className="ml-auto flex items-center">
                                <label className="bg-indigo-500 py-1 sm:py-2 px-3 sm:px-4 rounded-lg hover:bg-indigo-600 text-white cursor-pointer text-sm sm:text-base">
                                    Alternar foto
                                    <input
                                        type="file"
                                        accept="image/*"
                                        className="hidden"
                                        onChange={handleFileChange}
                                    />
                                </label>
                            </div>
                        </div>
                    </div>

                    <div className="flex w-full flex-col gap-2 sm:gap-3">
                        <h1 className="font-bold text-lg sm:text-xl">Nome da página</h1>
                        <input 
                            type="text" 
                            placeholder="ex: Nhonguista de carros" 
                            className="border rounded-xl sm:rounded-2xl w-full p-3 sm:p-4 bg-transparent outline-none text-sm sm:text-base" 
                            value={pageName}
                            onChange={(e) => setPageName(e.target.value)}
                        />
                    </div>

                    <div className="flex w-full flex-col gap-2 sm:gap-3">
                        <h1 className="font-bold text-lg sm:text-xl">Mudar contacto</h1>
                        <input 
                            type="text" 
                            placeholder="8645++++67" 
                            className="border rounded-xl sm:rounded-2xl w-full p-3 sm:p-4 bg-transparent outline-none text-sm sm:text-base" 
                            value={contact}
                            onChange={(e) => setContact(e.target.value)}
                        />
                    </div>

                    <div className="flex w-full flex-col gap-2 sm:gap-3">
                        <h1 className="font-bold text-lg sm:text-xl">Biografia</h1>
                        <textarea
                            placeholder="Sobre ti"
                            className="border rounded-xl sm:rounded-2xl w-full p-3 sm:p-4 bg-transparent outline-none text-sm sm:text-base min-h-[100px]"
                            value={bio}
                            onChange={(e) => setBio(e.target.value)}
                        />
                    </div>

                    <div className="flex w-full flex-col gap-2 sm:gap-3">
                        <h1 className="font-bold text-lg sm:text-xl">Sexo</h1>
                        <div className="relative" ref={dropdownRef}>
                            <div
                                className="border rounded-xl sm:rounded-2xl flex w-full p-3 sm:p-4 justify-between items-center cursor-pointer text-sm sm:text-base"
                                onClick={() => setIsOpen(!isOpen)}
                            >
                                <span>{selectedGender || 'Selecione o sexo'}</span>
                                <FaCaretDown className={`transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} />
                            </div>
                            
                            {isOpen && (
                                <div className="absolute mt-2 w-full bg-white border rounded-xl shadow-lg z-10">
                                    <div
                                        className="flex items-center p-4 hover:bg-gray-50 cursor-pointer"
                                        onClick={() => {
                                            setSelectedGender('Masculino');
                                            setIsOpen(false);
                                        }}
                                    >
                                        <div className="w-5 h-5 border rounded-full mr-3 flex items-center justify-center">
                                            {selectedGender === 'Masculino' && (
                                                <div className="w-3 h-3 bg-indigo-500 rounded-full" />
                                            )}
                                        </div>
                                        <span>Masculino</span>
                                    </div>
                                    <div
                                        className="flex items-center p-4 hover:bg-gray-50 cursor-pointer"
                                        onClick={() => {
                                            setSelectedGender('Feminino');
                                            setIsOpen(false);
                                        }}
                                    >
                                        <div className="w-5 h-5 border rounded-full mr-3 flex items-center justify-center">
                                            {selectedGender === 'Feminino' && (
                                                <div className="w-3 h-3 bg-indigo-500 rounded-full" />
                                            )}
                                        </div>
                                        <span>Feminino</span>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>

                    <div className="w-full flex justify-center sm:justify-end">
                        <button 
                            onClick={handleSubmit} 
                            disabled={saving} 
                            className={saving ? 
                                "cursor-not-allowed px-8 sm:px-10 py-2 rounded-lg bg-indigo-400 text-white w-full sm:w-auto" : 
                                "px-8 sm:px-10 py-2 rounded-lg bg-indigo-500 hover:bg-indigo-600 text-white w-full sm:w-auto"
                            }
                        >
                            {saving ? <Loader2 className='animate-spin mx-auto'/> : 'Salvar'}
                        </button>
                    </div>
                </div>
            </div>
        </>
    );
}