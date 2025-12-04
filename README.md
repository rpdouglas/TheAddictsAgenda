# My Recovery Toolkit - Technical Specifications

## 1. Executive Summary

"My Recovery Toolkit" is a privacy-first, local-first Progressive Web App (PWA) designed to support individuals in recovery from addiction. It integrates 12-Step programs, Recovery Dharma, SMART Recovery tools, and daily mindfulness practices into a cohesive digital companion. The application prioritizes user data privacy by defaulting to local storage and offering optional, encrypted cloud synchronization via Firebase.

## 2. Architecture Overview

The application is built on a modern React stack, leveraging Vite for build optimization and Tailwind CSS for styling. It adopts a modular, component-based architecture with a custom state-based router.

* **Frontend Framework:** React 19
* **Build Tool:** Vite
* **Styling:** Tailwind CSS
* **Backend (Optional):** Firebase (Authentication, Firestore)
* **State Management:** Context API (`AuthContext`) + Local State
* **Routing:** Custom state-based router within `App.jsx`
* **Data Persistence:** Adapter pattern (`DataStore.js`) supporting LocalStorage and Firestore

## 3. Core Modules & Features

### 3.1. Routing & Navigation

* **Mechanism:** The application bypasses `react-router-dom` in favor of a lightweight, state-based router managed in `App.jsx`.
* **State:** `activeView` (string) determines the rendered component.
* **Navigation:** Components receive `onNavigate` props to update the `activeView` state, enabling seamless transitions between views like `'dashboard'`, `'journal'`, and `'workbook'`.
* **Lazy Loading:** Heavy components (Journal, Workbook, Literature) are lazy-loaded using `React.lazy` and `Suspense` to improve initial load performance.

### 3.2. Data Persistence Layer (`src/utils/`)

The data layer employs an **Adapter Pattern** to abstract the underlying storage mechanism, allowing for seamless switching between local and cloud storage.

* **`DataStore.js` (Interface):** The central interface for all data operations. It exposes methods like `save`, `load`, `loadAll`, and `deleteAll`. It dynamically switches between `LocalStorageDataStore` and `FirestoreDataStore` based on the user's session type (Guest vs. Authenticated).
* **`LocalStorageDataStore.js` (Local Adapter):**
    * **Storage:** Stores all application data in a single monolithic JSON object within the browser's `localStorage`.
    * **Key:** `'addictsAgendaLocalData'`
    * **Pros:** Privacy-first, offline-capable, simple implementation.
    * **Cons:** Performance impact with large datasets due to serialization/deserialization.
* **`storage.js` (Cloud Adapter - Firestore):**
    * **Storage:** Stores data in Firestore documents under `users/{userId}`.
    * **Encryption:** Integrates with `encryption.js` to encrypt sensitive data fields (`JOURNAL`, `WORKBOOK`) client-side before transmission to Firebase.
    * **Security:** Ensures that even with cloud sync, user data remains private and accessible only with the user's PIN/key.

### 3.3. Security & Encryption (`src/utils/encryption.js`)

* **Algorithm:** AES (Advanced Encryption Standard) via `crypto-js`.
* **Workflow:**
    * **Encryption:** `encryptData(data, secretKey)` converts objects to JSON strings and encrypts them using the user's secret key.
    * **Decryption:** `decryptData(ciphertext, secretKey)` decrypts the ciphertext and parses it back into JSON objects.
* **Key Management:** The secret key is derived from the user's PIN and stored in `sessionStorage` during the active session. It is never stored persistently in plain text.

### 3.4. Dashboard (`src/components/Dashboard.jsx`)

* **Functionality:** Acts as the central hub.
* **Sobriety Counter:** Calculates and displays real-time sobriety duration (Days, Hours, Minutes, Seconds) using a `setInterval` hook.
* **Navigation Grid:** Provides access to all app features, including the newly updated "To-Do List".
* **Smart Notifications:** Displays a badge on the Journal icon if no entry has been made for the current day.

### 3.5. Daily Journal (`src/components/DailyJournal.jsx`)

* **Architecture:** Controller-View pattern.
    * **Controller:** `DailyJournal.jsx` manages state, data fetching, and logic.
    * **Views:** `JournalList` (Read), `JournalForm` (Write), `MoodGraph` (Visualize).
* **Features:**
    * **Mood Tracking:** 0-10 scale recorded with each entry.
    * **Tagging:** Custom tagging system for entry categorization.
    * **AI Integration:**
        * **Helper:** Generates writing prompts.
        * **Analyzer:** Sends filtered entry data to Google Gemini for pattern recognition and insights.
    * **Deep Linking:** Accepts `journalTemplate` props to pre-fill entries from other app sections.

