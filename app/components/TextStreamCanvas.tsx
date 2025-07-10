'use client'; // This component uses browser APIs and hooks, so it must be a client component.

import React, { useRef, useEffect } from 'react';

const phrases = [
    "Invalid bank statement format", "Schema mismatch detected", "Job timed out", "Retrying upload...", 
    "File too large", "Missing invoice number", "Could not detect date field", "Unsupported document type", 
    "Polling exceeded max attempts", "Field confidence too low", "Job status: failed", "Extraction complete", 
    "Analyzing page 3...", "Awaiting PDF stream", "Buffer read error", "Unexpected file encoding"
];

const tagCount = 70;
const skewAngle = -12 * (Math.PI / 180); // Skew angle in radians

// Define a type for our tag objects for better code quality
type Tag = {
    x: number;
    y: number;
    text: string;
    fontSize: number;
    rotation: number; // in radians
    targetOpacity: number;
    animationDuration: number;
    animationProgress: number;
    // Properties for drawing
    textWidth: number;
    textHeight: number;
    paddingX: number;
    paddingY: number;
};

const TextStreamCanvas = () => {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const tagsRef = useRef<Tag[]>([]);
    const animationFrameId = useRef<number>();

    // Function to reset a tag's properties when its animation cycle completes
    const resetTag = (tag: Tag, canvasWidth: number, canvasHeight: number) => {
        tag.text = phrases[Math.floor(Math.random() * phrases.length)];
        tag.x = Math.random() * canvasWidth;
        tag.y = Math.random() * canvasHeight;
        tag.fontSize = Math.random() * 8 + 12; // 12px to 20px
        
        // --- MODIFIED LINE HERE ---
        // Limit angle to a range of -18 to +18 degrees.
        tag.rotation = (Math.random() * 36 - 18) * (Math.PI / 180); 
        
        tag.targetOpacity = Math.random() * 0.7 + 0.2; // 0.2 to 0.9
        // Lower animation speed: increase duration range
        tag.animationDuration = (Math.random() * 2.5 + 2.5) * 1000; // 2.5s to 5s in ms
        tag.animationProgress = Math.random() * tag.animationDuration; // Start at a random point in the cycle
        
        // Pre-calculate drawing properties
        const ctx = canvasRef.current?.getContext('2d');
        if (ctx) {
            ctx.font = `${tag.fontSize}px 'Courier New', Courier, monospace`;
            const metrics = ctx.measureText(tag.text);
            tag.textWidth = metrics.width;
            tag.textHeight = tag.fontSize * 1.2; // Approximate height
            tag.paddingX = 10;
            tag.paddingY = 3;
        }
    };

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        
        const ctx = canvas.getContext('2d');
        if (!ctx) return;
        
        let lastTime = 0;
        
        const resizeCanvas = () => {
            const dpr = window.devicePixelRatio || 1;
            canvas.width = window.innerWidth * dpr;
            canvas.height = window.innerHeight * dpr;
            ctx.scale(dpr, dpr);
            
            // Initialize tags on first resize
            if (tagsRef.current.length === 0) {
                 for (let i = 0; i < tagCount; i++) {
                    const newTag: Partial<Tag> = {};
                    resetTag(newTag as Tag, window.innerWidth, window.innerHeight);
                    tagsRef.current.push(newTag as Tag);
                }
            }
        };

        const animate = (timestamp: number) => {
            if (lastTime === 0) lastTime = timestamp;
            const deltaTime = timestamp - lastTime;
            lastTime = timestamp;

            ctx.clearRect(0, 0, canvas.width, canvas.height);

            tagsRef.current.forEach(tag => {
                // Update animation progress
                tag.animationProgress += deltaTime;
                if (tag.animationProgress >= tag.animationDuration) {
                    resetTag(tag, window.innerWidth, window.innerHeight);
                }

                // Calculate current opacity based on the CSS keyframe logic
                const progressRatio = tag.animationProgress / tag.animationDuration;
                let currentOpacity = 0;
                if (progressRatio < 0.15) { // Fade in
                    currentOpacity = (progressRatio / 0.15) * tag.targetOpacity;
                } else if (progressRatio >= 0.15 && progressRatio <= 0.8) { // Hold
                    currentOpacity = tag.targetOpacity;
                } else { // Fade out
                    currentOpacity = (1 - (progressRatio - 0.8) / 0.2) * tag.targetOpacity;
                }

                // Draw the tag
                ctx.save();
                ctx.globalAlpha = Math.max(0, currentOpacity);
                ctx.font = `${tag.fontSize}px 'Courier New', Courier, monospace`;
                
                // Position and rotate
                ctx.translate(tag.x, tag.y);
                ctx.rotate(tag.rotation);
                
                // Apply skew transform for the "italic" background effect
                ctx.transform(1, 0, skewAngle, 1, 0, 0);

                // Draw background        
                const rectWidth = tag.textWidth + tag.paddingX * 2;
                const rectHeight = tag.textHeight;
                ctx.fillStyle = 'rgba(211,217,219,0.5)';
                ctx.beginPath();
                // Use roundRect for rounded corners, a modern canvas feature
                ctx.roundRect(-rectWidth / 2, -rectHeight / 2, rectWidth, rectHeight, 4);
                ctx.fill();
                
                // Draw text on top
                ctx.fillStyle = '#95a2ab';
                ctx.textAlign = 'center';
                ctx.textBaseline = 'middle';
                ctx.fillText(tag.text, 0, 0);

                ctx.restore();
            });

            animationFrameId.current = requestAnimationFrame(animate);
        };
        
        window.addEventListener('resize', resizeCanvas);
        resizeCanvas(); // Initial call
        animate(0);

        return () => {
            // Cleanup on component unmount
            window.removeEventListener('resize', resizeCanvas);
            if(animationFrameId.current) {
                cancelAnimationFrame(animationFrameId.current);
            }
        };
    }, []); // Empty dependency array ensures this runs only once on mount

    return <canvas id="text-stream-canvas" ref={canvasRef} />;
};

export default TextStreamCanvas;
