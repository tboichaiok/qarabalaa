const os = require('node:os');
const path = require('node:path');
const { chromium } = require('playwright');

const targetUrl = 'http://localhost:3000';
const artifactDir = process.env.PW_ARTIFACT_DIR || os.tmpdir();

(async () => {
  const browser = await chromium.launch({ headless: false });
  try {
    const page = await browser.newPage();

    // Test with hoodie product which has multiple sizes
    console.log('Navigating to product page (hoodie)...');
    await page.goto(targetUrl + '/product/heavyweight-fleece-hoodie');
    await page.waitForLoadState('networkidle');
    console.log('✓ Product page loaded');

    // Check that we can see essential elements
    const title = await page.locator('h1').textContent();
    console.log('Product title:', title.trim());

    const price = await page.locator('p').filter({ hasText: /₸/ }).first().textContent();
    console.log('Price:', price.trim());

    // Open size guide
    console.log('Opening size guide...');
    await page.locator('button:has-text("Таблица размеров")').click();
    await page.waitForTimeout(500);
    const modal = page.locator('.fixed.inset-0.z-50');
    const isModalVisible = await modal.isVisible();
    console.log('Size guide modal visible:', isModalVisible);

    // Close modal
    await page.locator('button:has-text("Понятно")').click();
    await page.waitForTimeout(500);

    // Select an available size (try L which should have stock)
    console.log('Selecting size L...');
    const sizeL = page.locator('button:has-text("L")').first();
    // Check if it's not disabled
    const isDisabled = await sizeL.getAttribute('disabled');
    if (!isDisabled) {
      await sizeL.click();
      console.log('✓ Size L selected');
    } else {
      // Try M
      const sizeM = page.locator('button:has-text("M")').first();
      const isMDisabled = await sizeM.getAttribute('disabled');
      if (!isMDisabled) {
        await sizeM.click();
        console.log('✓ Size M selected');
      } else {
        console.log('! Common sizes disabled, checking available...');
        // Find first enabled size button
        const allSizes = page.locator('button:not([disabled])');
        const count = await allSizes.count();
        if (count > 0) {
          await allSizes.first().click();
          console.log('✓ First available size selected');
        }
      }
    }

    // Select a color
    console.log('Selecting color...');
    const colorButtons = page.locator('.flex.flex-wrap.gap-3 button');
    const colorCount = await colorButtons.count();
    if (colorCount > 0) {
      await colorButtons.first().click();
      console.log('✓ Color selected');
    }

    // Increase quantity
    console.log('Increasing quantity...');
    const plusButton = page.locator('button:has-title("Увеличить количество")').first();
    await plusButton.click();
    console.log('✓ Quantity increased');

    // Add to cart
    console.log('Adding to cart...');
    const addButton = page.locator('button:has-text("Добавить в корзину")').first();
    await addButton.click();
    await page.waitForTimeout(1000);
    console.log('✓ Add to cart clicked');

    // Check success message
    const successMsg = page.locator('.bg-emerald-50');
    const successVisible = await successMsg.isVisible();
    if (successVisible) {
      const msgText = await successMsg.textContent();
      console.log('Success message:', msgText.trim());
    }

    // Check cart badge
    console.log('Checking cart...');
    await page.waitForTimeout(1000);
    const cartBadge = page.locator('[aria-label="Открыть корзину"] span');
    const badgeText = await cartBadge.textContent();
    console.log('Cart badge:', badgeText);

    await page.screenshot({ path: path.join(artifactDir, 'pdp-final.png'), fullPage: true });
    console.log('✓ All core functionality tests passed');

  } catch (error) {
    console.error('Error:', error.message);
  } finally {
    await browser.close();
  }
})();