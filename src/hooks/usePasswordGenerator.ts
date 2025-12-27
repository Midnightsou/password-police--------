import { useCallback } from 'react';

interface GeneratorOptions {
  length: number;
  includeUppercase: boolean;
  includeLowercase: boolean;
  includeNumbers: boolean;
  includeSymbols: boolean;
}

const CHARS = {
  uppercase: 'ABCDEFGHIJKLMNOPQRSTUVWXYZ',
  lowercase: 'abcdefghijklmnopqrstuvwxyz',
  numbers: '0123456789',
  symbols: '!@#$%^&*()_+-=[]{}|;:,.<>?',
};

export function usePasswordGenerator() {
  const generate = useCallback((options: GeneratorOptions): string => {
    const { length, includeUppercase, includeLowercase, includeNumbers, includeSymbols } = options;
    
    let chars = '';
    const required: string[] = [];

    if (includeUppercase) {
      chars += CHARS.uppercase;
      required.push(CHARS.uppercase[Math.floor(Math.random() * CHARS.uppercase.length)]);
    }
    if (includeLowercase) {
      chars += CHARS.lowercase;
      required.push(CHARS.lowercase[Math.floor(Math.random() * CHARS.lowercase.length)]);
    }
    if (includeNumbers) {
      chars += CHARS.numbers;
      required.push(CHARS.numbers[Math.floor(Math.random() * CHARS.numbers.length)]);
    }
    if (includeSymbols) {
      chars += CHARS.symbols;
      required.push(CHARS.symbols[Math.floor(Math.random() * CHARS.symbols.length)]);
    }

    if (!chars) {
      chars = CHARS.lowercase;
    }

    // Generate remaining characters
    const remaining = length - required.length;
    const randomChars: string[] = [];
    for (let i = 0; i < Math.max(0, remaining); i++) {
      randomChars.push(chars[Math.floor(Math.random() * chars.length)]);
    }

    // Combine and shuffle
    const allChars = [...required, ...randomChars];
    for (let i = allChars.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [allChars[i], allChars[j]] = [allChars[j], allChars[i]];
    }

    return allChars.slice(0, length).join('');
  }, []);

  const generateMultiple = useCallback((options: GeneratorOptions, count: number): string[] => {
    return Array.from({ length: count }, () => generate(options));
  }, [generate]);

  return { generate, generateMultiple };
}
