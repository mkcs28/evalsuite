import { expect, test } from "@playwright/test";

const WIDTHS = [320, 375, 414, 768, 1024, 1280, 1440, 1920];
const ROUTES = [
  "/",
  "/docs",
  "/docs/metrics",
  "/docs/metrics/classification--mcc",
  "/playground",
  "/benchmarks",
  "/research",
  "/roadmap",
  "/about",
  "/release-notes",
];

test("homepage presents the project honestly", async ({ page }) => {
  await page.goto("/");
  await expect(page).toHaveTitle(/EvalSuite/);
  await expect(page.getByRole("heading", { level: 1 })).toContainText("Unified evaluation");
  await expect(page.getByText(/v\d+\.\d+\.\d+ released/).first()).toBeVisible();
  await expect(page.getByRole("link", { name: "View on PyPI" }).first()).toHaveAttribute(
    "href",
    "https://pypi.org/project/evalsuite-python/",
  );
});

test("Satoshi is the computed body font", async ({ page }) => {
  await page.goto("/");
  const family = await page.evaluate(() => getComputedStyle(document.body).fontFamily);
  expect(family).toContain("Satoshi");
  await page.evaluate(() => document.fonts.ready);
  expect(await page.evaluate(() => document.fonts.check('16px "Satoshi"'))).toBe(true);
});

for (const route of ROUTES) {
  test(`no horizontal overflow on ${route}`, async ({ page }) => {
    for (const width of WIDTHS) {
      await page.setViewportSize({ width, height: 900 });
      await page.goto(route);
      const overflow = await page.evaluate(
        () => document.documentElement.scrollWidth - document.documentElement.clientWidth,
      );
      expect(overflow, `${route} at ${width}px`).toBeLessThanOrEqual(0);
    }
  });
}

test("documentation prev/next navigation", async ({ page }) => {
  await page.goto("/docs/getting-started");
  await expect(page.getByRole("navigation", { name: "Breadcrumb" })).toContainText(
    "Getting started",
  );
  await page.getByRole("link", { name: /Next Core concepts/ }).click();
  await expect(page).toHaveURL(/\/docs\/concepts$/);
});

test("metric search filters the explorer", async ({ page }) => {
  await page.goto("/docs/metrics");
  await page.getByRole("searchbox").fill("matthews");
  await expect(page.getByText(/^1 of \d+ metrics$/)).toBeVisible();
  await page.getByRole("link", { name: /Full reference for Matthews/ }).click();
  await expect(page.getByRole("heading", { level: 1 })).toHaveText(
    "Matthews correlation coefficient",
  );
});

test("site search opens with the keyboard", async ({ page }) => {
  await page.goto("/");
  await page.keyboard.press("Control+k");
  await page.getByRole("combobox", { name: "Search" }).fill("dice");
  await page.keyboard.press("Enter");
  await expect(page).toHaveURL(/segmentation--dice/);
});

test("playground runs in demo mode", async ({ page }) => {
  await page.goto("/playground");
  await expect(page.getByText("Demo mode.", { exact: true })).toBeVisible();
  await page.getByRole("button", { name: "Run evaluation" }).click();
  await expect(page.getByRole("table", { name: /Metric estimates/ })).toBeVisible();
  await expect(page.getByText("ROC curve", { exact: true })).toBeVisible();
});

test("theme toggle switches to dark mode", async ({ page }) => {
  await page.emulateMedia({ colorScheme: "light" });
  await page.goto("/");
  const toggle = page.getByRole("button", { name: /theme/i });
  await toggle.click(); // system -> light
  await toggle.click(); // light -> dark
  await expect(page.locator("html")).toHaveClass(/dark/);
});

test("unknown routes return 404", async ({ page }) => {
  const response = await page.goto("/no-such-page");
  expect(response?.status()).toBe(404);
  await expect(page.getByRole("heading", { name: "This page does not exist" })).toBeVisible();
});
