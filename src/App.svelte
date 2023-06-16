<script>
	import { onMount, onDestroy } from "svelte";
	import CreateAccountForm from "./CreateAccountForm.svelte";
	import LoginForm from "./LoginForm.svelte";

	export let loggedIn;
	let showLoginForm = true;
	let refreshInterval;

	const checkSession = async () => {
		try {
			const response = await fetch(`/api/sessions`, {
				credentials: 'include'
			});
			if (response.ok) {
				loggedIn = true;
			}
			else {
				loggedIn = false;
			}
		} catch (error) {
			console.error(error);
			loggedIn = false;
		}
	};

	onMount(() => {
		checkSession();
		refreshInterval = setInterval(checkSession, 2000);
	});

	onDestroy(() => {
		clearInterval(refreshInterval);
	});

	const login = async () => {
		await checkSession();
	};
</script>

<main>
	<div class="form-container">
		{#if showLoginForm}
			<LoginForm {loggedIn}/>
		{:else}
			<CreateAccountForm/>
		{/if}
	</div>
	<div class="button-container">
		<button class="{showLoginForm ? 'active' : ''}" on:click="{() => { showLoginForm = true; login(); }}">Login</button>
		<button class="{showLoginForm ? '' : 'active'}" on:click="{() => { showLoginForm = false; login(); }}">Create Account</button>
	</div>
</main>

<style>
	.form-container {
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;
		height: 90vh;
		margin-bottom: 1rem; /* Added margin at the bottom */
	}

	.button-container {
		display: flex;
		justify-content: center;
		margin-top: 1rem;
	}

	.button-container button {
		margin: 0 0.5rem;
	}

	.button-container button.active {
		font-weight: bold;
	}
</style>