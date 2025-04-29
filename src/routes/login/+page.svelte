<!-- src/routes/login/+page.svelte -->
<script lang="ts">
  import { LoginService } from '$lib/api/services/LoginService';
  import { UsersService } from '$lib/api/services/UsersService';
  import { user } from '$lib/stores/auth';
  import { goto } from '$app/navigation';
  import Mail from '~icons/lucide/mail';
  import Lock from '~icons/lucide/lock';
  import AlertCircle from '~icons/lucide/alert-circle';
  import type { User } from '$lib/stores/auth';
  import { setAuthToken } from '$lib/api/auth_helper';

  let email = $state('');
  let password = $state('');
  let loading = $state(false);
  let error = $state('');

  async function handleSubmit() {
    loading = true;
    error = '';

    try {
      console.log('Attempting login with:', email);
      const token = await LoginService.loginLoginAccessToken({
        formData: {
          username: email,
          password: password,
          grant_type: 'password'
        }
      });

      console.log('Login successful, token received');
      // Store token using the helper function
      setAuthToken(token.access_token);

      // Get user data
      console.log('Fetching user data');
      const apiUser = await UsersService.usersReadUserMe();
      
      // Transform API user to our User type
      const transformedUser: User = {
        id: apiUser.id,
        email: apiUser.email,
        name: apiUser.full_name || '',
        role: apiUser.is_superuser ? 'admin' : 'user'
      };

      // Update user store
      user.set(transformedUser);
      console.log('User data set, redirecting to home page');

      // Redirect to dashboard
      goto('/');
    } catch (e) {
      console.error('Login error:', e);
      error = e instanceof Error ? e.message : 'An error occurred during login';
    } finally {
      loading = false;
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

    <form onsubmit={(e) => { e.preventDefault(); handleSubmit(); }}>
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
            disabled={loading}
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
            disabled={loading}
          />
        </div>
      </div>

      <button
        type="submit"
        class="standard-button"
        disabled={loading}
      >
        {#if loading}
          <div class="animate-spin">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
              <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
          </div>
        {/if}
        {loading ? 'Logging in...' : 'Login'}
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