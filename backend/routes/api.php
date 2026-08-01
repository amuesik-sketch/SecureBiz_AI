<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\ScanController;
use App\Http\Controllers\PdfController;
use App\Http\Controllers\ProfileController;

Route::get('/user', function (Request $request) {

    return $request->user();

})->middleware('auth:sanctum');



Route::get('/test', function () {

    return response()->json([
        'message' => 'SecureBiz AI API is working'
    ]);

});



Route::post('/register', [AuthController::class,'register']);

Route::post('/login', [AuthController::class,'login']);



Route::middleware('auth:sanctum')->group(function(){


    // Create security scan
    Route::post('/scans', [ScanController::class,'store']);


    // Get scan history
    Route::get('/scans', [ScanController::class,'index']);


    // Dashboard analytics
    Route::get('/dashboard', [ScanController::class,'dashboard']);

// User profile
Route::get('/profile', [ProfileController::class,'index']);

// Update profile
Route::put('/profile/update', [ProfileController::class,'update']);


// Change password
Route::put('/profile/password', [ProfileController::class,'changePassword']);

// Delete scan report
Route::delete(
    '/scans/{id}',
    [ScanController::class,'destroy']
);
});



// View single report
Route::get('/scans/{id}', [ScanController::class,'show']);

Route::middleware('auth:sanctum')->group(function(){

    Route::get(
        '/scans/{id}/pdf',
        [PdfController::class, 'download']
    );

});
