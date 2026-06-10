<?php

namespace App\Models;

use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;

class Usuario extends Authenticatable
{
    use Notifiable;

    protected $table = 'usuarios'; 

    protected $fillable = [
        'nome', 'email', 'senha_hash', 'role', 'telefone', 'avatar', 'status'
    ];

    public function getAuthPassword()
    {
        return $this->senha_hash;
    }
}