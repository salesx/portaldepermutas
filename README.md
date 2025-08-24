<html lang="pt-BR">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Formulário de Permuta de Serviço Oficial</title>
    <!-- Inclui o Tailwind CSS para estilização moderna e responsiva -->
    <script src="https://cdn.tailwindcss.com"></script>
    <style>
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;700&display=swap');
        body {
            font-family: 'Inter', sans-serif;
            background-color: #f3f4f6;
        }
        /* Estilos para a impressão e geração de PDF */
        @media print {
            body {
                background-color: white;
            }
            .no-print {
                display: none;
            }
            .printable-form {
                border: none !important;
                box-shadow: none !important;
                padding: 0 !important;
                margin: 0 !important;
                max-width: none !important;
            }
            input[type="text"], input[type="date"], input[type="tel"] {
                border: none !important;
                border-bottom: 1px solid #000 !important;
                padding: 0 !important;
            }
            /* Esconde as caixas de seleção na impressão */
            .printable-form input[type="checkbox"] {
                display: none;
            }
        }
        .input-error {
            border-color: #ef4444;
        }
        .loader {
            border: 4px solid #f3f3f3;
            border-top: 4px solid #3498db;
            border-radius: 50%;
            width: 24px;
            height: 24px;
            animation: spin 1s linear infinite;
        }
        @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
        }
        .modal {
            transition: opacity 0.3s ease-in-out;
        }
    </style>
