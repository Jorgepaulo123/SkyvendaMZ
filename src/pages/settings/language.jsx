import React from 'react'
import { Globe } from 'lucide-react'

const Language = () => {
  return (
    <div className="w-full h-full p-4">
      <div className="flex items-center gap-2 mb-4">
        <Globe className="w-5 h-5" />
        <h1 className="text-xl font-semibold">Idioma</h1>
      </div>
      <div className="space-y-4">
        {/* Add language selection options here */}
        <div className="flex flex-col gap-2">
          <button className="p-2 hover:bg-gray-100 rounded-md">Português</button>
          <button className="p-2 hover:bg-gray-100 rounded-md">English</button>
        </div>
      </div>
    </div>
  )
}

export default Language