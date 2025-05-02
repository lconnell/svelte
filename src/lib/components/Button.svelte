<script lang="ts">
  type ButtonVariant = 'primary' | 'secondary' | 'accent' | 'ghost' | 'link';
  type ButtonSize = 'xs' | 'sm' | 'md' | 'lg';
  type ButtonShape = 'square' | 'circle';

  let {
    variant = 'primary',
    size = 'md',
    shape,
    loading = false,
    disabled = false,
    type = 'button',
    class: className = '',
    children
  } = $props<{
    variant?: ButtonVariant;
    size?: ButtonSize;
    shape?: ButtonShape;
    loading?: boolean;
    disabled?: boolean;
    type?: 'button' | 'submit' | 'reset';
    class?: string;
    children: () => any;
  }>();

  const variantClasses: Record<ButtonVariant, string> = {
    primary: 'btn-primary',
    secondary: 'btn-secondary',
    accent: 'btn-accent',
    ghost: 'btn-ghost',
    link: 'btn-link'
  } as const;

  const sizeClasses: Record<ButtonSize, string> = {
    xs: 'btn-xs',
    sm: 'btn-sm',
    md: 'btn-md',
    lg: 'btn-lg'
  } as const;

  const shapeClasses: Record<ButtonShape, string> = {
    square: 'btn-square',
    circle: 'btn-circle'
  } as const;
</script>

<button
  class="btn {variantClasses[variant as ButtonVariant]} {sizeClasses[size as ButtonSize]} {shape ? shapeClasses[shape as ButtonShape] : ''} {className}"
  {type}
  {disabled}
>
  {#if loading}
    <span class="loading loading-spinner loading-xs"></span>
  {/if}
  {@render children()}
</button> 