<script>
    import { onMount } from 'svelte';

    export let loggedIn;

    let sessionId = '';
    let taskTitle = '';

    onMount(async () => {
        try {
            const response = await fetch('/api/sessions', {
                credentials: 'include'
            });

            if (response.ok) {
                const data = await response.json();
                sessionId = data.sessionId;
                loggedIn = true;
                await getTasks();
            } else {
                console.error('Invalid Session');
                alert('Invalid Session. Please login again to continue.');
                loggedIn = false;
            }
        } catch (error) {
            console.error(error);
        }
    });

    let tasks = [];

    const addTask = async () => {
        try {
            const response = await fetch('/api/tasks', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ title: taskTitle }),
                credentials: 'include',
            });

            await getTasks();
            taskTitle = '';

            if (response.ok) {
                console.log('Task added successfully!');
            } else {
                console.error('Error adding task');
            }
        } catch (error) {
            console.error(error);
        }
    };

    const getTasks = async () => {
        try {
            const response = await fetch('/api/tasks', {
                credentials: 'include'
            });

            if (response.ok) {
                const data = await response.json();
                tasks = data;
            } else {
                console.error('Error fetching tasks');
            }
        } catch (error) {
            console.error(error);
        }
    };

    const deleteTask = async (taskId) => {
        try {
            const response = await fetch(`/api/tasks/${taskId}`, {
                method: 'DELETE',
                credentials: 'include'
            });

            if (response.ok) {
                // Call getTasks() to fetch the updated task list
                await getTasks();
            } else {
                console.error('Error deleting task');
            }
        } catch (error) {
            console.error(error);
        }
    };

    const logout = async () => {
        try {
            const response = await fetch('/api/sessions', {
                method: 'DELETE',
                credentials: 'include'
            });
            loggedIn = false;

            if (response.ok) {
                loggedIn = false;
            } else {
                console.error('Error destroying session');
            }
        } catch (error) {
            console.error(error);
        }
    };
</script>

<div class="container">
    <h1>Task Management Dashboard</h1>

    <div class="row">
        <div class="col-md-6">
            <h2>Add Task</h2>

            <form id="add-task-form">
                <div class="mb-3">
                    <label for="task-title" class="form-label">Task Title</label>
                    <input type="text" class="form-control" id="task-title" bind:value="{taskTitle}" required>
                </div>

                <button type="button" class="btn btn-primary" on:click="{addTask}">
                    Add Task
                </button>
            </form>
        </div>

        <div class="col-md-6">
            <h2>Task List</h2>

            <ul class="task-list">
                {#each tasks as task}
                    <li>
                        <div class="task-name">{task.title}</div>
                        <div class="task-actions">
                            <button class="btn btn-danger" on:click="{() => deleteTask(task.id)}">Delete</button>
                        </div>
                    </li>
                {/each}
            </ul>
        </div>
    </div>

    <div class="row">
        <div class="col-md-6">
            <h2>User Info</h2>
            <p>Session ID: <span>{sessionId}</span></p>

            <button class="btn btn-danger" on:click="{logout}">Logout</button>
        </div>
    </div>
</div>

<style>
    .container {
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        height: 100vh;
    }

    .container h1 {
        margin-top: 0;
    }

    .row {
        display: flex;
        justify-content: center;
        align-items: flex-start;
        margin-top: 2rem;
    }

    .col-md-6 {
        flex: 0 0 50%;
        max-width: 50%;
    }

    .task-list {
        list-style: none;
        padding: 0;
    }

    .task-list li {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 0.5rem;
        padding: 0.5rem;
        border: 1px solid #ccc;
        border-radius: 4px;
    }

    .task-actions {
        display: flex;
        gap: 0.5rem;
    }

    .form-control {
        width: 100%;
    }
</style>