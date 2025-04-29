<!-- src/routes/+layout.svelte -->
<script lang="ts">
  import '../app.css';
  import Sidebar from '$lib/components/Sidebar.svelte';
  import { user } from '$lib/stores/auth';
  import { page } from '$app/stores';
  import { goto } from '$app/navigation';
  import Loader from '~icons/lucide/loader';
  
  let { children } = $props<{
    children: () => unknown;
  }>();

  const state = $state({
    isLoading: true
  });

  // Check if the current route is public
  const isPublicRoute = $derived(
    $page.url.pathname === '/login' || 
    $page.url.pathname === '/register' || 
    $page.url.pathname === '/forgot-password'
  );

  // Check authentication on mount
  $effect(() => {
    async function checkAuth() {
      // If it's a public route, we don't need to check auth
      if (isPublicRoute) {
        state.isLoading = false;
        return;
      }

      const token = localStorage.getItem('auth_token');
      
      // If no token and not on a public route, redirect to login
      if (!token && !isPublicRoute) {
        goto('/login');
        return;
      }

      // If we have a token but no user data, try to fetch user data
      if (token && !$user) {
        try {
          const response = await fetch('http://localhost:8000/api/v1/users/me', {
            headers: {
              'Authorization': `Bearer ${token}`
            }
          });

          if (!response.ok) {
            // If token is invalid, clear it and redirect to login
            if (response.status === 401) {
              localStorage.removeItem('auth_token');
              goto('/login');
              return;
            }
            throw new Error('Failed to fetch user data');
          }

          const userData = await response.json();
          user.set(userData);
        } catch (err) {
          console.error('Auth check error:', err);
          // On error, clear token and redirect to login
          localStorage.removeItem('auth_token');
          goto('/login');
          return;
        }
      }

      state.isLoading = false;
    }

    checkAuth();
  });
</script>

{#if state.isLoading}
  <div class="loading-container">
    <Loader />
    <p>Loading...</p>
  </div>
{:else if isPublicRoute}
  <main class="main-content">
    {@render children()}
  </main>
{:else}
  <div class="app-layout">
    <Sidebar />
    <main class="main-content">
      {@render children()}
    </main>
  </div>
{/if}

<style>
  .loading-container {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    height: 100vh;
    gap: 1rem;
  }

  .loading-container :global(svg) {
    width: 2rem;
    height: 2rem;
    color: #3498db;
    animation: spin 1s linear infinite;
  }

  @keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }

  .app-layout {
    display: flex;
    min-height: 100vh;
  }

  .main-content {
    flex: 1;
    padding: var(--spacing-lg);
    margin-left: 0;
    transition: margin-left 0.3s ease-in-out;
  }

  /* Adjust main content when sidebar is open */
  :global(.sidebar.open) + .main-content {
    margin-left: 250px;
  }
</style> 