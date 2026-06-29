<?php

use App\Http\Controllers\ProductController;
use App\Http\Controllers\AuthController;
use Illuminate\Support\Facades\Route;
// use Illuminate\Http\Request;

// ================================================================
// ALL PUBLIC — No Sanctum needed because auth is done via MockAPI
// The role check (admin vs user) happens in JavaScript after login
// ================================================================
 
// ---- AUTH ----
// All public — no Sanctum, auth is handled via MockAPI
Route::post('/login',    [AuthController::class, 'login']);
Route::post('/register', [AuthController::class, 'register']);
Route::post('/logout',   [AuthController::class, 'logout']);
 
// ---- USERS (admin: manage users via MockAPI) ----
Route::get('/users',         [AuthController::class, 'getUsers']);
Route::put('/users/{id}',    [AuthController::class, 'updateUser']);
Route::delete('/users/{id}', [AuthController::class, 'deleteUser']);
 
// ---- PRODUCTS (proxy to MockAPI) ----
Route::get('/products',        [ProductController::class, 'getProduct']);
Route::post('/product',        [ProductController::class, 'insertProduct']);
Route::put('/product/{id}',    [ProductController::class, 'update']);
Route::delete('/product/{id}', [ProductController::class, 'deleteProduct']);
 


// Route::middleware('auth:sanctum')->get('/user', function(Request $request){
//     return $request -> user();
// });

// Route::middleware(['auth:sanctum', 'role:admin']) -> post('/product', [ProductController::class, 'insertProduct']);

// Route::get('/user', function (Request $request) {
//     return $request->user();
// })->middleware('auth:sanctum');

// Route::get('/product', [ProductController::class, 'getProduct']);
// Route::post('/product', [ProductController::class, 'insertProduct']);
// Route::get('/products', [ProductController::class, 'index']);
// Route::post('/product', [ProductController::class, 'store']);

// Route::delete('/product/{id}', [ProductController::class, 'deleteProduct']);
// Route::put("/product/{id}", [ProductController::class, 'update']);

// // 1. PUBLIC ROUTES (Anyone can try to login)
// // Route::post('/login', [AuthController::class, 'login']);
// Route::post("/login", [AuthController::class, "login"]);
// Route::post("/register",[AuthController::class,"register"]);

// // 2. PROTECTED ROUTES (Requires the User to have a valid Sanctum Bearer token)
// Route::middleware('auth:sanctum')->group(function () {

//     // Auth
//     Route::post('/logout', [AuthController::class, 'logout']);
//     Route::get('/user',    fn(Request $r) => $r->user());
    
//     // // Logout endpoint
//     // Route::post('/logout', [AuthController::class, 'logout']);
    
//     // Product Endpoints
//     Route::get('/products', [ProductController::class, 'getProduct']);
//     Route::post('/product', [ProductController::class, 'insertProduct']);
//     Route::put('/product/{id}', [ProductController::class, 'update']);
//     Route::delete('/product/{id}', [ProductController::class, 'deleteProduct']);
// });