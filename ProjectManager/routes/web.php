<?php

use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use Laravel\Fortify\Features;

Route::get('/', function () {
    return Inertia::render('welcome', [
        'canRegister' => Features::enabled(Features::registration()),
    ]);
})->name('home');

Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('dashboard', function () {
        return Inertia::render('dashboard');
    })->name('dashboard');

    Route::get('projects/{id}', [\App\Http\Controllers\ProjectController::class, 'index'])->name('projects');

    Route::get('user-management', function () {
        return Inertia::render('user-management');
    })->name('user-management');

    Route::get('profile', function () {
        return Inertia::render('user/profile');
    });
});
