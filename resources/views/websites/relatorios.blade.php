    @extends('website.index')
    @section('assunto')

    <main class="main-content">
        <header class="topbar">
            <div>
                <h2 id="welcomeText">Olá</h2>
                <p style="color: var(--text-sub); font-size: 14px;">Relatórios e exportação de dados</p>
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

        <div id="relatorios-content"></div>
    </main>

    <div class="modal" id="avatarModal">
        <div class="modal-content">
            <h4>Trocar Avatar</h4>
            <div class="emoji-grid" id="emojiGrid"></div>
            <button class="btn btn-primary" onclick="closeModal()" style="width:100%;">Fechar</button>
        </div>
    </div>
    <div id="toast" class="toast" style="display:none;"></div>

    <script src="https://cdnjs.cloudflare.com/ajax/libs/html2pdf.js/0.10.1/html2pdf.bundle.min.js"></script>
    <script src="https://cdn.sheetjs.com/xlsx-0.20.1/package/dist/xlsx.full.min.js"></script>
    <script src="/assets/javascript/script.js"></script>
    @endsection