import React, { useState } from 'react';
import { X, Upload, Calendar, User as UserIcon, MapPin, ArrowLeft, ArrowRight } from 'lucide-react';
import api from '../../../api/api';
import toast, { Toaster } from 'react-hot-toast';
import StepIndicator from './StepIndicator';
import ImagePreview from './ImagePreview';
import ModernDatePicker from './ModernDatePicker';
import { PROVINCIAS, DISTRITOS } from '../data/consts';

const STEPS = ['Dados Pessoais', 'Localização', 'Documentos'];

export default function ResubmitVerificationModal({ open, onClose }) {
  const [currentStep, setCurrentStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [token] = useState(localStorage.getItem('auth_token') || null);
  const [formData, setFormData] = useState({
    data_nascimento: '',
    nacionalidade: '',
    bairro: '',
    sexo: '',
    localizacao: '',
    provincia: '',
    contacto: '',
    distrito: '',
    foto_bi_verso: null,
    foto_bi_frente: null,
    foto_retrato: null,
  });

  if (!open) return null;

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => {
      if (name === 'provincia') {
        return { ...prev, [name]: value, distrito: '' };
      }
      return { ...prev, [name]: value };
    });
  };

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setFormData({ ...formData, [e.target.name]: e.target.files[0] });
    }
  };

  const goNext = () => setCurrentStep((s) => Math.min(s + 1, STEPS.length));
  const goPrev = () => setCurrentStep((s) => Math.max(s - 1, 1));

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (currentStep !== 3) {
      goNext();
      return;
    }

    setLoading(true);
    const formDataToSend = new FormData();
    Object.entries(formData).forEach(([key, value]) => {
      if (value instanceof File) {
        formDataToSend.append(key, value);
      } else if (value) {
        formDataToSend.append(key, value);
      }
    });

    try {
      await api.post('/info_usuario/', formDataToSend, {
        headers: {
          'Content-Type': 'multipart/form-data',
          accept: 'application/json',
          Authorization: `Bearer ${token}`,
        },
      });
      toast.success('Dados reenviados! Seu perfil agora está em análise.');
      setTimeout(() => {
        window.location.reload();
      }, 800);
    } catch (error) {
      toast.error('Erro ao reenviar. Verifique os campos e tente novamente.');
      console.error('Resubmit error:', error);
    } finally {
      setLoading(false);
    }
  };

  const inputClassName =
    'h-[44px] mt-1 block w-full rounded-xl border border-gray-200 px-3 py-2 text-gray-800 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-200 sm:text-sm transition duration-150 ease-in-out hover:border-gray-300 bg-white/70 backdrop-blur';
  const selectClassName =
    'h-[44px] mt-1 block w-full rounded-xl border border-gray-200 px-3 py-2 text-gray-800 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-200 sm:text-sm transition duration-150 ease-in-out hover:border-gray-300 bg-white';

  const renderPersonalInfo = () => (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700">
          <Calendar className="inline-block w-4 h-4 mr-2" />
          Data de Nascimento
        </label>
        <ModernDatePicker
          value={formData.data_nascimento}
          onChange={(iso) => setFormData((p) => ({ ...p, data_nascimento: iso }))}
          max={new Date().toISOString().slice(0,10)}
        />
        <p className="mt-1 text-xs text-gray-500">Formato: dd/mm/aaaa</p>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">
          <UserIcon className="inline-block w-4 h-4 mr-2" />
          Nacionalidade
        </label>
        <input
          type="text"
          name="nacionalidade"
          value={formData.nacionalidade}
          onChange={handleInputChange}
          className={inputClassName}
          required
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">Sexo</label>
        <select
          name="sexo"
          value={formData.sexo}
          onChange={handleInputChange}
          className={selectClassName}
          required
        >
          <option value="">Selecione o sexo</option>
          <option value="M">Masculino</option>
          <option value="F">Feminino</option>
        </select>
      </div>
    </div>
  );

  const renderLocationInfo = () => (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700">
          <MapPin className="inline-block w-4 h-4 mr-2" />
          Província
        </label>
        <select
          name="provincia"
          value={formData.provincia}
          onChange={handleInputChange}
          className={selectClassName}
          required
        >
          <option value="">Selecione a província</option>
          {PROVINCIAS.map((provincia) => (
            <option key={provincia} value={provincia}>
              {provincia}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">
          <MapPin className="inline-block w-4 h-4 mr-2" />
          Distrito
        </label>
        <select
          name="distrito"
          value={formData.distrito}
          onChange={handleInputChange}
          className={selectClassName}
          required
          disabled={!formData.provincia}
        >
          <option value="">Selecione o distrito</option>
          {formData.provincia &&
            DISTRITOS[formData.provincia].map((distrito) => (
              <option key={distrito} value={distrito}>
                {distrito}
              </option>
            ))}
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">
          <MapPin className="inline-block w-4 h-4 mr-2" />
          Bairro
        </label>
        <input
          type="text"
          name="bairro"
          value={formData.bairro}
          onChange={handleInputChange}
          className={inputClassName}
          required
          placeholder="Digite o nome do bairro"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">
          Localização (opcional)
        </label>
        <input
          type="text"
          name="localizacao"
          value={formData.localizacao}
          onChange={handleInputChange}
          className={inputClassName}
          placeholder="Ex: Av. 25 de Setembro, 123"
        />
      </div>
    </div>
  );

  const renderDocuments = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-3">
        {formData.foto_bi_frente ? (
          <ImagePreview
            file={formData.foto_bi_frente}
            onRemove={() => setFormData({ ...formData, foto_bi_frente: null })}
            label="BI (Frente)"
          />
        ) : (
          <div className="relative border-2 border-dashed border-gray-300 rounded-2xl p-6 hover:border-indigo-500 transition-colors bg-white/60">
            <input
              type="file"
              name="foto_bi_frente"
              onChange={handleFileChange}
              accept="image/*"
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
              required
            />
            <div className="text-center">
              <Upload className="mx-auto h-12 w-12 text-gray-400" />
              <p className="mt-1 text-sm text-gray-600">BI (Frente)</p>
            </div>
          </div>
        )}

        {formData.foto_bi_verso ? (
          <ImagePreview
            file={formData.foto_bi_verso}
            onRemove={() => setFormData({ ...formData, foto_bi_verso: null })}
            label="BI (Verso)"
          />
        ) : (
          <div className="relative border-2 border-dashed border-gray-300 rounded-2xl p-6 hover:border-indigo-500 transition-colors bg-white/60">
            <input
              type="file"
              name="foto_bi_verso"
              onChange={handleFileChange}
              accept="image/*"
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
              required
            />
            <div className="text-center">
              <Upload className="mx-auto h-12 w-12 text-gray-400" />
              <p className="mt-1 text-sm text-gray-600">BI (Verso)</p>
            </div>
          </div>
        )}

        {formData.foto_retrato ? (
          <ImagePreview
            file={formData.foto_retrato}
            onRemove={() => setFormData({ ...formData, foto_retrato: null })}
            label="Foto Retrato"
          />
        ) : (
          <div className="relative border-2 border-dashed border-gray-300 rounded-2xl p-6 hover:border-indigo-500 transition-colors bg-white/60">
            <input
              type="file"
              name="foto_retrato"
              onChange={handleFileChange}
              accept="image/*"
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
              required
            />
            <div className="text-center">
              <Upload className="mx-auto h-12 w-12 text-gray-400" />
              <p className="mt-1 text-sm text-gray-600">Foto Retrato</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );

  return (
    <div className="fixed inset-0 z-50">
      <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/30 via-purple-500/30 to-pink-500/30 backdrop-blur-sm" onClick={onClose} />
      <div className="relative z-10 mx-auto mt-6 w-full max-w-3xl">
        <div className="rounded-2xl shadow-2xl overflow-hidden border border-white/40 bg-white/80 backdrop-blur">
          {/* Header */}
          <div className="p-5 bg-gradient-to-r from-indigo-600 to-purple-600 text-white flex items-center justify-between">
            <div>
              <h3 className="text-xl font-semibold">Reenvio de Verificação</h3>
              <p className="text-xs opacity-90">Atualize seus dados e envie novamente para análise</p>
            </div>
            <button onClick={onClose} className="p-2 rounded-full hover:bg-white/20">
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="p-6">
            <StepIndicator currentStep={currentStep} steps={STEPS} />
            <form onSubmit={handleSubmit} className="space-y-6 mt-4">
              {currentStep === 1 && renderPersonalInfo()}
              {currentStep === 2 && renderLocationInfo()}
              {currentStep === 3 && renderDocuments()}

              <div className="flex justify-between pt-4">
                {currentStep > 1 && (
                  <button
                    type="button"
                    onClick={goPrev}
                    className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-lg text-gray-700 bg-white hover:bg-gray-50"
                  >
                    <ArrowLeft className="w-4 h-4 mr-2" />
                    Anterior
                  </button>
                )}
                <button
                  type="submit"
                  disabled={loading}
                  className="ml-auto inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-lg text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? (
                    'Enviando...'
                  ) : currentStep === 3 ? (
                    'Reenviar'
                  ) : (
                    <>
                      Próximo
                      <ArrowRight className="w-4 h-4 ml-2" />
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
      <Toaster position="top-right" />
    </div>
  );
}
