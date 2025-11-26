import React, { useState, useEffect, useMemo } from 'react';
import {
  FiPlus,
  FiFilter,
  FiEdit2,
  FiTrash2,
  FiLoader,
  FiX, 
} from 'react-icons/fi';
import { db } from '../../services/firebase/config';
import {
  collection,
  onSnapshot,
  addDoc,
  doc,
  deleteDoc,
  updateDoc
} from 'firebase/firestore';

// --- INTERFACE DE DADOS ---
interface Donor {
  id: string;
  name: string; 
  email: string;
  phone: string; 
  city: string; // 1. Novo Campo
  status: 'Apto' | 'Inapto' | 'Inapto Temporariamente' | 'Inapto Cronicamente' | string;
}

// Interface para os dados do formulário
interface DonorFormData {
  nome: string;
  email: string;
  telefone: string;
  cidade: string; 
}

// --- COMPONENTE INTERNO: StatusPill ---
const StatusPill: React.FC<{ status: string }> = ({ status }) => {
  const isApto = status === 'Apto' || status === 'Apto para Doar' || status === 'Ativo';
  const bgColor = isApto ? 'bg-green-100' : 'bg-red-100';
  const textColor = isApto ? 'text-green-700' : 'text-red-700';
  
  let displayText = status;
  if (status === 'Ativo') displayText = 'Apto';
  if (status === 'Inativo') displayText = 'Inapto';

  return (
    <span className={`rounded-full px-3 py-1 text-xs font-semibold ${bgColor} ${textColor}`}>
      {displayText}
    </span>
  );
};

// --- COMPONENTE INTERNO: MODAL DE DOADOR ---
interface DonorModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: DonorFormData, donorId: string | null) => Promise<void>;
  donorToEdit: Donor | null; 
}

