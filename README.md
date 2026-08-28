# QA Automation Framework — Tic-Tac-Toe & Auth (Playwright + TypeScript)

A professional E2E & UI test automation framework built with **Playwright** and **TypeScript**. This project covers comprehensive testing of a web application featuring an authentication form, an interactive Tic-Tac-Toe game, hint systems, theme switching, and language localization.

---

## 🛠 Tech Stack

* **Language:** TypeScript
* **Test Runner:** Playwright Test
* **Design Pattern:** Page Object Model (POM) + Helper Services + Custom Fixtures
* **CI/CD Ready:** Headless execution configuration and reporting.

---

## 🚀 Advanced Testing Highlights (10/10 Polish)

During the development of this automation suite, several advanced Playwright techniques were employed to overcome logic flaws inherent in the application's AI:

1. **Deterministic State Mocking:** The application's "Hard" AI contains a defect (BUG-01) where it overwrites human cells, breaking standard match flows. To test the `Draw` state UI and `Board Freeze` logic without being interrupted by the faulty AI, the framework uses `page.evaluate` to mock `Math.random()` directly in the browser's execution context. This elegantly forces the "Easy" AI to play a predetermined sequence of moves, creating a 100% stable testing environment for edge cases.
2. **Defect Trapping Automation:** Custom logic loops were built into the `GameTestService` to actively hunt for elusive, intermittent bugs. The tests programmatically play hundreds of game sequences dynamically to mathematically prove and surface bugs (e.g., proving the Hint system highlights occupied cells).
3. **Flawless POM Architecture:** A robust Page Object Model ensures separation of concerns, mapping perfectly to the modular `Test-Cases.md` documentation. 

---

## 📁 Project Structure

```text
├── helpers/
│   ├── GameTestService.ts    # Service encapsulating complex game rules and defect validation loops
│   └── TicTacToeBot.ts       # Game algorithm and move simulator for hard mode & edge cases
├── pages/
│   ├── LoginPage.ts          # Page Object for the login form and UI settings
│   └── GamePage.ts           # Page Object for the game board, states, and controls
├── tests/
│   ├── auth.spec.ts          # Test suite for UI settings and authentication flow
│   ├── game.spec.ts          # Test suite for core game logic and defect checks
│   └── profile.spec.ts       # Test suite for profile stats and match history logic
│   └── fixtures/baseTest.ts  # Custom Playwright fixtures for DI of pages and services
├── Bug-Report.md             # Professional defect log with steps to reproduce
├── Test-Plan.md              # High-level test strategy and scope definition
├── Test-Cases.md             # Detailed test cases with priority, test data, and expected results
├── playwright.config.ts      # Playwright configuration file
└── package.json              # Dependencies and npm scripts
```

---

## 🐞 Bugs Found

1. **BUG-01: AI Overwrites Already Occupied Cells (Critical)**
   - The computer opponent does not validate if a cell is empty before making a move and actively overwrites cells in "Hard" mode.
2. **BUG-02: Hint System Highlights Occupied Cells (Medium)**
   - The hint system incorrectly suggests moves on cells that are already populated by marks.

*(Note: Initial false positives regarding Draw State and Board Freeze UI were successfully debunked by mocking deterministic AI flows).*

---

## ⚙️ Setup and Installation

**1. Prerequisites**
- [Node.js](https://nodejs.org/) (version 18.x or higher)

**2. Clone Repository & Install Dependencies**
```bash
npm install
```

**3. Install Playwright Browsers**
```bash
npx playwright install
```

---

## 🚀 Running Tests

Run all tests in headless mode (default):
```bash
npm test
```

Interactive run via Playwright UI (convenient for debugging):
```bash
npx playwright test --ui
```

View the HTML test report (automatically generated after execution):
```bash
npx playwright show-report
```