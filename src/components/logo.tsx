interface LogoProps {
  height?: number;
}

export function Logo({ height = 18 }: LogoProps) {
  return (
    <img
      src="/logo-static.svg"
      alt="Dewey Ou"
      style={{ height: `${height}px`, width: 'auto', display: 'block' }}
    />
  );
}

export function LogoBlack({ height = 18 }: LogoProps) {
  return (
    <img
      src="/logo-static-black.svg"
      alt="Dewey Ou"
      style={{ height: `${height}px`, width: 'auto', display: 'block' }}
    />
  );
}

export function LogoAnimated({ height = 18 }: LogoProps) {
  return (
    <img
      src="/logo-animated.svg"
      alt="Dewey Ou"
      style={{ height: `${height}px`, width: 'auto', display: 'block' }}
    />
  );
}