const DonorFormModal: React.FC<DonorModalProps> = ({ isOpen, onClose, onSave, donorToEdit }) => {
  
  const [formData, setFormData] = useState<DonorFormData>({
    nome: '',
    email: '',
    telefone: '',
    cidade: '', // Inicializa cidade
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const isEditMode = donorToEdit !== null;
  const title = isEditMode ? 'Editar Doador' : 'Adicionar Novo Doador';
  const saveButtonText = isEditMode ? 'Salvar Alterações' : 'Salvar Doador';

  useEffect(() => {
    if (isEditMode && isOpen && donorToEdit) {
      setFormData({
        nome: donorToEdit.name,
        email: donorToEdit.email,
        telefone: donorToEdit.phone,
        cidade: donorToEdit.city, // Preenche cidade
      });
    } else {
      setFormData({
        nome: '',
        email: '',
        telefone: '',
        cidade: '',
      });
    }
  }, [donorToEdit, isOpen, isEditMode]);

  if (!isOpen) return null;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;

    if (name === 'telefone') {
      let text = value.replace(/\D/g, '');
      if (text.length > 11) text = text.slice(0, 11);
      if (text.length > 10) text = text.replace(/^(\d{2})(\d{5})(\d{4}).*/, '($1) $2-$3');
      else if (text.length > 6) text = text.replace(/^(\d{2})(\d{4})(\d{0,4}).*/, '($1) $2-$3');
      else if (text.length > 2) text = text.replace(/^(\d{2})(\d{0,5}).*/, '($1) $2');
      
      setFormData(prev => ({ ...prev, [name]: text }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    if (!formData.nome || !formData.email) {
      setError('Nome e Email são obrigatórios.');
      return;
    }
    setIsLoading(true);
    try {
      await onSave(formData, isEditMode && donorToEdit ? donorToEdit.id : null);
      onClose();
    } catch (err) {
      setError('Falha ao salvar. Tente novamente.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleClose = () => {
    setError(null);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="w-full max-w-lg rounded-lg bg-white p-6 shadow-xl">
        <div className="flex items-center justify-between border-b pb-3">
          <h2 className="text-xl font-bold text-gray-800">{title}</h2>
          <button onClick={handleClose} className="rounded-full p-1 text-gray-500 transition hover:bg-gray-200">
            <FiX size={24} />
          </button>
        </div>
        <form onSubmit={handleSubmit} className="mt-4 space-y-4">
          <div>
            <label htmlFor="nome" className="block text-sm font-medium text-gray-700">Nome Completo</label>
            <input type="text" name="nome" id="nome" value={formData.nome} onChange={handleChange} className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2 shadow-sm focus:border-red-500 focus:ring-red-500" />
          </div>
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email</label>
            <input type="email" name="email" id="email" value={formData.email} onChange={handleChange} className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2 shadow-sm focus:border-red-500 focus:ring-red-500" />
          </div>
          <div>
            <label htmlFor="telefone" className="block text-sm font-medium text-gray-700">Telefone</label>
            <input 
              type="text" 
              name="telefone" 
              id="telefone" 
              value={formData.telefone} 
              onChange={handleChange}
              maxLength={15} 
              placeholder="(11) 99999-9999"
              className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2 shadow-sm focus:border-red-500 focus:ring-red-500" 
            />
          </div>
          
          {/* 3. Novo Input de Cidade */}
          <div>
            <label htmlFor="cidade" className="block text-sm font-medium text-gray-700">Cidade</label>
            <input type="text" name="cidade" id="cidade" value={formData.cidade} onChange={handleChange} className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2 shadow-sm focus:border-red-500 focus:ring-red-500" />
          </div>

          {isEditMode && donorToEdit && (
             <div className="pt-2">
               <p className="text-sm text-gray-500">Status atual: <span className="font-semibold text-gray-700">{donorToEdit.status}</span></p>
               <p className="text-xs text-gray-400">O status é gerenciado automaticamente pelo histórico de doações.</p>
             </div>
          )}

          {error && <p className="text-sm text-red-600">{error}</p>}
          
          <div className="flex justify-end gap-3 pt-4">
            <button type="button" onClick={handleClose} className="rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-semibold text-gray-700 shadow-sm transition hover:bg-gray-50" disabled={isLoading}>
              Cancelar
            </button>
            <button type="submit" className="flex items-center justify-center rounded-lg bg-red-600 px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-red-700" disabled={isLoading}>
              {isLoading ? <FiLoader className="animate-spin" size={20} /> : saveButtonText}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};


// --- COMPONENTE PRINCIPAL DA PÁGINA---
export default function DonorsPage() {
  const [donors, setDonors] = useState<Donor[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [currentDonor, setCurrentDonor] = useState<Donor | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('Todos');

  useEffect(() => {
    setIsLoading(true);
    const usersCollectionRef = collection(db, 'users');
    
    const unsubscribe = onSnapshot(usersCollectionRef, (querySnapshot) => {
      const donorsData: Donor[] = [];
      querySnapshot.forEach((doc) => {
        const data = doc.data();
        if (data.nome) {
          
          let displayStatus = data.status || 'Apto';
          
          donorsData.push({
            id: doc.id,
            name: data.nome,
            email: data.email,
            phone: data.telefone,
            city: data.cidade || '-',
            status: displayStatus,
          });
        }
      });
      setDonors(donorsData);
      setIsLoading(false);
    }, (error) => {
      console.error("Erro ao buscar doadores: ", error);
      setIsLoading(false);
    });
    return () => unsubscribe();
  }, []); 

  const handleSaveDonor = async (data: DonorFormData, donorId: string | null) => {
    try {
      if (donorId) {
        const donorDocRef = doc(db, 'users', donorId);
        await updateDoc(donorDocRef, {
            nome: data.nome,
            email: data.email,
            telefone: data.telefone,
            cidade: data.cidade // Salva cidade
        });
      } else {
        const usersCollectionRef = collection(db, 'users');
        await addDoc(usersCollectionRef, {
            ...data,
            status: 'Apto para Doar',
            doacoes: 0,
            vidasSalvas: 0
        });
      }
    } catch (error) {
      console.error("Erro ao salvar doador: ", error);
      throw new Error("Falha ao salvar no Firestore.");
    }
  };

  const handleDeleteDonor = async (donorId: string) => {
    if (!window.confirm("Tem certeza que deseja excluir este doador? Esta ação é permanente.")) {
      return;
    }

    try {
      const donorDocRef = doc(db, 'users', donorId);
      await deleteDoc(donorDocRef);
    } catch (error) {
      console.error("Erro ao excluir doador: ", error);
      alert("Falha ao excluir o doador. Tente novamente.");
    }
  };

  const openAddModal = () => {
    setCurrentDonor(null); 
    setIsModalOpen(true);
  };

  const openEditModal = (donor: Donor) => {
    setCurrentDonor(donor); 
    setIsModalOpen(true);
  };

  const handleClearFilters = () => {
    setSearchTerm('');
    setStatusFilter('Todos');
  };

  const filteredDonors = useMemo(() => {
    return donors.filter(donor => {
      const statusMatch = statusFilter === 'Todos' || 
                          (statusFilter === 'Apto' && (donor.status === 'Apto' || donor.status === 'Apto para Doar' || donor.status === 'Ativo')) ||
                          (statusFilter === 'Inapto' && (donor.status !== 'Apto' && donor.status !== 'Apto para Doar' && donor.status !== 'Ativo'));
      
      const searchMatch = searchTerm.trim() === '' || 
        donor.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        donor.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        donor.city.toLowerCase().includes(searchTerm.toLowerCase()); // Inclui cidade na busca
      return statusMatch && searchMatch;
    });
  }, [donors, searchTerm, statusFilter]);

  const isFilterActive = searchTerm.trim() !== '' || statusFilter !== 'Todos';

  return (
    <div className="space-y-6">
      
      {/* Cabeçalho */}
      <div className="flex flex-col items-start justify-between gap-2 sm:flex-row sm:items-center">
        <h1 className="text-3xl font-bold text-gray-800">Doadores</h1>
        <div className="text-right">
          <p className="text-sm text-gray-600">
            Mostrando: <span className="font-bold text-gray-800">{filteredDonors.length}</span> de {donors.length}
          </p>
        </div>
      </div>

      {/* Barra de Ações */}
      <div className="flex flex-col justify-between gap-3 md:flex-row">
        <div className="flex gap-2">
          <button 
            onClick={openAddModal}
            className="flex items-center gap-2 rounded-lg bg-red-600 px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
          >
            <FiPlus size={16} />
            Adicionar Novo
          </button>
        </div>
        
        <div className="relative">
          <button 
            onClick={() => setIsFilterOpen(!isFilterOpen)}
            className={`flex items-center gap-2 rounded-lg border px-4 py-2 text-sm font-semibold shadow-sm transition hover:bg-gray-50
              ${isFilterActive 
                ? 'border-red-500 bg-red-50 text-red-600' 
                : 'border-gray-300 bg-white text-gray-700'}
            `}
          >
            <FiFilter size={16} />
            Filtrar
          </button>
          {isFilterOpen && (
            <div className="absolute right-0 top-12 z-20 w-72 rounded-lg border border-gray-200 bg-white p-4 shadow-lg">
              <h4 className="text-base font-semibold text-gray-800">Filtrar Doadores</h4>
              <div className="mt-4">
                <label htmlFor="search" className="block text-sm font-medium text-gray-700">Nome, Email ou Cidade</label>
                <input type="text" id="search" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} placeholder="Buscar..." className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2 text-sm shadow-sm focus:border-red-500 focus:ring-red-500" />
              </div>
              <div className="mt-4">
                <label htmlFor="statusFilter" className="block text-sm font-medium text-gray-700">Status</label>
                <select id="statusFilter" name="statusFilter" value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} className="mt-1 block w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm shadow-sm focus:border-red-500 focus:ring-red-500">
                  <option value="Todos">Todos</option>
                  <option value="Apto">Apto</option>
                  <option value="Inapto">Inapto</option>
                </select>
              </div>
              <div className="mt-4 flex justify-between border-t pt-4">
                <button onClick={handleClearFilters} className="text-sm font-medium text-red-600 transition hover:text-red-500">
                  Limpar Filtros
                </button>
                <button onClick={() => setIsFilterOpen(false)} className="rounded-lg bg-gray-600 px-3 py-1 text-sm font-semibold text-white shadow-sm transition hover:bg-gray-700">
                  Fechar
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="overflow-hidden rounded-lg border border-gray-200 bg-white shadow-md">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">Nome</th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">Email</th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">Telefone</th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">Cidade</th> {/* 4. Nova Coluna */}
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">Status</th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">Operações</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {isLoading ? (
              <tr>
                <td colSpan={6} className="py-12 text-center"> {/* Colspan ajustado */}
                  <div className="flex justify-center items-center gap-2 text-gray-500">
                    <FiLoader className="animate-spin" size={20} />
                    <span className="text-lg">Carregando doadores...</span>
                  </div>
                </td>
              </tr>
            ) : filteredDonors.length === 0 ? (
              <tr>
                <td colSpan={6} className="py-12 text-center text-gray-500">
                  {isFilterActive ? "Nenhum doador encontrado com esses filtros." : "Nenhum doador encontrado."}
                </td>
              </tr>
            ) : (
              filteredDonors.map((donor) => (
                <tr key={donor.id} className="transition hover:bg-gray-50">
                  <td className="whitespace-nowrap px-6 py-4"><div className="text-sm font-medium text-gray-900">{donor.name}</div></td>
                  <td className="whitespace-nowrap px-6 py-4"><div className="text-sm text-gray-600">{donor.email}</div></td>
                  <td className="whitespace-nowrap px-6 py-4"><div className="text-sm text-gray-600">{donor.phone}</div></td>
                  <td className="whitespace-nowrap px-6 py-4"><div className="text-sm text-gray-600">{donor.city}</div></td> {/* 4. Nova Célula */}
                  <td className="whitespace-nowrap px-6 py-4"><StatusPill status={donor.status} /></td>
                  <td className="whitespace-nowrap px-6 py-4 text-sm font-medium">
                    <div className="flex items-center gap-4">
                      <button onClick={() => openEditModal(donor)} className="text-gray-400 transition hover:text-red-600" title="Editar">
                        <FiEdit2 size={16} />
                      </button>
                      <button onClick={() => handleDeleteDonor(donor.id)} className="text-gray-400 transition hover:text-red-600" title="Excluir">
                        <FiTrash2 size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <DonorFormModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSaveDonor}
        donorToEdit={currentDonor}
      />

    </div> 
  );
}