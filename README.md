# QA Automation Framework — Tic-Tac-Toe & Auth (Playwright + TypeScript)

A professional E2E & UI test automation framework built with **Playwright** and **TypeScript**. This project covers comprehensive testing of a web application featuring an authentication form, an interactive Tic-Tac-Toe game, hint systems, theme switching, and language localization.

---

## 🛠 Tech Stack

* **Language:** TypeScript
* **Test Runner:** Playwright Test
* **Design Pattern:** Page Object Model (POM) + Helper Services
* **CI/CD Ready:** Headless execution configuration and reporting.

---

## 📁 Project Structure

The project architecture is built on the principles of **Separation of Concerns** and **Maintainability**, separating declarative test cases, Page Objects (POM), and helper game logic.

```text
├── helpers/
│   └── TicTacToeBot.ts       # Game algorithm and move simulator for hard mode & edge cases
├── pages/
│   ├── LoginPage.ts          # Page Object for the login form
│   └── GamePage.ts           # Page Object for the game board, states, and controls
├── tests/
│   ├── login.spec.ts         # Test suite for login form and validation
│   └── game.spec.ts          # Test suite for game logic and defect checks
├── playwright.config.ts      # Playwright configuration file
├── package.json              # Dependencies and npm scripts
└── README.md                 # Project documentation


⚙️ Setup and Installation
1. Prerequisites
Ensure you have the following installed on your machine:

Node.js (version 18.x or higher)

npm (comes bundled with Node.js)

2. Clone Repository & Install Dependencies

# Clone the repository
git clone <your-repository-url>
cd <project-folder>

# Install dependencies (this will also install Playwright and necessary TypeScript types for Node.js like @types/node)
npm install

3. Install Playwright Browsers
Download the required browser binaries to run tests:
npx playwright install

🚀 Running Tests

Run all tests in headless mode (default):


npx playwright test
Run tests with visual browser display (Headed mode):


npx playwright test --headed
Run a specific test file (e.g., game module):


npx playwright test tests/game.spec.ts --headed
Interactive run via Playwright UI (convenient for debugging):


npx playwright test --ui
View the HTML test report:


npx playwright show-report