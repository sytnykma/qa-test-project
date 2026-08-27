# QA Automation Framework — Tic-Tac-Toe & Auth (Playwright + TypeScript)

A professional E2E & UI test automation framework built with **Playwright** and **TypeScript**. This project covers comprehensive testing of a web application featuring an authentication form, an interactive Tic-Tac-Toe game, hint systems, theme switching, and language localization.

---

## 🛠 Tech Stack

* **Language:** TypeScript
* **Test Runner:** Playwright Test
* **Design Pattern:** Page Object Model (POM) + Helper Services + Custom Fixtures
* **CI/CD Ready:** Headless execution configuration and reporting.

---

## 📁 Project Structure

The project architecture is built on the principles of **Separation of Concerns** and **Maintainability**, separating declarative test cases, Page Objects (POM), helper game logic, and documentation.

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
│   └── fixtures.ts           # Custom Playwright fixtures for DI of pages and services
├── Test-Plan.md              # High-level test strategy and scope definition
├── Test-Cases.md             # Detailed test cases with priority, test data, and expected results
├── playwright.config.ts      # Playwright configuration file
├── package.json              # Dependencies and npm scripts
└── .gitignore                # Ignored files (e.g., node_modules, test-results)
```

---

## ⚙️ Setup and Installation

**1. Prerequisites**
Ensure you have the following installed on your machine:
- [Node.js](https://nodejs.org/) (version 18.x or higher)
- npm (comes bundled with Node.js)

**2. Clone Repository & Install Dependencies**
```bash
# Clone the repository
git clone <your-repository-url>
cd <project-folder>

# Install dependencies (installs Playwright and necessary TypeScript types like @types/node)
npm install
```

**3. Install Playwright Browsers**
Download the required browser binaries to run tests:
```bash
npx playwright install
```

---

## 🚀 Running Tests

Run all tests in headless mode (default):
```bash
npm test
```
*Note: This utilizes the `"test": "playwright test"` script configured in `package.json`.*

Run tests with visual browser display (Headed mode):
```bash
npx playwright test --headed
```

Run a specific test file (e.g., game module):
```bash
npx playwright test tests/game.spec.ts --headed
```

Interactive run via Playwright UI (convenient for debugging):
```bash
npx playwright test --ui
```

View the HTML test report (automatically generated after execution):
```bash
npx playwright show-report
```