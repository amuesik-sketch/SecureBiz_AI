<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('scans', function (Blueprint $table) {

            $table->id();

            $table->foreignId('user_id')
                  ->constrained()
                  ->cascadeOnDelete();

            $table->string('website');

            $table->integer('score');

            $table->string('grade')
                  ->nullable();

            $table->string('risk');


            $table->json('checks')
                  ->nullable();


            $table->json('recommendations')
                  ->nullable();


            $table->json('technologies')
                  ->nullable();


            $table->json('vulnerabilities')
                  ->nullable();


            $table->longText('ai_analysis')
                  ->nullable();


            $table->timestamps();

        });
    }


    public function down(): void
    {
        Schema::dropIfExists('scans');
    }
};