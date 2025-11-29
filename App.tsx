'use client';

import React, { useState, useEffect } from 'react';
import { 
  Menu, Github, ArrowRight, Check, Sparkles, Box, 
  Search, ExternalLink, Zap, Monitor, Code, MoreHorizontal
} from 'lucide-react';
import { 
  Button, Card, Input, Badge, Divider, Avatar, 
  ProgressBar, Tabs, Switch, Checkbox, Radio, 
  Modal, Tooltip, Alert, Textarea, Select,
  ToastProvider, useToast, CodeBlock, Slider,
  DatePicker, FileUpload, Breadcrumb, Pagination, Stepper,
  MenuComp, Popover, Skeleton, Spinner, Table, List, Chip,
  Accordion, Carousel, Drawer, Container, Grid, Link
} from './components/FujiSystem';
import { CATALOG_SECTIONS } from './constants';

// --- MASCOT SVG COMPONENT ---
// Created to ensure the character displays correctly without external image dependencies
const HakkaMascot = () => (
  <svg viewBox="0 0 200 200" className="w-full h-full drop-shadow-[5px_5px_0px_rgba(45,52,54,0.3)] animate-[bounce-sm_3s_infinite]">
    <defs>
      <pattern id="dotPattern" x="0" y="0" width="10" height="10" patternUnits="userSpaceOnUse">
        <circle cx="2" cy="2" r="1" fill="#2d3436" opacity="0.1" />
      </pattern>
    </defs>
    
    {/* Background Aura */}
    <circle cx="100" cy="110" r="80" fill="url(#dotPattern)" opacity="0.6" />
    
    {/* Body Shape (Soft Mountain/Pudding) */}
    <path
      d="M50 160 L65 70 Q100 40 135 70 L150 160 Q100 175 50 160 Z"
      fill="white"
      stroke="#2d3436"
      strokeWidth="4"
      strokeLinejoin="round"
    />

    {/* Sauce/Snow Cap */}
    <path
      d="M65 70 Q100 40 135 70 L140 85 Q120 75 100 85 Q80 75 60 85 Z"
      fill="#f98476"
      stroke="#2d3436"
      strokeWidth="4"
      strokeLinejoin="round"
    />
    
    {/* Face */}
    <g transform="translate(0, -30)">
      {/* Eyes */}
      <circle cx="85" cy="100" r="3" fill="#2d3436" />
      <circle cx="115" cy="100" r="3" fill="#2d3436" />

      {/* Blush */}
      <circle cx="75" cy="108" r="5" fill="#ffcc00" opacity="0.6" />
      <circle cx="125" cy="108" r="5" fill="#ffcc00" opacity="0.6" />

      {/* Mouth */}
      <path d="M95 105 Q100 110 105 105" fill="none" stroke="#2d3436" strokeWidth="2.5" strokeLinecap="round" />
    </g>

    {/* Steam / Emotion Lines */}
    <path d="M155 60 Q165 50 155 40" fill="none" stroke="#2d3436" strokeWidth="3" strokeLinecap="round" className="animate-pulse" />
    <path d="M45 60 Q35 50 45 40" fill="none" stroke="#2d3436" strokeWidth="3" strokeLinecap="round" className="animate-pulse" />
    
    {/* Wings (Simple) */}
    <path d="M50 90 Q30 80 40 60" fill="white" stroke="#2d3436" strokeWidth="3" />
    <path d="M150 90 Q170 80 160 60" fill="white" stroke="#2d3436" strokeWidth="3" />
  </svg>
);

const ColorSwatch = ({ name, color, hex }: { name: string; color: string; hex: string }) => {
  const { addToast } = useToast();
  
  const copyToClipboard = () => {
    navigator.clipboard.writeText(hex);
    addToast({ title: 'COLOR COPIED!', description: `${name} (${hex}) copied.`, type: 'success' });
  };

  return (
    <div className="flex flex-col gap-2 group cursor-pointer" onClick={copyToClipboard}>
      <div 
        className={`h-28 w-full rounded-xl border-4 border-hakka-dark shadow-game group-hover:shadow-game-lg transition-all duration-200 group-hover:-translate-y-1 ${color} relative overflow-hidden`}
      >
        <div className="absolute inset-0 bg-white opacity-0 group-hover:opacity-10 transition-opacity"></div>
        <div className="absolute bottom-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity bg-black/20 text-white text-xs px-2 py-1 rounded font-mono">
          CLICK TO COPY
        </div>
      </div>
      <div className="flex justify-between items-start px-1">
        <div>
          <p className="font-pixel text-xl leading-none uppercase tracking-wide">{name}</p>
          <p className="font-mono text-xs font-bold bg-hakka-dark text-white inline-block px-1 mt-1">{hex}</p>
        </div>
      </div>
    </div>
  );
};

