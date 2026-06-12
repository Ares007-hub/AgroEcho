/* ============================================================
   AGROECHO – JAVASCRIPT UNIFICADO (APENAS FRONTEND & UX)
   ============================================================ */

// ----- 1. TEMA GLOBAL (DARK / LIGHT MODE) -----
let theme = localStorage.getItem('agroecho_theme') || 'light';

function applyTheme() {
    if (theme === 'dark') {
        document.documentElement.setAttribute('data-theme', 'dark');
        const themeIcons = document.querySelectorAll('.theme-toggle i, .theme-toggle-index i');
        themeIcons.forEach(icon => { if (icon) icon.className = 'fas fa-sun'; });
    } else {
        document.documentElement.removeAttribute('data-theme');
        const themeIcons = document.querySelectorAll('.theme-toggle i, .theme-toggle-index i');
        themeIcons.forEach(icon => { if (icon) icon.className = 'fas fa-moon'; });
    }
}

function toggleTheme() {
    theme = theme === 'dark' ? 'light' : 'dark';
    localStorage.setItem('agroecho_theme', theme);
    applyTheme();
}
applyTheme();

// ----- 2. SIDEBAR MOBILE (HAMBURGER) -----
function toggleSidebar() {
    const sidebar = document.getElementById('sidebar');
    const overlay = document.getElementById('sidebarOverlay');
    const hamburger = document.getElementById('hamburgerBtn');
    if (!sidebar || !overlay || !hamburger) return;
    
    sidebar.classList.toggle('open');
    overlay.classList.toggle('active');
    hamburger.innerHTML = sidebar.classList.contains('open') ? '✕' : '☰';
}

// ----- 3. LOGOUT INTEGRADO AO LARAVEL -----
function logout() {
    // Redireciona direto para a rota de logout do Laravel limpar a sessão do servidor
    window.location.href = '/logout';
}

// ============================================================
// LANDING PAGE (ANIMAÇÕES E CONTADORES)
// ============================================================
if (document.querySelector('body.landing-page')) {
    const navbar = document.getElementById('navbar');
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) navbar.classList.add('scrolled');
        else navbar.classList.remove('scrolled');
    });

    function openModal(modalId) {
        document.getElementById(modalId).classList.add('active');
        document.body.style.overflow = 'hidden';
    }

    function closeModal(modalId) {
        document.getElementById(modalId).classList.remove('active');
        document.body.style.overflow = 'auto';
    }

    window.onclick = function (event) {
        if (event.target.classList.contains('modal-overlay')) {
            event.target.classList.remove('active');
            document.body.style.overflow = 'auto';
        }
    }

    const counters = document.querySelectorAll('.counter');
    const countTo = (counter) => {
        const target = +counter.getAttribute('data-target');
        const duration = 1500;
        let startTime = null;

        const animate = (timestamp) => {
            if (!startTime) startTime = timestamp;
            const progress = timestamp - startTime;
            const progressPercentage = Math.min(progress / duration, 1);
            const ease = progressPercentage * (2 - progressPercentage);
            const currentValue = Math.floor(ease * target);
            counter.textContent = `${currentValue}%`;
            if (progress < duration) {
                requestAnimationFrame(animate);
            } else {
                counter.textContent = `${target}%`;
            }
        };
        requestAnimationFrame(animate);
    };

    const observerOptions = { threshold: 0.2 };
    const observer = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                countTo(entry.target);
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    counters.forEach(counter => observer.observe(counter));
}

