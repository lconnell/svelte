<!-- src/routes/+page.svelte -->
<script lang="ts">
  import type { WorkOrder, User } from '$lib/types';
  import Loader from '~icons/lucide/loader';
  import AlertCircle from '~icons/lucide/alert-circle';
  import Clipboard from '~icons/lucide/clipboard';
  import Users from '~icons/lucide/users';
  import CheckCircle from '~icons/lucide/check-circle';
  import Clock from '~icons/lucide/clock';
  import ArrowRight from '~icons/lucide/arrow-right';

  const state = $state({
    workOrders: [] as WorkOrder[],
    users: [] as User[],
    isLoading: true,
    error: ''
  });

  async function fetchDashboardData() {
    state.isLoading = true;
    state.error = '';

    try {
      const token = localStorage.getItem('auth_token');
      if (!token) {
        throw new Error('Not authenticated');
      }

      const headers = {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      };

      // For now, we'll just fetch users since work orders endpoint doesn't exist yet
      const usersResponse = await fetch('http://localhost:8000/api/v1/users/', {
        headers
      });

      if (!usersResponse.ok) {
        if (usersResponse.status === 401) {
          throw new Error('Session expired. Please login again.');
        }
        throw new Error('Failed to fetch dashboard data');
      }

      // Mock work orders data for now
      state.workOrders = [
        { id: 1, title: 'Sample Work Order 1', status: 'open', created_at: new Date().toISOString() },
        { id: 2, title: 'Sample Work Order 2', status: 'completed', created_at: new Date().toISOString() }
      ];
      
      state.users = await usersResponse.json();
    } catch (err) {
      state.error = err instanceof Error ? err.message : 'An error occurred';
      console.error('Dashboard data fetch error:', err);
    } finally {
      state.isLoading = false;
    }
  }

  // Initial fetch
  fetchDashboardData();
</script>

<div class="dashboard">
  <h1>Dashboard</h1>

  {#if state.isLoading}
    <div class="loading">
      <Loader class="animate-spin" />
      <p>Loading dashboard data...</p>
    </div>
  {:else if state.error}
    <div class="error">
      <AlertCircle />
      <p>{state.error}</p>
    </div>
  {:else}
    <div class="stats-grid">
      <div class="stat-card">
        <div class="stat-icon">
          <Clipboard />
        </div>
        <div class="stat-content">
          <h3>Work Orders</h3>
          <p class="stat-value">{state.workOrders.length}</p>
        </div>
      </div>

      <div class="stat-card">
        <div class="stat-icon">
          <Users />
        </div>
        <div class="stat-content">
          <h3>Users</h3>
          <p class="stat-value">{state.users.length}</p>
        </div>
      </div>

      <div class="stat-card">
        <div class="stat-icon">
          <CheckCircle />
        </div>
        <div class="stat-content">
          <h3>Completed</h3>
          <p class="stat-value">
            {state.workOrders.filter(wo => wo.status === 'completed').length}
          </p>
        </div>
      </div>

      <div class="stat-card">
        <div class="stat-icon">
          <Clock />
        </div>
        <div class="stat-content">
          <h3>Pending</h3>
          <p class="stat-value">
            {state.workOrders.filter(wo => wo.status === 'open').length}
          </p>
        </div>
      </div>
    </div>

    <div class="recent-section">
      <h2>Recent Work Orders</h2>
      {#if state.workOrders.length === 0}
        <p class="empty-state">No work orders found</p>
      {:else}
        <div class="work-orders-list">
          {#each state.workOrders.slice(0, 5) as workOrder}
            <div class="work-order-card">
              <div class="work-order-header">
                <h3>{workOrder.title}</h3>
                <span class="status-badge {workOrder.status}">
                  {workOrder.status}
                </span>
              </div>
              <p class="work-order-description">{workOrder.description}</p>
              <div class="work-order-footer">
                <span class="priority-badge {workOrder.priority}">
                  {workOrder.priority}
                </span>
                <span class="assigned-to">
                  Assigned to: {workOrder.assignedTo?.name || 'Unassigned'}
                </span>
              </div>
            </div>
          {/each}
        </div>
        {#if state.workOrders.length > 5}
          <a href="/work-orders" class="view-all-link">
            View all work orders
            <ArrowRight />
          </a>
        {/if}
      {/if}
    </div>
  {/if}
</div>

<style>
  .dashboard {
    padding: 1rem;
  }

  h1 {
    margin-bottom: 2rem;
    font-size: 2rem;
    font-weight: 600;
  }

  .loading, .error {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding: 2rem;
    text-align: center;
  }

  .loading :global(svg), .error :global(svg) {
    width: 2rem;
    height: 2rem;
    margin-bottom: 1rem;
  }

  .error :global(svg) {
    color: #dc2626;
  }

  .animate-spin {
    animation: spin 1s linear infinite;
  }

  @keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }

  .stats-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
    gap: 1.5rem;
  }

  .stat-card {
    background: white;
    border-radius: 0.5rem;
    padding: 1.5rem;
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
    display: flex;
    align-items: center;
  }

  .stat-icon {
    background-color: #f3f4f6;
    border-radius: 0.5rem;
    padding: 0.75rem;
    margin-right: 1rem;
  }

  .stat-icon :global(svg) {
    width: 1.5rem;
    height: 1.5rem;
    color: #3498db;
  }

  .stat-content h3 {
    font-size: 0.875rem;
    color: #6b7280;
    margin: 0 0 0.25rem;
  }

  .stat-value {
    font-size: 1.5rem;
    font-weight: 600;
    margin: 0;
  }

  .recent-section {
    background: white;
    border-radius: 0.5rem;
    padding: 1.5rem;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
  }

  h2 {
    margin: 0 0 1.5rem;
    color: var(--text-color);
  }

  .empty-state {
    text-align: center;
    padding: 2rem;
    color: var(--secondary-color);
  }

  .work-orders-list {
    display: flex;
    flex-direction: column;
    gap: 1rem;
  }

  .work-order-card {
    border: 1px solid var(--border-color);
    border-radius: 0.375rem;
    padding: 1rem;
  }

  .work-order-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 0.5rem;
  }

  .work-order-header h3 {
    margin: 0;
    font-size: 1rem;
  }

  .work-order-description {
    margin: 0 0 0.75rem;
    color: var(--secondary-color);
    font-size: 0.875rem;
  }

  .work-order-footer {
    display: flex;
    justify-content: space-between;
    align-items: center;
    font-size: 0.75rem;
  }

  .status-badge, .priority-badge {
    padding: 0.25rem 0.5rem;
    border-radius: 1rem;
    font-size: 0.75rem;
    font-weight: 500;
  }

  .status-badge.open {
    background-color: var(--warning-bg);
    color: var(--warning-text);
  }

  .status-badge.in-progress {
    background-color: var(--info-bg);
    color: var(--info-text);
  }

  .status-badge.completed {
    background-color: var(--success-bg);
    color: var(--success-text);
  }

  .priority-badge.low {
    background-color: var(--success-bg);
    color: var(--success-text);
  }

  .priority-badge.medium {
    background-color: var(--warning-bg);
    color: var(--warning-text);
  }

  .priority-badge.high {
    background-color: var(--error-bg);
    color: var(--error-text);
  }

  .assigned-to {
    color: var(--secondary-color);
  }

  .view-all-link {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    margin-top: 1rem;
    color: var(--primary-color);
    text-decoration: none;
    font-weight: 500;
  }

  .view-all-link:hover {
    text-decoration: underline;
  }
</style> 