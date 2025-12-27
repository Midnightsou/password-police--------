import { useMemo } from 'react';
import zxcvbn from 'zxcvbn';

export interface PasswordAnalysis {
  score: number;
  label: string;
  color: string;
  bgColor: string;
  emoji: string;
  feedback: string[];
  crackTime: string;
  checks: {
    length: boolean;
    uppercase: boolean;
    lowercase: boolean;
    number: boolean;
    special: boolean;
  };
}

const BLACKLIST = [
  'password', '123456', '12345678', 'qwerty', 'abc123', 'monkey', 'master',
  'dragon', 'letmein', 'login', 'admin', 'welcome', 'shadow', 'sunshine',
  'princess', 'football', 'baseball', 'iloveyou', 'trustno1', 'superman'
];

export function usePasswordStrength(password: string): PasswordAnalysis {
  return useMemo(() => {
    if (!password) {
      return {
        score: -1,
        label: 'Enter a password',
        color: 'text-muted-foreground',
        bgColor: 'bg-muted',
        emoji: '🔒',
        feedback: [],
        crackTime: '',
        checks: {
          length: false,
          uppercase: false,
          lowercase: false,
          number: false,
          special: false,
        },
      };
    }

    const isBlacklisted = BLACKLIST.includes(password.toLowerCase());
    const result = zxcvbn(password);
    
    const checks = {
      length: password.length >= 8,
      uppercase: /[A-Z]/.test(password),
      lowercase: /[a-z]/.test(password),
      number: /[0-9]/.test(password),
      special: /[!@#$%^&*(),.?":{}|<>]/.test(password),
    };

    const effectiveScore = isBlacklisted ? 0 : result.score;

    const scoreMap = [
      { label: 'Very Weak', color: 'text-strength-weak', bgColor: 'bg-strength-weak', emoji: '😰' },
      { label: 'Weak', color: 'text-strength-fair', bgColor: 'bg-strength-fair', emoji: '😟' },
      { label: 'Fair', color: 'text-strength-good', bgColor: 'bg-strength-good', emoji: '😐' },
      { label: 'Strong', color: 'text-strength-strong', bgColor: 'bg-strength-strong', emoji: '😊' },
      { label: 'Very Strong', color: 'text-strength-very-strong', bgColor: 'bg-strength-very-strong', emoji: '🎉' },
    ];

    const { label, color, bgColor, emoji } = scoreMap[effectiveScore];

    const feedback: string[] = [];
    if (isBlacklisted) {
      feedback.push('This is a commonly used password. Please choose something unique!');
    }
    if (result.feedback.warning) {
      feedback.push(result.feedback.warning);
    }
    feedback.push(...result.feedback.suggestions);

    return {
      score: effectiveScore,
      label,
      color,
      bgColor,
      emoji,
      feedback,
      crackTime: result.crack_times_display.offline_slow_hashing_1e4_per_second as string,
      checks,
    };
  }, [password]);
}
