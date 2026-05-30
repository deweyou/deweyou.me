interface LogoProps {
  height?: number;
  className?: string;
}

function logoStyle(height: number) {
  return { height: `${height}px`, width: 'auto', display: 'block' };
}

export function Logo({ className, height = 18 }: LogoProps) {
  return (
    <img
      src="/logo-static.svg"
      alt="Dewey Ou"
      className={className}
      style={logoStyle(height)}
    />
  );
}

export function LogoBlack({ className, height = 18 }: LogoProps) {
  return (
    <img
      src="/logo-static-black.svg"
      alt="Dewey Ou"
      className={className}
      style={logoStyle(height)}
    />
  );
}

export function LogoWhite({ className, height = 18 }: LogoProps) {
  return (
    <img
      src="/assets/logo-white.svg"
      alt="Dewey Ou"
      className={className}
      style={logoStyle(height)}
    />
  );
}

export function LogoAuto({ className, height = 18 }: LogoProps) {
  return (
    <span className={className} data-logo-auto style={{ display: 'inline-grid' }}>
      <LogoBlack height={height} className="logo-auto-light" />
      <LogoWhite height={height} className="logo-auto-dark" />
    </span>
  );
}

export function LogoAnimated({ className, height = 18 }: LogoProps) {
  return (
    <img
      src="/logo-animated.svg"
      alt="Dewey Ou"
      className={className}
      style={logoStyle(height)}
    />
  );
}
