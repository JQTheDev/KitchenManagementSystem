const puppeteer = require('puppeteer');

describe('Home Page Navigation', () => {
    let browser;
    let page;

    beforeAll(async () => {
        browser = await puppeteer.launch({
            // headless: false, // Shows browser when testcases are being executed.
            //slowMo: 100
        });
        page = await browser.newPage();
    });

    afterAll(async () => {
        await browser.close();
    });

    test('Navigate to Meal Planner', async () => {
        await page.goto('https://localhost:44342/home');
        await page.click('#mealPlannerBtn');
        await page.waitForSelector('#addMealBtn');
        expect(page.url()).toContain('/Stock/MealPlanner');
    });

    test('Navigate to Meal Query', async () => {
        await page.goto('https://localhost:44342/home');
        await page.click('#mealQueryBtn');
        await page.waitForSelector('#addMealBtn');
        expect(page.url()).toContain('/Stock/MealQuery');
    });

    test('Navigate to Ingredient Query', async () => {
        await page.goto('https://localhost:44342/home'); 
        await page.click('#ingredientQueryBtn');
        await page.waitForSelector('#mealQueryBtn'); 
        expect(page.url()).toContain('/Stock/IngredientQuery');
    });
});
