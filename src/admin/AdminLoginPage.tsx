import { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { AlertCircle, ArrowRight, Loader2 } from 'lucide-react';
import { useAuth } from './AuthContext';
import Seo from '../components/Seo';

export default function AdminLoginPage() {
  const { session, signIn } = useAuth();
  const navigate = useNavigate();
  const [error, setError] = useState<string | null>(null);

  const { register, handleSubmit, formState: { isSubmitting } } = useForm<{ email: string; password: string }>();

  useEffect(() => {
    if (session) navigate('/admin/dashboard', { replace: true });
  }, [session, navigate]);

  const onSubmit = async (data: { email: string; password: string }) => {
    setError(null);
    const { error } = await signIn(data.email, data.password);
    if (error) {
      setError(error);
      return;
    }
    navigate('/admin/dashboard');
  };

  return (
    <>
      <Seo title="Admin Login | Eyneya Business Solutions" description="Admin login" path="/admin/login" />
      <div className="min-h-screen grid place-items-center bg-brand-dark px-4">
        <div className="w-full max-w-sm">
          <div className="text-center mb-8">
            <Link to="/" className="font-serif text-2xl font-bold text-white">Eyneya Admin</Link>
            <p className="text-sm text-gray-400 mt-1">Sign in to manage your business</p>
          </div>
          <form onSubmit={handleSubmit(onSubmit)} className="bg-white rounded-xl p-6 space-y-4 shadow-premium">
            <div>
              <label className="label">Email</label>
              <input type="email" className="input" {...register('email', { required: true })} placeholder="admin@eyneya.com" autoFocus />
            </div>
            <div>
              <label className="label">Password</label>
              <input type="password" className="input" {...register('password', { required: true })} placeholder="••••••••" />
            </div>

            {error && (
              <div className="flex items-start gap-2 rounded-lg bg-red-50 p-3 text-sm text-brand-error">
                <AlertCircle className="h-5 w-5 flex-shrink-0" />
                <span>{error}</span>
              </div>
            )}

            <button type="submit" disabled={isSubmitting} className="btn-purple w-full">
              {isSubmitting ? <Loader2 className="h-4 w-4 animate-spin" /> : <>Sign In <ArrowRight className="h-4 w-4" /></>}
            </button>
          </form>
          <p className="text-center text-xs text-gray-500 mt-6">
            <Link to="/" className="hover:text-gray-300">← Back to website</Link>
          </p>
        </div>
      </div>
    </>
  );
}
