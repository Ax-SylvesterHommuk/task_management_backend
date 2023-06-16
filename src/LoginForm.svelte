<script>
    export let loggedIn;
    let email = '';
    let password = '';

    async function handleSubmit() {
        const formData = {
            email,
            password
        };

        try {
            const response = await fetch(`/api/sessions`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(formData)
            });

            if (response.ok) {
                alert('Logged in successfully!');
                loggedIn = true;
            } else {
                // Display an error message
                const errorData = await response.json();
                if (errorData.errorType === 'invalidCredentials') {
                    alert('Invalid email or password.');
                } else {
                    alert('An error occurred while logging in. Please try again later.');
                }
            }
        } catch (error) {
            // Display a generic error message
            alert('Failed to login!');
        }
    }
</script>

<div class="login-container">
    <h2>Login</h2>
    <form on:submit|preventDefault={handleSubmit}>
        <div class="mb-3">
            <label for="loginEmail" class="form-label">Email address</label>
            <input type="email" class="form-control" id="loginEmail" bind:value={email} required>
        </div>
        <div class="mb-3">
            <label for="loginPassword" class="form-label">Password</label>
            <input type="password" class="form-control" id="loginPassword" bind:value={password} required>
        </div>
        <button type="submit" class="btn btn-success">Login</button>
    </form>
</div>

<style>
    .login-container {
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        height: 100vh;
    }
</style>