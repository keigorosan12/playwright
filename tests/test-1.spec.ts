import { test, expect } from '@playwright/test';

test('test', async ({ page }) => {
    await page.goto('https://keigorosan12.github.io/');
    await page.getByRole('link', { name: '星野 孝総' }).click();
    await page.goto('https://keigorosan12.github.io/');
});