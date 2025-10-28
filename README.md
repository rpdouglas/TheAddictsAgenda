<p align="center">
  <img src="docs/banner.png" alt="My Recovery Toolkit Banner" width="100%" />
</p>

<h1 align="center">🧘‍♂️ My Recovery Toolkit</h1>

<p align="center">
  <em>A mindful recovery companion for self-discovery, structure, and sobriety.</em><br>
  Combining principles from <strong>Recovery Dharma</strong> and the <strong>12 Steps</strong> with digital journaling and mindfulness tools.
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
- Optional encryption for privacy.
- Export journals to PDF or Word for secure backup or sponsor sharing.

### 🧘 Coping Cards
- Personalized affirmations and mindfulness practices.
- Quick access grounding tools for anxiety or craving moments.
- Organized by mood or emotion.

### 🗓️ Agenda & To-Do List
- Daily planner for meetings, meditation, and recovery tasks.
- Works offline — 100% stored on your device.

### 📚 Recovery Literature
- Built-in **Recovery Dharma** readings and reflections.
- Integrated **12-Step documentation** for reference and study.
- Searchable library with space for personal notes.

### 🧩 Interactive Workbooks
- Step-by-step **12 Steps ** exercises and reflections.
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