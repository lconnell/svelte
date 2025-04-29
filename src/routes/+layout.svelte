<!-- src/routes/+layout.svelte -->
<script lang="ts">
  import '../app.css';
  
  let { children } = $props<{
    children: () => unknown;
  }>();
</script>

<main class="main-content">
  {@render children()}
</main>

<style>
  .main-content {
    max-width: 1200px;
    margin: 0 auto;
    padding: var(--spacing-lg);
  }
</style> 