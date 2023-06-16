import App from './App.svelte';

let loggedIn = false; // Set the value of loggedIn

const app = new App({
	target: document.body,
	props: {
		loggedIn: loggedIn // Pass the loggedIn prop here
	}
});

export default app;