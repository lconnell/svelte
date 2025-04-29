<!-- src/routes/+page.svelte -->
<script lang="ts">
  import { Clipboard, Users, Loader, CheckCircle } from 'lucide-svelte';
  import type { WorkOrder, User } from '$lib/types';

  interface DashboardState {
    workOrders: WorkOrder[];
    users: User[];
    loading: boolean;
    error: string | null;
  }

  const state = $state<DashboardState>({
    workOrders: [],
    users: [],
    loading: true,
    error: null
  });

  $effect(() => {
    loadData();
  });

  async function loadData() {
    try {
      const [workOrdersRes, usersRes] = await Promise.all([
        fetch('/api/work-orders'),
        fetch('/api/users')
      ]);

      if (!workOrdersRes.ok || !usersRes.ok) {
        throw new Error('Failed to load data');
      }

      state.workOrders = await workOrdersRes.json();
      state.users = await usersRes.json();
      state.loading = false;
    } catch (error) {
      state.error = error instanceof Error ? error.message : 'An error occurred';
      state.loading = false;
    }
  }
</script>

<div class="dashboard">
  {#if state.loading}
    <div class="loading">
      <Loader size={32} class="spin" />
      <p>Loading...</p>
    </div>
  {:else if state.error}
    <div class="error">
      <p>{state.error}</p>
      <button onclick={loadData}>Retry</button>
    </div>
  {:else}
    <div class="stats">
      <div class="stat-card">
        <div class="icon">
          <Clipboard size={24} />
        </div>
        <div class="content">
          <h3>Work Orders</h3>
          <p class="count">{state.workOrders.length}</p>
        </div>
      </div>

      <div class="stat-card">
        <div class="icon">
          <Users size={24} />
        </div>
        <div class="content">
          <h3>Users</h3>
          <p class="count">{state.users.length}</p>
        </div>
      </div>

      <div class="stat-card">
        <div class="icon">
          <CheckCircle size={24} />
        </div>
        <div class="content">
          <h3>Completed</h3>
          <p class="count">
            {state.workOrders.filter((wo: WorkOrder) => wo.status === 'completed').length}
          </p>
        </div>
      </div>
    </div>
  {/if}
</div>

<style>
  .dashboard {
    padding: 20px;
  }

  .loading {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    height: 200px;
  }

  .loading :global(.spin) {
    animation: spin 1s linear infinite;
  }

  @keyframes spin {
    from { transform: rotate(0deg); }
    to { transform: rotate(360deg); }
  }

  .error {
    text-align: center;
    color: #ef4444;
  }

  .error button {
    margin-top: 10px;
    padding: 8px 16px;
    background-color: #ef4444;
    color: white;
    border: none;
    border-radius: 4px;
    cursor: pointer;
  }

  .stats {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
    gap: 20px;
  }

  .stat-card {
    background-color: white;
    border-radius: 8px;
    padding: 20px;
    display: flex;
    align-items: center;
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  }

  .icon {
    background-color: #f3f4f6;
    padding: 12px;
    border-radius: 8px;
    margin-right: 16px;
    color: #4b5563;
  }

  .content h3 {
    margin: 0;
    font-size: 0.875rem;
    color: #6b7280;
  }

  .count {
    margin: 4px 0 0;
    font-size: 1.5rem;
    font-weight: 600;
    color: #111827;
  }
</style> 