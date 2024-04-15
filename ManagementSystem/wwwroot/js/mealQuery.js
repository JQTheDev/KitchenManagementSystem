document.addEventListener('DOMContentLoaded', function () {
    fetchMeals();
    setupModalTrigger();
});

function fetchMeals() {
    const endpoint = "https://localhost:44342/api/Meals";
    fetch(endpoint)
        .then(response => response.json())
        .then(data => {
            populateMeals(data);
        })
        .catch(error => {
            console.error('Error fetching meals:', error);
        });
}

function populateMeals(meals) {
    const selectElement = document.getElementById('mealList');
    meals.sort((a, b) => a.name.localeCompare(b.name)); // Sort alphabetically by default

    meals.forEach(meal => {
        const option = document.createElement('option');
        option.value = meal.mealId;
        option.textContent = meal.name;
        selectElement.appendChild(option);
    });
}

function setupModalTrigger() {
    // Setting up Pop up tab
    var btn = document.getElementById('addIngredientBtn');
    var modal = document.getElementById('ingredientModal');
    var span = document.getElementsByClassName('close-button')[0];

    // When the user clicks the button, open the modal 
    btn.onclick = function () {
        modal.style.display = "block";
        document.getElementById('name').value = '';
        document.getElementById('calories').value = '';
        document.getElementById('salt').value = '';
        document.getElementById('fat').value = '';
    };

    // When the user clicks on xxx, close the modal
    span.onclick = function () {
        modal.style.display = "none";
        document.getElementById('ingredientId').value = '';
        document.getElementById('name').value = '';
        document.getElementById('calories').value = '';
        document.getElementById('salt').value = '';
        document.getElementById('fat').value = '';
    };

    window.onclick = function (event) {
        if (event.target == modal) {
            modal.style.display = "none";
        }
    };
}
document.getElementById('checkQuantityBtn').addEventListener('click', async function () {
    const mealId = document.getElementById('mealList').value;
    if (!mealId) {
        alert('Please select a meal to check its quantity.');
        return;
    }

    try {
        // Fetch the ingredients needed for the selected meal
        const mealIngredientsResponse = await fetch(`https://localhost:44342/api/MealIngredients/ByMeal/${mealId}`);

        if (!mealIngredientsResponse.ok) throw new Error('Failed to fetch meal ingredients');
        const mealIngredients = await mealIngredientsResponse.json();

        // Map to fetch all ingredients current stock
        const ingredientStockPromises = mealIngredients.map(ing =>
            fetch(`https://localhost:44342/api/Ingredients/${ing.ingredientId}`).then(res => res.json())
        );

        // Resolve all fetches concurrently
        const ingredientsStock = await Promise.all(ingredientStockPromises);

        // Calculate the minimum number of complete meals that can be made
        const mealsCount = mealIngredients.reduce((minMeals, ingredient) => {
            const ingredientStock = ingredientsStock.find(stock => stock.ingredientId === ingredient.ingredientId);
            const maxMealsFromIngredient = Math.floor(ingredientStock.quantity / ingredient.quantity);
            return Math.min(minMeals, maxMealsFromIngredient);
        }, Infinity);

        // Display result
        const resultText = `You can make ${mealsCount} complete meals with the current stock.`;
        document.getElementById('mealQuantityResult').textContent = resultText;

    } catch (error) {
        console.error('Error:', error);
        alert('An error occurred while calculating the possible meal quantity.');
    }
});

function deleteMeal() {
    const selectElement = document.getElementById('mealList');
    const mealId = selectElement.value;

    if (!mealId) {
        alert('Please select a meal to delete.');
        return;
    }

    const endpoint = `https://localhost:44342/api/Meals/${mealId}`;

    fetch(endpoint, {
        method: 'DELETE'
    })
        .then(response => {
            if (!response.ok) {
                throw new Error('Error in deleting meal.');
            }
            alert('Meal deletion successful.');
            window.location.reload();
        })
        .catch(error => {
            console.error('Error:', error);
            alert('An error occurred while deleting the meal.');
        });
}

document.getElementById('ingredientQueryBtn').addEventListener('click', function () {
    window.location.href = '/Stock/IngredientQuery'; 
});

document.getElementById('addMealBtn').addEventListener('click', function () {
    window.location.href = '/Stock/AddMeal'; 
});

document.getElementById('deleteBtn').addEventListener('click', deleteMeal);