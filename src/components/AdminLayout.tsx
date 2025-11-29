import { useEffect } from "react";
import { Outlet, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { 
  LayoutDashboard, 
  Users, 
  Mail, 
  FileText, 
  Shield,
  LogOut,
  Heart
} from "lucide-react";
import { cn } from "@/lib/utils";
import { NavLink } from "./NavLink";

const navigation = [
  { name: "Dashboard", href: "/admin/dashboard", icon: LayoutDashboard },
  { name: "Clientes", href: "/admin/clientes", icon: Users },
  { name: "Campanhas", href: "/admin/campanhas", icon: Mail },
  { name: "Templates", href: "/admin/templates", icon: FileText },
  { name: "Governança", href: "/admin/governanca", icon: Shield },
];

export default function AdminLayout() {
  const { user, isAdmin, loading, signOut } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (!loading && !user) {
      navigate("/login");
    } else if (!loading && user && !isAdmin) {
      navigate("/login");
    }
  }, [user, isAdmin, loading, navigate]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-chamego-rosa via-background to-chamego-dourado/5">
        <div className="text-center space-y-4">
          <Heart className="w-12 h-12 chamego-icon-accent mx-auto animate-pulse" />
          <p className="text-muted-foreground">Carregando...</p>
        </div>
      </div>
    );
  }

  if (!user || !isAdmin) {
    return null;
  }

  const userInitials = user.email?.substring(0, 2).toUpperCase() || "AD";

  return (
    <div className="min-h-screen flex bg-background">
      {/* Sidebar */}
      <aside className="w-[264px] border-r bg-card flex flex-col">
        {/* Logo */}
        <div className="h-16 flex items-center justify-center border-b px-6">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-lg bg-gradient-chamego">
              <Heart className="w-5 h-5 text-white" fill="currentColor" />
            </div>
            <span className="font-bold text-lg bg-gradient-chamego bg-clip-text text-transparent">
              Chamego CRM
            </span>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-4 space-y-1">
          {navigation.map((item) => {
            const isActive = location.pathname === item.href;
            return (
              <NavLink
                key={item.name}
                to={item.href}
                className={cn(
                  "flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors",
                  "hover:bg-accent hover:text-accent-foreground"
                )}
                activeClassName="bg-gradient-chamego text-white shadow-chamego"
              >
                <item.icon className="w-5 h-5" />
                {item.name}
              </NavLink>
            );
          })}
        </nav>

        {/* User Footer */}
        <div className="border-t p-4 space-y-3">
          <div className="flex items-center gap-3">
            <Avatar className="h-10 w-10 chamego-border-accent border-2">
              <AvatarFallback className="bg-chamego-rosa text-chamego-dourado font-bold">
                {userInitials}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium truncate">{user.email}</p>
              <p className="text-xs text-muted-foreground chamego-badge inline-block px-2 py-0.5 rounded">
                Admin
              </p>
            </div>
          </div>
          <Button
            variant="outline"
            className="w-full justify-start chamego-border-accent"
            onClick={signOut}
          >
            <LogOut className="w-4 h-4 mr-2" />
            Sair
          </Button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-auto">
        <Outlet />
      </main>
    </div>
  );
}
