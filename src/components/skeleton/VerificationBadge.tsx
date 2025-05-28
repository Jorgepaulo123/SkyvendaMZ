
import { CheckCircle, Clock, AlertCircle } from 'lucide-react';
import { Link } from 'react-router-dom'; // Importando o Link do react-router-dom

interface VerificationBadgeProps {
  status: 'pendente' | 'sim' | null;
}

const VerificationBadge = ({ status }: VerificationBadgeProps) => {
  if (status === 'sim') {
    return (
      <div className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-green-100 text-green-800">
        <CheckCircle className="w-4 h-4 mr-1" />
        Verificado
      </div>
    );
  }

  if (status === 'pendente') {
    return (
      <div className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-yellow-100 text-yellow-800">
        <Clock className="w-4 h-4 mr-1" />
        Em análise
      </div>
    );
  }

  return (
    <div className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-yellow-200 text-gray-800">
      <AlertCircle className="w-4 h-4 mr-1" />
      Não verificado{' '}
      <Link to="/profile/review" className="ml-1 text-blue-500 hover:underline">
        Enviar para revisão
      </Link>
    </div>
  );
};

export default VerificationBadge;
