import React, { useEffect } from 'react';

export default function GoogleCallbackRedirect() {
  useEffect(() => {
    try {
      const qs = window.location.search || '';
      // Forward the Google callback (code, scope, etc.) to the backend handler
      const target = `https://skyvenda-8k97.onrender.com/usuario/auth/callback${qs}`;
      window.location.replace(target);
    } catch (e) {
      console.error('Erro ao redirecionar callback do Google:', e);
    }
  }, []);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center gap-4">
      <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-500" />
      <h2 className="text-lg font-semibold">Conectando com o servidor…</h2>
    </div>
  );
}
