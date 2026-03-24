import type { HTMLAttributes } from 'astro/types';

type BaseProps = {
  variant?: 'primary' | 'danger' | 'transparent';
  fullWidth?: boolean;
  outline?: boolean;
  class?: string;
};

export type ButtonAsButton = BaseProps & HTMLAttributes<'button'> & {
    href?: undefined;
  };

export type ButtonAsAnchor = BaseProps &
  Omit<HTMLAttributes<'a'>, 'type'> & {
    href: string;
  };

export type ButtonProps = ButtonAsButton | ButtonAsAnchor;
