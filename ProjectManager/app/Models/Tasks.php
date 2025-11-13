<?php

namespace App\Models;

use App\Models\Scopes\AccountScope;
use Illuminate\Database\Eloquent\Attributes\ScopedBy;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

#[ScopedBy(AccountScope::class)]
class Tasks extends Model
{
    // Custom enum
    public const STATUS_OPEN = "Open";
    public const STATUS_IN_PROCESS = 'In process';
    public const STATUS_COMPLETED = 'Completed';
    public const STATUS_CANCELLED = 'Cancelled';
    public const STATUS_BLOCKED = 'Blocked';
    // Custom enum end

    protected $fillable = [
        'title',
        'description',
        'status',
        'project_id',
        'created_by',
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
            self::STATUS_BLOCKED,
        ];
    }

    public function project(): BelongsTo
    {
        return $this->belongsTo(Project::class);
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
