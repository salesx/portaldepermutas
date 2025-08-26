<!DOCTYPE html>
<html lang="pt-BR">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Dashboard | Portal de Permuta de Serviço</title>
    <!-- Inclui o Tailwind CSS para estilização -->
    <script src="https://cdn.tailwindcss.com"></script>
    <!-- Inclui a biblioteca Heroicons para ícones -->
    <script src="https://unpkg.com/heroicons@2.1.1/24/outline/index.js"></script>
    <style>
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap');
        body {
            font-family: 'Inter', sans-serif;
            background-color: #f0f2f5; /* Um cinza mais suave para o fundo */
        }
        /* Esconde as setas de input de número */
        input[type=number]::-webkit-inner-spin-button,
        input[type=number]::-webkit-outer-spin-button {
            -webkit-appearance: none;
            margin: 0;
        }
        input[type=number] {
            -moz-appearance: textfield;
        }
        /* Estilos para o spinner de carregamento */
        .spinner {
            border: 4px solid rgba(255, 255, 255, 0.3);
            border-top-color: #fff;
            border-radius: 50%;
            width: 1.5rem;
            height: 1.5rem;
            animation: spin 1s linear infinite;
        }
        @keyframes spin {
            to { transform: rotate(360deg); }
        }
        /* Classes de status com cores distintas */
        .status-Pendente { background-color: #fef3c7; color: #92400e; border: 1px solid #fde68a; }
        .status-Aprovado { background-color: #d1fae5; color: #065f46; border: 1px solid #a7f3d0; }
        .status-Negado { background-color: #fee2e2; color: #991b1b; border: 1px solid #fecaca; }
        .status-Correção { background-color: #e0e7ff; color: #3730a3; border: 1px solid #c7d2fe; }

        /* Transições suaves para mostrar/esconder elementos */
        .page {
            transition: opacity 0.5s ease-in-out, transform 0.5s ease-in-out;
        }
        .page.hidden {
            opacity: 0;
            transform: scale(0.95);
            pointer-events: none;
            position: absolute;
        }
    </style>
</head>
<body class="antialiased text-gray-800">

    <!-- ===== TELA DE LOGIN ===== -->
    <div id="login-page" class="page min-h-screen flex items-center justify-center bg-gray-800 p-4">
        <div class="max-w-md w-full bg-white rounded-2xl shadow-2xl p-8">
            <div class="text-center mb-8">
                <h1 class="text-3xl font-extrabold text-gray-800">Portal de Permutas</h1>
                <p class="text-gray-500 mt-2">Acesse com seus dados</p>
            </div>
            
            <form id="solicitante-login-form" onsubmit="handleSolicitanteLogin(event)">
                <div class="space-y-4">
                    <div>
                        <label for="login-name" class="text-sm font-medium text-gray-700">Nome de Guerra</label>
                        <input type="text" id="login-name" required class="w-full mt-1 p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500" placeholder="Digite seu nome de guerra">
                    </div>
                    <div>
                        <label for="login-id" class="text-sm font-medium text-gray-700">ID de Acesso</label>
                        <input type="password" id="login-id" required class="w-full mt-1 p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500" placeholder="Digite seu ID">
                    </div>
                </div>
                <p id="login-error" class="text-sm text-red-600 mt-4 text-center hidden"></p>
                <button type="submit" class="w-full mt-6 bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-4 rounded-xl shadow-lg transition-transform transform hover:scale-105 focus:outline-none focus:ring-4 focus:ring-blue-300">
                    Entrar
                </button>
            </form>

            <div class="text-center mt-6 flex justify-between items-center">
                <button onclick="showRegistrationPage()" class="text-sm text-blue-600 hover:underline">Criar novo cadastro</button>
                <button onclick="openPinModal()" class="text-sm text-gray-500 hover:text-blue-600 hover:underline">Acesso do Comandante</button>
            </div>
        </div>
    </div>

    <!-- ===== TELA DE CADASTRO ===== -->
    <div id="registration-page" class="page hidden min-h-screen flex items-center justify-center bg-gray-800 p-4">
        <div class="max-w-md w-full bg-white rounded-2xl shadow-2xl p-8">
            <h2 class="text-2xl font-bold text-center mb-6">Novo Cadastro</h2>
            <form id="registration-form" onsubmit="handleRegistration(event)" class="space-y-4">
                <div>
                    <label for="reg-graduacao" class="text-sm font-medium">Graduação</label>
                    <select id="reg-graduacao" required class="w-full mt-1 p-3 border border-gray-300 rounded-md">
                        <option value="SD PM">SD PM</option>
                        <option value="CB PM">CB PM</option>
                        <option value="SGT PM">SGT PM</option>
                        <option value="ST PM">ST PM</option>
                    </select>
                </div>
                <div>
                    <label for="reg-numero-barra" class="text-sm font-medium">Número/Barra</label>
                    <input type="text" id="reg-numero-barra" placeholder="Ex: 502/22" required class="w-full mt-1 p-3 border border-gray-300 rounded-md">
                </div>
                <div>
                    <label for="reg-nome-guerra" class="text-sm font-medium">Nome de Guerra</label>
                    <input type="text" id="reg-nome-guerra" placeholder="Ex: Sales" required class="w-full mt-1 p-3 border border-gray-300 rounded-md">
                </div>
                <div>
                    <label for="reg-id" class="text-sm font-medium">Insira seu ID</label>
                    <input type="password" id="reg-id" placeholder="Crie um ID numérico" required class="w-full mt-1 p-3 border border-gray-300 rounded-md">
                </div>
                <p id="reg-error" class="text-sm text-red-600 text-center hidden"></p>
                <button type="submit" class="w-full mt-4 bg-green-600 hover:bg-green-700 text-white font-bold py-3 rounded-xl">Cadastrar</button>
                <button type="button" onclick="showLoginPage()" class="w-full mt-2 text-center text-sm text-gray-600 hover:underline">Voltar para o Login</button>
            </form>
        </div>
    </div>
    
    <!-- ===== MODAL DE PIN DO COMANDANTE ===== -->
    <div id="pin-modal" class="fixed inset-0 bg-gray-900 bg-opacity-75 flex items-center justify-center p-4 z-50 hidden">
        <div class="bg-white rounded-2xl shadow-xl max-w-sm w-full p-6 text-center">
            <h3 class="text-xl font-bold mb-2">Acesso Restrito</h3>
            <p class="text-gray-600 mb-6">Digite o PIN do Comandante para continuar.</p>
            <input type="password" id="pin-input" class="w-full p-3 text-center text-2xl tracking-[.5em] border border-gray-300 rounded-md mb-4" maxlength="6">
            <p id="pin-error" class="text-sm text-red-600 mb-4 hidden">PIN incorreto. Tente novamente.</p>
            <div class="flex justify-center gap-4">
                <button onclick="closePinModal()" class="bg-gray-200 hover:bg-gray-300 text-gray-800 font-bold py-2 px-6 rounded-lg">Cancelar</button>
                <button onclick="handleComandanteLogin()" class="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-6 rounded-lg">Entrar</button>
            </div>
        </div>
    </div>


    <!-- ===== DASHBOARD (Container principal) ===== -->
    <div id="dashboard-container" class="page hidden min-h-screen">
        <!-- Cabeçalho do Dashboard -->
        <header class="bg-white shadow-md sticky top-0 z-10">
            <div class="container mx-auto px-4 sm:px-6 lg:px-8">
                <div class="flex items-center justify-between h-16">
                    <div class="flex items-center">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-8 h-8 text-blue-600"><path stroke-linecap="round" stroke-linejoin="round" d="M9 12.75 11.25 15 15 9.75m-3-7.036A11.959 11.959 0 0 1 3.598 6 11.99 11.99 0 0 0 3 9.749c0 5.592 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.286Z" /></svg>
                        <span class="ml-3 text-xl font-bold">Portal de Permutas</span>
                    </div>
                    <div class="flex items-center gap-4">
                        <span class="text-sm font-medium">Bem-vindo, <span id="user-role-display"></span>!</span>
                        <button onclick="logout()" class="text-gray-500 hover:text-red-600 transition-colors" title="Sair">
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6"><path stroke-linecap="round" stroke-linejoin="round" d="M15.75 9V5.25A2.25 2.25 0 0 0 13.5 3h-6a2.25 2.25 0 0 0-2.25 2.25v13.5A2.25 2.25 0 0 0 7.5 21h6a2.25 2.25 0 0 0 2.25-2.25V15m3 0 3-3m0 0-3-3m3 3H9" /></svg>
                        </button>
                    </div>
                </div>
            </div>
        </header>

        <!-- Conteúdo Principal -->
        <main class="container mx-auto p-4 sm:p-6 lg:p-8">
            <!-- Navegação de Abas -->
            <div id="dashboard-nav" class="mb-6">
                <div class="border-b border-gray-200">
                    <!-- Abas do Solicitante -->
                    <nav id="solicitante-nav" class="-mb-px flex space-x-8" aria-label="Tabs">
                        <button onclick="showTab('nova-solicitacao')" id="tab-nova-solicitacao" class="whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm">Nova Solicitação</button>
                        <button onclick="showTab('minhas-solicitacoes')" id="tab-minhas-solicitacoes" class="whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm">Minhas Solicitações</button>
                        <button onclick="showTab('meu-perfil')" id="tab-meu-perfil" class="whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm">Meu Perfil</button>
                    </nav>
                    <!-- Abas do Comandante -->
                    <nav id="comandante-nav" class="-mb-px flex space-x-8" aria-label="Tabs">
                        <button onclick="showTab('comandante-dashboard')" id="tab-comandante-dashboard" class="whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm">Solicitações</button>
                        <button onclick="showTab('comandante-user-management')" id="tab-comandante-user-management" class="whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm">Gerenciar Usuários</button>
                    </nav>
                </div>
            </div>

            <!-- Conteúdo das Abas e Páginas -->
            <div id="tab-content">
                <!-- ===== PÁGINA/ABA: NOVA SOLICITAÇÃO (Solicitante) ===== -->
                <div id="nova-solicitacao-content" class="tab-pane">
                    <div class="bg-white rounded-2xl shadow-lg p-6 md:p-10 max-w-4xl mx-auto">
                        <div class="flex flex-col items-center justify-center text-center p-4 bg-gray-800 text-white rounded-t-xl mb-8">
                            <h1 class="text-xl font-bold tracking-wide">POLÍCIA MILITAR DO MARANHÃO</h1>
                            <p class="text-sm font-light">COMANDO DE POLICIAMENTO DE ÁREA DO INTERIOR-5</p>
                        </div>
                        <h2 class="text-2xl font-extrabold text-center text-gray-800 my-8">FORMULÁRIO DE PERMUTA DE SERVIÇO</h2>
                        
                        <!-- Campos do Formulário -->
                        <div class="space-y-8">
                            <!-- Localização -->
                            <div>
                                <h5 class="text-base font-bold text-gray-800 mb-4 uppercase tracking-wider">Localização</h5>
                                <div class="flex flex-wrap gap-6">
                                    <label class="flex items-center text-base text-gray-700 cursor-pointer"><input type="radio" name="localizacao" value="SEDE" class="form-radio h-5 w-5 text-blue-600"><span class="ml-2 font-medium">SEDE</span></label>
                                    <label class="flex items-center text-base text-gray-700 cursor-pointer"><input type="radio" name="localizacao" value="DPM TURILÂNDIA" class="form-radio h-5 w-5 text-blue-600"><span class="ml-2 font-medium">DPM TURILÂNDIA</span></label>
                                    <label class="flex items-center text-base text-gray-700 cursor-pointer"><input type="radio" name="localizacao" value="DPM TURIAÇU" class="form-radio h-5 w-5 text-blue-600"><span class="ml-2 font-medium">DPM TURIAÇU</span></label>
                                </div>
                                <p id="localizacaoWarning" class="text-sm text-red-600 mt-2 hidden font-semibold">Selecione uma localização.</p>
                            </div>

                            <!-- PMs -->
                            <div class="grid grid-cols-1 md:grid-cols-2 gap-8 border-t-2 pt-6">
                                <div>
                                    <h5 class="text-base font-bold text-gray-800 mb-4 uppercase tracking-wider">PM SUBSTITUÍDO</h5>
                                    <div class="space-y-4">
                                        <div>
                                            <label for="pmSubstituidoNome" class="text-sm font-medium text-gray-600 block">Nome:</label>
                                            <input type="text" id="pmSubstituidoNome" placeholder="Selecione ou digite o nome" class="w-full mt-1 p-3 border border-gray-300 bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200 rounded-md" list="pmList">
                                        </div>
                                        <div>
                                            <label for="pmSubstituidoIdentificacao" class="text-sm font-medium text-gray-600 block">ID:</label>
                                            <input type="number" id="pmSubstituidoIdentificacao" placeholder="ID preenchido automaticamente" class="w-full mt-1 p-3 border border-gray-300 bg-gray-200 cursor-not-allowed rounded-md" readonly>
                                        </div>
                                    </div>
                                </div>
                                <div>
                                    <h5 class="text-base font-bold text-gray-800 mb-4 uppercase tracking-wider">PM SUBSTITUTO</h5>
                                    <div class="space-y-4">
                                        <div>
                                            <label for="pmSubstitutoNome" class="text-sm font-medium text-gray-600 block">Nome:</label>
                                            <input type="text" id="pmSubstitutoNome" placeholder="Selecione ou digite o nome" class="w-full mt-1 p-3 border border-gray-300 bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200 rounded-md" list="pmList">
                                        </div>
                                        <div>
                                            <label for="pmSubstitutoIdentificacao" class="text-sm font-medium text-gray-600 block">ID:</label>
                                            <input type="number" id="pmSubstitutoIdentificacao" placeholder="ID preenchido automaticamente" class="w-full mt-1 p-3 border border-gray-300 bg-gray-200 cursor-not-allowed rounded-md" readonly>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <datalist id="pmList"></datalist>

                            <!-- Datas -->
                            <div class="border-t-2 pt-6 space-y-4">
                                <div>
                                    <label class="text-sm font-bold text-gray-800 uppercase tracking-wide">DATA(S) DO SERVIÇO PERMUTADO</label>
                                    <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mt-2">
                                        <input type="date" id="dataServicoPermutadoInicio" class="w-full p-3 border border-gray-300 bg-gray-50 rounded-md">
                                        <input type="date" id="dataServicoPermutadoFim" class="w-full p-3 border border-gray-300 bg-gray-50 rounded-md">
                                    </div>
                                </div>
                                <div>
                                    <label class="text-sm font-bold text-gray-800 uppercase tracking-wide">DATA(S) DO PAGAMENTO DO SERVIÇO</label>
                                    <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mt-2">
                                        <input type="date" id="dataPagamentoServicoInicio" class="w-full p-3 border border-gray-300 bg-gray-50 rounded-md">
                                        <input type="date" id="dataPagamentoServicoFim" class="w-full p-3 border border-gray-300 bg-gray-50 rounded-md">
                                    </div>
                                </div>
                            </div>
                        </div>
                        <!-- Botão de Envio -->
                        <div class="mt-10 text-center">
                            <button onclick="sendToCommander()" id="send-btn" class="bg-green-600 hover:bg-green-700 text-white font-bold py-3 px-8 rounded-xl shadow-lg transition-transform transform hover:scale-105 focus:outline-none focus:ring-4 focus:ring-green-300 flex items-center justify-center gap-2 mx-auto">
                                <span id="send-btn-text">Enviar para Comandante</span>
                                <div id="send-btn-spinner" class="spinner hidden"></div>
                            </button>
                        </div>
                    </div>
                </div>

                <!-- ===== PÁGINA/ABA: MINHAS SOLICITAÇÕES (Solicitante) ===== -->
                <div id="minhas-solicitacoes-content" class="tab-pane hidden">
                    <h2 class="text-3xl font-bold mb-6">Minhas Solicitações</h2>
                    <div id="my-requests-list" class="space-y-4">
                        <!-- Conteúdo dinâmico -->
                    </div>
                    <div id="my-requests-loading" class="text-center py-10 hidden">
                        <div class="spinner border-blue-500 border-t-transparent mx-auto"></div>
                        <p class="mt-4 text-gray-600">Carregando suas solicitações...</p>
                    </div>
                    <div id="my-requests-empty" class="text-center py-16 bg-white rounded-2xl shadow hidden">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-16 h-16 mx-auto text-gray-400"><path stroke-linecap="round" stroke-linejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 0 0-3.375-3.375h-1.5A1.125 1.125 0 0 1 13.5 7.125v-1.5a3.375 3.375 0 0 0-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 0 0-9-9Z" /></svg>
                        <h3 class="mt-4 text-xl font-semibold">Nenhuma solicitação encontrada</h3>
                        <p class="mt-1 text-gray-500">Faça sua primeira solicitação na aba "Nova Solicitação".</p>
                    </div>
                </div>

                <!-- ===== PÁGINA/ABA: MEU PERFIL (Solicitante) ===== -->
                <div id="meu-perfil-content" class="tab-pane hidden">
                     <h2 class="text-3xl font-bold mb-6">Meu Perfil</h2>
                     <div class="max-w-2xl mx-auto bg-white p-8 rounded-2xl shadow-lg">
                        <div class="space-y-6">
                            <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
                                <div>
                                    <label for="profile-graduacao" class="text-sm font-medium">Graduação</label>
                                    <select id="profile-graduacao" class="w-full mt-1 p-3 border border-gray-300 rounded-md">
                                        <option value="SD PM">SD PM</option>
                                        <option value="CB PM">CB PM</option>
                                        <option value="SGT PM">SGT PM</option>
                                        <option value="ST PM">ST PM</option>
                                    </select>
                                </div>
                                <div>
                                    <label for="profile-numero-barra" class="text-sm font-medium">Número/Barra</label>
                                    <input type="text" id="profile-numero-barra" placeholder="Ex: 502/22" class="w-full mt-1 p-3 border border-gray-300 rounded-md">
                                </div>
                                <div>
                                    <label for="profile-nome-guerra" class="text-sm font-medium">Nome de Guerra</label>
                                    <input type="text" id="profile-nome-guerra" placeholder="Ex: Sales" class="w-full mt-1 p-3 border border-gray-300 rounded-md">
                                </div>
                            </div>
                            <div>
                                <label for="profile-id" class="text-sm font-medium text-gray-600">ID de Acesso</label>
                                <input type="number" id="profile-id" class="w-full mt-1 p-3 border border-gray-300 rounded-md" placeholder="Cadastre seu novo ID">
                            </div>
                            <div class="text-right">
                                <button onclick="saveProfile()" class="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-6 rounded-lg shadow-md transition-transform transform hover:scale-105">Salvar Alterações</button>
                            </div>
                        </div>
                     </div>
                </div>

                <!-- ===== PÁGINA: DASHBOARD DO COMANDANTE ===== -->
                <div id="comandante-dashboard-content" class="tab-pane hidden">
                    <h2 class="text-3xl font-bold mb-6">Solicitações Pendentes</h2>
                    <div class="bg-white rounded-2xl shadow-lg overflow-hidden">
                        <div class="overflow-x-auto">
                            <table class="w-full text-sm text-left text-gray-500">
                                <thead class="text-xs text-gray-700 uppercase bg-gray-100">
                                    <tr>
                                        <th scope="col" class="px-6 py-3">Data</th>
                                        <th scope="col" class="px-6 py-3">Substituído</th>
                                        <th scope="col" class="px-6 py-3">Substituto</th>
                                        <th scope="col" class="px-6 py-3">Status</th>
                                        <th scope="col" class="px-6 py-3 text-center">Ações</th>
                                    </tr>
                                </thead>
                                <tbody id="commander-requests-list">
                                    <!-- Conteúdo dinâmico -->
                                </tbody>
                            </table>
                        </div>
                         <div id="commander-requests-loading" class="text-center py-10 hidden">
                            <div class="spinner border-blue-500 border-t-transparent mx-auto"></div>
                            <p class="mt-4 text-gray-600">Carregando solicitações...</p>
                        </div>
                        <div id="commander-requests-empty" class="text-center py-16 hidden">
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-16 h-16 mx-auto text-gray-400"><path stroke-linecap="round" stroke-linejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126ZM12 15.75h.007v.008H12v-.008Z" /></svg>
                            <h3 class="mt-4 text-xl font-semibold">Nenhuma solicitação pendente</h3>
                            <p class="mt-1 text-gray-500">Aguardando novas solicitações da equipe.</p>
                        </div>
                    </div>
                </div>
                
                <!-- ===== PÁGINA: GERENCIAR USUÁRIOS (Comandante) ===== -->
                <div id="comandante-user-management-content" class="tab-pane hidden">
                    <div class="flex justify-between items-center mb-6">
                        <h2 class="text-3xl font-bold">Gerenciar Usuários</h2>
                        <button onclick="openUserEditModal()" class="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-lg flex items-center gap-2">
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" class="w-5 h-5"><path d="M10.75 4.75a.75.75 0 0 0-1.5 0v4.5h-4.5a.75.75 0 0 0 0 1.5h4.5v4.5a.75.75 0 0 0 1.5 0v-4.5h4.5a.75.75 0 0 0 0-1.5h-4.5v-4.5Z" /></svg>
                            Adicionar Usuário
                        </button>
                    </div>
                    <div class="bg-white rounded-2xl shadow-lg overflow-hidden">
                        <div class="overflow-x-auto">
                            <table class="w-full text-sm text-left text-gray-500">
                                <thead class="text-xs text-gray-700 uppercase bg-gray-100">
                                    <tr>
                                        <th scope="col" class="px-6 py-3">Nome Completo</th>
                                        <th scope="col" class="px-6 py-3">ID</th>
                                        <th scope="col" class="px-6 py-3 text-center">Ações</th>
                                    </tr>
                                </thead>
                                <tbody id="user-management-list"></tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>
        </main>
    </div>

    <!-- ===== MODAL DE EDIÇÃO/CRIAÇÃO DE USUÁRIO (Comandante) ===== -->
    <div id="user-edit-modal" class="fixed inset-0 bg-gray-900 bg-opacity-75 flex items-center justify-center p-4 z-50 hidden">
        <div class="bg-white rounded-2xl shadow-xl max-w-md w-full p-6">
            <h3 class="text-xl font-bold mb-6" id="user-modal-title">Adicionar Novo Usuário</h3>
            <form id="user-edit-form" onsubmit="saveUser(event)" class="space-y-4">
                <input type="hidden" id="user-original-fullname">
                <div>
                    <label for="user-graduacao" class="text-sm font-medium">Graduação</label>
                    <select id="user-graduacao" required class="w-full mt-1 p-3 border border-gray-300 rounded-md">
                        <option value="SD PM">SD PM</option> <option value="CB PM">CB PM</option>
                        <option value="SGT PM">SGT PM</option> <option value="ST PM">ST PM</option>
                    </select>
                </div>
                <div>
                    <label for="user-numero-barra" class="text-sm font-medium">Número/Barra</label>
                    <input type="text" id="user-numero-barra" placeholder="Ex: 502/22" required class="w-full mt-1 p-3 border border-gray-300 rounded-md">
                </div>
                <div>
                    <label for="user-nome-guerra" class="text-sm font-medium">Nome de Guerra</label>
                    <input type="text" id="user-nome-guerra" placeholder="Ex: Sales" required class="w-full mt-1 p-3 border border-gray-300 rounded-md">
                </div>
                <div>
                    <label for="user-id" class="text-sm font-medium">ID de Acesso</label>
                    <input type="number" id="user-id" placeholder="ID numérico do usuário" required class="w-full mt-1 p-3 border border-gray-300 rounded-md">
                </div>
                <div class="flex justify-end gap-4 pt-4">
                    <button type="button" onclick="closeUserEditModal()" class="bg-gray-200 hover:bg-gray-300 text-gray-800 font-bold py-2 px-4 rounded-lg">Cancelar</button>
                    <button type="submit" class="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-lg">Salvar</button>
                </div>
            </form>
        </div>
    </div>


    <!-- ===== MODAL DE DETALHES (Comandante) ===== -->
    <div id="details-modal" class="fixed inset-0 bg-gray-900 bg-opacity-75 flex items-center justify-center p-4 z-50 hidden">
        <div class="bg-white rounded-2xl shadow-xl max-w-2xl w-full p-6 relative">
            <button onclick="closeDetailsModal()" class="absolute top-4 right-4 text-gray-400 hover:text-gray-600">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6"><path stroke-linecap="round" stroke-linejoin="round" d="M6 18 18 6M6 6l12 12" /></svg>
            </button>
            <h3 class="text-2xl font-bold mb-6 text-gray-800">Detalhes da Solicitação</h3>
            <div id="details-modal-content" class="space-y-4 text-gray-600">
                <!-- Conteúdo dinâmico -->
            </div>
            <div id="details-modal-print-button" class="mt-6 text-right">
                <!-- Botão de impressão será inserido aqui -->
            </div>
        </div>
    </div>

    <!-- ===== MODAL DE AÇÕES DO COMANDANTE ===== -->
    <div id="action-modal" class="fixed inset-0 bg-gray-900 bg-opacity-75 flex items-center justify-center p-4 z-50 hidden">
        <div class="bg-white rounded-2xl shadow-xl max-w-md w-full p-6">
            <h3 class="text-xl font-bold mb-4" id="modal-title">Confirmar Ação</h3>
            <p class="text-gray-600 mb-6" id="modal-message">Você tem certeza que deseja realizar esta ação?</p>
            <div id="modal-correction-reason" class="hidden mb-4">
                <label for="correction-reason" class="text-sm font-medium text-gray-700">Motivo da Correção (Obrigatório):</label>
                <textarea id="correction-reason" rows="3" class="w-full mt-1 p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"></textarea>
            </div>
            <div class="flex justify-end gap-4">
                <button onclick="closeModal()" class="bg-gray-200 hover:bg-gray-300 text-gray-800 font-bold py-2 px-4 rounded-lg">Cancelar</button>
                <button id="modal-confirm-btn" class="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-lg">Confirmar</button>
            </div>
        </div>
    </div>
    
    <!-- ===== ALERTA CUSTOMIZADO ===== -->
    <div id="custom-alert" class="fixed top-5 right-5 bg-white rounded-xl shadow-2xl p-4 flex items-start gap-4 z-[9999] transition-transform transform translate-x-[120%] duration-500">
        <div id="alert-icon"></div>
        <div>
            <h3 class="font-bold text-gray-800" id="alert-title"></h3>
            <p class="text-sm text-gray-600" id="alert-message"></p>
        </div>
        <button onclick="closeCustomAlert()" class="text-gray-400 hover:text-gray-600">&times;</button>
    </div>


    <script type="module">
        // =================================================================
        // INICIALIZAÇÃO E AUTENTICAÇÃO FIREBASE
        // =================================================================
        import { initializeApp } from "https://www.gstatic.com/firebasejs/11.6.1/firebase-app.js";
        import { getFirestore, collection, addDoc, onSnapshot, query, where, doc, updateDoc, getDoc, setDoc, getDocs, deleteDoc } from "https://www.gstatic.com/firebasejs/11.6.1/firebase-firestore.js";
        import { getAuth, signInWithCustomToken, signInAnonymously, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/11.6.1/firebase-auth.js";

        // Configuração do Firebase
        const firebaseConfig = JSON.parse(typeof __firebase_config !== 'undefined' ? __firebase_config : '{"apiKey":"AIzaSyAK5pxlxoaA37EGs3TRw1Q8F-9ghFw-o9w","authDomain":"portaldepermutas.firebaseapp.com","projectId":"portaldepermutas","storageBucket":"portaldepermutas.firebasestorage.app","messagingSenderId":"496739921207","appId":"1:496739921207:web:04ceef2d6a4d8679937eb2"}');
        const appId = typeof __app_id !== 'undefined' ? __app_id : 'default-app-id';
        const initialAuthToken = typeof __initial_auth_token !== 'undefined' ? __initial_auth_token : null;

        const app = initializeApp(firebaseConfig);
        const db = getFirestore(app);
        const auth = getAuth(app);
        
        let currentUser = {
            uid: null,
            role: null, // 'solicitante' ou 'comandante'
            profile: {}
        };
        let unsubscribeListeners = [];

        // =================================================================
        // DADOS LOCAIS E CONFIGURAÇÕES
        // =================================================================
        const pmData = {}; // Base de dados local foi limpa
        const COMMANDER_PIN = "257351";
        
        async function updatePmList() {
            const pmList = document.getElementById('pmList');
            pmList.innerHTML = '';
            const addedNames = new Set();

            const q = query(collection(db, `artifacts/${appId}/public/data/profiles`));
            const querySnapshot = await getDocs(q);
            querySnapshot.forEach((doc) => {
                const profile = doc.data();
                if (!addedNames.has(profile.fullName)) {
                    const option = document.createElement('option');
                    option.value = profile.fullName;
                    pmList.appendChild(option);
                    addedNames.add(profile.fullName);
                }
            });
        }
        
        // =================================================================
        // CONTROLE DE PÁGINAS E AUTENTICAÇÃO
        // =================================================================
        
        onAuthStateChanged(auth, async (user) => {
            if (user) {
                currentUser.uid = user.uid;
                await updatePmList();
                const savedRole = localStorage.getItem('userRole');
                const savedProfile = localStorage.getItem('userProfile');
                if (savedRole && savedProfile) {
                    currentUser.role = savedRole;
                    currentUser.profile = JSON.parse(savedProfile);
                    showDashboard();
                } else {
                    showLoginPage();
                }
            } else {
                try {
                    if (initialAuthToken) { await signInWithCustomToken(auth, initialAuthToken); } 
                    else { await signInAnonymously(auth); }
                } catch (error) { console.error("Firebase Auth Error:", error); }
            }
        });

        function showPage(pageId) {
            document.querySelectorAll('.page').forEach(page => page.classList.add('hidden'));
            document.getElementById(pageId).classList.remove('hidden');
        }

        window.showLoginPage = () => showPage('login-page');
        window.showRegistrationPage = () => showPage('registration-page');

        function performLogin(role, profile = {}) {
            currentUser.role = role;
            currentUser.profile = profile;
            localStorage.setItem('userRole', role);
            localStorage.setItem('userProfile', JSON.stringify(profile));
            showDashboard();
        }

        window.logout = () => {
            localStorage.clear();
            currentUser = { uid: auth.currentUser.uid, role: null, profile: {} };
            unsubscribeListeners.forEach(unsubscribe => unsubscribe());
            unsubscribeListeners = [];
            document.getElementById('solicitante-login-form').reset();
            showLoginPage();
        };

        function showDashboard() {
            showPage('dashboard-container');
            const roleDisplay = document.getElementById('user-role-display');
            if (currentUser.role === 'solicitante') {
                roleDisplay.textContent = currentUser.profile.fullName || 'Solicitante';
                document.getElementById('solicitante-nav').style.display = 'flex';
                document.getElementById('comandante-nav').style.display = 'none';
                showTab('nova-solicitacao');
            } else {
                roleDisplay.textContent = 'Comandante';
                document.getElementById('solicitante-nav').style.display = 'none';
                document.getElementById('comandante-nav').style.display = 'flex';
                showTab('comandante-dashboard');
            }
        }
        
        // =================================================================
        // LÓGICA DE LOGIN E CADASTRO
        // =================================================================

        window.handleSolicitanteLogin = async (event) => {
            event.preventDefault();
            const nomeGuerra = document.getElementById('login-name').value.trim().toUpperCase();
            const id = document.getElementById('login-id').value;
            const errorEl = document.getElementById('login-error');
            errorEl.classList.add('hidden');

            if (!nomeGuerra) {
                errorEl.textContent = "O nome de guerra é obrigatório.";
                errorEl.classList.remove('hidden');
                return;
            }

            const profilesRef = collection(db, `artifacts/${appId}/public/data/profiles`);
            const q = query(profilesRef, where("nomeGuerra", "==", nomeGuerra));
            const querySnapshot = await getDocs(q);

            let userProfile = null;
            if (!querySnapshot.empty) {
                querySnapshot.forEach(doc => {
                    const profile = doc.data();
                    if (profile.id === id) {
                        userProfile = profile;
                    }
                });
            }

            if (userProfile) {
                performLogin('solicitante', userProfile);
            } else {
                 errorEl.textContent = "Nome de guerra ou ID incorretos.";
                 errorEl.classList.remove('hidden');
            }
        };

        window.handleRegistration = async (event) => {
            event.preventDefault();
            const grad = document.getElementById('reg-graduacao').value;
            const num = document.getElementById('reg-numero-barra').value.trim();
            const nomeGuerra = document.getElementById('reg-nome-guerra').value.trim().toUpperCase();
            const id = document.getElementById('reg-id').value;
            const errorEl = document.getElementById('reg-error');
            errorEl.classList.add('hidden');

            if (!num || !nomeGuerra) {
                errorEl.textContent = "Todos os campos são obrigatórios.";
                errorEl.classList.remove('hidden');
                return;
            }

            const fullName = `${grad} ${num} ${nomeGuerra}`;
            const safeDocId = fullName.replace(/\//g, '-');
            
            const existingUser = await getUserProfileFromFirestore(fullName);
            if (existingUser) {
                errorEl.textContent = "Este usuário já está cadastrado.";
                errorEl.classList.remove('hidden');
                return;
            }

            const profileData = { grad, numeroBarra: num, nomeGuerra, fullName, id };
            
            try {
                const docRef = doc(db, `artifacts/${appId}/public/data/profiles`, safeDocId);
                await setDoc(docRef, profileData);
                await updatePmList();
                showAlert('Sucesso!', 'Cadastro realizado. Faça o login.', 'success');
                showLoginPage();
            } catch (error) {
                console.error("Erro no cadastro:", error);
                errorEl.textContent = "Erro ao cadastrar. Tente novamente.";
                errorEl.classList.remove('hidden');
            }
        };

        window.openPinModal = () => document.getElementById('pin-modal').classList.remove('hidden');
        window.closePinModal = () => {
            document.getElementById('pin-modal').classList.add('hidden');
            document.getElementById('pin-error').classList.add('hidden');
            document.getElementById('pin-input').value = '';
        };

        window.handleComandanteLogin = () => {
            const pin = document.getElementById('pin-input').value;
            if (pin === COMMANDER_PIN) {
                closePinModal();
                performLogin('comandante');
            } else {
                document.getElementById('pin-error').classList.remove('hidden');
            }
        };
        
        // =================================================================
        // LÓGICA DO FORMULÁRIO E PERFIL
        // =================================================================
        document.getElementById('pmSubstitutoNome').addEventListener('input', async (e) => {
            const name = e.target.value.toUpperCase();
            if(!name) {
                document.getElementById('pmSubstitutoIdentificacao').value = '';
                return;
            }
            const userProfile = await getUserProfileFromFirestore(name);
            const id = userProfile ? userProfile.id : (pmData[name] || '');
            document.getElementById('pmSubstitutoIdentificacao').value = id;
        });

        document.getElementById('pmSubstituidoNome').addEventListener('input', async (e) => {
            const name = e.target.value.toUpperCase();
            if(!name) {
                document.getElementById('pmSubstituidoIdentificacao').value = '';
                return;
            }
            const userProfile = await getUserProfileFromFirestore(name);
            const id = userProfile ? userProfile.id : (pmData[name] || '');
            document.getElementById('pmSubstituidoIdentificacao').value = id;
        });

        function populateRequestFormWithUserData() {
            if (currentUser.profile.fullName) {
                document.getElementById('pmSubstituidoNome').value = currentUser.profile.fullName;
                document.getElementById('pmSubstituidoIdentificacao').value = currentUser.profile.id;
            }
        }

        function loadUserProfile() {
            const profile = currentUser.profile;
            document.getElementById('profile-graduacao').value = profile.graduacao || 'SD PM';
            document.getElementById('profile-numero-barra').value = profile.numeroBarra || '';
            document.getElementById('profile-nome-guerra').value = profile.nomeGuerra || '';
            document.getElementById('profile-id').value = profile.id || '';
        }

        window.saveProfile = async () => {
            const grad = document.getElementById('profile-graduacao').value;
            const num = document.getElementById('profile-numero-barra').value.trim();
            const nomeGuerra = document.getElementById('profile-nome-guerra').value.trim().toUpperCase();
            const id = document.getElementById('profile-id').value;

            if (!id || !grad || !num || !nomeGuerra) {
                showAlert('Atenção', 'Todos os campos do perfil são obrigatórios.', 'error');
                return;
            }

            const fullName = `${grad} ${num} ${nomeGuerra}`;
            const safeDocId = fullName.replace(/\//g, '-');
            const profileData = { grad, numeroBarra: num, nomeGuerra, fullName, id };

            try {
                // Se o nome completo mudou, precisamos remover o documento antigo
                if (currentUser.profile.fullName && currentUser.profile.fullName !== fullName) {
                    const oldSafeDocId = currentUser.profile.fullName.replace(/\//g, '-');
                    await deleteDoc(doc(db, `artifacts/${appId}/public/data/profiles`, oldSafeDocId));
                }

                const docRef = doc(db, `artifacts/${appId}/public/data/profiles`, safeDocId);
                await setDoc(docRef, profileData);
                
                performLogin('solicitante', profileData);
                showAlert('Sucesso', 'Perfil atualizado com sucesso!', 'success');
                await updatePmList();
            } catch (error) {
                console.error("Erro ao salvar perfil:", error);
                showAlert('Erro', 'Não foi possível salvar o perfil.', 'error');
            }
        };
        
        // =================================================================
        // LÓGICA DE DADOS (Firestore)
        // =================================================================
        async function getUserProfileFromFirestore(fullName) {
            if (!fullName) return null;
            const safeDocId = fullName.replace(/\//g, '-');
            const docRef = doc(db, `artifacts/${appId}/public/data/profiles`, safeDocId);
            const docSnap = await getDoc(docRef);
            return docSnap.exists() ? docSnap.data() : null;
        }

        // =================================================================
        // FUNCIONALIDADE DE IMPRESSÃO E FORMATAÇÃO
        // =================================================================
        const formatDateForDisplay = (dateStr) => {
            if (!dateStr) return 'N/A';
            const [year, month, day] = dateStr.split('-');
            return `${day}/${month}/${year}`;
        };

        function formatarDataRange(startDateStr, endDateStr) {
            if (!startDateStr) return '';
            const startDate = new Date(startDateStr + 'T00:00:00');
            const endDate = endDateStr ? new Date(endDateStr + 'T00:00:00') : startDate;
            
            const format = (date) => `${String(date.getDate()).padStart(2, '0')}/${String(date.getMonth() + 1).padStart(2, '0')}/${date.getFullYear()}`;

            if (startDate.getTime() === endDate.getTime()) {
                return format(startDate);
            }
            return `${format(startDate)} a ${format(endDate)}`;
        }

        window.printRequest = (request) => {
            const { localizacao, pmSubstituido, pmSubstituto, servicoPermutado, pagamentoServico } = request;
            
            const brasaoUrlPrint = 'https://i.ibb.co/Xr6X43nG/BRAS-O.png';
            let localizacaoSede = localizacao === 'SEDE' ? 'X' : '&nbsp;';
            let localizacaoTurilandia = localizacao === 'DPM TURILÂNDIA' ? 'X' : '&nbsp;';
            let localizacaoTuriacu = localizacao === 'DPM TURIAÇU' ? 'X' : '&nbsp;';

            const diasServico = servicoPermutado.inicio && servicoPermutado.fim ? (new Date(servicoPermutado.fim) - new Date(servicoPermutado.inicio)) / (1000 * 60 * 60 * 24) + 1 : 1;
            let tipo24Horas = diasServico === 1 ? 'X' : '&nbsp;';
            let tipo48Horas = diasServico === 2 ? 'X' : '&nbsp;';
            let tipo72Horas = diasServico >= 3 ? 'X' : '&nbsp;';

            const servicoPermutadoTexto = formatarDataRange(servicoPermutado.inicio, servicoPermutado.fim);
            let pagamentoHtml = '';
            if (pagamentoServico.inicio) {
                const pagamentoServicoTexto = formatarDataRange(pagamentoServico.inicio, pagamentoServico.fim);
                pagamentoHtml = `<p class="text-base mt-2">Data do pagamento do serviço: ${pagamentoServicoTexto}</p>`;
            }

            const printContent = `
                <!DOCTYPE html><html lang="pt-BR"><head><title>Formulário de Permuta</title><style>
                body { font-family: 'Times New Roman', Times, serif; margin: 1.5cm; line-height: 1.15; }
                .container { width: 100%; max-width: 800px; margin: 0 auto; } .text-center { text-align: center; }
                .text-sm { font-size: 0.875rem; } .text-xs { font-size: 0.75rem; } .text-base { font-size: 1rem; }
                .mt-2 { margin-top: 0.5rem; } .mt-4 { margin-top: 1rem; } .mb-2 { margin-bottom: 0.5rem; }
                .mb-4 { margin-bottom: 1rem; } .font-bold { font-weight: bold; }
                </style></head><body>
                <div class="container">
                    <div class="text-center" style="line-height: 1.15; margin: 0;">
                        <img src="${brasaoUrlPrint}" alt="Brasão" style="width: 100px; height: 120px; display: block; margin: 0 auto 5px;">
                        <p class="font-bold" style="margin: 0;">ESTADO DO MARANHÃO</p>
                        <p class="text-sm" style="margin: 0;">SECRETARIA DE SEGURANÇA DE SEGURANÇA</p>
                        <p class="text-sm" style="margin: 0;">CPA/I-5 – 10º BPM</p>
                        <p class="text-sm" style="margin: 0;">10º BATALHÃO DA POLÍCIA MILITAR DO MARANHÃO</p>
                        <p class="text-sm" style="margin: 0;">2ª COMPANHIA DO 10° BATALHÃO DE POLÍCIA MILITAR</p>
                        <p class="text-xs" style="margin: 0;">Rua Dr. Paulo Ramos, s/nº, Centro, Santa Helena - MA, Telefax: (98) 99243-6850 - Email: 2cia10bpm@gmail.com</p>
                        <p class="font-bold" style="margin-top: 2rem; margin-bottom: 0;">FORMULÁRIO DE AUTORIZAÇÃO PARA PERMUTA DE SERVIÇO</p>
                    </div>
                </div>
                <div class="mt-4 mb-4">
                    <p class="text-base">SEDE: ( ${localizacaoSede} )&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;DPM TURILÂNDIA: ( ${localizacaoTurilandia} )&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;DPM TURIAÇU: ( ${localizacaoTuriacu} )</p>
                </div>
                <div style="margin-bottom: 0.25rem;">
                    <p class="text-base">PM SUBSTITUÍDO: ${pmSubstituido.nome} - ${pmSubstituido.id || 'N/A'}</p>
                    <p style="margin-top: 4rem;">Assinatura:________________________________________</p>
                </div>
                <div style="margin-bottom: 0.25rem;">
                    <p class="text-base">PM SUBSTITUTO: ${pmSubstituto.nome} - ${pmSubstituto.id || 'N/A'}</p>
                    <p style="margin-top: 4rem;">Assinatura:________________________________________</p>
                </div>
                <div class="mb-2">
                    <p class="text-base">Data do serviço permutado: ${servicoPermutadoTexto}</p>
                    ${pagamentoHtml}
                </div>
                <div class="mb-4" style="text-align: left; margin-left: 20px;">
                    <p class="text-base">( ${tipo24Horas} ) 24 Horas - ( ${tipo48Horas} ) 48 Horas - ( ${tipo72Horas} ) 72 Horas</p>
                </div>
                <div class="text-center" style="margin-top: 2rem;">
                    <p class="text-base" style="margin: 0;">AUTORIZO A PERMUTA ENTRE OS POLICIAIS MILITARES ACIMA RELACIONADOS: ( &nbsp; ) Sim ( &nbsp; ) Não</p>
                    <p class="text-base" style="margin-top: 3rem; margin-bottom: 0;">_____________________________________________________</p>
                    <p class="text-base" style="margin-top: 0.2rem; margin-bottom: 0;">JOSE RIBAMAR BRAGA JUNIOR - 1º TEN QOPM</p>
                    <p class="text-sm" style="margin-top: 0;">COMANDANTE DA 2°CP/10°BPM</p>
                </div>
                </body></html>`;

            const printWindow = window.open('', '_blank');
            printWindow.document.open();
            printWindow.document.write(printContent);
            printWindow.document.close();
            printWindow.focus();
            printWindow.print();
        };

        // =================================================================
        // FUNÇÕES RESTANTES (sem alterações significativas)
        // =================================================================
        window.showTab = (tabId) => {
            document.querySelectorAll('.tab-pane').forEach(pane => pane.classList.add('hidden'));
            document.getElementById(`${tabId}-content`).classList.remove('hidden');

            const navId = currentUser.role === 'solicitante' ? '#solicitante-nav' : '#comandante-nav';
            document.querySelectorAll(`${navId} button`).forEach(button => {
                button.classList.remove('border-blue-500', 'text-blue-600');
                button.classList.add('border-transparent', 'text-gray-500');
            });
            document.getElementById(`tab-${tabId}`).classList.add('border-blue-500', 'text-blue-600');

            if(tabId === 'comandante-user-management') {
                fetchAllUsers();
            } else if (tabId === 'nova-solicitacao') {
                populateRequestFormWithUserData();
            } else if (tabId === 'minhas-solicitacoes') {
                fetchMyRequests();
            } else if (tabId === 'meu-perfil') {
                loadUserProfile();
            } else if (tabId === 'comandante-dashboard') {
                fetchAllRequests();
            }
        };

        window.sendToCommander = async () => {
            if (!document.querySelector('input[name="localizacao"]:checked') || !document.getElementById('pmSubstituidoNome').value || !document.getElementById('pmSubstitutoNome').value || !document.getElementById('dataServicoPermutadoInicio').value) {
                showAlert('Erro', 'Preencha todos os campos obrigatórios.', 'error');
                return;
            }

            const btn = document.getElementById('send-btn');
            btn.disabled = true;
            document.getElementById('send-btn-text').classList.add('hidden');
            document.getElementById('send-btn-spinner').classList.remove('hidden');

            const requestData = {
                localizacao: document.querySelector('input[name="localizacao"]:checked').value,
                pmSubstituido: { nome: document.getElementById('pmSubstituidoNome').value.toUpperCase(), id: document.getElementById('pmSubstituidoIdentificacao').value },
                pmSubstituto: { nome: document.getElementById('pmSubstitutoNome').value.toUpperCase(), id: document.getElementById('pmSubstitutoIdentificacao').value },
                servicoPermutado: { inicio: document.getElementById('dataServicoPermutadoInicio').value, fim: document.getElementById('dataServicoPermutadoFim').value },
                pagamentoServico: { inicio: document.getElementById('dataPagamentoServicoInicio').value, fim: document.getElementById('dataPagamentoServicoFim').value },
                status: 'Pendente',
                userId: currentUser.uid,
                timestamp: new Date(),
                correctionReason: ''
            };

            try {
                const collectionPath = `/artifacts/${appId}/public/data/permuta_requests`;
                await addDoc(collection(db, collectionPath), requestData);
                showAlert('Sucesso!', 'Sua solicitação foi enviada.', 'success');
                // Limpar formulário
                document.querySelector('input[name="localizacao"]:checked').checked = false;
                document.getElementById('pmSubstitutoNome').value = '';
                document.getElementById('dataServicoPermutadoInicio').value = '';
                document.getElementById('dataServicoPermutadoFim').value = '';
                document.getElementById('dataPagamentoServicoInicio').value = '';
                document.getElementById('dataPagamentoServicoFim').value = '';
            } catch (e) {
                console.error("Erro ao adicionar documento: ", e);
                showAlert("Erro", "Não foi possível enviar a solicitação. Tente novamente.", 'error');
            } finally {
                btn.disabled = false;
                document.getElementById('send-btn-text').classList.remove('hidden');
                document.getElementById('send-btn-spinner').classList.add('hidden');
            }
        };
        
        function fetchMyRequests() {
            const listEl = document.getElementById('my-requests-list');
            const loadingEl = document.getElementById('my-requests-loading');
            const emptyEl = document.getElementById('my-requests-empty');

            loadingEl.classList.remove('hidden');
            listEl.innerHTML = '';
            emptyEl.classList.add('hidden');

            const q = query(collection(db, `/artifacts/${appId}/public/data/permuta_requests`), where("userId", "==", currentUser.uid));
            
            const unsubscribe = onSnapshot(q, (snapshot) => {
                loadingEl.classList.add('hidden');
                listEl.innerHTML = '';
                if (snapshot.empty) {
                    emptyEl.classList.remove('hidden');
                } else {
                    emptyEl.classList.add('hidden');
                    let sortedDocs = snapshot.docs.sort((a, b) => b.data().timestamp.seconds - a.data().timestamp.seconds);
                    sortedDocs.forEach(doc => renderMyRequestCard(doc));
                }
            }, (error) => {
                console.error("Erro ao buscar solicitações: ", error);
                loadingEl.classList.add('hidden');
                listEl.innerHTML = `<p class="text-red-500">Erro ao carregar dados.</p>`;
            });
            unsubscribeListeners.push(unsubscribe);
        }

        function renderMyRequestCard(doc) {
            const request = doc.data();
            const card = document.createElement('div');
            card.className = `bg-white p-4 rounded-xl shadow-md`;
            const statusClass = `status-${request.status.replace(' ', '')}`;
            const pagamentoInfo = (request.pagamentoServico.inicio) ? `Pagamento: ${formatDateForDisplay(request.pagamentoServico.inicio)} a ${formatDateForDisplay(request.pagamentoServico.fim || request.pagamentoServico.inicio)}` : 'Sem pagamento';

            card.innerHTML = `
                <div class="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
                    <div>
                        <p class="text-xs text-gray-500">${new Date(request.timestamp.seconds * 1000).toLocaleString('pt-BR')}</p>
                        <p class="font-semibold mt-1">Permuta de ${request.pmSubstituido.nome} por ${request.pmSubstituto.nome}</p>
                        <p class="text-sm text-gray-600">Serviço: ${formatDateForDisplay(request.servicoPermutado.inicio)} a ${formatDateForDisplay(request.servicoPermutado.fim || request.servicoPermutado.inicio)}</p>
                        <p class="text-sm text-gray-600">${pagamentoInfo}</p>
                    </div>
                    <div class="flex flex-col items-end gap-2 mt-2 sm:mt-0">
                        <span class="px-3 py-1 rounded-full font-semibold text-xs ${statusClass}">
                            ${request.status === 'Correção' ? 'Correção Solicitada' : request.status}
                        </span>
                        <button onclick='printRequest(${JSON.stringify(request)})' class="text-sm text-blue-600 hover:underline">Imprimir</button>
                    </div>
                </div>
                ${request.status === 'Correção' && request.correctionReason ? `
                <div class="mt-3 pt-3 border-t border-gray-200">
                    <p class="text-sm font-semibold text-yellow-800">Motivo da Correção:</p>
                    <p class="text-sm text-gray-700 italic">"${request.correctionReason}"</p>
                </div>
                ` : ''}
            `;
            document.getElementById('my-requests-list').appendChild(card);
        }
        
        function fetchAllRequests() {
            const listEl = document.getElementById('commander-requests-list');
            const loadingEl = document.getElementById('commander-requests-loading');
            const emptyEl = document.getElementById('commander-requests-empty');

            loadingEl.classList.remove('hidden');
            listEl.innerHTML = '';
            emptyEl.classList.add('hidden');

            const q = query(collection(db, `/artifacts/${appId}/public/data/permuta_requests`));
            
            const unsubscribe = onSnapshot(q, (snapshot) => {
                loadingEl.classList.add('hidden');
                listEl.innerHTML = '';
                if (snapshot.empty) {
                    emptyEl.classList.remove('hidden');
                } else {
                    emptyEl.classList.add('hidden');
                    let sortedDocs = snapshot.docs.sort((a, b) => b.data().timestamp.seconds - a.data().timestamp.seconds);
                    sortedDocs.forEach(doc => renderCommanderRequestRow(doc));
                }
            }, (error) => {
                console.error("Erro ao buscar solicitações: ", error);
                loadingEl.classList.add('hidden');
                listEl.innerHTML = `<tr><td colspan="5" class="text-red-500 text-center p-4">Erro ao carregar dados.</td></tr>`;
            });
            unsubscribeListeners.push(unsubscribe);
        }

        function renderCommanderRequestRow(doc) {
            const request = doc.data();
            const row = document.createElement('tr');
            row.className = 'bg-white border-b hover:bg-gray-50';
            const statusClass = `status-${request.status.replace(' ', '')}`;

            row.innerHTML = `
                <td class="px-6 py-4">${new Date(request.timestamp.seconds * 1000).toLocaleDateString('pt-BR')}</td>
                <td class="px-6 py-4 font-medium">${request.pmSubstituido.nome}</td>
                <td class="px-6 py-4 font-medium">${request.pmSubstituto.nome}</td>
                <td class="px-6 py-4">
                    <span class="px-2 py-1 text-xs font-semibold rounded-md ${statusClass}">
                        ${request.status === 'Correção' ? 'Correção' : request.status}
                    </span>
                </td>
                <td class="px-6 py-4 text-center">
                    <div class="flex items-center justify-center gap-2">
                        <button onclick="openDetailsModal('${doc.id}')" class="text-gray-500 hover:text-gray-800" title="Ver Detalhes"><svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-5 h-5"><path stroke-linecap="round" stroke-linejoin="round" d="M2.036 12.322a1.012 1.012 0 0 1 0-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178Z" /><path stroke-linecap="round" stroke-linejoin="round" d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" /></svg></button>
                        <button onclick="openActionModal('${doc.id}', 'Aprovado')" class="text-green-600 hover:text-green-800" title="Aprovar"><svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" class="w-5 h-5"><path stroke-linecap="round" stroke-linejoin="round" d="M9 12.75 11.25 15 15 9.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" /></svg></button>
                        <button onclick="openActionModal('${doc.id}', 'Negado')" class="text-red-600 hover:text-red-800" title="Negar"><svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" class="w-5 h-5"><path stroke-linecap="round" stroke-linejoin="round" d="m9.75 9.75 4.5 4.5m0-4.5-4.5 4.5M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" /></svg></button>
                        <button onclick="openActionModal('${doc.id}', 'Correção')" class="text-blue-600 hover:text-blue-800" title="Solicitar Correção"><svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" class="w-5 h-5"><path stroke-linecap="round" stroke-linejoin="round" d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0 1 15.75 21H5.25A2.25 2.25 0 0 1 3 18.75V8.25A2.25 2.25 0 0 1 5.25 6H10" /></svg></button>
                    </div>
                </td>
            `;
            document.getElementById('commander-requests-list').appendChild(row);
        }
        
        let currentAction = { docId: null, newStatus: null };

        window.openActionModal = (docId, newStatus) => {
            currentAction = { docId, newStatus };
            const modal = document.getElementById('action-modal');
            const title = document.getElementById('modal-title');
            const message = document.getElementById('modal-message');
            const correctionDiv = document.getElementById('modal-correction-reason');
            const confirmBtn = document.getElementById('modal-confirm-btn');
            
            correctionDiv.classList.add('hidden');
            document.getElementById('correction-reason').value = '';
            
            confirmBtn.className = 'text-white font-bold py-2 px-4 rounded-lg';

            if (newStatus === 'Aprovado') {
                title.textContent = 'Aprovar Solicitação';
                message.textContent = 'Tem certeza que deseja aprovar esta permuta?';
                confirmBtn.classList.add('bg-green-600', 'hover:bg-green-700');
            } else if (newStatus === 'Negado') {
                title.textContent = 'Negar Solicitação';
                message.textContent = 'Tem certeza que deseja negar esta permuta? Esta ação não pode ser desfeita.';
                confirmBtn.classList.add('bg-red-600', 'hover:bg-red-700');
            } else if (newStatus === 'Correção') {
                title.textContent = 'Solicitar Correção';
                message.textContent = 'Por favor, descreva o que precisa ser corrigido pelo solicitante.';
                correctionDiv.classList.remove('hidden');
                confirmBtn.classList.add('bg-blue-600', 'hover:bg-blue-700');
            }
            modal.classList.remove('hidden');
        };

        window.closeModal = () => document.getElementById('action-modal').classList.add('hidden');

        document.getElementById('modal-confirm-btn').addEventListener('click', async () => {
            const { docId, newStatus } = currentAction;
            let updateData = { status: newStatus };
            
            if (newStatus === 'Correção') {
                const reason = document.getElementById('correction-reason').value;
                if (!reason.trim()) {
                    showAlert('Erro', 'O motivo da correção é obrigatório.', 'error');
                    return;
                }
                updateData.correctionReason = reason.trim();
            }

            try {
                const docRef = doc(db, `/artifacts/${appId}/public/data/permuta_requests`, docId);
                await updateDoc(docRef, updateData);
                showAlert('Sucesso', `Status da solicitação atualizado para "${newStatus}".`, 'success');
            } catch (error) {
                console.error("Erro ao atualizar status:", error);
                showAlert('Erro', 'Não foi possível atualizar o status.', 'error');
            } finally {
                closeModal();
            }
        });

        window.openDetailsModal = async (docId) => {
            const modal = document.getElementById('details-modal');
            const contentEl = document.getElementById('details-modal-content');
            const printBtnContainer = document.getElementById('details-modal-print-button');
            contentEl.innerHTML = '<p>Carregando...</p>';
            printBtnContainer.innerHTML = '';
            modal.classList.remove('hidden');

            try {
                const docRef = doc(db, `/artifacts/${appId}/public/data/permuta_requests`, docId);
                const docSnap = await getDoc(docRef);
                if (docSnap.exists()) {
                    const request = docSnap.data();
                    const pagamentoInfo = (request.pagamentoServico.inicio) ? `${formatDateForDisplay(request.pagamentoServico.inicio)} a ${formatDateForDisplay(request.pagamentoServico.fim || request.pagamentoServico.inicio)}` : 'Não se aplica';
                    contentEl.innerHTML = `
                        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div><strong>Data da Solicitação:</strong> ${new Date(request.timestamp.seconds * 1000).toLocaleString('pt-BR')}</div>
                            <div><strong>Localização:</strong> ${request.localizacao}</div>
                            <div><strong>PM Substituído:</strong> ${request.pmSubstituido.nome} (ID: ${request.pmSubstituido.id || 'N/A'})</div>
                            <div><strong>PM Substituto:</strong> ${request.pmSubstituto.nome} (ID: ${request.pmSubstituto.id || 'N/A'})</div>
                            <div><strong>Serviço Permutado:</strong> ${formatDateForDisplay(request.servicoPermutado.inicio)} a ${formatDateForDisplay(request.servicoPermutado.fim || request.servicoPermutado.inicio)}</div>
                            <div><strong>Pagamento do Serviço:</strong> ${pagamentoInfo}</div>
                        </div>
                        <div class="mt-4 pt-4 border-t">
                            <strong>Status Atual:</strong> <span class="font-semibold status-${request.status.replace(' ', '')} px-2 py-1 rounded-md text-xs">${request.status}</span>
                        </div>
                        ${request.status === 'Correção' && request.correctionReason ? `
                        <div class="mt-2">
                            <strong>Motivo da Correção:</strong> <span class="italic">"${request.correctionReason}"</span>
                        </div>` : ''}
                    `;
                    printBtnContainer.innerHTML = `<button onclick='printRequest(${JSON.stringify(request)})' class="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-6 rounded-lg">Imprimir</button>`;
                } else {
                    contentEl.innerHTML = '<p class="text-red-500">Erro: Solicitação não encontrada.</p>';
                }
            } catch (error) {
                console.error("Erro ao buscar detalhes:", error);
                contentEl.innerHTML = '<p class="text-red-500">Ocorreu um erro ao carregar os detalhes.</p>';
            }
        };
        
        window.closeDetailsModal = () => document.getElementById('details-modal').classList.add('hidden');
        
        let alertTimeout;
        window.showAlert = (title, message, type = 'info') => {
            const alertEl = document.getElementById('custom-alert');
            const iconEl = document.getElementById('alert-icon');
            
            document.getElementById('alert-title').textContent = title;
            document.getElementById('alert-message').textContent = message;

            let iconSVG = '';
            if (type === 'success') {
                iconSVG = `<svg class="w-6 h-6 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>`;
            } else if (type === 'error') {
                 iconSVG = `<svg class="w-6 h-6 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>`;
            }
            iconEl.innerHTML = iconSVG;
            
            clearTimeout(alertTimeout);
            alertEl.classList.remove('translate-x-[120%]');
            alertEl.classList.add('translate-x-0');

            alertTimeout = setTimeout(() => {
                closeCustomAlert();
            }, 5000);
        };

        window.closeCustomAlert = () => {
            const alertEl = document.getElementById('custom-alert');
            alertEl.classList.remove('translate-x-0');
            alertEl.classList.add('translate-x-[120%]');
        };

    </script>
</body>
</html>