</head>
<body class="p-6 md:p-12">
    <!-- Modal de Alerta Customizado -->
    <div id="custom-modal" class="modal hidden fixed inset-0 flex items-center justify-center bg-gray-900 bg-opacity-75 z-[9999] opacity-0">
        <div class="bg-white p-6 rounded-2xl shadow-xl max-w-sm w-full text-center transform scale-95 transition-transform">
            <h3 class="text-xl font-bold mb-4" id="modal-title"></h3>
            <p class="text-gray-700 mb-6" id="modal-message"></p>
            <div id="modal-actions" class="flex justify-center gap-4">
                <button onclick="closeCustomModal()" class="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-6 rounded-lg shadow-md transition-colors">OK</button>
            </div>
        </div>
    </div>

    <!-- Modal para Gerenciar PMs -->
    <div id="manage-pm-modal" class="modal hidden fixed inset-0 flex items-center justify-center bg-gray-900 bg-opacity-75 z-[9999] opacity-0">
        <div class="bg-white p-6 rounded-2xl shadow-xl max-w-lg w-full transform scale-95 transition-transform">
            <div class="flex justify-between items-center mb-4 border-b pb-2">
                <h3 class="text-2xl font-bold">Gerenciar Policiais Militares</h3>
                <button onclick="closeManagePmModal()" class="text-gray-500 hover:text-gray-800 text-3xl">&times;</button>
            </div>
            <div id="pm-list-container" class="max-h-80 overflow-y-auto mb-4 border rounded-md p-2">
                <!-- Lista de PMs será injetada aqui -->
            </div>
            <h4 class="text-lg font-bold mt-4 mb-2">Adicionar Novo PM</h4>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                    <label for="newPmName" class="text-sm font-medium text-gray-600 block">Nome:</label>
                    <input type="text" id="newPmName" placeholder="Ex: SD PM 001/22 FULANO" class="w-full mt-1 p-3 border-b-2 border-gray-300 bg-gray-50 focus:outline-none focus:border-blue-500 transition-colors duration-200 rounded-md">
                </div>
                <div>
                    <label for="newPmId" class="text-sm font-medium text-gray-600 block">ID (opcional):</label>
                    <input type="tel" id="newPmId" placeholder="Ex: 012345" pattern="\d*" class="w-full mt-1 p-3 border-b-2 border-gray-300 bg-gray-50 focus:outline-none focus:border-blue-500 transition-colors duration-200 rounded-md">
                </div>
            </div>
            <button onclick="addPm()" class="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded-lg shadow-md mt-4 transition-colors">Adicionar PM</button>
        </div>
    </div>

    <div class="printable-form bg-white rounded-3xl shadow-xl p-6 md:p-10 max-w-4xl mx-auto border-4 border-gray-800">
        <!-- Cabeçalho tipo folha timbrada - Brasão removido da visualização no-print -->
        <div class="flex flex-col items-center justify-center text-center p-4 bg-gray-800 text-white rounded-t-2xl no-print">
            <h1 class="text-xl font-bold tracking-wide">ESTADO DO MARANHÃO</h1>
            <p class="text-sm font-light">SECRETARIA DE SEGURANÇA PÚBLICA</p>
            <p class="text-sm font-light">COMANDO DE POLICIAMENTO DE ÁREA DO INTERIOR-5 (CPA/I-5)</p>
            <p class="text-xs mt-1 font-extralight">10º BATALHÃO DA POLÍCIA MILITAR DO MARANHÃO - 2ª CIA</p>
        </div>
        
        <h2 class="text-2xl font-extrabold text-center text-gray-800 my-8">FORMULÁRIO DE PERMUTA DE SERVIÇO</h2>
        
        <!-- Campos para a localização -->
        <div class="mb-6">
            <h5 class="text-base font-bold text-gray-800 mb-4 uppercase tracking-wider">Localização:</h5>
            <div class="flex flex-wrap gap-6">
                <label class="flex items-center text-base text-gray-700 cursor-pointer">
                    <input type="checkbox" name="localizacao" value="SEDE" class="form-checkbox h-5 w-5 rounded-md text-blue-600 border-gray-400 focus:ring-blue-500 transition duration-150 ease-in-out">
                    <span class="ml-2 font-medium">SEDE</span>
                </label>
                <label class="flex items-center text-base text-gray-700 cursor-pointer">
                    <input type="checkbox" name="localizacao" value="DPM TURILÂNDIA" class="form-checkbox h-5 w-5 rounded-md text-blue-600 border-gray-400 focus:ring-blue-500 transition duration-150 ease-in-out">
                    <span class="ml-2 font-medium">DPM TURILÂNDIA</span>
                </label>
                <label class="flex items-center text-base text-gray-700 cursor-pointer">
                    <input type="checkbox" name="localizacao" value="DPM TURIAÇU" class="form-checkbox h-5 w-5 rounded-md text-blue-600 border-gray-400 focus:ring-blue-500 transition duration-150 ease-in-out">
                    <span class="ml-2 font-medium">DPM TURIAÇU</span>
                </label>
            </div>
            <p id="localizacaoWarning" class="text-sm text-red-600 mt-2 hidden font-semibold">Selecione uma localização.</p>
        </div>
        
        <!-- Campos para o PM Substituído -->
        <div class="mb-6 border-t-2 pt-6">
            <h5 class="text-base font-bold text-gray-800 mb-4 uppercase tracking-wider">PM SUBSTITUÍDO:</h5>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                    <label for="pmSubstituidoNome" class="text-sm font-medium text-gray-600 block">Nome:</label>
                    <input type="text" id="pmSubstituidoNome" placeholder="SD PM 001/22 FULANO" class="w-full mt-1 p-3 border-b-2 border-gray-300 bg-gray-50 focus:outline-none focus:border-blue-500 transition-colors duration-200 rounded-md" list="pmList">
                    <p id="pmSubstituidoNomeWarning" class="text-xs text-red-600 mt-1 hidden">Campo obrigatório.</p>
                </div>
                <div>
                    <label for="pmSubstituidoIdentificacao" class="text-sm font-medium text-gray-600 block">ID:</label>
                    <input type="tel" id="pmSubstituidoIdentificacao" placeholder="012345" pattern="\d*" class="w-full mt-1 p-3 border-b-2 border-gray-300 bg-gray-50 focus:outline-none focus:border-blue-500 transition-colors duration-200 rounded-md">
                    <p id="pmSubstituidoIdentificacaoWarning" class="text-xs text-red-600 mt-1 hidden">Campo obrigatório.</p>
                </div>
            </div>
        </div>

        <!-- Campos para o PM Substituto -->
        <div class="mb-6">
            <h5 class="text-base font-bold text-gray-800 mb-4 uppercase tracking-wider">PM SUBSTITUTO:</h5>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                    <label for="pmSubstitutoNome" class="text-sm font-medium text-gray-600 block">Nome:</label>
                    <input type="text" id="pmSubstitutoNome" placeholder="SD PM 001/22 FULANO" class="w-full mt-1 p-3 border-b-2 border-gray-300 bg-gray-50 focus:outline-none focus:border-blue-500 transition-colors duration-200 rounded-md" list="pmList">
                    <p id="pmSubstitutoNomeWarning" class="text-xs text-red-600 mt-1 hidden">Campo obrigatório.</p>
                </div>
                <div>
                    <label for="pmSubstitutoIdentificacao" class="text-sm font-medium text-gray-600 block">ID:</label>
                    <input type="tel" id="pmSubstitutoIdentificacao" placeholder="012345" pattern="\d*" class="w-full mt-1 p-3 border-b-2 border-gray-300 bg-gray-50 focus:outline-none focus:border-blue-500 transition-colors duration-200 rounded-md">
                    <p id="pmSubstitutoIdentificacaoWarning" class="text-xs text-red-600 mt-1 hidden">Campo obrigatório.</p>
                </div>
            </div>
        </div>

        <!-- Datalist para a lista de PMs (será preenchida dinamicamente) -->
        <datalist id="pmList"></datalist>

        <!-- Campos para as datas e tipo de serviço -->
        <div class="mb-6 border-t-2 pt-6">
            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div class="flex flex-col">
                    <label class="text-sm font-bold text-gray-800 uppercase tracking-wide mb-2">DATA(S) DO SERVIÇO PERMUTADO:</label>
                    <p class="text-xs text-gray-500 mb-2">Escolha entre 1 a 3 dias consecutivos</p>
                    <div class="flex flex-col md:flex-row gap-4">
                        <div class="w-full">
                            <label for="dataServicoPermutadoInicio" class="text-xs text-gray-500 block">Início:</label>
                            <input type="date" id="dataServicoPermutadoInicio" class="w-full mt-1 p-3 border-b-2 border-gray-300 bg-gray-50 focus:outline-none focus:border-blue-500 transition-colors duration-200 rounded-md">
                            <p id="dataServicoPermutadoInicioWarning" class="text-xs text-red-600 mt-1 hidden">Campo obrigatório.</p>
                        </div>
                        <div class="w-full">
                            <label for="dataServicoPermutadoFim" class="text-xs text-gray-500 block">Término:</label>
                            <input type="date" id="dataServicoPermutadoFim" class="w-full mt-1 p-3 border-b-2 border-gray-300 bg-gray-50 focus:outline-none focus:border-blue-500 transition-colors duration-200 rounded-md">
                            <p id="dataServicoPermutadoFimWarning" class="text-xs text-red-600 mt-1 hidden">Campo obrigatório.</p>
                        </div>
                    </div>
                </div>
                <div class="flex flex-col">
                    <div class="flex items-center justify-between mb-2">
                        <label class="text-sm font-bold text-gray-800 uppercase tracking-wide">DATA(S) DO PAGAMENTO DO SERVIÇO:</label>
                        <div class="flex items-center">
                            <input type="checkbox" id="noPagamentoCheckbox" class="form-checkbox h-4 w-4 rounded text-blue-600 border-gray-400 focus:ring-blue-500">
                            <label for="noPagamentoCheckbox" class="text-xs text-gray-600 ml-2">Não há pagamento</label>
                        </div>
                    </div>
                    <div id="pagamentoServicoFields" class="flex flex-col md:flex-row gap-4">
                        <div class="w-full">
                            <label for="dataPagamentoServicoInicio" class="text-xs text-gray-500 block">Início:</label>
                            <input type="date" id="dataPagamentoServicoInicio" class="w-full mt-1 p-3 border-b-2 border-gray-300 bg-gray-50 focus:outline-none focus:border-blue-500 transition-colors duration-200 rounded-md">
                        </div>
                        <div class="w-full">
                            <label for="dataPagamentoServicoFim" class="text-xs text-gray-500 block">Término:</label>
                            <input type="date" id="dataPagamentoServicoFim" class="w-full mt-1 p-3 border-b-2 border-gray-300 bg-gray-50 focus:outline-none focus:border-blue-500 transition-colors duration-200 rounded-md">
                        </div>
                    </div>
                </div>
            </div>
            <p id="dateWarning" class="text-sm text-red-600 mt-4 text-center hidden">A diferença entre as datas não pode ser superior a 3 dias.</p>
        </div>
        
        <!-- Botões de ação do formulário -->
        <div class="no-print flex flex-col md:flex-row justify-center items-center gap-4 mt-8">
            <button onclick="printForm()" class="bg-blue-700 hover:bg-blue-800 text-white font-bold py-3 px-8 rounded-xl shadow-lg transition-transform transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:ring-offset-2">
                Concluir Permuta
            </button>
            <button onclick="showManagePmModal()" class="bg-gray-500 hover:bg-gray-600 text-white font-bold py-3 px-8 rounded-xl shadow-lg transition-transform transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-gray-400 focus:ring-offset-2">
                Gerenciar PMs
            </button>
        </div>
    </div>

    <script type="module">
        import { initializeApp } from "https://www.gstatic.com/firebasejs/11.6.1/firebase-app.js";
        import { getAuth, signInAnonymously, signInWithCustomToken, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/11.6.1/firebase-auth.js";
        import { getFirestore, doc, getDoc, addDoc, setDoc, updateDoc, deleteDoc, onSnapshot, collection, query, where, getDocs } from "https://www.gstatic.com/firebasejs/11.6.1/firebase-firestore.js";

        // Global variables provided by the Canvas environment
        const appId = typeof __app_id !== 'undefined' ? __app_id : 'default-app-id';
        const firebaseConfig = JSON.parse(typeof __firebase_config !== 'undefined' ? __firebase_config : '{}');
        const initialAuthToken = typeof __initial_auth_token !== 'undefined' ? __initial_auth_token : null;

        let db;
        let auth;
        let userId;

        // Function to show a custom modal
        function showCustomModal(title, message, actions = '<button onclick="closeCustomModal()" class="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-6 rounded-lg shadow-md transition-colors">OK</button>') {
            const modal = document.getElementById('custom-modal');
            document.getElementById('modal-title').textContent = title;
            document.getElementById('modal-message').textContent = message;
            document.getElementById('modal-actions').innerHTML = actions;
            modal.classList.remove('hidden');
            setTimeout(() => {
                modal.classList.remove('opacity-0');
                modal.querySelector('.transform').classList.remove('scale-95');
            }, 10);
        }

        // Function to close the custom modal
        window.closeCustomModal = function() {
            const modal = document.getElementById('custom-modal');
            modal.classList.add('opacity-0');
            modal.querySelector('.transform').classList.add('scale-95');
            setTimeout(() => {
                modal.classList.add('hidden');
            }, 300); // Wait for the transition to finish
        };

        // Initialize Firebase
        const app = initializeApp(firebaseConfig);
        db = getFirestore(app);
        auth = getAuth(app);
        
        let pmList = [];

        // Auth state listener
        onAuthStateChanged(auth, async (user) => {
            if (user) {
                userId = user.uid;
                await fetchPmList();
            } else {
                // If the initial token is not present, sign in anonymously
                try {
                    if (initialAuthToken) {
                        await signInWithCustomToken(auth, initialAuthToken);
                    } else {
                        await signInAnonymously(auth);
                    }
                } catch (error) {
                    showCustomModal('Erro de Autenticação', `Falha ao autenticar com o Firebase: ${error.message}`);
                    console.error("Authentication error:", error);
                }
            }
        });

        // Fetch PM list from Firestore
        async function fetchPmList() {
            try {
                const pmCollectionRef = collection(db, `artifacts/${appId}/users/${userId}/pm_data`);
                onSnapshot(pmCollectionRef, (snapshot) => {
                    pmList = snapshot.docs.map(doc => ({
                        id: doc.id,
                        name: doc.data().name,
                        pmId: doc.data().pmId
                    }));
                    updateDatalist();
                    renderManagePmList();
                }, (error) => {
                    console.error("Error fetching PM list:", error);
                    showCustomModal('Erro de Dados', 'Falha ao carregar a lista de PMs.');
                });
            } catch (error) {
                showCustomModal('Erro de Dados', `Falha ao conectar com o banco de dados: ${error.message}`);
                console.error("Firestore connection error:", error);
            }
        }

        // Update the datalist for form inputs
        function updateDatalist() {
            const pmDatalist = document.getElementById('pmList');
            pmDatalist.innerHTML = '';
            const turiacuCheckbox = document.querySelector('input[name="localizacao"][value="DPM TURIAÇU"]');
            if (turiacuCheckbox.checked) {
                pmList.forEach(pm => {
                    const option = document.createElement('option');
                    option.value = pm.name;
                    pmDatalist.appendChild(option);
                });
            }
        }

        // Render the list of PMs in the management modal
        function renderManagePmList() {
            const listContainer = document.getElementById('pm-list-container');
            listContainer.innerHTML = '';
            if (pmList.length === 0) {
                listContainer.innerHTML = '<p class="text-center text-gray-500">Nenhum PM cadastrado.</p>';
                return;
            }
            pmList.forEach(pm => {
                const item = document.createElement('div');
                item.className = 'flex items-center justify-between p-2 my-1 bg-gray-100 rounded-lg';
                item.innerHTML = `
                    <p class="text-sm"><strong>${pm.name}</strong> - ${pm.pmId || 'N/A'}</p>
                    <button onclick="deletePm('${pm.id}')" class="text-red-500 hover:text-red-700 transition-colors">
                        <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                          <path fill-rule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm6 0a1 1 0 012 0v6a1 1 0 11-2 0V8z" clip-rule="evenodd" />
                        </svg>
                    </button>
                `;
                listContainer.appendChild(item);
            });
        }

        // Add a new PM to Firestore
        window.addPm = async function() {
            const newName = document.getElementById('newPmName').value.trim();
            const newId = document.getElementById('newPmId').value.trim();
            if (!newName) {
                showCustomModal('Erro', 'O nome do PM é obrigatório.');
                return;
            }
            try {
                const pmCollectionRef = collection(db, `artifacts/${appId}/users/${userId}/pm_data`);
                await addDoc(pmCollectionRef, { name: newName, pmId: newId });
                document.getElementById('newPmName').value = '';
                document.getElementById('newPmId').value = '';
                showCustomModal('Sucesso', 'PM adicionado com sucesso!');
            } catch (e) {
                showCustomModal('Erro', `Falha ao adicionar PM: ${e.message}`);
                console.error("Error adding document: ", e);
            }
        }

        // Delete a PM from Firestore
        window.deletePm = async function(docId) {
            try {
                const pmDocRef = doc(db, `artifacts/${appId}/users/${userId}/pm_data`, docId);
                await deleteDoc(pmDocRef);
                showCustomModal('Sucesso', 'PM excluído com sucesso!');
            } catch (e) {
                showCustomModal('Erro', `Falha ao excluir PM: ${e.message}`);
                console.error("Error deleting document: ", e);
            }
        }

        // Show/hide the management modal
        window.showManagePmModal = function() {
            const modal = document.getElementById('manage-pm-modal');
            modal.classList.remove('hidden');
            setTimeout(() => {
                modal.classList.remove('opacity-0');
                modal.querySelector('.transform').classList.remove('scale-95');
            }, 10);
            renderManagePmList();
        }

        window.closeManagePmModal = function() {
            const modal = document.getElementById('manage-pm-modal');
            modal.classList.add('opacity-0');
            modal.querySelector('.transform').classList.add('scale-95');
            setTimeout(() => {
                modal.classList.add('hidden');
            }, 300);
        };

        const noPagamentoCheckbox = document.getElementById('noPagamentoCheckbox');
        const pagamentoServicoInicio = document.getElementById('dataPagamentoServicoInicio');
        const pagamentoServicoFim = document.getElementById('dataPagamentoServicoFim');
        const fields = document.getElementById('pagamentoServicoFields');

        function checkPagamentoStatus() {
            if (pagamentoServicoInicio.value.trim() === '' && pagamentoServicoFim.value.trim() === '') {
                noPagamentoCheckbox.checked = true;
                fields.classList.add('hidden');
            } else {
                noPagamentoCheckbox.checked = false;
                fields.classList.remove('hidden');
            }
        }
        
        pagamentoServicoInicio.addEventListener('input', checkPagamentoStatus);
        pagamentoServicoFim.addEventListener('input', checkPagamentoStatus);

        noPagamentoCheckbox.addEventListener('change', function() {
            if (this.checked) {
                fields.classList.add('hidden');
                pagamentoServicoInicio.value = '';
                pagamentoServicoFim.value = '';
            } else {
                fields.classList.remove('hidden');
            }
        });
        
        const localizacaoCheckboxes = document.querySelectorAll('input[name="localizacao"]');
        localizacaoCheckboxes.forEach(checkbox => {
            checkbox.addEventListener('change', function() {
                if (this.checked) {
                    localizacaoCheckboxes.forEach(otherCheckbox => {
                        if (otherCheckbox !== this) {
                            otherCheckbox.checked = false;
                        }
                    });
                }
                updateDatalist();
                validateLocalizacao();
            });
        });

        const pmSubstituidoNomeInput = document.getElementById('pmSubstituidoNome');
        const pmSubstituidoIdentificacaoInput = document.getElementById('pmSubstituidoIdentificacao');
        const pmSubstitutoNomeInput = document.getElementById('pmSubstitutoNome');
        const pmSubstitutoIdentificacaoInput = document.getElementById('pmSubstitutoIdentificacao');

        pmSubstituidoNomeInput.addEventListener('input', (event) => {
            const selectedPm = pmList.find(pm => pm.name === event.target.value);
            if (selectedPm) {
                pmSubstituidoIdentificacaoInput.value = selectedPm.pmId || '';
            } else {
                pmSubstituidoIdentificacaoInput.value = '';
            }
        });
        
        pmSubstitutoNomeInput.addEventListener('input', (event) => {
            const selectedPm = pmList.find(pm => pm.name === event.target.value);
            if (selectedPm) {
                pmSubstitutoIdentificacaoInput.value = selectedPm.pmId || '';
            } else {
                pmSubstitutoIdentificacaoInput.value = '';
            }
        });

        function validateLocalizacao() {
            const warning = document.getElementById('localizacaoWarning');
            const anyChecked = Array.from(localizacaoCheckboxes).some(cb => cb.checked);
            if (anyChecked) {
                warning.classList.add('hidden');
                return true;
            } else {
                warning.classList.remove('hidden');
                return false;
            }
        }

        function validateField(fieldId, warningId) {
            const field = document.getElementById(fieldId);
            const warning = document.getElementById(warningId);
            if (!field.value.trim()) {
                field.classList.add('input-error');
                warning.classList.remove('hidden');
                return false;
            } else {
                field.classList.remove('input-error');
                warning.classList.add('hidden');
                return true;
            }
        }

        function validateDateRange(startDateId, endDateId, warningId) {
            const startDateInput = document.getElementById(startDateId);
            const endDateInput = document.getElementById(endDateId);
            const warningElement = document.getElementById(warningId);
            let isValid = true;
            
            if (!startDateInput.value.trim()) {
                startDateInput.classList.add('input-error');
                document.getElementById('dataServicoPermutadoInicioWarning').classList.remove('hidden');
                isValid = false;
            } else {
                startDateInput.classList.remove('input-error');
                document.getElementById('dataServicoPermutadoInicioWarning').classList.add('hidden');
            }

            if (!endDateInput.value.trim()) {
                endDateInput.classList.add('input-error');
                document.getElementById('dataServicoPermutadoFimWarning').classList.remove('hidden');
                isValid = false;
            } else {
                endDateInput.classList.remove('input-error');
                document.getElementById('dataServicoPermutadoFimWarning').classList.add('hidden');
            }

            if (isValid && startDateInput.value && endDateInput.value) {
                const startDate = new Date(startDateInput.value + 'T00:00:00');
                const endDate = new Date(endDateInput.value + 'T00:00:00');
                
                const diffTime = Math.abs(endDate - startDate);
                const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

                if (diffDays > 2) {
                    warningElement.classList.remove('hidden');
                    return false;
                } else {
                    warningElement.classList.add('hidden');
                    return true;
                }
            }
            return isValid;
        }

        const dateFields = [
            { start: 'dataServicoPermutadoInicio', end: 'dataServicoPermutadoFim', warn: 'dateWarning' },
        ];
        
        dateFields.forEach(field => {
            const startDateInput = document.getElementById(field.start);
            const endDateInput = document.getElementById(field.end);
            
            startDateInput.addEventListener('change', () => validateDateRange(field.start, field.end, field.warn));
            endDateInput.addEventListener('change', () => validateDateRange(field.start, field.end, field.warn));
        });

        const requiredFields = [
            { id: 'pmSubstituidoNome', warningId: 'pmSubstituidoNomeWarning' },
            { id: 'pmSubstituidoIdentificacao', warningId: 'pmSubstituidoIdentificacaoWarning' },
            { id: 'pmSubstitutoNome', warningId: 'pmSubstitutoNomeWarning' },
            { id: 'pmSubstitutoIdentificacao', warningId: 'pmSubstitutoIdentificacaoWarning' },
        ];
        requiredFields.forEach(field => {
            document.getElementById(field.id).addEventListener('input', () => validateField(field.id, field.warningId));
        });
        
        function validateAllFields() {
            let isValid = true;
            isValid = validateLocalizacao() && isValid;
            isValid = validateField('pmSubstituidoNome', 'pmSubstituidoNomeWarning') && isValid;
            isValid = validateField('pmSubstituidoIdentificacao', 'pmSubstituidoIdentificacaoWarning') && isValid;
            isValid = validateField('pmSubstitutoNome', 'pmSubstitutoNomeWarning') && isValid;
            isValid = validateField('pmSubstitutoIdentificacao', 'pmSubstitutoIdentificacaoWarning') && isValid;
            isValid = validateDateRange('dataServicoPermutadoInicio', 'dataServicoPermutadoFim', 'dateWarning') && isValid;
            return isValid;
        }
        
        function formatarDataRange(startDateStr, endDateStr) {
            const dates = [];
            let currentDate = new Date(startDateStr + 'T00:00:00');
            const finalDate = new Date(endDateStr + 'T00:00:00');

            if (startDateStr && endDateStr) {
                while (currentDate <= finalDate) {
                    dates.push(new Date(currentDate));
                    currentDate.setDate(currentDate.getDate() + 1);
                }
            }
            
            if (dates.length === 0) {
                return '';
            }

            if (dates.length === 1) {
                const d = dates[0];
                return `${String(d.getDate()).padStart(2, '0')}/${String(d.getMonth() + 1).padStart(2, '0')}/${d.getFullYear()}`;
            }

            let result = '';
            let currentMonth = dates[0].getMonth();
            let currentYear = dates[0].getFullYear();
            let daysInGroup = [];
            
            for (let i = 0; i < dates.length; i++) {
                const d = dates[i];
                if (d.getMonth() === currentMonth && d.getFullYear() === currentYear) {
                    daysInGroup.push(String(d.getDate()).padStart(2, '0'));
                } else {
                    if (result !== '') {
                        result += ' e ';
                    }
                    result += `${daysInGroup.join(', ')}/${String(currentMonth + 1).padStart(2, '0')}`;
                    currentMonth = d.getMonth();
                    currentYear = d.getFullYear();
                    daysInGroup = [String(d.getDate()).padStart(2, '0')];
                }
            }
            if (daysInGroup.length > 0) {
                if (result !== '') {
                    result += ' e ';
                }
                result += `${daysInGroup.join(' e ')}/${String(currentMonth + 1).padStart(2, '0')}/${currentYear}`;
            }
            
            return result;
        }

        window.printForm = function() {
            if (!validateAllFields()) {
                showCustomModal('Erro de Validação', 'Por favor, preencha todos os campos obrigatórios antes de concluir a permuta.');
                return;
            }
            
            // Coleta os dados do formulário
            const pmSubstituidoNome = document.getElementById('pmSubstituidoNome').value.toUpperCase();
            const pmSubstituidoId = document.getElementById('pmSubstituidoIdentificacao').value;
            const pmSubstitutoNome = document.getElementById('pmSubstitutoNome').value.toUpperCase();
            const pmSubstitutoId = document.getElementById('pmSubstitutoIdentificacao').value;
            const servicoPermutadoInicio = document.getElementById('dataServicoPermutadoInicio').value;
            const servicoPermutadoFim = document.getElementById('dataServicoPermutadoFim').value;
            const pagamentoServicoInicio = document.getElementById('dataPagamentoServicoInicio').value;
            const pagamentoServicoFim = document.getElementById('dataPagamentoServicoFim').value;
            const noPagamentoCheckbox = document.getElementById('noPagamentoCheckbox').checked;

            // Coleta a localização selecionada
            const localizacaoChecked = document.querySelector('input[name="localizacao"]:checked')?.value || ' ';
            let localizacaoSede = localizacaoChecked === 'SEDE' ? 'X' : '&nbsp;';
            let localizacaoTurilandia = localizacaoChecked === 'DPM TURILÂNDIA' ? 'X' : '&nbsp;';
            let localizacaoTuriacu = localizacaoChecked === 'DPM TURIAÇU' ? 'X' : '&nbsp;';
            
            // Coleta o tipo de serviço com base na quantidade de dias
            const diasServico = servicoPermutadoInicio && servicoPermutadoFim ? Math.ceil((new Date(servicoPermutadoFim) - new Date(servicoPermutadoInicio)) / (1000 * 60 * 60 * 24)) + 1 : 0;
            let tipo24Horas = '&nbsp;';
            let tipo48Horas = '&nbsp;';
            let tipo72Horas = '&nbsp;';

            if (diasServico === 1) {
                tipo24Horas = 'X';
            } else if (diasServico === 2) {
                tipo48Horas = 'X';
            } else if (diasServico >= 3) {
                tipo72Horas = 'X';
            }

            const servicoPermutadoTexto = formatarDataRange(servicoPermutadoInicio, servicoPermutadoFim);
            const pagamentoServicoTexto = formatarDataRange(pagamentoServicoInicio, pagamentoServicoFim);
            
            let pagamentoHtml = '';
            if (!noPagamentoCheckbox) {
                pagamentoHtml = `<p class="text-base mt-2">Data do pagamento do serviço: ${pagamentoServicoTexto}</p>`;
            }
            
            const brasaoUrlPrint = 'https://i.ibb.co/Xr6X43nG/BRAS-O.png';

            const printContent = `
                <!DOCTYPE html>
                <html lang="pt-BR">
                <head>
                    <meta name="viewport" content="width=device-width, initial-scale=1.0">
                    <title>Formulário de Permuta - Impressão</title>
                    <style>
                        body {
                            font-family: 'Times New Roman', Times, serif;
                            margin: 1.5cm; /* Margens reduzidas para caber em uma página */
                            padding: 0;
                            line-height: 1.15;
                        }
                        .container {
                            width: 100%;
                            max-width: 800px;
                            margin: 0 auto;
                        }
                        .text-center { text-align: center; }
                        .text-sm { font-size: 0.875rem; }
                        .text-xs { font-size: 0.75rem; }
                        .text-base { font-size: 1rem; }
                        .mt-2 { margin-top: 0.5rem; }
                        .mt-4 { margin-top: 1rem; }
                        .mt-8 { margin-top: 2rem; }
                        .mb-6 { margin-bottom: 1.5rem; }
                        .font-bold { font-weight: bold; }
                    </style>
                </head>
                <body>
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
                        <p class="text-base">SEDE: ( ${localizacaoSede} )&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;DPM TURILÂNDIA: ( ${localizacaoTurilandia} )&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;DPM TURIAÇU: ( ${localizacaoTuriacu} )</p>
                    </div>
                    
                    <div style="margin-bottom: 0,25rem;">
                        <p class="text-base">PM SUBSTITUÍDO: ${pmSubstituidoNome} - ${pmSubstituidoId}</p>
                        <p style="margin-top: 4rem;">Assinatura:________________________________________</p>
                    </div>
                    
                    <div style="margin-bottom: 0,25rem;">
                        <p class="text-base">PM SUBSTITUTO: ${pmSubstitutoNome} - ${pmSubstitutoId}</p>
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
                        <p class="text-base" style="margin: 0;">AUTORIZO A PERMUTA ENTRE OS POLICIAIS MILITARES ACIMA RELACIONADOS: ( &nbsp; ) Sim &nbsp; ( &nbsp; ) Não</p>
                        <p class="text-base" style="margin-top: 3rem; margin-bottom: 0;">_____________________________________________________</p>
                        <p class="text-base" style="margin-top: 0.2rem; margin-bottom: 0;">JOSE RIBAMAR BRAGA JUNIOR - 1º TEN QOPM</p>
                        <p class="text-sm" style="margin-top: 0;">COMANDANTE DA 2°CP/10°BPM</p>
                    </div>
                </body>
                </html>
            `;

            // Abre uma nova janela para a impressão
            const printWindow = window.open('', '_blank');
            if (printWindow) {
                printWindow.document.open();
                printWindow.document.write(printContent);
                printWindow.document.close();
                printWindow.focus();
                printWindow.print();
            } else {
                showCustomModal('Aviso', 'Por favor, habilite pop-ups para imprimir o formulário.');
            }
        }
    </script>
</body>
</html>
