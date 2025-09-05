<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;

class User extends Authenticatable{
    use HasFactory;

    // Définir les attributs assignables
    protected $fillable = ['name', 'email', 'password'];

    // Définir les attributs qui doivent être castés
    protected $casts = [
        'email_verified_at' => 'datetime',
    ];
}
