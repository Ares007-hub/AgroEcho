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

    const devices = [
        { name:'Umidade Solo', id:'ESP32-SOIL-001', status:'active', reading:'869', unit:'kPa', battery:87, icon:'', location:'Setor Norte', lastUpdate:'2 min atrás' },
        { name:'Pluviômetro', id:'ESP32-RAIN-002', status:'active', reading:'2.5', unit:'mm', battery:92, icon:'', location:'Setor Central', lastUpdate:'5 min atrás' },
        { name:'Sensor de Fluxo', id:'ESP32-FLOW-003', status:'active', reading:'12.3', unit:'L/min', battery:95, icon:'', location:'Bomba Principal', lastUpdate:'1 min atrás' },
        { name:'Temperatura', id:'ESP32-TEMP-004', status:'inactive', reading:'28.5', unit:'°C', battery:12, icon:'', location:'Estufa 1', lastUpdate:'3 horas atrás' },
        { name:'Radiação Solar', id:'ESP32-LUX-005', status:'active', reading:'624', unit:'lux', battery:88, icon:'', location:'Área Central', lastUpdate:'10 min atrás' }
    ];

    function renderPainel() {
        const activeCount = devices.filter(d => d.status === 'active').length;
        const avgBattery = Math.round(devices.reduce((acc, d) => acc + d.battery, 0) / devices.length);
        document.getElementById('painel-content').innerHTML = `
            <div class="stats-grid">
                <div class="stat-card"><div><small style="color:var(--text-sub)">Total de Dispositivos</small><h3>${devices.length}</h3></div></div>
                <div class="stat-card"><div><small style="color:var(--text-sub)">Ativos</small><h3>${activeCount}</h3></div></div>
                <div class="stat-card"><div><small style="color:var(--text-sub)">Bateria Média</small><h3>${avgBattery}%</h3></div></div>
                <div class="stat-card"><div><small style="color:var(--text-sub)">Alertas</small><h3>${devices.filter(d => d.battery < 20).length}</h3></div></div>
            </div>
            <div class="devices-grid">
                ${devices.map(d => {
                    const batteryColor = d.battery < 20 ? '#ef4444' : d.battery < 50 ? '#f59e0b' : '#10b981';
                    return `<div class="sensor-card">
                        <div style="display:flex; justify-content:space-between; align-items:start;">
                            <div><h4 style="color:var(--text-sub); font-size:0.9rem;">${d.name}</h4><small style="font-family:monospace; color:var(--text-sub);">${d.id}</small></div>
                            <span style="font-size:28px;">${d.icon}</span>
                        </div>
                        <div class="sensor-value">${d.reading} <small style="font-size:14px; color:var(--text-sub);">${d.unit}</small></div>
                        <div style="display:flex; justify-content:space-between; align-items:center; margin-top:15px; padding-top:15px; border-top:1px solid var(--border);">
                            <span style="font-size:12px; color:${batteryColor};">🔋 ${d.battery}%</span>
                            <span style="font-size:12px; color:var(--text-sub);">📍 ${d.location}</span>
                            <span class="badge ${d.status==='active'?'badge-active':'badge-inactive'}">${d.status==='active'?'● Ativo':'● Inativo'}</span>
                        </div>
                        <div style="margin-top:8px; font-size:11px; color:var(--text-sub); text-align:right;">Atualizado: ${d.lastUpdate}</div>
                    </div>`;
                }).join('')}
            </div>`;
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

    renderPainel();
}

