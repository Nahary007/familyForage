<?php

use Illuminate\Support\Facades\Route;
use Laravel\Sanctum\Http\Controllers\CsrfCookieController;
use App\Http\Controllers\AuthController;

Route::get('/sanctum/csrf-cookie', [CsrfCookieController::class, 'show'])->name('login');

Route::post('/login', [AuthController::class, 'login']);
// Ajoutez cette route HORS du middleware group pour tester
Route::get('/admin/check-auth-test', fn () => response()->json(['test' => true]));

Route::middleware('auth:sanctum')->group(function () {

    //checker si l'utilsateur est connecté
    Route::get('/admin/check-auth', fn () => response()->json(['authenticated' => true]));

});