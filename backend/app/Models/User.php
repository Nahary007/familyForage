<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class User extends Model
{
    use HasFactory;

    // Définir les attributs assignables
    protected $fillable = ['name', 'email', 'password'];

    // Définir les attributs qui doivent être castés
    protected $casts = [
        'email_verified_at' => 'datetime',
    ];
}