const SectionHeader = ({ title, description }: { title: string; description: string }) => (
  <div className="mb-10 relative">
    <div className="absolute -left-4 top-0 bottom-0 w-2 bg-hakka-primary transform -skew-x-12"></div>
    <h2 className="text-5xl md:text-6xl font-pixel uppercase text-hakka-dark mb-3 tracking-wide drop-shadow-[3px_3px_0_rgba(255,255,255,1)]">
      {title}
    </h2>
    <p className="font-mono text-hakka-dark/80 max-w-2xl bg-white/80 p-2 border-l-4 border-hakka-accent">
      {description}
    </p>
  </div>
);

const ComponentShowcase = ({ title, children, code, className = '' }: { title: string; children: React.ReactNode; code?: string; className?: string }) => {
  const [view, setView] = useState<'preview' | 'code'>('preview');

  return (
    <div className={`mb-16 scroll-mt-24 group flex flex-col ${className}`}>
      <div className="flex items-center justify-between mb-4 shrink-0">
        <h3 className="font-bold font-mono text-sm uppercase text-hakka-dark bg-hakka-accent px-3 py-1 border-2 border-hakka-dark shadow-[2px_2px_0_#2d3436] inline-flex items-center gap-2">
           <span className="w-2 h-2 bg-white rounded-full border border-hakka-dark"></span>
           {title}
        </h3>
        {code && (
          <div className="flex gap-2">
            <button 
              onClick={() => setView('preview')}
              className={`p-1.5 border-2 border-hakka-dark rounded ${view === 'preview' ? 'bg-hakka-primary text-white' : 'bg-white hover:bg-gray-100'}`}
            >
              <Monitor size={16} />
            </button>
            <button 
              onClick={() => setView('code')}
              className={`p-1.5 border-2 border-hakka-dark rounded ${view === 'code' ? 'bg-hakka-primary text-white' : 'bg-white hover:bg-gray-100'}`}
            >
              <Code size={16} />
            </button>
          </div>
        )}
      </div>

      <div className={`border-4 border-hakka-dark bg-white shadow-game-lg relative overflow-hidden transition-transform duration-300 group-hover:translate-x-1 flex-grow flex flex-col`}>
        {view === 'preview' ? (
           <div className="p-8 md:p-12 bg-pattern-dots bg-[length:20px_20px] flex-grow">
             <div className="relative z-10 h-full">
               {children}
             </div>
           </div>
        ) : (
           <div className="p-0 flex-grow">
             <CodeBlock code={code || ''} />
           </div>
        )}
      </div>
    </div>
  );
};

