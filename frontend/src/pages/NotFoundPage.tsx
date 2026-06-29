import { Home } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function NotFoundPage() {
  return (
    <div className="flex flex-col items-center justify-center py-20 text-center">
      <h1 className="text-6xl font-bold text-gray-300">404</h1>
      <h2 className="mt-4 text-xl font-semibold text-gray-900">
        Page not found
      </h2>
      <p className="mt-2 text-sm text-gray-500">
        The page you are looking for does not exist.
      </p>
      <Link to="/" className="btn-primary mt-6">
        <Home className="mr-2 h-4 w-4" />
        Go to Dashboard
      </Link>
    </div>
  );
}
