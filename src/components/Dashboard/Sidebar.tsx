import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { FiHome, FiUser, FiSend, FiUsers, FiLogOut, FiList, FiCalendar } from 'react-icons/fi';
import { signOut } from 'firebase/auth';
import { auth } from '../../services/firebase/config';

const commonLinkClass = "flex items-center gap-3 rounded-md px-3 py-2 text-gray-700 transition-colors duration-150";
const activeLinkClass = "bg-red-100 text-red-700 font-medium";
const inactiveLinkClass = "hover:bg-gray-200";

export default function Sidebar() {
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await signOut(auth);
      navigate('/login');
    } catch (error) {
      console.error("Erro ao sair:", error);
      alert("Não foi possível sair.");
    }
  };

  return (
    <div className="flex h-full flex-col p-4">
    
      {/* NAVEGAÇÃO PRINCIPAL */}
      <nav className="flex-1 space-y-2">
        <NavLink
          to="/"
          end
          className={({ isActive }) => `${commonLinkClass} ${isActive ? activeLinkClass : inactiveLinkClass}`}
        >
          <FiHome size={18} /> Início
        </NavLink>

        <NavLink
          to="/campanhas"
          className={({ isActive }) => `${commonLinkClass} ${isActive ? activeLinkClass : inactiveLinkClass}`}
        >
          <FiSend size={18} /> Campanhas
        </NavLink>

         <NavLink
          to="/doadores"
          className={({ isActive }) => `${commonLinkClass} ${isActive ? activeLinkClass : inactiveLinkClass}`}
        >
          <FiUsers size={18} /> Doadores
        </NavLink>

        <NavLink
          to="/agendamentos" 
          className={({ isActive }) => `${commonLinkClass} ${isActive ? activeLinkClass : inactiveLinkClass}`}
        >
          <FiCalendar size={18} /> Agendamentos
        </NavLink>

        <NavLink
          to="/atividades" 
          className={({ isActive }) => `${commonLinkClass} ${isActive ? activeLinkClass : inactiveLinkClass}`}
        >
          <FiList size={18} /> Atividades Recentes
        </NavLink>

        <NavLink
          to="/perfil" 
          className={({ isActive }) => `${commonLinkClass} ${isActive ? activeLinkClass : inactiveLinkClass}`}
        >
          <FiUser size={18} /> Perfil
        </NavLink>
      </nav>

      {/* Botão Sair */}
      <div className="mt-auto">
         <hr className="my-4 border-gray-200" />
        <button
          onClick={handleLogout}
          className={`${commonLinkClass} ${inactiveLinkClass} w-full`}
        >
          <FiLogOut size={18} /> Sair
        </button>
      </div>
      
    </div> 
  );
}