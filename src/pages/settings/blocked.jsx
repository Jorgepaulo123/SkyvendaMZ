import React from 'react'
import { UserX } from 'lucide-react'

const Blocked = () => {
  return (
    <div className="w-full h-full p-4">
      <div className="flex items-center gap-2 mb-4">
        <UserX className="w-5 h-5" />
        <h1 className="text-xl font-semibold">Usuários Bloqueados</h1>
      </div>
      <div className="space-y-4">
        {/* Add blocked users list here */}
        <p className="text-muted-foreground">Nenhum usuário bloqueado</p>
      </div>
    </div>
  )
}

export default Blocked