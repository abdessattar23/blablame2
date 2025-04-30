<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('users', function (Blueprint $table) {
            $table->string('user_type')->default('student'); // student or teacher
            $table->string('cin_recto')->nullable();
            $table->string('cin_verso')->nullable();
            $table->boolean('cin_verified')->default(false);
            $table->json('diplomas')->nullable(); // Store multiple diploma file paths
            $table->boolean('diplomas_verified')->default(false);
            $table->string('specialization')->nullable(); // For teachers
            $table->text('teaching_experience')->nullable(); // For teachers
        });
    }

    public function down(): void
    {
        Schema::table('users', function (Blueprint $table) {
            $table->dropColumn([
                'user_type',
                'cin_recto',
                'cin_verso',
                'cin_verified',
                'diplomas',
                'diplomas_verified',
                'specialization',
                'teaching_experience'
            ]);
        });
    }
};
