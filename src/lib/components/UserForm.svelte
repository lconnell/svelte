<!-- src/lib/components/UserForm.svelte -->
<script lang="ts">
  import type { User } from '$lib/types/user';

  let { props } = $props<{
    user?: User;
    onSubmit: (data: typeof formData) => void;
  }>();

  const formData = $state({
    name: props.user?.name ?? '',
    email: props.user?.email ?? '',
    role: props.user?.role ?? 'user',
    password: ''
  });

  function handleSubmit(event: Event) {
    event.preventDefault();
    props.onSubmit(formData);
  }
</script>

<form onsubmit={handleSubmit}>
  <div class="form-group">
    <label for="name">Name</label>
    <input
      type="text"
      id="name"
      bind:value={formData.name}
      required
    />
  </div>

  <div class="form-group">
    <label for="email">Email</label>
    <input
      type="email"
      id="email"
      bind:value={formData.email}
      required
    />
  </div>

  <div class="form-group">
    <label for="role">Role</label>
    <select
      id="role"
      bind:value={formData.role}
      required
    >
      <option value="user">User</option>
      <option value="admin">Admin</option>
    </select>
  </div>

  {#if !props.user}
    <div class="form-group">
      <label for="password">Password</label>
      <input
        type="password"
        id="password"
        bind:value={formData.password}
        required={!props.user}
      />
    </div>
  {/if}

  <button type="submit" class="button primary">
    {props.user ? 'Update' : 'Create'} User
  </button>
</form>

<style>
  .form-group {
    margin-bottom: 1rem;
  }

  label {
    display: block;
    margin-bottom: 0.5rem;
    font-weight: 500;
  }

  input,
  select {
    width: 100%;
    padding: 0.5rem;
    border: 1px solid var(--border-color);
    border-radius: var(--border-radius-sm);
    font-size: 1rem;
  }

  input:focus,
  select:focus {
    outline: none;
    border-color: var(--primary-color);
    box-shadow: 0 0 0 2px rgba(59, 130, 246, 0.1);
  }

  .button {
    background-color: var(--primary-color);
    color: white;
    padding: 0.5rem 1rem;
    border: none;
    border-radius: var(--border-radius-sm);
    font-size: 1rem;
    cursor: pointer;
    transition: background-color 0.2s;
  }

  .button:hover {
    background-color: var(--primary-hover);
  }
</style> 