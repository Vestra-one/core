const ICON_SIZES = [12, 14, 18, 20, 22, 24, 32] as const;
type IconSize = (typeof ICON_SIZES)[number];

type IconProps = {
  name: string;
  className?: string;
  size?: IconSize;
};

const sizeMap: Record<IconSize, string> = {
  12: "text-[12px]",
  14: "text-[14px]",
  18: "text-[18px]",
  20: "text-xl",
  22: "text-[22px]",
  24: "text-2xl",
  32: "text-3xl",
};

export function Icon({ name, className = "", size = 24 }: IconProps) {
  return (
    <span
      className={`material-symbols-outlined ${sizeMap[size]} ${className}`}
      style={{
        fontVariationSettings: "'FILL' 0, 'wght' 400, 'GRAD' 0, 'opsz' 24",
      }}
    >
      {name}
    </span>
  );
}
