# Bug Report

## Overview
Test execution using Playwright on the Chromium browser identified **2 defects** across the application. Below are the professional bug reports formatted according to QA standards.

---

### BUG-01: AI Overwrites Already Occupied Cells
**Status:** Open | **Severity:** Critical | **Priority:** High
**Component:** Game Logic

**Description:**
The computer opponent (AI) does not validate if a cell is empty before making a move. It can place its mark on cells already occupied by the player or itself, breaking the fundamental rules of the game.

**Steps to Reproduce:**
1. Start a new game against the Computer.
2. Place a mark in a specific cell (e.g., Cell `[1]` or Cell `[3]`).
3. Wait for the computer's turn and observe its move.

**Expected Result:**
The computer must only place its mark in an empty, unoccupied cell.

**Actual Result:**
The computer overwrites a cell that is already occupied by the human player or itself.

**Logs/Evidence:**
```
🚨 BUGS IN 2 OF 9 GAMES!
#1: Game starting at cell [1]: Computer overwrote cell [1]
#2: Game starting at cell [3]: Computer overwrote cell [3]
```

---

### BUG-02: Hint System Highlights Occupied Cells
**Status:** Open | **Severity:** Medium | **Priority:** Medium
**Component:** Game Logic / Hint System

**Description:**
The hint system suggests invalid moves to the player by highlighting cells that are already occupied by 'x' or 'o'.

**Steps to Reproduce:**
1. Start a new game and make a few moves so that multiple cells are occupied.
2. Activate the "Hint" functionality.
3. Observe which cell gets highlighted.

**Expected Result:**
The hint system should calculate and highlight an optimal *empty* cell for the player's next move.

**Actual Result:**
The hint system frequently highlights cells that are already occupied.

**Logs/Evidence:**
```
🚨 HINT BUGS IN 4 OF 9 GAMES!
#1: Hint highlighted occupied cell [2] ('o')
#3: Hint highlighted occupied cell [6] ('x')
```
