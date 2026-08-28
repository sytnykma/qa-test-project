# Test Cases: Tic-Tac-Toe Application

## Block 1: LOGIN (Authentication & UI Elements)

**LOGIN-01: Failed Login / Input Validation**
* **Priority:** High
* **Test Type:** Functional, Negative
* **Preconditions:** The user is on the landing/login page. No user is currently logged in.
* **Test Data:** Username = `""` (Empty), Username = `"NonExistentUser"`
* **Steps:**
  1. Leave the username field completely empty.
  2. Click the "Login" or "Create Account" button.
  3. Enter a username that has never been registered.
  4. Click the "Login" button.
* **Expected Result:** Form submission is prevented for the empty input. For the non-existent user, login is blocked and an appropriate error message is displayed.
* **Post-conditions:** User remains on the login page unauthenticated.

**LOGIN-02: Successful Registration & Login**
* **Priority:** Critical
* **Test Type:** Functional, Positive
* **Preconditions:** The user is on the landing/login page. No user is currently logged in.
* **Test Data:** Username = `"Player_New"`
* **Steps:**
  1. Enter a valid, unique username.
  2. Click the "Create Account" button.
  3. Enter the same valid username.
  4. Click the "Login" button.
* **Expected Result:** Account is created successfully. Login succeeds, and the user is redirected to the main game board page.
* **Post-conditions:** A user session is established and active.

**LOGIN-03: UI – Theme Switcher Functionality**
* **Priority:** Low
* **Test Type:** UI, Positive
* **Preconditions:** The user is on the landing page.
* **Steps:**
  1. Check the initial theme setting on the page (default: Light mode).
  2. Click the Theme Switcher button.
  3. Click the Theme Switcher button again.
* **Expected Result:** The `data-theme` attribute on the `<html>` tag changes to `dark`, and the visual color scheme switches to Dark mode. Clicking again reverts it back to Light mode.
* **Post-conditions:** Theme preference is applied dynamically.

**LOGIN-04: UI – Language Switcher (English to Persian / RTL Layout)**
* **Priority:** Medium
* **Test Type:** UI / Localization, Positive
* **Preconditions:** The user is on the landing page in English.
* **Steps:**
  1. Select "Persian" from the Language dropdown.
  2. Observe layout changes.
  3. Select "English" from the dropdown.
* **Expected Result:** Page labels translate to Persian, and text direction updates to RTL. Reverting to English restores labels and LTR layout.
* **Post-conditions:** Language and layout return to default.

**LOGIN-05: UI – Keyboard Navigation (Accessibility)**
* **Priority:** Medium
* **Test Type:** Accessibility, Positive
* **Preconditions:** The user is on the landing page.
* **Steps:**
  1. Verify the presence of the Header, Username input, Submit buttons, Theme toggle, and Language selector.
  2. Use the "Tab" key to sequentially focus on the input and buttons.
  3. Press "Enter" while focused on the "Login" button.
* **Expected Result:** All UI elements are accessible via keyboard. Focus outlines are clearly visible, and pressing Enter attempts form submission.
* **Post-conditions:** Focus state is maintained and handled properly.

**LOGIN-06: Registration – Duplicate Username Prevention**
* **Priority:** High
* **Test Type:** Functional, Negative
* **Preconditions:** The user is on the landing/login page. A user with the name "Player_New" already exists.
* **Test Data:** Username = `"Player_New"`
* **Steps:**
  1. Enter the username "Player_New".
  2. Click the "Create Account" button.
* **Expected Result:** Account creation fails, and an appropriate error message is displayed indicating the username is taken.
* **Post-conditions:** User remains on the login page unauthenticated.

**LOGIN-07: Session Management – Persistence on Page Reload**
* **Priority:** High
* **Test Type:** Functional, Positive
* **Preconditions:** The user is logged in and on the game board.
* **Steps:**
  1. Reload the page (F5 or browser refresh).
* **Expected Result:** The user remains logged in and does not need to re-authenticate. The game board is displayed.
* **Post-conditions:** Session persists.

---

## Block 2: GAME (Gameplay & Settings)

