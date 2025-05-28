import React from 'react'
import { BadgeCheck } from 'lucide-react'

const Verification = () => {
  return (
    <div className="w-full h-full p-4">
      <div className="flex items-center gap-2 mb-4">
        <BadgeCheck className="w-5 h-5" />
        <h1 className="text-xl font-semibold">Selo de Verificação</h1>
      </div>
      <div className="space-y-4">
        {/* Add verification status and request options here */}
        <p className="text-muted-foreground">Status de verificação da sua conta</p>
        <button className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600">
          Solicitar Verificação
        </button>
      </div>
    </div>
  )
}

export default Verification