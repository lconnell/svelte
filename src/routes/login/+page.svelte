<!-- src/routes/login/+page.svelte -->
<script lang="ts">
  import { goto } from '$app/navigation';
  import { user } from '$lib/stores/auth';
  import Mail from '~icons/lucide/mail';
  import Lock from '~icons/lucide/lock';
  import AlertCircle from '~icons/lucide/alert-circle';

  let email = $state('');
  let password = $state('');
  let isLoading = $state(false);
  let error = $state('');

  async function handleSubmit() {
    isLoading = true;
    error = '';

    try {
      // Create form data for the request
      const formData = new FormData();
      formData.append('username', email);
      formData.append('password', password);

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
      error = err instanceof Error ? err.message : 'An error occurred during login';
      console.error('Login error:', err);
    } finally {
      isLoading = false;
    }
  }
</script>

<div class="login-container">
  <div class="card">
    <h1>Login</h1>

    {#if error}
      <div class="error-message">
        <AlertCircle />
        <p>{error}</p>
      </div>
    {/if}

    <form onsubmit={handleSubmit}>
      <div class="form-group">
        <label for="email">Email</label>
        <div class="input-wrapper">
          <Mail />
          <input
            type="email"
            id="email"
            bind:value={email}
            placeholder="Enter your email"
            required
            disabled={isLoading}
          />
        </div>
      </div>

      <div class="form-group">
        <label for="password">Password</label>
        <div class="input-wrapper">
          <Lock />
          <input
            type="password"
            id="password"
            bind:value={password}
            placeholder="Enter your password"
            required
            disabled={isLoading}
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
        {isLoading ? 'Logging in...' : 'Login'}
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

  .card {
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

  .form-group {
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

  /* Button styles moved to global CSS */

  .animate-spin {
    animation: spin 1s linear infinite;
  }

  .animate-spin :global(svg) {
    width: 1.25rem;
    height: 1.25rem;
  }

  @keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }
</style> 