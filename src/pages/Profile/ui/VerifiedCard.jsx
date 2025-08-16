import React, { useContext } from 'react';
import { CheckCircle } from 'lucide-react';
import { AuthContext } from '../../../context/AuthContext';

export function VerifiedCard() {
  const { user } = useContext(AuthContext);
  return (
    <div className="w-full">
      <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-lg p-5 shadow-lg border border-indigo-100">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-bold text-gray-800">{user?.nome ?? '—'}</h2>
          <span className="inline-flex items-center text-green-700 text-sm">
            <CheckCircle className="w-4 h-4 mr-1" />
            Verificado
          </span>
        </div>
      </div>
    </div>
  );
}
