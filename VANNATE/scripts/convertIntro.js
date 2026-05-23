const fs = require('fs');
const path = require('path');

const htmlPath = path.join(__dirname, '../public/intro_prototype.html');
const outPath = path.join(__dirname, '../src/app/intro/page.tsx');

let html = fs.readFileSync(htmlPath, 'utf8');

// Extract Tailwind config
const tailwindConfigMatch = html.match(/<script id="tailwind-config">([\s\S]*?)<\/script>/);
let tailwindConfig = tailwindConfigMatch ? tailwindConfigMatch[1] : '';

// Extract styles
const styleMatch = html.match(/<style>([\s\S]*?)<\/style>/g);
let styles = '';
if (styleMatch) {
  styles = styleMatch.map(s => s.replace(/<\/?style>/g, '')).join('\n');
}

// Extract body inner HTML
const bodyMatch = html.match(/<body[^>]*>([\s\S]*?)<\/body>/);
let bodyContent = bodyMatch ? bodyMatch[1] : '';

// Remove script from body
const scriptMatch = bodyContent.match(/<script>([\s\S]*?)<\/script>/);
let scriptContent = scriptMatch ? scriptMatch[1] : '';
bodyContent = bodyContent.replace(/<script>[\s\S]*?<\/script>/, '');

// Fix self-closing tags for React
bodyContent = bodyContent.replace(/<img([^>]*[^\/])>/g, '<img$1 />');
bodyContent = bodyContent.replace(/<br>/g, '<br />');
bodyContent = bodyContent.replace(/<hr([^>]*[^\/])>/g, '<hr$1 />');
bodyContent = bodyContent.replace(/<input([^>]*[^\/])>/g, '<input$1 />');

// Convert class= to className=
bodyContent = bodyContent.replace(/class="/g, 'className="');

// Fix inline styles (e.g. style="width: 100%;")
// Very basic replacement for known styles or just remove them if not strictly needed.
// Looking at code.html, it barely uses inline styles, mostly tailwind.
// But let's handle style strings just in case by converting them to React style objects.
bodyContent = bodyContent.replace(/style="([^"]+)"/g, (match, styleStr) => {
    const rules = styleStr.split(';').filter(Boolean);
    const obj = {};
    rules.forEach(rule => {
        const [key, value] = rule.split(':');
        if (key && value) {
            const camelKey = key.trim().replace(/-([a-z])/g, g => g[1].toUpperCase());
            obj[camelKey] = value.trim();
        }
    });
    return `style={${JSON.stringify(obj)}}`;
});

// Create the React component
const reactComponent = `
"use client";
import { useEffect, useRef } from 'react';
import Script from 'next/script';
import { useRouter } from 'next/navigation';

export default function IntroPage() {
    const router = useRouter();
    const containerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (!containerRef.current) return;
        
        // Execute the script logic
        const btnInit = containerRef.current.querySelector('#btn-init');
        const divineFlash = containerRef.current.querySelector('#divine-flash');
        
        if (btnInit) {
            btnInit.addEventListener('click', () => {
                if (divineFlash) divineFlash.classList.add('active');
                setTimeout(() => {
                    router.push('/login');
                }, 1500);
            });
        }

        setTimeout(() => {
            const overlay = containerRef.current?.querySelector('#init-overlay');
            if (overlay) overlay.classList.add('init-fade-out');
        }, 1500);

        const audioBtn = containerRef.current.querySelector('#audio-toggle');
        let isAudioPlaying = false;
        if (audioBtn) {
            audioBtn.addEventListener('click', () => {
                isAudioPlaying = !isAudioPlaying;
                const icon = audioBtn.querySelector('.material-symbols-outlined');
                if (icon) {
                    if (isAudioPlaying) {
                        icon.textContent = 'volume_up';
                        icon.classList.add('text-primary', 'glow-text');
                    } else {
                        icon.textContent = 'volume_off';
                        icon.classList.remove('text-primary', 'glow-text');
                    }
                }
            });
        }

        const tiltCards = containerRef.current.querySelectorAll('.tilt-card:not(.stack-card)');
        tiltCards.forEach(card => {
            const htmlCard = card as HTMLElement;
            htmlCard.addEventListener('mousemove', (e: MouseEvent) => {
                const rect = htmlCard.getBoundingClientRect();
                const x = e.clientX - rect.left;
                const y = e.clientY - rect.top;
                
                const centerX = rect.width / 2;
                const centerY = rect.height / 2;
                
                const rotateX = ((y - centerY) / centerY) * -15;
                const rotateY = ((x - centerX) / centerX) * 15;
                
                htmlCard.style.transform = \`perspective(1200px) rotateX(\${rotateX}deg) rotateY(\${rotateY}deg) scale3d(1.02, 1.02, 1.02)\`;
            });
            
            htmlCard.addEventListener('mouseleave', () => {
                htmlCard.style.transform = 'perspective(1200px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)';
            });
        });
    }, [router]);

    return (
        <div ref={containerRef} className="antialiased perspective-wrapper dark bg-background transition-colors duration-500 overflow-x-hidden min-h-screen">
            <Script src="https://cdn.tailwindcss.com?plugins=forms,container-queries" strategy="beforeInteractive" />
            <Script id="tailwind-config" strategy="beforeInteractive">
                {\`${tailwindConfig.replace(/`/g, '\\`')}\`}
            </Script>
            <style dangerouslySetInnerHTML={{ __html: \`${styles.replace(/`/g, '\\`')}\` }} />
            
            {/* INJECTED HTML */}
            <div dangerouslySetInnerHTML={{ __html: \`${bodyContent.replace(/`/g, '\\`').replace(/\$/g, '\\$')}\` }} />
        </div>
    );
}
`;

fs.writeFileSync(outPath, reactComponent);
console.log('Successfully converted code.html to page.tsx');
