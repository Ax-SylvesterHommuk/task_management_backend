<script>
    let email = "";
    let password = "";

    async function handleSubmit() {
        const formData = {
            email,
            password,
        };

        try {
            const response = await fetch(`/api/users`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(formData),
            });

            if (response.ok) {
                alert("Account created successfully!");
            } else {
                if (response.status === 409) {
                    alert("An account with this email already exists.");
                } else {
                    alert(
                        "An error occurred while creating your account. Please try again later."
                    );
                }
            }
        } catch (error) {
            alert(error.message);
        }
    }
</script>

<div class="create-account-form">
    <h2>Create Account</h2>
    <form on:submit|preventDefault={handleSubmit}>
        <div class="mb-3">
            <label for="email" class="form-label">Email address</label>
            <input type="email" class="form-control" id="email" bind:value={email} required>
        </div>
        <div class="mb-3">
            <label for="password" class="form-label">Password</label>
            <input type="password" class="form-control" id="password" bind:value={password} required>
        </div>
        <button type="submit" class="btn btn-success">Create Account</button>
    </form>
</div>

<style>
    .create-account-form {
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        height: 100vh;
    }
</style>