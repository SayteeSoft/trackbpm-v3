"use client";

import { useState } from 'react';
import type { CanvasComponentData } from '@/lib/types';
import { SidebarProvider, Sidebar, SidebarInset, SidebarHeader, SidebarContent, SidebarGroup, SidebarGroupLabel, SidebarSeparator } from '@/components/ui/sidebar';
import ComponentPalette from '@/components/component-palette';
import AiAssistant from '@/components/ai-assistant';
import ThemeCustomizer from '@/components/theme-customizer';
import CanvasRenderer from '@/components/canvas-renderer';
import { PenTool } from 'lucide-react';

export default function Home() {
  const [components, setComponents] = useState<CanvasComponentData[]>([]);

  const addComponent = (type: CanvasComponentData['type']) => {
    setComponents(prev => [
      ...prev,
      { id: `comp_${Date.now()}`, type },
    ]);
  };

  const removeComponent = (id: string) => {
    setComponents(prev => prev.filter(c => c.id !== id));
  };

  return (
    <SidebarProvider>
      <Sidebar>
        <SidebarHeader>
          <div className="flex items-center gap-2">
            <div className="bg-primary/20 text-primary p-2 rounded-lg">
                <PenTool className="h-6 w-6" />
            </div>
            <h1 className="text-xl font-semibold font-headline">Tabula Rasa</h1>
          </div>
        </SidebarHeader>
        <SidebarContent>
          <SidebarGroup>
            <SidebarGroupLabel>Components</SidebarGroupLabel>
            <ComponentPalette onAddComponent={addComponent} />
          </SidebarGroup>
          <SidebarSeparator />
          <SidebarGroup>
            <SidebarGroupLabel>AI Assistant</SidebarGroupLabel>
            <AiAssistant />
          </SidebarGroup>
          <SidebarSeparator />
          <SidebarGroup>
            <SidebarGroupLabel>Theme</SidebarGroupLabel>
            <ThemeCustomizer />
          </SidebarGroup>
        </SidebarContent>
      </Sidebar>
      <SidebarInset>
        <div className="flex-1 h-full bg-background">
          {components.length === 0 ? (
            <div className="flex items-center justify-center h-full p-4">
               <div className="flex items-center justify-center h-full w-full border-2 border-dashed border-border rounded-lg bg-background/50">
                <div className="text-center">
                  <h2 className="text-2xl font-headline text-muted-foreground">Blank Canvas</h2>
                  <p className="text-muted-foreground">Add components from the sidebar to begin.</p>
                </div>
              </div>
            </div>
          ) : (
            <div className="p-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 auto-rows-max">
              {components.map(component => (
                <CanvasRenderer key={component.id} component={component} onRemove={removeComponent} />
              ))}
            </div>
          )}
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
