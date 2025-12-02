## Models

The following models can be found in  
`ProjectManager\app\Models`

### Enum

We use a custom enum as we couldn't get the normal one to work.

```php
public const ROLE_USER = "User";
public const ROLE_ADMIN = 'Admin';
public const ROLE_PROJECT_MANAGER = 'Project manager';
```

Then we have a function to get them all in a array

```php
public static function getRoles(): array
{
    return [
        self::ROLE_USER,
        self::ROLE_ADMIN,
        self::ROLE_PROJECT_MANAGER,
    ];
}
```

### Hidden fields

In our user model we have a *$hidden*, all the field in that array are not parsed over to the resources.  
In this case we don't want the users password to be show, even by accendent.  
We don't use the other three, but it's the same: we don't want to share that. 

```php
protected $hidden = [
    'password',
    'two_factor_secret',
    'two_factor_recovery_codes',
    'remember_token',
];
```

### DB relations

This is from Tasks model, this is telling that the task:
- belongs to 0 or unlimited other task
- It's a task model on the other side of this relation
- That it's not the default `tasks_tasks` table we reference to but: `task_dependencies`
- That the column our id need to match is `depends_on_task_id`, not the default: `tasks_id`
- That the `task_id` is our target task that is blocking this task

```php
public function blocking(): BelongsToMany
{
    return $this->belongsToMany(
        Tasks::class,
        'task_dependencies',
        'depends_on_task_id',
        'task_id'
    );
}
```

*All models has this*

This tells us that:
- It has a id in it's own table, is a many to 1
- It uses the defualt column name: `account_id`

```php
public function account(): BelongsTo
{
    return $this->belongsTo(Account::class);
}
```

## Resources

The following resources can be found in  
`ProjectManager\app\Http\Resources`

This is used to filter out data, or modify that data just before sending it out as json.

### Normally

This is the default, if you just want all the data from the model

*This is from the user resource*

```php
public function toArray(Request $request): array
{
    return parent::toArray($request);
}
```

### Modifying the data

Here i assign the id, title and so on the normal way.

`assigned_users` is not a normal value in the table, `assignedTo` is a function in the task model, it is a one to many.  
The array to null if no users is assigned to this task, if so i make it a empty array.  
the function `getTaskDependies` does the same, but also filter out some of the data, e.g. if the task has the status *complete*.

*This is from the task resource*

```php
public function toArray(Request $request): array
{
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
```

## Controller

The following controllers can be found in  
`ProjectManager\app\Http\Controllers`

### Get data with dependence

This function does:
- loads all users and task in the assignedTo and dependsOn functions.
- Get the data to use
- Converts them into task resource
- Return that as a list in json

*From task controller*

```php
public function getAllTasks()
{
    return Tasks::with(['assignedTo', 'dependsOn'])
        ->get()
        ->mapInto(TaskResource::class);
}
```

### Update

Request is the body of the http request.  
Task is the task from the db, then you call this endpoint on `api/task/edit/{task}`, the task is the task id.  
The first validation is the task id, if that doesn't exsit in the db, you get an error.  
Now we can validate the body, this time we only validate the new status, we check if
- If the status is in the rquest body
- If it's in, it need to be one of the statuses in our custom enum

Then we set it and save the update.

```php
public function updateStatus(Request $request, Tasks $task)
{
    $request->validate([
        'status' => 'required|in:' . implode(',', Tasks::getStatuses()),
    ]);

    $task->status = $request->status;
    $task->save();

    return new TaskResource($task);
}
```

## I don't know where with should be...

### Use state

The following examples can be found in  
`ProjectManager\resources\js\pages\dashboard.tsx`

#### Make state

The users is the list you read from and setUsers is the function you call to update the users list.  
This is a IUser array, the default value is a empty list.  
Error as you can see, a string but is also able to be null.

```ts
const [users, setUsers] = useState<IUser[]>([]);
const [error, setError] = useState<string | null>(null);
```

#### Set new state

The `setIsTaskCreateModalOpen` is a boolean and is easy to change the same with `setSelectedTask`.  
`setTasks` is difference as it's an array, i need to make a new array to get react to detect that i have updated the list.

```ts
    const closeCreateTask = () => {
        setIsTaskCreateModalOpen(false);
        setSelectedTask(null);
    }

    const onCreatedNewTask = (newTask: ITask) => {
        setTasks((prevTasks) => [...prevTasks, newTask]);
    }
```

### Component Props

The following examples can be found in  
`ProjectManager\resources\js\pages\dashboard.tsx`  
`ProjectManager\resources\js\pages\project-board.tsx`  
`ProjectManager\resources\js\pages\personalized-boards.tsx`  

This interface is private, it's use to tell that the Dashboard wants, as shown in the second block.  
The question mark is used to tell that this item is not need, but if it is in, it needs to be what comes after semicolon.  
E.g. title is not pressent in `PersonalizedBoard`, but is in `ProjectBoardPage`.

```ts
interface DashboardProps {
    title?: string;
    projectLayout?: ProjectLayout;
    overrideTasks?: ITask[];
    overrideProjects?: IProject[];
    projectViewing?: IProject;
}

export default function Dashboard(props: DashboardProps)
```

```ts
export default function PersonalizedBoard() {
    return <Dashboard projectLayout={personalizedLayout} />
}

export default function ProjectBoardPage() {
    const {auth, project} = usePage<ExtendedSharedData>().props;

    return <Dashboard
        projectLayout={projectLayout}
        projectViewing={project}
        overrideTasks={project.tasks}
        title={`Project Board: ${project.name}`}
    />
}
```
