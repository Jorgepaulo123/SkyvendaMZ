import React from 'react';
import { VerifiedCard } from './VerifiedCard';
import { PendingCard } from './PendingCard';
import { RejectedCard } from './RejectedCard';
import UserForm from './UserForm';

export function VerificationStatus({ estadoRevisao }) {
  const normalize = (s) => (s || '').toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');
  const v = normalize(estadoRevisao);

  if (v === 'sim' || v === 'aprovado') {
    return (
      <div className="space-y-8">
        <VerifiedCard />
      </div>
    );
  }

  if (v === 'pendente' || v === 'processando') {
    return <PendingCard />;
  }
  
  // Rejeitado explicitamente pelo time de revisão
  if (v === 'recusado' || v === 'rejeitado' || v === 'reprovado') {
    return <RejectedCard />;
  }
  
  

  // Caso padrão: mostrar formulário para qualquer outro caso
  return <UserForm />;
}
