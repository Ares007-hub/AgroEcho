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
            <a href="/dispositivos" class="nav-link ">Painel Geral</a>
            <a href="/relatorios" class="nav-link">Relatórios</a>
            <a href="/config" class="nav-link">Configurações</a>
        </nav>
        <button class="btn" id="adminBtn" style="display:none; margin-top: auto; background: var(--warning); color: #000;" onclick="window.location.href='/admin'">
            Admin
        </button>
    </aside>

    @yield('assunto')

</body>
</html>