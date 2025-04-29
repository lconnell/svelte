<!-- src/routes/+layout.svelte -->
<script lang="ts">
  import '../app.css';
  import '$lib/api/config';  // Import API configuration
  import Sidebar from '$lib/components/Sidebar.svelte';
  import { user } from '$lib/stores/auth';
  import { sidebarOpen } from '$lib/stores/sidebar';
  import { page } from '$app/stores';
  import { goto } from '$app/navigation';
  import Loader from '~icons/lucide/loader';
  import { isAuthenticated } from '$lib/api/auth_helper';
  import { UsersService } from '$lib/api/services/UsersService';
  import type { User } from '$lib/types/user';
  
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

  // Function to transform API user to our User type
  function transformUser(apiUser: any): User {
    return {
      id: apiUser.id,
      email: apiUser.email,
      name: apiUser.full_name || apiUser.email,
      role: apiUser.is_superuser ? 'admin' : 'user',
      createdAt: apiUser.created_at || new Date().toISOString(),
      updatedAt: apiUser.updated_at || new Date().toISOString()
    };
  }

  // Function to fetch user data
  async function fetchUserData() {
    try {
      const apiUser = await UsersService.usersReadUserMe();
      user.set(transformUser(apiUser));
    } catch (error) {
      console.error('Error fetching user data:', error);
    }
  }

  // Check if user is authenticated
  $effect(() => {
    if (isAuthenticated()) {
      // User is authenticated, fetch user data
      fetchUserData();
    } else {
      // User is not authenticated, redirect to login if not already there
      if (window.location.pathname !== '/login') {
        goto('/login');
      }
    }
  });

  // Check authentication on mount
  $effect(() => {
    async function checkAuth() {
      // If it's a public route, we don't need to check auth
      if (isPublicRoute) {
        state.isLoading = false;
        return;
      }

      const token = localStorage.getItem('access_token');
      
      // If no token and not on a public route, redirect to login
      if (!token && !isPublicRoute) {
        goto('/login');
        return;
      }

      // If we have a token but no user data, try to fetch user data
      if (token && !$user) {
        try {
          const apiUser = await UsersService.usersReadUserMe();
          user.set(transformUser(apiUser));
        } catch (err) {
          console.error('Auth check error:', err);
          // On error, clear token and redirect to login
          localStorage.removeItem('access_token');
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
    <main class="main-content" class:sidebar-open={$sidebarOpen}>
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
    transition: padding-left 0.3s ease;
  }

  .main-content.sidebar-open {
    padding-left: calc(250px + var(--spacing-lg));
  }
</style> 