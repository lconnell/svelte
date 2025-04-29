<!-- src/routes/settings/+page.svelte -->
<script lang="ts">
  import { faUser, faEnvelope, faLock } from '@fortawesome/free-solid-svg-icons';

  const state = $state({
    name: '',
    email: '',
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
    error: '',
    success: '',
    isLoading: false
  });

  async function handleSubmit(event: Event) {
    event.preventDefault();
    state.isLoading = true;
    state.error = '';
    state.success = '';

    try {
      const response = await fetch('/api/users/profile', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          name: state.name,
          email: state.email,
          currentPassword: state.currentPassword,
          newPassword: state.newPassword
        })
      });

      if (!response.ok) {
        throw new Error('Failed to update profile');
      }

      state.success = 'Profile updated successfully';
      state.currentPassword = '';
      state.newPassword = '';
      state.confirmPassword = '';
    } catch (err) {
      state.error = err instanceof Error ? err.message : 'An error occurred';
    } finally {
      state.isLoading = false;
    }
  }
</script>

<div class="settings-container">
  <h1>Settings</h1>
  <form onsubmit={handleSubmit}>
    <div class="form-group">
      <label for="name">
        <i class="fa-icon">{faUser}</i>
        Name
      </label>
      <input
        type="text"
        id="name"
        bind:value={state.name}
        required
      />
    </div>

    <div class="form-group">
      <label for="email">
        <i class="fa-icon">{faEnvelope}</i>
        Email
      </label>
      <input
        type="email"
        id="email"
        bind:value={state.email}
        required
      />
    </div>

    <div class="form-group">
      <label for="currentPassword">
        <i class="fa-icon">{faLock}</i>
        Current Password
      </label>
      <input
        type="password"
        id="currentPassword"
        bind:value={state.currentPassword}
      />
    </div>

    <div class="form-group">
      <label for="newPassword">
        <i class="fa-icon">{faLock}</i>
        New Password
      </label>
      <input
        type="password"
        id="newPassword"
        bind:value={state.newPassword}
      />
    </div>

    <div class="form-group">
      <label for="confirmPassword">
        <i class="fa-icon">{faLock}</i>
        Confirm New Password
      </label>
      <input
        type="password"
        id="confirmPassword"
        bind:value={state.confirmPassword}
      />
    </div>

    {#if state.error}
      <div class="error-message">
        {state.error}
      </div>
    {/if}

    {#if state.success}
      <div class="success-message">
        {state.success}
      </div>
    {/if}

    <button
      type="submit"
      class="button primary"
      disabled={state.isLoading}
    >
      {state.isLoading ? 'Saving...' : 'Save Changes'}
    </button>
  </form>
</div>

<style>
  .settings-container {
    max-width: 600px;
    margin: 0 auto;
    padding: 2rem;
  }

  h1 {
    margin-bottom: 2rem;
    color: var(--primary-color);
  }

  .form-group {
    margin-bottom: 1.5rem;
  }

  label {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    margin-bottom: 0.5rem;
  }

  .fa-icon {
    width: 16px;
    color: var(--secondary-color);
  }

  input {
    width: 100%;
    padding: 0.75rem;
    border: 1px solid var(--border-color);
    border-radius: 0.375rem;
    transition: border-color 0.2s;
  }

  input:focus {
    outline: none;
    border-color: var(--primary-color);
  }

  .error-message {
    color: var(--error-color);
    margin-bottom: 1rem;
  }

  .success-message {
    color: var(--success-color);
    margin-bottom: 1rem;
  }

  .button {
    width: 100%;
    padding: 0.75rem;
  }

  .button:disabled {
    opacity: 0.7;
    cursor: not-allowed;
  }
</style> 