@extends('websites.index')
@section('assunto')

<main class="main-content">
    <header class="topbar">
        <div>
            <h2 id="welcomeText">Olá, {{ Auth::user()->nome ?? 'Operador' }}</h2>
            <p class="monitoramento-color">Monitoramento e Proteção de Motobombas</p>
        </div>
        <div style="display: flex; align-items: center; gap: 10px;">
            <button class="btn" style="background:none; font-size: 20px;" onclick="toggleTheme()" id="themeBtn">🌙</button>
            <div class="user-profile">
                <span id="userName" style="font-weight: 600; font-size: 14px;">{{ Auth::user()->nome ?? 'Usuário' }}</span>
                <button class="btn btn-logout" onclick="logout()">Sair</button>
            </div>
        </div>
    </header>

    <div id="painel-content">
        
        <div class="stats-grid">
            <div class="stat-card">
                <div>
                    <small class="color-card" >Total de Motobombas</small>
                    <h3>{{ $totalDispositivos }}</h3>
                </div>
            </div>
            <div class="stat-card">
                <div>
                    <small class="color-card">Operando Normal</small>
                    <h3 style="color: #10b981;">{{ $ativos }}</h3>
                </div>
            </div>
            <div class="stat-card">
                <div>
                    <small class="color-card">Em Manutenção</small>
                    <h3 style="color: #f59e0b;">{{ $manutencao }}</h3>
                </div>
            </div>
            <div class="stat-card">
                <div>
                    <small class="color-card">Críticos / Falhas</small>
                    <h3 style="color: #ef4444;">{{ $erros }}</h3>
                </div>
            </div>
        </div>

        <div class="devices-grid" style="margin-top: 20px;">
            @foreach($dispositivos as $bomba)
                @php
                    // Define a cor do card com base na gravidade do status
                    $statusColor = $bomba->status === 'error' ? '#ef4444' : ($bomba->status === 'maintenance' ? '#f59e0b' : '#10b981');
                    $leitura = $bomba->ultimaLeitura;
                @endphp

                <div class="sensor-card" style="border-top: 4px solid {{ $statusColor }}; position: relative;">
                    
                    <div style="display:flex; justify-content:space-between; align-items:start; margin-bottom: 15px;">
                        <div>
                            <h4 style="color:var(--text-main); font-size:1.1rem; font-weight:700; margin:0;">{{ $bomba->nome }}</h4>
                            <small style="color:var(--text-sub);">ID: {{ $bomba->id }} | Mod: {{ $bomba->modelo ?? 'N/A' }}</small>
                        </div>
                        
                    </div>

                    @if($leitura)
                        @php
                            $tempColor = $leitura->temperatura_motor > 70 ? '#ef4444' : ($leitura->temperatura_motor > 50 ? '#f59e0b' : 'var(--text-main)');
                        @endphp
                        <div class="sensor-value" style="color: {{ $tempColor }}; font-size: 2rem; font-weight: bold; margin-bottom: 15px;">
                            {{ number_format($leitura->temperatura_motor, 1, ',', '.') }} <small style="font-size:16px; color:var(--text-sub);">°C no Motor</small>
                        </div>

                        <div style="display: grid; grid-cols: 2; gap: 8px; font-size: 13px; color: var(--text-main); background: rgba(0,0,0,0.02); padding: 10px; rounded: 6px;">
                            <div><strong>Tensão:</strong> {{ number_format($leitura->tensao_v, 1) }}V</div>
                            <div><strong>Corrente:</strong> {{ number_format($leitura->corrente_a, 1) }}A</div>
                            <div><strong>Potência:</strong> {{ number_format($leitura->potencia_kw, 2) }} kW</div>
                            <div><strong>Vibração:</strong> {{ number_format($leitura->vibracao, 2) }} mm/s</div>
                            <div><strong>Fluxo:</strong> {{ number_format($leitura->fluxo_agua, 1) }} L/h</div>
                            <div><strong>Vol. Total:</strong> {{ number_format($leitura->volume_total, 0, ',', '.') }} L</div>
                        </div>
                    @else
                        <div style="padding: 30px 0; text-align: center; color: var(--text-sub); font-style: italic;">
                            Aguardando telemetria do Arduino...
                        </div>
                    @endif

                    <div style="display:flex; justify-content:space-between; align-items:center; margin-top:15px; padding-top:15px; border-top:1px solid var(--border);">
                        <span style="font-size:12px; color:var(--text-sub);">📍 {{ $bomba->localizacao ?? 'Sem local' }}</span>
                        
                        <span class="badge" style="background-color: {{ $statusColor }}20; color: {{ $statusColor }}; padding: 3px 8px; border-radius: 4px; font-size: 11px; font-weight: bold;">
                            ● {{ strtoupper($bomba->status) }}
                        </span>
                    </div>

                    <div style="margin-top:8px; font-size:11px; color:var(--text-sub); text-align:right;">
                        Leitura: {{ $leitura ? date('d/m H:i', strtotime($leitura->momento_leitura)) : 'N/A' }}
                    </div>
                </div>
            @endforeach
        </div>
    </div>
</main>

<div id="toast" class="toast" style="display:none;"></div>

<script src="https://cdnjs.cloudflare.com/ajax/libs/html2pdf.js/0.10.1/html2pdf.bundle.min.js"></script>
<script src="https://cdn.sheetjs.com/xlsx-0.20.1/package/dist/xlsx.full.min.js"></script>
<script src="/assets/javascript/script.js"></script>

@endsection