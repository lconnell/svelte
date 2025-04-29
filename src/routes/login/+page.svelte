<!-- src/routes/login/+page.svelte -->
<script lang="ts">
  import { goto } from '$app/navigation';
  import { user } from '$lib/stores/auth';
  import Mail from '~icons/lucide/mail';
  import Lock from '~icons/lucide/lock';

  const state = $state({
    email: '',
    password: '',
    isLoading: false,
    error: ''
  });

  async function handleSubmit() {
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

      const data = await response.json();
      user.set(data.user);
      goto('/');
    } catch (err) {
      state.error = err instanceof Error ? err.message : 'An error occurred';
    } finally {
      state.isLoading = false;
    }
  }
</script>

<div class="login-container">
  <div class="login-card">
    <h1>Login</h1>

    {#if state.error}
      <div class="error-message">
        {state.error}
      </div>
    {/if}

    <form onsubmit={handleSubmit}>
      <div class="input-group">
        <Mail />
        <input
          type="email"
          placeholder="Email"
          bind:value={state.email}
          required
        />
      </div>

      <div class="input-group">
        <Lock />
        <input
          type="password"
          placeholder="Password"
          bind:value={state.password}
          required
        />
      </div>

      <button type="submit" disabled={state.isLoading}>
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
    padding: 1rem;
    background-color: var(--background-color);
  }

  .login-card {
    width: 100%;
    max-width: 400px;
    padding: 2rem;
    background: white;
    border-radius: 0.5rem;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  }

  h1 {
    margin: 0 0 2rem;
    text-align: center;
    color: var(--primary-color);
  }

  .error-message {
    padding: 0.75rem;
    margin-bottom: 1rem;
    background-color: var(--error-bg);
    color: var(--error-text);
    border-radius: 0.25rem;
    text-align: center;
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