<!-- src/routes/work-orders/+page.svelte -->
<script lang="ts">
  import type { WorkOrder } from '$lib/types';
  import Modal from '$lib/components/Modal.svelte';
  import WorkOrderForm from '$lib/components/WorkOrderForm.svelte';

  let { props } = $props<{
    workOrders: WorkOrder[];
  }>();

  let state = $state({
    showModal: false,
    selectedWorkOrder: undefined as WorkOrder | undefined,
    workOrders: props.workOrders
  });

  function handleCreateWorkOrder() {
    state.showModal = true;
    state.selectedWorkOrder = undefined;
  }

  function handleEditWorkOrder(workOrder: WorkOrder) {
    state.showModal = true;
    state.selectedWorkOrder = workOrder;
  }

  function handleModalClose() {
    state.showModal = false;
    state.selectedWorkOrder = undefined;
  }

  function handleWorkOrderSuccess(workOrder: WorkOrder) {
    if (state.selectedWorkOrder) {
      state.workOrders = state.workOrders.map((wo: WorkOrder) => 
        wo.id === workOrder.id ? workOrder : wo
      );
    } else {
      state.workOrders = [...state.workOrders, workOrder];
    }
    handleModalClose();
  }
</script>

<div class="container">
  <div class="header">
    <h1>Work Orders</h1>
    <button class="create-button" onclick={handleCreateWorkOrder}>
      Create Work Order
    </button>
  </div>

  <div class="work-orders-grid">
    {#each state.workOrders as workOrder}
      <div class="work-order-card">
        <h3>{workOrder.title}</h3>
        <p>{workOrder.description}</p>
        <div class="work-order-meta">
          <span class="status {workOrder.status}">{workOrder.status}</span>
          <span class="priority {workOrder.priority}">{workOrder.priority}</span>
        </div>
        <button class="edit-button" onclick={() => handleEditWorkOrder(workOrder)}>
          Edit
        </button>
      </div>
    {/each}
  </div>

  {#if state.showModal}
    <Modal
      title={state.selectedWorkOrder ? 'Edit Work Order' : 'Create Work Order'}
      showModal={true}
      onClose={handleModalClose}
    >
      <WorkOrderForm
        workOrder={state.selectedWorkOrder}
        onSuccess={handleWorkOrderSuccess}
      />
    </Modal>
  {/if}
</div>

<style>
  .container {
    padding: 2rem;
    max-width: 1200px;
    margin: 0 auto;
  }

  .header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 2rem;
  }

  .create-button {
    background-color: #4299e1;
    color: white;
    padding: 0.5rem 1rem;
    border-radius: 0.375rem;
    border: none;
    cursor: pointer;
    font-weight: 500;
    transition: background-color 0.2s;
  }

  .create-button:hover {
    background-color: #3182ce;
  }

  .work-orders-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
    gap: 1.5rem;
  }

  .work-order-card {
    background-color: white;
    border-radius: 0.5rem;
    padding: 1.5rem;
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  }

  .work-order-card h3 {
    margin: 0 0 0.5rem 0;
    color: #2d3748;
  }

  .work-order-card p {
    margin: 0 0 1rem 0;
    color: #4a5568;
  }

  .work-order-meta {
    display: flex;
    gap: 0.5rem;
    margin-bottom: 1rem;
  }

  .status, .priority {
    padding: 0.25rem 0.5rem;
    border-radius: 0.25rem;
    font-size: 0.875rem;
    font-weight: 500;
  }

  .status.open { background-color: #ebf8ff; color: #2b6cb0; }
  .status.in_progress { background-color: #faf5ff; color: #6b46c1; }
  .status.completed { background-color: #f0fff4; color: #2f855a; }
  .status.cancelled { background-color: #fff5f5; color: #c53030; }

  .priority.low { background-color: #f0fff4; color: #2f855a; }
  .priority.medium { background-color: #faf5ff; color: #6b46c1; }
  .priority.high { background-color: #fff5f5; color: #c53030; }

  .edit-button {
    background-color: #edf2f7;
    color: #4a5568;
    padding: 0.5rem 1rem;
    border-radius: 0.375rem;
    border: none;
    cursor: pointer;
    font-weight: 500;
    transition: all 0.2s;
  }

  .edit-button:hover {
    background-color: #e2e8f0;
    color: #2d3748;
  }
</style> 