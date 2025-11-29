interface ClientsHeaderProps {
  title?: string;
  subtitle?: string;
}

export function ClientsHeader({ 
  title = "Clientes",
  subtitle = "Gerencie sua base de clientes e crie segmentações inteligentes"
}: ClientsHeaderProps) {
  return (
    <div className="mb-6">
      <h1 className="text-3xl font-bold">{title}</h1>
      <p className="text-muted-foreground mt-1">{subtitle}</p>
    </div>
  );
}
