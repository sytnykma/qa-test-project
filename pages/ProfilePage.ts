import { Page, Locator } from '@playwright/test';

export class ProfilePage {
  readonly page: Page;
  
  // Navigation
  readonly navProfile: Locator;
  readonly navHistory: Locator;

  // Profile Tab Elements
  readonly profileNameInput: Locator;
  readonly profileSaveButton: Locator;
  readonly deleteAccountButton: Locator;
  
  // Stats
  readonly statWins: Locator;
  readonly statLosses: Locator;
  readonly statDraws: Locator;

  // History Tab Elements
  readonly historyEmptyMessage: Locator;
  readonly clearHistoryButton: Locator;
  readonly historyRows: Locator;

  constructor(page: Page) {
    this.page = page;
    
    this.navProfile = page.getByTestId('nav-profile');
    this.navHistory = page.getByTestId('nav-history');

    this.profileNameInput = page.getByTestId('input-profile-name');
    this.profileSaveButton = page.getByTestId('btn-save-profile');
    this.deleteAccountButton = page.getByTestId('btn-delete-account');

    this.statWins = page.getByTestId('profile-wins');
    this.statLosses = page.getByTestId('profile-losses');
    this.statDraws = page.getByTestId('profile-draws');

    this.historyEmptyMessage = page.getByTestId('history-empty');
    this.clearHistoryButton = page.getByTestId('btn-clear-history');
    this.historyRows = page.locator('.table tbody tr');
  }

  async gotoProfile() {
    await this.navProfile.click();
  }

  async gotoHistory() {
    await this.navHistory.click();
  }
}
