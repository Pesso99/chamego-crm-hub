import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Settings as SettingsIcon } from "lucide-react";

export default function Settings() {
  return (
    <div className="p-8 space-y-8 animate-fade-in">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Configurações</h1>
        <p className="text-muted-foreground mt-1">
          Gerencie as configurações do seu CRM
        </p>
      </div>

      <Card className="chamego-shadow-soft">
        <CardContent className="py-12 text-center">
          <SettingsIcon className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-lg font-semibold mb-2">Configurações em desenvolvimento</h3>
          <p className="text-muted-foreground">
            Esta seção estará disponível em breve
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
