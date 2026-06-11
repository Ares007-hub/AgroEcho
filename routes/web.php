<?php

use Illuminate\Support\Facades\Route;

route::get('/', 'App\Http\Controllers\WebsiteController@home');
route::get('/login', 'App\Http\Controllers\WebsiteController@login');
route::get('/dispositivos', 'App\Http\Controllers\WebsiteController@dispositivos');
route::get('/relatorios', 'App\Http\Controllers\WebsiteController@relatorios');
route::get('/config', 'App\Http\Controllers\WebsiteController@config');


route::prefix('/admin')->group(function () {
    Route::get('/', function () {
        return view('admin.dashboard');
    });

    Route::get('/criar', function () {
        return view('admin.admin_criar_usuario');
    });

});
