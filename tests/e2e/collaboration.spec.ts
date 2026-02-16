import { test, expect } from '@playwright/test';

test.describe('Real-time Collaboration', () => {
  test('Educator can push a prompt to a Learner in the same room', async ({ browser }) => {
    // Create two separate browser contexts to simulate two users
    const educatorContext = await browser.newContext();
    const learnerContext = await browser.newContext();

    const educatorPage = await educatorContext.newPage();
    const learnerPage = await learnerContext.newPage();

    // 1. Educator joins room
    await educatorPage.goto('/collaboration/room/test-room-123?role=EDUCATOR');
    
    // 2. Learner joins same room
    await learnerPage.goto('/collaboration/room/test-room-123?role=LEARNER');

    // 3. Educator sends a prompt
    await educatorPage.click('[data-testid="send-prompt-btn"]');
    
    // 4. Verify Learner receives it instantly
    const promptToast = learnerPage.locator('[data-testid="collaboration-prompt"]');
    await expect(promptToast).toBeVisible();
    await expect(promptToast).toContainText('Look at the screen');

    await educatorContext.close();
    await learnerContext.close();
  });
});