import React, { useEffect } from 'react'

export default function Logining() {
    useEffect(() => {
        // Pegar o token da URL usando URLSearchParams
        const urlParams = new URLSearchParams(window.location.search);
        const token = urlParams.get('token');
        const user_id = urlParams.get('id');
        
        // Guardar o token e o ID fixo (1) no localStorage
        localStorage.setItem("auth_token", token);
        localStorage.setItem("user_id", user_id);
        // Limpar o código de referência se existir, já que a associação foi feita
        try { localStorage.removeItem('referencia'); } catch {}
        
        setTimeout(() => {
            window.location.replace("/")
        }, 2000)
    }, [])
    
    return (
        <div className="min-h-screen flex flex-col items-center justify-center gap-4">
            {/* Spinner do Tailwind */}
            <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-500"></div>
            
            <h2 className="text-xl font-semibold">
                Autenticando, por favor aguarde
            </h2>
        </div>
    )
}
