<?php

namespace App\Http\Controllers; 

use App\Http\Controllers; 
use App\Models\Dispositivo;
use Illuminate\Http\Request;

class WebsiteController extends Controller{
    public function home(){
        return view('websites.home');
    }

    public function login(){
        return view('websites.login');
    }

    public function dispositivos(){
    // Carrega os dispositivos já trazendo a última leitura do Arduino acoplada
    $dispositivos = \App\Models\Dispositivo::with('ultimaLeitura')->get();

    // Contadores para os blocos de estatísticas superiores
    $totalDispositivos = $dispositivos->count();
    $ativos = $dispositivos->where('status', 'active')->count();
    $manutencao = $dispositivos->where('status', 'maintenance')->count();
    $erros = $dispositivos->where('status', 'error')->count();

    // manda pra view home
    return view('websites.dispositivos', compact('dispositivos', 'totalDispositivos', 'ativos', 'manutencao', 'erros'));
}

    public function config(){
        return view('websites.config');
    }

    public function relatorios(Request $request) 
{
    // 1. Busca todos os dispositivos para listar nos filtros da tela
    $todosDispositivos = \App\Models\Dispositivo::all();

    // 2. Inicia a busca das leituras
    $query = \App\Models\LeituraSensor::with('dispositivo')->orderBy('momento_leitura', 'desc');

    // 3. Aplica o filtro de Data Inicial e Final
    if ($request->filled('data_inicio')) {
        $query->whereDate('momento_leitura', '>=', $request->data_inicio);
    }
    if ($request->filled('data_fim')) {
        $query->whereDate('momento_leitura', '<=', $request->data_fim);
    }

    // 4. Aplica o filtro de Dispositivos Selecionados (Checkbox)
    if ($request->filled('dispositivos_selecionados')) {
        $query->whereIn('dispositivo_id', $request->dispositivos_selecionados);
    }

    // 5. Executa a busca no banco (Limite de 1000 para não travar o navegador)
    $leituras = $query->limit(1000)->get();

    // 6. Define quais colunas de leitura aparecerão (se o usuário não marcou nada, mostra todas por padrão)
    $colunas = $request->input('colunas', [
        'tensao_v', 'corrente_a', 'potencia_kw', 'vibracao', 
        'fluxo_agua', 'volume_total', 'temperatura_motor'
    ]);

    return view('websites.relatorios', compact('leituras', 'todosDispositivos', 'colunas'));
}


}
