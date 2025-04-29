<!-- Sidebar.svelte -->
<script lang="ts">
  import { Home, Clipboard, Users, Settings, LogOut } from 'lucide-svelte';
  import type { User } from '$lib/types';

  let { props } = $props<{
    user: User;
  }>();

  const menuItems = [
    { href: '/', icon: Home, label: 'Dashboard' },
    { href: '/work-orders', icon: Clipboard, label: 'Work Orders' },
    { href: '/users', icon: Users, label: 'Users' },
    { href: '/settings', icon: Settings, label: 'Settings' }
  ];

  function handleLogout() {
    // Implement logout logic
  }

  let currentPath = $state('');
  
  // Update current path when it changes
  $effect(() => {
    currentPath = window.location.pathname;
  });
</script>

<nav class="sidebar">
  <div class="user-info">
    <div class="avatar">{props.user.name[0]}</div>
    <div class="user-details">
      <span class="name">{props.user.name}</span>
      <span class="role">{props.user.role}</span>
    </div>
  </div>

  <ul class="menu">
    {#each menuItems as item}
      <li>
        <a
          href={item.href}
          class="menu-item"
          class:active={currentPath === item.href}
        >
          {#if item.icon}
            <item.icon size={20} />
          {/if}
          <span>{item.label}</span>
        </a>
      </li>
    {/each}
  </ul>

  <button class="logout-button" onclick={handleLogout}>
    <LogOut size={20} />
    <span>Logout</span>
  </button>
</nav>

<style>
  .sidebar {
    width: 250px;
    height: 100vh;
    background-color: #1a1a1a;
    color: white;
    padding: 20px;
    display: flex;
    flex-direction: column;
  }

  .user-info {
    display: flex;
    align-items: center;
    padding: 16px;
    border-bottom: 1px solid rgba(255, 255, 255, 0.1);
    margin-bottom: 20px;
  }

  .avatar {
    width: 40px;
    height: 40px;
    background-color: #4a5568;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 1.2rem;
    margin-right: 12px;
  }

  .user-details {
    display: flex;
    flex-direction: column;
  }

  .name {
    font-weight: 600;
    font-size: 1rem;
  }

  .role {
    font-size: 0.875rem;
    color: #a0aec0;
  }

  .menu {
    list-style: none;
    padding: 0;
    margin: 0;
    flex-grow: 1;
  }

  .menu-item {
    display: flex;
    align-items: center;
    padding: 12px 16px;
    color: #a0aec0;
    text-decoration: none;
    border-radius: 6px;
    margin-bottom: 4px;
    transition: all 0.2s;
  }

  .menu-item:hover {
    background-color: rgba(255, 255, 255, 0.1);
    color: white;
  }

  .menu-item.active {
    background-color: #4a5568;
    color: white;
  }

  .menu-item :global(svg) {
    margin-right: 12px;
  }

  .logout-button {
    display: flex;
    align-items: center;
    padding: 12px 16px;
    background: none;
    border: none;
    color: #a0aec0;
    cursor: pointer;
    width: 100%;
    border-radius: 6px;
    transition: all 0.2s;
  }

  .logout-button:hover {
    background-color: rgba(255, 255, 255, 0.1);
    color: white;
  }

  .logout-button :global(svg) {
    margin-right: 12px;
  }
</style> 