import React, { useState, useEffect, useMemo } from 'react';
import {
  FiCheck,
  FiX,
  FiClock,
  FiCalendar,
  FiUser,
  FiChevronLeft,
  FiChevronRight,
  FiRefreshCw,
  FiPlus,
  FiThumbsUp,
  FiSlash
} from 'react-icons/fi';
import { db } from '../../services/firebase/config'; 
import { 
  collection, 
  onSnapshot, 
  doc, 
  updateDoc, 
  addDoc, 
  query, 
  getDoc, 
  increment
} from 'firebase/firestore';

interface Appointment {
  id: string;
  patientName: string;
  data: string; 
  hora: string;
  status: 'Pendente' | 'Confirmado' | 'Cancelado' | 'Concluído' | 'Não Compareceu';
  hemocentroId: string;
  userId?: string;
}

const CURRENT_HEMOCENTRO_ID = 'hc-campinas';

const getTodayISO = () => {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const day = String(now.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

const isAppointmentPast = (dateStr: string, timeStr: string) => {
  if (!dateStr || !timeStr) return false;
  const now = new Date();
  const todayStr = getTodayISO();

  if (dateStr < todayStr) return true;
  if (dateStr > todayStr) return false;

  if (dateStr === todayStr) {
    const currentHours = now.getHours();
    const currentMinutes = now.getMinutes();
    const [appHours, appMinutes] = timeStr.split(':').map(Number);
    if (currentHours > appHours) return true;
    if (currentHours === appHours && currentMinutes >= appMinutes) return true;
  }
  return false;
};

const isDayPast = (year: number, month: number, day: number) => {
  const checkDate = new Date(year, month, day);
  const today = new Date();
  today.setHours(0, 0, 0, 0); 
  return checkDate < today;
};

interface CreateAppointmentModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const CreateAppointmentModal: React.FC<CreateAppointmentModalProps> = ({ isOpen, onClose }) => {
  const [formData, setFormData] = useState({ patientName: '', data: '', hora: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.patientName || !formData.data || !formData.hora) return alert("Preencha tudo.");
    setIsSubmitting(true);
    try {
      await addDoc(collection(db, 'appointments'), {
        ...formData,
        hemocentroId: CURRENT_HEMOCENTRO_ID,
        status: 'Confirmado',
        userId: 'manual_entry'
      });
      alert('Agendamento criado!');
      setFormData({ patientName: '', data: '', hora: '' });
      onClose();
    } catch (error) {
      alert("Erro ao criar.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4">
      <div className="relative w-full max-w-md rounded-lg bg-white shadow-xl">
        <div className="flex items-center justify-between p-4 border-b border-gray-200">
          <h2 className="text-xl font-bold text-gray-800">Novo Agendamento Manual</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600"><FiX size={24} /></button>
        </div>
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Nome</label>
            <input type="text" value={formData.patientName} onChange={(e) => setFormData({...formData, patientName: e.target.value})} className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm" required />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Data</label>
              <input 
                type="date" 
                min={getTodayISO()} 
                value={formData.data} 
                onChange={(e) => setFormData({...formData, data: e.target.value})} 
                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm" 
                required 
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Hora</label>
              <input type="time" value={formData.hora} onChange={(e) => setFormData({...formData, hora: e.target.value})} className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm" required />
            </div>
          </div>
          <div className="flex justify-end gap-2 pt-4">
            <button type="button" onClick={onClose} className="rounded-lg border border-gray-300 px-4 py-2 text-sm font-semibold text-gray-700 hover:bg-gray-50">Cancelar</button>
            <button type="submit" disabled={isSubmitting} className="rounded-lg bg-red-600 px-4 py-2 text-sm font-semibold text-white hover:bg-red-700 disabled:opacity-50">{isSubmitting ? 'Salvando...' : 'Confirmar'}</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default function AppointmentsPage() {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  
  const [now, setNow] = useState(new Date());
  const [currentDate, setCurrentDate] = useState(new Date()); 
  const [selectedDateStr, setSelectedDateStr] = useState<string>(getTodayISO());

  useEffect(() => {
    const timer = setInterval(() => setNow(new Date()), 30000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    setIsLoading(true);
    const q = query(collection(db, 'appointments'));
    const unsub = onSnapshot(q, (snapshot) => {
      const data = snapshot.docs.map(doc => {
        const d = doc.data();
        return { id: doc.id, patientName: d.patientName, data: d.data || '', hora: d.hora || '', status: d.status, hemocentroId: d.hemocentroId, userId: d.userId };
      }) as Appointment[];
      
      data.sort((a, b) => (a.hora || '').localeCompare(b.hora || ''));
      setAppointments(data);
      setIsLoading(false);
    });
    return () => unsub();
  }, []);

  const daysInMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0).getDate();
  const firstDayOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1).getDay(); 
  const monthName = currentDate.toLocaleString('pt-BR', { month: 'long', year: 'numeric' });

  const changeMonth = (offset: number) => {
    setCurrentDate(new Date(currentDate.setMonth(currentDate.getMonth() + offset)));
  };

  const daysWithAppointments = useMemo(() => {
    const set = new Set();
    appointments.forEach(app => { if (app.status !== 'Cancelado') set.add(app.data); });
    return set;
  }, [appointments]);

  const filteredAppointments = appointments.filter(app => app.data === selectedDateStr);
  const updateStatus = async (id: string, newStatus: Appointment['status']) => {
    if (!window.confirm(`Confirmar ação?`)) return;
    try { await updateDoc(doc(db, 'appointments', id), { status: newStatus }); } catch (e) { alert("Erro."); }
  };

  const handleConcludeDonation = async (appointment: Appointment) => {
    if (!window.confirm(`Confirmar doação de ${appointment.patientName}?`)) return;
    try {
      // 1. Marca o agendamento como concluído
      await updateDoc(doc(db, 'appointments', appointment.id), { status: 'Concluído' });

      // 2. Atualiza o perfil do doador
      if (appointment.userId && appointment.userId !== 'manual_entry' && appointment.userId !== 'anonimo') {
        const userRef = doc(db, 'users', appointment.userId);
        const userSnap = await getDoc(userRef);
        
        if (userSnap.exists()) {
          const userData = userSnap.data();
          
          // Regra de dias (Homem 60, Mulher 90)
          const daysToAdd = (userData.sexo === 'Feminino') ? 90 : 60;
          const nextDate = new Date();
          nextDate.setDate(nextDate.getDate() + daysToAdd);
          
          await updateDoc(userRef, {
            doacoes: increment(1),
            vidasSalvas: increment(4),
            ultimaDoacao: new Date().toISOString().split('T')[0],
            proximaDoacao: nextDate.toISOString().split('T')[0],
            status: 'Inapto Temporariamente', 

            'appointment.status': 'Concluído'
          });
        }
      }
      alert("Doação concluída e status do doador atualizado!");
    } catch (error) {
      console.error(error);
      alert("Erro ao concluir.");
    }
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
        
        <div className="flex items-center gap-4">
          <span className="text-xs text-gray-400">
            Hoje: {now.toLocaleDateString()}
          </span>
          <button onClick={() => setIsCreateModalOpen(true)} className="flex items-center gap-2 rounded-lg bg-red-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-red-700">
            <FiPlus size={16} /> Novo Agendamento
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* CALENDÁRIO */}
        <div className="lg:col-span-1">
          <div className="rounded-lg border border-gray-200 bg-white p-4 shadow-md">
            <div className="mb-4 flex justify-between">
              <button onClick={() => changeMonth(-1)} className="p-1 text-gray-600"><FiChevronLeft /></button>
              <h2 className="font-bold capitalize text-gray-800">{monthName}</h2>
              <button onClick={() => changeMonth(1)} className="p-1 text-gray-600"><FiChevronRight /></button>
            </div>
            <div className="grid grid-cols-7 text-center text-xs font-semibold text-gray-400 mb-2">
              <div>D</div><div>S</div><div>T</div><div>Q</div><div>Q</div><div>S</div><div>S</div>
            </div>
            <div className="grid grid-cols-7 gap-1">
              {Array.from({ length: firstDayOfMonth }).map((_, i) => <div key={`e-${i}`} />)}
              {Array.from({ length: daysInMonth }).map((_, i) => {
                const day = i + 1;
                const dayStr = `${currentDate.getFullYear()}-${String(currentDate.getMonth() + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
                
                const isSelected = dayStr === selectedDateStr;
                const hasApps = daysWithAppointments.has(dayStr);
                // Verifica se o dia é passado
                const isPast = isDayPast(currentDate.getFullYear(), currentDate.getMonth(), day);

                return (
                  <button
                    key={day}
                    onClick={() => setSelectedDateStr(dayStr)}
                    className={`
                      relative flex h-10 w-10 flex-col items-center justify-center rounded-full text-sm transition-colors
                      ${isSelected ? 'bg-red-600 font-bold text-white shadow-md' : ''}
                      ${!isSelected && isPast ? 'text-gray-400 bg-gray-50' : ''} 
                      ${!isSelected && !isPast ? 'text-gray-700 hover:bg-red-50' : ''}
                    `}
                  >
                    {day}
                    {hasApps && !isSelected && (
                      <span className={`absolute bottom-1 h-1.5 w-1.5 rounded-full ${isPast ? 'bg-red-300' : 'bg-red-500'}`}></span>
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
            
            {isLoading ? ( <div className="p-8 text-center text-gray-500">Carregando...</div> ) : 
             filteredAppointments.length === 0 ? ( <div className="p-12 text-center text-gray-400"><FiCalendar size={48} className="mx-auto mb-2 opacity-20" /><p>Nenhum agendamento para este dia.</p></div> ) : (
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium uppercase text-gray-500">Hora</th>
                    <th className="px-6 py-3 text-left text-xs font-medium uppercase text-gray-500">Paciente</th>
                    <th className="px-6 py-3 text-left text-xs font-medium uppercase text-gray-500">Status</th>
                    <th className="px-6 py-3 text-right text-xs font-medium uppercase text-gray-500">Ações</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {filteredAppointments.map((app) => {
                    const isPast = isAppointmentPast(app.data, app.hora);
                    return (
                      <tr key={app.id} className="transition hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap flex items-center text-sm font-medium text-gray-900">
                          <FiClock className="mr-2 text-gray-400" /> {app.hora}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{app.patientName}</td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full 
                            ${app.status === 'Confirmado' ? 'bg-green-100 text-green-800' : ''}
                            ${app.status === 'Pendente' ? 'bg-yellow-100 text-yellow-800' : ''}
                            ${app.status === 'Cancelado' ? 'bg-red-100 text-red-800' : ''}
                            ${app.status === 'Concluído' ? 'bg-blue-100 text-blue-800' : ''}
                            ${app.status === 'Não Compareceu' ? 'bg-gray-100 text-gray-800' : ''}
                          `}>
                            {app.status}
                            {app.status === 'Confirmado' && <span className='ml-1 text-[9px] opacity-60'>({isPast ? 'Passado' : 'Futuro'})</span>}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                          <div className="flex justify-end gap-2">
                            {app.status === 'Pendente' && (
                              <>
                                <button onClick={() => updateStatus(app.id, 'Confirmado')} className="text-green-600 hover:text-green-800" title="Aprovar"><FiCheck size={18} /></button>
                                <button onClick={() => updateStatus(app.id, 'Cancelado')} className="text-red-400 hover:text-red-600" title="Rejeitar"><FiX size={18} /></button>
                              </>
                            )}
                            {app.status === 'Confirmado' && (
                              <>
                                {isPast ? (
                                  <>
                                    <button onClick={() => handleConcludeDonation(app)} className="text-blue-600 hover:text-blue-800" title="Concluir"><FiThumbsUp size={18} /></button>
                                    <button onClick={() => updateStatus(app.id, 'Não Compareceu')} className="text-gray-400 hover:text-gray-600" title="Faltou"><FiSlash size={18} /></button>
                                  </>
                                ) : (
                                  <button onClick={() => updateStatus(app.id, 'Cancelado')} className="text-red-600" title="Cancelar"><FiX size={18} /></button>
                                )}
                              </>
                            )}
                            {(app.status === 'Cancelado' || app.status === 'Não Compareceu') && (
                              <button onClick={() => updateStatus(app.id, 'Confirmado')} className="text-green-600" title="Reativar"><FiRefreshCw size={18} /></button>
                            )}
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            )}
          </div>
        </div>
      </div>
      <CreateAppointmentModal isOpen={isCreateModalOpen} onClose={() => setIsCreateModalOpen(false)} />
    </div>
  );
}