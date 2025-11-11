<?php

namespace App\Http\Controllers;

use App\Http\Resources\TaskResource;
use App\Models\Tasks;
use Illuminate\Http\Request;

class TaskController extends Controller
{

    public function createTask(Request $request)
    {
        $request->validate([
            'title' => 'required | string | max: 255',
            'description' => 'required | string',
            'status' => 'required | in:' . implode(',', Tasks::getStatuses()),

            // Project id is null if it's a standalone task.
            'project_id' => 'nullable | exists:projects,id',
            'created_by' => 'required | exists:users,id',
            'due_date' => 'required | date | after_or_equal: today',
        ]);

        $task = Tasks::create([
            'title' => $request->title,
            'description' => $request->description,
            'status' => $request->status,
            'project_id' => $request->project_id,
            'created_by' => $request->created_by,
            'due_date' => $request->due_date
        ]);

        return new TaskResource($task);
    }
}
