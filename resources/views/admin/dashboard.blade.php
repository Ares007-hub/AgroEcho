@extends('admin.index')
@section('assuntoADM')
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

@endsection('assuntoADM')