### 3.6. To-Do List (`src/components/Goals.jsx`)

* **Change Log:** This feature replaces the previous "Goals" placeholder.
* **Functionality:** A general-purpose task manager for recovery or daily life.
* **Features:**
    * **Task Management:** Add new tasks, delete tasks, and toggle completion status.
    * **Persistence:** Auto-saves list state to `DataStore` under the `GOALS` key.
    * **UI:** Categorizes items into "Active" and "Completed" lists for visual clarity.

### 3.7. Recovery Workbook (`src/components/RecoveryWorkbook.jsx`)

* **Engine:** A hybrid rendering engine capable of displaying diverse content types based on `workbook.json` configuration.
* **Content Types:**
    * **Hierarchical (12-Step):** Collapsible sections with questions.
    * **Flat (General/Dharma):** Single prompt cards.
    * **Interactive (SMART):** Renders custom React components (`SmartGoalTool`, `CBATool`) specified by `customComponent` keys.
        * *Note: The "Smart Goal" tool here is distinct from the Dashboard "To-Do List" and focuses on detailed S.M.A.R.T. criteria planning.*
* **Features:**
    * **Auto-Save:** Debounced saving to prevent data loss.
    * **PDF Export:** Generates downloadable PDFs of completed work using `jspdf`.
    * **AI Insights:** Aggregates workbook answers for AI-driven thematic analysis.

### 3.8. Recovery Literature (`src/components/RecoveryLiterature.jsx`)

* **Architecture:** Lazy-loaded library.
* **Content:** Parses JSON representations of books (Big Book, Recovery Dharma) generated by Python scripts.
* **Reader:** Custom e-reader with pagination and chapter navigation.
* **Integration:** Allows users to highlight text or select chapters to instantly create a linked journal entry.

### 3.9. Coping Tools (`src/components/CopingTools.jsx`)

* **Coping Cards:** Randomly serves strategies from a predefined list.
* **Breathing Exercise:** Interactive visual/haptic breath pacer (Box Breathing, 4-7-8).
* **Recovery Simulator:** "The Fast Lane" - A resource management game simulating early recovery challenges (balancing Money, Stress, Wellbeing).
* **Recovery Jeopardy:** A trivia game for educational engagement.

### 3.10. Meeting Management

* **Personal Schedule (`Resources.jsx`):** Tracks weekly meeting attendance.
* **Homegroup Admin (`Homegroup.jsx`):** Accessed by starring a meeting.
    * **Tracker:** Logs meeting data (Attendance, 7th Tradition).
    * **Members:** Manages contact list with role assignment.
    * **Export:** CSV export functionality for reporting.

### 3.11. User Guide (`src/components/UserGuide.jsx`)

* **Architecture:** Refactored into a modular **Controller-View pattern**.
    * **Controller:** The main `UserGuide.jsx` component handles state management, scrolling navigation logic, and PDF export generation.
    * **Views:** Actual content is distributed across **12 specialized sub-components** (e.g., `GuideDashboard.jsx`, `GuideJournal.jsx`) located in `src/components/guide/`.
* **Benefits:** Improves code maintainability and readability by separating logic from static content.
* **Self-Documentation:** Can export itself as a PDF for offline reference.
* **Legal:** Contains the Privacy Policy and Medical Disclaimer.

## 4. Automation & DevOps (`scripts/`)

* **Enhanced Versioning (`auto_version.js`):**
    * Automates semantic versioning by hashing component files and incrementing version numbers in `data.js` on build.
    * **Update:** Now supports tracking **arrays of files** for a single component version (e.g., tracking changes across all 13 files that make up the User Guide).
* **Build Optimization (`package.json`):**
    * **Update:** Removed redundant `prebuild` execution triggers to prevent scripts from running twice during the build process.
* **Quality Control (`git_push.sh`):**
    * **Update:** Added a safety check that compares the current commit message against the previous one. It prompts the user for confirmation if a duplicate message is detected to prevent accidental repetition.
* **Deployment (`toggle_base.js`):** Configures `vite.config.js` base paths for different hosting environments (GitHub Pages vs. Firebase).
* **Content Pipeline:** Python scripts (`process_pdf.py`, etc.) parse raw PDFs into structured JSON for the application.

## 5. External Dependencies

* **React:** UI Library
* **Vite:** Build Tool
* **Tailwind CSS:** Styling
* **Firebase:** Authentication & Firestore (Optional)
* **Recharts:** Data Visualization (Mood Graph)
* **jsPDF:** PDF Generation
* **Crypto-JS:** Encryption
* **Google Gemini API:** AI Features
* 
