const puppeteer = require('puppeteer');

describe('Meal Planner Page Interactions', () => {
    let browser;
    let page;

    beforeAll(async () => {
        browser = await puppeteer.launch({
            //headless: false,
            //slowMo: 100
        });
        page = await browser.newPage();
    });

    afterAll(async () => {
        await browser.close();
    });

    test('Navigate to Ingredient Query', async () => {
        await page.goto('https://localhost:44342/Stock/MealPlanner'); 
        await Promise.all([
            page.waitForNavigation(), 
            page.click('#ingredientQueryBtn'),
        ]);
        expect(page.url()).toContain('/Stock/IngredientQuery');
    });

    test('Navigate to Meal Query', async () => {
        await page.goto('https://localhost:44342/Stock/MealPlanner'); 
        await Promise.all([
            page.waitForNavigation(), 
            page.click('#mealQueryBtn'),
        ]);
        expect(page.url()).toContain('/Stock/MealQuery');
    });

    test('Low Stock Alert', async () => {
        await page.goto('https://localhost:44342/Stock/MealPlanner', { waitUntil: 'domcontentloaded' });
        const errorText = await page.evaluate(() => document.querySelector('#errorIngredients').innerText);
        console.log('Text found:', errorText);
        const expectedText = "The following ingredients have low stock. Bare this in mind when preparing meals.";
        expect(errorText).toBe(expectedText);
    });
});
