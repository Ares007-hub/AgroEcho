<!DOCTYPE html>
<html lang="pt-BR">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Echo - Gerenciar Usuários</title>

    <link rel="stylesheet" href="/assets/css/style.css">

</head>

<body class="admin-page">

<button class="hamburger" onclick="toggleSidebar()" id="hamburgerBtn">☰</button>
<div class="sidebar-overlay" id="sidebarOverlay" onclick="toggleSidebar()"></div>

<div class="container">

    <nav class="sidebar" id="sidebar">
        <div class="admin-header">
            <span class="admin-badge">ADMINISTRADOR</span>
            <div class="logo">Echo</div>
            <div class="user-name" id="sidebarUserName"></div>
        </div>

        <ul class="nav-menu">
            <li class="nav-item">
                <a href="/admin" class="nav-link">Dashboard</a>
            </li>
            <li class="nav-item">
                <a href="/admin/criar" class="nav-link active">Gerenciar Usuários</a>
            </li>
        </ul>

        <div class="bottom-links">
    <button class="theme-toggle" onclick="toggleTheme()">Alternar Tema</button>
    <a href="index.html" class="nav-link">Página Inicial</a>
    <a href="#" class="nav-link" onclick="logout()">Sair</a>

    @if(auth()->check() && auth()->user()->role === 'admin')
        <button class="btn-back-user" style="background: #2563eb; color: #fff; padding: 8px 12px; border: none; border-radius: 6px; cursor: pointer; font-weight: bold; width: 100%; margin-bottom: 10px;" onclick="window.location.href='/dispositivos'">
            Voltar para Usuário
        </button>
    @endif
</div>
    </nav>

    <main class="main-content">
        <div class="top-bar">
            <div>
                <h1>Gerenciar Usuários</h1>
                <p>Criar, editar e visualizar usuários do sistema</p>
            </div>
            <span class="admin-label">ADMIN</span>
        </div>

        <div class="card">
            <h2>Criar Novo Usuário</h2>
            <div class="message" id="message"></div>

            <form id="createUserForm">
                <div class="form-grid">
                    <div class="form-group">
                        <label>Nome Completo</label>
                        <input type="text" id="name" required>
                    </div>
                    <div class="form-group">
                        <label>Email</label>
                        <input type="email" id="email" required>
                    </div>
                    <div class="form-group">
                        <label>Senha</label>
                        <input type="password" id="password" minlength="6" required>
                    </div>
                    <div class="form-group">
                        <label>Telefone</label>
                        <input type="tel" id="phone">
                    </div>
                    <div class="form-group">
                        <label>Tipo</label>
                        <select id="role">
                            <option value="user">Usuário</option>
                            <option value="admin">Administrador</option>
                        </select>
                    </div>
                    <div class="form-group" style="display:flex;align-items:end;">
                        <button type="submit" class="btn-create" id="submitBtn">Criar Usuário</button>
                    </div>
                </div>
            </form>
        </div>

        <div class="card">
            <h2>Usuários Cadastrados</h2>
            <table>
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Nome</th>
                        <th>Email</th>
                        <th>Tipo</th>
                        <th>Telefone</th>
                        <th>Data</th>
                        <th>Ações</th>
                    </tr>
                </thead>
                <tbody id="usersTable"></tbody>
            </table>
        </div>
    </main>
</div>

<div class="modal-overlay" id="confirmModal">
    <div class="modal">
        <h3 id="modalTitle">Confirmar Alteração</h3>
        <p id="modalMessage"></p>
        <div class="modal-buttons">
            <button class="btn-cancel" onclick="closeModal()">Cancelar</button>
            <button class="btn-confirm" onclick="confirmAction()">Confirmar</button>
        </div>
    </div>
</div>

<script defer src="/assets/javascript/script.js"></script>

</body>
</html>