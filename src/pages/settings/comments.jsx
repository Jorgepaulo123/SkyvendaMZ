import React from 'react'
import { MessageSquare } from 'lucide-react'

const Comments = () => {
  return (
    <div className="w-full h-full p-4">
      <div className="flex items-center gap-2 mb-4">
        <MessageSquare className="w-5 h-5" />
        <h1 className="text-xl font-semibold">Configurações de Comentários</h1>
      </div>
      <div className="space-y-4">
        {/* Add comment settings here */}
        <p className="text-muted-foreground">Gerencie suas preferências de comentários</p>
      </div>
    </div>
  )
}

export default Comments