import React, { useState, useEffect } from 'react';
import {
  FiPlus,
  FiFilter,
  FiEdit2,
  FiTrash2,
  FiX,
} from 'react-icons/fi';
import { db } from '../../services/firebase/config'; 
import { 
  collection, 
  onSnapshot, 
  deleteDoc, 
  doc, 
  addDoc,
  updateDoc 
} from 'firebase/firestore'; 


interface Campaign {
  id: string;
  name: string;
  reason: string;
  startDate: string;  
  endDate: string;    
  institution: string;
  location: string;
  bloodTypes: string[];
}

type CampaignFormData = Omit<Campaign, 'id' | 'institution' | 'location'>;

const adminProfile = {
  institutionName: 'Hemonúcleo Campinas (Admin)',
  location: 'Campinas, SP',
};

const AVAILABLE_BLOOD_TYPES = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'];


interface CreateCampaignModalProps {
  isOpen: boolean;
  onClose: () => void;
  adminProfile: {
    institutionName: string;
    location: string;
  };
}

const CreateCampaignModal: React.FC<CreateCampaignModalProps> = ({ isOpen, onClose, adminProfile }) => {
  const [formData, setFormData] = useState<CampaignFormData>({
    name: '',
    reason: '',
    startDate: '', 
    endDate: '',
    bloodTypes: [], 
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const toggleBloodType = (type: string) => {
    setFormData(prev => {
      const currentTypes = prev.bloodTypes || [];
      if (currentTypes.includes(type)) {
        return { ...prev, bloodTypes: currentTypes.filter(t => t !== type) }; // Remove
      } else {
        return { ...prev, bloodTypes: [...currentTypes, type] }; // Adiciona
      }
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name || !formData.startDate || !formData.endDate) {
      alert('Por favor, preencha os campos obrigatórios.');
      return;
    }

    setIsSubmitting(true);
    try {
      const campaignDataToSave = {
        ...formData,
        institution: adminProfile.institutionName,
        location: adminProfile.location,
      };
      await addDoc(collection(db, 'campaigns'), campaignDataToSave);
      alert('Campanha criada com sucesso!');
      setFormData({ name: '', reason: '', startDate: '', endDate: '', bloodTypes: [] }); 
      onClose(); 
    } catch (error) {
      console.error("Erro ao criar campanha: ", error);
      alert('Não foi possível criar a campanha.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null; 

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4">
      <div className="relative w-full max-w-lg rounded-lg bg-white shadow-xl max-h-[90vh] flex flex-col">
        <div className="flex items-center justify-between p-4 border-b border-gray-200">
          <h2 className="text-2xl font-bold text-gray-800">Criar Nova Campanha</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600"><FiX size={24} /></button>
        </div>
        <form id="campaignForm" onSubmit={handleSubmit} className="space-y-4 p-4 overflow-y-auto">
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700">Nome da Campanha</label>
            <input type="text" name="name" id="name" value={formData.name} onChange={handleChange} className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-red-500 focus:outline-none focus:ring-red-500" required />
          </div>
          <div>
            <label htmlFor="reason" className="block text-sm font-medium text-gray-700">Motivo</label>
            <input type="text" name="reason" id="reason" value={formData.reason} onChange={handleChange} className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-red-500 focus:outline-none focus:ring-red-500" />
          </div>
          
          {/* SELEÇÃO DE TIPOS SANGUÍNEOS */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Tipos Sanguíneos Solicitados</label>
            <div className="flex flex-wrap gap-2">
              {AVAILABLE_BLOOD_TYPES.map(type => (
                <button
                  type="button"
                  key={type}
                  onClick={() => toggleBloodType(type)}
                  className={`
                    px-3 py-1 rounded-full text-sm font-semibold border transition-colors
                    ${formData.bloodTypes.includes(type) 
                      ? 'bg-red-600 text-white border-red-600' 
                      : 'bg-white text-gray-600 border-gray-300 hover:border-red-400'}
                  `}
                >
                  {type}
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <label htmlFor="startDate" className="block text-sm font-medium text-gray-700">Início</label>
              <input type="date" name="startDate" id="startDate" value={formData.startDate} onChange={handleChange} className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-red-500 focus:outline-none focus:ring-red-500" required />
            </div>
            <div>
              <label htmlFor="endDate" className="block text-sm font-medium text-gray-700">Fim</label>
              <input type="date" name="endDate" id="endDate" value={formData.endDate} onChange={handleChange} className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-red-500 focus:outline-none focus:ring-red-500" required />
            </div>
          </div>
        </form>
        <div className="flex justify-end gap-3 p-4 border-t border-gray-200">
          <button type="button" onClick={onClose} className="rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-semibold text-gray-700 shadow-sm transition hover:bg-gray-50">Cancelar</button>
          <button type="submit" form="campaignForm" disabled={isSubmitting} className="flex items-center justify-center rounded-lg bg-red-600 px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-red-700 disabled:opacity-50">{isSubmitting ? 'Salvando...' : 'Salvar Campanha'}</button>
        </div>
      </div>
    </div>
  );
};

interface EditCampaignModalProps {
  isOpen: boolean;
  onClose: () => void;
  campaign: Campaign | null; 
}

const EditCampaignModal: React.FC<EditCampaignModalProps> = ({ isOpen, onClose, campaign }) => {
  const [formData, setFormData] = useState<CampaignFormData>({
    name: '',
    reason: '',
    startDate: '', 
    endDate: '',
    bloodTypes: [],   
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (campaign) {
      setFormData({
        name: campaign.name,
        reason: campaign.reason,
        startDate: campaign.startDate,
        endDate: campaign.endDate,
        bloodTypes: campaign.bloodTypes || [], 
      });
    }
  }, [campaign, isOpen]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const toggleBloodType = (type: string) => {
    setFormData(prev => {
      const currentTypes = prev.bloodTypes || [];
      if (currentTypes.includes(type)) {
        return { ...prev, bloodTypes: currentTypes.filter(t => t !== type) };
      } else {
        return { ...prev, bloodTypes: [...currentTypes, type] };
      }
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!campaign) return;

    if (!formData.name || !formData.startDate || !formData.endDate) {
      alert('Por favor, preencha os campos obrigatórios.');
      return;
    }

    setIsSubmitting(true);
    try {
      const campaignRef = doc(db, 'campaigns', campaign.id);
      await updateDoc(campaignRef, { ...formData });
      alert('Campanha atualizada com sucesso!');
      onClose();
    } catch (error) {
      console.error("Erro ao atualizar campanha: ", error);
      alert('Não foi possível atualizar a campanha.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen || !campaign) return null; 

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4">
      <div className="relative w-full max-w-lg rounded-lg bg-white shadow-xl max-h-[90vh] flex flex-col">
        <div className="flex items-center justify-between p-4 border-b border-gray-200">
          <h2 className="text-2xl font-bold text-gray-800">Editar Campanha</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600"><FiX size={24} /></button>
        </div>
        <form id="editCampaignForm" onSubmit={handleSubmit} className="space-y-4 p-4 overflow-y-auto">
          <div>
            <label htmlFor="edit-name" className="block text-sm font-medium text-gray-700">Nome da Campanha</label>
            <input type="text" name="name" id="edit-name" value={formData.name} onChange={handleChange} className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-red-500 focus:outline-none focus:ring-red-500" required />
          </div>
          <div>
            <label htmlFor="edit-reason" className="block text-sm font-medium text-gray-700">Motivo</label>
            <input type="text" name="reason" id="edit-reason" value={formData.reason} onChange={handleChange} className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-red-500 focus:outline-none focus:ring-red-500" />
          </div>

          {/* SELEÇÃO DE TIPOS SANGUÍNEOS (EDIÇÃO) */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Tipos Sanguíneos Solicitados</label>
            <div className="flex flex-wrap gap-2">
              {AVAILABLE_BLOOD_TYPES.map(type => (
                <button
                  type="button"
                  key={type}
                  onClick={() => toggleBloodType(type)}
                  className={`
                    px-3 py-1 rounded-full text-sm font-semibold border transition-colors
                    ${formData.bloodTypes.includes(type) 
                      ? 'bg-red-600 text-white border-red-600' 
                      : 'bg-white text-gray-600 border-gray-300 hover:border-red-400'}
                  `}
                >
                  {type}
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <label htmlFor="edit-startDate" className="block text-sm font-medium text-gray-700">Início</label>
              <input type="date" name="startDate" id="edit-startDate" value={formData.startDate} onChange={handleChange} className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-red-500 focus:outline-none focus:ring-red-500" required />
            </div>
            <div>
              <label htmlFor="edit-endDate" className="block text-sm font-medium text-gray-700">Fim</label>
              <input type="date" name="endDate" id="edit-endDate" value={formData.endDate} onChange={handleChange} className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-red-500 focus:outline-none focus:ring-red-500" required />
            </div>
          </div>
        </form>
        <div className="flex justify-end gap-3 p-4 border-t border-gray-200">
          <button type="button" onClick={onClose} className="rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-semibold text-gray-700 shadow-sm transition hover:bg-gray-50">Cancelar</button>
          <button type="submit" form="editCampaignForm" disabled={isSubmitting} className="flex items-center justify-center rounded-lg bg-red-600 px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-red-700 disabled:opacity-50">{isSubmitting ? 'Atualizando...' : 'Atualizar Campanha'}</button>
        </div>
      </div>
    </div>
  );
};


export default function CampaignsPage() {
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [campaignToEdit, setCampaignToEdit] = useState<Campaign | null>(null);

  useEffect(() => {
    setIsLoading(true);
    const unsub = onSnapshot(collection(db, 'campaigns'), (snapshot) => {
      const campaignsData = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
      })) as Campaign[];
      setCampaigns(campaignsData);
      setIsLoading(false);
    });
    return () => unsub();
  }, []);

  const handleEdit = (id: string) => {
    const foundCampaign = campaigns.find(c => c.id === id);
    if (foundCampaign) {
      setCampaignToEdit(foundCampaign);
      setIsEditModalOpen(true);
    }
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('Tem certeza que deseja excluir esta campanha?')) {
      try {
        await deleteDoc(doc(db, 'campaigns', id));
      } catch (error) {
        console.error("Erro ao excluir campanha: ", error);
      }
    }
  };

  return (
    <>
      <div className="space-y-6">
        <div className="flex flex-col items-start justify-between gap-2 sm:flex-row sm:items-center">
          <h1 className="text-3xl font-bold text-gray-800">Campanhas</h1>
          <div className="text-right">
            <p className="text-sm text-gray-600">Campanhas ativas: <span className="font-bold text-gray-800"> {campaigns.length}</span></p>
          </div>
        </div>

        <div className="flex flex-col justify-between gap-3 md:flex-row">
          <div className="flex gap-2">
            <button onClick={() => setIsCreateModalOpen(true)} className="flex items-center gap-2 rounded-lg bg-red-600 px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2">
              <FiPlus size={16} /> Criar Campanha
            </button>
          </div>
          <button className="flex items-center gap-2 rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-semibold text-gray-700 shadow-sm transition hover:bg-gray-50">
            <FiFilter size={16} /> Filtrar
          </button>
        </div>

        <div className="overflow-x-auto rounded-lg border border-gray-200 bg-white shadow-md">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">Nome da Campanha</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">Motivo</th>
                {/* NOVA COLUNA */}
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">Tipos Sanguíneos</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">Início</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">Fim</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">Operações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {isLoading ? (
                <tr><td colSpan={6} className="px-6 py-12 text-center text-gray-500">Carregando campanhas...</td></tr>
              ) : campaigns.length === 0 ? (
                <tr><td colSpan={6} className="px-6 py-12 text-center text-gray-500">Nenhuma campanha encontrada.</td></tr>
              ) : (
                campaigns.map((campaign) => (
                  <tr key={campaign.id} className="transition hover:bg-gray-50">
                    <td className="whitespace-nowrap px-6 py-4"><div className="text-sm font-medium text-gray-900">{campaign.name}</div></td>
                    <td className="whitespace-nowrap px-6 py-4"><div className="text-sm text-gray-600">{campaign.reason}</div></td>
                    
                    <td className="whitespace-nowrap px-6 py-4">
                      <div className="flex gap-1 flex-wrap max-w-[200px]">
                        {(campaign.bloodTypes || []).map(type => (
                          <span key={type} className="inline-flex items-center rounded-full bg-red-100 px-2 py-0.5 text-xs font-medium text-red-800">
                            {type}
                          </span>
                        ))}
                        {(!campaign.bloodTypes || campaign.bloodTypes.length === 0) && <span className="text-xs text-gray-400">-</span>}
                      </div>
                    </td>

                    <td className="whitespace-nowrap px-6 py-4"><div className="text-sm text-gray-600">{campaign.startDate}</div></td>
                    <td className="whitespace-nowrap px-6 py-4"><div className="text-sm text-gray-600">{campaign.endDate}</div></td>
                    <td className="whitespace-nowrap px-6 py-4 text-sm font-medium">
                      <div className="flex items-center gap-4">
                        <button onClick={() => handleEdit(campaign.id)} className="text-gray-400 transition hover:text-red-600" title="Editar">
                          <FiEdit2 size={16} />
                        </button>
                        <button onClick={() => handleDelete(campaign.id)} className="text-gray-400 transition hover:text-red-600" title="Excluir">
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
      </div>

      <CreateCampaignModal isOpen={isCreateModalOpen} onClose={() => setIsCreateModalOpen(false)} adminProfile={adminProfile} />
      <EditCampaignModal isOpen={isEditModalOpen} onClose={() => setIsEditModalOpen(false)} campaign={campaignToEdit} />
    </>
  );
}