// ============================================================
// RELATORIOS.HTML
// ============================================================
if (document.getElementById('relatorios-content')) {
    const user = JSON.parse(sessionStorage.getItem('agroecho_user')) || {name: "Usuário", role: "user", id: "1"};
    document.getElementById('welcomeText').innerText = 'Olá, ' + user.name;
    document.getElementById('userName').innerText = user.name;
    if (user.role === 'admin') document.getElementById('adminBtn').style.display = 'block';

    const devices = [
        { name:'Umidade Solo', id:'ESP32-SOIL-001', status:'active', reading:'869', unit:'kPa', battery:87, icon:'', location:'Setor Norte', lastUpdate:'2 min atrás' },
        { name:'Pluviômetro', id:'ESP32-RAIN-002', status:'active', reading:'2.5', unit:'mm', battery:92, icon:'', location:'Setor Central', lastUpdate:'5 min atrás' },
        { name:'Sensor de Fluxo', id:'ESP32-FLOW-003', status:'active', reading:'12.3', unit:'L/min', battery:95, icon:'', location:'Bomba Principal', lastUpdate:'1 min atrás' },
        { name:'Temperatura', id:'ESP32-TEMP-004', status:'inactive', reading:'28.5', unit:'°C', battery:12, icon:'', location:'Estufa 1', lastUpdate:'3 horas atrás' },
        { name:'Radiação Solar', id:'ESP32-LUX-005', status:'active', reading:'624', unit:'lux', battery:88, icon:'', location:'Área Central', lastUpdate:'10 min atrás' }
    ];

    const reports = [
        { date:'06/05/2026 14:30', sensor:'Umidade Solo', reading:'869 kPa', status:'active', statusLabel:'Normal' },
        { date:'06/05/2026 14:25', sensor:'Pluviômetro', reading:'2.5 mm', status:'active', statusLabel:'Normal' },
        { date:'06/05/2026 14:20', sensor:'Sensor de Fluxo', reading:'12.3 L/min', status:'active', statusLabel:'Normal' },
        { date:'06/05/2026 12:00', sensor:'Temperatura', reading:'28.5 °C', status:'inactive', statusLabel:'Alerta - Bateria Baixa' },
        { date:'05/05/2026 18:45', sensor:'Umidade Solo', reading:'845 kPa', status:'active', statusLabel:'Normal' },
        { date:'05/05/2026 18:30', sensor:'Pluviômetro', reading:'1.2 mm', status:'active', statusLabel:'Normal' },
        { date:'05/05/2026 10:15', sensor:'Radiação Solar', reading:'580 lux', status:'active', statusLabel:'Normal' },
        { date:'04/05/2026 22:00', sensor:'Temperatura', reading:'26.1 °C', status:'active', statusLabel:'Normal' }
    ];

    function renderRelatorios() {
        document.getElementById('relatorios-content').innerHTML = `
            <div class="pdf-container" id="pdfContent">
                <div class="pdf-header">
                    <h2 style="color:var(--primary);"> Relatório de Monitoramento</h2>
                    <p style="color:var(--text-sub);">Gerado em: ${new Date().toLocaleDateString('pt-BR')} às ${new Date().toLocaleTimeString('pt-BR')}</p>
                    <p style="color:var(--text-sub);">Usuário: ${user.name}</p>
                </div>
                <div style="display:grid; grid-template-columns:repeat(3,1fr); gap:15px; margin-bottom:20px;">
                    <div style="background:var(--bg); padding:15px; border-radius:10px; text-align:center;">
                        <div style="font-size:24px; font-weight:700; color:var(--primary);">${devices.length}</div>
                        <div style="font-size:12px; color:var(--text-sub);">Total de Sensores</div>
                    </div>
                    <div style="background:var(--bg); padding:15px; border-radius:10px; text-align:center;">
                        <div style="font-size:24px; font-weight:700; color:#10b981;">${devices.filter(d=>d.status==='active').length}</div>
                        <div style="font-size:12px; color:var(--text-sub);">Sensores Ativos</div>
                    </div>
                    <div style="background:var(--bg); padding:15px; border-radius:10px; text-align:center;">
                        <div style="font-size:24px; font-weight:700; color:#ef4444;">${devices.filter(d=>d.status==='inactive').length}</div>
                        <div style="font-size:12px; color:var(--text-sub);">Sensores Inativos</div>
                    </div>
                </div>
                <h3 style="margin-bottom:10px;"> Histórico de Leituras</h3>
                <table>
                    <thead><tr><th>Data/Hora</th><th>Sensor</th><th>Leitura</th><th>Status</th></tr></thead>
                    <tbody>${reports.map(r => `<tr><td>${r.date}</td><td>${r.sensor}</td><td><strong>${r.reading}</strong></td><td><span class="badge ${r.status==='active'?'badge-active':'badge-inactive'}">${r.statusLabel}</span></td></tr>`).join('')}</tbody>
                </table>
                <h3 style="margin-top:25px; margin-bottom:10px;">📡 Dispositivos</h3>
                <table>
                    <thead><tr><th>ID</th><th>Nome</th><th>Localização</th><th>Bateria</th><th>Status</th></tr></thead>
                    <tbody>${devices.map(d => `<tr><td style="font-family:monospace;">${d.id}</td><td>${d.icon} ${d.name}</td><td>${d.location}</td><td>${d.battery}%</td><td><span class="badge ${d.status==='active'?'badge-active':'badge-inactive'}">${d.status==='active'?'Ativo':'Inativo'}</span></td></tr>`).join('')}</tbody>
                </table>
            </div>
            <div style="display:flex; gap:10px; margin-top:20px; flex-wrap:wrap;">
                <button class="btn btn-primary" onclick="exportToExcel()" id="excelBtn" style="display:flex; align-items:center; gap:8px; background:#217346;"> Exportar Excel</button>
                <button class="btn btn-primary" onclick="exportToPDF()" id="exportBtn" style="display:flex; align-items:center; gap:8px;"> Exportar PDF</button>
                <button class="btn" style="background:var(--bg); border:1px solid var(--border);" onclick="printReport()"> Imprimir</button>
            </div>`;
    }

    // Exportar Excel (completo)
    window.exportToExcel = function() {
        const btn = document.getElementById('excelBtn');
        btn.disabled = true;
        btn.innerHTML = '<span class="loading-spinner"></span> Gerando Excel...';
        try {
            const wb = XLSX.utils.book_new();
            const borderStyle = {
                top: { style: 'thin', color: { rgb: '059669' } },
                bottom: { style: 'thin', color: { rgb: '059669' } },
                left: { style: 'thin', color: { rgb: '059669' } },
                right: { style: 'thin', color: { rgb: '059669' } }
            };
            const headerStyle = {
                font: { bold: true, sz: 11, color: { rgb: 'FFFFFF' }, name: 'Calibri' },
                fill: { fgColor: { rgb: '059669' } },
                alignment: { horizontal: 'center', vertical: 'center', wrapText: true },
                border: {
                    top: { style: 'medium', color: { rgb: '047857' } },
                    bottom: { style: 'medium', color: { rgb: '047857' } },
                    left: { style: 'medium', color: { rgb: '047857' } },
                    right: { style: 'medium', color: { rgb: '047857' } }
                }
            };

            // Capa
            const capaData = [
                [''], [''], ['RELATÓRIO DE MONITORAMENTO'], ['AGROECHO - IRRIGAÇÃO INTELIGENTE'], [''],
                ['Data:', new Date().toLocaleDateString('pt-BR', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })],
                ['Hora:', new Date().toLocaleTimeString('pt-BR')], ['Usuário:', user.name],
                ['Acesso:', user.role === 'admin' ? 'Administrador' : 'Usuário'], [''],
                ['RESUMO DO SISTEMA'], [''],
                ['Total de Dispositivos:', devices.length],
                ['Dispositivos Ativos:', devices.filter(d => d.status === 'active').length + ' (' + Math.round(devices.filter(d => d.status === 'active').length / devices.length * 100) + '%)'],
                ['Dispositivos Inativos:', devices.filter(d => d.status === 'inactive').length + ' (' + Math.round(devices.filter(d => d.status === 'inactive').length / devices.length * 100) + '%)'],
                ['Bateria Média:', Math.round(devices.reduce((acc, d) => acc + d.battery, 0) / devices.length) + '%'],
                ['Bateria Crítica (<20%):', devices.filter(d => d.battery < 20).length], [''],
                ['Registros no Histórico:', reports.length],
                ['Período:', reports[reports.length - 1].date + ' até ' + reports[0].date],
                ['Alertas:', reports.filter(r => r.status === 'inactive').length]
            ];
            const wsCapa = XLSX.utils.aoa_to_sheet(capaData);
            wsCapa['!cols'] = [{ wch: 45 }, { wch: 45 }];
            wsCapa['!merges'] = [
                { s: { r: 2, c: 0 }, e: { r: 2, c: 1 } },
                { s: { r: 3, c: 0 }, e: { r: 3, c: 1 } },
                { s: { r: 10, c: 0 }, e: { r: 10, c: 1 } }
            ];
            const titleCell = XLSX.utils.encode_cell({ r: 2, c: 0 });
            if (wsCapa[titleCell]) wsCapa[titleCell].s = {
                font: { bold: true, sz: 22, color: { rgb: '059669' }, name: 'Calibri' },
                alignment: { horizontal: 'center', vertical: 'center' },
                fill: { fgColor: { rgb: 'D1FAE5' } },
                border: { top: { style: 'medium', color: { rgb: '059669' } }, bottom: { style: 'medium', color: { rgb: '059669' } }, left: { style: 'medium', color: { rgb: '059669' } }, right: { style: 'medium', color: { rgb: '059669' } } }
            };
            const resumoCell = XLSX.utils.encode_cell({ r: 10, c: 0 });
            if (wsCapa[resumoCell]) wsCapa[resumoCell].s = {
                font: { bold: true, sz: 14, color: { rgb: 'FFFFFF' }, name: 'Calibri' },
                fill: { fgColor: { rgb: '059669' } },
                alignment: { horizontal: 'center', vertical: 'center' },
                border: { top: { style: 'medium', color: { rgb: '047857' } }, bottom: { style: 'medium', color: { rgb: '047857' } }, left: { style: 'medium', color: { rgb: '047857' } }, right: { style: 'medium', color: { rgb: '047857' } } }
            };
            for (let r = 5; r <= 8; r++) {
                for (let c = 0; c < 2; c++) {
                    const cellRef = XLSX.utils.encode_cell({ r: r, c: c });
                    if (wsCapa[cellRef] && !wsCapa[cellRef].s) wsCapa[cellRef].s = { border: borderStyle };
                }
            }
            XLSX.utils.book_append_sheet(wb, wsCapa, ' Capa');

            // Histórico de Leituras
            const leiturasData = [['DATA/HORA', 'SENSOR', 'ID DISPOSITIVO', 'LEITURA', 'VALOR', 'UNIDADE', 'STATUS', 'OBSERVAÇÃO']];
            reports.forEach(r => {
                const device = devices.find(d => r.sensor.includes(d.name.split(' ')[0])) || devices[0];
                const numericValue = parseFloat(r.reading.replace(/[^0-9.]/g, ''));
                const unit = r.reading.replace(/[0-9.\s]/g, '').trim();
                leiturasData.push([r.date, r.sensor, device ? device.id : 'N/A', r.reading, numericValue || 0, unit || '-', r.statusLabel, r.status === 'inactive' ? '⚠️ Requer atenção' : '✅ Normal']);
            });
            const wsLeituras = XLSX.utils.aoa_to_sheet(leiturasData);
            wsLeituras['!cols'] = [{ wch: 22 }, { wch: 25 }, { wch: 20 }, { wch: 15 }, { wch: 12 }, { wch: 10 }, { wch: 22 }, { wch: 25 }];
            for (let i = 0; i < 8; i++) {
                const cellRef = XLSX.utils.encode_cell({ r: 0, c: i });
                if (wsLeituras[cellRef]) wsLeituras[cellRef].s = headerStyle;
            }
            for (let r = 1; r < leiturasData.length; r++) {
                const isAlert = leiturasData[r][7].includes('⚠️');
                for (let c = 0; c < 8; c++) {
                    const cellRef = XLSX.utils.encode_cell({ r: r, c: c });
                    if (wsLeituras[cellRef]) wsLeituras[cellRef].s = {
                        font: { sz: 10, name: 'Calibri', bold: isAlert, color: isAlert ? { rgb: '991B1B' } : { rgb: '1F2937' } },
                        fill: { fgColor: { rgb: isAlert ? 'FEE2E2' : r % 2 === 0 ? 'F0FDF4' : 'FFFFFF' } },
                        border: borderStyle,
                        alignment: { vertical: 'center' }
                    };
                }
            }
            XLSX.utils.book_append_sheet(wb, wsLeituras, ' Histórico');

            // Dispositivos
            const dispositivosData = [['ID', 'NOME', 'TIPO', 'LOCALIZAÇÃO', 'BATERIA', 'NÍVEL', 'ÚLTIMA LEITURA', 'ATUALIZAÇÃO', 'STATUS']];
            devices.forEach(d => {
                const nivel = d.battery > 70 ? 'Alto' : d.battery > 40 ? 'Médio' : d.battery > 20 ? 'Baixo' : 'Crítico';
                dispositivosData.push([d.id, d.name, d.unit, d.location, d.battery + '%', nivel, d.reading + ' ' + d.unit, d.lastUpdate, d.status === 'active' ? 'ATIVO' : 'INATIVO']);
            });
            const wsDispositivos = XLSX.utils.aoa_to_sheet(dispositivosData);
            wsDispositivos['!cols'] = [{ wch: 20 }, { wch: 25 }, { wch: 10 }, { wch: 20 }, { wch: 10 }, { wch: 14 }, { wch: 15 }, { wch: 18 }, { wch: 10 }];
            for (let i = 0; i < 9; i++) {
                const cellRef = XLSX.utils.encode_cell({ r: 0, c: i });
                if (wsDispositivos[cellRef]) wsDispositivos[cellRef].s = headerStyle;
            }
            for (let r = 1; r < dispositivosData.length; r++) {
                const isInactive = dispositivosData[r][8] === 'INATIVO';
                for (let c = 0; c < 9; c++) {
                    const cellRef = XLSX.utils.encode_cell({ r: r, c: c });
                    if (wsDispositivos[cellRef]) wsDispositivos[cellRef].s = {
                        font: { sz: 10, name: 'Calibri', bold: isInactive, color: isInactive ? { rgb: '991B1B' } : { rgb: '1F2937' } },
                        fill: { fgColor: { rgb: isInactive ? 'FEE2E2' : r % 2 === 0 ? 'F0FDF4' : 'FFFFFF' } },
                        border: borderStyle,
                        alignment: { vertical: 'center' }
                    };
                }
            }
            XLSX.utils.book_append_sheet(wb, wsDispositivos, ' Dispositivos');

            // Bateria
            const bateriaData = [['DISPOSITIVO', 'BATERIA', 'NÍVEL', 'STATUS', 'RECOMENDAÇÃO']];
            devices.forEach(d => {
                const nivel = d.battery > 70 ? 'Alto' : d.battery > 40 ? 'Médio' : d.battery > 20 ? 'Baixo' : 'Crítico';
                const recomendacao = d.battery > 70 ? ' OK - Nenhuma ação necessária' : d.battery > 40 ? ' Monitorar - Verificar em 7 dias' : d.battery > 20 ? ' Atenção - Recarregar em 3 dias' : ' URGENTE - Recarregar imediatamente';
                bateriaData.push([d.name, d.battery + '%', nivel, d.status === 'active' ? 'Ativo' : 'Inativo', recomendacao]);
            });
            const wsBateria = XLSX.utils.aoa_to_sheet(bateriaData);
            wsBateria['!cols'] = [{ wch: 25 }, { wch: 10 }, { wch: 10 }, { wch: 10 }, { wch: 45 }];
            for (let i = 0; i < 5; i++) {
                const cellRef = XLSX.utils.encode_cell({ r: 0, c: i });
                if (wsBateria[cellRef]) wsBateria[cellRef].s = headerStyle;
            }
            for (let r = 1; r < bateriaData.length; r++) {
                for (let c = 0; c < 5; c++) {
                    const cellRef = XLSX.utils.encode_cell({ r: r, c: c });
                    if (wsBateria[cellRef]) wsBateria[cellRef].s = {
                        font: { sz: 10, name: 'Calibri' },
                        fill: { fgColor: { rgb: r % 2 === 0 ? 'F0FDF4' : 'FFFFFF' } },
                        border: borderStyle,
                        alignment: { vertical: 'center', wrapText: true }
                    };
                }
            }
            XLSX.utils.book_append_sheet(wb, wsBateria, ' Bateria');

            // Estatísticas
            const estatisticasData = [
                ['ESTATÍSTICAS DO SISTEMA'], [''],
                ['Métrica', 'Valor', 'Percentual'],
                ['Total de Dispositivos', devices.length, '100%'],
                ['Dispositivos Ativos', devices.filter(d => d.status === 'active').length, Math.round(devices.filter(d => d.status === 'active').length / devices.length * 100) + '%'],
                ['Dispositivos Inativos', devices.filter(d => d.status === 'inactive').length, Math.round(devices.filter(d => d.status === 'inactive').length / devices.length * 100) + '%'],
                ['Bateria Média', Math.round(devices.reduce((acc, d) => acc + d.battery, 0) / devices.length) + '%', '-'],
                ['Bateria Máxima', Math.max(...devices.map(d => d.battery)) + '%', '-'],
                ['Bateria Mínima', Math.min(...devices.map(d => d.battery)) + '%', '-'],
                [''], ['Total de Leituras', reports.length, '-'],
                ['Leituras Normais', reports.filter(r => r.status === 'active').length, Math.round(reports.filter(r => r.status === 'active').length / reports.length * 100) + '%'],
                ['Leituras com Alerta', reports.filter(r => r.status === 'inactive').length, Math.round(reports.filter(r => r.status === 'inactive').length / reports.length * 100) + '%'],
                [''], ['Período:', reports[reports.length - 1].date + ' a ' + reports[0].date, '-']
            ];
            const wsEstatisticas = XLSX.utils.aoa_to_sheet(estatisticasData);
            wsEstatisticas['!cols'] = [{ wch: 35 }, { wch: 25 }, { wch: 15 }];
            wsEstatisticas['!merges'] = [{ s: { r: 0, c: 0 }, e: { r: 0, c: 2 } }];
            const statTitle = XLSX.utils.encode_cell({ r: 0, c: 0 });
            if (wsEstatisticas[statTitle]) wsEstatisticas[statTitle].s = {
                font: { bold: true, sz: 14, color: { rgb: 'FFFFFF' }, name: 'Calibri' },
                fill: { fgColor: { rgb: '059669' } },
                alignment: { horizontal: 'center', vertical: 'center' },
                border: { top: { style: 'medium', color: { rgb: '047857' } }, bottom: { style: 'medium', color: { rgb: '047857' } }, left: { style: 'medium', color: { rgb: '047857' } }, right: { style: 'medium', color: { rgb: '047857' } } }
            };
            for (let i = 0; i < 3; i++) {
                const cellRef = XLSX.utils.encode_cell({ r: 2, c: i });
                if (wsEstatisticas[cellRef]) wsEstatisticas[cellRef].s = headerStyle;
            }
            for (let r = 3; r < estatisticasData.length; r++) {
                for (let c = 0; c < 3; c++) {
                    const cellRef = XLSX.utils.encode_cell({ r: r, c: c });
                    if (wsEstatisticas[cellRef] && estatisticasData[r][c] !== '' && estatisticasData[r][c] !== '-') {
                        wsEstatisticas[cellRef].s = {
                            font: { sz: 10, name: 'Calibri' },
                            fill: { fgColor: { rgb: r % 2 === 0 ? 'F0FDF4' : 'FFFFFF' } },
                            border: borderStyle,
                            alignment: { vertical: 'center' }
                        };
                    }
                }
            }
            XLSX.utils.book_append_sheet(wb, wsEstatisticas, ' Estatísticas');

            XLSX.writeFile(wb, 'Relatorio_AgroEcho_' + new Date().toISOString().split('T')[0] + '.xlsx');
            btn.disabled = false;
            btn.innerHTML = 'Exportar Excel';
            showToast('Excel exportado com bordas!');
        } catch (error) {
            console.error('Erro:', error);
            btn.disabled = false;
            btn.innerHTML = 'Exportar Excel';
            showToast(' Erro. Tente novamente.');
        }
    };

    // Exportar PDF (completo)
    window.exportToPDF = function() {
        const element = document.getElementById('pdfContent');
        const btn = document.getElementById('exportBtn');
        btn.disabled = true;
        btn.innerHTML = '<span class="loading-spinner"></span> Gerando PDF...';
        const opt = {
            margin: [8, 8, 8, 8],
            filename: 'Relatorio_AgroEcho_' + new Date().toISOString().split('T')[0] + '.pdf',
            image: { type: 'jpeg', quality: 1.0 },
            html2canvas: { scale: 2, useCORS: true, letterRendering: true, logging: false, backgroundColor: '#ffffff' },
            jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' },
            pagebreak: { mode: ['avoid-all', 'css', 'legacy'] }
        };
        html2pdf().set(opt).from(element).save().then(() => {
            btn.disabled = false;
            btn.innerHTML = 'Exportar PDF';
            showToast('PDF exportado!');
        }).catch(() => {
            btn.disabled = false;
            btn.innerHTML = 'Exportar PDF';
            showToast('Erro ao gerar PDF.');
        });
    };

    // Imprimir (completo)
    window.printReport = function() {
        const printContent = document.getElementById('pdfContent').innerHTML;
        const printWindow = window.open('', '_blank', 'width=900,height=700');
        printWindow.document.write(`<!DOCTYPE html><html><head><title>Relatório AgroEcho</title><style>body{font-family:Inter,sans-serif;padding:20px}table{width:100%;border-collapse:collapse}th{background:#059669;color:white;padding:8px}td{padding:8px;border:1px solid #bdf3c7}@media print{body{-webkit-print-color-adjust:exact;print-color-adjust:exact}}</style></head><body>${printContent}</body></html>`);
        printWindow.document.close();
        printWindow.focus();
        setTimeout(() => { printWindow.print(); printWindow.close(); }, 500);
        showToast('Impressão enviada!');
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

    renderRelatorios();
}

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