<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\TaskController;

Route::prefix('/task')->group(function () {
    Route::post('/create', [TaskController::class, 'createTask']);

});
