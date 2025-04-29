<!-- src/routes/users/+page.svelte -->
<script lang="ts">
  import { faPlus, faPencil, faTrash } from '@fortawesome/free-solid-svg-icons';
  import Modal from '$lib/components/Modal.svelte';
  import type { User } from '$lib/types';
  import UserForm from '$lib/components/UserForm.svelte';

  const state = $state({
    users: [] as User[],
    showModal: false,
    modalMode: 'create' as 'create' | 'edit',
    selectedUser: undefined as User | undefined,
    error: '',
    isLoading: false
  });

  async function fetchUsers() {
    state.isLoading = true;
    state.error = '';

    try {
      const response = await fetch('/api/users');
      if (!response.ok) throw new Error('Failed to fetch users');
      state.users = await response.json();
    } catch (err) {
      state.error = err instanceof Error ? err.message : 'An error occurred';
    } finally {
      state.isLoading = false;
    }
  }

  function openCreateModal() {
    state.modalMode = 'create';
    state.selectedUser = undefined;
    state.showModal = true;
  }

  function openEditModal(user: User) {
    state.modalMode = 'edit';
    state.selectedUser = user;
    state.showModal = true;
  }

  async function handleDelete(user: User) {
    if (!confirm('Are you sure you want to delete this user?')) return;

    try {
      const response = await fetch(`/api/users/${user.id}`, {
        method: 'DELETE'
      });

      if (!response.ok) throw new Error('Failed to delete user');

      await fetchUsers();
    } catch (err) {
      state.error = err instanceof Error ? err.message : 'An error occurred';
    }
  }

  async function handleSubmit(formData: { name: string; email: string; role: string; password?: string }) {
    state.error = '';

    try {
      const url = state.modalMode === 'create' 
        ? '/api/users' 
        : `/api/users/${state.selectedUser?.id}`;
      
      const method = state.modalMode === 'create' ? 'POST' : 'PUT';

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
      });

      if (!response.ok) throw new Error('Failed to save user');

      await fetchUsers();
      state.showModal = false;
    } catch (err) {
      state.error = err instanceof Error ? err.message : 'An error occurred';
    }
  }

  // Initial fetch
  fetchUsers();
</script>

<div class="users-container">
  <div class="header">
    <h1>Users</h1>
    <button class="button primary" onclick={openCreateModal}>
      <i class="fa-icon">{faPlus}</i>
      Add User
    </button>
  </div>

  {#if state.error}
    <div class="error-message">{state.error}</div>
  {/if}

  {#if state.isLoading}
    <div class="loading">Loading users...</div>
  {:else}
    <div class="users-grid">
      {#each state.users as user}
        <div class="user-card">
          <div class="user-info">
            <h3>{user.name}</h3>
            <p>{user.email}</p>
            <span class="role-badge">{user.role}</span>
          </div>
          <div class="actions">
            <button class="icon-button" onclick={() => openEditModal(user)}>
              <i class="fa-icon">{faPencil}</i>
            </button>
            <button class="icon-button delete" onclick={() => handleDelete(user)}>
              <i class="fa-icon">{faTrash}</i>
            </button>
          </div>
        </div>
      {/each}
    </div>
  {/if}
</div>

{#if state.showModal}
  <Modal
    showModal={true}
    title={state.modalMode === 'create' ? 'Create User' : 'Edit User'}
    onClose={() => state.showModal = false}
  >
    <UserForm
      user={state.selectedUser}
      onSubmit={handleSubmit}
    />
  </Modal>
{/if}

<style>
  .users-container {
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

  .button {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    padding: 0.75rem 1.5rem;
    border-radius: 0.375rem;
    border: none;
    cursor: pointer;
    transition: all 0.2s;
  }

  .button.primary {
    background-color: var(--primary-color);
    color: white;
  }

  .button.primary:hover {
    background-color: var(--primary-color-dark);
  }

  .fa-icon {
    width: 16px;
  }

  .error-message {
    color: var(--error-color);
    margin-bottom: 1rem;
  }

  .loading {
    text-align: center;
    padding: 2rem;
    color: var(--secondary-color);
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
    align-items: center;
  }

  .user-info h3 {
    margin: 0 0 0.5rem;
    color: var(--text-color);
  }

  .user-info p {
    margin: 0 0 0.5rem;
    color: var(--secondary-color);
  }

  .role-badge {
    display: inline-block;
    padding: 0.25rem 0.75rem;
    background-color: var(--background-color);
    color: var(--secondary-color);
    border-radius: 1rem;
    font-size: 0.875rem;
  }

  .actions {
    display: flex;
    gap: 0.5rem;
  }

  .icon-button {
    background: none;
    border: none;
    padding: 0.5rem;
    cursor: pointer;
    color: var(--secondary-color);
    transition: all 0.2s;
    border-radius: 0.375rem;
  }

  .icon-button:hover {
    background-color: var(--background-color);
    color: var(--text-color);
  }

  .icon-button.delete:hover {
    background-color: var(--error-color);
    color: white;
  }
</style> 