<!DOCTYPE html>
<html lang="pt-BR">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>ECHO – Painel Geral</title>
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;600;700&display=swap" rel="stylesheet">
    <link rel="stylesheet" href="/assets/css/style.css" />
</head>
<body class="user-page">

    <button class="hamburger" onclick="toggleSidebar()" id="hamburgerBtn">☰</button>
    <div class="sidebar-overlay" id="sidebarOverlay" onclick="toggleSidebar()"></div>

    <aside class="sidebar" id="sidebar">
        <div class="logo-area">
            <img src="/assets/img/Logo.png" alt="ECHO Logo" class="logo-img">
        </div>
        <nav>
            <a href="/user" class="nav-link active">Painel Geral</a>
            <a href="/relatorios" class="nav-link">Relatórios</a>
            <a href="/config" class="nav-link">Configurações</a>
        </nav>
        <button class="btn" id="adminBtn" style="display:none; margin-top: auto; background: var(--warning); color: #000;" onclick="window.location.href='/admin'">
            Admin
        </button>
    </aside>

    <main class="main-content">
        <header class="topbar">
            <div>
                <h2 id="welcomeText">Olá</h2>
                <p style="color: var(--text-sub); font-size: 14px;">Monitoramento em tempo real</p>
            </div>
            <div style="display: flex; align-items: center; gap: 10px;">
                <button class="btn" style="background:none; font-size: 20px;" onclick="toggleTheme()" id="themeBtn">🌙</button>
                <div class="user-profile">
                    <div class="avatar" id="avatar" onclick="openModal()">👤</div>
                    <span id="userName" style="font-weight: 600; font-size: 14px;">Usuário</span>
                    <button class="btn btn-logout" onclick="logout()">Sair</button>
                </div>
            </div>
        </header>

        <div id="painel-content"></div>
    </main>

    <div class="modal" id="avatarModal">
        <div class="modal-content">
            <h4>Trocar Avatar</h4>
            <div class="emoji-grid" id="emojiGrid"></div>
            <button class="btn btn-primary" onclick="closeModal()" style="width:100%;">Fechar</button>
        </div>
    </div>
    <div id="toast" class="toast" style="display:none;"></div>

    @yield('assunto')

</body>
</html>