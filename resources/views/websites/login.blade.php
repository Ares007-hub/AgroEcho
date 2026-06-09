<!DOCTYPE html>
<html lang="pt-BR">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>AgroEcho - Login</title>

<link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap" rel="stylesheet">
<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.0/css/all.min.css">
<link rel="stylesheet" href="/assets/css/style.css" />



</head>
<body class="index-page">

<div class="container">

    <button class="theme-toggle" onclick="toggleTheme()" title="Alternar tema" id="themeBtn">
        <i class="fas fa-moon"></i>
    </button>

    <div class="brand-panel">
        <div class="logo-frame">
            <img src="/assets/img/Logo.png" class="logo-img" alt="AgroEcho Logo">
        </div>
        <div class="brand-name">AgroEcho</div>
        <div class="brand-tagline">Irrigação Inteligente</div>
        <a href="https://www.instagram.com/echo._5/?utm_source=ig_web_button_share_sheet" class="social-btn" title="Instagram">
            <i class="fab fa-instagram"></i>
        </a>
    </div>

    <div class="form-panel">

        <div class="tab-row">
            <button class="tab-btn active" onclick="switchTab('login')">Entrar</button>
            <button class="tab-btn" onclick="switchTab('register')">Cadastrar</button>
        </div>

        <div class="tab-scroll">

            <div class="tab-content active" id="tab-login">
                <div class="section-title">Bem-vindo de volta</div>
                <div class="section-subtitle">Acesse sua conta para continuar.</div>
                <div class="alert-msg" id="loginMsg"></div>

                <form id="loginForm">
                    <div class="field-group">
                        <label>Email</label>
                        <input type="email" id="loginEmail" placeholder="seu@email.com" required>
                    </div>
                    <div class="field-group">
                        <label>Senha</label>
                        <input type="password" id="loginPassword" placeholder="Sua senha" required>
                        <button type="button" class="toggle-password" onclick="togglePass('loginPassword', this)">
                            <i class="fas fa-eye"></i>
                        </button>
                    </div>
                    <button type="submit" class="btn-primary">Entrar</button>
                </form>
            </div>


            <div class="tab-content" id="tab-register">
                <div class="section-title">Criar conta</div>
                <div class="section-subtitle">Preencha os dados para começar.</div>
                <div class="alert-msg" id="registerMsg"></div>

                <form id="registerForm">
                    <div class="field-group">
                        <label>Nome completo <span class="asterisk">*</span></label>
                        <input type="text" id="regName" placeholder="Seu nome completo" required>
                    </div>

                    <div class="field-group">
                        <label>Email <span class="asterisk">*</span></label>
                        <input type="email" id="regEmail" placeholder="seu@email.com" required>
                        <div class="field-hint" id="emailHint"></div>
                    </div>

                    <div class="field-group">
                        <label>Telefone</label>
                        <input type="tel" id="regPhone" placeholder="(00) 00000-0000" inputmode="numeric" maxlength="15">
                    </div>

                    <div class="field-group">
                        <label>Senha <span class="asterisk">*</span></label>
                        <input type="password" id="regPassword" placeholder="Mínimo 6 caracteres" required>
                        <button type="button" class="toggle-password" onclick="togglePass('regPassword', this)">
                            <i class="fas fa-eye"></i>
                        </button>
                        <div class="strength-track">
                            <div class="strength-fill" id="strengthFill" data-level=""></div>
                        </div>
                        <div class="strength-label" id="strengthLabel" data-level=""></div>
                        <div class="req-list">
                            <span id="req-length">6+ caracteres</span>
                            <span id="req-upper">1 maiúscula</span>
                            <span id="req-special">1 caractere especial</span>
                            <span id="req-number">1 número</span>
                        </div>
                    </div>

                    <div class="field-group">
                        <label>Confirmar senha <span class="asterisk">*</span></label>
                        <input type="password" id="regConfirm" placeholder="Repita a senha" required>
                        <button type="button" class="toggle-password" onclick="togglePass('regConfirm', this)">
                            <i class="fas fa-eye"></i>
                        </button>
                        <div class="field-hint" id="matchHint"></div>
                    </div>

                    <button type="submit" class="btn-primary" id="registerBtn">Criar conta</button>
                </form>
            </div>
        </div>
    </div>
</div>

<script defer src="/assets/javascript/script.js"></script>


</body>
</html>