**GAME-01: Gameplay – Human Victory**
* **Priority:** Critical
* **Test Type:** Functional, Positive
* **Preconditions:** The user is logged in with a valid account and is on the game board.
* **Steps:**
  1. Place 'x' marks strategically on the grid to form a horizontal, vertical, or diagonal line of three.
  2. Observe the board and game status indicator.
* **Expected Result:** The game stops accepting input, the winning line is highlighted, and the status indicates a human victory.
* **Post-conditions:** Match result (Win) is saved to history.

**GAME-02: Gameplay – Computer Player Victory**
* **Priority:** High
* **Test Type:** Functional, Positive
* **Preconditions:** The user is logged in and starts a new game.
* **Steps:**
  1. Make non-optimal moves to allow the computer ('o' marks) to form a line of three.
  2. Observe the board and game status indicator.
* **Expected Result:** The game stops, the computer's winning line is highlighted, and the status indicates a computer victory.
* **Post-conditions:** Match result (Loss) is saved to history.

**GAME-03: Gameplay – Draw Condition**
* **Priority:** High
* **Test Type:** Functional, Positive
* **Preconditions:** The user is logged in and starts a new game.
* **Steps:**
  1. Play a sequence of moves where all 9 cells are filled without a winner.
  2. Observe the board and game status indicator.
* **Expected Result:** The game stops, no cells are highlighted as winning, and the status indicates a draw.
* **Post-conditions:** Match result (Draw) is saved to history.

**GAME-04: Game Settings – Difficulty Selection**
* **Priority:** Medium
* **Test Type:** Functional, Positive
* **Preconditions:** The user is logged in.
* **Steps:**
  1. Select "Easy", "Medium", and "Hard" sequentially from the difficulty dropdown menu.
* **Expected Result:** The dropdown updates properly to reflect the user's choice.
* **Post-conditions:** State of difficulty is retained for the current session.

**GAME-05: Game Logic – Move Validation & Occupied Cells (Defect Check)**
* **Priority:** High
* **Test Type:** Functional, Negative
* **Preconditions:** The user is logged in and the difficulty is "Hard".
* **Steps:**
  1. Mark an empty cell with an 'x'.
  2. Wait for the computer's turn, then attempt to click the exact same cell again.
  3. Continue playing to see if the computer eventually overwrites an occupied cell.
* **Expected Result:** Neither player can place a mark in a cell that already contains an 'x' or 'o'. *(Note: Expected to fail for the computer player due to a known defect on Hard difficulty).*
* **Post-conditions:** Game continues without state corruption.

**GAME-06: Game Logic – Hint System Validation (Defect Check)**
* **Priority:** Medium
* **Test Type:** Functional, Negative
* **Preconditions:** The user is logged in and a game is in progress.
* **Steps:**
  1. Mark a specific cell with an 'x'.
  2. Click the "Hint" button multiple times during your turn.
* **Expected Result:** The hint system must strictly highlight (pulse) an empty, playable cell. *(Note: Expected to fail due to a known defect where hints highlight occupied cells).*
* **Post-conditions:** Board state remains unchanged after hint request.

**GAME-07: Session Management – Logout Functionality**
* **Priority:** High
* **Test Type:** Functional, Positive
* **Preconditions:** The user is logged in and on the game board view.
* **Steps:**
  1. Click the "Logout" button in the header.
* **Expected Result:** The user session ends, the application redirects to the Authentication view, and the game board is hidden.
* **Post-conditions:** Session token/data is cleared.

**GAME-08: Board Interaction – Cell Clickability/Input Validation**
* **Priority:** High
* **Test Type:** Functional, Positive
* **Preconditions:** The user is logged in and a new game is started.
* **Steps:**
  1. For each of the 9 cells on the board:
     a. Click the empty cell.
     b. Verify the cell registers an 'x' mark.
     c. Reset the board.
     d. Verify the cell is empty again.
* **Expected Result:** The user can successfully place a mark in any available cell, and the reset function properly clears the board state.
* **Post-conditions:** The board is completely cleared and ready for a new game.

**GAME-09: Game State – Board Freeze After Game Over**
* **Priority:** High
* **Test Type:** Functional, Negative
* **Preconditions:** The user is logged in.
* **Steps:**
  1. Complete a game so that a Win or Draw condition is met.
  2. Attempt to click on any remaining empty cells on the board.