function MainApp() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [activeSection, setActiveSection] = useState('intro');
  const [radioVal, setRadioVal] = useState('opt1');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  
  // Interactive state for form demos
  const [switch1, setSwitch1] = useState(true);
  const [switch2, setSwitch2] = useState(false);
  const [checkbox1, setCheckbox1] = useState(true);
  const [page, setPage] = useState(1);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToSection = (id: string) => {
    setActiveSection(id);
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
    setSidebarOpen(false);
  };

  return (
    <div className="min-h-screen bg-hakka-light flex font-sans text-hakka-dark selection:bg-hakka-primary selection:text-white overflow-x-hidden">
      
      {/* Mobile Overlay */}
      <div 
        className={`fixed inset-0 bg-hakka-dark/80 z-40 transition-opacity duration-300 md:hidden backdrop-blur-sm ${sidebarOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`} 
        onClick={() => setSidebarOpen(false)}
      ></div>

      {/* Sidebar / Power Scouter */}
      <aside 
        className={`
          fixed top-0 left-0 h-screen w-80 bg-hakka-dark text-white z-50 flex flex-col transition-transform duration-300 ease-out shadow-2xl
          ${sidebarOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}
          border-r-8 border-hakka-accent
        `}
      >
        <div className="p-8 bg-hakka-dark relative overflow-hidden border-b-4 border-white/10">
           <div className="absolute inset-0 bg-stripes opacity-10"></div>
           <div className="relative z-10 flex flex-col items-center">
             <div className="w-20 h-20 bg-hakka-primary rounded-full border-4 border-white flex items-center justify-center shadow-[0_0_20px_rgba(249,132,118,0.5)] mb-4 animate-[bounce-sm_3s_infinite]">
                <Sparkles size={40} className="text-white" />
             </div>
             <h1 className="font-pixel text-4xl text-center leading-none tracking-widest text-hakka-accent drop-shadow-md">HAKKA<br/>DAIKON</h1>
             <div className="mt-3 bg-white/20 px-3 py-1 rounded text-[10px] font-mono font-bold tracking-[0.2em] border border-white/30">SYSTEM v2.5</div>
           </div>
        </div>

        <nav className="flex-1 overflow-y-auto p-6 space-y-2 custom-scrollbar">
          <div className="text-xs font-mono text-white/40 mb-4 uppercase tracking-widest pl-2">Navigation Module</div>
          {CATALOG_SECTIONS.map((item) => (
            <button
              key={item.id}
              onClick={() => scrollToSection(item.id)}
              className={`
                w-full flex items-center gap-4 px-4 py-3 rounded border-2 text-left transition-all duration-200 group relative overflow-hidden
                ${activeSection === item.id 
                  ? 'bg-hakka-primary border-hakka-primary text-hakka-dark shadow-[4px_4px_0_rgba(0,0,0,0.5)] transform -translate-y-1' 
                  : 'bg-transparent border-white/20 text-white/70 hover:bg-white/10 hover:border-white hover:text-white'}
              `}
            >
              <span className={`group-hover:scale-110 transition-transform duration-300 ${activeSection === item.id ? 'text-hakka-dark' : 'text-hakka-accent'}`}>
                {item.icon}
              </span>
              <span className="font-bold font-pixel uppercase text-lg tracking-wide z-10 relative">{item.label}</span>
              {activeSection === item.id && <ArrowRight size={16} className="ml-auto animate-pulse" />}
            </button>
          ))}
          
          <div className="mt-12 p-4 bg-white/5 border border-white/10 rounded-lg">
             <div className="flex items-center gap-3 mb-2">
               <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse"></div>
               <span className="font-mono text-xs text-green-400">SYSTEM ONLINE</span>
             </div>
             <div className="h-1 bg-white/20 rounded-full overflow-hidden">
               <div className="h-full bg-green-400 w-3/4 animate-[pulse_2s_infinite]"></div>
             </div>
          </div>
        </nav>
      </aside>

      {/* Main Content */}
      <main className="flex-1 min-w-0 relative md:ml-80 transition-all duration-300">
        {/* Top Bar */}
        <header 
          className={`
            h-20 fixed w-[calc(100%-20rem)] top-0 z-30 flex items-center justify-between px-6 md:px-10 transition-all duration-300
            ${isScrolled ? 'bg-white/90 backdrop-blur-md border-b-4 border-hakka-dark shadow-md' : 'bg-transparent border-b-4 border-transparent'}
          `}
        >
          <button onClick={() => setSidebarOpen(true)} className="md:hidden p-2 border-2 border-hakka-dark bg-white rounded shadow-game-sm active:translate-y-0.5 active:shadow-none">
            <Menu size={24} />
          </button>
          
          <div className="hidden md:flex items-center gap-4 w-full max-w-lg">
             <div className="relative w-full group">
                <div className="absolute inset-0 bg-hakka-dark rounded-full translate-y-1 translate-x-1 transition-transform group-focus-within:translate-x-2 group-focus-within:translate-y-2"></div>
                <div className="relative flex items-center w-full">
                  <Search className="absolute left-4 text-hakka-dark/40" size={18} />
                  <input 
                    type="text" 
                    placeholder="SEARCH MODULES..." 
                    className="w-full pl-12 pr-4 py-2.5 bg-white border-2 border-hakka-dark rounded-full font-mono text-sm font-bold placeholder:font-normal focus:outline-none focus:ring-0"
                  />
                </div>
             </div>
          </div>

          <div className="flex gap-4">
            <a href="#" className="hidden sm:flex items-center gap-2 font-bold font-pixel text-lg hover:text-hakka-primary transition-colors">
              <Github size={20} />
              <span className="border-b-2 border-hakka-dark">GITHUB</span>
            </a>
            <Button size="sm" variant="accent" icon={<Zap size={16}/>} className="hidden sm:flex">DOWNLOAD</Button>
          </div>
        </header>

        <div className="p-6 md:p-12 max-w-7xl mx-auto pb-40 mt-20">
          
          {/* INTRO HERO */}
          <section id="intro" className="mb-32 relative">
            <div className="absolute -top-20 -right-20 w-96 h-96 bg-hakka-accent/20 rounded-full blur-3xl pointer-events-none"></div>
            
            <div className="bg-hakka-primary text-hakka-dark p-8 md:p-16 rounded-3xl border-8 border-hakka-dark shadow-game-xl relative overflow-hidden">
               <div className="absolute inset-0 bg-stripes opacity-10 pointer-events-none"></div>
               
               <div className="relative z-10 flex flex-col md:flex-row items-center gap-10">
                 <div className="flex-1 text-center md:text-left">
                   <Badge variant="accent" className="mb-6 text-sm py-1 px-3 shadow-md rotate-[-2deg]">v2.5 STABLE RELEASE</Badge>
                   <h1 className="text-6xl md:text-9xl font-pixel mb-6 text-white drop-shadow-[6px_6px_0_#2d3436] leading-[0.9]">
                     HAKKA<br/><span className="text-hakka-dark text-stroke-white">DAIKON</span>
                   </h1>
                   <p className="font-mono text-lg md:text-xl font-bold bg-white p-6 rounded-xl border-4 border-hakka-dark shadow-game inline-block max-w-2xl leading-relaxed relative">
                     <span className="absolute -top-3 -left-3 bg-hakka-accent border-2 border-hakka-dark w-6 h-6 rounded-full"></span>
                     A high-energy, neo-pop design system built for gamified web applications. 
                     Features pixel-perfect typography, hard shadows, and distinct "clicky" interactions.
                   </p>
                   <div className="mt-8 flex flex-wrap justify-center md:justify-start gap-4">
                     <Button size="lg" variant="accent" onClick={() => scrollToSection('colors')}>EXPLORE COLORS</Button>
                     <Button size="lg" variant="secondary" icon={<Github/>}>SOURCE CODE</Button>
                   </div>
                 </div>
                 
                 <div className="w-full md:w-1/3 flex justify-center relative">
                    {/* Character Visual */}
                    <div className="relative w-80 h-80 flex items-center justify-center">
                       {/* Decorative bg circle */}
                       <div className="absolute inset-0 bg-white border-4 border-hakka-dark rounded-full transform rotate-3 shadow-game-lg"></div>
                       {/* Character SVG */}
                       <div className="relative z-10 w-64 h-64">
                         <HakkaMascot />
                       </div>
                       {/* Floating UI Elements */}
                       <div className="absolute -top-4 -right-4 bg-hakka-blue border-4 border-hakka-dark px-3 py-1 rounded-full shadow-game-sm transform rotate-12 z-20">
                          <span className="font-pixel text-white text-xl">NEW!</span>
                       </div>
                       <div className="absolute -bottom-6 left-1/2 -translate-x-1/2 bg-hakka-dark text-hakka-accent px-4 py-2 border-2 border-white rounded-lg shadow-game-sm z-20 whitespace-nowrap">
                          <span className="font-mono font-bold">LVL. 99 MASCOT</span>
                       </div>
                    </div>
                 </div>
               </div>
            </div>
          </section>

          {/* COLORS */}
          <section id="colors">
            <SectionHeader title="Color Palette" description="Click any color card to copy its hex code to your clipboard." />
            
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8">
              <ColorSwatch name="Salmon" color="bg-hakka-primary" hex="#f98476" />
              <ColorSwatch name="Gold" color="bg-hakka-accent" hex="#ffcc00" />
              <ColorSwatch name="Green" color="bg-hakka-success" hex="#88d66c" />
              <ColorSwatch name="Sky" color="bg-hakka-blue" hex="#74b9ff" />
              <ColorSwatch name="Ink" color="bg-hakka-dark" hex="#2d3436" />
              <ColorSwatch name="Cream" color="bg-hakka-light" hex="#fff4f2" />
              <ColorSwatch name="White" color="bg-white" hex="#ffffff" />
              <ColorSwatch name="Shadow" color="bg-hakka-shadow" hex="#1e272e" />
            </div>
          </section>

          <Divider />

          {/* TYPOGRAPHY */}
          <section id="typography">
            <SectionHeader title="Typography" description="A mix of retro pixel fonts for impact and clean monospace for data." />
            
            <ComponentShowcase 
              title="Font Stack" 
              code={`<h1 className="font-pixel">Heading</h1>\n<p className="font-mono">Data text</p>\n<p className="font-sans">Body text</p>`}
            >
              <div className="space-y-12">
                <div className="relative group">
                   <span className="absolute -left-12 top-2 font-mono text-xs text-hakka-dark/40 -rotate-90 hidden md:block">VT323 (Google Fonts)</span>
                   <p className="font-pixel text-6xl md:text-9xl leading-none text-hakka-dark group-hover:text-hakka-primary transition-colors cursor-default">
                     Hakkadaikon
                   </p>
                   <p className="font-pixel text-2xl md:text-4xl text-hakka-dark/60 mt-2">
                     THE QUICK BROWN FOX JUMPS OVER THE LAZY DOG
                   </p>
                </div>
                <div className="border-t-2 border-hakka-dark/10 pt-8">
                   <p className="font-mono text-2xl md:text-4xl font-bold text-hakka-dark mb-2">
                     JetBrains Mono_
                   </p>
                   <p className="font-mono text-base md:text-lg text-hakka-dark/70 bg-gray-100 p-4 rounded border-l-4 border-hakka-accent">
                     const designSystem = "Complete"; // Used for code, data, and technical UI elements.
                   </p>
                </div>
                 <div className="pt-4">
                  <Link href="#">This is a styled text link</Link>
                </div>
              </div>
            </ComponentShowcase>
          </section>

          <Divider />

          {/* BUTTONS */}
          <section id="buttons">
            <SectionHeader title="Buttons" description="Tactile, pressable buttons with deep shadows." />

            <ComponentShowcase 
              title="Variants"
              code={`<Button variant="primary">Click Me</Button>\n<Button variant="accent" icon={<Zap />}>Action</Button>`}
            >
              <div className="flex flex-wrap gap-4 items-end">
                <Button>Primary Button</Button>
                <Button variant="secondary">Secondary</Button>
                <Button variant="accent">Accent</Button>
                <Button variant="success">Success</Button>
                <Button variant="danger">Danger</Button>
                <Button variant="ghost">Ghost</Button>
              </div>
            </ComponentShowcase>

            <ComponentShowcase 
              title="Sizes & States"
              code={`<Button size="lg" isLoading>Loading...</Button>\n<Button size="sm" disabled>Disabled</Button>`}
            >
              <div className="flex flex-wrap items-center gap-6">
                <Button size="sm">Small</Button>
                <Button size="md">Medium</Button>
                <Button size="lg">Large Button</Button>
                <div className="w-px h-12 bg-hakka-dark/20 mx-4"></div>
                <Button isLoading>Processing</Button>
                <Button disabled>Disabled</Button>
                <Button icon={<Check size={18}/>}>With Icon</Button>
              </div>
            </ComponentShowcase>
          </section>

          <Divider />

          {/* FORMS */}
          <section id="forms">
             <SectionHeader title="Forms" description="Chunky inputs with bold borders that are easy to tap." />

             <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <ComponentShowcase 
                  title="Inputs" 
                  className="h-full"
                  code={`<Input label="Name" placeholder="..." />\n<Select options={opts} />`}
                >
                  <div className="space-y-6">
                    <Input label="Character Name" placeholder="Enter name..." required />
                    <Input label="Email Address" placeholder="user@example.com" icon={<Monitor size={18} />} />
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <Select
                        label="Region"
                        options={[
                          { value: 'us', label: 'NA East' },
                          { value: 'eu', label: 'Europe' },
                          { value: 'asia', label: 'Asia' },
                        ]}
                      />
                      <DatePicker label="Birth Date" />
                    </div>
                    <Slider label="Volume" defaultValue={50} />
                    <FileUpload label="Avatar Upload" />
                  </div>
                </ComponentShowcase>

                <ComponentShowcase 
                  title="Controls" 
                  className="h-full"
                  code={`<Switch checked={switch1} onChange={setSwitch1} />\n<Checkbox label="Agree" checked={checkbox1} onChange={setCheckbox1} />`}
                >
                  <div className="space-y-8">
                    <div className="bg-gray-50 p-6 rounded-lg border-2 border-hakka-dark">
                      <h4 className="font-pixel text-lg mb-4 text-hakka-dark/50 uppercase">Settings</h4>
                      <div className="flex flex-col gap-4">
                        <Switch label="Enable Notifications" checked={switch1} onChange={setSwitch1} />
                        <Switch label="Dark Mode (Beta)" checked={switch2} onChange={setSwitch2} />
                      </div>
                    </div>

                    <div className="bg-gray-50 p-6 rounded-lg border-2 border-hakka-dark">
                      <h4 className="font-pixel text-lg mb-4 text-hakka-dark/50 uppercase">Agreements</h4>
                      <div className="flex flex-col gap-3">
                        <Checkbox label="I accept the terms" checked={checkbox1} onChange={setCheckbox1} />
                        <div className="flex gap-6 mt-4 pt-4 border-t border-hakka-dark/10">
                          <Radio 
                            label="Monthly" 
                            name="plan" 
                            checked={radioVal === 'opt1'} 
                            onChange={() => setRadioVal('opt1')} 
                          />
                           <Radio 
                            label="Yearly" 
                            name="plan" 
                            checked={radioVal === 'opt2'} 
                            onChange={() => setRadioVal('opt2')} 
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </ComponentShowcase>
             </div>
          </section>

          <Divider />

          {/* FEEDBACK */}
          <section id="feedback">
            <SectionHeader title="Feedback" description="Communicate game state effectively." />
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <ComponentShowcase 
                title="Alerts & Status"
                code={`<Alert variant="info" title="Note">Content</Alert>`}
              >
                <div className="space-y-6">
                  <Alert title="Quest Updated" variant="success">
                    You have successfully completed the tutorial. New regions are now unlocked.
                  </Alert>
                  <Alert title="Server Maintenance" variant="info">
                    Servers will be down for scheduled maintenance at 03:00 UTC.
                  </Alert>
                  <div className="flex gap-4 items-center">
                    <Spinner size="md" />
                    <Skeleton className="h-4 w-32" />
                  </div>
                  <div className="flex gap-2 pt-4">
                     <Badge variant="primary">New</Badge>
                     <Badge variant="accent">Updated</Badge>
                     <Badge variant="danger">Bug</Badge>
                  </div>
                </div>
              </ComponentShowcase>

               <ComponentShowcase 
                 title="Overlays"
                 code={`<Tooltip content="Hi"><Button>Hover</Button></Tooltip>`}
               >
                  <div className="space-y-8 flex flex-col items-center justify-center h-full">
                     <div className="flex gap-4">
                        <Tooltip content="Inventory (I)">
                          <Button variant="secondary" icon={<Box size={18}/>}>Backpack</Button>
                        </Tooltip>
                        <Popover 
                          trigger={<Button variant="primary" icon={<MoreHorizontal size={18}/>}>Options</Button>}
                          content={
                            <div className="space-y-2">
                              <p className="font-bold border-b border-gray-200 pb-2">Menu</p>
                              <button className="w-full text-left hover:text-hakka-primary">Settings</button>
                              <button className="w-full text-left hover:text-hakka-primary">Profile</button>
                            </div>
                          } 
                        />
                     </div>
                     <Button onClick={() => setIsModalOpen(true)}>Open Dialog</Button>
                     <Button variant="ghost" onClick={() => setIsDrawerOpen(true)}>Open Drawer</Button>
                  </div>
               </ComponentShowcase>
            </div>
          </section>

          <Divider />

          {/* DATA DISPLAY */}
          <section id="data">
            <SectionHeader title="Data Display" description="Windows into your content." />
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
               <ComponentShowcase title="Structured Data">
                  <div className="space-y-8">
                    <Table 
                      headers={['ID', 'Name', 'Role']} 
                      data={[
                        ['#001', 'Fuji San', 'Admin'],
                        ['#002', 'Sakura', 'User'],
                        ['#003', 'Taro', 'Guest'],
                      ]}
                    />
                    <List items={[
                      <span className="font-bold">Item 1: Sword of Truth</span>,
                      <span className="font-bold">Item 2: Shield of Valor</span>,
                      <span className="font-bold">Item 3: Potion of Healing</span>
                    ]} />
                  </div>
               </ComponentShowcase>

               <ComponentShowcase title="Rich Content">
                 <div className="space-y-6">
                   <div className="flex gap-2 flex-wrap">
                      <Chip label="React" />
                      <Chip label="Tailwind" onDelete={() => {}} />
                      <Chip label="TypeScript" />
                   </div>
                   <Accordion items={[
                     { title: 'Quest Log', content: 'You have 3 active quests in the Northern Region.' },
                     { title: 'Skills', content: 'Fireball (Lvl 5), Ice Shard (Lvl 2)' },
                   ]} />
                   <Carousel items={[
                     <img src="https://picsum.photos/400/200?random=1" className="w-full h-full object-cover" />,
                     <img src="https://picsum.photos/400/200?random=2" className="w-full h-full object-cover" />,
                     <img src="https://picsum.photos/400/200?random=3" className="w-full h-full object-cover" />,
                   ]} />
                 </div>
               </ComponentShowcase>
            </div>
          </section>

          <Divider />
          
          <section id="navigation">
            <SectionHeader title="Navigation" description="Helping users find their way." />
            <ComponentShowcase title="Nav Elements">
               <div className="space-y-8">
                 <Breadcrumb items={[
                   { label: 'Home', href: '#' },
                   { label: 'Products', href: '#' },
                   { label: 'Electronics', href: '#' },
                 ]} />
                 <Stepper steps={['Cart', 'Shipping', 'Payment']} current={1} />
                 <Pagination total={5} current={page} onChange={setPage} />
                 <Tabs 
                    tabs={['Account', 'Security', 'Billing']} 
                    activeTab={0} 
                    onChange={() => {}} 
                  />
               </div>
            </ComponentShowcase>
          </section>

        </div>
      </main>

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Mission Details">
        <div className="flex gap-4 mb-6">
          <div className="w-24 h-24 bg-hakka-dark shrink-0 border-2 border-hakka-dark">
            <img src="https://picsum.photos/400/400" className="w-full h-full object-cover opacity-80" />
          </div>
          <div>
            <h3 className="font-bold font-mono text-lg mb-1">OPERATION: RED RADISH</h3>
            <p className="text-sm opacity-70">
              Infiltrate the salad bar and retrieve the secret dressing recipe. 
              Be careful of the crouton guards.
            </p>
          </div>
        </div>
        <div className="bg-yellow-50 p-4 border-2 border-yellow-200 rounded mb-6 text-sm font-mono text-yellow-800">
          <strong>REWARD:</strong> 500 Gold, 2x Crunchy Leaves
        </div>
        <div className="flex justify-end gap-3">
          <Button variant="ghost" onClick={() => setIsModalOpen(false)}>Abandon</Button>
          <Button onClick={() => setIsModalOpen(false)} icon={<Check size={16}/>}>Accept Quest</Button>
        </div>
      </Modal>

      <Drawer isOpen={isDrawerOpen} onClose={() => setIsDrawerOpen(false)}>
        <div className="space-y-6 font-mono">
          <div>
            <h4 className="font-bold uppercase mb-2">Profile Settings</h4>
            <div className="space-y-2">
              <Input placeholder="Username" />
              <Input placeholder="Bio" />
            </div>
          </div>
          <Divider />
          <div>
            <h4 className="font-bold uppercase mb-2">Preferences</h4>
            <div className="space-y-3">
              <Switch label="Sound Effects" checked={true} onChange={() => {}} />
              <Switch label="Music" checked={false} onChange={() => {}} />
            </div>
          </div>
          <div className="pt-8">
            <Button className="w-full">Save Changes</Button>
          </div>
        </div>
      </Drawer>

    </div>
  );
}

export default function App() {
  return (
    <ToastProvider>
      <MainApp />
    </ToastProvider>
  );
}