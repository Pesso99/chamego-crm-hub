import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Search, Filter, Mail, Phone, Calendar, TrendingUp } from "lucide-react";

interface Customer {
  id: string;
  nome: string;
  email: string;
  telefone: string | null;
  valor_total_gasto: number;
  ticket_medio: number;
  numero_pedidos: number;
  ultima_compra: string | null;
  dias_sem_comprar: number;
  status: string;
  marketing_emails: boolean;
}

export default function Customers() {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [filteredCustomers, setFilteredCustomers] = useState<Customer[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");

  useEffect(() => {
    loadCustomers();
  }, []);

  useEffect(() => {
    filterCustomers();
  }, [searchTerm, statusFilter, customers]);

  async function loadCustomers() {
    const { data, error } = await supabase
      .from("clientes_crm")
      .select("*")
      .order("valor_total_gasto", { ascending: false });

    if (data && !error) {
      setCustomers(data as Customer[]);
    }
  }

  function filterCustomers() {
    let filtered = customers;

    if (searchTerm) {
      filtered = filtered.filter(
        (c) =>
          c.nome?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          c.email?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (statusFilter !== "all") {
      filtered = filtered.filter((c) => c.status === statusFilter);
    }

    setFilteredCustomers(filtered);
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Ativo":
        return "bg-status-success/10 text-status-success border-status-success/20";
      case "Em Risco":
        return "bg-status-warning/10 text-status-warning border-status-warning/20";
      case "Inativo":
        return "bg-status-error/10 text-status-error border-status-error/20";
      default:
        return "bg-muted text-muted-foreground";
    }
  };

  const statuses = ["all", "Ativo", "Em Risco", "Inativo", "Prospect"];

  return (
    <div className="p-8 space-y-8 animate-fade-in">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Clientes</h1>
          <p className="text-muted-foreground mt-1">
            Gerencie e acompanhe seus {customers.length} clientes
          </p>
        </div>
        <Button className="chamego-gradient-dourado text-primary-foreground chamego-shadow-medium hover:opacity-90">
          <Mail className="w-4 h-4 mr-2" />
          Nova Campanha
        </Button>
      </div>

      {/* Filters */}
      <Card className="chamego-shadow-soft">
        <CardContent className="pt-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Buscar por nome ou email..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <div className="flex gap-2">
              {statuses.map((status) => (
                <Button
                  key={status}
                  variant={statusFilter === status ? "default" : "outline"}
                  size="sm"
                  onClick={() => setStatusFilter(status)}
                  className={statusFilter === status ? "bg-primary" : ""}
                >
                  {status === "all" ? "Todos" : status}
                </Button>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Customers Grid */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {filteredCustomers.map((customer, index) => (
          <Card
            key={customer.id}
            className="chamego-shadow-soft hover:chamego-shadow-medium transition-all hover:-translate-y-1 cursor-pointer"
            style={{ animationDelay: `${index * 0.05}s` }}
          >
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="flex-1 min-w-0">
                  <CardTitle className="text-lg truncate">{customer.nome}</CardTitle>
                  <div className="flex items-center gap-2 mt-1">
                    <Mail className="w-3 h-3 text-muted-foreground" />
                    <p className="text-xs text-muted-foreground truncate">{customer.email}</p>
                  </div>
                </div>
                <Badge className={getStatusColor(customer.status)} variant="outline">
                  {customer.status}
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              {customer.telefone && (
                <div className="flex items-center gap-2 text-sm">
                  <Phone className="w-4 h-4 text-muted-foreground" />
                  <span className="text-muted-foreground">{customer.telefone}</span>
                </div>
              )}

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-xs text-muted-foreground">Total Gasto</p>
                  <p className="text-lg font-bold text-primary">
                    R$ {Number(customer.valor_total_gasto || 0).toLocaleString("pt-BR")}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Ticket Médio</p>
                  <p className="text-lg font-bold text-chamego-dourado">
                    R$ {Number(customer.ticket_medio || 0).toLocaleString("pt-BR")}
                  </p>
                </div>
              </div>

              <div className="flex items-center justify-between pt-4 border-t border-border">
                <div className="flex items-center gap-1 text-xs text-muted-foreground">
                  <TrendingUp className="w-3 h-3" />
                  <span>{customer.numero_pedidos} pedidos</span>
                </div>
                {customer.ultima_compra && (
                  <div className="flex items-center gap-1 text-xs text-muted-foreground">
                    <Calendar className="w-3 h-3" />
                    <span>{customer.dias_sem_comprar}d atrás</span>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredCustomers.length === 0 && (
        <Card className="chamego-shadow-soft">
          <CardContent className="py-12 text-center">
            <p className="text-muted-foreground">Nenhum cliente encontrado com os filtros aplicados.</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
