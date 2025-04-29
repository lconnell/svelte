<!-- src/lib/components/Modal.svelte -->
<script lang="ts">
  import { onMount, onDestroy } from 'svelte';
  import { fade } from 'svelte/transition';

  let { title = '', showModal = false, onClose, children } = $props<{
    title?: string;
    showModal?: boolean;
    onClose?: () => void;
    children: () => unknown;
  }>();
  
  let dialog = $state<HTMLDialogElement | null>(null);
  
  $effect(() => {
    if (showModal && dialog) {
      dialog.showModal();
    } else if (dialog) {
      dialog.close();
    }
  });

  function handleClose() {
    if (onClose) {
      onClose();
    }
  }

  function handleKeydown(event: KeyboardEvent) {
    if (event.key === 'Escape') {
      handleClose();
    }
  }

  onMount(() => {
    window.addEventListener('keydown', handleKeydown);
  });

  onDestroy(() => {
    window.removeEventListener('keydown', handleKeydown);
  });
</script>

{#if showModal}
  <div class="modal-overlay" transition:fade>
    <dialog
      bind:this={dialog}
      class="modal"
      aria-modal="true"
      aria-labelledby="modal-title"
    >
      <div class="modal-header">
        <h2 id="modal-title">{title}</h2>
        <button
          class="close-button"
          aria-label="Close modal"
          onclick={handleClose}
        >
          ×
        </button>
      </div>
      <div class="modal-content">
        {@render children()}
      </div>
    </dialog>
  </div>
{/if}

<style>
  .modal-overlay {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(0, 0, 0, 0.5);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 1000;
  }

  .modal {
    background: white;
    border-radius: var(--border-radius-lg);
    padding: 0;
    border: none;
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
    max-width: 90%;
    max-height: 90vh;
    width: 500px;
  }

  .modal[open] {
    display: block;
  }

  .modal-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: var(--spacing-md);
    border-bottom: 1px solid var(--border-color);
  }

  .modal-content {
    padding: var(--spacing-md);
    overflow-y: auto;
    max-height: calc(90vh - 4rem);
  }

  h2 {
    margin: 0;
    font-size: 1.25rem;
    color: var(--text-color);
  }

  .close-button {
    background: none;
    border: none;
    font-size: 1.5rem;
    cursor: pointer;
    padding: 0.25rem;
    color: var(--secondary-color);
    transition: color 0.2s;
  }

  .close-button:hover {
    color: var(--text-color);
  }
</style> 