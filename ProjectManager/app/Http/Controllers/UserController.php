<?php

namespace App\Http\Controllers;

use App\Http\Resources\UserResource;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\Rules\Password;

class UserController extends Controller
{
    public static function getPasswordRequirements(): array
    {
        // Only set to 1 for test purposes, need to be updated for production use
        return ['required', 'confirmed', Password::min(1)];
    }

    public function getUsers()
    {
        return User::all()->mapInto(UserResource::class);
    }

    public function getUser(User $user)
    {
        return new UserResource($user);
    }

    public function createUser(Request $request)
    {
        $request->validate([
            'name' => 'required | string | max: 255',
            'email' => 'required | unique:users,email',
            'role' => 'required | in:' . implode(',', User::getRoles()),
            'password' => self::getPasswordRequirements()
        ]);

        $user = User::create([
            'name' => $request->name,
            'display_name' => $request->name,
            'email' => $request->email,
            'role' => $request->role,
            'password' => Hash::make($request->password),
        ]);

        return new UserResource($user);
    }

    public function editUser(Request $request, User $user)
    {
        $request->validate([
            'display_name' => 'required | string | max: 255',
            'email' => 'required | unique:users,email,' . $user->id,
            'role' => 'required | in:' . implode(',', User::getRoles())
        ]);

        $user->display_name = $request->display_name;
        $user->email = $request->email;
        $user->role = $request->role;
        $user->save();

        return new UserResource($user);
    }

    public function updatePassword(Request $request, User $user)
    {
        $request->validate([
            'password' => self::getPasswordRequirements()
        ]);

        $user->password = Hash::make($request->password);
        $user->save();

        return new UserResource($user);
    }

    public function delete(User $user)
    {
        $user->delete();
        return response()->json([], 204);
    }
}
