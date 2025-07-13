// === DOM Elements ===
const passwordInput = document.getElementById("password");
const strengthBar = document.getElementById("strengthBar");
const strengthText = document.getElementById("strengthText");
const showPassword = document.getElementById("showPassword");
const form = document.getElementById("passwordpolice");
const message = document.getElementById("message");
const suggestionsBox = document.getElementById("suggestions");

const generateBtn = document.getElementById("generatePassword");
const lengthRange = document.getElementById("lengthRange");
const lengthValue = document.getElementById("lengthValue");
const copyPassword = document.getElementById("copyPassword");

// === Common Password Blacklist ===
const blacklistedPasswords = [
  "password", "123456", "123456789", "qwerty", "abc123",
  "password1", "admin", "letmein", "welcome", "iloveyou",
  "monkey", "dragon", "sunshine", "princess", "football",
  "qwerty123", "baseball", "000000", "trustno1", "111111"
];

// === Toggle password visibility ===
showPassword.addEventListener("change", () => {
  passwordInput.type = showPassword.checked ? "text" : "password";
});

// === Update slider label ===
lengthRange.addEventListener("input", () => {
  lengthValue.textContent = lengthRange.value;
});

// === On input: live strength checking ===
passwordInput.addEventListener("input", () => {
  const password = passwordInput.value;

  if (!password) {
    resetUI();
    return;
  }

  if (isBlacklisted(password)) {
    updateStrengthBar(0);
    strengthText.textContent = "❌ Blacklisted Password";
    showSuggestions(["Choose a unique password not found in common leaks."]);
    updateChecklist(password);
    message.textContent = "⚠️ This password is too common or compromised.";
    message.style.color = "#ff4d4d";
    return;
  }

  const result = zxcvbn(password);
  const score = result.score;

  updateStrengthBar(score);
  strengthText.textContent = ["Very Weak", "Weak", "Fair", "Strong", "Very Strong"][score];
  showSuggestions(result.feedback.suggestions);
  updateChecklist(password);
  message.textContent = "";
});

// === On form submission ===
form.addEventListener("submit", (e) => {
  e.preventDefault();
  const password = passwordInput.value;
  const result = zxcvbn(password);
  const score = result.score;

  if (isBlacklisted(password)) {
    message.textContent = "❌ This password is blacklisted. Choose another.";
    message.style.color = "#ff4d4d";
  } else if (score >= 3) {
    message.textContent = "✅ Good password!";
    message.style.color = "#00e676";
  } else {
    message.textContent = "❌ Password is too weak!";
    message.style.color = "#ff4d4d";
  }
});

// === Generate strong password ===
generateBtn.addEventListener("click", () => {
  let generated;
  let score = 0;

  do {
    generated = generatePassword(parseInt(lengthRange.value));
    score = zxcvbn(generated).score;
  } while (score < 3 || isBlacklisted(generated));

  passwordInput.value = generated;

  const result = zxcvbn(generated);
  updateStrengthBar(score);
  strengthText.textContent = ["Very Weak", "Weak", "Fair", "Strong", "Very Strong"][score];
  showSuggestions(result.feedback.suggestions);
  updateChecklist(generated);

  message.textContent = "✅ Secure password generated!";
  message.style.color = "#00e676";
});

// === Copy to clipboard ===
copyPassword.addEventListener("click", () => {
  const password = passwordInput.value;
  if (password) {
    navigator.clipboard.writeText(password).then(() => {
      message.textContent = "📋 Password copied to clipboard!";
      message.style.color = "#00e676";
    });
  }
});

// === Strength bar UI ===
function updateStrengthBar(score) {
  const colors = ["#ff4d4d", "#ff944d", "#f0e130", "#9acd32", "#00e676"];
  const width = ((score + 1) / 5) * 100;

  strengthBar.style.width = `${width}%`;
  strengthBar.style.backgroundColor = colors[score] || "#ff4d4d";
}

// === Show suggestions ===
function showSuggestions(tips) {
  if (tips.length > 0) {
    suggestionsBox.textContent = `💡 Tips: ${tips.join(", ")}`;
  } else {
    suggestionsBox.textContent = "";
  }
}

// === Checklist validator ===
function updateChecklist(password) {
  const checks = {
    length: password.length >= 8,
    lowercase: /[a-z]/.test(password),
    uppercase: /[A-Z]/.test(password),
    number: /[0-9]/.test(password),
    symbol: /[^A-Za-z0-9]/.test(password),
  };

  for (let key in checks) {
    const item = document.getElementById(key);
    if (item) {
      if (checks[key]) {
        item.classList.add("valid");
        item.classList.remove("invalid");
      } else {
        item.classList.remove("valid");
        item.classList.add("invalid");
      }
    }
  }
}

// === Reset UI ===
function resetUI() {
  strengthBar.style.width = "0%";
  strengthBar.style.backgroundColor = "#ff4d4d";
  strengthText.textContent = "";
  suggestionsBox.textContent = "";
  message.textContent = "";

  const checklistItems = ["length", "lowercase", "uppercase", "number", "symbol"];
  checklistItems.forEach((id) => {
    const item = document.getElementById(id);
    if (item) {
      item.classList.remove("valid");
      item.classList.add("invalid");
    }
  });
}

// === Check if password is blacklisted ===
function isBlacklisted(password) {
  return blacklistedPasswords.includes(password.toLowerCase());
}

// === Password Generator ===
function generatePassword(length = 16) {
  const charset = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*()-_=+";
  let password = "";
  for (let i = 0; i < length; i++) {
    const randomChar = charset.charAt(Math.floor(Math.random() * charset.length));
    password += randomChar;
  }
  return password;
}
