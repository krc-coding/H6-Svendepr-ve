<?php

namespace App\Http\Controllers;

use App\Http\Resources\TaskResource;
use App\Models\Tasks;
use Illuminate\Http\Request;

class TaskController extends Controller
{
    public function getAllTasks()
    {
        return Tasks::all()->mapInto(TaskResource::class);
    }

    public function getTask(Tasks $task)
    {
        return new TaskResource($task);
    }

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
            'due_date' => $request->due_date,
            'account_id' => $request->user()->account_id
        ]);

        return new TaskResource($task);
    }

    public function editTask(Request $request, Tasks $task)
    {
        $request->validate([
            'title' => 'required | string | max: 255',
            'description' => 'required | string',
            'due_date' => 'required | date | after_or_equal: today',
        ]);

        $task->title = $request->title;
        $task->description = $request->description;
        $task->due_date = $request->due_date;
        $task->save();

        return new TaskResource($task);
    }

    public function updateStatus(Request $request, Tasks $task)
    {
        $request->validate([
            'status' => 'required|in:' . implode(',', Tasks::getStatuses()),
        ]);

        $task->status = $request->status;
        $task->save();

        return new TaskResource($task);
    }

    public function delete(Tasks $task)
    {
        $task->delete();
        return response()->json([], 204);
    }
}
