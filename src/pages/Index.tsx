import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Sparkles, Download, Shield } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { AnimatedBackground } from '@/components/AnimatedBackground';
import { ThemeToggle } from '@/components/ThemeToggle';
import { PasswordInput } from '@/components/PasswordInput';
import { StrengthMeter } from '@/components/StrengthMeter';
import { PasswordChecklist } from '@/components/PasswordChecklist';
import { GeneratorOptions } from '@/components/GeneratorOptions';
import { PasswordCard } from '@/components/PasswordCard';
import { usePasswordStrength } from '@/hooks/usePasswordStrength';
import { usePasswordGenerator } from '@/hooks/usePasswordGenerator';
import { toast } from 'sonner';
import confetti from 'canvas-confetti';

interface PasswordEntry {
  id: string;
  password: string;
}

export default function Index() {
  const [password, setPassword] = useState('');
  const [length, setLength] = useState(16);
  const [options, setOptions] = useState({
    uppercase: true,
    lowercase: true,
    numbers: true,
    symbols: true,
  });
  const [passwords, setPasswords] = useState<PasswordEntry[]>([]);

  const analysis = usePasswordStrength(password);
  const { generate, generateMultiple } = usePasswordGenerator();

  const generatorOptions = {
    length,
    includeUppercase: options.uppercase,
    includeLowercase: options.lowercase,
    includeNumbers: options.numbers,
    includeSymbols: options.symbols,
  };

  const handleGenerate = useCallback(() => {
    const newPassword = generate(generatorOptions);
    setPassword(newPassword);
  }, [generate, generatorOptions]);

  const handleAddPassword = () => {
    const newPassword = generate(generatorOptions);
    setPasswords((prev) => [...prev, { id: crypto.randomUUID(), password: newPassword }]);
  };

  const handleBatchGenerate = (count: number) => {
    const newPasswords = generateMultiple(generatorOptions, count);
    const entries = newPasswords.map((p) => ({ id: crypto.randomUUID(), password: p }));
    setPasswords((prev) => [...prev, ...entries]);
    toast.success(`Generated ${count} passwords! 🎉`);
  };

  const handlePasswordChange = (id: string, newPassword: string) => {
    setPasswords((prev) => prev.map((p) => (p.id === id ? { ...p, password: newPassword } : p)));
  };

  const handleDeletePassword = (id: string) => {
    setPasswords((prev) => prev.filter((p) => p.id !== id));
  };

  const handleExportAll = () => {
    const text = passwords.map((p) => p.password).join('\n');
    navigator.clipboard.writeText(text);
    toast.success('All passwords copied! 📋');
  };

  useEffect(() => {
    if (analysis.score === 4 && password) {
      confetti({ particleCount: 100, spread: 70, origin: { y: 0.6 }, colors: ['#a855f7', '#ec4899', '#f97316'] });
    }
  }, [analysis.score, password]);

  return (
    <>
      <AnimatedBackground />
      <div className="min-h-screen p-4 md:p-8">
        <div className="max-w-4xl mx-auto space-y-8">
          {/* Header */}
          <motion.header initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <motion.div animate={{ rotate: [0, 10, -10, 0] }} transition={{ duration: 2, repeat: Infinity }} className="text-4xl">
                🛡️
              </motion.div>
              <div>
                <h1 className="font-display text-3xl md:text-4xl font-bold gradient-text">Password Police</h1>
                <p className="text-muted-foreground">Create & check secure passwords</p>
              </div>
            </div>
            <ThemeToggle />
          </motion.header>

          {/* Main Content */}
          <Tabs defaultValue="single" className="space-y-6">
            <TabsList className="glass p-1">
              <TabsTrigger value="single" className="font-display data-[state=active]:gradient-primary data-[state=active]:text-white">
                <Shield className="w-4 h-4 mr-2" /> Single Mode
              </TabsTrigger>
              <TabsTrigger value="multi" className="font-display data-[state=active]:gradient-primary data-[state=active]:text-white">
                <Sparkles className="w-4 h-4 mr-2" /> Multi Mode
              </TabsTrigger>
            </TabsList>

            {/* Single Password Mode */}
            <TabsContent value="single" className="space-y-6">
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="glass-strong rounded-3xl p-6 md:p-8 space-y-6">
                <PasswordInput value={password} onChange={setPassword} onGenerate={handleGenerate} />
                <StrengthMeter analysis={analysis} />
                <PasswordChecklist checks={analysis.checks} />
                {analysis.feedback.length > 0 && (
                  <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="p-4 rounded-xl bg-accent/10 border border-accent/30">
                    <h4 className="font-display font-semibold mb-2 flex items-center gap-2">💡 Tips</h4>
                    <ul className="space-y-1 text-sm text-muted-foreground">
                      {analysis.feedback.map((tip, i) => <li key={i}>• {tip}</li>)}
                    </ul>
                  </motion.div>
                )}
              </motion.div>

              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="glass-strong rounded-3xl p-6 md:p-8">
                <h2 className="font-display text-2xl font-bold mb-6 flex items-center gap-2">⚡ Generator</h2>
                <GeneratorOptions length={length} onLengthChange={setLength} options={options} onOptionsChange={setOptions} />
                <Button onClick={handleGenerate} className="w-full mt-6 h-14 text-lg font-display gradient-primary hover:opacity-90 transition-opacity">
                  <Sparkles className="w-5 h-5 mr-2" /> Generate Password
                </Button>
              </motion.div>
            </TabsContent>

            {/* Multi Password Mode */}
            <TabsContent value="multi" className="space-y-6">
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="glass-strong rounded-3xl p-6 md:p-8">
                <h2 className="font-display text-2xl font-bold mb-6 flex items-center gap-2">⚡ Generator Settings</h2>
                <GeneratorOptions length={length} onLengthChange={setLength} options={options} onOptionsChange={setOptions} />
                <div className="flex flex-wrap gap-3 mt-6">
                  <Button onClick={handleAddPassword} className="gradient-primary hover:opacity-90"><Plus className="w-4 h-4 mr-2" /> Add One</Button>
                  <Button onClick={() => handleBatchGenerate(3)} variant="outline" className="glass">Generate 3</Button>
                  <Button onClick={() => handleBatchGenerate(5)} variant="outline" className="glass">Generate 5</Button>
                  <Button onClick={() => handleBatchGenerate(10)} variant="outline" className="glass">Generate 10</Button>
                  {passwords.length > 0 && (
                    <Button onClick={handleExportAll} variant="secondary"><Download className="w-4 h-4 mr-2" /> Copy All</Button>
                  )}
                </div>
              </motion.div>

              <AnimatePresence mode="popLayout">
                {passwords.length === 0 ? (
                  <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="text-center py-12 text-muted-foreground">
                    <p className="text-5xl mb-4">🔐</p>
                    <p className="font-display text-xl">No passwords yet</p>
                    <p>Click "Add One" or batch generate to get started!</p>
                  </motion.div>
                ) : (
                  <div className="grid gap-4 md:grid-cols-2">
                    {passwords.map((entry) => (
                      <PasswordCard key={entry.id} id={entry.id} password={entry.password} onPasswordChange={handlePasswordChange} onDelete={handleDeletePassword} generatorOptions={generatorOptions} />
                    ))}
                  </div>
                )}
              </AnimatePresence>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </>
  );
}
