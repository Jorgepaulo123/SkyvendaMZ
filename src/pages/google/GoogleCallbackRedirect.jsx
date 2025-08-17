import React, { useEffect } from 'react';
import { base_url } from '../../api/api';

export default function GoogleCallbackRedirect() {
  useEffect(() => {
    try {
      const original = new URLSearchParams(window.location.search || '');
      // If Google didn't return our referral info explicitly, try to add it
      if (!original.get('referencia')) {
        try {
          const storedRef = localStorage.getItem('referencia');
          if (storedRef) original.append('referencia', storedRef);
        } catch {}
      }

      // Forward the Google callback (code, state, scope, etc.) to the backend handler
      const target = `${base_url}/usuario/auth/callback?${original.toString()}`;
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
