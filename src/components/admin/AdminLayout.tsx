import { Outlet, useLocation, useNavigate } from 'react-router-dom';
import { NavLink } from '@/components/NavLink';
import { BarChart3, Users, Mail, FileText, Shield, LogOut } from 'lucide-react';
import { useAuth, signOut } from '@/lib/auth';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';

const navigation = [
  { name: 'Dashboard', href: '/admin/dashboard', icon: BarChart3 },
  { name: 'Clientes', href: '/admin/clientes', icon: Users },
  { name: 'Campanhas', href: '/admin/campanhas', icon: Mail },
  { name: 'Templates', href: '/admin/templates', icon: FileText },
  { name: 'Governança', href: '/admin/governanca', icon: Shield },
];

export function AdminLayout() {
  const location = useLocation();
  const navigate = useNavigate();
  const { user } = useAuth();

  const handleLogout = async () => {
    await signOut();
    navigate('/login');
  };

  const getUserInitials = () => {
    if (!user?.email) return '??';
    return user.email.substring(0, 2).toUpperCase();
  };

  return (
    <div className="flex h-screen bg-background">
      <aside className="w-64 bg-card border-r border-border/40 flex flex-col">
        <div className="p-6 border-b border-border/40">
          <h1 className="text-2xl font-serif">
            Chamego <span className="text-sm text-muted-foreground">CRM</span>
          </h1>
        </div>
        
        <nav className="flex-1 p-4 space-y-1">
          {navigation.map((item) => {
            const isActive = location.pathname === item.href;
            return (
              <NavLink
                key={item.name}
                to={item.href}
                className={`flex items-center px-4 py-2.5 rounded-lg transition-colors ${
                  isActive
                    ? 'bg-primary text-primary-foreground'
                    : 'text-muted-foreground hover:text-foreground hover:bg-muted'
                }`}
              >
                <item.icon className="h-5 w-5 mr-3" />
                {item.name}
              </NavLink>
            );
          })}
        </nav>

        <div className="p-4 border-t border-border/40 space-y-3">
          <div className="flex items-center gap-3 px-2">
            <Avatar className="h-8 w-8">
              <AvatarFallback className="bg-primary/10 text-primary text-xs">
                {getUserInitials()}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium truncate">{user?.email}</p>
              <p className="text-xs text-muted-foreground">Admin</p>
            </div>
          </div>
          
          <Button
            variant="ghost"
            className="w-full justify-start text-muted-foreground hover:text-foreground"
            onClick={handleLogout}
          >
            <LogOut className="h-4 w-4 mr-2" />
            Sair
          </Button>
        </div>
      </aside>

      <main className="flex-1 overflow-y-auto">
        <div className="container mx-auto p-8">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
