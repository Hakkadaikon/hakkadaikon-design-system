import React from 'react';
import { Palette, Type, MousePointer2, LayoutTemplate, MessageSquare, Layers } from 'lucide-react';

export const CATALOG_SECTIONS = [
  { id: 'intro', label: 'Introduction', icon: <LayoutTemplate size={20} /> },
  { id: 'colors', label: 'Colors', icon: <Palette size={20} /> },
  { id: 'typography', label: 'Typography', icon: <Type size={20} /> },
  { id: 'buttons', label: 'Buttons', icon: <MousePointer2 size={20} /> },
  { id: 'forms', label: 'Forms', icon: <Layers size={20} /> },
  { id: 'feedback', label: 'Feedback', icon: <MessageSquare size={20} /> },
  { id: 'data', label: 'Data Display', icon: <LayoutTemplate size={20} /> },
];

export const MOCK_USERS = [
  { id: 1, name: "Fuji San", role: "Mountain God", avatar: "https://picsum.photos/100/100" },
  { id: 2, name: "Sakura Chan", role: "Design Ninja", avatar: "https://picsum.photos/101/101" },
  { id: 3, name: "Taro Kun", role: "Code Samurai", avatar: "https://picsum.photos/102/102" },
];