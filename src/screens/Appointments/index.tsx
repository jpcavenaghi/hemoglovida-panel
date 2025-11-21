import React, { useState, useEffect, useMemo } from 'react';
import {
  FiCheck,
  FiX,
  FiClock,
  FiCalendar,
  FiUser,
  FiChevronLeft,
  FiChevronRight
} from 'react-icons/fi';
import { db } from '../../services/firebase/config'; 
import { 
  collection, 
  onSnapshot, 
  doc, 
  updateDoc, 
  query, 
} from 'firebase/firestore';

// --- INTERFACES ---
interface Appointment {
  id: string;
  patientName: string;
  data: string; // YYYY-MM-DD
  hora: string; // HH:mm
  status: 'Pendente' | 'Confirmado' | 'Cancelado';
  hemocentroId: string;
}

// --- COMPONENTE PRINCIPAL ---
export default function AppointmentsPage() {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  const [currentDate, setCurrentDate] = useState(new Date()); // Mês atual visualizado
  const [selectedDateStr, setSelectedDateStr] = useState<string>(new Date().toISOString().split('T')[0]); // Dia clicado (YYYY-MM-DD)

  useEffect(() => {
    setIsLoading(true);
    const q = query(collection(db, 'appointments'));

    const unsub = onSnapshot(q, (snapshot) => {
      const data = snapshot.docs.map(doc => {
        const docData = doc.data();
        return {
          id: doc.id,
          patientName: docData.patientName,
          data: docData.data || '', 
          hora: docData.hora || '',
          status: docData.status,
          hemocentroId: docData.hemocentroId
        };
      }) as Appointment[];
      
      // Ordena por hora
      data.sort((a, b) => a.hora.localeCompare(b.hora));
      
      setAppointments(data);
      setIsLoading(false);
    });

    return () => unsub();
  }, []);

  const daysInMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0).getDate();
  const firstDayOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1).getDay(); // 0 = Domingo

  const monthName = currentDate.toLocaleString('pt-BR', { month: 'long', year: 'numeric' });

  const changeMonth = (offset: number) => {
    const newDate = new Date(currentDate.setMonth(currentDate.getMonth() + offset));
    setCurrentDate(new Date(newDate));
  };

  const daysWithAppointments = useMemo(() => {
    const set = new Set();
    appointments.forEach(app => {
      if (app.status !== 'Cancelado') set.add(app.data);
    });
    return set;
  }, [appointments]);

  const filteredAppointments = appointments.filter(app => app.data === selectedDateStr);

  const handleApprove = async (id: string) => {
    try { await updateDoc(doc(db, 'appointments', id), { status: 'Confirmado' }); } catch (e) { alert("Erro"); }
  };

  const handleReject = async (id: string) => {
    if (!window.confirm("Rejeitar agendamento?")) return;
    try { await updateDoc(doc(db, 'appointments', id), { status: 'Cancelado' }); } catch (e) { alert("Erro"); }
  };

  const formatDateDisplay = (dateStr: string) => {
    if (!dateStr) return '-';
    const parts = dateStr.split('-');
    return `${parts[2]}/${parts[1]}/${parts[0]}`;
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <h1 className="text-3xl font-bold text-gray-800">Gerenciar Agendamentos</h1>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        
        <div className="lg:col-span-1">
          <div className="rounded-lg border border-gray-200 bg-white p-4 shadow-md">
            <div className="mb-4 flex items-center justify-between">
              <button onClick={() => changeMonth(-1)} className="p-1 text-gray-600 hover:text-red-600"><FiChevronLeft size={20} /></button>
              <h2 className="text-lg font-bold capitalize text-gray-800">{monthName}</h2>
              <button onClick={() => changeMonth(1)} className="p-1 text-gray-600 hover:text-red-600"><FiChevronRight size={20} /></button>
            </div>

            <div className="mb-2 grid grid-cols-7 text-center text-xs font-semibold text-gray-400">
              <div>D</div><div>S</div><div>T</div><div>Q</div><div>Q</div><div>S</div><div>S</div>
            </div>

            <div className="grid grid-cols-7 gap-1">
              {Array.from({ length: firstDayOfMonth }).map((_, i) => (
                <div key={`empty-${i}`} />
              ))}

              {Array.from({ length: daysInMonth }).map((_, i) => {
                const day = i + 1;
                const dayStr = `${currentDate.getFullYear()}-${String(currentDate.getMonth() + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
                const isSelected = dayStr === selectedDateStr;
                const hasApps = daysWithAppointments.has(dayStr);

                return (
                  <button
                    key={day}
                    onClick={() => setSelectedDateStr(dayStr)}
                    className={`
                      relative flex h-10 w-10 flex-col items-center justify-center rounded-full text-sm transition-colors
                      ${isSelected ? 'bg-red-600 font-bold text-white' : 'text-gray-700 hover:bg-red-50'}
                    `}
                  >
                    {day}
                    {/* Bolinha se tiver agendamento */}
                    {hasApps && !isSelected && (
                      <span className="absolute bottom-1 h-1.5 w-1.5 rounded-full bg-red-500"></span>
                    )}
                  </button>
                );
              })}
            </div>
          </div>
          
          <div className="mt-4 rounded-lg border border-blue-100 bg-blue-50 p-4 text-blue-800">
            <p className="text-sm font-semibold">Data Selecionada:</p>
            <p className="text-xl font-bold">{formatDateDisplay(selectedDateStr)}</p>
            <p className="text-sm mt-1">{filteredAppointments.length} agendamento(s)</p>
          </div>
        </div>

        <div className="lg:col-span-2">
          <div className="overflow-hidden rounded-lg border border-gray-200 bg-white shadow-md">
            <div className="border-b border-gray-200 bg-gray-50 px-6 py-4">
              <h3 className="font-semibold text-gray-700">Lista de Horários</h3>
            </div>
            
            {isLoading ? (
              <div className="p-8 text-center text-gray-500">Carregando...</div>
            ) : filteredAppointments.length === 0 ? (
              <div className="flex flex-col items-center justify-center p-12 text-gray-400">
                <FiCalendar size={48} className="mb-2 opacity-20" />
                <p>Nenhum agendamento para este dia.</p>
              </div>
            ) : (
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">Hora</th>
                    <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">Paciente</th>
                    <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">Status</th>
                    <th className="px-6 py-3 text-right text-xs font-medium uppercase tracking-wider text-gray-500">Ações</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {filteredAppointments.map((app) => (
                    <tr key={app.id} className="transition hover:bg-gray-50">
                      
                      {/* Hora */}
                      <td className="whitespace-nowrap px-6 py-4">
                        <div className="flex items-center text-sm font-medium text-gray-900">
                          <FiClock className="mr-2 text-gray-400" />
                          {app.hora}
                        </div>
                      </td>

                      {/* Paciente */}
                      <td className="whitespace-nowrap px-6 py-4">
                        <div className="flex items-center">
                          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gray-100 text-gray-500"><FiUser /></div>
                          <div className="ml-3"><div className="text-sm font-medium text-gray-900">{app.patientName}</div></div>
                        </div>
                      </td>

                      {/* Status */}
                      <td className="whitespace-nowrap px-6 py-4">
                        <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium
                          ${app.status === 'Confirmado' ? 'bg-green-100 text-green-800' : ''}
                          ${app.status === 'Pendente' ? 'bg-yellow-100 text-yellow-800' : ''}
                          ${app.status === 'Cancelado' ? 'bg-red-100 text-red-800' : ''}
                        `}>
                          {app.status === 'Pendente' && <span className="mr-1.5 h-2 w-2 rounded-full bg-yellow-400"></span>}
                          {app.status}
                        </span>
                      </td>

                      {/* Ações */}
                      <td className="whitespace-nowrap px-6 py-4 text-right text-sm font-medium">
                        {app.status === 'Pendente' && (
                          <div className="flex justify-end gap-2">
                            <button onClick={() => handleApprove(app.id)} className="text-green-600 hover:text-green-800" title="Aprovar">
                              <FiCheck size={18} />
                            </button>
                            <button onClick={() => handleReject(app.id)} className="text-red-400 hover:text-red-600" title="Rejeitar">
                              <FiX size={18} />
                            </button>
                          </div>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>

      </div>
    </div>
  );
}