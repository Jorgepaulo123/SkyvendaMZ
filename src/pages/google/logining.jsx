import React, { useEffect, useState } from 'react'

export default function Logining() {
    const [message, setMessage] = useState("Autenticando, por favor aguarde");
    
    useEffect(() => {
        // Pegar o token da URL usando URLSearchParams
        const urlParams = new URLSearchParams(window.location.search);
        const token = urlParams.get('token');
        const user_id = urlParams.get('id');
        
        // Guardar o token e o ID no localStorage
        localStorage.setItem("auth_token", token);
        localStorage.setItem("user_id", user_id);
        // Limpar o código de referência se existir, já que a associação foi feita
        try { localStorage.removeItem('referencia'); } catch {}
        
        // Detectar se é Android
        const isAndroid = /Android/i.test(navigator.userAgent);
        
        if (isAndroid && token && user_id) {
            // Tentar abrir o app nativo no Android
            setMessage("Tentando abrir o aplicativo...");
            
            // Construir deep link com os dados
            const deepLink = `skyvendaapp://success?token=${encodeURIComponent(token)}&id=${encodeURIComponent(user_id)}`;
            
            // Tentar abrir o app
            window.location.href = deepLink;
            
            // Fallback: se não conseguir abrir o app em 3 segundos, continuar no site
            setTimeout(() => {
                setMessage("Redirecionando para o site...");
                setTimeout(() => {
                    window.location.replace("/")
                }, 1000);
            }, 3000);
        } else {
            // Se não for Android, continuar normalmente no site
            setTimeout(() => {
                window.location.replace("/")
            }, 2000);
        }
    }, [])
    
    return (
        <div className="min-h-screen flex flex-col items-center justify-center gap-4">
            {/* Spinner do Tailwind */}
            <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-500"></div>
            
            <h2 className="text-xl font-semibold">
                {message}
            </h2>
        </div>
    )
}
