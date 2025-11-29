import { Logo } from "./Logo";

export function LoadingScreen() {
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-background">
      <div className="flex flex-col items-center gap-4">
        <Logo size="lg" />
        <div className="flex gap-2">
          <div className="h-2 w-2 rounded-full bg-chamego-rosa animate-pulse" />
          <div className="h-2 w-2 rounded-full bg-chamego-rosa animate-pulse animation-delay-100" />
          <div className="h-2 w-2 rounded-full bg-chamego-rosa animate-pulse animation-delay-200" />
        </div>
      </div>
    </div>
  );
}
