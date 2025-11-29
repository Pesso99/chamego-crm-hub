const getGreeting = () => {
  const hour = new Date().getHours();
  if (hour < 12) return 'Bom dia';
  if (hour < 18) return 'Boa tarde';
  return 'Boa noite';
};

const getFormattedDate = () => {
  return new Intl.DateTimeFormat('pt-BR', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
  }).format(new Date());
};

interface DashboardHeaderProps {
  userName?: string;
}

export function DashboardHeader({ userName = 'Admin' }: DashboardHeaderProps) {
  return (
    <div className="mb-8">
      <h1 className="text-3xl font-bold">
        {getGreeting()}, {userName}!
      </h1>
      <p className="text-muted-foreground mt-1 capitalize">
        {getFormattedDate()}
      </p>
    </div>
  );
}
