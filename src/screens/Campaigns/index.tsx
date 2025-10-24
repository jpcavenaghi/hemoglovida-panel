import React from 'react';
import {
  FiPlus,
  FiFilter,
  FiEdit2,
  FiTrash2,
  FiUpload,
  FiDownload,
} from 'react-icons/fi';

// --- DADOS DE EXEMPLO (MOCK) ---
const mockCampaigns = [
  { id: 1, name: 'Urgência O-', reason: 'Baixo Estoque', duration: '15/10 - 25/10/2025', institution: 'Hemonúcleo Campinas', location: 'Campinas, SP' },
  { id: 2, name: 'Doação de Plaquetas AB+', reason: 'Paciente Específico', duration: '20/10 - 22/10/2025', institution: 'Santa Casa Mogi Mirim', location: 'Mogi Mirim, SP' },
  { id: 3, name: 'Semana da Doação', reason: 'Conscientização', duration: '01/11 - 07/11/2025', institution: 'Hospital São Paulo', location: 'São Paulo, SP' },
  { id: 4, name: 'Sábado Solidário', reason: 'Evento Local', duration: '28/10/2025', institution: 'Hemonúcleo Piracicaba', location: 'Piracicaba, SP' },
];

// --- COMPONENTE PRINCIPAL DA PÁGINA ---
export default function CampaignsPage() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col items-start justify-between gap-2 sm:flex-row sm:items-center">
        <h1 className="text-3xl font-bold text-gray-800">Campanhas</h1>
        <div className="text-right">
          <p className="text-sm text-gray-600">
            Campanhas ativas: <span className="font-bold text-gray-800">4</span>
          </p>
        </div>
      </div>

      <div className="flex flex-col justify-between gap-3 md:flex-row">
        <div className="flex gap-2">
          <button className="flex items-center gap-2 rounded-lg bg-red-600 px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2">
            <FiPlus size={16} />
            Criar Campanha
          </button>
          <button className="flex items-center gap-2 rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-semibold text-gray-700 shadow-sm transition hover:bg-gray-50">
            <FiUpload size={16} />
            Importar
          </button>
          <button className="flex items-center gap-2 rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-semibold text-gray-700 shadow-sm transition hover:bg-gray-50">
            <FiDownload size={16} />
            Exportar
          </button>
        </div>

        <button className="flex items-center gap-2 rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-semibold text-gray-700 shadow-sm transition hover:bg-gray-50">
          <FiFilter size={16} />
          Filtrar
        </button>
      </div>

      <div className="overflow-hidden rounded-lg border border-gray-200 bg-white shadow-md">
        <table className="min-w-full divide-y divide-gray-200">
          
          <thead className="bg-gray-50">
            <tr>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500"
              >
                Nome da Campanha
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500"
              >
                Motivo
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500"
              >
                Duração
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500"
              >
                Instituição
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500"
              >
                Localização
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500"
              >
                Operações
              </th>
            </tr>
          </thead>
          
          <tbody className="divide-y divide-gray-200">
            {mockCampaigns.map((campaign) => (
              <tr key={campaign.id} className="transition hover:bg-gray-50">
                
                <td className="whitespace-nowrap px-6 py-4">
                  <div className="text-sm font-medium text-gray-900">{campaign.name}</div>
                </td>
                
                <td className="whitespace-nowrap px-6 py-4">
                  <div className="text-sm text-gray-600">{campaign.reason}</div>
                </td>

                <td className="whitespace-nowrap px-6 py-4">
                  <div className="text-sm text-gray-600">{campaign.duration}</div>
                </td>
                
                <td className="whitespace-nowrap px-6 py-4">
                  <div className="text-sm text-gray-600">{campaign.institution}</div>
                </td>
                
                <td className="whitespace-nowrap px-6 py-4">
                  <div className="text-sm text-gray-600">{campaign.location}</div>
                </td>

                <td className="whitespace-nowrap px-6 py-4 text-sm font-medium">
                  <div className="flex items-center gap-4">
                    <button className="text-gray-400 transition hover:text-red-600" title="Editar">
                      <FiEdit2 size={16} />
                    </button>
                    <button className="text-gray-400 transition hover:text-red-600" title="Excluir">
                      <FiTrash2 size={16} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}