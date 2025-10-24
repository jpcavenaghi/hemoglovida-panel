import React, { useState, useMemo } from 'react';
import {
  FiPlus,
  FiEdit2,
  FiTrash2,
} from 'react-icons/fi';

// --- DADOS DE EXEMPLO (MOCK) ---
const mockAppointments = [
  { id: 1, patientName: 'Ana Carolina Silva', date: '2025-10-27', time: '09:00' },
  { id: 2, patientName: 'Fábio Nunes', date: '2025-10-27', time: '10:30' },
  { id: 3, patientName: 'Bruno Costa Almeida', date: '2025-10-29', time: '14:00' },
  { id: 4, patientName: 'Carla Dias Souza', date: '2025-10-31', time: '08:30' },
  { id: 5, patientName: 'Daniel Moreira Lima', date: '2025-10-31', time: '11:00' },
  { id: 6, patientName: 'Eduarda Ferreira', date: '2025-10-31', time: '15:00' },
];

// --- DADOS PARA GERAR O CALENDÁRIO ---
const CALENDAR_MONTH = "Outubro";
const CALENDAR_YEAR = "2025";
const CALENDAR_START_DAY_OFFSET = 3;
const CALENDAR_TOTAL_DAYS = 31;
const dayHeaders = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'];

// --- COMPONENTE PRINCIPAL DA PÁGINA ---
export default function AppointmentsPage() {
  const [selectedDate, setSelectedDate] = useState<string | null>('2025-10-31');

  const daysWithAppointments = useMemo(() => {
    return new Set(mockAppointments.map(app => app.date));
  }, []);

  const filteredAppointments = useMemo(() => {
    if (!selectedDate) return [];
    return mockAppointments.filter(app => app.date === selectedDate);
  }, [selectedDate]);

  const formatDateForDisplay = (isoDate: string) => {
    return new Date(isoDate + 'T12:00:00').toLocaleDateString('pt-BR');
  };
  const getIsoDateForDay = (day: number) => {
    return `2025-10-${String(day).padStart(2, '0')}`;
  };

  const paddingDays = Array(CALENDAR_START_DAY_OFFSET).fill(null);
  const daysInMonth = Array.from({ length: CALENDAR_TOTAL_DAYS }, (_, i) => i + 1);

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-gray-800">Agendamentos de Coleta</h1>

      <div className="flex justify-start">
        <button className="flex items-center gap-2 rounded-lg bg-red-600 px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2">
          <FiPlus size={16} />
          Novo Agendamento
        </button>
      </div>

      <div className="overflow-hidden rounded-lg border border-gray-200 bg-white shadow-md">
        <div className="flex items-center justify-between border-b border-gray-200 p-4">
          <h2 className="text-lg font-semibold text-gray-800">
            {CALENDAR_MONTH} {CALENDAR_YEAR}
          </h2>
        </div>
        <div className="grid grid-cols-7 border-b border-gray-200 bg-gray-50">
          {dayHeaders.map((day) => (
            <div key={day} className="py-2 text-center text-xs font-medium uppercase text-gray-500">
              {day}
            </div>
          ))}
        </div>
        <div className="grid grid-cols-7">
          {paddingDays.map((_, index) => (
            <div key={`pad-${index}`} className="h-28 border-b border-r border-gray-100 bg-gray-50"></div>
          ))}
          {daysInMonth.map((day) => {
            const isoDate = getIsoDateForDay(day);
            const hasAppointment = daysWithAppointments.has(isoDate);
            const isSelected = selectedDate === isoDate;
            return (
              <div
                key={day}
                className={`
                  h-28 cursor-pointer border-b border-r border-gray-100 p-2
                  transition-colors duration-150 
                  ${isSelected ? 'border-2 border-red-500 bg-red-50' : 'hover:bg-gray-100'}
                `}
                onClick={() => setSelectedDate(isoDate)}
              >
                <span className={`text-sm font-medium ${isSelected ? 'text-red-600' : 'text-gray-700'}`}>
                  {day}
                </span>
                {hasAppointment && (
                  <div className="mt-2 flex justify-start">
                    <span className="h-2 w-2 rounded-full bg-red-500"></span>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {selectedDate && (
        <div className="overflow-hidden rounded-lg border border-gray-200 bg-white shadow-md">
          <div className="border-b border-gray-200 p-4">
            <h3 className="text-lg font-semibold text-gray-800">
              Coletas para {formatDateForDisplay(selectedDate)}
            </h3>
          </div>

          {filteredAppointments.length > 0 ? (
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                    Paciente
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                    Data da Coleta
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                    Hora
                  </th>
                  {/* --- COLUNA ADICIONADA --- */}
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                    Operações
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {filteredAppointments.map((app) => (
                  <tr key={app.id}>
                    <td className="whitespace-nowrap px-6 py-4">
                      <div className="text-sm font-medium text-gray-900">{app.patientName}</div>
                    </td>
                    <td className="whitespace-nowrap px-6 py-4">
                      <div className="text-sm text-gray-600">{formatDateForDisplay(app.date)}</div>
                    </td>
                    <td className="whitespace-nowrap px-6 py-4">
                      <div className="text-sm text-gray-600">{app.time}</div>
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
          ) : (
            <p className="p-6 text-center text-gray-500">
              Nenhuma coleta agendada para este dia.
            </p>
          )}
        </div>
      )}
    </div>
  );
}