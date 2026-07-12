import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { lazy, Suspense } from 'react';
import PublicLayout from './components/PublicLayout';
import { AuthProvider } from './admin/AuthContext';
import AdminLayout from './admin/AdminLayout';
import AdminLoginPage from './admin/AdminLoginPage';
import HomePage from './pages/HomePage';

const TaxPreparationPage = lazy(() => import('./pages/TaxPreparationPage'));
const SelfEmployedTaxPreparationPage = lazy(() => import('./pages/SelfEmployedTaxPreparationPage'));
const BusinessTaxPreparationPage = lazy(() => import('./pages/BusinessTaxPreparationPage'));
const TaxAdvisoryPage = lazy(() => import('./pages/TaxAdvisoryPage'));
const TaxPlanningPage = lazy(() => import('./pages/TaxPlanningPage'));
const TaxStrategyPage = lazy(() => import('./pages/TaxStrategyPage'));
const TaxAmendmentsPage = lazy(() => import('./pages/TaxAmendmentsPage'));
const TaxCompliancePage = lazy(() => import('./pages/TaxCompliancePage'));
const OngoingAdvisoryPage = lazy(() => import('./pages/OngoingAdvisoryPage'));
const AboutPage = lazy(() => import('./pages/AboutPage'));
const ContactPage = lazy(() => import('./pages/ContactPage'));
const BookPage = lazy(() => import('./pages/BookPage'));
const ApplyPage = lazy(() => import('./pages/ApplyPage'));
const TaxTipsPage = lazy(() => import('./pages/TaxTipsPage'));
const TaxTipPostPage = lazy(() => import('./pages/TaxTipPostPage'));
const NotFoundPage = lazy(() => import('./pages/NotFoundPage'));

const AdminDashboard = lazy(() => import('./admin/AdminDashboard'));
const AdminCalendar = lazy(() => import('./admin/AdminCalendar'));
const AdminBookings = lazy(() => import('./admin/AdminBookings'));
const AdminBookingDetail = lazy(() => import('./admin/AdminBookingDetail'));
const AdminClients = lazy(() => import('./admin/AdminClients'));
const AdminClientDetail = lazy(() => import('./admin/AdminClientDetail'));
const AdminPayments = lazy(() => import('./admin/AdminPayments'));
const AdminEmails = lazy(() => import('./admin/AdminEmails'));
const AdminContact = lazy(() => import('./admin/AdminContact'));
const AdminSettings = lazy(() => import('./admin/AdminSettings'));
const AdminBlog = lazy(() => import('./admin/AdminBlog'));
const AdminBlogEditor = lazy(() => import('./admin/AdminBlogEditor'));

function PageFallback() {
  return (
    <div className="container-wide py-32">
      <div className="h-8 w-48 shimmer-bg rounded mb-4" />
      <div className="h-4 w-96 shimmer-bg rounded" />
    </div>
  );
}

function AdminFallback() {
  return <div className="p-8 text-brand-slate animate-pulse">Loading...</div>;
}

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          {/* Public site */}
          <Route element={<PublicLayout />}>
            <Route path="/" element={<HomePage />} />
            <Route path="/tax-preparation" element={<Suspense fallback={<PageFallback />}><TaxPreparationPage /></Suspense>} />
            <Route path="/self-employed-tax-preparation" element={<Suspense fallback={<PageFallback />}><SelfEmployedTaxPreparationPage /></Suspense>} />
            <Route path="/business-tax-preparation" element={<Suspense fallback={<PageFallback />}><BusinessTaxPreparationPage /></Suspense>} />
            <Route path="/tax-advisory" element={<Suspense fallback={<PageFallback />}><TaxAdvisoryPage /></Suspense>} />
            <Route path="/tax-planning" element={<Suspense fallback={<PageFallback />}><TaxPlanningPage /></Suspense>} />
            <Route path="/tax-strategy" element={<Suspense fallback={<PageFallback />}><TaxStrategyPage /></Suspense>} />
            <Route path="/tax-amendments" element={<Suspense fallback={<PageFallback />}><TaxAmendmentsPage /></Suspense>} />
            <Route path="/tax-compliance" element={<Suspense fallback={<PageFallback />}><TaxCompliancePage /></Suspense>} />
            <Route path="/ongoing-advisory" element={<Suspense fallback={<PageFallback />}><OngoingAdvisoryPage /></Suspense>} />
            <Route path="/about" element={<Suspense fallback={<PageFallback />}><AboutPage /></Suspense>} />
            <Route path="/contact" element={<Suspense fallback={<PageFallback />}><ContactPage /></Suspense>} />
            <Route path="/book" element={<Suspense fallback={<PageFallback />}><BookPage /></Suspense>} />
            <Route path="/apply/:plan" element={<Suspense fallback={<PageFallback />}><ApplyPage /></Suspense>} />
            <Route path="/tax-tips" element={<Suspense fallback={<PageFallback />}><TaxTipsPage /></Suspense>} />
            <Route path="/tax-tips/:slug" element={<Suspense fallback={<PageFallback />}><TaxTipPostPage /></Suspense>} />
            <Route path="*" element={<Suspense fallback={<PageFallback />}><NotFoundPage /></Suspense>} />
          </Route>

          {/* Admin */}
          <Route path="/admin/login" element={<AdminLoginPage />} />
          <Route path="/admin" element={<AdminLayout />}>
            <Route index element={<Navigate to="/admin/dashboard" replace />} />
            <Route path="dashboard" element={<Suspense fallback={<AdminFallback />}><AdminDashboard /></Suspense>} />
            <Route path="calendar" element={<Suspense fallback={<AdminFallback />}><AdminCalendar /></Suspense>} />
            <Route path="bookings" element={<Suspense fallback={<AdminFallback />}><AdminBookings /></Suspense>} />
            <Route path="bookings/:id" element={<Suspense fallback={<AdminFallback />}><AdminBookingDetail /></Suspense>} />
            <Route path="clients" element={<Suspense fallback={<AdminFallback />}><AdminClients /></Suspense>} />
            <Route path="clients/:id" element={<Suspense fallback={<AdminFallback />}><AdminClientDetail /></Suspense>} />
            <Route path="payments" element={<Suspense fallback={<AdminFallback />}><AdminPayments /></Suspense>} />
            <Route path="emails" element={<Suspense fallback={<AdminFallback />}><AdminEmails /></Suspense>} />
            <Route path="contact" element={<Suspense fallback={<AdminFallback />}><AdminContact /></Suspense>} />
            <Route path="settings" element={<Suspense fallback={<AdminFallback />}><AdminSettings /></Suspense>} />
            <Route path="blog" element={<Suspense fallback={<AdminFallback />}><AdminBlog /></Suspense>} />
            <Route path="blog/:id" element={<Suspense fallback={<AdminFallback />}><AdminBlogEditor /></Suspense>} />
          </Route>
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}
