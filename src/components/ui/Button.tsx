import type { AnchorHTMLAttributes, ButtonHTMLAttributes } from 'react'
import styles from './Button.module.css'

type Variant = 'primary' | 'secondary' | 'inverse'

type ButtonLinkProps = AnchorHTMLAttributes<HTMLAnchorElement> & { variant?: Variant; href: string }
type ButtonActionProps = ButtonHTMLAttributes<HTMLButtonElement> & { variant?: Variant; href?: undefined }

export type ButtonProps = ButtonLinkProps | ButtonActionProps

const isLink = (props: ButtonProps): props is ButtonLinkProps => typeof props.href === 'string'

export const Button = (props: ButtonProps) => {
  const className = [styles.button, styles[props.variant ?? 'primary'], props.className].filter(Boolean).join(' ')

  if (isLink(props)) {
    const { variant, ...rest } = props
    return <a {...rest} className={className} />
  }
  const { variant, ...rest } = props
  return <button type="button" {...rest} className={className} />
}
