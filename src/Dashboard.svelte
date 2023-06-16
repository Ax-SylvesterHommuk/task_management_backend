<script>
    import {onMount} from 'svelte';

    export let loggedIn;

    let sessionId = '';

    onMount(async () => {
        try {
            const response = await fetch('/api/sessions', {
                credentials: 'include'
            });

            if (response.ok) {
                const data = await response.json();
                sessionId = data.sessionId;
                loggedIn = true;
                // Call any other necessary functions here
            } else {
                console.error('Invalid Session');
                alert('Invalid Session. Please login again to continue.');
                loggedIn = false;
            }
        } catch (error) {
            console.error(error);
        }
    });
</script>

<div class="container">
    <classNamesk Management Dashboard
    </h1>

    <div class="row">
        <diclassNamess
        ="col-md-6">
        className <h2>User Info</h2>
        <p>Session ID: <span>{sessionId}</span></p>

        <button class="btn btn-danger" oclassNameck="{logout}">Logout</button>
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

    .form-control {
        width: 100%;
    }
</style>