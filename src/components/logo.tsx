import type { CSSProperties } from 'react';

interface LogoProps {
  height?: number;
  className?: string;
}

interface CrispLogoProps extends LogoProps {
  color: string;
}

const LOGO_STROKE_PATHS = [
  'M 323.414 1200.473 C 323.414 1200.473 151.492 1185.146 54.7 1091.544 C 6.354 1044.791 -16.698 974.434 0 909.286 C 58.845 675.396 332.145 421.96 613.227 290.331 C 878.936 165.901 1149.046 153.527 1337.474 261.34 C 1591.566 391.233 1646.242 817.931 1406.579 1131.182 C 988.957 1677.034 520.883 1756.915 414.375 1721.88 C 307.868 1686.844 288.248 1623.78 305.065 1553.709 C 353.567 1314.067 891.226 1259.481 937.989 1269.957',
  'M 690.847 419.584 C 690.847 419.584 678.739 600.414 663.523 1041.751 C 648.307 1492.946 680.212 1756.054 680.212 1756.054',
  'M 1722.064 992.465 C 1935.746 973.157 1943.888 834.696 1939.11 782.122 C 1938.123 771.271 1927.338 764.387 1917.001 767.832 C 1735.855 828.204 1709.316 971.27 1711.326 1058.369 C 1712.489 1108.799 1738.031 1154.896 1779.401 1183.757 C 2077.838 1391.961 2581.818 927.645 2581.818 927.645 C 2581.818 927.645 2537.056 1156.284 2581.818 1167.399 C 2617.342 1146.406 2755.396 927.645 2755.396 927.645 C 2755.396 927.645 2718.673 1240.006 2781.162 1231.135 C 2987.974 1173.03 3003.472 895.586 2984.26 889.632 C 2973.932 883.987 2857.212 1078.92 3104.195 1084.035 C 3121.56 1084.394 3139.122 1082.742 3156.131 1079.22 C 3457.217 1016.881 3647.695 877.198 3647.695 877.198 C 3910.251 842.086 3920.28 642.597 3864.669 642.597 C 3809.058 642.597 3422.308 896.088 3753.469 1102.307 C 4065.2 1231.946 4512.582 822.768 4512.582 822.768 C 4512.582 822.768 4329.726 1060.273 4488.067 1127.35 C 4658.908 1171.07 5025.224 736.202 5025.224 736.202 C 4712.597 1923.567 4099.886 2131.366 3863.372 2166.763 C 3788.064 2178.034 3710.01 2159.709 3651.87 2110.534 C 3545.764 2020.787 3624.509 1917.001 3694.955 1851.916 C 3737.427 1812.676 3790.041 1785.737 3846.965 1775.57 C 4265.418 1700.826 4351.721 1931.512 4351.721 1931.512 C 4351.721 1931.512 4591.972 2312.03 5121.261 2330.192 C 5544.48 2344.715 5909.958 1989.946 5909.958 1989.946 C 5909.958 1989.946 5926.653 2174.075 5926.653 2174.075',
  'M 5529.777 589.052 C 5465.982 587.392 5011.909 904.431 5274.457 1336.311 C 5336.345 1438.116 5470.964 1469.947 5573.748 1409.699 C 5932.857 1199.205 6087.987 854.023 6114.058 572.836 C 6146.986 217.701 5961.783 -59.066 5642.448 0 C 5516.646 23.27 5407.349 99.948 5334.009 204.776 C 5081.103 566.267 5221.407 932.118 5408.305 1102.261 C 5586.799 1264.754 5806.843 1239.655 5806.843 1239.655 C 5806.843 1239.655 6262.343 1217.952 6581.531 975.507 C 6483.491 1309.926 6569.55 1295.267 6569.55 1295.267 C 6569.55 1295.267 6730.497 1299.982 6945.124 922.248 C 6874.65 1239.075 6997.101 1276.343 7001.915 1277.886 C 7006.73 1279.429 7170.152 1360.774 7527.671 915.815',
] as const;

const LOGO_DOT_PATHS = [
  'M 4776.72 1763.706 C 4776.72 1848.682 4831.105 1917.569 4898.192 1917.569 C 4965.279 1917.569 5019.663 1848.682 5019.663 1763.706 C 5019.663 1678.728 4965.279 1609.841 4898.192 1609.841 C 4831.105 1609.841 4776.72 1678.728 4776.72 1763.706 Z',
  'M 5262.606 1763.706 C 5262.606 1848.682 5316.991 1917.569 5384.078 1917.569 C 5451.165 1917.569 5505.549 1848.682 5505.549 1763.706 C 5505.549 1678.728 5451.165 1609.841 5384.078 1609.841 C 5316.991 1609.841 5262.606 1678.728 5262.606 1763.706 Z',
] as const;

function logoStyle(height: number): CSSProperties {
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

export function LogoStaticGreenCrisp({ className, height = 24 }: LogoProps) {
  return <LogoStaticCrisp className={className} height={height} color="#45dcae" />;
}

function LogoStaticCrisp({ className, height = 24, color }: CrispLogoProps) {
  return (
    <svg
      className={className}
      style={logoStyle(height)}
      viewBox="-60 -60 7647.671 2450.192"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      role="img"
      aria-label="Dewey Ou"
    >
      <title>Dewey Ou</title>
      <g
        fill="none"
        stroke={color}
        strokeWidth="112"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        {LOGO_STROKE_PATHS.map((path) => (
          <path key={path} d={path} />
        ))}
      </g>
      {LOGO_DOT_PATHS.map((path) => (
        <path key={path} fill={color} d={path} />
      ))}
    </svg>
  );
}

export function LogoAutoCrisp({ className, height = 20 }: LogoProps) {
  return (
    <span className={className} data-logo-auto style={{ display: 'inline-grid' }}>
      <LogoStaticCrisp height={height} color="#000000" className="logo-auto-light" />
      <LogoStaticCrisp height={height} color="#ffffff" className="logo-auto-dark" />
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
