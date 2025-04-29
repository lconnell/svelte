<!-- src/lib/components/WorkOrderForm.svelte -->
<script lang="ts">
  import type { WorkOrder } from '$lib/types/workOrder';
  import type { User } from '$lib/types/user';

  let { workOrder, onSuccess } = $props<{
    workOrder?: WorkOrder;
    onSuccess: (workOrder: WorkOrder) => void;
  }>();

  const state = $state({
    users: [] as User[],
    isLoading: false,
    error: '',
    formData: {
      title: workOrder?.title ?? '',
      description: workOrder?.description ?? '',
      status: workOrder?.status ?? 'open',
      priority: workOrder?.priority ?? 'medium',
      assignedTo: workOrder?.assignedTo?.id ?? ''
    }
  });

  async function fetchUsers() {
    state.isLoading = true;
    try {
      const response = await fetch('/api/users');
      if (!response.ok) throw new Error('Failed to fetch users');
      state.users = await response.json();
    } catch (err) {
      state.error = err instanceof Error ? err.message : 'An error occurred';
    } finally {
      state.isLoading = false;
    }
  }

  async function handleSubmit(event: Event) {
    event.preventDefault();
    state.isLoading = true;
    state.error = '';

    try {
      const url = workOrder 
        ? `/api/work-orders/${workOrder.id}`
        : '/api/work-orders';
      
      const response = await fetch(url, {
        method: workOrder ? 'PUT' : 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(state.formData)
      });

      if (!response.ok) throw new Error('Failed to save work order');
      const savedWorkOrder = await response.json();
      onSuccess(savedWorkOrder);
    } catch (err) {
      state.error = err instanceof Error ? err.message : 'An error occurred';
    } finally {
      state.isLoading = false;
    }
  }

  // Fetch users on mount
  $effect(() => {
    fetchUsers();
  });
</script>

<form class="work-order-form" onsubmit={handleSubmit}>
  {#if state.error}
    <div class="error-message">{state.error}</div>
  {/if}

  <div class="form-group">
    <label for="title">Title</label>
    <input
      type="text"
      id="title"
      bind:value={state.formData.title}
      required
      placeholder="Enter work order title"
    />
  </div>

  <div class="form-group">
    <label for="description">Description</label>
    <textarea
      id="description"
      bind:value={state.formData.description}
      required
      placeholder="Enter work order description"
      rows="4"
    ></textarea>
  </div>

  <div class="form-group">
    <label for="status">Status</label>
    <select id="status" bind:value={state.formData.status}>
      <option value="open">Open</option>
      <option value="in_progress">In Progress</option>
      <option value="completed">Completed</option>
      <option value="cancelled">Cancelled</option>
    </select>
  </div>

  <div class="form-group">
    <label for="priority">Priority</label>
    <select id="priority" bind:value={state.formData.priority}>
      <option value="low">Low</option>
      <option value="medium">Medium</option>
      <option value="high">High</option>
    </select>
  </div>

  <div class="form-group">
    <label for="assignedTo">Assigned To</label>
    <select id="assignedTo" bind:value={state.formData.assignedTo} required>
      <option value="">Select a user</option>
      {#each state.users as user}
        <option value={user.id}>{user.name}</option>
      {/each}
    </select>
  </div>

  <div class="form-actions">
    <button type="submit" class="button primary" disabled={state.isLoading}>
      {state.isLoading ? 'Saving...' : workOrder ? 'Update Work Order' : 'Create Work Order'}
    </button>
  </div>
</form>

<style>
  .work-order-form {
    display: flex;
    flex-direction: column;
    gap: var(--spacing-md);
    max-width: 600px;
    margin: 0 auto;
  }

  .form-group {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
  }

  label {
    font-weight: 500;
    color: var(--text-color);
  }

  input,
  textarea,
  select {
    padding: 0.5rem;
    border: 1px solid var(--border-color);
    border-radius: var(--border-radius);
    background-color: var(--input-bg);
    color: var(--text-color);
    font-size: 1rem;
  }

  input:focus,
  textarea:focus,
  select:focus {
    outline: none;
    border-color: var(--primary-color);
    box-shadow: 0 0 0 2px var(--primary-color-light);
  }

  .error-message {
    padding: 0.75rem;
    border-radius: var(--border-radius);
    background-color: var(--error-bg);
    color: var(--error-color);
    margin-bottom: 1rem;
  }

  .form-actions {
    display: flex;
    justify-content: flex-end;
    margin-top: var(--spacing-md);
  }

  button[type="submit"] {
    min-width: 120px;
  }

  button[type="submit"]:disabled {
    opacity: 0.7;
    cursor: not-allowed;
  }
</style> 