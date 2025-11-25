<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\ProjectController;
use App\Http\Controllers\TaskController;
use App\Http\Controllers\UserController;

Route::middleware(['api', 'auth:sanctum'])->group(function () {
    Route::prefix('/user')->group(function () {
        Route::post('/create', [UserController::class, 'createUser']);
        Route::get('/project_managers', [UserController::class, 'getProjectManagers']);
        Route::get('/{user}', [UserController::class, 'getUser']);
        Route::get('/', [UserController::class, 'getUsers']);
        Route::patch('/edit/{user}', [UserController::class, 'editUser']);
        Route::patch('/update_password/{user}', [UserController::class, 'updatePassword']);
        Route::delete('/{user}', [UserController::class, 'delete']);
    });

    Route::prefix('/task')->group(function () {
        Route::post('/create', [TaskController::class, 'createTask']);
        Route::get('/{task}', [TaskController::class, 'getTask']);
        Route::get('/', [TaskController::class, 'getAllTasks']);
        Route::patch('/edit/{task}', [TaskController::class, 'editTask']);
        Route::patch('/update_status/{task}', [TaskController::class, 'updateStatus']);
        Route::delete('/{task}', [TaskController::class, 'delete']);
    });

    Route::prefix('/project')->group(function () {
        Route::post('/create', [ProjectController::class, 'createProject']);
        Route::get('/{project}', [ProjectController::class, 'getProject']);
        Route::get('/', [ProjectController::class, 'getAllProjects']);
        Route::put('/edit/{project}', [ProjectController::class, 'editProject']);
        Route::patch('/update_status/{project}', [ProjectController::class, 'updateStatus']);
        Route::delete('/{project}', [ProjectController::class, 'delete']);
    });
});
