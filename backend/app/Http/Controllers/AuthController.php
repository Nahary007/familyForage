<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Tymon\JWTAuth\Facades\JWTAuth;

class AuthController extends Controller
{
    public function checkAuth(Request $request)
    {
        return response()->json([
            'authenticated' => true,
            'user' => $request->user(),
        ]);
    }

    public function login(Request $request)
    {
        $credentials = $request->validate([
            'email' => ['required', 'email'],
            'password' => ['required'],
        ]);

        if (!$token = JWTAuth::attempt($credentials)) {
            return response()->json([
                'message' => 'Email ou mot de passe incorrect.'
            ], 401);
        }

        return response()->json([
            'message' => 'Connexion réussie',
            'user' => Auth::user(),
            'token' => $token,
        ]);
    }


    public function logout(Request $request)
    {
        Auth::logout();
        $request->session()->invalidate();
        $request->session()->regenerateToken();

        return response()->json(['message' => 'Déconnexion réussie']);
    }

}
