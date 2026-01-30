type IconProps = {
  name: string
  className?: string
  size?: 18 | 20 | 22 | 24 | 32
}

const sizeMap = { 18: 'text-[18px]', 20: 'text-xl', 22: 'text-[22px]', 24: 'text-2xl', 32: 'text-3xl' }

export function Icon({ name, className = '', size = 24 }: IconProps) {
  return (
    <span
      className={`material-symbols-outlined ${sizeMap[size]} ${className}`}
      style={{ fontVariationSettings: "'FILL' 0, 'wght' 400, 'GRAD' 0, 'opsz' 24" }}
    >
      {name}
    </span>
  )
}
