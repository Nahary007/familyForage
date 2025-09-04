<?php
namespace Database\Seeders;


use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;


class DemoUsersSeeder extends Seeder
{
public function run(): void
{
User::updateOrCreate(
    ['email' => 'demo@familyforage.mg'],
    [
        'name' => 'Client Démo',
        'password' => Hash::make('demo123'),
        'role' => 'client',
        'status' => 'active',
    ]
);


User::updateOrCreate(
    ['email' => 'admin@familyforage.mg'],
        [
            'name' => 'Admin Démo',
            'password' => Hash::make('admin123'),
            'role' => 'admin',
            'status' => 'active',
        ]
    );
    }
}