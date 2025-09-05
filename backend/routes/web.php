<?php

use Illuminate\Support\Facades\Route;
use Laravel\Sanctum\Http\Controllers\CsrfCookieController;
use App\Http\Controllers\AuthController;

Route::get('/sanctum/csrf-cookie', [CsrfCookieController::class, 'show']);

Route::post('/login', [AuthController::class, 'login'])->name('login');
Route::post('/logout', [AuthController::class, 'logout'])->name('logout');

// Ajoutez cette route HORS du middleware group pour tester
Route::get('/admin/check-auth-test', fn () => response()->json(['test' => true]));

Route::middleware('auth:api')->group(function () {
    Route::get('/admin/check-auth', [AuthController::class, 'checkAuth']);
});