// ============================================================
// PÁGINA DE LOGIN / CADASTRO (UX DOS FORMULÁRIOS)
// ============================================================
if (document.getElementById('tab-login')) {
    
    // Mostrar/Ocultar Senha
    window.togglePass = function(inputId, btn) {
        const input = document.getElementById(inputId);
        const icon = btn.querySelector('i');
        if (input.type === 'password') {
            input.type = 'text';
            icon.className = 'fas fa-eye-slash';
        } else {
            input.type = 'password';
            icon.className = 'fas fa-eye';
        }
    };

    // Trocar abas (Login / Cadastro)
    window.switchTab = function(tab) {
        const isLogin = tab === 'login';
        document.querySelectorAll('.tab-btn').forEach((btn, i) => {
            btn.classList.toggle('active', isLogin ? i === 0 : i === 1);
        });
        document.getElementById('tab-login').classList.toggle('active', isLogin);
        document.getElementById('tab-register').classList.toggle('active', !isLogin);
        document.querySelector('.tab-scroll').scrollTop = 0;
    };

    // Máscara de Telefone
    const phoneInput = document.getElementById('regPhone');
    if(phoneInput) {
        phoneInput.addEventListener('input', function() {
            let val = this.value.replace(/\D/g, '');
            if (val.length > 0) val = val.replace(/^(\d{2})(\d)/, '($1) $2');
            if (val.length > 10) val = val.replace(/(\d{5})(\d)/, '$1-$2');
            this.value = val;
        });
    }

    // Força da Senha (Apenas Visual)
    const pwdInput = document.getElementById('regPassword');
    const strengthFill = document.getElementById('strengthFill');
    const strengthLabel = document.getElementById('strengthLabel');
    
    if(pwdInput) {
        pwdInput.addEventListener('input', function() {
            const pwd = this.value;
            if (!pwd) {
                strengthFill.setAttribute('data-level', '');
                strengthLabel.textContent = '';
                return;
            }
            let score = 0;
            if (pwd.length >= 6) score++;
            if (/[A-Z]/.test(pwd)) score++;
            if (/[!@#$%^&*(),.?":{}|<>]/.test(pwd)) score++;
            if (/[0-9]/.test(pwd)) score++;
            
            let level = score <= 1 ? 'weak' : score <= 2 ? 'fair' : score <= 3 ? 'good' : 'strong';
            strengthFill.setAttribute('data-level', level);
            strengthLabel.textContent = { weak: 'Fraca', fair: 'Razoável', good: 'Boa', strong: 'Forte' }[level];
        });
    }
}

// ============================================================
// PAINEL ADMIN / DASHBOARD (GRÁFICO DINÂMICO)
// ============================================================
document.addEventListener("DOMContentLoaded", function () {
    const chartEl = document.getElementById('statusChart');
    
    if (chartEl) {
        // Pega os dados direto das propriedades data-* do HTML (ou joga 0 se não existirem)
        const active = parseInt(chartEl.getAttribute('data-active')) || 0;
        const inactive = parseInt(chartEl.getAttribute('data-inactive')) || 0;
        const maintenance = parseInt(chartEl.getAttribute('data-maintenance')) || 0;

        const ctx = chartEl.getContext('2d');
        new Chart(ctx, {
            type: 'bar',
            data: {
                labels: ['Ativos', 'Inativos', 'Manutenção'],
                datasets: [{ 
                    data: [active, inactive, maintenance], 
                    backgroundColor: ['#1b8f5a', '#dc2626', '#2d7ff9'], 
                    borderRadius: 10 
                }]
            },
            options: {
                responsive: true,
                plugins: { legend: { display: false } },
                scales: { y: { beginAtZero: true, ticks: { stepSize: 1 } } }
            }
        });
    }
});

// ============================================================
// MODAL DE CONFIRMAÇÃO GENÉRICO (PÁGINAS ADMIN)
// ============================================================
window.closeModal = function() {
    const modal = document.getElementById('confirmModal');
    if (modal) modal.classList.remove('active');
    window.pendingAction = null;
};

const confirmModal = document.getElementById('confirmModal');
if (confirmModal) {
    confirmModal.addEventListener('click', function(e) {
        if (e.target === this) closeModal();
    });
}

// ============================================================
// RELATÓRIOS (EXPORTAÇÃO EXCEL)
// ============================================================
window.exportarParaExcel = function() {
    try {
        var tabela = document.getElementById("tabela-bruta");
        if (!tabela) {
            alert("Nenhuma tabela encontrada para exportar.");
            return;
        }
        var workbook = XLSX.utils.table_to_book(tabela, {sheet: "Dados Brutos"});
        var dataHoje = new Date().toISOString().split('T')[0];
        var nomeArquivo = 'Relatorio_AgroEcho_' + dataHoje + '.xlsx';
        XLSX.writeFile(workbook, nomeArquivo);
    } catch (error) {
        console.error('Erro na exportação:', error);
        alert("Ocorreu um erro ao gerar o Excel. Tente novamente.");
    }
};

// ============================================================
// CONFIGURAÇÕES (TOAST FEEDBACK)
// ============================================================
function showToast(m) {
    const t = document.getElementById('toast');
    if(t) {
        t.textContent = m;
        t.style.display = 'block';
        setTimeout(() => t.style.display = 'none', 3000);
    }
}