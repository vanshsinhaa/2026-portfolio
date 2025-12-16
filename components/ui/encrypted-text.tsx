"use client";

import React, { useEffect, useState } from "react";
import { cn } from "@/lib/utils";

interface EncryptedTextProps {
  text: string;
  className?: string;
  revealDelayMs?: number;
  charset?: string;
  flipDelayMs?: number;
  encryptedClassName?: string;
  revealedClassName?: string;
}

export function EncryptedText({
  text,
  className,
  revealDelayMs = 50,
  charset = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*()_+-={}[];:,.<>/?",
  flipDelayMs = 50,
  encryptedClassName = "text-neutral-500",
  revealedClassName = "text-foreground",
}: EncryptedTextProps) {
  const [isMounted, setIsMounted] = useState(false);
  const [displayText, setDisplayText] = useState(text); // Start with actual text for SSR
  const [revealedIndices, setRevealedIndices] = useState<Set<number>>(new Set());

  // Only run animation on client
  useEffect(() => {
    setIsMounted(true);
    // Initialize with random characters after mount
    setDisplayText(
      text.split("").map(() => charset[Math.floor(Math.random() * charset.length)]).join("")
    );
    // Clear revealed indices to ensure all start scrambled
    setRevealedIndices(new Set());
  }, [text, charset]);

  useEffect(() => {
    if (!isMounted) return;

    let currentIndex = 0;
    let revealInterval: NodeJS.Timeout;
    let flipInterval: NodeJS.Timeout;
    let currentRevealed = new Set<number>();

    // Flip unrevealed characters
    flipInterval = setInterval(() => {
      setDisplayText((prev) =>
        prev
          .split("")
          .map((char, index) =>
            currentRevealed.has(index)
              ? text[index]
              : charset[Math.floor(Math.random() * charset.length)]
          )
          .join("")
      );
    }, flipDelayMs);

    // Wait 3.5 seconds before starting to reveal
    const startTimeout = setTimeout(() => {
      // Reveal characters one by one
      revealInterval = setInterval(() => {
        if (currentIndex < text.length) {
          currentRevealed.add(currentIndex);
          setRevealedIndices(new Set(currentRevealed));
          currentIndex++;
        } else {
          clearInterval(revealInterval);
          clearInterval(flipInterval); // Stop flipping when all revealed
        }
      }, revealDelayMs);
    }, 3500); // 3.5 second delay before revealing starts

    return () => {
      clearTimeout(startTimeout);
      if (revealInterval) clearInterval(revealInterval);
      if (flipInterval) clearInterval(flipInterval);
    };
  }, [isMounted, text, charset, revealDelayMs, flipDelayMs]);

  // Show plain text during SSR, animated text on client
  if (!isMounted) {
    return (
      <span className={cn("font-geist", className, revealedClassName)}>
        {text}
      </span>
    );
  }

  return (
    <span className={cn("font-geist", className)}>
      {displayText.split("").map((char, index) => (
        <span
          key={index}
          className={cn(
            "transition-colors duration-200",
            revealedIndices.has(index) ? revealedClassName : encryptedClassName
          )}
        >
          {revealedIndices.has(index) ? text[index] : char}
        </span>
      ))}
    </span>
  );
}

