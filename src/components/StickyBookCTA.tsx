import { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Calendar } from 'lucide-react';
import { cn } from '../lib/utils';

export default function StickyBookCTA() {
  const [visible, setVisible] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > 600);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  if (location.pathname.startsWith('/book') || location.pathname.startsWith('/admin')) {
    return null;
  }

  return (
    <div
      className={cn(
        'fixed bottom-0 inset-x-0 z-40 lg:hidden transition-transform duration-300',
        visible ? 'translate-y-0' : 'translate-y-full',
      )}
    >
      <div className="bg-white border-t border-gray-200 px-4 py-3 shadow-premium">
        <Link to="/book" className="btn-gold w-full">
          <Calendar className="h-4 w-4" />
          Book an Appointment
        </Link>
      </div>
    </div>
  );
}
