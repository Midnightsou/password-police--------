import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Trash2, Copy, RefreshCw, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { StrengthMeter } from './StrengthMeter';
import { usePasswordStrength } from '@/hooks/usePasswordStrength';
import { usePasswordGenerator } from '@/hooks/usePasswordGenerator';
import { toast } from 'sonner';
import confetti from 'canvas-confetti';

interface PasswordCardProps {
  id: string;
  password: string;
  onPasswordChange: (id: string, password: string) => void;
  onDelete: (id: string) => void;
  generatorOptions: {
    length: number;
    includeUppercase: boolean;
    includeLowercase: boolean;
    includeNumbers: boolean;
    includeSymbols: boolean;
  };
}

export function PasswordCard({
  id,
  password,
  onPasswordChange,
  onDelete,
  generatorOptions,
}: PasswordCardProps) {
  const analysis = usePasswordStrength(password);
  const { generate } = usePasswordGenerator();
  const [copied, setCopied] = useState(false);
  const [showPassword, setShowPassword] = useState(true);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(password);
    setCopied(true);
    toast.success('Password copied! 📋');
    setTimeout(() => setCopied(false), 2000);
  };

  const handleRegenerate = () => {
    const newPassword = generate(generatorOptions);
    onPasswordChange(id, newPassword);
  };

  // Confetti on very strong password
  useEffect(() => {
    if (analysis.score === 4) {
      confetti({
        particleCount: 50,
        spread: 60,
        origin: { y: 0.7 },
        colors: ['#a855f7', '#ec4899', '#f97316'],
      });
    }
  }, [analysis.score]);

  return (
    <motion.div
      layout
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9, transition: { duration: 0.2 } }}
      whileHover={{ y: -2 }}
      className="glass rounded-2xl p-4 space-y-3"
    >
      <div className="flex items-center gap-2">
        <div
          className="flex-1 font-mono text-lg bg-muted/50 rounded-lg p-3 cursor-pointer truncate"
          onClick={() => setShowPassword(!showPassword)}
        >
          {showPassword ? password : '•'.repeat(password.length)}
        </div>
        <div className="flex gap-1">
          <Button
            variant="ghost"
            size="icon"
            onClick={handleCopy}
            className="h-10 w-10 hover:bg-primary/10"
          >
            {copied ? (
              <Check className="w-5 h-5 text-strength-strong" />
            ) : (
              <Copy className="w-5 h-5" />
            )}
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={handleRegenerate}
            className="h-10 w-10 hover:bg-primary/10"
          >
            <RefreshCw className="w-5 h-5" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => onDelete(id)}
            className="h-10 w-10 hover:bg-destructive/10 text-destructive"
          >
            <Trash2 className="w-5 h-5" />
          </Button>
        </div>
      </div>

      <StrengthMeter analysis={analysis} />
    </motion.div>
  );
}
