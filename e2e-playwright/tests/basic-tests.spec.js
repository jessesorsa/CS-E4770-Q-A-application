// @ts-check
const { test, expect } = require('@playwright/test');

const question = "What is ML 17";
const answer = "Answer";

test("Server responds with a page with the title 'Qanda'", async ({ page }) => {
  await page.goto("/");
  await page.locator(".ready-for-testing").waitFor({ timeout: 30000 });
  expect(await page.title()).toBe("Qanda");
});

test("Posting question", async ({ page }) => {

  await page.goto("/");
  await page.locator(".ready-for-testing").waitFor({ timeout: 30000 });
  await page.getByRole('link').filter({ has: page.getByText('CS-E4710') }).click();

  await page.waitForTimeout(500);
  await page.getByPlaceholder("Ask a question...").fill(question);
  await page.waitForTimeout(500);
  await page.getByTestId("send-question").click();
  await page.waitForTimeout(500);
  await expect(page.getByText(question)).toBeVisible({ timeout: 30000 });
});

test("Ai answer", async ({ page }) => {
  await page.goto("/");
  await page.locator(".ready-for-testing").waitFor({ timeout: 30000 });
  await page.getByRole('link').filter({ has: page.getByText('CS-E4710') }).click();

  await page.waitForTimeout(500);
  await page.getByText(question).waitFor({ timeout: 30000 });
  await page.getByRole('link').filter({ has: page.getByText(question) }).click();

  await page.waitForTimeout(500);
  await page.getByTestId('ai-generated').waitFor({ state: 'visible', timeout: 30000 });
  await expect(page.getByTestId('ai-generated').filter({ has: page.getByText('AI generated') })).toBeVisible();

});


test("Liking question", async ({ page }) => {

  await page.goto("/");
  await page.locator(".ready-for-testing").waitFor({ timeout: 30000 });
  await page.getByRole('link').filter({ has: page.getByText('CS-E4710') }).click();

  await page.waitForTimeout(500);
  await page.getByText(question).waitFor({ timeout: 30000 });


  await page
    .getByTestId('question')
    .filter({ hasText: question })
    .getByTestId('upvotes')
    .getByText('0')
    .waitFor({ timeout: 30000 });

  await page
    .getByTestId('question')
    .filter({ hasText: question })
    .getByTestId('like-button')
    .click();

  await page.waitForTimeout(500);

  await expect(page
    .getByTestId('question')
    .filter({ hasText: question })
    .getByTestId('upvotes')
    .getByText('1'))
    .toBeVisible();

});


test("Posting answer and submission limit", async ({ page }) => {
  await page.goto("/");
  await page.locator(".ready-for-testing").waitFor({ timeout: 30000 });
  await page.getByRole('link').filter({ has: page.getByText('CS-E4710') }).click();

  await page.waitForTimeout(500);
  await page.getByText(question).waitFor({ timeout: 30000 });
  await page.getByRole('link').filter({ has: page.getByText(question) }).click();

  await page.waitForTimeout(500);
  await page.getByPlaceholder("Answer...").fill(answer);
  await page.waitForTimeout(500);
  await page.getByTestId("send-answer").click();
  await page.waitForTimeout(500);

  await page
    .getByTestId('answer')
    .filter({ hasText: answer })
    .waitFor({ timeout: 10000 });

  await page.getByPlaceholder("Answer...").fill(answer);
  await page.waitForTimeout(500);
  await page.getByTestId("send-answer").click();
  await page.waitForTimeout(500);

  await expect(page.getByTestId('submission-limit-alert').filter({ has: page.getByText('Only one post per minute.') })).toBeVisible();

});