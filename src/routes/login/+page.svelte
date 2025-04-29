<!-- src/routes/login/+page.svelte -->
<script lang="ts">
  import { goto } from '$app/navigation';
  import { faEnvelope, faLock } from '@fortawesome/free-solid-svg-icons';

  const state = $state({
    email: '',
    password: '',
    error: '',
    isLoading: false
  });

  async function handleSubmit(event: Event) {
    event.preventDefault();
    state.isLoading = true;
    state.error = '';

    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          email: state.email,
          password: state.password
        })
      });

      if (!response.ok) {
        throw new Error('Invalid credentials');
      }

      await goto('/dashboard');
    } catch (err) {
      state.error = err instanceof Error ? err.message : 'An error occurred';
    } finally {
      state.isLoading = false;
    }
  }
</script>

<div class="login-container">
  <div class="login-card">
    <h1>Work Order App</h1>
    <form onsubmit={handleSubmit}>
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
          autocomplete="email"
        />
      </div>

      <div class="form-group">
        <label for="password">
          <i class="fa-icon">{faLock}</i>
          Password
        </label>
        <input
          type="password"
          id="password"
          bind:value={state.password}
          required
          autocomplete="current-password"
        />
      </div>

      {#if state.error}
        <div class="error-message">
          {state.error}
        </div>
      {/if}

      <button
        type="submit"
        class="button login-button"
        disabled={state.isLoading}
      >
        {state.isLoading ? 'Logging in...' : 'Login'}
      </button>
    </form>
  </div>
</div>

<style>
  .login-container {
    display: flex;
    align-items: center;
    justify-content: center;
    min-height: 100vh;
    background-color: var(--background-color);
  }

  .login-card {
    background: white;
    padding: 2rem;
    border-radius: 0.5rem;
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
    width: 100%;
    max-width: 400px;
  }

  h1 {
    text-align: center;
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

  .login-button {
    width: 100%;
    margin-top: 1rem;
    padding: 0.75rem;
  }

  .login-button:disabled {
    opacity: 0.7;
    cursor: not-allowed;
  }
</style> 