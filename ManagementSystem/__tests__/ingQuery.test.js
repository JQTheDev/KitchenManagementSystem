const puppeteer = require('puppeteer');

describe('Ingredient Query Page Navigation', () => {
    let browser;
    let page;

    beforeAll(async () => {
        browser = await puppeteer.launch();
        page = await browser.newPage();
    });

    afterAll(async () => {
        await browser.close();
    });

    test('Open Add Ingredient Modal', async () => {
        await page.goto('https://localhost:44342/Stock/IngredientQuery');
        await page.click('#addIngredientBtn');
        await page.waitForSelector('#ingredientModal', { visible: true });
        const modalVisible = await page.evaluate(() => {
            const modal = document.querySelector('#ingredientModal');
            return window.getComputedStyle(modal).display !== 'none';
        });
        expect(modalVisible).toBe(true);
    });

    test('Check Meal Query Button', async () => {
        await page.goto('https://localhost:44342/Stock/IngredientQuery');
        await Promise.all([
            page.waitForNavigation(),
            page.click('#mealQueryBtn'),
        ]);
        expect(page.url()).toContain('/Stock/MealQuery');
    });
});
