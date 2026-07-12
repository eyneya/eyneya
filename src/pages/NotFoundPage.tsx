import { Link } from 'react-router-dom';
import { Home } from 'lucide-react';
import Seo from '../components/Seo';

export default function NotFoundPage() {
  return (
    <>
      <Seo title="Page Not Found" description="The page you are looking for does not exist." path="/404" />
      <div className="container-wide py-32 text-center">
        <p className="font-serif text-7xl font-bold text-brand-purple">404</p>
        <h1 className="mt-4 text-2xl font-bold">Page Not Found</h1>
        <p className="mt-2 text-brand-slate">The page you are looking for does not exist or has moved.</p>
        <Link to="/" className="btn-purple mt-8">
          <Home className="h-4 w-4" />
          Back to Home
        </Link>
      </div>
    </>
  );
}
