import { expect } from '@playwright/test';
import { authenticatedTest as test } from './fixtures/baseTest';

// Module 3: PROFILE (Profile & History Tabs)
test.describe('Module 3 - Profile & History', () => {

  test('PROFILE-01: Profile – Victory Statistics Verification per Difficulty', async ({ page, gameTestService, profilePage }) => {
    await gameTestService.forceDraw();
    
    await profilePage.gotoProfile();
    await expect(profilePage.statDraws).toHaveText('1');
  });

  test('PROFILE-02: Profile – Username Update and Subsequent Login', async ({ page, profilePage, loginPage, randomUsername }) => {
    const newUser = `${randomUsername}_updated`;
    
    // Update username
    await profilePage.gotoProfile();
    await profilePage.profileNameInput.fill(newUser);
    await profilePage.profileSaveButton.click();
    
    await page.waitForTimeout(500);

    // Logout
    await loginPage.logoutButton.click();
    await expect(loginPage.usernameInput).toBeVisible();

    // Switch to Login mode
    await loginPage.toggleModeButton.click();
    
    // Try logging in with OLD username
    await loginPage.usernameInput.fill(randomUsername);
    await loginPage.loginButton.click();
    await expect(loginPage.errorMessage).toBeVisible();

    // Try logging in with NEW username
    await loginPage.usernameInput.fill(newUser);
    await loginPage.loginButton.click();
    await expect(loginPage.logoutButton).toBeVisible();
  });

  test('PROFILE-03: Profile – Account Deletion and Clean Re-registration', async ({ page, gameTestService, profilePage, loginPage, randomUsername }) => {
    await gameTestService.playGameDynamically('Easy', 'optimal');
    
    // Delete Account
    await profilePage.gotoProfile();
    
    page.once('dialog', dialog => dialog.accept());
    await profilePage.deleteAccountButton.click();
    
    await expect(loginPage.usernameInput).toBeVisible();

    // Re-register with the same name
    await loginPage.createAccount(randomUsername);
    await expect(loginPage.logoutButton).toBeVisible();

    // Verify profile stats are empty
    await profilePage.gotoProfile();
    await expect(profilePage.statWins).toHaveText('0');
    await expect(profilePage.statDraws).toHaveText('0');

    // Verify history is empty
    await profilePage.gotoHistory();
    await expect(profilePage.historyEmptyMessage).toBeVisible();
  });

  test('PROFILE-04: History Tab – Comprehensive Game Records Display', async ({ gameTestService, profilePage }) => {
    const result = await gameTestService.playGameDynamically('Hard', 'optimal');
    
    await profilePage.gotoHistory();
    // Verify a row exists
    await expect(profilePage.historyRows.first()).toBeVisible();
    
    // Check row text contains the difficulty
    const rowText = await profilePage.historyRows.first().innerText();
    expect(rowText).toContain('Hard');
    
    // Check row text contains the result (Win, Loss, or Draw)
    let expectedText = 'Draw';
    if (result === 'x') expectedText = 'Win';
    if (result === 'o') expectedText = 'Loss';
    
    expect(rowText).toContain(expectedText);
  });

  test('PROFILE-05: Match History – Difficulty Recording', async ({ gameTestService, profilePage }) => {
    // Play on Hard
    await gameTestService.playGameDynamically('Hard', 'optimal');
    
    await profilePage.gotoHistory();
    await expect(profilePage.historyRows.first()).toBeVisible();
    
    const rowText = await profilePage.historyRows.first().innerText();
    expect(rowText).toContain('Hard');
  });

  test('PROFILE-06: UI – Mobile Responsiveness (Viewport < 768px)', async ({ page, profilePage }) => {
    // Change viewport
    await page.setViewportSize({ width: 375, height: 667 });
    
    await profilePage.gotoProfile();
    await expect(profilePage.statWins).toBeVisible();

    await profilePage.gotoHistory();
    await expect(profilePage.historyEmptyMessage).toBeVisible();

    await profilePage.navProfile.click();
    await expect(profilePage.profileNameInput).toBeVisible();
  });
});
