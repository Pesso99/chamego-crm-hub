import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tags as TagsIcon, Plus } from "lucide-react";

interface Tag {
  id: string;
  name: string;
  category: string | null;
  color: string | null;
  is_active: boolean;
}

export default function Tags() {
  const [tags, setTags] = useState<Tag[]>([]);

  useEffect(() => {
    loadTags();
  }, []);

  async function loadTags() {
    const { data, error } = await supabase
      .from("custom_tags")
      .select("*")
      .eq("is_active", true)
      .order("name");

    if (data && !error) {
      setTags(data as Tag[]);
    }
  }

  return (
    <div className="p-8 space-y-8 animate-fade-in">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Tags</h1>
          <p className="text-muted-foreground mt-1">
            Gerencie tags para classificar seus clientes
          </p>
        </div>
        <Button className="chamego-gradient-dourado text-primary-foreground chamego-shadow-medium hover:opacity-90">
          <Plus className="w-4 h-4 mr-2" />
          Nova Tag
        </Button>
      </div>

      {/* Tags Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {tags.map((tag, index) => (
          <Card
            key={tag.id}
            className="chamego-shadow-soft hover:chamego-shadow-medium transition-all hover:-translate-y-1 cursor-pointer"
            style={{ animationDelay: `${index * 0.05}s` }}
          >
            <CardContent className="pt-6">
              <div className="flex items-center gap-3">
                <div
                  className="w-3 h-3 rounded-full"
                  style={{ backgroundColor: tag.color || "#A96418" }}
                />
                <span className="font-medium">{tag.name}</span>
              </div>
              {tag.category && (
                <Badge variant="outline" className="mt-3 text-xs">
                  {tag.category}
                </Badge>
              )}
            </CardContent>
          </Card>
        ))}
      </div>

      {tags.length === 0 && (
        <Card className="chamego-shadow-soft">
          <CardContent className="py-12 text-center">
            <TagsIcon className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">Nenhuma tag criada ainda</h3>
            <p className="text-muted-foreground mb-4">
              Crie tags para classificar e organizar seus clientes
            </p>
            <Button className="chamego-gradient-dourado text-primary-foreground">
              <Plus className="w-4 h-4 mr-2" />
              Criar Primeira Tag
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
