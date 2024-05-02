const puppeteer = require('puppeteer');

describe('Meal Planner Recommendation Test', () => {
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

    test('Verify Meal Recommendations', async () => {
        await page.goto('https://localhost:44342/Stock/MealPlanner');
        const mealIds = ["13", "18", "11", "9"]; // IDs of the meals

        for (const mealId of mealIds) {
            await page.waitForSelector('#mealSelect');
            await page.select('#mealSelect', mealId); 
            await page.click('#addMealBtn'); 
        }

        await page.type('#mouthsToFeed', '50');
        await page.type('#donationMoney', '100');
        await page.click('#calculateBtn');

        await Promise.all([
            page.waitForResponse(response => response.url().includes('api/Meals/SelectMeals') && response.status() === 200),
            page.click('#calculateBtn'),
        ]);

        const recommendedMeals = await page.evaluate(() => {
            const rows = Array.from(document.querySelectorAll('#mealResultsTable tbody tr'));
            return rows.map(row => {
                return {
                    name: row.cells[0].textContent.trim(),
                    healthStatus: row.cells[1].textContent.trim(),
                    pricePerMeal: row.cells[2].textContent.trim(),
                    totalPrice: row.cells[3].textContent.trim(),
                };
            });
        });

        const expectedResults = [
            { name: "Grilled Chicken with Broccoli", healthStatus: "Neither", pricePerMeal: "$1.02", totalPrice: "$51.25" },
            { name: "Chicken Fried Rice", healthStatus: "Neither", pricePerMeal: "$0.68", totalPrice: "$33.75" },
            { name: "Avocado Toast with Poached Egg", healthStatus: "Healthy", pricePerMeal: "$0.64", totalPrice: "$31.88" }
        ];

        expectedResults.forEach((expected, index) => {
            expect(recommendedMeals[index].name).toBe(expected.name);
            expect(recommendedMeals[index].healthStatus).toBe(expected.healthStatus);
            expect(recommendedMeals[index].pricePerMeal).toBe(expected.pricePerMeal);
            expect(recommendedMeals[index].totalPrice).toBe(expected.totalPrice);
        });
        expect(recommendedMeals.length).toBe(expectedResults.length);
    });
});
