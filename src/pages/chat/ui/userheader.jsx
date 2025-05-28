import { ArrowLeft, Edit } from 'lucide-react'
import React from 'react'
import { base_url } from '../../../api/api'
import { Link } from 'react-router-dom'
import { useWebSocket } from '../../../context/websoketContext'

export default function UserHeader({user}) {
    const { onlineUsers } = useWebSocket();
    const isOnline = onlineUsers.some(u => String(u.id) === String(user.id));
    return (
        <div className="flex flex-col p-4 border-b">
            <div className='flex justify-between items-center w-full mb-12'>
                <ArrowLeft size={20} className="cursor-pointer hover:text-skyvenda-500 md:hidden" />
                <h1 className="font-bold text-lg">{user.username}</h1>
                <Link to={'/'}>
                    <Edit size={20} onClick={()=>{}} className="cursor-pointer hover:text-skyvenda-500" />
                </Link> 
            </div>
            <div className="f">
                <div className="flex flex-col items-center w-[60px] space-y-2">
                    <div className="relative">
                        <img
                            src={user.perfil || `http://skyvenda-mz.vercel.app/avatar.png`}
                            alt="profile"
                            className="w-[60px] h-[60px] rounded-full border-2 border-skyvenda-400"
                            onError={(e) => e.target.src = `http://skyvenda-mz.vercel.app/avatar.png`}
                        />
                        {isOnline && (
                            <div className="absolute bottom-0 right-0 w-4 h-4 bg-green-500 rounded-full border-2 border-white" title="Online"></div>
                        )}
                    </div>
                    <span className='text-gray-500 text-sm'>{user?.name}</span>
                </div>
            </div>
        </div>
    )
}
