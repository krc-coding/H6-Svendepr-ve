<?php

namespace App\Models;

use App\Models\Scopes\AccountScope;
use Illuminate\Database\Eloquent\Attributes\ScopedBy;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

#[ScopedBy(AccountScope::class)]
class Project extends Model
{
    // Custom enum
    public const STATUS_OPEN = "Open";
    public const STATUS_IN_PROCESS = 'In process';
    public const STATUS_COMPLETED = 'Completed';
    public const STATUS_CANCELLED = 'Cancelled';
    // Custom enum end

    protected $fillable = [
        'name',
        'description',
        'status',
        'project_lead_id',
        'due_date',
        'account_id'
    ];

    public static function getStatuses(): array
    {
        return [
            self::STATUS_OPEN,
            self::STATUS_IN_PROCESS,
            self::STATUS_COMPLETED,
            self::STATUS_CANCELLED,
        ];
    }

    public function tasks(): HasMany
    {
        return $this->hasMany(Tasks::class);
    }

    public function user(): BelongsTo
    {
        return $this->belongsTo(user::class);
    }

    public function account(): BelongsTo
    {
        return $this->belongsTo(Account::class);
    }
}
