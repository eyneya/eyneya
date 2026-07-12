import { Link } from 'react-router-dom';
import { BUSINESS } from '../lib/constants';

export default function Logo({ variant = 'dark' }: { variant?: 'dark' | 'light' }) {
  return (
    <Link to="/" aria-label={`${BUSINESS.name} home`}>
      <img
        src="/images/eyneya_logo_(1).png"
        alt={BUSINESS.name}
        className={`h-10 w-auto transition-opacity hover:opacity-80 ${variant === 'light' ? 'brightness-0 invert' : ''}`}
        style={variant === 'light' ? { filter: 'brightness(0) invert(1)' } : undefined}
      />
    </Link>
  );
}
