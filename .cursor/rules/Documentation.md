## Documenting Code

If creating methods on classes or standalone functions, document them using jsdoc. If creating Svelte components that are not pages (+page.svelte) or layouts (+layout.svelte) document them using the format shown in the following example:

````
// HelloWorld.svelte
<script>
	let { name  = 'world' } = $props()
</script>

<!--
@component
Here's some documentation for this component.
It will show up on hover.

- You can use markdown here.
- You can also use code blocks here.
- Usage:
  ```tsx
  <main name="Arethra">
````

-->

<main>
	<h1>
		Hello, {name}
	</h1>
</main>
```
