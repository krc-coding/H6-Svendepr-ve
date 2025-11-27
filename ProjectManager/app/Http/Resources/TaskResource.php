<?php

namespace App\Http\Resources;

use App\Models\Tasks;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class TaskResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        // return parent::toArray($request);
        return [
            'id' => $this->id,
            'title' => $this->title,
            'description' => $this->description,
            'status' => $this->status,
            'project_id' => $this->project_id,
            'created_by' => $this->created_by,
            'assigned_users' => $this->assignedTo?->pluck('id') ?? [],
            'depends_on' => $this->getTaskDependies(),
            'due_date' => $this->due_date,
            'created_at' => $this->created_at,
        ];
    }

    private function getTaskDependies()
    {
        $excludeStatuses = [Tasks::STATUS_COMPLETED, Tasks::STATUS_CANCELLED];

        $filtered = $this->dependsOn
            ?->reject(
                fn($task) => in_array($task->status, $excludeStatuses)
            );

        return $filtered->pluck('id') ?? [];
    }
}
