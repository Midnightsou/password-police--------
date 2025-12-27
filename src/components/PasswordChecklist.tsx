import { motion, AnimatePresence } from 'framer-motion';
import { Check, X } from 'lucide-react';

interface PasswordChecklistProps {
  checks: {
    length: boolean;
    uppercase: boolean;
    lowercase: boolean;
    number: boolean;
    special: boolean;
  };
}

const checkItems = [
  { key: 'length', label: 'At least 8 characters', emoji: '📏' },
  { key: 'uppercase', label: 'Uppercase letter (A-Z)', emoji: '🔠' },
  { key: 'lowercase', label: 'Lowercase letter (a-z)', emoji: '🔡' },
  { key: 'number', label: 'Number (0-9)', emoji: '🔢' },
  { key: 'special', label: 'Special character (!@#$)', emoji: '✨' },
] as const;

export function PasswordChecklist({ checks }: PasswordChecklistProps) {
  return (
    <div className="space-y-2">
      <h3 className="font-display font-semibold text-lg flex items-center gap-2">
        <span>📋</span> Requirements
      </h3>
      <ul className="space-y-2">
        {checkItems.map(({ key, label, emoji }) => {
          const passed = checks[key];
          return (
            <motion.li
              key={key}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="flex items-center gap-3"
            >
              <AnimatePresence mode="wait">
                <motion.div
                  key={passed ? 'check' : 'x'}
                  initial={{ scale: 0, rotate: -180 }}
                  animate={{ scale: 1, rotate: 0 }}
                  exit={{ scale: 0, rotate: 180 }}
                  transition={{ type: 'spring', stiffness: 500, damping: 20 }}
                  className={`w-6 h-6 rounded-full flex items-center justify-center ${
                    passed
                      ? 'bg-strength-strong text-white'
                      : 'bg-muted text-muted-foreground'
                  }`}
                >
                  {passed ? (
                    <Check className="w-4 h-4" />
                  ) : (
                    <X className="w-4 h-4" />
                  )}
                </motion.div>
              </AnimatePresence>
              <span className="text-lg">{emoji}</span>
              <span
                className={`text-sm transition-colors ${
                  passed ? 'text-foreground' : 'text-muted-foreground'
                }`}
              >
                {label}
              </span>
            </motion.li>
          );
        })}
      </ul>
    </div>
  );
}
