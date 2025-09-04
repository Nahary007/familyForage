<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateUsersTable extends Migration
{
    /**
     * Exécuter la migration.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('users', function (Blueprint $table) {
            $table->id();  // Colonne "id" de type auto-incrémentée
            $table->string('name');  // Colonne pour le nom de l'utilisateur
            $table->string('email')->unique();  // Colonne pour l'email avec contrainte unique
            $table->timestamp('email_verified_at')->nullable();  // Colonne pour vérifier l'email
            $table->string('password');  // Colonne pour le mot de passe
            $table->rememberToken();  // Colonne pour la gestion du "remember me" (cookie)
            $table->timestamps();  // Colonne pour la gestion des dates (created_at, updated_at)
        });
    }

    /**
     * Annuler la migration.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('users');
    }
}
