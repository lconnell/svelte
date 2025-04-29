<!-- src/routes/settings/+page.svelte -->
<script lang="ts">
  import { user } from '$lib/stores/auth';
  import User from '~icons/lucide/user';
  import Mail from '~icons/lucide/mail';
  import Lock from '~icons/lucide/lock';

  const state = $state({
    name: $user?.name || '',
    email: $user?.email || '',
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
    isLoading: false,
    error: '',
    success: ''
  });

  async function handleSubmit() {
    state.isLoading = true;
    state.error = '';
    state.success = '';

    // Validate passwords match
    if (state.newPassword && state.newPassword !== state.confirmPassword) {
      state.error = 'New passwords do not match';
      state.isLoading = false;
      return;
    }

    try {
      const response = await fetch('/api/users/profile', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          name: state.name,
          email: state.email,
          currentPassword: state.currentPassword || undefined,
          newPassword: state.newPassword || undefined
        })
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.message || 'Failed to update profile');
      }

      const updatedUser = await response.json();
      user.set(updatedUser);
      state.success = 'Profile updated successfully';
      
      // Clear password fields
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

<div class="settings-page">
  <h1>Account Settings</h1>

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

  <form onsubmit={handleSubmit}>
    <div class="form-section">
      <h2>Profile Information</h2>
      
      <div class="input-group">
        <User />
        <input
          type="text"
          placeholder="Name"
          bind:value={state.name}
          required
        />
      </div>

      <div class="input-group">
        <Mail />
        <input
          type="email"
          placeholder="Email"
          bind:value={state.email}
          required
        />
      </div>
    </div>

    <div class="form-section">
      <h2>Change Password</h2>
      <p class="section-description">
        Leave these fields blank if you don't want to change your password.
      </p>
      
      <div class="input-group">
        <Lock />
        <input
          type="password"
          placeholder="Current Password"
          bind:value={state.currentPassword}
        />
      </div>

      <div class="input-group">
        <Lock />
        <input
          type="password"
          placeholder="New Password"
          bind:value={state.newPassword}
        />
      </div>

      <div class="input-group">
        <Lock />
        <input
          type="password"
          placeholder="Confirm New Password"
          bind:value={state.confirmPassword}
        />
      </div>
    </div>

    <button type="submit" disabled={state.isLoading}>
      {state.isLoading ? 'Saving...' : 'Save Changes'}
    </button>
  </form>
</div>

<style>
  .settings-page {
    padding: 2rem;
    max-width: 600px;
    margin: 0 auto;
  }

  h1 {
    margin: 0 0 2rem;
    color: var(--primary-color);
  }

  .error-message,
  .success-message {
    padding: 0.75rem;
    margin-bottom: 1.5rem;
    border-radius: 0.25rem;
    text-align: center;
  }

  .error-message {
    background-color: var(--error-bg);
    color: var(--error-text);
  }

  .success-message {
    background-color: var(--success-bg);
    color: var(--success-text);
  }

  .form-section {
    background: white;
    border-radius: 0.5rem;
    padding: 1.5rem;
    margin-bottom: 1.5rem;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
  }

  h2 {
    margin: 0 0 1rem;
    font-size: 1.25rem;
    color: var(--text-color);
  }

  .section-description {
    margin: 0 0 1rem;
    color: var(--secondary-color);
    font-size: 0.875rem;
  }

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

  button {
    width: 100%;
    padding: 0.75rem;
    background-color: var(--primary-color);
    color: white;
    border: none;
    border-radius: 0.25rem;
    font-size: 1rem;
    cursor: pointer;
    transition: background-color 0.2s;
  }

  button:hover:not(:disabled) {
    background-color: var(--primary-dark);
  }

  button:disabled {
    opacity: 0.7;
    cursor: not-allowed;
  }
</style> 