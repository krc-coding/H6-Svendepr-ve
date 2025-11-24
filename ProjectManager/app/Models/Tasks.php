<?php

namespace App\Models;

use App\Models\Scopes\AccountScope;
use Illuminate\Database\Eloquent\Attributes\ScopedBy;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;

#[ScopedBy(AccountScope::class)]
class Tasks extends Model
{
    // Custom enum
    public const STATUS_OPEN = "Open";
    public const STATUS_IN_PROCESS = 'In process';
    public const STATUS_COMPLETED = 'Completed';
    public const STATUS_CANCELLED = 'Cancelled';
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

    public function assignedTo(): BelongsToMany
    {
        return $this->belongsToMany(user::class, 'tasks_users');
    }

    public function account(): BelongsTo
    {
        return $this->belongsTo(Account::class);
    }

    public function blocking(): BelongsToMany
    {
        return $this->belongsToMany(
            Tasks::class,
            'task_dependencies',
            'depends_on_task_id',
            'task_id'
        );
    }

    public function dependsOn(): BelongsToMany
    {
        return $this->belongsToMany(
            Tasks::class,
            'task_dependencies',
            'task_id',
            'depends_on_task_id'
        );
    }
}
