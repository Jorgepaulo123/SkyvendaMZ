import React from 'react';
import { VerifiedCard } from './VerifiedCard';
import { PendingCard } from './PendingCard';
import { RejectedCard } from './RejectedCard';
import UserForm from './UserForm';

export function VerificationStatus({ estadoRevisao }) {
  if (estadoRevisao === 'sim') {
    return (
      <div className="space-y-8">
        <VerifiedCard />
      </div>
    );
  }

  if (estadoRevisao === 'pendente') {
    return <PendingCard />;
  }
  
  if (estadoRevisao === 'recusado') {
    return <RejectedCard />;
  }
  
  if (estadoRevisao === 'nao') {
    // Renderiza um formulário para usuários que ainda precisam verificar o perfil
    return <UserForm />;
  }

  // Caso padrão: mostrar formulário para qualquer outro caso
  return <UserForm />;
}
