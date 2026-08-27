import { Page, Locator, expect } from '@playwright/test';

export class GamePage {
  readonly page: Page;
  readonly cells: Locator;
  readonly difficultySelect: Locator;
  readonly hintButton: Locator;
  readonly resetButton: Locator;
  readonly status: Locator;

  constructor(page: Page) {
    this.page = page;
    this.cells = page.locator('.cell');
    this.difficultySelect = page.getByTestId('select-difficulty'); 
    this.hintButton = page.getByRole('button', { name: /hint/i });
    this.resetButton = page.getByTestId('btn-reset');
    this.status = page.locator('.status');
  }

  async clickCell(index: number) {
    await this.cells.nth(index).click();
  }

  async requestHint() {
    await this.hintButton.click();
  }

  async resetBoard() {
    await this.resetButton.click();
  }

  async getBoardState(): Promise<string[]> {
    const state: string[] = [];
    const count = await this.cells.count();
    for (let i = 0; i < count; i++) {
      const text = await this.cells.nth(i).textContent();
      state.push(text ? text.trim().toLowerCase() : ''); 
    }
    return state;
  }

  async waitForCellText(index: number, textOrRegex: string | RegExp) {
    await expect(this.cells.nth(index)).toHaveText(textOrRegex, { timeout: 3000, ignoreCase: true });
  }
}