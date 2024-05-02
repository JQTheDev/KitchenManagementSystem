const puppeteer = require('puppeteer');

describe('Home Page Navigation', () => {
    let browser;
    let page;

    beforeAll(async () => {
        browser = await puppeteer.launch({
             //headless: false, // Shows browser when testcases are being executed.
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

    test('Home Button Navigation from Meal Query Page', async () => {
        await page.goto('https://localhost:44342/Stock/MealQuery');
        const navigationPromise = page.waitForNavigation(); // Set up the promise before clicking
        await page.click('#homeButton');
        await navigationPromise;
        expect(page.url()).toBe('https://localhost:44342/Home');
    });

    test('Logout Button Navigates to Login Page', async () => {
        await page.goto('https://localhost:44342/home');
        const navigationPromise = page.waitForNavigation(); // Set up the promise before clicking
        await page.click('#logoutButton');
        await navigationPromise;
        expect(page.url()).toBe('https://localhost:44342/Login/Index');
    });
});
