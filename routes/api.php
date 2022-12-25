<?php

use App\Http\Controllers\AuthController;
use App\Http\Controllers\CategoriesController;
use App\Http\Controllers\CinemaController;
use App\Http\Controllers\CinemaHallController;
use App\Http\Controllers\ClientController;
use App\Http\Controllers\CountryController;
use App\Http\Controllers\MoviesController;
use App\Http\Controllers\NotiController;
use App\Http\Controllers\PaymenController;
use App\Http\Controllers\PermissionController;
use App\Http\Controllers\PersonController;
use App\Http\Controllers\ReportController;
use App\Http\Controllers\ReservationController;
use App\Http\Controllers\RoleController;
use App\Http\Controllers\ShowController;
use App\Http\Controllers\StarController;
use App\Http\Controllers\UserController;
use Facade\FlareClient\Http\Client;
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

Route::middleware('auth:sanctum')->get('/logout', [AuthController::class, 'logout']);


Route::group(['middleware' => ['auth:api', 'role:admin|staff'], 'prefix' => 'category'], function () {
    //Categories
    Route::get('/getlist', [CategoriesController::class, 'getlist'])->name("category.getlist");
    Route::get('/getfilter', [CategoriesController::class, 'getfilter']);
    Route::get('/getitem/{id}', [CategoriesController::class, 'getitem']);
    Route::post('/store', [CategoriesController::class, 'store']);
    Route::post('/update/{id}', [CategoriesController::class, 'update']);
    Route::get('/delete/{id}', [CategoriesController::class, 'delete']);
});




Route::group(['middleware' => ['auth:api', 'role:admin|staff'], 'prefix' => 'user'], function () {
    Route::post('/create', [UserController::class, 'creatAccount']);
    Route::post('/detail', [UserController::class, 'getAccountDetail']);
    Route::post('/update-account', [UserController::class, 'updateAccount']);
});

Route::group(['middleware' => ['auth:api', 'role:admin|staff|customer'], 'prefix' => 'user'], function () {
    Route::post('/update', [AuthController::class, 'update']);
});




Route::group(['middleware' => ['auth:api', 'role:admin|staff']], function () {
    Route::group(['prefix' => 'person'], function () {
        Route::get('/getlist', [PersonController::class, 'getlist']);
        Route::get('/getitem/{id}', [PersonController::class, 'getitem']);
        Route::post('/store', [PersonController::class, 'store']);
        Route::post('/update', [PersonController::class, 'update']);
        Route::get('/delete/{id}', [PersonController::class, 'delete']);
    });

    Route::group(['prefix' => 'movies'], function () {
        Route::post('/store', [MoviesController::class, 'store']);
        Route::post('/update', [MoviesController::class, 'update']);
        Route::get('/delete/{id}', [MoviesController::class, 'delete']);
    });

    Route::group(['prefix' => 'cinema-hall'], function () {

        Route::get('/getitem/{id}', [CinemaHallController::class, 'getitem']);
        Route::post('/store', [CinemaHallController::class, 'store']);
        Route::post('/update', [CinemaHallController::class, 'update']);
        Route::get('/delete/{id}', [CinemaHallController::class, 'delete']);
    });

    Route::group(['prefix' => 'cinema'], function () {
        Route::get('/getlist', [CinemaController::class, 'getlist']);
        Route::get('/getitem/{id}', [CinemaController::class, 'getitem']);
        Route::post('/store', [CinemaController::class, 'store']);
        Route::post('/update', [CinemaController::class, 'update']);
        Route::get('/delete/{id}', [CinemaController::class, 'delete']);
    });

    Route::group(['prefix' => 'show'], function () {

        Route::post('/getlist/ticket', [ShowController::class, 'getlistTicket']);

        Route::get('/getitem/{id}', [ShowController::class, 'getitem']);
        Route::post('/store', [ShowController::class, 'store']);
        Route::post('/update', [ShowController::class, 'update']);
        Route::get('/delete/{id}', [ShowController::class, 'delete']);
    });

    Route::group(['prefix' => 'report'], function () {
        Route::post('/movies', [ReportController::class, 'movies']);
        Route::post('/cinema', [ReportController::class, 'cinema']);
        Route::post('/detail', [ReportController::class, 'detail']);
        Route::post('/show', [ReportController::class, 'show']);
    });
});



