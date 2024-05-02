const puppeteer = require('puppeteer');

describe('Ingredient Query Page Navigation', () => {
    let browser;
    let page;

    beforeAll(async () => {
        browser = await puppeteer.launch({
            headless: false, // Shows browser when testcases are being executed.
            slowMo: 100
        });
        page = await browser.newPage();
        
    });

    afterAll(async () => {
        await browser.close();
    });

    test('Open Ingredient Popup', async () => {
        try {
            await page.goto('https://localhost:44342/Stock/IngredientQuery');
            await page.waitForSelector('#addIngredientBtn', { visible: true, timeout: 10000 });
            await page.click('#addIngredientBtn');
            await page.waitForSelector('#ingredientModal', { visible: true });
            const modalVisible = await page.evaluate(() => {
                const modal = document.querySelector('#ingredientModal');
                return window.getComputedStyle(modal).display !== 'none';
            });
            expect(modalVisible).toBe(true);
        } catch (error) {
            console.error('Error:', error);
        }
    });

    test('Navigate to Meal Query', async () => {
        try {
            await page.goto('https://localhost:44342/Stock/IngredientQuery');
            await Promise.all([
                page.waitForNavigation({ timeout: 10000 }),
                page.click('#mealQueryBtn'),
            ]);
            expect(page.url()).toContain('/Stock/MealQuery');
        } catch (error) {
            console.error('Error navigating to Meal Query:', error);
        }
    });
});
