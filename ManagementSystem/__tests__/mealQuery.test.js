const puppeteer = require('puppeteer');

describe('Meal Query Page Interactions', () => {
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

    test('Navigate to Add Meal Page', async () => {
        await page.goto('https://localhost:44342/Stock/MealQuery');
        const navigationPromise = page.waitForNavigation();
        await page.click('#addMealBtn');
        await navigationPromise;
        expect(page.url()).toContain('/Stock/AddMeal');
    });

    test('Open Add Ingredient Modal', async () => {
        await page.goto('https://localhost:44342/Stock/MealQuery');
        await page.click('#addIngredientBtn');
        await page.waitForSelector('#ingredientModal', { visible: true });
        const isModalVisible = await page.evaluate(() => {
            const modal = document.querySelector('#ingredientModal');
            return getComputedStyle(modal).display !== 'none';
        });
        expect(isModalVisible).toBe(true);
    });

    test('Navigate to Ingredient Query', async () => {
        await page.goto('https://localhost:44342/Stock/MealQuery');
        const navigationPromise = page.waitForNavigation();
        await page.click('#ingredientQueryBtn');
        await navigationPromise;
        expect(page.url()).toContain('/Stock/IngredientQuery');
    });

    test('Verify Check Quantity button works', async () => {
        await page.goto('https://localhost:44342/Stock/MealQuery');
        await page.waitForSelector('#mealList');
        await page.select('#mealList', '13');
        await page.click('#checkQuantityBtn');
        await page.waitForFunction(
            'document.getElementById("mealQuantityResult").textContent.includes("complete meals")',
            { timeout: 5000 }
        );
        const resultText = await page.evaluate(() => document.getElementById('mealQuantityResult').textContent);
        expect(resultText).toMatch(/You can make 6 complete meals with the current stock./);
    });

});