* **Expected Result:** The empty cells do not accept input. No new marks ('x' or 'o') appear on the board.
* **Post-conditions:** Game state remains locked until Reset is clicked.

**GAME-10: Game State – Mid-game Reset Functionality & History Isolation**
* **Priority:** Medium
* **Test Type:** Functional, Positive
* **Preconditions:** The user is logged in and starts a new game.
* **Steps:**
  1. Make 1 or 2 moves (do not complete the game).
  2. Click the "Reset" button.
  3. Navigate to the "History" tab.
* **Expected Result:** The board is cleared immediately. The aborted game is NOT recorded in the Match History or Statistics.
* **Post-conditions:** Board state is clean; statistics are unaffected.

---

## Block 3: PROFILE (Profile & History Tabs)

**PROFILE-01: Profile – Victory Statistics Verification per Difficulty**
* **Priority:** High
* **Test Type:** Functional, Positive
* **Preconditions:** The user is logged in and has completed multiple matches on different difficulties.
* **Steps:**
  1. Navigate to the "Profile" tab.
  2. Check the displayed win/loss/draw counters broken down by difficulty.
* **Expected Result:** The statistics counters accurately reflect the actual number of wins, losses, and draws achieved on each level.
* **Post-conditions:** Statistics remain persistent.

**PROFILE-02: Profile – Username Update and Subsequent Login**
* **Priority:** Medium
* **Test Type:** Functional, Positive
* **Preconditions:** The user is logged in.
* **Test Data:** New Username = `"Updated_Player"`
* **Steps:**
  1. Navigate to the "Profile" tab.
  2. Change the username and save.
  3. Click "Logout".
  4. Attempt to log in using the old username.
  5. Attempt to log in using the new username.
* **Expected Result:** Login with the old username fails. Login with the new username succeeds.
* **Post-conditions:** Account is bound to the new username.

**PROFILE-03: Profile – Account Deletion and Clean Re-registration**
* **Priority:** High
* **Test Type:** Functional, Positive
* **Preconditions:** The user is logged in and has a populated history and statistics.
* **Steps:**
  1. Navigate to the "Profile" tab and click "Delete Account".
  2. Confirm deletion.
  3. From the auth page, create a new account using the deleted username.
  4. Log in and navigate to the Profile and History tabs.
* **Expected Result:** Account creation is permitted. Profile statistics and Match History log are completely empty (reset state).
* **Post-conditions:** Previous data is unrecoverable.

**PROFILE-04: History Tab – Comprehensive Game Records Display**
* **Priority:** Medium
* **Test Type:** Functional, Positive
* **Preconditions:** The user is logged in and has completed at least 3 games.
* **Steps:**
  1. Navigate to the "History" tab.
  2. Inspect the records displayed.
* **Expected Result:** All completed games are listed chronologically, showing accurate match timestamp, difficulty level, and game outcome.
* **Post-conditions:** The view does not alter the underlying data.

**PROFILE-05: Match History – Difficulty Recording**
* **Priority:** Medium
* **Test Type:** Functional, Positive
* **Preconditions:** The user is logged in.
* **Steps:**
  1. Select "Hard" from the difficulty dropdown menu.
  2. Complete a full game (Win, Loss, or Draw).
  3. Scroll down to the Match History table.
* **Expected Result:** The Match History table displays a new row with the difficulty specifically recorded as "Hard".
* **Post-conditions:** State of difficulty is retained for the current session.

**PROFILE-06: UI – Mobile Responsiveness (Viewport < 768px)**
* **Priority:** Medium
* **Test Type:** UI, Positive
* **Preconditions:** The user is logged in.
* **Steps:**
  1. Resize the browser window to a mobile viewport width (e.g., 375px).
  2. Navigate through the Game board and Profile tabs.
* **Expected Result:** The game grid scales down proportionally without horizontal scrolling. UI elements (like tabs and tables) adapt to the smaller screen (e.g., stacking or scrolling natively).
* **Post-conditions:** Layout adapts seamlessly.
