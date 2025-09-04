<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;
use App\Models\User;

class UserSeeder extends Seeder
{
    public function run()
    {
        // Exemple d'insertion avec mot de passe haché
        User::create([
            'name' => 'userDemo',
            'email' => 'demo@gmail.com',
            'password' => Hash::make('motdepasse12'), // Le mot de passe est haché ici
        ]);
        
        // Tu peux aussi ajouter plus d'utilisateurs
        User::create([
            'name' => 'adminDemo',
            'email' => 'admin@gmail.com',
            'password' => Hash::make('motdepasse123'),
        ]);
    }
}
