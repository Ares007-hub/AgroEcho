/* ============================================================
   AGROECHO – JAVASCRIPT UNIFICADO (TODAS AS PÁGINAS)
   ============================================================ */

// ----- TEMA GLOBAL -----
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

// ----- SIDEBAR MOBILE -----
function toggleSidebar() {
    const sidebar = document.getElementById('sidebar');
    const overlay = document.getElementById('sidebarOverlay');
    const hamburger = document.getElementById('hamburgerBtn');
    if (!sidebar || !overlay || !hamburger) return;
    sidebar.classList.toggle('open');
    overlay.classList.toggle('active');
    hamburger.innerHTML = sidebar.classList.contains('open') ? '✕' : '☰';
}

// ----- LOGOUT -----
function logout() {
    sessionStorage.removeItem('agroecho_user');
    window.location.href = '/';
}

// ----- BANCO DE USUÁRIOS (localStorage) -----
let users = JSON.parse(localStorage.getItem('agroecho_all_users')) || [];
if (users.length === 0) {
    users = [
        { id: 1, name: 'Administrador', email: 'admin@agroecho.com.br', password: 'admin123', role: 'admin', phone: '(11) 99999-9999', createdAt: '2024-01-15', permanent: true },
        { id: 2, name: 'João Silva', email: 'joao@email.com', password: 'joao123', role: 'user', phone: '(11) 98888-8888', createdAt: '2024-02-20', permanent: false }
    ];
    saveUsers(users);
}
function getUsers() {
    let users = localStorage.getItem('agroecho_all_users');
    return users ? JSON.parse(users) : [];
}
function saveUsers(users) {
    localStorage.setItem('agroecho_all_users', JSON.stringify(users));
}

// Garantir admin padrão
(function() {
    const users = getUsers();
    if (!users.find(u => u.email === 'admin@agroecho.com.br')) {
        users.push({
            id: 1, name: 'Administrador', email: 'admin@agroecho.com.br',
            password: 'Admin@123', role: 'admin', phone: '(11) 99999-9999',
            createdAt: '2024-01-15', permanent: true
        });
        saveUsers(users);
    }
})();

// ----- AUTENTICAÇÃO (dashboard, admin) -----
function checkAuth(requiredRole) {
    const user = JSON.parse(sessionStorage.getItem('agroecho_user'));
    if (!user) {
        alert('Faça login novamente');
        window.location.href = '/';
        return null;
    }
    if (requiredRole && user.role !== requiredRole) {
        alert('Acesso negado');
        window.location.href = user.role === 'admin' ? '/home' : '/admin';
        return null;
    }
    return user;
}

