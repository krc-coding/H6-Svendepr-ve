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

    public function getProjectManagers()
    {
        return User::where("role", User::ROLE_PROJECT_MANAGER)
            ->get()
            ->mapInto(UserResource::class);
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
            'account_id' => $request->user()->account_id
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
            'current_password' => ['required'],
            'password' => self::getPasswordRequirements()
        ]);

        // Check if the current password is correct
        $correctPassword = Hash::check($request->current_password, $user->password);

        if ($correctPassword === false) {
            return response()->json(['message' => 'Current password is incorrect', 'errors' => ['current_password' => 'The password is incorrect']], 422);
        }

        $user->password = Hash::make($request->password);
        $user->save();

        return new UserResource($user);
    }

    public function resetPassword(User $user)
    {
        $newPassword = bin2hex(random_bytes(4));

        $user->password = Hash::make($newPassword);
        $user->save();

        return $newPassword;
    }

    public function delete(User $user)
    {
        $user->delete();
        return response()->json([], 204);
    }
}
