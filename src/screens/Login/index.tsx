import { useState } from 'react';

// No futuro, adicionaremos a lógica de login com Firebase aqui.
const handleLogin = () => {
  alert('Lógica de login a ser implementada!');
};

export default function LoginScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gray-100 p-4">
      
      <div className="mb-8 flex flex-row items-center justify-center gap-4">

        <img 
          src="/logo.png"
          alt="HemogloVida Logo" 
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
          <label className="mb-2 block text-base font-semibold text-gray-700">
            Email
          </label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="seu@email.com"
            className="w-full rounded-md border border-gray-300 bg-gray-50 p-3 text-base focus:border-red-500 focus:ring-red-500"
          />
        </div>

        <div className="mb-8">
          <label className="mb-2 block text-base font-semibold text-gray-700">
            Senha
          </label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Sua senha"
            className="w-full rounded-md border border-gray-300 bg-gray-50 p-3 text-base focus:border-red-500 focus:ring-red-500"
          />
        </div>

        <button
          onClick={handleLogin}
          className="w-full rounded-full bg-red-600 py-3 text-lg font-bold text-white transition hover:bg-red-700"
        >
          Entrar
        </button>

      </div>
    </div>
  );
}