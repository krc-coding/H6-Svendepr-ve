<?php

namespace App\Http\Controllers;

use App\Http\Resources\ProjectResource;
use App\Models\Project;
use Illuminate\Http\Request;

class ProjectController extends Controller
{
    public function getAllProjects()
    {
        return Project::all()->mapInto(ProjectResource::class);
    }

    public function getProject(Project $project)
    {
        return new ProjectResource($project);
    }

    public function createProject(Request $request)
    {
        $request->validate([
            'name' => 'required | string | max: 255',
            'description' => 'required | string',
            'status' => 'required | in:' . implode(',', Project::getStatuses()),
            'project_lead_id' => 'required | exists:users,id',
            'due_date' => 'required | date | after_or_equal: today',
        ]);

        $project = Project::create([
            'name' => $request->name,
            'description' => $request->description,
            'status' => $request->status,
            'project_lead_id' => $request->project_lead_id,
            'due_date' => $request->due_date,
            'account_id' => $request->user()->account_id
        ]);

        return new ProjectResource($project);
    }

    public function editProject(Request $request, Project $project)
    {
        $request->validate([
            'name' => 'required | string | max: 255',
            'description' => 'required | string',
            'project_lead_id' => 'required | exists:users,id',
            'due_date' => 'required | date | after_or_equal: today',
        ]);

        $project->name = $request->name;
        $project->description = $request->description;
        $project->due_date = $request->due_date;
        $project->save();

        return new ProjectResource($project);
    }

    public function updateStatus(Request $request, Project $project)
    {
        $request->validate([
            'status' => 'required | in:' . implode(',', Project::getStatuses()),
        ]);

        $project->status = $request->status;
        $project->save();

        return new ProjectResource($project);
    }

    public function delete(Project $project)
    {
        $project->delete();
        return response()->json([], 204);
    }
}
