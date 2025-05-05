import { test, expect } from '@playwright/test';
test('TemplateWithSingleNode', async ({ page }) => {
    await page.goto('./tests/TemplateWithSingleNode.html');
    await page.waitForTimeout(4000);
    const editor = page.locator('#target');
    await expect(editor).toHaveAttribute('mark', 'good');
});
