import { test, expect } from '@playwright/test';

test.describe('Dynamic Form Builder', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('http://localhost:3000');
    // Wait for the app to load
    await page.waitForSelector('#app', { timeout: 10000 });
  });

  test('should open Dynamic Form Builder from menu', async ({ page }) => {
    // Click the menu button
    await page.click('[data-element="menuButton"]');
    
    // Wait for menu to appear and click Dynamic Form Builder
    await page.waitForSelector('[data-element="dynamicFormBuilderButton"]');
    await page.click('[data-element="dynamicFormBuilderButton"]');
    
    // Verify the modal is open
    await page.waitForSelector('.DynamicFormBuilder', { timeout: 5000 });
    await expect(page.locator('.DynamicFormBuilder')).toBeVisible();
  });

  test('should display form templates', async ({ page }) => {
    // Open the Dynamic Form Builder
    await page.click('[data-element="menuButton"]');
    await page.waitForSelector('[data-element="dynamicFormBuilderButton"]');
    await page.click('[data-element="dynamicFormBuilderButton"]');
    await page.waitForSelector('.DynamicFormBuilder');
    
    // Check that template options are available
    await expect(page.locator('.template-section')).toBeVisible();
    await expect(page.locator('text=Professional Resume')).toBeVisible();
    await expect(page.locator('text=Cover Letter')).toBeVisible();
    await expect(page.locator('text=Job Application')).toBeVisible();
  });

  test('should allow adding custom fields', async ({ page }) => {
    // Open the Dynamic Form Builder
    await page.click('[data-element="menuButton"]');
    await page.waitForSelector('[data-element="dynamicFormBuilderButton"]');
    await page.click('[data-element="dynamicFormBuilderButton"]');
    await page.waitForSelector('.DynamicFormBuilder');
    
    // Click Add Field button
    await page.click('button:has-text("Add Field")');
    
    // Fill in field details
    await page.fill('input[placeholder="Enter field label"]', 'Test Field');
    await page.selectOption('select', 'text');
    await page.fill('input[placeholder="Enter placeholder text"]', 'Enter test value');
    
    // Save the field
    await page.click('button:has-text("Add Field")');
    
    // Verify field was added
    await expect(page.locator('text=Test Field')).toBeVisible();
  });

  test('should generate PDF', async ({ page }) => {
    // Open the Dynamic Form Builder
    await page.click('[data-element="menuButton"]');
    await page.waitForSelector('[data-element="dynamicFormBuilderButton"]');
    await page.click('[data-element="dynamicFormBuilderButton"]');
    await page.waitForSelector('.DynamicFormBuilder');
    
    // Fill in some form data
    await page.fill('input[placeholder="Enter your full name"]', 'John Doe');
    await page.fill('input[placeholder="Enter your email"]', 'john@example.com');
    await page.fill('input[placeholder="Enter your phone number"]', '123-456-7890');
    
    // Click Generate PDF button
    await page.click('button:has-text("Generate PDF")');
    
    // Wait for PDF generation (this might take a moment)
    await page.waitForTimeout(2000);
    
    // The PDF should be downloaded automatically
    // In a real test, you might want to check the download folder
  });

  test('should close modal', async ({ page }) => {
    // Open the Dynamic Form Builder
    await page.click('[data-element="menuButton"]');
    await page.waitForSelector('[data-element="dynamicFormBuilderButton"]');
    await page.click('[data-element="dynamicFormBuilderButton"]');
    await page.waitForSelector('.DynamicFormBuilder');
    
    // Click close button
    await page.click('button:has-text("Close")');
    
    // Verify modal is closed
    await expect(page.locator('.DynamicFormBuilder')).not.toBeVisible();
  });
}); 