import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useAuth, AuthProvider } from './context/AuthContext';

// Importação de telas
import LoginScreen from './screens/Login';
import DashboardLayout from './screens/Dashboard/DashboardLayout';
import HomePage from './screens/Home';
import DonorsPage from './screens/Donors';
import CampaignsPage from './screens/Campaigns'
import AppointmentsPage from './screens/Appointments'
import ActivitiesPage from './screens/Activities'
import ProfilePage from './screens/Profile'

function ProtectedRoute({ children }: { children: JSX.Element }) {
  const { user, isAdmin, isLoading } = useAuth();

  if (isLoading) {
    return <div className="flex h-screen items-center justify-center">Carregando...</div>;
  }

  if (!user || !isAdmin) {
    return <Navigate to="/login" replace />;
  }

  return children;
}


function App() {
  return (
    <AuthProvider> {/* Garante que o AuthProvider envolve tudo */}
      <BrowserRouter>
        <Routes>
          {/* Rota de Login */}
          <Route path="/login" element={<LoginScreen />} />

          {/* Rota Protegida do Dashboard */}
          <Route
            path="/"
            element={
              <ProtectedRoute>
                <DashboardLayout />
              </ProtectedRoute>
            }
          >
            <Route index element={<HomePage />} />

            <Route path="doadores" element={<DonorsPage />} />

            <Route path="campanhas" element={<CampaignsPage />} />

            <Route path="agendamentos" element={<AppointmentsPage />} />

            <Route path="atividades" element={<ActivitiesPage />} />

            <Route path="perfil" element={<ProfilePage />} />

          </Route>

          {/* Redirecionamento padrão */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;