<script>
	import CreateAccountForm from "./CreateAccountForm.svelte";
</script>

<main>
	<div class="form-container">
		<CreateAccountForm/>
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
</style>