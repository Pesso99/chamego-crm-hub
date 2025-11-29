import { Navigate, Outlet } from 'react-router-dom';
import { useAuth, checkUserRole } from '@/lib/auth';
import { useEffect, useState } from 'react';
import { Loader2 } from 'lucide-react';

interface ProtectedRouteProps {
  requiredRole?: string;
}

export function ProtectedRoute({ requiredRole }: ProtectedRouteProps) {
  const { user, loading } = useAuth();
  const [hasRole, setHasRole] = useState<boolean | null>(null);

  useEffect(() => {
    async function checkRole() {
      if (user && requiredRole) {
        const roleCheck = await checkUserRole(user.id, requiredRole);
        setHasRole(roleCheck);
      } else if (user) {
        setHasRole(true);
      }
    }

    checkRole();
  }, [user, requiredRole]);

  if (loading || (requiredRole && hasRole === null)) {
    return (
      <div className="flex h-screen items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (requiredRole && !hasRole) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-2">Acesso Negado</h1>
          <p className="text-muted-foreground">Você não tem permissão para acessar esta página.</p>
        </div>
      </div>
    );
  }

  return <Outlet />;
}
