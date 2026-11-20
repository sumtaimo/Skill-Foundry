import { forwardRef, useId } from 'react';
import type { ButtonHTMLAttributes, MouseEvent, ReactNode } from 'react';

/**
 * Button, built from design/components/button.md.
 * Tailwind v3: every colour, size, radius and duration is an arbitrary value that reads a variable from
 * design/tokens.css (load that file before the app's CSS). No raw colour, no raw px size.
 */

export type ButtonVariant = 'primary' | 'secondary' | 'danger';
export type ButtonSize = 'sm' | 'md' | 'lg';

type NativeProps = Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'type' | 'children'>;

interface BaseProps extends NativeProps {
  variant?: ButtonVariant;
  size?: ButtonSize;
  /** Work in progress: size is locked, aria-busy is set, a second activation is ignored. */
  loading?: boolean;
  /** The action failed: the message is shown beside the button and the label becomes retryLabel. */
  error?: string;
  /** Label of the button while an error is shown. */
  retryLabel?: string;
  /** Keeps the button focusable (aria-disabled) and explains why it cannot be used now. */
  disabledReason?: string;
  /** Toggle button: sets aria-pressed. */
  pressed?: boolean;
  /** Optional decorative icon before the label. */
  icon?: ReactNode;
  type?: 'button' | 'submit' | 'reset';
}

type LabelProps =
  | { children: ReactNode; iconOnly?: false }
  // Icon-only buttons need a name that says the action, not the icon.
  | { children?: undefined; iconOnly: true; 'aria-label': string; icon: ReactNode };

export type ButtonProps = BaseProps & LabelProps;

const base = [
  'relative inline-flex items-center justify-center gap-[var(--space-8)]',
  'rounded-[var(--button-radius)] border-[length:var(--border-width-hairline)]',
  'text-[length:var(--font-size-md)] font-[number:var(--font-weight-strong)]',
  'whitespace-normal text-center',
  // Khmer: taller line, no letter spacing; the control grows from its minimum height.
  '[&:lang(km)]:leading-[var(--line-height-khmer)] [&:lang(km)]:tracking-[0]',
  'transition-colors duration-[var(--duration-fast)] ease-[var(--ease-standard)] motion-reduce:transition-none',
  // Keyboard focus only, drawn outside the container, never removed.
  'focus-visible:outline-none focus-visible:ring-[length:var(--border-width-focus)] focus-visible:ring-[color:var(--color-border-focus)]',
].join(' ');

const sizes: Record<ButtonSize, string> = {
  sm: 'min-h-[var(--control-height-sm)] px-[var(--space-12)]',
  md: 'min-h-[var(--button-height)] px-[var(--button-padding-x)]',
  lg: 'min-h-[var(--control-height-lg)] px-[var(--space-24)]',
};

const iconOnlySize = 'min-h-[var(--size-target-min)] min-w-[var(--size-target-min)] px-0';

const variants: Record<ButtonVariant, string> = {
  primary:
    'border-transparent bg-[color:var(--button-primary-bg)] text-[color:var(--button-primary-text)] ' +
    'hover:bg-[color:var(--button-primary-bg-hover)] active:bg-[color:var(--button-primary-bg-pressed)]',
  secondary:
    'border-[color:var(--button-secondary-border)] bg-transparent text-[color:var(--button-secondary-text)] ' +
    'hover:bg-[color:var(--color-selected-bg)] active:bg-[color:var(--color-selected-bg)] active:text-[color:var(--color-selected-text)]',
  // The spec lists no danger hover or pressed variable: a filter darkens the fill instead of a new colour.
  danger:
    'border-transparent bg-[color:var(--color-danger-bg)] text-[color:var(--color-danger-text-on)] ' +
    'hover:brightness-90 active:brightness-75',
};

const inactive =
  'cursor-not-allowed border-transparent bg-[color:var(--color-surface-sunken)] text-[color:var(--color-text-disabled)]';

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(function Button(props, ref) {
  const {
    variant = 'primary',
    size = 'md',
    loading = false,
    error,
    retryLabel = 'Try again',
    disabledReason,
    pressed,
    icon,
    iconOnly,
    type = 'button',
    className = '',
    children,
    disabled,
    onClick,
    ...rest
  } = props as BaseProps & { children?: ReactNode; iconOnly?: boolean };

  const messageId = useId();
  const reasonId = useId();
  const explainedOff = Boolean(disabledReason) && !disabled;
  const blocked = Boolean(disabled) || explainedOff;
  const busy = loading && !blocked;
  const describedBy =
    [rest['aria-describedby'], error ? messageId : undefined, explainedOff ? reasonId : undefined]
      .filter(Boolean)
      .join(' ') || undefined;

  const handleClick = (event: MouseEvent<HTMLButtonElement>) => {
    // A second activation while loading, or while off with a reason, does nothing.
    if (busy || explainedOff) {
      event.preventDefault();
      return;
    }
    onClick?.(event);
  };

  const state = blocked ? inactive : variants[variant];
  const label = error && !iconOnly ? retryLabel : children;

  const button = (
    <button
      {...rest}
      ref={ref}
      type={type}
      disabled={disabled}
      aria-disabled={explainedOff ? true : undefined}
      aria-busy={busy ? true : undefined}
      aria-pressed={pressed}
      aria-describedby={describedBy}
      onClick={handleClick}
      className={[base, iconOnly ? iconOnlySize : sizes[size], state, className].filter(Boolean).join(' ')}
    >
      {icon ? (
        <span
          aria-hidden="true"
          className={`inline-flex h-[var(--space-16)] w-[var(--space-16)] shrink-0 items-center justify-center${busy ? ' opacity-0' : ''}`}
        >
          {icon}
        </span>
      ) : null}
      {/* While loading the label keeps its space (width and height stay) but sits behind the spinner. */}
      {label !== undefined ? <span className={busy ? 'opacity-0' : undefined}>{label}</span> : null}
      {busy ? (
        <span aria-hidden="true" className="absolute inset-0 inline-flex items-center justify-center">
          <span className="inline-block h-[var(--space-16)] w-[var(--space-16)] animate-spin rounded-full border-[length:var(--border-width-focus)] border-current border-t-transparent motion-reduce:animate-none" />
        </span>
      ) : null}
    </button>
  );

  if (!error && !explainedOff) return button;

  return (
    <>
      {button}
      {explainedOff ? (
        <span id={reasonId} className="sr-only">
          {disabledReason}
        </span>
      ) : null}
      {error ? (
        <span
          id={messageId}
          role="alert"
          className="ml-[var(--space-8)] text-[length:var(--font-size-md)] text-[color:var(--color-danger-text)] [&:lang(km)]:leading-[var(--line-height-khmer)] [&:lang(km)]:tracking-[0]"
        >
          {error}
        </span>
      ) : null}
    </>
  );
});

export default Button;
