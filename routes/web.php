<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AuthController; 
use App\Http\Controllers\WebsiteController;
use App\Http\Controllers\AdminController;
use App\Http\Controllers\AdminDispositivoController;

// Rotas Públicas (Visitantes)
Route::get('/', [WebsiteController::class, 'home'])->name('home');
Route::get('/login', [WebsiteController::class, 'login'])->name('login');

// Rotas de Autenticação
Route::post('/login', [AuthController::class, 'login']);
Route::post('/register', [AuthController::class, 'register']);
Route::get('/logout', [AuthController::class, 'logout'])->name('logout');

// Rotas Protegidas (Apenas usuários logados)
Route::middleware(['auth'])->group(function () {

    // Área do Usuário Comum
    Route::get('/dispositivos', [WebsiteController::class, 'dispositivos'])->name('dispositivos.index');
    Route::get('/relatorios', [WebsiteController::class, 'relatorios'])->name('relatorios.index');
    Route::get('/config', [WebsiteController::class, 'config'])->name('config.index');
    Route::post('/config/atualizar', [AuthController::class, 'updateConfig'])->name('config.update');

    // Área Administrativa
    Route::prefix('/admin')->middleware(['admin'])->group(function () {
        
        Route::get('/', function () {
            return view('admin.dashboard');
        })->name('admin.dashboard');

        //CRUD
        Route::get('/criar', [AdminController::class, 'index'])->name('admin.usuarios.criar');
        Route::post('/usuarios/salvar', [AdminController::class, 'salvar'])->name('admin.usuarios.salvar');
        Route::post('/usuarios/excluir/{id}', [AdminController::class, 'excluir'])->name('admin.usuarios.excluir');

        Route::get('/motobombas', [AdminDispositivoController::class, 'index'])->name('admin.dispositivos.criar');
        Route::post('/motobombas/salvar', [AdminDispositivoController::class, 'salvar'])->name('admin.dispositivos.salvar');
        Route::post('/motobombas/excluir/{id}', [AdminDispositivoController::class, 'excluir'])->name('admin.dispositivos.excluir');
        
    });

});
//rota das leituras do arduino
Route::post('/api/telemetria', [App\Http\Controllers\TelemetryController::class, 'receberLeitura']);