<!-- Sidebar.svelte -->
<script lang="ts">
  import { page } from '$app/stores';
  import { user } from '$lib/stores/auth';
  import { sidebarOpen } from '$lib/stores/sidebar';
  import { goto } from '$app/navigation';
  import Menu from '~icons/lucide/menu';
  import X from '~icons/lucide/x';
  import Home from '~icons/lucide/home';
  import Users from '~icons/lucide/users';
  import Settings from '~icons/lucide/settings';
  import LogOut from '~icons/lucide/log-out';
  import User from '~icons/lucide/user';

  function toggleSidebar() {
    $sidebarOpen = !$sidebarOpen;
  }

  function handleLogout() {
    localStorage.removeItem('auth_token');
    user.set(null);
    goto('/login');
  }
</script>

<aside class="sidebar" class:open={$sidebarOpen}>
  <div class="sidebar-header">
    <h2>Admin Panel</h2>
    <button class="toggle-button" onclick={toggleSidebar}>
      <X class="w-5 h-5" />
    </button>
  </div>

  <nav class="sidebar-nav">
    <a href="/" class:active={$page.url.pathname === '/'}>
      <Home class="w-5 h-5" />
      <span>Dashboard</span>
    </a>
    <a href="/users" class:active={$page.url.pathname === '/users'}>
      <Users class="w-5 h-5" />
      <span>Users</span>
    </a>
    <a href="/settings" class:active={$page.url.pathname === '/settings'}>
      <Settings class="w-5 h-5" />
      <span>Settings</span>
    </a>
  </nav>

  <div class="sidebar-footer">
    <div class="user-info">
      <User class="w-5 h-5" />
      <span class="user-name">{$user?.name || 'User'}</span>
    </div>
    <button class="logout-button" onclick={handleLogout}>
      <LogOut class="w-5 h-5" />
      <span>Logout</span>
    </button>
  </div>
</aside>

<button class="persistent-toggle" class:sidebar-open={$sidebarOpen} onclick={toggleSidebar}>
  <Menu class="w-5 h-5" />
</button>

<style>
  .sidebar {
    position: fixed;
    top: 0;
    left: 0;
    height: 100vh;
    width: 250px;
    background-color: #1a1a1a;
    color: #fff;
    padding: 1rem;
    display: flex;
    flex-direction: column;
    transition: transform 0.3s ease;
    z-index: 1000;
  }

  .sidebar.open {
    transform: translateX(0);
  }

  .sidebar:not(.open) {
    transform: translateX(-250px);
  }

  .persistent-toggle {
    position: fixed;
    top: 0;
    left: 0;
    background: #1a1a1a;
    border: none;
    color: #fff;
    cursor: pointer;
    padding: 0.35rem;
    border-radius: 0 0 0.5rem 0;
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 1001;
    transition: all 0.3s ease;
    width: 32px;
    height: 32px;
  }

  .persistent-toggle.sidebar-open {
    opacity: 0;
    pointer-events: none;
  }

  .persistent-toggle:hover {
    background-color: #2a2a2a;
  }

  .sidebar-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 2rem;
  }

  h2 {
    margin: 0;
    font-size: 1.25rem;
    font-weight: 600;
  }

  .sidebar-nav {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
    flex: 1;
  }

  a {
    display: flex;
    align-items: center;
    gap: 0.75rem;
    padding: 0.75rem;
    color: #fff;
    text-decoration: none;
    border-radius: 0.375rem;
    transition: background-color 0.2s;
  }

  a:hover {
    background-color: rgba(255, 255, 255, 0.1);
  }

  a.active {
    background-color: #3498db;
  }

  .sidebar-footer {
    margin-top: auto;
    padding-top: 1rem;
    border-top: 1px solid rgba(255, 255, 255, 0.1);
  }

  .user-info {
    margin-bottom: 1rem;
    display: flex;
    align-items: center;
    gap: 0.75rem;
  }

  .user-name {
    font-size: 0.875rem;
    color: #9ca3af;
  }

  .logout-button {
    width: 100%;
    display: flex;
    align-items: center;
    gap: 0.75rem;
    padding: 0.75rem;
    background: none;
    border: 1px solid rgba(255, 255, 255, 0.1);
    color: #fff;
    border-radius: 0.375rem;
    cursor: pointer;
    transition: background-color 0.2s;
  }

  .logout-button:hover {
    background-color: rgba(255, 255, 255, 0.1);
  }

  .toggle-button {
    background: none;
    border: none;
    color: #fff;
    cursor: pointer;
    padding: 0.5rem;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .toggle-button:hover {
    color: #9ca3af;
  }
</style> 