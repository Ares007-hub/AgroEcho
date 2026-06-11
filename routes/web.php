<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AuthController; 
use App\Http\Controllers\WebsiteController;

// Páginas Públicas (Acessíveis sem login)
Route::get('/', [WebsiteController::class, 'home']);
Route::get('/login', [WebsiteController::class, 'login'])->name('login');

// Processamento de Login / Registro / Logout
Route::post('/login', [AuthController::class, 'login']);
Route::post('/register', [AuthController::class, 'register']);
Route::get('/logout', [AuthController::class, 'logout']);

// 🔒 Páginas Privadas Protegidas (Só acessa quem estiver logado)
Route::middleware(['auth'])->group(function () {
    Route::get('/dispositivos', [WebsiteController::class, 'dispositivos']);
    Route::get('/relatorios', [WebsiteController::class, 'relatorios']);
    Route::get('/config', [WebsiteController::class, 'config']);
    
    Route::post('/config/atualizar', [AuthController::class, 'updateConfig'])->name('config.update');
});

// Área Administrativa
Route::prefix('/admin')->group(function () {
    Route::get('/', function () {
        return view('admin.dashboard');
    });

    Route::get('/criar', function () {
        return view('admin.admin_criar_usuario');
    });
});