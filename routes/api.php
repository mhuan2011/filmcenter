<?php

use App\Http\Controllers\AuthController;
use App\Http\Controllers\CategoriesController;
use App\Http\Controllers\PersonController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| is assigned the "api" middleware group. Enjoy building your API!
|
*/

Route::middleware('auth:sanctum')->get('/user', function (Request $request) {
    return $request->user();
});

//Users
Route::post('/register', [AuthController::class, 'register']);
Route::post('/login', [AuthController::class, 'login']);


//Categories
Route::get('/category/getlist', [CategoriesController::class, 'getlist'])->middleware('auth:sanctum');
Route::get('/category/getitem/{id}', [CategoriesController::class, 'getitem'])->middleware('auth:sanctum');
Route::post('/category/store', [CategoriesController::class, 'store'])->middleware('auth:sanctum');
Route::post('/category/update/{id}', [CategoriesController::class, 'update'])->middleware('auth:sanctum');
Route::get('/category/delete/{id}', [CategoriesController::class, 'delete'])->middleware('auth:sanctum');

//Person
Route::get('/person/getlist', [PersonController::class, 'getlist'])->middleware('auth:sanctum');
Route::get('/person/getitem/{id}', [PersonController::class, 'getitem'])->middleware('auth:sanctum');
Route::post('/person/store', [PersonController::class, 'store'])->middleware('auth:sanctum');
Route::post('/person/update', [PersonController::class, 'update'])->middleware('auth:sanctum');
Route::get('/person/delete/{id}', [PersonController::class, 'delete'])->middleware('auth:sanctum');
