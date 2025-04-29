<!-- src/routes/settings/+page.svelte -->
<script lang="ts">
  import { user } from '$lib/stores/auth';
  import User from '~icons/lucide/user';
  import Mail from '~icons/lucide/mail';
  import Lock from '~icons/lucide/lock';

  let name = $state($user?.name || '');
  let email = $state($user?.email || '');
  let currentPassword = $state('');
  let newPassword = $state('');
  let confirmPassword = $state('');
  let isLoading = $state(false);
  let error = $state('');
  let success = $state('');

  async function handleSubmit() {
    isLoading = true;
    error = '';
    success = '';

    // Validate passwords match
    if (newPassword && newPassword !== confirmPassword) {
      error = 'New passwords do not match';
      isLoading = false;
      return;
    }

    try {
      const response = await fetch('/api/users/profile', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          name,
          email,
          currentPassword: currentPassword || undefined,
          newPassword: newPassword || undefined
        })
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.message || 'Failed to update profile');
      }

      const updatedUser = await response.json();
      user.set(updatedUser);
      success = 'Profile updated successfully';
      
      // Clear password fields
      currentPassword = '';
      newPassword = '';
      confirmPassword = '';
    } catch (err) {
      error = err instanceof Error ? err.message : 'An error occurred';
    } finally {
      isLoading = false;
    }
  }
</script>

<div class="settings-page">
  <h1>Account Settings</h1>

  {#if error}
    <div class="error-message">
      {error}
    </div>
  {/if}

  {#if success}
    <div class="success-message">
      {success}
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
          bind:value={name}
          required
        />
      </div>

      <div class="input-group">
        <Mail />
        <input
          type="email"
          placeholder="Email"
          bind:value={email}
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
          bind:value={currentPassword}
        />
      </div>

      <div class="input-group">
        <Lock />
        <input
          type="password"
          placeholder="New Password"
          bind:value={newPassword}
        />
      </div>

      <div class="input-group">
        <Lock />
        <input
          type="password"
          placeholder="Confirm New Password"
          bind:value={confirmPassword}
        />
      </div>
    </div>

    <button
      type="submit"
      class="standard-button"
      disabled={isLoading}
    >
      {#if isLoading}
        <div class="animate-spin">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
            <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
        </div>
      {/if}
      {isLoading ? 'Saving...' : 'Save Changes'}
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
</style> 