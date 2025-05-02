<script lang="ts">
  type SelectVariant = 'primary' | 'secondary' | 'accent' | 'ghost';
  type SelectSize = 'xs' | 'sm' | 'md' | 'lg';

  let {
    variant = 'primary',
    size = 'md',
    label,
    value,
    options,
    error,
    class: className = '',
    id = Math.random().toString(36).substring(2, 9)
  } = $props<{
    variant?: SelectVariant;
    size?: SelectSize;
    label?: string;
    value?: string;
    options: { value: string; label: string }[];
    error?: string;
    class?: string;
    id?: string;
  }>();

  const variantClasses: Record<SelectVariant, string> = {
    primary: 'select-primary',
    secondary: 'select-secondary',
    accent: 'select-accent',
    ghost: 'select-ghost'
  } as const;

  const sizeClasses: Record<SelectSize, string> = {
    xs: 'select-xs',
    sm: 'select-sm',
    md: 'select-md',
    lg: 'select-lg'
  } as const;
</script>

<div class="form-control w-full">
  {#if label}
    <label for={id} class="label">
      <span class="label-text">{label}</span>
    </label>
  {/if}
  <select
    id={id}
    class="select select-bordered {variantClasses[variant as SelectVariant]} {sizeClasses[size as SelectSize]} {className}"
    {value}
  >
    {#each options as option}
      <option value={option.value}>{option.label}</option>
    {/each}
  </select>
  {#if error}
    <label for={id} class="label">
      <span class="label-text-alt text-error">{error}</span>
    </label>
  {/if}
</div> 