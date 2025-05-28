
import { useNavigate } from "react-router-dom";
export default function PageNotFound() {
    const navigate=useNavigate()
    return (
      <div className="flex flex-col h-[100vh] w-full items-center justify-center text-gray-800">
        <p className="glitch">
            <span aria-hidden="true">404</span>
            404
            <span aria-hidden="true">404</span>
        </p>
        <h2 className="text-3xl font-semibold mb-2">Página Não Encontrada</h2>
        <p className="text-lg mb-6 text-center max-w-md">
          Ops! A página que você está procurando não existe ou foi movida. Por favor, verifique o URL ou volte para a página inicial.
        </p>
        <div className="flex space-x-4">
          <button
            className="px-6 py-3 bg-indigo-500 text-white rounded hover:bg-indigo-600 transition duration-300"
            onClick={()=>navigate('/')}
          >
            Ir para a Página Inicial
          </button>
          <button
            onClick={()=>navigate('/')}
            className="px-6 py-3  text-indigo-800 rounded hover:bg-gray-300 transition duration-300 border border-indigo-500"
          >
            Contatar Suporte
          </button>
        </div>
        <div className="mt-10 text-center">
          <p className="text-sm text-gray-500">Código do Erro: 404 - Não Encontrado</p>
          <p className="text-sm text-gray-500">
            Se você acredita que isto é um engano, por favor, entre em contato com nossa equipe de suporte.
          </p>
        </div>
      </div>
    );
  }
  