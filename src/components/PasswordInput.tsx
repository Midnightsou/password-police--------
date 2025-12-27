import { useState, forwardRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Eye, EyeOff, Copy, Check, RefreshCw } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';

interface PasswordInputProps {
  value: string;
  onChange: (value: string) => void;
  onGenerate?: () => void;
  placeholder?: string;
  showGenerateButton?: boolean;
}

export const PasswordInput = forwardRef<HTMLInputElement, PasswordInputProps>(
  ({ value, onChange, onGenerate, placeholder = 'Enter your password...', showGenerateButton = true }, ref) => {
    const [showPassword, setShowPassword] = useState(false);
    const [copied, setCopied] = useState(false);

    const handleCopy = async () => {
      if (!value) return;
      await navigator.clipboard.writeText(value);
      setCopied(true);
      toast.success('Password copied to clipboard! 📋');
      setTimeout(() => setCopied(false), 2000);
    };

    return (
      <div className="relative">
        <div className="relative">
          <Input
            ref={ref}
            type={showPassword ? 'text' : 'password'}
            value={value}
            onChange={(e) => onChange(e.target.value)}
            placeholder={placeholder}
            className="pr-32 h-14 text-lg font-mono glass border-2 focus:border-primary/50 transition-all"
          />
          <div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center gap-1">
            <Button
              type="button"
              variant="ghost"
              size="icon"
              onClick={() => setShowPassword(!showPassword)}
              className="h-9 w-9 hover:bg-primary/10"
            >
              <AnimatePresence mode="wait">
                <motion.div
                  key={showPassword ? 'hide' : 'show'}
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  exit={{ scale: 0 }}
                >
                  {showPassword ? (
                    <EyeOff className="w-5 h-5" />
                  ) : (
                    <Eye className="w-5 h-5" />
                  )}
                </motion.div>
              </AnimatePresence>
            </Button>
            <Button
              type="button"
              variant="ghost"
              size="icon"
              onClick={handleCopy}
              disabled={!value}
              className="h-9 w-9 hover:bg-primary/10"
            >
              <AnimatePresence mode="wait">
                <motion.div
                  key={copied ? 'check' : 'copy'}
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  exit={{ scale: 0 }}
                >
                  {copied ? (
                    <Check className="w-5 h-5 text-strength-strong" />
                  ) : (
                    <Copy className="w-5 h-5" />
                  )}
                </motion.div>
              </AnimatePresence>
            </Button>
            {showGenerateButton && onGenerate && (
              <Button
                type="button"
                variant="ghost"
                size="icon"
                onClick={onGenerate}
                className="h-9 w-9 hover:bg-primary/10"
              >
                <RefreshCw className="w-5 h-5" />
              </Button>
            )}
          </div>
        </div>
      </div>
    );
  }
);

PasswordInput.displayName = 'PasswordInput';
