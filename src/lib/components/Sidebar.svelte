<!-- Sidebar.svelte -->
<script lang="ts">
  import { page } from '$app/stores';
  import { user } from '$lib/stores/auth';
  import { goto } from '$app/navigation';
  import Menu from '~icons/lucide/menu';
  import Shield from '~icons/lucide/shield';
  import Home from '~icons/lucide/home';
  import Users from '~icons/lucide/users';
  import Settings from '~icons/lucide/settings';
  import User from '~icons/lucide/user';
  import LogOut from '~icons/lucide/log-out';
  import LogIn from '~icons/lucide/log-in';

  let isOpen = $state(true);

  function toggleSidebar() {
    isOpen = !isOpen;
  }

  async function handleLogout() {
    localStorage.removeItem('auth_token');
    user.set(null);
    goto('/login');
  }
</script>

<nav class="sidebar" class:open={isOpen}>
  <button class="toggle-button" on:click={toggleSidebar}>
    <Menu />
  </button>

  <div class="sidebar-content">
    <div class="logo">
      <Shield />
      <span>Admin Panel</span>
    </div>

    <ul class="nav-links">
      <li class:active={$page.url.pathname === '/'}>
        <a href="/">
          <Home />
          <span>Dashboard</span>
        </a>
      </li>
      <li class:active={$page.url.pathname === '/users'}>
        <a href="/users">
          <Users />
          <span>Users</span>
        </a>
      </li>
      <li class:active={$page.url.pathname === '/settings'}>
        <a href="/settings">
          <Settings />
          <span>Settings</span>
        </a>
      </li>
    </ul>

    <div class="user-info">
      {#if $user}
        <div class="user-details">
          <User />
          <span>{$user.email}</span>
        </div>
        <button class="logout-button" on:click={handleLogout}>
          <LogOut />
          <span>Logout</span>
        </button>
      {:else}
        <a href="/login" class="login-link">
          <LogIn />
          <span>Login</span>
        </a>
      {/if}
    </div>
  </div>
</nav>

<style>
  .sidebar {
    position: fixed;
    top: 0;
    left: 0;
    width: 250px;
    height: 100vh;
    background-color: #1a1a1a;
    color: #fff;
    transform: translateX(-100%);
    transition: transform 0.3s ease-in-out;
    z-index: 1000;
  }

  .sidebar.open {
    transform: translateX(0);
  }

  .toggle-button {
    position: absolute;
    top: 1rem;
    right: -3rem;
    background: none;
    border: none;
    color: #fff;
    cursor: pointer;
    padding: 0.5rem;
    font-size: 1.5rem;
  }

  .sidebar-content {
    padding: 1rem;
    height: 100%;
    display: flex;
    flex-direction: column;
  }

  .logo {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    font-size: 1.25rem;
    font-weight: bold;
    margin-bottom: 2rem;
  }

  .nav-links {
    list-style: none;
    padding: 0;
    margin: 0;
  }

  .nav-links li {
    margin-bottom: 0.5rem;
  }

  .nav-links a {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    padding: 0.75rem;
    color: #fff;
    text-decoration: none;
    border-radius: 0.25rem;
    transition: background-color 0.2s;
  }

  .nav-links a:hover {
    background-color: rgba(255, 255, 255, 0.1);
  }

  .nav-links li.active a {
    background-color: rgba(255, 255, 255, 0.2);
  }

  .user-info {
    margin-top: auto;
    padding-top: 1rem;
    border-top: 1px solid rgba(255, 255, 255, 0.1);
  }

  .user-details {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    margin-bottom: 1rem;
  }

  .logout-button,
  .login-link {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    width: 100%;
    padding: 0.75rem;
    background: none;
    border: 1px solid rgba(255, 255, 255, 0.2);
    color: #fff;
    cursor: pointer;
    text-decoration: none;
    border-radius: 0.25rem;
    transition: background-color 0.2s;
  }

  .logout-button:hover,
  .login-link:hover {
    background-color: rgba(255, 255, 255, 0.1);
  }
</style> 