Route::group(['middleware' => ['auth:api', 'role:admin|staff']], function () {
    Route::get('/user/getlist', [UserController::class, 'getlist']);
    Route::post('/user/get-role', [UserController::class, 'getRoleOfUser']);
    Route::post('/user/update-roles-user', [UserController::class, 'updateRoleForUser']);
    //role
    Route::get('/role/getlist', [RoleController::class, 'getlist']);
    Route::post('/role/store', [RoleController::class, 'store']);
    Route::get('/role/getitem/{id}', [RoleController::class, 'getitem']);
    Route::post('/role/update', [RoleController::class, 'update']);
    Route::post('/role/add-permission-roles', [RoleController::class, 'addPermissonToRole']);
    Route::post('/role/get-permission', [RoleController::class, 'getPermissionOfRole']);
    //permission
    Route::get('/permission/getlist', [PermissionController::class, 'getlist']);
    Route::post('/permission/store', [PermissionController::class, 'store']);
    Route::get('/permission/getitem/{id}', [PermissionController::class, 'getitem']);
    Route::post('/permission/update', [PermissionController::class, 'update']);
});

//Person


//Country
Route::get('/country/getlist', [CountryController::class, 'getlist']);

//Movies
Route::get('/movies/getlist', [MoviesController::class, 'getlist']);
Route::get('/movies/getitem/{id}', [MoviesController::class, 'getitem']);
Route::post('/movies/filter', [MoviesController::class, 'filtermovies']);


//Client
Route::get('/getmovies-show', [ClientController::class, 'getMovieShow']);
Route::get('/getinfor-show/{id}', [ClientController::class, 'getInforShow']);
Route::get('/get-show-date', [ClientController::class, 'getShowDate']);
Route::post('/getmovies-cinema-date', [ClientController::class, 'getMoviesWithCinemAndDate']);


Route::get('/cinema/getitem-with-movie/{id}', [CinemaController::class, 'getCinemaWithMovie']);
Route::post('/getshow', [ClientController::class, 'getShowWithMovieCinema']);
Route::get('/get-infor-with-order/{order_id}', [ClientController::class, 'getInforReservation']);


// payment
Route::post('/momo-payment', [PaymenController::class, 'paymentWithMomo']);
Route::post('/vnpay-payment', [PaymenController::class, 'paymentWithVNpay']);
Route::post('/payment/result', [PaymenController::class, 'result']);

//reservation
Route::post('/reservation', [ReservationController::class, 'reservation']);

//star
Route::post('/update-star', [StarController::class, 'updateStar']);
Route::post('/get-actors', [StarController::class, 'getActors']);

//Dashboard
Route::post('/statistic-by-date', [ClientController::class, 'statistic'])->middleware('auth:sanctum');
Route::post('/revenue-by-date', [ClientController::class, 'revenueByDate'])->middleware('auth:sanctum');
Route::get('/cinemahall-of-cinema', [ClientController::class, 'cinemaHallOfCinema'])->middleware('auth:sanctum');

Route::get('/reservation-history/{id}', [ClientController::class, 'getReserverionOfUser'])->middleware('auth:sanctum');

Route::post('/cancle-reservation', [ReservationController::class, 'cancleReservation'])->middleware('auth:sanctum');
Route::post('/tranfer-ticket', [ClientController::class, 'tranferTicket'])->middleware('auth:sanctum');



Route::post('/show/getseatmap', [ShowController::class, 'getSeatMap']);
Route::get('/cinema-hall/getlist', [CinemaHallController::class, 'getlist']);
Route::get('/cinema-hall/getlist-active', [CinemaHallController::class, 'getlistActive']);


Route::get('/noti', [NotiController::class, 'index']);
Route::post('/show/getlist', [ShowController::class, 'getlist']);




// demo
Route::get('/check-expire', [NotiController::class, 'check']);
Route::get('/check-cancle', [NotiController::class, 'cancle']);
