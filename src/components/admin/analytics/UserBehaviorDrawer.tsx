import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ClientNavigationInsights } from "@/components/admin/ClientNavigationInsights";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Skeleton } from "@/components/ui/skeleton";

interface UserBehaviorDrawerProps {
  userId: string | null;
  onClose: () => void;
}

interface UserProfile {
  full_name: string | null;
  email: string;
  avatar_url: string | null;
}

export function UserBehaviorDrawer({ userId, onClose }: UserBehaviorDrawerProps) {
  const { data: profile, isLoading } = useQuery<UserProfile>({
    queryKey: ['user-profile', userId],
    queryFn: async () => {
      if (!userId) throw new Error('User ID required');
      
      const { data, error } = await supabase
        .from('profiles')
        .select('full_name, email, avatar_url')
        .eq('user_id', userId)
        .single();

      if (error) throw error;
      return data as UserProfile;
    },
    enabled: !!userId,
  });

  const getInitials = (name: string | null) => {
    if (!name) return "?";
    return name
      .split(" ")
      .map((n) => n[0])
      .slice(0, 2)
      .join("")
      .toUpperCase();
  };

  return (
    <Sheet open={!!userId} onOpenChange={(open) => !open && onClose()}>
      <SheetContent className="w-full sm:max-w-2xl overflow-y-auto">
        <SheetHeader>
          <SheetTitle>Comportamento do Usuário</SheetTitle>
          <SheetDescription>
            Histórico de navegação e atividade
          </SheetDescription>
        </SheetHeader>

        <div className="mt-6">
          {isLoading ? (
            <div className="space-y-4">
              <Skeleton className="h-20 w-full" />
              <Skeleton className="h-40 w-full" />
            </div>
          ) : profile ? (
            <>
              <div className="flex items-center gap-4 p-4 bg-muted/50 rounded-lg mb-6">
                <Avatar className="h-16 w-16">
                  <AvatarImage src={profile.avatar_url || undefined} />
                  <AvatarFallback className="bg-chamego-rosa text-foreground text-lg">
                    {getInitials(profile.full_name)}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <h3 className="font-semibold text-lg text-foreground">
                    {profile.full_name || "Usuário sem nome"}
                  </h3>
                  <p className="text-sm text-muted-foreground">{profile.email}</p>
                </div>
              </div>

              {userId && <ClientNavigationInsights userId={userId} />}
            </>
          ) : (
            <div className="text-center py-8 text-muted-foreground">
              <p>Não foi possível carregar os dados do usuário</p>
            </div>
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
}
