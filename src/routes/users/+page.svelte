<!-- src/routes/users/+page.svelte -->
<script lang="ts">
  import type { User } from '$lib/types/user';
  import type { UserPublic } from '$lib/api/models/UserPublic';
  import Plus from '~icons/lucide/plus';
  import Edit from '~icons/lucide/edit';
  import Trash from '~icons/lucide/trash';
  import Search from '~icons/lucide/search';
  import Mail from '~icons/lucide/mail';
  import UserIcon from '~icons/lucide/user';
  import Lock from '~icons/lucide/lock';
  import { UsersService } from '$lib/api/services/UsersService';

  const state = $state({
    users: [] as User[],
    isLoading: true,
    error: '',
    searchQuery: '',
    showCreateModal: false,
    showEditModal: false,
    selectedUser: null as User | null,
    filteredUsers: [] as User[],
    isSubmitting: false,
    formData: {
      email: '',
      password: '',
      full_name: '',
      is_active: true,
      is_superuser: false
    }
  });

  async function fetchUsers() {
    state.isLoading = true;
    state.error = '';

    try {
      // The API should return an array of UserPublic objects
      const response = await UsersService.usersReadUsers();
      
      // Debug the response
      console.log('Users API response:', response);
      
      // Handle different response formats
      let usersData: UserPublic[] = [];
      
      if (Array.isArray(response)) {
        // Direct array response
        usersData = response;
      } else if (response && typeof response === 'object') {
        // Check if response has a data property that is an array
        if ('data' in response && Array.isArray(response.data)) {
          usersData = response.data;
        } else {
          // If we can't find an array, log the structure for debugging
          console.error('Unexpected API response structure:', response);
          state.error = 'Unexpected API response format';
          return;
        }
      }
      
      // Transform the users data to match our User type
      state.users = usersData.map((user: UserPublic) => ({
        id: user.id,
        name: user.full_name || user.email || 'Unknown User',
        email: user.email || '',
        role: user.is_superuser ? 'admin' : 'user',
        createdAt: user.created_at,
        updatedAt: user.created_at // Using created_at as updated_at since it's not available
      }));
    } catch (error) {
      console.error('Error fetching users:', error);
      state.error = error instanceof Error ? error.message : 'An unknown error occurred';
    } finally {
      state.isLoading = false;
    }
  }

  function resetForm() {
    state.formData = {
      email: '',
      password: '',
      full_name: '',
      is_active: true,
      is_superuser: false
    };
  }

  function openCreateModal() {
    resetForm();
    state.showCreateModal = true;
  }

  function openEditModal(user: User) {
    state.formData = {
      email: user.email,
      password: '', // Don't populate password for security
      full_name: user.name,
      is_active: true,
      is_superuser: user.role === 'admin'
    };
    state.selectedUser = user;
    state.showEditModal = true;
  }

  async function handleSubmit(isEdit: boolean) {
    state.isSubmitting = true;
    state.error = '';

    try {
      if (isEdit && state.selectedUser) {
        await UsersService.usersUpdateUser({
          userId: parseInt(state.selectedUser.id),
          requestBody: state.formData
        });
      } else {
        await UsersService.usersCreateUser({
          requestBody: state.formData
        });
      }

      // Close modal and refresh users
      state.showCreateModal = false;
      state.showEditModal = false;
      await fetchUsers();
    } catch (err) {
      state.error = err instanceof Error ? err.message : 'An error occurred';
      console.error('Save user error:', err);
    } finally {
      state.isSubmitting = false;
    }
  }

  async function handleDelete(userId: string) {
    if (!confirm('Are you sure you want to delete this user?')) {
      return;
    }

    try {
      await UsersService.usersDeleteUser({ userId: parseInt(userId) });
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
    <div class="input-group">
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

<!-- Create User Modal -->
{#if state.showCreateModal}
  <div 
    class="modal-backdrop" 
    role="dialog"
    aria-modal="true"
    aria-labelledby="create-modal-title"
    tabindex="-1"
  >
    <button
      class="modal-backdrop-button"
      onclick={() => state.showCreateModal = false}
      onkeydown={(e) => e.key === 'Escape' && (state.showCreateModal = false)}
      aria-label="Close modal"
    ></button>
    <div 
      class="modal" 
      role="document"
    >
      <h2 id="create-modal-title">Create User</h2>
      <form onsubmit={(e) => { e.preventDefault(); handleSubmit(false); }}>
        <div class="form-group">
          <label for="create-email">Email</label>
          <div class="input-group">
            <Mail />
            <input
              id="create-email"
              type="email"
              bind:value={state.formData.email}
              required
            />
          </div>
        </div>
        <div class="form-group">
          <label for="create-password">Password</label>
          <div class="input-group">
            <Lock />
            <input
              id="create-password"
              type="password"
              bind:value={state.formData.password}
              required
            />
          </div>
        </div>
        <div class="form-group">
          <label for="create-name">Full Name</label>
          <div class="input-group">
            <UserIcon />
            <input
              id="create-name"
              type="text"
              bind:value={state.formData.full_name}
              required
            />
          </div>
        </div>
        <div class="form-group">
          <label for="create-role">Role</label>
          <select id="create-role" bind:value={state.formData.is_superuser}>
            <option value={false}>User</option>
            <option value={true}>Admin</option>
          </select>
        </div>
        <div class="modal-actions">
          <button type="button" class="standard-button" onclick={() => state.showCreateModal = false}>
            Cancel
          </button>
          <button type="submit" class="standard-button primary" disabled={state.isSubmitting}>
            {state.isSubmitting ? 'Creating...' : 'Create User'}
          </button>
        </div>
      </form>
    </div>
  </div>
{/if}

<!-- Edit User Modal -->
{#if state.showEditModal}
  <div 
    class="modal-backdrop" 
    role="dialog"
    aria-modal="true"
    aria-labelledby="edit-modal-title"
    tabindex="-1"
  >
    <button
      class="modal-backdrop-button"
      onclick={() => state.showEditModal = false}
      onkeydown={(e) => e.key === 'Escape' && (state.showEditModal = false)}
      aria-label="Close modal"
    ></button>
    <div 
      class="modal" 
      role="document"
    >
      <h2 id="edit-modal-title">Edit User</h2>
      <form onsubmit={(e) => { e.preventDefault(); handleSubmit(true); }}>
        <div class="form-group">
          <label for="edit-email">Email</label>
          <div class="input-group">
            <Mail />
            <input
              id="edit-email"
              type="email"
              bind:value={state.formData.email}
              required
            />
          </div>
        </div>
        <div class="form-group">
          <label for="edit-password">Password (leave blank to keep current)</label>
          <div class="input-group">
            <Lock />
            <input
              id="edit-password"
              type="password"
              bind:value={state.formData.password}
            />
          </div>
        </div>
        <div class="form-group">
          <label for="edit-name">Full Name</label>
          <div class="input-group">
            <UserIcon />
            <input
              id="edit-name"
              type="text"
              bind:value={state.formData.full_name}
              required
            />
          </div>
        </div>
        <div class="form-group">
          <label for="edit-role">Role</label>
          <select id="edit-role" bind:value={state.formData.is_superuser}>
            <option value={false}>User</option>
            <option value={true}>Admin</option>
          </select>
        </div>
        <div class="modal-actions">
          <button type="button" class="standard-button" onclick={() => state.showEditModal = false}>
            Cancel
          </button>
          <button type="submit" class="standard-button primary" disabled={state.isSubmitting}>
            {state.isSubmitting ? 'Saving...' : 'Save Changes'}
          </button>
        </div>
      </form>
    </div>
  </div>
{/if}

<style>
  /* Only keep component-specific styles that aren't in app.css */
  .user-info h3 {
    margin: 0 0 0.5rem;
  }

  .user-info p {
    margin: 0 0 0.75rem;
  }

  .actions {
    display: flex;
    gap: var(--spacing-sm);
  }

  .modal-backdrop {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(0, 0, 0, 0.5);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 1000;
  }

  .modal {
    position: relative;
    z-index: 1001;
    background-color: var(--input-bg);
    padding: var(--spacing-xl);
    border-radius: var(--border-radius-lg);
    width: 100%;
    max-width: 500px;
    box-shadow: var(--shadow-lg);
  }

  .modal h2 {
    margin: 0 0 var(--spacing-lg);
  }

  .modal-actions {
    display: flex;
    justify-content: flex-end;
    gap: var(--spacing-md);
    margin-top: var(--spacing-xl);
  }

  /* Input group styling to match settings page */
  .input-group {
    position: relative;
    margin-bottom: 1rem;
  }

  .input-group :global(svg) {
    position: absolute;
    left: 1rem;
    top: 50%;
    transform: translateY(-50%);
    width: 20px;
    height: 20px;
    color: var(--secondary-color);
  }

  input {
    width: 100%;
    padding: 0.75rem 1rem 0.75rem 3rem;
    border: 1px solid var(--border-color);
    border-radius: 0.25rem;
    font-size: 1rem;
    transition: border-color 0.2s;
  }

  input:focus {
    outline: none;
    border-color: var(--primary-color);
  }

  h1 {
    margin-bottom: 2rem;
    font-size: 2rem;
    font-weight: 600;
    color: var(--text-color);
  }

  .modal-backdrop-button {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(0, 0, 0, 0.5);
    border: none;
    cursor: pointer;
    z-index: 1000;
  }
</style> 