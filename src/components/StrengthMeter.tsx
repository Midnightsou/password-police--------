import { motion } from 'framer-motion';
import { PasswordAnalysis } from '@/hooks/usePasswordStrength';

interface StrengthMeterProps {
  analysis: PasswordAnalysis;
}

export function StrengthMeter({ analysis }: StrengthMeterProps) {
  const { score, label, bgColor, emoji } = analysis;
  const percentage = score === -1 ? 0 : ((score + 1) / 5) * 100;

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <motion.span
            key={emoji}
            initial={{ scale: 0, rotate: -180 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ type: 'spring', stiffness: 500, damping: 15 }}
            className="text-2xl"
          >
            {emoji}
          </motion.span>
          <motion.span
            key={label}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            className="font-display font-semibold text-lg"
          >
            {label}
          </motion.span>
        </div>
        {analysis.crackTime && (
          <motion.span
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-sm text-muted-foreground"
          >
            Crack time: <span className="font-medium">{analysis.crackTime}</span>
          </motion.span>
        )}
      </div>

      <div className="h-3 bg-muted rounded-full overflow-hidden">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${percentage}%` }}
          transition={{ type: 'spring', stiffness: 100, damping: 15 }}
          className={`h-full ${bgColor} rounded-full relative overflow-hidden`}
        >
          {/* Animated shine effect */}
          <motion.div
            className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent"
            animate={{ x: ['-100%', '100%'] }}
            transition={{ duration: 1.5, repeat: Infinity, repeatDelay: 1 }}
          />
        </motion.div>
      </div>

      {/* Segment indicators */}
      <div className="flex gap-1">
        {[0, 1, 2, 3, 4].map((i) => (
          <motion.div
            key={i}
            initial={{ scaleY: 0 }}
            animate={{ scaleY: 1 }}
            transition={{ delay: i * 0.05 }}
            className={`flex-1 h-1 rounded-full ${
              i <= score ? bgColor : 'bg-muted'
            }`}
          />
        ))}
      </div>
    </div>
  );
}
