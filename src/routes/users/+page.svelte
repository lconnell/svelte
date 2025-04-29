<!-- src/routes/users/+page.svelte -->
<script lang="ts">
  import type { User } from '$lib/types';
  import Plus from '~icons/lucide/plus';
  import Edit from '~icons/lucide/edit';
  import Trash from '~icons/lucide/trash';
  import Search from '~icons/lucide/search';

  const state = $state({
    users: [] as User[],
    isLoading: true,
    error: '',
    searchQuery: '',
    showCreateModal: false,
    showEditModal: false,
    selectedUser: null as User | null,
    filteredUsers: [] as User[]
  });

  async function fetchUsers() {
    state.isLoading = true;
    state.error = '';

    try {
      const token = localStorage.getItem('auth_token');
      if (!token) {
        throw new Error('Not authenticated');
      }

      const response = await fetch('http://localhost:8000/api/v1/users/', {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        if (response.status === 401) {
          throw new Error('Session expired. Please login again.');
        }
        throw new Error('Failed to fetch users');
      }

      const data = await response.json();
      
      // Check if the response has a 'items' property (common in paginated APIs)
      // or if it's directly an array of users
      const usersData = Array.isArray(data) ? data : (data.items || []);
      
      // Ensure we have valid user objects
      state.users = usersData.map((user: any) => ({
        id: user.id || '',
        name: user.name || user.email || 'Unknown User',
        email: user.email || '',
        role: user.role || 'user'
      }));
      
    } catch (err) {
      state.error = err instanceof Error ? err.message : 'An error occurred';
      console.error('Users fetch error:', err);
      state.users = []; // Reset users array on error
    } finally {
      state.isLoading = false;
    }
  }

  function openCreateModal() {
    state.showCreateModal = true;
  }

  function openEditModal(user: User) {
    state.selectedUser = user;
    state.showEditModal = true;
  }

  async function handleDelete(userId: string) {
    if (!confirm('Are you sure you want to delete this user?')) {
      return;
    }

    try {
      const token = localStorage.getItem('auth_token');
      if (!token) {
        throw new Error('Not authenticated');
      }

      const response = await fetch(`http://localhost:8000/api/v1/users/${userId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        if (response.status === 401) {
          throw new Error('Session expired. Please login again.');
        }
        throw new Error('Failed to delete user');
      }

      state.users = state.users.filter(user => user.id !== userId);
    } catch (err) {
      state.error = err instanceof Error ? err.message : 'An error occurred';
      console.error('Delete user error:', err);
    }
  }

  $effect(() => {
    fetchUsers();
  });

  $effect(() => {
    // Ensure we're working with an array before filtering
    if (Array.isArray(state.users)) {
      state.filteredUsers = state.users.filter(user =>
        (user.name?.toLowerCase().includes(state.searchQuery.toLowerCase()) || false) ||
        (user.email?.toLowerCase().includes(state.searchQuery.toLowerCase()) || false)
      );
    } else {
      state.filteredUsers = [];
    }
  });
</script>

<div class="page-container">
  <div class="page-header">
    <h1>Users</h1>
    <button class="standard-button compact" onclick={openCreateModal}>
      <Plus />
      <span>Add User</span>
    </button>
  </div>

  <div class="search-bar">
    <div class="input-wrapper">
      <Search />
      <input
        type="text"
        placeholder="Search users..."
        bind:value={state.searchQuery}
      />
    </div>
  </div>

  {#if state.isLoading}
    <div class="status-message">Loading users...</div>
  {:else if state.error}
    <div class="status-message error">{state.error}</div>
  {:else if state.filteredUsers.length === 0}
    <div class="status-message">No users found</div>
  {:else}
    <div class="grid auto-fill">
      {#each state.filteredUsers as user (user.id)}
        <div class="card compact">
          <div class="user-info">
            <h3>{user.name}</h3>
            <p>{user.email}</p>
            <span class="badge">{user.role}</span>
          </div>
          <div class="actions">
            <button
              class="standard-button icon-only"
              onclick={() => openEditModal(user)}
              title="Edit user"
            >
              <Edit />
            </button>
            <button
              class="standard-button icon-only danger"
              onclick={() => handleDelete(user.id)}
              title="Delete user"
            >
              <Trash />
            </button>
          </div>
        </div>
      {/each}
    </div>
  {/if}
</div>

<style>
  .user-info h3 {
    margin: 0 0 0.5rem;
    color: var(--text-color);
  }

  .user-info p {
    margin: 0 0 0.75rem;
    color: var(--text-color-light);
  }

  .actions {
    display: flex;
    gap: var(--spacing-sm);
  }

  /* Ensure search bar styles are applied */
  :global(.search-bar) {
    position: relative;
    margin-bottom: 2rem;
  }

  :global(.search-bar .input-wrapper) {
    position: relative;
  }

  :global(.search-bar .input-wrapper svg) {
    position: absolute;
    left: 1rem;
    top: 50%;
    transform: translateY(-50%);
    width: 20px;
    height: 20px;
    color: #9ca3af;
    pointer-events: none;
  }

  :global(.search-bar input) {
    width: 100%;
    padding: 0.75rem 1rem 0.75rem 3rem;
    border: 1px solid #d1d5db;
    border-radius: 0.375rem;
    font-size: 0.875rem;
    transition: border-color 0.15s ease-in-out;
  }

  :global(.search-bar input:focus) {
    outline: none;
    border-color: #3498db;
    box-shadow: 0 0 0 3px rgba(52, 152, 219, 0.1);
  }
</style> 