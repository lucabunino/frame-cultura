<script>
import { page } from '$app/stores';
</script>

<div>
	<h1 class="gaisyr-34">Siamo spiacenti, si è verificato il seguente errore<br><strong>{$page.status}: {$page.error.message}</strong></h1>
	<a href="/" class="btn bg-gray">← Vai alla homepage</a>
</div>

<style>
div {
	padding: var(--margin);
}
h1 {
	margin-bottom: 4rem;
}
</style>