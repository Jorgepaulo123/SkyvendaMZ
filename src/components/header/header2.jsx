import React, { useState } from 'react'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select'
import {  List, MapPinIcon, RefreshCcw } from 'lucide-react'
import { FaCaretDown } from 'react-icons/fa'
import { Link } from 'react-router-dom'

export default function Header2() {
    const [province,setProvince]=useState('niassa')
    return (
        <>
            {/* terceiro header */}
            <div className="py-1 bg-indigo-100 h-[60px] hidden md:flex ">
                <div className="container mx-auto flex items-center gap-5 justify-between ">
                    <div className="flex gap-8 justify-center items-center">
                        {/* inicio do dropdown */}
                        <div className="group relative cursor-pointer py-2 w-[250px] font-sans max_z_index">
                            <div className="flex items-center justify-between space-x-2 bg-[#7a4fed] px-4 text-white rounded-md">
                                <List />
                                <a className="menu-hover my-2 py-1 text-base font-medium text-white lg:mx-4">
                                    Todas As Categorias
                                </a>
                                <FaCaretDown />
                            </div>
                            <div
                                className="invisible absolute  flex w-full flex-col bg-white py-1 px-4 text-gray-800 shadow-xl group-hover:visible">
                                <div className="border-b border-gray-100 hover:text-indigo-600 py-3">
                                    <Link className=''>Moda</Link>
                                </div>
                                <div className="border-b border-gray-100 hover:text-indigo-600 py-3">
                                    <Link className=''>Eletrônicos</Link>
                                </div>
                                <div className="border-b border-gray-100 hover:text-indigo-600 py-3">
                                    <Link className=''>Casa e Jardim</Link>
                                </div>
                                <div className="border-b border-gray-100 hover:text-indigo-600 py-3">
                                    <Link className=''>Saúde e Beleza</Link>
                                </div>
                                <div className="border-b border-gray-100 hover:text-indigo-600 py-3">
                                    <Link className=''>Brinquedos e Jogos</Link>
                                </div>
                                <div className="border-b border-gray-100 hover:text-indigo-600 py-3">
                                    <Link className=''>Culinária</Link>
                                </div>
                                <div className="border-b border-gray-100 hover:text-indigo-600 py-3">
                                    <Link className=''>Telefonia</Link>
                                </div>
                                <div className="border-b border-gray-100 hover:text-indigo-600 py-3">
                                    <Link className=''>Esportes e Lazer</Link>
                                </div>

                            </div>
                        </div>
                        {/* fim do dropdown */}
                        {/* menus */}
                        <div className="flex space-x-8 font-sans">
                            <Link className='hover:text-indigo-500'>Home</Link>
                            <Link className='hover:text-indigo-500'>Lojas</Link>
                            <Link className='hover:text-indigo-500'>Nhonguistas</Link>
                            <Link className='hover:text-indigo-500'>Meus produtos</Link>
                        </div>
                        {/* menus */}
                    </div>
                    <div className="flex space-x-8 text-gray-600">
                        <div className="flex gap-2 items-center hover:text-indigo-500 min-w-[200px]">
                            <div className="flex items-center justify-center rounded-full bg-white p-2">
                                <MapPinIcon />
                            </div>
                            <Select value={province} onValueChange={(value) => setProvince(value)}  >
                                <SelectTrigger className="border-none shadow-none focus:ring-0 focus:outline-none max-w-[200px]">
                                    <SelectValue placeholder="Todas categorias" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="niassa">Niassa</SelectItem>
                                    <SelectItem value="cabo_delgado">Cabo Delgado</SelectItem>
                                    <SelectItem value="nampula">Nampula</SelectItem>
                                    <SelectItem value="zambezia">Zambézia</SelectItem>
                                    <SelectItem value="tete">Tete</SelectItem>
                                    <SelectItem value="manica">Manica</SelectItem>
                                    <SelectItem value="sofala">Sofala</SelectItem>
                                    <SelectItem value="inhambane">Inhambane</SelectItem>
                                    <SelectItem value="gaza">Gaza</SelectItem>
                                    <SelectItem value="maputo">Maputo</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="flex gap-2 items-center hover:text-indigo-500 min-w-[200px]">
                            <div className="flex items-center justify-center rounded-full bg-white p-2">
                                <RefreshCcw />
                            </div>
                            <span>Visto recentemente</span>
                        </div>
                    </div>
                </div>

            </div>
            {/* terceiro header */}
        </>
    )
}
