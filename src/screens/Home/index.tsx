import React, { useState, useEffect } from 'react';
import { FiCalendar, FiUsers, FiSend, FiAlertTriangle, FiDroplet, FiClock } from 'react-icons/fi';
import { Link } from 'react-router-dom';
import { db } from '../../services/firebase/config';
import { collection, getCountFromServer, query, where, orderBy, limit, getDocs } from 'firebase/firestore';

interface InfoCardProps {
  title: string;
  value: string | number;
  icon: React.ElementType;
  iconBgColor?: string;
  iconColor?: string;
}

const InfoCard: React.FC<InfoCardProps> = ({
  title, value, icon: Icon, iconBgColor = 'bg-gray-100', iconColor = 'text-gray-600'
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

export default function DashboardHome() {
  const userName = "Admin";

  const [totalDonors, setTotalDonors] = useState(0);
  const [activeCampaigns, setActiveCampaigns] = useState(0);
  const [nextAppointment, setNextAppointment] = useState("Sem agendamentos");
  const [recentActivity, setRecentActivity] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const urgentNeeds = [
    { type: 'O-', level: 'Crítico', color: 'red-600' },
    { type: 'B-', level: 'Baixo', color: 'yellow-600' },
  ];

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
       const donorsSnapshot = await getCountFromServer(collection(db, 'users'));
        setTotalDonors(donorsSnapshot.data().count); 

        const campaignsSnapshot = await getCountFromServer(collection(db, 'campaigns'));
        setActiveCampaigns(campaignsSnapshot.data().count);
        const q = query(
          collection(db, 'appointments'),
          orderBy('date', 'asc'), 
          limit(5)
        );
        
        const appointmentsSnapshot = await getDocs(q);
        const appointmentsData = appointmentsSnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
        }));

        if (appointmentsData.length > 0) {
          const next = appointmentsData[0] as any;
          const dateParts = next.date.split('-');
          const formattedDate = `${dateParts[2]}/${dateParts[1]} às ${next.time}`;
          setNextAppointment(formattedDate);

          const activities = appointmentsData.map((app: any) => ({
            id: app.id,
            type: 'Agendamento',
            description: `${app.patientName} (${app.date})`,
            time: app.time
          }));
          setRecentActivity(activities);
        } else {
          setNextAppointment("Nenhum");
          setRecentActivity([]);
        }

      } catch (error) {
        console.error("Erro ao buscar dados do dashboard:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  if (isLoading) {
    return <div className="p-10 text-center text-gray-500">Carregando dashboard...</div>;
  }

  return (
    <div className="space-y-8">
      <h2 className="text-2xl font-bold text-gray-800">
        Seja Bem Vindo(a), {userName}!
      </h2>

      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
        <InfoCard 
          title="Total de Doadores" 
          value={totalDonors} 
          icon={FiUsers} 
          iconBgColor="bg-blue-100" 
          iconColor="text-blue-600" 
        />
        <InfoCard 
          title="Campanhas Ativas" 
          value={activeCampaigns} 
          icon={FiSend} 
          iconBgColor="bg-green-100" 
          iconColor="text-green-600" 
        />
 
        <InfoCard 
          title="Tipos Críticos" 
          value={urgentNeeds.length} 
          icon={FiAlertTriangle} 
          iconBgColor="bg-yellow-100" 
          iconColor="text-yellow-600" 
        />
        <InfoCard
          title="Próximo Agendamento"
          value={nextAppointment} 
          icon={FiCalendar} 
          iconBgColor="bg-purple-100" 
          iconColor="text-purple-600"
        />
      </div>

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">

        <div className="lg:col-span-1">
          <h3 className="mb-4 text-xl font-semibold text-gray-700">Necessidades Urgentes</h3>
          <div className="space-y-4 rounded-lg bg-white p-6 shadow-md">
            {urgentNeeds.length > 0 ? (
              urgentNeeds.map((need) => (
                <div key={need.type} className="flex items-center justify-between border-b border-gray-100 pb-3 last:border-b-0 last:pb-0">
                  <div className="flex items-center gap-3">
                    <FiDroplet className={`text-${need.color}`} size={20} />
                    <span className="font-bold text-lg">{need.type}</span>
                    <span className={`rounded-full px-2 py-0.5 text-xs font-medium ${need.level === 'Crítico' ? 'bg-red-100 text-red-600' : 'bg-yellow-100 text-yellow-600'}`}>
                      {need.level}
                    </span>
                  </div>
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
        
        <div className="lg:col-span-2">
          <h3 className="mb-4 text-xl font-semibold text-gray-700">Próximos Agendamentos</h3>
          <div className="rounded-lg bg-white p-6 shadow-md">
            {recentActivity.length > 0 ? (
              <ul className="space-y-4">
                {recentActivity.map((activity) => (
                  <li key={activity.id} className="flex items-center justify-between border-b border-gray-100 pb-3 last:border-b-0 last:pb-0">
                    <div className="flex items-center gap-3">
                      <FiClock size={18} className="text-purple-500" />
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
              <p className="text-center text-gray-500">Nenhum agendamento recente.</p>
            )}
            <div className="mt-4 text-center">
              <Link to="/agendamentos" className="text-sm font-medium text-red-600 hover:underline">
                Ver todos os agendamentos
              </Link>
            </div>
          </div>
        </div>

      </div> 
    </div> 
  );
}