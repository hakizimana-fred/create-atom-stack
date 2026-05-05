/* ─── Cypress ────────────────────────────────────────────────────────────── */

export const cypressConfig = `import { defineConfig } from 'cypress';

export default defineConfig({
  e2e: {
    baseUrl: 'http://localhost:3000',
    specPattern: 'cypress/e2e/**/*.cy.{ts,tsx}',
    supportFile: 'cypress/support/e2e.ts',
  },
});
`;

export const cypressSupport = `// Cypress support file — add global hooks and custom commands here.
`;

export const cypressHomeSpec = `describe('Home page', () => {
  it('loads and has a title', () => {
    cy.visit('/');
    cy.title().should('not.be.empty');
  });

  it('displays an h1 heading', () => {
    cy.visit('/');
    cy.get('h1').should('be.visible');
  });

  it('renders the header navigation', () => {
    cy.visit('/');
    cy.get('nav').should('be.visible');
  });
});
`;

export const cypressDocsSpec = `describe('Docs page', () => {
  it('is reachable directly', () => {
    cy.visit('/docs');
    cy.get('main').should('be.visible');
  });

  it('is accessible via the Docs nav link', () => {
    cy.visit('/');
    cy.get('nav').contains(/docs/i).click();
    cy.url().should('include', '/docs');
    cy.get('main').should('be.visible');
  });
});
`;

/* ─── Playwright ─────────────────────────────────────────────────────────── */

export const homeSpec = `import { test, expect } from '@playwright/test';

test.describe('Home page', () => {
  test('loads and has a title', async ({ page }) => {
    await page.goto('/');
    await expect(page).toHaveTitle(/.+/);
  });

  test('displays an h1 heading', async ({ page }) => {
    await page.goto('/');
    const heading = page.getByRole('heading', { level: 1 });
    await expect(heading).toBeVisible();
  });

  test('renders the header navigation', async ({ page }) => {
    await page.goto('/');
    await expect(page.getByRole('navigation')).toBeVisible();
  });

  test('has no broken internal links on the nav', async ({ page }) => {
    await page.goto('/');
    const internalLinks = page.getByRole('navigation').getByRole('link');
    const hrefs = await internalLinks.evaluateAll((els) =>
      (els as HTMLAnchorElement[])
        .map((el) => el.getAttribute('href') ?? '')
        .filter((h) => h.startsWith('/')),
    );
    for (const href of hrefs) {
      const res = await page.request.get(href);
      expect(res.status(), \`\${href} returned \${res.status()}\`).toBeLessThan(400);
    }
  });
});
`;

export const docsSpec = `import { test, expect } from '@playwright/test';

test.describe('Docs page', () => {
  test('is reachable directly', async ({ page }) => {
    const res = await page.goto('/docs');
    expect(res?.status()).toBeLessThan(400);
  });

  test('renders visible main content', async ({ page }) => {
    await page.goto('/docs');
    await expect(page.getByRole('main')).toBeVisible();
  });

  test('is accessible via the Docs nav link', async ({ page }) => {
    await page.goto('/');
    await page.getByRole('link', { name: /docs/i }).first().click();
    await expect(page).toHaveURL(/\/docs/);
    await expect(page.getByRole('main')).toBeVisible();
  });
});
`;
