<!-- src/routes/login/+page.svelte -->
<script lang="ts">
  import { goto } from '$app/navigation';
  import { user } from '$lib/stores/auth';
  import Mail from '~icons/lucide/mail';
  import Lock from '~icons/lucide/lock';
  import Loader from '~icons/lucide/loader';
  import AlertCircle from '~icons/lucide/alert-circle';

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
      // Create form data for the request
      const formData = new FormData();
      formData.append('username', state.email);
      formData.append('password', state.password);

      const response = await fetch('http://localhost:8000/api/v1/login/access-token', {
        method: 'POST',
        body: formData
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || 'Login failed');
      }

      const data = await response.json();
      localStorage.setItem('auth_token', data.access_token);
      
      // Fetch user data after successful login
      const userResponse = await fetch('http://localhost:8000/api/v1/users/me', {
        headers: {
          'Authorization': `Bearer ${data.access_token}`
        }
      });
      
      if (!userResponse.ok) {
        throw new Error('Failed to fetch user data');
      }
      
      const userData = await userResponse.json();
      user.set(userData);
      goto('/');
    } catch (err) {
      state.error = err instanceof Error ? err.message : 'An error occurred during login';
      console.error('Login error:', err);
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
        <AlertCircle />
        <p>{state.error}</p>
      </div>
    {/if}

    <form onsubmit={handleSubmit}>
      <div class="input-group">
        <label for="email">Email</label>
        <div class="input-wrapper">
          <Mail />
          <input
            type="email"
            id="email"
            bind:value={state.email}
            placeholder="Enter your email"
            required
            disabled={state.isLoading}
          />
        </div>
      </div>

      <div class="input-group">
        <label for="password">Password</label>
        <div class="input-wrapper">
          <Lock />
          <input
            type="password"
            id="password"
            bind:value={state.password}
            placeholder="Enter your password"
            required
            disabled={state.isLoading}
          />
        </div>
      </div>

      <button type="submit" disabled={state.isLoading}>
        {#if state.isLoading}
          <Loader class="animate-spin" />
          <span>Logging in...</span>
        {:else}
          <span>Login</span>
        {/if}
      </button>
    </form>
  </div>
</div>

<style>
  .login-container {
    min-height: 100vh;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 1rem;
    background-color: #f3f4f6;
  }

  .login-card {
    background: white;
    padding: 2rem;
    border-radius: 0.5rem;
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
    width: 100%;
    max-width: 400px;
  }

  h1 {
    margin: 0 0 1.5rem;
    font-size: 1.5rem;
    font-weight: 600;
    text-align: center;
  }

  .error-message {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    padding: 0.75rem;
    margin-bottom: 1rem;
    background-color: #fee2e2;
    border: 1px solid #fecaca;
    border-radius: 0.375rem;
    color: #dc2626;
  }

  .error-message :global(svg) {
    width: 1.25rem;
    height: 1.25rem;
    flex-shrink: 0;
  }

  .input-group {
    margin-bottom: 1rem;
  }

  label {
    display: block;
    margin-bottom: 0.5rem;
    font-size: 0.875rem;
    font-weight: 500;
    color: #374151;
  }

  .input-wrapper {
    position: relative;
  }

  .input-wrapper :global(svg) {
    position: absolute;
    left: 1rem;
    top: 50%;
    transform: translateY(-50%);
    width: 20px;
    height: 20px;
    color: #9ca3af;
    pointer-events: none;
  }

  input {
    width: 100%;
    padding: 0.75rem 1rem 0.75rem 3rem;
    border: 1px solid #d1d5db;
    border-radius: 0.375rem;
    font-size: 0.875rem;
    transition: border-color 0.15s ease-in-out;
  }

  input:focus {
    outline: none;
    border-color: #3498db;
    box-shadow: 0 0 0 3px rgba(52, 152, 219, 0.1);
  }

  input:disabled {
    background-color: #f3f4f6;
    cursor: not-allowed;
  }

  button {
    width: 100%;
    padding: 0.75rem;
    background-color: #3498db;
    color: white;
    border: none;
    border-radius: 0.375rem;
    font-size: 0.875rem;
    font-weight: 500;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 0.5rem;
    cursor: pointer;
    transition: background-color 0.15s ease-in-out;
  }

  button:hover:not(:disabled) {
    background-color: #2980b9;
  }

  button:disabled {
    opacity: 0.7;
    cursor: not-allowed;
  }

  .animate-spin {
    animation: spin 1s linear infinite;
  }

  @keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }
</style> 