// ============================================================
// INDEX.HTML
// ============================================================
if (document.getElementById('loginForm')) {
    function togglePass(inputId, btn) {
        const input = document.getElementById(inputId);
        const icon = btn.querySelector('i');
        if (input.type === 'password') {
            input.type = 'text';
            icon.className = 'fas fa-eye-slash';
        } else {
            input.type = 'password';
            icon.className = 'fas fa-eye';
        }
    }

    function switchTab(tab) {
        const isLogin = tab === 'login';
        document.querySelectorAll('.tab-btn').forEach((btn, i) => {
            btn.classList.toggle('active', isLogin ? i === 0 : i === 1);
        });
        document.getElementById('tab-login').classList.toggle('active', isLogin);
        document.getElementById('tab-register').classList.toggle('active', !isLogin);
        document.querySelectorAll('.alert-msg').forEach(m => m.style.display = 'none');
        document.querySelector('.tab-scroll').scrollTop = 0;
    }

    const phoneInput = document.getElementById('regPhone');
    phoneInput.addEventListener('input', function() {
        let val = this.value.replace(/\D/g, '');
        if (val.length > 0) val = val.replace(/^(\d{2})(\d)/, '($1) $2');
        if (val.length > 10) val = val.replace(/(\d{5})(\d)/, '$1-$2');
        this.value = val;
    });

    const emailInput = document.getElementById('regEmail');
    const emailHint = document.getElementById('emailHint');
    function validEmail(e) { return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(e); }
    emailInput.addEventListener('input', function() {
        const val = this.value.trim();
        if (!val) { emailHint.textContent = ''; this.classList.remove('valid','invalid'); return; }
        if (validEmail(val)) {
            emailHint.textContent = 'Email válido';
            emailHint.className = 'field-hint ok';
            this.classList.add('valid'); this.classList.remove('invalid');
        } else {
            emailHint.textContent = 'Formato inválido';
            emailHint.className = 'field-hint err';
            this.classList.add('invalid'); this.classList.remove('valid');
        }
    });

    const pwdInput = document.getElementById('regPassword');
    const strengthFill = document.getElementById('strengthFill');
    const strengthLabel = document.getElementById('strengthLabel');
    const reqs = {
        length: document.getElementById('req-length'),
        upper: document.getElementById('req-upper'),
        special: document.getElementById('req-special'),
        number: document.getElementById('req-number')
    };
    function checkPwd(pwd) {
        const checks = {
            length: pwd.length >= 6,
            upper: /[A-Z]/.test(pwd),
            special: /[!@#$%^&*(),.?":{}|<>]/.test(pwd),
            number: /[0-9]/.test(pwd)
        };
        let score = Object.values(checks).filter(Boolean).length;
        if (pwd.length >= 10) score++;
        return { checks, score };
    }
    pwdInput.addEventListener('input', function() {
        const pwd = this.value;
        if (!pwd) {
            strengthFill.setAttribute('data-level', '');
            strengthLabel.setAttribute('data-level', '');
            strengthLabel.textContent = '';
            Object.values(reqs).forEach(r => r.className = '');
            return;
        }
        const { checks, score } = checkPwd(pwd);
        reqs.length.className = checks.length ? 'met' : '';
        reqs.upper.className = checks.upper ? 'met' : '';
        reqs.special.className = checks.special ? 'met' : '';
        reqs.number.className = checks.number ? 'met' : '';
        let level = score <= 1 ? 'weak' : score <= 2 ? 'fair' : score <= 3 ? 'good' : 'strong';
        strengthFill.setAttribute('data-level', level);
        strengthLabel.setAttribute('data-level', level);
        strengthLabel.textContent = { weak: 'Fraca', fair: 'Razoável', good: 'Boa', strong: 'Forte' }[level];
    });

    const confirmInput = document.getElementById('regConfirm');
    const matchHint = document.getElementById('matchHint');
    confirmInput.addEventListener('input', function() {
        const val = this.value;
        if (!val) { matchHint.textContent = ''; this.classList.remove('valid','invalid'); return; }
        if (val === pwdInput.value) {
            matchHint.textContent = 'Senhas conferem';
            matchHint.className = 'field-hint ok';
            this.classList.add('valid'); this.classList.remove('invalid');
        } else {
            matchHint.textContent = 'Senhas não conferem';
            matchHint.className = 'field-hint err';
            this.classList.add('invalid'); this.classList.remove('valid');
        }
    });

    // Login
    document.getElementById('loginForm').addEventListener('submit', function(e) {
        e.preventDefault();
        const email = document.getElementById('loginEmail').value.trim();
        const pwd = document.getElementById('loginPassword').value;
        const msg = document.getElementById('loginMsg');
        const users = getUsers();
        const user = users.find(u => u.email === email && u.password === pwd);
        if (user) {
            sessionStorage.setItem('agroecho_user', JSON.stringify(user));
            msg.className = 'alert-msg success';
            msg.style.display = 'block';
            msg.textContent = 'Login efetuado. Redirecionando...';
            setTimeout(() => {
                window.location.href = user.role === 'admin' ? '/admin' : '/home';
            }, 800);
        } else {
            msg.className = 'alert-msg error';
            msg.style.display = 'block';
            msg.textContent = 'Email ou senha incorretos.';
        }
    });

    // Register
    document.getElementById('registerForm').addEventListener('submit', function(e) {
        e.preventDefault();
        const name = document.getElementById('regName').value.trim();
        const email = emailInput.value.trim();
        const phone = phoneInput.value.trim();
        const pwd = pwdInput.value;
        const confirm = confirmInput.value;
        const msg = document.getElementById('registerMsg');

        if (!validEmail(email)) {
            msg.className = 'alert-msg error'; msg.style.display = 'block';
            msg.textContent = 'Insira um email válido.'; return;
        }
        const { checks } = checkPwd(pwd);
        if (!Object.values(checks).every(Boolean)) {
            msg.className = 'alert-msg error'; msg.style.display = 'block';
            msg.textContent = 'A senha não atende aos requisitos.'; return;
        }
        if (pwd !== confirm) {
            msg.className = 'alert-msg error'; msg.style.display = 'block';
            msg.textContent = 'As senhas não conferem.'; return;
        }

        const users = getUsers();
        if (users.some(u => u.email === email)) {
            msg.className = 'alert-msg error'; msg.style.display = 'block';
            msg.textContent = 'Este email já está cadastrado.'; return;
        }

        users.push({ id: Date.now(), name, email, password: pwd, phone: phone || '-', role: 'user', createdAt: new Date().toISOString().split('T')[0] });
        saveUsers(users);

        msg.className = 'alert-msg success'; msg.style.display = 'block';
        msg.textContent = 'Conta criada com sucesso!';
        document.getElementById('registerForm').reset();
        strengthFill.setAttribute('data-level', '');
        strengthLabel.setAttribute('data-level', '');
        strengthLabel.textContent = '';
        Object.values(reqs).forEach(r => r.className = '');
        emailHint.textContent = '';
        matchHint.textContent = '';
        emailInput.classList.remove('valid','invalid');
        confirmInput.classList.remove('valid','invalid');
        setTimeout(() => switchTab('login'), 1500);
    });
}

// ============================================================
// DASHBOARD.HTML
// ============================================================
if (document.getElementById('statsRow')) {
    const user = JSON.parse(sessionStorage.getItem('agroecho_user'));
    if (!user) {
        alert('Faça login novamente');
        window.location.href = '/';
    }
    if (user.role !== 'admin') {
        alert('Acesso permitido apenas para administradores');
        window.location.href = '/home';
    }

    document.getElementById('sidebarUserName').textContent = user.name;

    const allDevices = [
        { id:'ESP32-SOIL-001', name:'Sensor Umidade Solo', type:'Sensor Capacitivo v1.2', owner:'João Silva', status:'active', battery:87, signal:'-85 dBm' },
        { id:'ESP32-RAIN-002', name:'Pluviômetro Central', type:'Pluviômetro de Báscula', owner:'Maria Souza', status:'active', battery:92, signal:'-78 dBm' },
        { id:'ESP32-FLOW-003', name:'Sensor de Fluxo', type:'YF-S201', owner:'Carlos Lima', status:'active', battery:95, signal:'-72 dBm' },
        { id:'ESP32-TEMP-004', name:'Sensor Temperatura', type:'DS18B20', owner:'Ana Paula', status:'inactive', battery:12, signal:'-95 dBm' },
        { id:'ESP32-LUX-005', name:'Sensor Radiação Solar', type:'BH1750', owner:'Maria Souza', status:'active', battery:88, signal:'-76 dBm' },
        { id:'ESP32-SOIL-006', name:'Sensor Umidade Horta', type:'Sensor Capacitivo v1.2', owner:'Carlos Lima', status:'maintenance', battery:45, signal:'-82 dBm' }
    ];

    function renderStats() {
        const active = allDevices.filter(d => d.status === 'active').length;
        const inactive = allDevices.filter(d => d.status === 'inactive').length;
        const avgBattery = Math.round(allDevices.reduce((acc, d) => acc + d.battery, 0) / allDevices.length);
        document.getElementById('statsRow').innerHTML = 
            '<div class="stat-card"><div class="stat-number">' + allDevices.length + '</div><div class="stat-label">Total de Dispositivos</div></div>' +
            '<div class="stat-card"><div class="stat-number">' + active + '</div><div class="stat-label">Dispositivos Ativos</div></div>' +
            '<div class="stat-card"><div class="stat-number">' + avgBattery + '%</div><div class="stat-label">Bateria Média</div></div>' +
            '<div class="stat-card"><div class="stat-number">' + inactive + '</div><div class="stat-label">Dispositivos Inativos</div></div>';
    }

    function renderTable() {
        document.getElementById('devicesTable').innerHTML = allDevices.map(device => {
            const statusLabel = device.status === 'active' ? 'Ativo' : device.status === 'inactive' ? 'Inativo' : 'Manutenção';
            const batteryClass = device.battery > 50 ? 'battery-high' : device.battery > 20 ? 'battery-medium' : 'battery-low';
            return '<tr>' +
                '<td><strong>' + device.id + '</strong></td>' +
                '<td>' + device.name + '</td>' +
                '<td>' + device.type + '</td>' +
                '<td>' + device.owner + '</td>' +
                '<td><span class="status ' + device.status + '">' + statusLabel + '</span></td>' +
                '<td><span class="battery-bar"><span class="battery-fill ' + batteryClass + '" style="width:' + device.battery + '%"></span></span>' + device.battery + '%</td>' +
                '<td>' + device.signal + '</td>' +
            '</tr>';
        }).join('');
    }

    function initChart() {
        const active = allDevices.filter(d => d.status === 'active').length;
        const inactive = allDevices.filter(d => d.status === 'inactive').length;
        const maintenance = allDevices.filter(d => d.status === 'maintenance').length;
        const ctx = document.getElementById('statusChart').getContext('2d');
        new Chart(ctx, {
            type: 'bar',
            data: {
                labels: ['Ativos','Inativos','Manutenção'],
                datasets: [{ data: [active,inactive,maintenance], backgroundColor: ['#1b8f5a','#dc2626','#2d7ff9'], borderRadius: 10 }]
            },
            options: {
                responsive: true,
                plugins: { legend: { display: false } },
                scales: { y: { beginAtZero: true, ticks: { stepSize: 1 } } }
            }
        });
    }

    renderStats();
    renderTable();
    initChart();
}

// ============================================================
// ADMIN_CRIAR_USUARIO.HTML
// ============================================================
if (document.getElementById('usersTable')) {
    function checkAuth() {
        const user = JSON.parse(sessionStorage.getItem('agroecho_user'));
        if (!user) {
            alert('Faça login novamente');
            window.location.href = '/';
            return null;
        }
        if (user.role !== 'admin') {
            alert('Acesso negado');
            window.location.href = '/home';
            return null;
        }
        return user;
    }

    const user = checkAuth();
    if (!user) throw new Error('Auth failed');
    document.getElementById('sidebarUserName').textContent = user.name;



    function renderUsers() {
        const tbody = document.getElementById('usersTable');
        tbody.innerHTML = users.map(u => {
            const roleLabel = u.role === 'admin' ? 'Administrador' : 'Usuário';
            const roleClass = u.role === 'admin' ? 'role-admin' : 'role-user';
            const permBadge = u.permanent ? '<span class="permanent-badge">Fixo</span>' : '';
            const roleBadge = u.permanent ?
                '<span class="role-badge ' + roleClass + '">' + roleLabel + '</span>' :
                '<span class="role-badge ' + roleClass + '" style="cursor:pointer;" onclick="showRoleMenu(event, ' + u.id + ')" title="Clique para alterar o tipo">' + roleLabel + ' ▾</span>';
            const deleteBtn = !u.permanent ?
                '<button class="btn-edit-role" onclick="deleteUser(' + u.id + ')" style="background:#ffe2e2;color:#b42323;">Excluir</button>' :
                '<span style="color:#999;">Protegido</span>';
            return '<tr><td><strong>#' + u.id + '</strong></td><td>' + u.name + permBadge + '</td><td>' + u.email + '</td><td>' + roleBadge + '</td><td>' + (u.phone || '-') + '</td><td>' + u.createdAt + '</td><td>' + deleteBtn + '</td></tr>';
        }).join('');
    }

    window.showRoleMenu = function(event, userId) {
        event.stopPropagation();
        const targetUser = users.find(u => u.id === userId);
        if (!targetUser || targetUser.permanent) return;
        const existingMenu = document.getElementById('roleMenu');
        if (existingMenu) existingMenu.remove();
        const menu = document.createElement('div');
        menu.id = 'roleMenu';
        menu.style.cssText = 'position:fixed;background:white;border-radius:12px;box-shadow:0 10px 40px rgba(0,0,0,0.3);padding:8px;z-index:2000;min-width:180px;';
        menu.style.left = event.clientX + 'px';
        menu.style.top = event.clientY + 'px';
        const userOption = document.createElement('div');
        userOption.style.cssText = 'padding:12px 16px;cursor:pointer;border-radius:8px;display:flex;align-items:center;gap:10px;transition:0.2s;font-weight:500;color:#173524;';
        userOption.innerHTML = targetUser.role === 'user' ? 'Usuário Comum ' : 'Usuário Comum';
        if (targetUser.role === 'user') { userOption.style.background = '#dcebff'; userOption.style.color = '#2257a7'; }
        userOption.addEventListener('click', () => { changeUserRole(userId, 'user'); menu.remove(); });
        const adminOption = document.createElement('div');
        adminOption.style.cssText = 'padding:12px 16px;cursor:pointer;border-radius:8px;display:flex;align-items:center;gap:10px;transition:0.2s;font-weight:500;color:#173524;';
        adminOption.innerHTML = targetUser.role === 'admin' ? 'Administrador' : 'Administrador';
        if (targetUser.role === 'admin') { adminOption.style.background = '#ffe2e2'; adminOption.style.color = '#b42323'; }
        adminOption.addEventListener('click', () => { changeUserRole(userId, 'admin'); menu.remove(); });
        const separator = document.createElement('div');
        separator.style.cssText = 'height:1px;background:#e1e5e9;margin:4px 8px;';
        const cancelOption = document.createElement('div');
        cancelOption.style.cssText = 'padding:10px 16px;cursor:pointer;border-radius:8px;text-align:center;color:#999;font-size:0.85rem;';
        cancelOption.textContent = 'Cancelar';
        cancelOption.addEventListener('click', () => menu.remove());
        menu.appendChild(userOption);
        menu.appendChild(adminOption);
        menu.appendChild(separator);
        menu.appendChild(cancelOption);
        document.body.appendChild(menu);
        setTimeout(() => {
            document.addEventListener('click', function closeMenu() {
                if (document.getElementById('roleMenu')) document.getElementById('roleMenu').remove();
                document.removeEventListener('click', closeMenu);
            });
        }, 100);
    };

    window.changeUserRole = function(userId, newRole) {
        const targetUser = users.find(u => u.id === userId);
        if (!targetUser || targetUser.permanent || targetUser.role === newRole) return;
        const roleName = newRole === 'admin' ? 'Administrador' : 'Usuário Comum';
        targetUser.role = newRole;
        saveUsers(users);
        renderUsers();
        showMessage('success', '"' + targetUser.name + '" agora é ' + roleName + '!');
    };

    window.deleteUser = function(userId) {
        const targetUser = users.find(u => u.id === userId);
        if (!targetUser || targetUser.permanent) return;
        document.getElementById('modalTitle').textContent = 'Excluir Usuário';
        document.getElementById('modalMessage').textContent = 'Tem certeza que deseja excluir "' + targetUser.name + '"? Esta ação não pode ser desfeita.';
        document.getElementById('confirmModal').classList.add('active');
        window.pendingAction = () => {
            users = users.filter(u => u.id !== userId);
            saveUsers(users);
            renderUsers();
            showMessage('success', 'Usuário "' + targetUser.name + '" removido!');
            closeModal();
        };
    };

    window.confirmAction = function() {
        if (window.pendingAction) { window.pendingAction(); window.pendingAction = null; }
    };

    window.closeModal = function() {
        document.getElementById('confirmModal').classList.remove('active');
        window.pendingAction = null;
    };

    document.getElementById('confirmModal').addEventListener('click', function(e) {
        if (e.target === this) closeModal();
    });

    function showMessage(type, text) {
        const msg = document.getElementById('message');
        msg.className = 'message message-' + type;
        msg.textContent = text;
        msg.style.display = 'block';
        setTimeout(() => { msg.style.display = 'none'; }, 4000);
    }

    document.getElementById('createUserForm').addEventListener('submit', async function(e) {
        e.preventDefault();
        const btn = document.getElementById('submitBtn');
        btn.disabled = true;
        btn.textContent = 'Criando...';
        const newUser = {
            id: users.length > 0 ? Math.max(...users.map(u => u.id)) + 1 : 1,
            name: document.getElementById('name').value.trim(),
            email: document.getElementById('email').value.trim(),
            password: document.getElementById('password').value,
            phone: document.getElementById('phone').value.trim(),
            role: document.getElementById('role').value,
            createdAt: new Date().toISOString().split('T')[0],
            permanent: false
        };
        await new Promise(r => setTimeout(r, 700));
        if (users.some(u => u.email === newUser.email)) {
            showMessage('error', 'Este email já existe');
            btn.disabled = false;
            btn.textContent = 'Criar Usuário';
            return;
        }
        users.push(newUser);
        saveUsers(users);
        renderUsers();
        showMessage('success', 'Usuário "' + newUser.name + '" criado com sucesso!');
        document.getElementById('createUserForm').reset();
        btn.disabled = false;
        btn.textContent = 'Criar Usuário';
    });

    renderUsers();
}

// ============================================================
// USER_DISPOSITIVOS.HTML (Painel Geral)
// ============================================================
if (document.getElementById('painel-content')) {
    const user = JSON.parse(sessionStorage.getItem('agroecho_user')) || {name: "Usuário", role: "user", id: "1"};
    document.getElementById('welcomeText').innerText = 'Olá, ' + user.name;
    document.getElementById('userName').innerText = user.name;
    if (user.role === 'admin') document.getElementById('adminBtn').style.display = 'block';

    

    // Avatar
    const emojis = ['👤','👨‍🌾','👩‍🌾','🚜','🌱','💧','🔧','☀️','👑','🌽','🐄','🌻'];
    document.getElementById('emojiGrid').innerHTML = emojis.map(e => `<div class="emoji-item" onclick="selectAvatar('${e}')">${e}</div>`).join('');
    window.openModal = function() { document.getElementById('avatarModal').classList.add('active'); };
    window.closeModal = function() { document.getElementById('avatarModal').classList.remove('active'); };
    window.selectAvatar = function(e) {
        document.getElementById('avatar').innerText = e;
        localStorage.setItem('avatar_' + user.id, e);
        closeModal();
    };
    const savedAvatar = localStorage.getItem('avatar_' + user.id);
    if (savedAvatar) document.getElementById('avatar').innerText = savedAvatar;

    renderPainel();
}

// ============================================================
// RELATORIOS.HTML
// ============================================================
// Exporta a tabela exatamente do jeito que o Laravel montou (com as colunas filtradas)
window.exportarParaExcel = function() {
    try {
        // Pega a tabela de dados brutos pelo ID
        var tabela = document.getElementById("tabela-bruta");
        
        if (!tabela) {
            alert("Nenhuma tabela encontrada para exportar.");
            return;
        }

        // Converte o HTML para uma planilha
        var workbook = XLSX.utils.table_to_book(tabela, {sheet: "Dados Brutos"});
        
        // Gera um nome de arquivo identificando a data
        var dataHoje = new Date().toISOString().split('T')[0];
        var nomeArquivo = 'Relatorio_AgroEcho_' + dataHoje + '.xlsx';
        
        // Dispara o download
        XLSX.writeFile(workbook, nomeArquivo);

    } catch (error) {
        console.error('Erro na exportação:', error);
        alert("Ocorreu um erro ao gerar o Excel. Tente novamente.");
    }
};

// ============================================================
// CONFIG.HTML
// ============================================================
if (document.getElementById('config-content')) {
    const user = JSON.parse(sessionStorage.getItem('agroecho_user')) || {name: "Usuário", role: "user", id: "1"};
    document.getElementById('userName').innerText = user.name;
    if (user.role === 'admin') document.getElementById('adminBtn').style.display = 'block';

    // Layout original da configuração
    document.getElementById('config-content').innerHTML = `
        <div style="max-width:500px; background:var(--card); padding:25px; border-radius:20px; border:1px solid var(--border);">
            <h3 style="margin-bottom:20px;"> Configurações</h3>
            <div style="margin-bottom:15px;">
                <label style="display:block; margin-bottom:5px; font-size:14px; font-weight:600;">Nome da Fazenda</label>
                <input type="text" id="farmName" value="Fazenda Esperança" style="width:100%; padding:12px; border-radius:8px; border:1px solid var(--border); background:var(--bg); color:var(--text-main); font-size:14px;">
            </div>
            <div style="margin-bottom:15px;">
                <label style="display:block; margin-bottom:5px; font-size:14px; font-weight:600;">Email para Alertas</label>
                <input type="email" id="alertEmail" value="${user.email || 'admin@agroecho.com.br'}" style="width:100%; padding:12px; border-radius:8px; border:1px solid var(--border); background:var(--bg); color:var(--text-main); font-size:14px;">
            </div>
            <div style="margin-bottom:15px;">
                <label style="display:block; margin-bottom:5px; font-size:14px; font-weight:600;">Notificações</label>
                <select id="notifications" style="width:100%; padding:12px; border-radius:8px; border:1px solid var(--border); background:var(--bg); color:var(--text-main); font-size:14px;">
                    <option>Ativado (E-mail + Push)</option>
                    <option>Somente Alertas Críticos</option>
                    <option>Desativado</option>
                </select>
            </div>
            <div style="margin-bottom:20px;">
                <label style="display:block; margin-bottom:5px; font-size:14px; font-weight:600;">Intervalo de Leitura</label>
                <select id="readingInterval" style="width:100%; padding:12px; border-radius:8px; border:1px solid var(--border); background:var(--bg); color:var(--text-main); font-size:14px;">
                    <option>5 minutos</option>
                    <option>10 minutos</option>
                    <option>30 minutos</option>
                    <option>1 hora</option>
                </select>
            </div>
            <button class="btn btn-primary" onclick="saveConfig()" style="width:100%; padding:12px; font-size:16px;"> Salvar Configurações</button>
        </div>`;

    window.saveConfig = function() {
        const config = {
            farmName: document.getElementById('farmName').value,
            alertEmail: document.getElementById('alertEmail').value,
            notifications: document.getElementById('notifications').value,
            readingInterval: document.getElementById('readingInterval').value,
            savedAt: new Date().toISOString()
        };
        localStorage.setItem('agroecho_config', JSON.stringify(config));
        showToast('Configurações salvas com sucesso!');
    };

    function showToast(m) {
        const t = document.getElementById('toast');
        t.textContent = m;
        t.style.display = 'block';
        setTimeout(() => t.style.display = 'none', 3000);
    }

    // Avatar
    const emojis = ['👤','👨‍🌾','👩‍🌾','🚜','🌱','💧','🔧','☀️','👑','🌽','🐄','🌻'];
    document.getElementById('emojiGrid').innerHTML = emojis.map(e => `<div class="emoji-item" onclick="selectAvatar('${e}')">${e}</div>`).join('');
    window.openModal = function() { document.getElementById('avatarModal').classList.add('active'); };
    window.closeModal = function() { document.getElementById('avatarModal').classList.remove('active'); };
    window.selectAvatar = function(e) {
        document.getElementById('avatar').innerText = e;
        localStorage.setItem('avatar_' + user.id, e);
        closeModal();
    };
    const savedAvatar = localStorage.getItem('avatar_' + user.id);
    if (savedAvatar) document.getElementById('avatar').innerText = savedAvatar;
}