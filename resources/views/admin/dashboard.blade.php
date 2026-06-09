<!DOCTYPE html>
<html lang="pt-BR">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">

<title>Echo - Dashboard</title>

<link rel="stylesheet" href="/assets/css/style.css" >


</head>

<body class="dashboard-page">

<!-- HAMBURGER -->
<button class="hamburger" onclick="toggleSidebar()" id="hamburgerBtn">☰</button>
<div class="sidebar-overlay" id="sidebarOverlay" onclick="toggleSidebar()"></div>

<div class="container">

    <aside class="sidebar" id="sidebar">
        <div class="admin-header">
            <span class="admin-badge">ADMINISTRADOR</span>
            <div class="logo">Echo</div>
            <div class="user-name" id="sidebarUserName"></div>
        </div>

        <ul class="nav-menu">
            <li class="nav-item">
                <a href="/admin" class="nav-link active">Dashboard</a>
            </li>
            <li class="nav-item">
                <a href="/admin/criar" class="nav-link">Gerenciar Usuários</a>
            </li>
        </ul>

        <div class="bottom-links">
            <button class="theme-toggle" onclick="toggleTheme()" id="themeBtn">Alternar Tema</button>
            <a href="/" class="nav-link">Página Inicial</a>
            <a href="#" class="nav-link" onclick="logout()">Sair</a>
        </div>
    </aside>

    <main class="main">
        <div class="topbar">
            <div>
                <h2>Painel Administrativo</h2>
                <p>Controle geral dos dispositivos conectados</p>
            </div>
            <div class="admin-badge-top">ADMIN</div>
        </div>

        <div class="stats" id="statsRow"></div>

        <div class="chart-box">
            <h3>Status dos Dispositivos</h3>
            <canvas id="statusChart" height="80"></canvas>
        </div>

        <div class="table-box">
            <h3>Dispositivos Conectados</h3>
            <table>
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Nome</th>
                        <th>Tipo</th>
                        <th>Proprietário</th>
                        <th>Status</th>
                        <th>Bateria</th>
                        <th>Sinal</th>
                    </tr>
                </thead>
                <tbody id="devicesTable"></tbody>
            </table>
        </div>
    </main>
</div>

<script defer src="/assets/javascript/script.js"></script>
<script src="https://cdn.jsdelivr.net/npm/chart.js"></script>

</body>
</html>