
import { chromium } from 'playwright';

async function runApply() {
  const browser = await chromium.launch();
  const context = await browser.newContext();
  const page = await context.newPage();

  const applyUrl = process.env.TARGET_URL || 'https://example-job-form.test/apply';
  await page.goto(applyUrl, { waitUntil: 'networkidle' });

  await page.fill('input[name="firstName"]', process.env.FIRST_NAME || 'Sharad');
  await page.fill('input[name="lastName"]', process.env.LAST_NAME || 'Mishra');
  await page.fill('input[name="email"]', process.env.EMAIL || 'sharad@example.com');
  try {
    await page.setInputFiles('input[type=file]', process.env.RESUME_PATH || './resume.pdf');
  } catch(e) {}
  await page.fill('textarea[name="coverLetter"]', process.env.COVER_LETTER || 'I am excited to apply...');
  try {
    await page.click('button[type=submit]');
  } catch(e) {}
  await page.waitForTimeout(2000);
  const screenshotPath = 'apply_screenshot.png';
  await page.screenshot({ path: screenshotPath });

  const content = await page.content();
  const success = content.includes('Thank you') || content.includes('Application received') || content.includes('Thanks for applying');

  const result = {
    status: success ? 'success' : 'unknown',
    screenshot: screenshotPath
  };
  console.log(JSON.stringify(result));
  await browser.close();
  process.exit(0);
}

runApply().catch(err => {
  console.error(JSON.stringify({status:'failed', error: err.message}));
  process.exit(1);
});
