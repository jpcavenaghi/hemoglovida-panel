import React, { useState } from 'react';
import { FiHeart } from 'react-icons/fi';

// --- DADOS DE EXEMPLO (MOCK) ---
const hemocentroInfo = {
  name: 'HemogloVida - Hemonúcleo Central',
  email: 'contato@hemoglovida.org.br',
  phone: '(19) 3800-1234',
  cnpj: '12.345.678/0001-99', 
  address: 'Avenida da Saúde, 123',
  district: 'Centro',
  cep: '13800-000',
  city: 'Mogi Mirim',
  state: 'SP',
  country: 'Brasil',
};

// --- COMPONENTE INTERNO: FormField ---
interface FormFieldProps {
  label: string;
  name: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  type?: string;
}

const FormField: React.FC<FormFieldProps> = ({
  label,
  name,
  value,
  onChange,
  type = 'text'
}) => (
  <div>
    <label
      htmlFor={name}
      className="block text-sm font-medium text-gray-600"
    >
      {label}
    </label>
    <input
      type={type}
      id={name}
      name={name}
      value={value}
      onChange={onChange}
      className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2 shadow-sm focus:border-red-500 focus:outline-none focus:ring-red-500 sm:text-sm"
    />
  </div>
);


// --- COMPONENTE PRINCIPAL DA PÁGINA ---
export default function ProfilePage() {
  const [formData, setFormData] = useState(hemocentroInfo);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prevData => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSaveChanges = () => {
    console.log('Salvando alterações:', formData);
    alert('Informações salvas!');
  };

  const handleCancel = () => {
    setFormData(hemocentroInfo);
    console.log('Alterações canceladas');
  };

  return (
    <div className="space-y-6">
      
      <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
        
        <div>
          <h1 className="text-3xl font-bold text-gray-800">Perfil do Hemocentro</h1>
          <p className="mt-1 text-sm text-gray-500">
            Gerencie as informações gerais de contato e endereço da instituição.
          </p>
        </div>
        
        <div className="flex-shrink-0 flex gap-3">
          <button
            onClick={handleCancel}
            className="rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-semibold text-gray-700 shadow-sm transition hover:bg-gray-50"
          >
            Cancelar
          </button>
          <button
            onClick={handleSaveChanges}
            className="rounded-lg bg-red-600 px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
          >
            Salvar Alterações
          </button>
        </div>
      </div>

      <div className="overflow-hidden rounded-lg border border-gray-200 bg-white shadow-md">
        <div className="space-y-8 p-6 md:p-8">
          
          <div className="border-b border-gray-200 pb-6">
            <h3 className="text-lg font-semibold text-gray-800">Identidade</h3>
            <div className="mt-4 flex items-center gap-5">

              <div className="flex h-16 w-16 flex-shrink-0 items-center justify-center rounded-full bg-red-100">
                <FiHeart className="h-8 w-8 text-red-600" />
              </div>

              <div>
                <h4 className="text-xl font-bold text-gray-900">{formData.name}</h4>
                <p className="text-sm text-gray-500">
                  Centro de Coleta e Distribuição de Sangue
                </p>
              </div>
            </div>
          </div>

          <div>
            <h3 className="text-lg font-semibold text-gray-800">
              Informações de Contato e Endereço
            </h3>
            <div className="mt-4 grid grid-cols-1 gap-x-6 gap-y-5 md:grid-cols-2">
              <FormField label="Nome da Instituição" name="name" value={formData.name} onChange={handleChange} />
              <FormField label="Email de Contato" name="email" value={formData.email} onChange={handleChange} />
              <FormField label="Telefone" name="phone" value={formData.phone} onChange={handleChange} />
              <FormField label="CNPJ" name="cnpj" value={formData.cnpj} onChange={handleChange} />
              
              <div className="md:col-span-2 my-2"></div>

              <FormField label="Endereço (Rua, N°)" name="address" value={formData.address} onChange={handleChange} />
              <FormField label="Bairro" name="district" value={formData.district} onChange={handleChange} />
              <FormField label="CEP" name="cep" value={formData.cep} onChange={handleChange} />
              <FormField label="Cidade" name="city" value={formData.city} onChange={handleChange} />
              <FormField label="Estado (UF)" name="state" value={formData.state} onChange={handleChange} />
              <FormField label="País" name="country" value={formData.country} onChange={handleChange} />
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}