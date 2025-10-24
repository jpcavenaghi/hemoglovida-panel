# Painel de Controle - HemogloVida

Este é o código-fonte do painel administrativo da plataforma HemogloVida, um sistema de gerenciamento para hemonúcleos e campanhas de doação de sangue.

## ✨ Funcionalidades Principais

O painel permite que administradores gerenciem todos os aspectos da plataforma:

* **Autenticação:** Tela de login com Firebase Auth e rotas protegidas exclusivas para administradores.
* **Dashboard (Início):** Visão geral com estatísticas, atalhos e logs de atividades recentes.
* **Gerenciamento de Doadores:** Tabela para listar, adicionar, editar e filtrar doadores.
* **Gerenciamento de Campanhas:** Tabela para criar e gerenciar campanhas de doação.
* **Agendamentos:** Um calendário interativo para visualizar e gerenciar as coletas agendadas.
* **Logs de Atividades:** Uma tela central com abas (Doadores, Campanhas, Agendamentos) para rastrear todas as ações importantes no sistema.
* **Perfil da Instituição:** Formulário para visualizar e editar as informações do hemocentro (Endereço, Contato, etc.).

## 🚀 Tecnologias Utilizadas

Este projeto foi construído utilizando as seguintes tecnologias:

* **React** (v18+)
* **TypeScript**
* **TailwindCSS** - Para estilização rápida e responsiva
* **React Router DOM** (v6) - Para roteamento de páginas
* **Firebase** (v9+) - Para autenticação (Auth) e (futuramente) banco de dados (Firestore)
* **React Icons** - Para iconografia

## 📦 Como Executar o Projeto

Siga os passos abaixo para rodar o projeto em sua máquina local.

1.  **Clone o repositório:**
    ```bash
    git clone [URL-DO-SEU-REPOSITORIO]
    cd [NOME-DO-PROJETO]
    ```

2.  **Instale as dependências:**
    ```bash
    npm install
    # ou
    yarn install
    ```

3.  **Configure as variáveis de ambiente:**
    * Crie um arquivo chamado `.env` na raiz do projeto.
    * Adicione as credenciais do seu projeto Firebase (que você encontra no console do Firebase):

    ```.env
    VITE_API_KEY=SUA_API_KEY
    VITE_AUTH_DOMAIN=SEU_AUTH_DOMAIN
    VITE_PROJECT_ID=SEU_PROJECT_ID
    VITE_STORAGE_BUCKET=SEU_STORAGE_BUCKET
    VITE_MESSAGING_SENDER_ID=SEU_SENDER_ID
    VITE_APP_ID=SEU_APP_ID
    ```
    *(**Nota:** O prefixo `VITE_` é necessário se você estiver usando Vite)*

4.  **Rode o servidor de desenvolvimento:**
    ```bash
    npm run dev
    # ou
    yarn dev
    ```

5.  Abra [http://localhost:5173](http://localhost:5173) (ou a porta que seu terminal indicar) no seu navegador.

## 📁 Estrutura de Pastas

A estrutura de pastas do projeto está organizada da seguinte forma:

* **src/**
    * **components/**: Componentes reutilizáveis (Sidebar, Header, FormField, etc.)
        * `dashboard/`
    * **context/**: Contexto de Autenticação (AuthContext)
    * **screens/**: Páginas principais da aplicação
        * `Activities/`: Tela de Logs de Atividade
        * `Appointments/`: Tela de Agendamentos (Calendário)
        * `Campaigns/`: Tela de Campanhas
        * `Dashboard/`: Componente de Layout (DashboardLayout)
        * `Donors/`: Tela de Doadores
        * `Home/`: Tela Inicial (Dashboard Home)
        * `Login/`: Tela de Login
        * `Profile/`: Tela de Perfil do Hemocentro
    * **services/**: Configuração de serviços
        * `firebase/`: Configuração do Firebase (config.ts)
    * `App.tsx`: Roteador principal da aplicação (React Router)
    * `main.tsx`: Ponto de entrada do React
* **public/**: Arquivos estáticos (favicon, index.html)
* `.env`: Arquivo de variáveis de ambiente (local)
* `package.json`: Lista de dependências e scripts do projeto
* `README.md`: Este arquivo

## 📄 Licença

Este projeto é privado e de propriedade da HemogloVida.
