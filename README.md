# 🧘‍♂️ The Addict’s Agenda

**A mindful recovery companion for self-discovery, structure, and sobriety.**  
_Combining principles from Recovery Dharma and the 12 Steps with modern digital journaling tools._

---

## 🌿 Overview

**The Addict’s Agenda** is an open-source recovery and mindfulness app designed to support individuals on their path to healing from addiction.  
It integrates **12-Step practices**, **Recovery Dharma teachings**, and **daily mindfulness tools** into a single, private, easy-to-use application.

Built with **React** and **Vite**, the app runs fully client-side for privacy — your data stays on your device, encrypted and offline-ready.  
Whether you follow a Buddhist-inspired path, a traditional 12-Step program, or your own recovery journey, this app provides digital structure, reflection, and inspiration.

---

## ✨ Core Features

### 🪞 Journaling & Reflection
- Daily gratitude and intention journals.  
- Guided prompts drawn from **Recovery Dharma** and **12-Step principles**.  
- Editable entries with optional **encryption** for personal privacy.  
- Export journals to PDF or Word documents for safe backup or sharing with sponsors/mentors.

### 🧘 Coping Cards
- Personalized affirmations, grounding techniques, and mindfulness phrases.  
- Quick access to your most supportive reminders in moments of craving or anxiety.  
- Organized by emotional states or custom categories.

### 🗓️ Agenda & To-Do List
- Daily planner for tasks, goals, and recovery routines.  
- Add meetings, meditations, self-care reminders, or chores.  
- Works offline — everything is stored locally.

### 📚 Recovery Literature & Teachings
- Built-in **Recovery Dharma** readings and reflections.  
- **12-Step literature** summaries and workbook prompts.  
- Optional links to Recovery Dharma online sangha and mindfulness resources.  
- Integrated library viewer for easy navigation through teachings and exercises.

### 🧩 Interactive Workbooks
- Digital versions of the **12 Steps**, each with reflective questions.  
- **Recovery Dharma inquiry workbooks** focused on craving, mindfulness, compassion, and renunciation.  
- Writable, savable, and exportable for offline reflection.  
- Can be completed privately or shared securely with sponsors or mentors.

### 🔒 Privacy-First Design
- Fully client-side app — no login required.  
- Optional AES-based encryption for journals and workbook answers.  
- Works offline as a **Progressive Web App (PWA)**.  
- User data never leaves the device unless you choose to back it up.

---

## 💎 Technologies

| Area | Tech Stack |
|------|-------------|
| Frontend | React + Vite |
| Styling | Tailwind CSS |
| State & Storage | Local Storage / IndexedDB (via `localforage`) |
| PWA | Vite Plugin PWA |
| File Exports | jsPDF / docx |
| Deployment | Vercel / Netlify / GitHub Pages |

---

## 🔧 Local Development

Clone and run locally:

```bash
git clone https://github.com/rpdouglas/TheAddictsAgenda.git
cd TheAddictsAgenda
npm install
npm run dev
