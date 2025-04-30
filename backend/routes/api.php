<?php

use App\Http\Controllers\AdminController;
use App\Http\Controllers\BlablaController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\NewsController;
use App\Http\Controllers\ProfileController;
use App\Http\Controllers\ReviewController;
use App\Http\Controllers\VideoController;
use App\Helpers\AIHelper;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
*/

// Auth Routes
Route::group(['prefix' => 'auth', 'middleware' => ['throttle:15,1']], function () {
    Route::post('/login', [AuthController::class, 'login']);
    Route::post('/register', [AuthController::class, 'register']);

    Route::middleware('auth:sanctum')->group(function () {
        Route::post('/logout', [AuthController::class, 'logout']);
    });
});

// Profile Routes
Route::group(['prefix' => 'profile', 'middleware' => ['throttle:60,1', 'auth:sanctum']], function () {
    Route::get('/me', [ProfileController::class, 'me']);

    // CIN upload is always allowed
    Route::post('/me/validateCIN', [ProfileController::class, 'validateCIN']);
    // Protected routes requiring document checks
    Route::middleware(['check.documents'])->group(function () {
        Route::put('/me', [ProfileController::class, 'update']);
        Route::post('/me/avatar', [ProfileController::class, 'updateAvatar']);
        Route::post('/me/password', [ProfileController::class, 'updatePassword']);

        // Teacher-only routes
        Route::middleware(['role:teacher'])->group(function () {
            Route::post('/me/diplomas', [ProfileController::class, 'uploadDiplomas']);
            Route::put('/me/teacher-profile', [ProfileController::class, 'updateTeacherProfile']);
        });
    });
});

// Blabla Routes
Route::group(['prefix' => 'blablas', 'middleware' => ['throttle:60,1', 'auth:sanctum', 'check.documents']], function () {
    Route::get('/', [BlablaController::class, 'index']);
    Route::get('/{blabla}', [BlablaController::class, 'show']);

    Route::middleware('auth:sanctum')->group(function () {
        Route::post('/', [BlablaController::class, 'store']);
        Route::put('/{blabla}', [BlablaController::class, 'update']);
        Route::delete('/{blabla}', [BlablaController::class, 'destroy']);
        Route::post('/{blabla}/apply', [BlablaController::class, 'apply']);
        Route::post('/application/{applicationId}/accept', [BlablaController::class, 'acceptApplication']);
        Route::post('/application/{applicationId}/deny', [BlablaController::class, 'denyApplication']);
    });
});

// Review Routes
Route::group(['prefix' => 'reviews', 'middleware' => ['throttle:60,1', 'auth:sanctum']], function () {
    Route::get('/', [ReviewController::class, 'index']);
    Route::get('/{review}', [ReviewController::class, 'show']);
    Route::get('/teacher/{teacherId}', [ReviewController::class, 'getTeacherReviews']);
    Route::post('/', [ReviewController::class, 'store']);
    Route::put('/{review}', [ReviewController::class, 'update']);
    Route::delete('/{review}', [ReviewController::class, 'destroy']);
});

// Teacher Profile Routes
Route::group(['middleware' => ['throttle:60,1']], function () {
    Route::get('/teachers', [ProfileController::class, 'getAllTeachers']);
    Route::get('/teachers/{id}', [ProfileController::class, 'getTeacherProfile']);
    Route::get('/categories', [AdminController::class, 'getCategories']);
    Route::get('/users/{id}', [AdminController::class, 'getUserAsUser']);
    Route::post('/messages/upload', [AdminController::class, 'upload']);
});

// Video Routes
Route::group(['prefix' => 'videos', 'middleware' => ['throttle:60,1']], function () {
    Route::get('/', [VideoController::class, 'index']);
    Route::get('/{video}', [VideoController::class, 'show']);
    Route::get('/teacher/{teacherId}', [VideoController::class, 'getTeacherVideos']);

    // Protected routes
    Route::middleware(['auth:sanctum', 'role:teacher'])->group(function () {
        Route::post('/', [VideoController::class, 'store']);
        Route::put('/{video}', [VideoController::class, 'update']);
        Route::delete('/{video}', [VideoController::class, 'destroy']);
        Route::get('/my-videos', [VideoController::class, 'myVideos']);
    });
});

// Admin Routes
Route::group(['prefix' => 'admin', 'middleware' => ['throttle:60,1', 'auth:sanctum', 'role:admin']], function () {
    // Dashboard
    Route::get('/dashboard', [AdminController::class, 'dashboard']);

    // User Management
    Route::get('/users', [AdminController::class, 'getUsers']);
    Route::get('/users/{id}', [AdminController::class, 'getUser']);
    Route::put('/users/{id}/status', [AdminController::class, 'updateUserStatus']);
    Route::put('/users/{id}/validate-cin', [AdminController::class, 'validateUserCIN']);

    // Category Management
    Route::get('/categories', [AdminController::class, 'getCategories']);
    Route::post('/categories', [AdminController::class, 'createCategory']);
    Route::put('/categories/{id}', [AdminController::class, 'updateCategory']);
    Route::delete('/categories/{id}', [AdminController::class, 'deleteCategory']);

    // Newsletter
    Route::post('/newsletter', [AdminController::class, 'sendNewsletter']);

    // Admin Management
    Route::post('/create-admin', [AdminController::class, 'createAdmin']);

    // News Management (admin only)
    Route::post('/news', [NewsController::class, 'store']);
    Route::put('/news/{news}', [NewsController::class, 'update']);
    Route::delete('/news/{news}', [NewsController::class, 'destroy']);
});

// Public News Routes - accessible to everyone
Route::group(['prefix' => 'news', 'middleware' => ['throttle:60,1']], function () {
    Route::get('/', [NewsController::class, 'index']);
    Route::get('/{news}', [NewsController::class, 'show']);

    // Only authenticated users can create, update, and delete news
    Route::middleware(['auth:sanctum'])->group(function () {
        Route::post('/', [NewsController::class, 'store']);
        Route::put('/{news}', [NewsController::class, 'update']);
        Route::delete('/{news}', [NewsController::class, 'destroy']);
    });
});
