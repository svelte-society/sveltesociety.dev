<script lang="ts">
    let { data } = $props();
</script>

<h1>Account</h1>
<p>Hello {data.user?.username}!</p>