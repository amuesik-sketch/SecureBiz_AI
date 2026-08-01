<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

use App\Http\Controllers\AuthController;
use App\Http\Controllers\ScanController;
use App\Http\Controllers\PdfController;
use App\Http\Controllers\ProfileController;



/*
|--------------------------------------------------------------------------
| Public Routes
|--------------------------------------------------------------------------
*/


Route::get('/test', function () {

    return response()->json([
        'message' => 'SecureBiz AI API is working'
    ]);

});



Route::post('/register', [
    AuthController::class,
    'register'
]);



Route::post('/login', [
    AuthController::class,
    'login'
]);





/*
|--------------------------------------------------------------------------
| Protected Routes
|--------------------------------------------------------------------------
*/


Route::middleware('auth:sanctum')->group(function () {



    // Current logged in user
    Route::get('/user', function (Request $request) {

        return $request->user();

    });




    // Create security scan
    Route::post('/scans', [
        ScanController::class,
        'store'
    ]);




    // Scan history
    Route::get('/scans', [
        ScanController::class,
        'index'
    ]);




    // View single report
    Route::get('/scans/{id}', [
        ScanController::class,
        'show'
    ]);




    // Download PDF report
    Route::get('/scans/{id}/pdf', [
        PdfController::class,
        'download'
    ]);




    // Dashboard analytics
    Route::get('/dashboard', [
        ScanController::class,
        'dashboard'
    ]);




    // Profile
    Route::get('/profile', [
        ProfileController::class,
        'index'
    ]);



    Route::put('/profile/update', [
        ProfileController::class,
        'update'
    ]);



    Route::put('/profile/password', [
        ProfileController::class,
        'changePassword'
    ]);




    // Delete scan
    Route::delete('/scans/{id}', [
        ScanController::class,
        'destroy'
    ]);



});