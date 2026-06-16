<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB; // puxa dp banco de dados
use Illuminate\Support\Facades\Hash;

class AdminController extends Controller
{
    public function index(Request $request)
    {
        $usuarios = DB::table('usuarios')->orderBy('id', 'desc')->get();
        $editUser = null;
        if ($request->has('edit')) {
            $editUser = DB::table('usuarios')->where('id', $request->edit)->first();
        }

        return view('admin.admin_criar_usuario', compact('usuarios', 'editUser'));
    }

    public function salvar(Request $request)
    {
        $dados = [
            'nome'      => $request->nome,
            'email'     => $request->email,
            'role'      => $request->role,
            'telefone'  => $request->telefone,
            'permanent' => $request->permanent,
        ];

        if ($request->filled('senha')) {
            $dados['senha_hash'] = Hash::make($request->senha);
        }

        if ($request->filled('id')) {
            DB::table('usuarios')->where('id', $request->id)->update($dados);
            return redirect()->route('admin.usuarios.criar')->with('success', 'Usuário atualizado com sucesso!');
        } 
        
        else {
            $dados['status'] = 'active'; 
            $dados['notificacoes'] = 'on';
            
            DB::table('usuarios')->insert($dados);
            return redirect()->route('admin.usuarios.criar')->with('success', 'Usuário criado com sucesso!');
        }
    }

    public function excluir($id)
    {
        $user = DB::table('usuarios')->where('id', $id)->first();

        if ($user && $user->permanent) {
            return redirect()->back()->with('error', 'Este usuário é fixo do sistema e não pode ser apagado!');
        }

        DB::table('usuarios')->where('id', $id)->delete();
        return redirect()->route('admin.usuarios.criar')->with('success', 'Usuário removido!');
    }
}