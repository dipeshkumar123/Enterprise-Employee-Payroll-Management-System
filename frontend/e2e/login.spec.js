// @ts-check
import { test, expect } from '@playwright/test';

test.describe('ERP Payroll System - Login Flow', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('http://localhost:3000/login');
  });

  test('should render login page correctly', async ({ page }) => {
    // Check page title
    await expect(page.getByRole('heading', { name: 'Sign In' })).toBeVisible();
    // Check email field
    await expect(page.getByLabel('Email')).toBeVisible();
    // Check password field
    await expect(page.getByLabel('Password')).toBeVisible();
    // Check sign in button
    await expect(page.getByRole('button', { name: /sign in/i })).toBeVisible();
    // Check forgot password link
    await expect(page.getByText('Forgot password?')).toBeVisible();
  });

  test('should show validation errors for empty fields', async ({ page }) => {
    await page.getByRole('button', { name: /sign in/i }).click();
    // Should show some validation error
    await expect(page.getByText(/is required/i).first()).toBeVisible();
  });

  test('should show error for invalid credentials', async ({ page }) => {
    await page.getByLabel('Email').fill('test@test.com');
    await page.getByRole('textbox', { name: 'Password' }).fill('wrongpassword');
    await page.getByRole('button', { name: /sign in/i }).click();
    // Should show an error alert (API will return 401)
    await expect(page.getByRole('alert')).toBeVisible({ timeout: 10000 });
  });

  test('should sign in with the local bootstrap admin account', async ({ page }) => {
    const consoleErrors = [];
    page.on('console', (message) => {
      if (message.type() === 'error') consoleErrors.push(message.text());
    });
    await page.getByLabel('Email').fill('admin@example.com');
    await page.getByRole('textbox', { name: 'Password' }).fill('Admin@123');
    await page.getByRole('button', { name: /sign in/i }).click();
    await expect(page).toHaveURL(/\/dashboard/);
    await expect(page.getByText('Employees by Department')).toBeVisible();
    await expect(consoleErrors).toEqual([]);
  });

  test('should create an employee account from the sign-up link', async ({ page }) => {
    const signUpLink = page.getByRole('link', { name: 'Sign up' });
    await expect(signUpLink).toHaveCount(1);
    await signUpLink.click();
    await expect(page.getByRole('heading', { name: 'Create account' })).toBeVisible();

    const suffix = Date.now();
    await page.getByLabel('Username').fill(`e2e-${suffix}`);
    await page.getByLabel('Email Address').fill(`e2e-${suffix}@example.com`);
  await page.getByRole('textbox', { name: 'Password', exact: true }).fill('E2eTest@123');
    await page.getByRole('textbox', { name: 'Confirm password' }).fill('E2eTest@123');
    await page.getByRole('button', { name: 'Create account' }).click();
    await expect(page).toHaveURL(/\/dashboard/);
  });

  test('should navigate to forgot password page', async ({ page }) => {
    await page.getByText('Forgot password?').click();
    await expect(page.getByRole('heading', { name: 'Forgot Password' })).toBeVisible();
  });

  test('should have no console errors on load', async ({ page }) => {
    const consoleErrors = [];
    page.on('console', (msg) => {
      if (msg.type() === 'error') {
        consoleErrors.push(msg.text());
      }
    });
    await page.goto('http://localhost:3000/login');
    await expect(consoleErrors.length).toBe(0);
  });
});

test.describe('ERP Payroll System - Navigation', () => {
  test('should redirect unauthenticated users to login', async ({ page }) => {
    await page.goto('http://localhost:3000/dashboard');
    await expect(page).toHaveURL(/\/login/);
  });

  test('should show 404 for unknown routes', async ({ page }) => {
    await page.goto('http://localhost:3000/nonexistent-route');
    await expect(page.locator('text=404')).toBeVisible();
  });
});

test.describe('ERP Payroll System - Core pages', () => {
  test('should load attendance and manage departments without browser errors', async ({ page }) => {
    const consoleErrors = [];
    page.on('console', (message) => {
      if (message.type() === 'error') consoleErrors.push(message.text());
    });

    await page.goto('http://localhost:3000/login');
    await page.getByLabel('Email').fill('admin@example.com');
    await page.getByRole('textbox', { name: 'Password' }).fill('Admin@123');
    await page.getByRole('button', { name: /sign in/i }).click();
    await expect(page).toHaveURL(/\/dashboard/);

    await page.goto('http://localhost:3000/attendance');
    await expect(page.getByRole('heading', { name: 'Attendance Dashboard' })).toBeVisible();
    await expect(page.getByText('Attendance Distribution')).toBeVisible();

    await page.goto('http://localhost:3000/departments');
    await page.getByRole('button', { name: 'Add Department' }).click();
    const suffix = Date.now();
    await page.getByLabel('Department Name').fill(`Quality-${suffix}`);
    await page.getByLabel('Manager').fill('QA Manager');
    await page.getByLabel('Location').fill('Bangalore');
    await page.getByRole('button', { name: 'Add Department' }).last().click();
    await expect(page.getByText('Department created successfully')).toBeVisible();
    await expect(consoleErrors).toEqual([]);
  });
});
