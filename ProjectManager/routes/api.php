<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\TaskController;

Route::prefix('/task')->group(function () {
    Route::post('/create', [TaskController::class, 'createTask']);
    Route::get('/{task}', [TaskController::class, 'getTask']);
    Route::get('/', [TaskController::class, 'getAllTasks']);
    Route::patch('/edit/{task}', [TaskController::class, 'editTask']);
    Route::patch('/update_status/{task}', [TaskController::class, 'updateStatus']);
    Route::delete('/{task}', [TaskController::class, 'delete']);
});
