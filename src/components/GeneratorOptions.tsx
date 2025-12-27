import { motion } from 'framer-motion';
import { Slider } from '@/components/ui/slider';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';

interface GeneratorOptionsProps {
  length: number;
  onLengthChange: (length: number) => void;
  options: {
    uppercase: boolean;
    lowercase: boolean;
    numbers: boolean;
    symbols: boolean;
  };
  onOptionsChange: (options: GeneratorOptionsProps['options']) => void;
}

const optionItems = [
  { key: 'uppercase', label: 'Uppercase (A-Z)', emoji: '🔠' },
  { key: 'lowercase', label: 'Lowercase (a-z)', emoji: '🔡' },
  { key: 'numbers', label: 'Numbers (0-9)', emoji: '🔢' },
  { key: 'symbols', label: 'Symbols (!@#$)', emoji: '✨' },
] as const;

export function GeneratorOptions({
  length,
  onLengthChange,
  options,
  onOptionsChange,
}: GeneratorOptionsProps) {
  return (
    <div className="space-y-6">
      {/* Length Slider */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <Label className="font-display font-semibold text-lg flex items-center gap-2">
            <span>📏</span> Length
          </Label>
          <motion.span
            key={length}
            initial={{ scale: 1.2 }}
            animate={{ scale: 1 }}
            className="text-2xl font-bold gradient-text"
          >
            {length}
          </motion.span>
        </div>
        <Slider
          value={[length]}
          onValueChange={([val]) => onLengthChange(val)}
          min={4}
          max={64}
          step={1}
          className="cursor-pointer"
        />
        <div className="flex justify-between text-xs text-muted-foreground">
          <span>4</span>
          <span>16</span>
          <span>32</span>
          <span>48</span>
          <span>64</span>
        </div>
      </div>

      {/* Character Options */}
      <div className="space-y-3">
        <Label className="font-display font-semibold text-lg flex items-center gap-2">
          <span>⚙️</span> Include
        </Label>
        <div className="grid grid-cols-2 gap-3">
          {optionItems.map(({ key, label, emoji }) => (
            <motion.div
              key={key}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className={`flex items-center justify-between p-3 rounded-lg border-2 transition-all cursor-pointer ${
                options[key]
                  ? 'border-primary/50 bg-primary/5'
                  : 'border-border bg-card'
              }`}
              onClick={() =>
                onOptionsChange({ ...options, [key]: !options[key] })
              }
            >
              <div className="flex items-center gap-2">
                <span className="text-lg">{emoji}</span>
                <span className="text-sm font-medium">{label}</span>
              </div>
              <Switch
                checked={options[key]}
                onCheckedChange={(checked) =>
                  onOptionsChange({ ...options, [key]: checked })
                }
              />
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
