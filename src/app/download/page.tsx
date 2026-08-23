"use client";

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { PointerHighlight } from '@/components/ui/pointer-highlight';
import { GlowingEffect } from '@/components/ui/glowing-effect';
import { AnimatedButton } from '@/components/ui/animated-button';
import { Monitor, Smartphone } from 'lucide-react';
import {
  Navbar,
  NavBody,
  NavItems,
  MobileNav,
  NavbarLogo,
  NavbarButton,
  MobileNavHeader,
  MobileNavToggle,
  MobileNavMenu,
} from "@/components/ui/resizable-navbar";

export default function DownloadPage() {
  const navItems = [
    {
      name: "About",
      link: "/about",
    },
    {
      name: "Features",
      link: "/features",
    },
    {
      name: "How It Works",
      link: "/how-it-works",
    },
  ];

  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleWindowsDownload = () => {
    // Add your Windows download logic here
    console.log('Downloading Windows version...');
  };

  const handleMobileDownload = () => {
    // Add your mobile download logic here
    console.log('Downloading mobile version...');
  };

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Navigation */}
      <Navbar>
        {/* Desktop Navigation */}
        <NavBody>
          <NavbarLogo />
          <NavItems items={navItems} />
          <div className="flex items-center gap-4">
           
            <NavbarButton variant="primary">Download</NavbarButton>
          </div>
        </NavBody>

        {/* Mobile Navigation */}
        <MobileNav>
          <MobileNavHeader>
            <NavbarLogo />
            <MobileNavToggle
              isOpen={isMobileMenuOpen}
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            />
          </MobileNavHeader>

          <MobileNavMenu
            isOpen={isMobileMenuOpen}
            onClose={() => setIsMobileMenuOpen(false)}
          >
            {navItems.map((item, idx) => (
              <a
                key={`mobile-link-${idx}`}
                href={item.link}
                onClick={() => setIsMobileMenuOpen(false)}
                className="relative text-neutral-300"
              >
                <span className="block">{item.name}</span>
              </a>
            ))}
            <div className="flex w-full flex-col gap-4">
              <NavbarButton
                onClick={() => setIsMobileMenuOpen(false)}
                variant="secondary"
                className="w-full"
              >
                Documentation
              </NavbarButton>
              <NavbarButton
                onClick={() => setIsMobileMenuOpen(false)}
                variant="primary"
                className="w-full"
              >
                Download
              </NavbarButton>
            </div>
          </MobileNavMenu>
        </MobileNav>
      </Navbar>

      {/* Main Content */}
      <div className="flex flex-col items-center justify-center p-8 pt-24">
        <div className="max-w-6xl mx-auto">
          {/* Header Section */}
          <div className="text-center mb-16">
            <h1 className="text-5xl md:text-7xl font-bold mb-6  flex justify-center">
              <PointerHighlight 
                rectangleClassName="border-blue-500/50"
                pointerClassName="text-blue-400"
              >
                Download Now
              </PointerHighlight>
            </h1>
            <p className="text-xl md:text-2xl text-gray-400 max-w-3xl mx-auto">
              Get started with our application on your preferred platform.
            </p>
          </div>

          {/* Download Cards */}
          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {/* Windows Download Card */}
            <div className="relative min-h-[28rem] rounded-2xl border border-zinc-600 p-2 md:rounded-3xl md:p-3" style={{backgroundColor: '#171717'}}>
              <GlowingEffect
                spread={40}
                glow={true}
                disabled={false}
                proximity={64}
                inactiveZone={0.01}
              />
              <div className="relative flex h-full flex-col justify-between gap-6 overflow-hidden rounded-xl p-6 md:p-6 backdrop-blur-sm border border-zinc-600" style={{backgroundColor: '#171717'}}>
                <div className="flex flex-col items-center text-center space-y-6">
                 
                  
                  <div>
                    <h3 className="text-2xl font-bold mb-2">
                      
                        Windows Desktop
                    
                    </h3>
                    <p className="text-gray-400 text-sm mb-4">
                      Full-featured desktop application for Windows 10/11
                    </p>
                    <div className="space-y-2 text-sm text-gray-300">
                      <div className="flex items-center justify-center space-x-2">
                        <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                        <span>Native performance</span>
                      </div>
                      <div className="flex items-center justify-center space-x-2">
                        <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                        <span>Offline capabilities</span>
                      </div>
                      <div className="flex items-center justify-center space-x-2">
                        <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                        <span>Advanced features</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="mt-8">
                  <AnimatedButton
                    onClick={handleWindowsDownload}
                    className="font-semibold"
                  >
                    <Monitor className="w-4 h-4" />
                    Download for Windows
                  </AnimatedButton>
                  <p className="text-xs text-gray-500 text-center mt-2">
                    Version 2.1.0 • 45.2 MB
                  </p>
                </div>
              </div>
            </div>

            {/* Mobile Download Card */}
            <div className="relative min-h-[28rem] rounded-2xl border border-zinc-600 p-2 md:rounded-3xl md:p-3" style={{backgroundColor: '#171717'}}>
              <GlowingEffect
                spread={40}
                glow={true}
                disabled={false}
                proximity={64}
                inactiveZone={0.01}
              />
              <div className="relative flex h-full flex-col justify-between gap-6 overflow-hidden rounded-xl p-6 md:p-6 backdrop-blur-sm border border-zinc-600" style={{backgroundColor: '#171717'}}>
                <div className="flex flex-col items-center text-center space-y-6">
                  
                  
                  <div>
                    <h3 className="text-2xl font-bold mb-2">
                     
                        Mobile App
                      
                    </h3>
                    <p className="text-gray-400 text-sm mb-4">
                      Optimized mobile experience for iOS and Android
                    </p>
                    <div className="space-y-2 text-sm text-gray-300">
                      <div className="flex items-center justify-center space-x-2">
                        <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                        <span>Touch-optimized UI</span>
                      </div>
                      <div className="flex items-center justify-center space-x-2">
                        <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                        <span>Push notifications</span>
                      </div>
                      <div className="flex items-center justify-center space-x-2">
                        <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                        <span>Cross-platform sync</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="mt-8 space-y-3">
                  <AnimatedButton
                    onClick={handleMobileDownload}
                    className="font-semibold"
                  >
                    <Smartphone className="w-4 h-4" />
                    Get Mobile App
                  </AnimatedButton>
                  
                  {/* App Store Buttons */}
                 
                  
                  <p className="text-xs text-gray-500 text-center">
                    Version 1.8.2 • Free Download
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Additional Info */}
          <div className="text-center mt-16">
            <p className="text-gray-400 text-sm">
              Need help? Check out our{' '}
              <a href="/how-it-works" className="text-blue-400 hover:text-blue-300 underline">
                installation guide
              </a>{' '}
              or{' '}
              <a href="/about" className="text-blue-400 hover:text-blue-300 underline">
                contact support
              </a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}