// =================================================================
// INICIALIZAÇÃO E AUTENTICAÇÃO FIREBASE
// =================================================================
import { initializeApp } from "https://www.gstatic.com/firebasejs/11.6.1/firebase-app.js";
import { getFirestore, collection, addDoc, onSnapshot, query, where, doc, updateDoc, getDoc, setDoc, getDocs, deleteDoc } from "https://www.gstatic.com/firebasejs/11.6.1/firebase-firestore.js";
import { getAuth, signInWithCustomToken, signInAnonymously, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/11.6.1/firebase-auth.js";

// Configuração do Firebase fornecida
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyAK5pxlxoaA37EGs3TRw1Q8F-9ghFw-o9w",
  authDomain: "portaldepermutas.firebaseapp.com",
  projectId: "portaldepermutas",
  storageBucket: "portaldepermutas.firebasestorage.app",
  messagingSenderId: "496739921207",
  appId: "1:496739921207:web:04ceef2d6a4d8679937eb2",
  measurementId: "G-JBKLB3DDG1"
};


const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);
const appId = firebaseConfig.appId; // Usando o appId da configuração

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
            await signInAnonymously(auth);
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
    // This function is no longer needed as the user can be either party.
}

function loadUserProfile() {
    const profile = currentUser.profile;
    document.getElementById('profile-graduacao').value = profile.grad || 'SD PM';
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
