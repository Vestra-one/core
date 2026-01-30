import { Link } from 'react-router-dom'
import { Icon } from '../ui/Icon'
import { ROUTES } from '../../lib/constants'

type LogoProps = {
  variant?: 'default' | 'wallet'
  showLink?: boolean
}

export function Logo({ variant = 'default', showLink = true }: LogoProps) {
  const content = (
    <>
      <div className="size-8 rounded-lg bg-[var(--color-primary)] flex items-center justify-center text-white shrink-0">
        {variant === 'wallet' ? (
          <Icon name="account_balance_wallet" size={20} />
        ) : (
          <Icon name="payments" size={20} />
        )}
      </div>
      <span className="text-xl font-bold tracking-tight">PayFlowX</span>
    </>
  )

  if (showLink) {
    return (
      <Link to={ROUTES.home} className="flex items-center gap-2">
        {content}
      </Link>
    )
  }

  return <div className="flex items-center gap-2">{content}</div>
}
