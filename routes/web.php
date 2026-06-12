<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AuthController; 
use App\Http\Controllers\WebsiteController;

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

    // Área Administrativa (Trancada com o Middleware 'admin')
    Route::prefix('/admin')->middleware(['admin'])->group(function () {
        
        Route::get('/', function () {
            return view('admin.dashboard');
        })->name('admin.dashboard');

        Route::get('/criar', function () {
            return view('admin.admin_criar_usuario');
        })->name('admin.usuarios.criar');
        
    });

});