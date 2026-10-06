import { expect, test } from "@playwright/test";

test("mobile navigation menu", async ({ page }) => {
  await page.goto("/");
  await page.getByRole("button", { name: "Open menu" }).click();
  await page.locator("#mobile-nav").getByRole("link", { name: "Roadmap" }).click();
  await expect(page).toHaveURL(/\/roadmap$/);
});

test("mobile documentation menu", async ({ page }) => {
  await page.goto("/docs");
  await page.getByText("Documentation menu").click();
  await page.getByRole("link", { name: "Regression" }).first().click();
  await expect(page).toHaveURL(/\/docs\/regression$/);
});
