<?php

use App\Http\Controllers\AuthController;
use App\Http\Controllers\CategoriesController;
use App\Http\Controllers\CinemaController;
use App\Http\Controllers\CinemaHallController;
use App\Http\Controllers\ClientController;
use App\Http\Controllers\CountryController;
use App\Http\Controllers\MoviesController;
use App\Http\Controllers\PersonController;
use App\Http\Controllers\ShowController;
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
Route::get('/category/getfilter', [CategoriesController::class, 'getfilter'])->middleware('auth:sanctum');
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

//Country
Route::get('/country/getlist', [CountryController::class, 'getlist'])->middleware('auth:sanctum');

//Movies
Route::get('/movies/getlist', [MoviesController::class, 'getlist'])->middleware('auth:sanctum');
Route::get('/movies/getitem/{id}', [MoviesController::class, 'getitem'])->middleware('auth:sanctum');
Route::post('/movies/store', [MoviesController::class, 'store'])->middleware('auth:sanctum');
Route::post('/movies/update', [MoviesController::class, 'update'])->middleware('auth:sanctum');
Route::get('/movies/delete/{id}', [MoviesController::class, 'delete'])->middleware('auth:sanctum');

//Cinema Hall

Route::get('/cinema-hall/getlist', [CinemaHallController::class, 'getlist'])->middleware('auth:sanctum');
Route::get('/cinema-hall/getitem/{id}', [CinemaHallController::class, 'getitem'])->middleware('auth:sanctum');
Route::post('/cinema-hall/store', [CinemaHallController::class, 'store'])->middleware('auth:sanctum');
Route::post('/cinema-hall/update', [CinemaHallController::class, 'update'])->middleware('auth:sanctum');
Route::get('/cinema-hall/delete/{id}', [CinemaHallController::class, 'delete'])->middleware('auth:sanctum');

//Cinema
Route::get('/cinema/getitem-with-movie/{id}', [CinemaController::class, 'getCinemaWithMovie'])->middleware('auth:sanctum');
Route::get('/cinema/getlist', [CinemaController::class, 'getlist'])->middleware('auth:sanctum');
Route::get('/cinema/getitem/{id}', [CinemaController::class, 'getitem'])->middleware('auth:sanctum');
Route::post('/cinema/store', [CinemaController::class, 'store'])->middleware('auth:sanctum');
Route::post('/cinema/update', [CinemaController::class, 'update'])->middleware('auth:sanctum');
Route::get('/cinema/delete/{id}', [CinemaController::class, 'delete'])->middleware('auth:sanctum');


//Show
Route::get('/show/getlist', [ShowController::class, 'getlist'])->middleware('auth:sanctum');
Route::get('/show/getlist/ticket/{id}', [ShowController::class, 'getlistTicket'])->middleware('auth:sanctum');
Route::post('/show/getseatmap', [ShowController::class, 'getSeatMap'])->middleware('auth:sanctum');
Route::get('/show/getitem/{id}', [ShowController::class, 'getitem'])->middleware('auth:sanctum');
Route::post('/show/store', [ShowController::class, 'store'])->middleware('auth:sanctum');
Route::post('/show/update', [ShowController::class, 'update'])->middleware('auth:sanctum');
Route::get('/show/delete/{id}', [ShowController::class, 'delete'])->middleware('auth:sanctum');

//Client
Route::get('/getmovies-show', [ClientController::class, 'getMovieShow'])->middleware('auth:sanctum');
