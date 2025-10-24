import React from 'react';
import { FiCalendar, FiUsers, FiSend, FiAlertTriangle, FiPlusCircle, FiDroplet, FiClock, FiList } from 'react-icons/fi';
import { Link } from 'react-router-dom';

// --- COMPONENTE InfoCard ---
interface InfoCardProps {
  title: string;
  value: string | number;
  icon: React.ElementType;
  iconBgColor?: string;
  iconColor?: string;
}

const InfoCard: React.FC<InfoCardProps> = ({
  title,
  value,
  icon: Icon,
  iconBgColor = 'bg-gray-100',
  iconColor = 'text-gray-600'
}) => (
  <div className="rounded-lg bg-white p-5 shadow-md flex items-center space-x-4">
    <div className={`rounded-full p-3 ${iconBgColor}`}>
      <Icon className={`${iconColor}`} size={24} />
    </div>
    <div>
      <h3 className="text-sm font-medium text-gray-500">{title}</h3>
      <p className="text-2xl font-bold text-gray-900">{value}</p>
    </div>
  </div>
);

// --- COMPONENTE ActionCard ---
interface ActionCardProps {
  text: string;
  icon: React.ElementType;
  to: string;
}

const ActionCard: React.FC<ActionCardProps> = ({ text, icon: Icon, to }) => (
  <Link
    to={to}
    className="flex flex-col items-center justify-center rounded-lg bg-red-50 p-6 shadow-md transition duration-150 ease-in-out hover:bg-red-100 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
  >
    <Icon className="mb-2 text-red-600" size={32} />
    <p className="text-center font-semibold text-red-700">{text}</p>
  </Link>
);

// --- COMPONENTE PRINCIPAL DO DASHBOARD ---
export default function DashboardHome() {
  const userName = "Admin"; // Placeholder

  const nextAppointment = "Amanhã, 14:00"; // Dado de exemplo (buscar do Firestore no futuro)
  
  // Dados de exemplo movidos para dentro da função
  const urgentNeeds = [
    { type: 'O-', level: 'Crítico', color: 'red-600' },
    { type: 'B-', level: 'Baixo', color: 'yellow-600' },
  ];

  const recentActivity = [
    { id: 1, type: 'Novo Doador', description: 'Maria Souza (A+)', time: '10 min atrás' },
    { id: 2, type: 'Campanha Criada', description: 'Urgência O-', time: '1 hora atrás' },
    { id: 3, type: 'Agendamento', description: 'Carlos Silva (AB+)', time: 'Amanhã, 10:00' },
  ];

  return (
    <div className="space-y-8">
      {/* Mensagem de Boas-vindas */}
      <h2 className="text-2xl font-bold text-gray-800">
        Seja Bem Vindo(a), {userName}!
      </h2>

      {/* Grid Superior com Cards */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
        <InfoCard title="Total de Doadores" value="152" icon={FiUsers} iconBgColor="bg-blue-100" iconColor="text-blue-600" />
        <InfoCard title="Campanhas Ativas" value="3" icon={FiSend} iconBgColor="bg-green-100" iconColor="text-green-600" />
        <InfoCard title="Tipos Críticos" value={urgentNeeds.map(n => n.type).join(', ')} icon={FiAlertTriangle} iconBgColor="bg-yellow-100" iconColor="text-yellow-600" />
        <InfoCard
          title="Próximo Agendamento"
          value={nextAppointment} 
          icon={FiCalendar} 
          iconBgColor="bg-purple-100" 
          iconColor="text-purple-600"
        />
      </div>

  <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">

    {/* Coluna 1: Necessidades Urgentes */}
    <div className="lg:col-span-1">
      <h3 className="mb-4 text-xl font-semibold text-gray-700">Necessidades Urgentes</h3>
      <div className="space-y-4 rounded-lg bg-white p-6 shadow-md">
        {urgentNeeds.length > 0 ? (
          urgentNeeds.map((need) => (
            <div key={need.type} className="flex items-center justify-between border-b border-gray-100 pb-3 last:border-b-0 last:pb-0">
              <div className="flex items-center gap-3">
                <FiDroplet className={`text-${need.color === 'red-600' ? 'red-600' : 'yellow-600'}`} size={20} />
                <span className="font-bold text-lg">{need.type}</span>
                <span className={`rounded-full px-2 py-0.5 text-xs font-medium ${need.level === 'Crítico' ? 'bg-red-100 text-red-600' : 'bg-yellow-100 text-yellow-600'}`}>
                  {need.level}
                </span>
              </div>
              {/* Lógica do botão Alertar precisa ser implementada */}
              <button className="rounded-md bg-red-50 px-3 py-1 text-sm font-semibold text-red-600 transition hover:bg-red-100">
                Alertar
              </button>
            </div>
          ))
        ) : (
          <p className="text-center text-gray-500">Nenhuma necessidade urgente.</p>
        )}
      </div>
    </div>

    {/* Coluna 2: Atividade Recente */}
    <div className="lg:col-span-2">
      <h3 className="mb-4 text-xl font-semibold text-gray-700">Atividade Recente / Agendamentos</h3>
      <div className="rounded-lg bg-white p-6 shadow-md">
        {recentActivity.length > 0 ? (
          <ul className="space-y-4">
            {recentActivity.map((activity) => (
              <li key={activity.id} className="flex items-center justify-between border-b border-gray-100 pb-3 last:border-b-0 last:pb-0">
                <div className="flex items-center gap-3">
                  {activity.type === 'Novo Doador' && <FiUsers size={18} className="text-blue-500" />}
                  {activity.type === 'Campanha Criada' && <FiSend size={18} className="text-green-500" />}
                  {activity.type === 'Agendamento' && <FiClock size={18} className="text-purple-500" />}
                  <div>
                    <p className="font-medium text-gray-800">{activity.type}</p>
                    <p className="text-sm text-gray-500">{activity.description}</p>
                  </div>
                </div>
                <span className="text-xs text-gray-400">{activity.time}</span>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-center text-gray-500">Nenhuma atividade recente.</p>
        )}
        <div className="mt-4 text-center">
          <Link to="/atividades" className="text-sm font-medium text-red-600 hover:underline">
            Ver todas as atividades
          </Link>
        </div>
      </div>
    </div>

  </div> 
    </div > 
  );
}