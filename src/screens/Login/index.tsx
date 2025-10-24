import { useState } from 'react';
import { signInWithEmailAndPassword, getIdTokenResult, signOut } from 'firebase/auth'; 
import { auth } from '../../services/firebase/config'; 
import logo from "../../assets/images/icon2.png"
import { useNavigate } from 'react-router-dom';

export default function LoginScreen() {
const navigate = useNavigate();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async () => {
    setError(null);
    setIsLoading(true);

    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      const idTokenResult = await getIdTokenResult(user, true); 

      if (idTokenResult.claims.admin === true) {
        setIsLoading(false);
        navigate('/');
        alert('Login bem-sucedido!');
      } else {
        setError('Acesso negado. Você não tem permissão de administrador.');
        setIsLoading(false);
        await signOut(auth); 
      }

    } catch (err: any) {
      console.error("Login falhou:", err);
      if (err.code === 'auth/invalid-credential' || err.code === 'auth/user-not-found' || err.code === 'auth/wrong-password') {
          setError('E-mail ou senha inválidos.');
      } else {
          setError('Ocorreu um erro ao tentar fazer login.');
      }
      setIsLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gray-100 p-4">
       <div className="mb-8 flex flex-row items-center justify-center gap-4">
        <img
          src={logo} 
          alt="Logo HemogloVida"
          className="h-16 w-auto"
        />
        <div>
          <h1 className="text-3xl font-extrabold text-red-600">
            HemogloVida
          </h1>
          <p className="text-lg text-gray-500">Painel de Controle</p>
        </div>
      </div>

      <div className="w-full max-w-md rounded-lg bg-white p-8 shadow-md">
         <div className="mb-5">
          <label className="mb-2 block text-base font-semibold text-gray-700">Email</label>
          <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="seu@email.com" className="w-full rounded-md border border-gray-300 bg-gray-50 p-3 text-base focus:border-red-500 focus:ring-red-500"/>
        </div>
        <div className="mb-8">
          <label className="mb-2 block text-base font-semibold text-gray-700">Senha</label>
          <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Sua senha" className="w-full rounded-md border border-gray-300 bg-gray-50 p-3 text-base focus:border-red-500 focus:ring-red-500"/>
        </div>

        {error && (
          <p className="mb-4 text-center text-sm text-red-600">{error}</p>
        )}

        {/* Botão Entrar */}
        <button
          onClick={handleLogin}
          disabled={isLoading}
          className={`w-full rounded-full py-3 text-lg font-bold text-white transition ${
            isLoading ? 'bg-gray-400 cursor-not-allowed' : 'bg-red-600 hover:bg-red-700'
          }`}
        >
          {isLoading ? 'Entrando...' : 'Entrar'}
        </button>

      </div>
    </div>
  );
}