<?php

namespace App\Http\Controllers; 

use App\Http\Controllers; 

class WebsiteController extends Controller{
    public function login(){
        return view('websites.login');
    }

    public function home(){
        return view('websites.home');
    }

    public function config(){
        return view('websites.config');
    }

    public function relatorios(){
        return view('websites.relatorios');
    }

    public function user(){
        return view('websites.user_dispositivos');
    }


}
