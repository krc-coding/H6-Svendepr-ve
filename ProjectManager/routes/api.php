<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\ProjectController;
use App\Http\Controllers\TaskController;

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
    Route::patch('/edit/{project}', [ProjectController::class, 'editProject']);
    Route::patch('/update_status/{project}', [ProjectController::class, 'updateStatus']);
    Route::delete('/{project}', [ProjectController::class, 'delete']);
});
