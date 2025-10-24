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
const mockDonors = [
  { id: 1, name: 'Ana Carolina Silva', email: 'ana.silva@gmail.com', phone: '+55 19 91234-5678', status: 'Ativo' },
  { id: 2, name: 'Bruno Costa Almeida', email: 'bruno.c@hotmail.com', phone: '+55 11 98765-4321', status: 'Inativo' },
  { id: 3, name: 'Carla Dias Souza', email: 'carla.souza@outlook.com', phone: '+55 21 91122-3344', status: 'Ativo' },
  { id: 4, name: 'Daniel Moreira Lima', email: 'daniel.m@gmail.com', phone: '+55 31 95566-7788', status: 'Ativo' },
  { id: 5, name: 'Eduarda Ferreira', email: 'eduarda.f@yahoo.com', phone: '+55 41 99988-7766', status: 'Ativo' },
  { id: 6, name: 'Fábio Nunes', email: 'fabio.nunes@gmail.com', phone: '+55 51 91212-3434', status: 'Inativo' },
];

const StatusPill: React.FC<{ status: string }> = ({ status }) => {
  const isActive = status === 'Ativo';
  const bgColor = isActive ? 'bg-green-100' : 'bg-red-100';
  const textColor = isActive ? 'text-green-700' : 'text-red-700';

  return (
    <span
      className={`rounded-full px-3 py-1 text-xs font-semibold ${bgColor} ${textColor}`}
    >
      {status}
    </span>
  );
};


// --- COMPONENTE PRINCIPAL DA PÁGINA ---
export default function DonorsPage() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col items-start justify-between gap-2 sm:flex-row sm:items-center">
        <h1 className="text-3xl font-bold text-gray-800">Doadores</h1>
        <div className="text-right">
          <p className="text-sm text-gray-600">
            Total de doadores: <span className="font-bold text-gray-800">1800</span>
          </p>
        </div>
      </div>

      <div className="flex flex-col justify-between gap-3 md:flex-row">
        <div className="flex gap-2">
          <button className="flex items-center gap-2 rounded-lg bg-red-600 px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2">
            <FiPlus size={16} />
            Adicionar Novo
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
                Nome
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500"
              >
                Email
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500"
              >
                Telefone
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500"
              >
                Status
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
            {mockDonors.map((donor) => (
              <tr key={donor.id} className="transition hover:bg-gray-50">
                
                {/* Coluna Nome */}
                <td className="whitespace-nowrap px-6 py-4">
                  <div className="text-sm font-medium text-gray-900">{donor.name}</div>
                </td>
                
                {/* Coluna Email */}
                <td className="whitespace-nowrap px-6 py-4">
                  <div className="text-sm text-gray-600">{donor.email}</div>
                </td>

                {/* Coluna Fone */}
                <td className="whitespace-nowrap px-6 py-4">
                  <div className="text-sm text-gray-600">{donor.phone}</div>
                </td>
                
                {/* Coluna Status */}
                <td className="whitespace-nowrap px-6 py-4">
                  <StatusPill status={donor.status} />
                </td>
                
                {/* Coluna Operações */}
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