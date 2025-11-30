
<p align="center">
  <img src="docs/banner.png" alt="My Recovery Toolkit Banner" width="100%" />
</p>

<h1 align="center">🧘‍♂️ My Recovery Toolkit</h1>

<p align="center">
  <em>A mindful recovery companion for self-discovery, structure, and sobriety.</em><br>
  Combining principles from <strong>Recovery Dharma</strong> and the <strong>12 Steps</strong> with digital journaling, gamification, and mindfulness tools.
</p>

<p align="center">
  <a href="https://github.com/rpdouglas/TheAddictsAgenda/actions"><img src="https://img.shields.io/github/actions/workflow/status/rpdouglas/TheAddictsAgenda/pr-check.yml?label=build&logo=github" alt="Build Status"></a>
  <a href="https://github.com/rpdouglas/TheAddictsAgenda/blob/main/LICENSE"><img src="https://img.shields.io/github/license/rpdouglas/TheAddictsAgenda?color=blue" alt="License"></a>
  <img src="https://img.shields.io/badge/PWA-ready-brightgreen?logo=pwa" alt="PWA Ready">
  <img src="https://img.shields.io/badge/version-1.0.0-lightgrey" alt="Version 1.0.0">
</p>

---

## 📖 Table of Contents
- [🌿 Overview](#-overview)
- [✨ Core Features](#-core-features)
- [💎 Technologies](#-technologies)
- [🔧 Local Development](#-local-development)
- [📘 Project Structure](#-project-structure)
- [🛠️ Scripts](#️-scripts)
- [🔐 Security & Privacy](#-security--privacy)
- [🧠 Planned Enhancements](#-planned-enhancements)
- [💬 Contributing](#-contributing)
- [❤️ Acknowledgments](#️-acknowledgments)
- [📜 License](#-license)
- [🌈 Our Mission](#-our-mission)

---

## 🌿 Overview

**My Recovery Toolkit** is an open-source recovery and mindfulness app designed to support individuals healing from addiction.
It integrates **12-Step practices**, **Recovery Dharma teachings**, and **daily mindfulness tools** into one private, easy-to-use digital experience.

Built with **React** and **Vite**, the app runs entirely client-side — your data stays encrypted on your device and can be used fully offline as a **Progressive Web App (PWA)**.

---

## ✨ Core Features

### 🪞 Journaling & Reflection
- Daily gratitude, mindfulness, and intention journals.
- Guided prompts based on **Recovery Dharma** and **12-Step** themes.
- **Smart Tags** & Templates: Auto-generate entries from reflections or coping cards.
- Optional encryption for privacy.
- Export journals to PDF or Word for secure backup or sponsor sharing.

### 🧘 Coping & Somatic Tools
- **Coping Cards**: Personalized affirmations and grounding strategies.
- **Breathing Exercises**: Guided visual breathing aids for anxiety reduction.
- **Yoga Walkthroughs**: Illustrated guides for mindful movement and grounding poses.
- Quick access **Emergency Resources** (LifeBuoy) for immediate support.

### 🎮 Gamified Recovery
- **Recovery Jeopardy**: Test your knowledge of recovery literature and concepts.
- **Fast Lane Simulator**: An interactive "Recovery Simulator" game to practice decision-making in high-risk scenarios.

### 🗓️ Agenda & Meeting Management
- **Meeting Tracker**: Log attendance and keep a history of meetings attended.
- **Homegroup Management**: Store service positions, business meeting notes, and group details.
- Daily planner for meditation and recovery tasks.

### 📚 Recovery Literature & Daily Inspiration
- Built-in **Recovery Dharma** readings and reflections.
- **Daily Reflections** & **Just For Today** meditations.
- Integrated **12-Step documentation** (Big Book, Basic Text) for reference and study.
- Searchable library with space for personal notes.

### 🧩 Interactive Workbooks
- Step-by-step **12 Steps** exercises and reflections.
- **Recovery Dharma inquiry workbooks** on craving, mindfulness, and compassion.
- Save progress locally or export to PDF/DOCX.

### 🔒 Privacy-First Design
- Fully client-side, no login required.
- Optional AES-based encryption for sensitive data.
- Offline-ready PWA.
- No analytics or trackers.

---

## 💎 Technologies

| Area | Tech Stack |
|------|-------------|
| Frontend | React + Vite |
| Styling | Tailwind CSS |
| State/Auth | Firebase Auth / Context API |
| Testing | Vitest + React Testing Library |
| AI Integration | Google Generative AI |
| Storage | Local Storage / IndexedDB (`localforage`) |
| File Exports | jsPDF / docx |
| PWA Support | Vite Plugin PWA |
| Deployment | Vercel / Netlify / GitHub Pages |

---

## 🔧 Local Development

```bash
git clone [https://github.com/rpdouglas/TheAddictsAgenda.git](https://github.com/rpdouglas/TheAddictsAgenda.git)
cd TheAddictsAgenda
npm install
npm run dev
````

-----

## 🛠️ Scripts

  - `npm run dev`: Start the development server.
  - `npm run build`: Build the app for production.
  - `npm run preview`: Preview the production build locally.
  - `npm run lint`: Run ESLint to check code quality.
  - `npm run test`: Run the test suite using Vitest.

-----

## 🔐 Security & Privacy

We take privacy seriously.

  - **Local-First**: All personal data (journals, inventory, meeting logs) is stored in your browser's `localStorage` or `IndexedDB`.
  - **Encryption**: Users can enable AES encryption, requiring a password to decrypt data upon app load.
  - **No Cloud Sync (Default)**: Unless you explicitly export data, nothing leaves your device.

-----

## 🧠 Planned Enhancements

  - [ ] Cloud backup integration (optional)
  - [ ] Enhanced AI-driven journaling prompts
  - [ ] Mood tracking analytics
  - [ ] Community resource locator API

-----

## 💬 Contributing

Contributions are welcome\! Please read our [Contributing Guide](https://www.google.com/search?q=CONTRIBUTING.md) for details on our code of conduct and the process for submitting pull requests.

-----

## ❤️ Acknowledgments

  - **Alcoholics Anonymous** & **Narcotics Anonymous** for their foundational texts.
  - **Recovery Dharma** for Buddhist-inspired recovery wisdom.
  - Open-source icons by [Heroicons](https://heroicons.com/).

-----

## 📜 License

This project is licensed under the MIT License - see the [LICENSE](https://www.google.com/search?q=LICENSE) file for details.

-----

## 🌈 Our Mission

To provide free, accessible, and private tools that empower individuals to take charge of their recovery journey, regardless of the path they choose.

```

### Summary of Changes made to README:
1.  **Added "Gamified Recovery"**: Included specific mentions of *Recovery Jeopardy* and the *Fast Lane Simulator* found in the route list.
2.  **Added "Coping & Somatic Tools"**: Expanded the "Coping Cards" section to include the new *Breathing Exercises* and *Yoga Walkthrough* components found in `App.jsx`.
3.  **Added "Meeting Management"**: Added details about *Meeting Tracker* and *Homegroup* management.
4.  **Updated "Daily Inspiration"**: Explicitly mentioned *Just For Today* and *Daily Reflections*.
5.  **Updated Technologies**:
    * Added **Vitest** and **React Testing Library** (found in `package.json` and `CHANGELOG`).
    * Added **Firebase Auth** (found in `CHANGELOG` and `package.json`).
    * Added **Google Generative AI** (found in `package.json`).
6.  **Updated Scripts**: Added `npm run test`.
```
