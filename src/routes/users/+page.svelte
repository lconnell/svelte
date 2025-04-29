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

<div class="users-page">
  <div class="header">
    <h1>Users</h1>
    <button class="create-button" onclick={openCreateModal}>
      <Plus />
      <span>Add User</span>
    </button>
  </div>

  <div class="search-bar">
    <Search />
    <input
      type="text"
      placeholder="Search users..."
      bind:value={state.searchQuery}
    />
  </div>

  {#if state.isLoading}
    <div class="loading">Loading users...</div>
  {:else if state.error}
    <div class="error">{state.error}</div>
  {:else if state.filteredUsers.length === 0}
    <div class="empty-state">No users found</div>
  {:else}
    <div class="users-grid">
      {#each state.filteredUsers as user (user.id)}
        <div class="user-card">
          <div class="user-info">
            <h3>{user.name}</h3>
            <p>{user.email}</p>
            <span class="role-badge">{user.role}</span>
          </div>
          <div class="actions">
            <button
              class="edit-button"
              onclick={() => openEditModal(user)}
              title="Edit user"
            >
              <Edit />
            </button>
            <button
              class="delete-button"
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
  .users-page {
    padding: 2rem;
  }

  .header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 2rem;
  }

  h1 {
    margin: 0;
    color: var(--primary-color);
  }

  .create-button {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    padding: 0.75rem 1rem;
    background-color: var(--primary-color);
    color: white;
    border: none;
    border-radius: 0.25rem;
    cursor: pointer;
    transition: background-color 0.2s;
  }

  .create-button:hover {
    background-color: var(--primary-dark);
  }

  .search-bar {
    position: relative;
    margin-bottom: 2rem;
  }

  .search-bar :global(svg) {
    position: absolute;
    left: 1rem;
    top: 50%;
    transform: translateY(-50%);
    color: var(--secondary-color);
  }

  .search-bar input {
    width: 100%;
    padding: 0.75rem 1rem 0.75rem 3rem;
    border: 1px solid var(--border-color);
    border-radius: 0.25rem;
    font-size: 1rem;
  }

  .loading,
  .error,
  .empty-state {
    text-align: center;
    padding: 2rem;
    color: var(--secondary-color);
  }

  .error {
    color: var(--error-text);
  }

  .users-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
    gap: 1.5rem;
  }

  .user-card {
    background: white;
    border-radius: 0.5rem;
    padding: 1.5rem;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
    display: flex;
    justify-content: space-between;
  }

  .user-info h3 {
    margin: 0 0 0.5rem;
    color: var(--text-color);
  }

  .user-info p {
    margin: 0 0 0.75rem;
    color: var(--secondary-color);
  }

  .role-badge {
    display: inline-block;
    padding: 0.25rem 0.5rem;
    background-color: var(--primary-light);
    color: var(--primary-color);
    border-radius: 1rem;
    font-size: 0.75rem;
    font-weight: 500;
  }

  .actions {
    display: flex;
    gap: 0.5rem;
  }

  .edit-button,
  .delete-button {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 2rem;
    height: 2rem;
    border: none;
    border-radius: 0.25rem;
    cursor: pointer;
    transition: background-color 0.2s;
  }

  .edit-button {
    background-color: var(--warning-bg);
    color: var(--warning-text);
  }

  .delete-button {
    background-color: var(--error-bg);
    color: var(--error-text);
  }

  .edit-button:hover {
    background-color: var(--warning-dark);
  }

  .delete-button:hover {
    background-color: var(--error-dark);
  }
</style> 