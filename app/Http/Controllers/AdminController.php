<?php

namespace App\Http\Controllers;

use App\Models\Dispositivo;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Cache;

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
            Cache::flush(); // Limpa cache ao atualizar
            return redirect()->route('admin.usuarios.criar')->with('success', 'Usuário atualizado com sucesso!');
        } else {
            $dados['status'] = 'active';
            $dados['notificacoes'] = 'on';
            DB::table('usuarios')->insert($dados);
            Cache::flush(); // Limpa cache ao criar
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
        Cache::flush(); // Limpa cache ao excluir
        return redirect()->route('admin.usuarios.criar')->with('success', 'Usuário removido!');
    }

    public function dashboard()
    {
        // Cache de 30 segundos para consultas pesadas
        $total = Cache::remember('total_dispositivos', 30, function () {
            return Dispositivo::count();
        });

        $ativos = Cache::remember('ativos_dispositivos', 30, function () {
            return Dispositivo::where('status', 'active')->count();
        });

        $manutencao = Cache::remember('manutencao_dispositivos', 30, function () {
            return Dispositivo::where('status', 'maintenance')->count();
        });

        $erros = Cache::remember('erros_dispositivos', 30, function () {
            return Dispositivo::where('status', 'error')->count();
        });

        $dispositivos = Cache::remember('todos_dispositivos', 30, function () {
            return Dispositivo::with('usuario:id,nome')->get();
        });

        return view('admin.dashboard', compact(
            'total', 'ativos', 'manutencao', 'erros', 'dispositivos'
        ));
    }
}