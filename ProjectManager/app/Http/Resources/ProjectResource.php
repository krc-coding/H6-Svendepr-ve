<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class ProjectResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'name' => $this->name,
            'description' => $this->description,
            'status' => $this->status,
            'project_lead_id' => $this->project_lead_id,
            'due_date' => $this->due_date,
            'user_worked_in_project' => $this->getUsersInAllTasks(),
            'created_at' => $this->created_at,
        ];
    }

    private function getUsersInAllTasks()
    {
        $users = $this->tasks
            ?->flatMap(fn($task) => collect($task->assignedTo))
            ->unique('id')
            ->values();

        return $users->pluck('id') ?? [];
    }
}
