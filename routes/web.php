<?php

use Illuminate\Support\Facades\Route;

route::get('/', 'App\Http\Controllers\WebsiteController@login');
route::get('/home', 'App\Http\Controllers\WebsiteControlle@home');
route::get('/user', 'App\Http\Controllers\WebsiteControlle@user');
route::get('/relatorios', 'App\Http\Controllers\WebsiteControlle@relatorios');
route::get('/config', 'App\Http\Controllers\WebsiteControlle@config');


route::prefix('/admin')->group(function () {
    Route::get('/', function () {
        return view('admin.dashboard');
    });

    Route::get('/criar', function () {
        return view('admin.admin_criar_usuario');
    });

});
