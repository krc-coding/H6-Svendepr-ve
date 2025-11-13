<?php

namespace App\Models\Scopes;

use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Scope;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;

class AccountScope implements Scope
{
    /**
     * Apply the scope to a given Eloquent query builder.
     */
    public function apply(Builder $builder, Model $model): void
    {
        $session_id = session()->getId();
        $session = DB::table('sessions')->where('id', $session_id)->first();
        $user = DB::table('users')->where('id', $session->user_id)->first();
        $builder->where('account_id', $user->account_id);
    }
}
