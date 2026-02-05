const sizeMap = {
  12: "text-[12px]",
  14: "text-[14px]",
  18: "text-[18px]",
  20: "text-xl",
  22: "text-[22px]",
  24: "text-2xl",
  32: "text-3xl",
} as const;

type IconSize = keyof typeof sizeMap;

type IconProps = {
  name: string;
  className?: string;
  size?: IconSize;
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
