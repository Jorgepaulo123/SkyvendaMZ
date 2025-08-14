import { useNavigate } from 'react-router-dom';
import { Shield, UserCircle, LockKeyhole, Mail, Bell } from 'lucide-react';

function SettingsPage() {
  const navigate = useNavigate();

  const settingsOptions = [
    {
      title: "Conta e Perfil",
      icon: <UserCircle className="w-5 h-5 text-blue-500" />,
      items: [
        { label: "Mudar Nome", path: "/settings/profile", disabled: true },
        { label: "Adicionar Email", path: "/settings/add-email", disabled: true },
        { label: "Mudar Email", path: "/settings/change-email", disabled: true }
      ]
    },
    {
      title: "Segurança",
      icon: <Shield className="w-5 h-5 text-green-500" />,
      items: [
        { label: "Configuração do PIN", path: "/settings/security" },
        { label: "Mudar Senha", path: "/settings/password" }
      ]
    },
    {
      title: "Privacidade",
      icon: <LockKeyhole className="w-5 h-5 text-purple-500" />,
      items: [
        { label: "Bloquear Utilizadores", path: "/settings/blocked", disabled: true }
      ]
    },
    {
      title: "Notificações",
      icon: <Bell className="w-5 h-5 text-amber-500" />,
      items: [
        { label: "Preferências de Notificações", path: "/settings/notifications", disabled: true }
      ]
    }
  ];

  return (
    <div className="fixed inset-0 bg-gradient-to-br from-indigo-50 via-white to-blue-50">
      {/* Fixed Header */}
      <div className="fixed top-0 left-0 right-0 z-10 flex items-center justify-between p-4 bg-white shadow-sm border-b">
        <div className="flex items-center gap-2">
          <button onClick={() => navigate(-1)} className="p-2 text-gray-700 hover:bg-gray-100 rounded-full">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <h1 className="text-2xl font-bold text-gray-800">Definições</h1>
        </div>
      </div>

      {/* Content - with padding to account for fixed header */}
      <div className="pt-20 pb-6 px-4 md:px-6 h-full overflow-y-auto">
        {settingsOptions.map((section, sectionIndex) => (
          <div key={sectionIndex} className="mb-8">
            <div className="flex items-center gap-2 mb-3">
              {section.icon}
              <h2 className="text-lg font-semibold text-gray-900">{section.title}</h2>
            </div>
            <div className="bg-white border border-gray-200 rounded-lg shadow-sm overflow-hidden">
              {section.items.map((item, itemIndex) => (
                <button 
                  key={itemIndex}
                  onClick={() => { if (!item.disabled) navigate(item.path); }}
                  className={`w-full px-4 py-4 flex items-center justify-between transition-all border-b last:border-b-0 ${item.disabled ? 'cursor-not-allowed bg-gray-50' : 'hover:bg-gray-50'}`}
                  disabled={item.disabled}
                >
                  <span className={`text-gray-700 ${item.disabled ? 'opacity-50' : ''}`}>{item.label}</span>
                  <div className="flex items-center gap-2">
                    {item.disabled && (
                      <span className="text-xs px-2 py-1 rounded-full bg-gray-100 text-gray-500 border">Indisponível</span>
                    )}
                    <svg className={`w-5 h-5 ${item.disabled ? 'text-gray-300' : 'text-gray-400'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </div>
                </button>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default SettingsPage;
