import { test, expect } from '@playwright/test';

test('homepage has "Philly Ward Leaders" as the page title and clicking "Get started" navigates to "/leaders/democratic"', async ({ page }) => {
  await page.goto('localhost:8080');

  // Expect a title "to contain" a substring.
  await expect(page).toHaveTitle('Philly Ward Leaders');

  // // create a locator
   const getStarted = page.getByText('Get started');

   // Expect an attribute "to be strictly equal" to the value.
   await expect(getStarted).toHaveAttribute('href', '/leaders');

   // Click the get started link.
   await getStarted.click();
  
   // Expects the URL to contain /leaders/democratic
  await expect(page).toHaveURL(/.*leaders\/democratic/);
});
