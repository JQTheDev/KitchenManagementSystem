document.addEventListener('DOMContentLoaded', function () {
    fetchMeals();
    setupModalTrigger();
});

function fetchMeals() {
    const endpoint = "https://localhost:44342/api/Meals";
    fetch(endpoint)
        .then(response => response.json())
        .then(data => {
            console.log(data)
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

    // Toggle visibility of the meal quantity result
    const mealQuantityResult = document.getElementById('mealQuantityResult');
    if (mealQuantityResult.style.display === 'none' || mealQuantityResult.style.display === '') {
        try {
            const mealIngredientsResponse = await fetch(`https://localhost:44342/api/MealIngredients/ByMeal/${mealId}`);
            if (!mealIngredientsResponse.ok) throw new Error('Failed to fetch meal ingredients');
            const mealIngredients = await mealIngredientsResponse.json();

            const ingredientStockPromises = mealIngredients.map(ing =>
                fetch(`https://localhost:44342/api/Ingredients/${ing.ingredientId}`).then(res => res.json())
            );

            const ingredientsStock = await Promise.all(ingredientStockPromises);

            const mealsCount = mealIngredients.reduce((minMeals, ingredient) => {
                const ingredientStock = ingredientsStock.find(stock => stock.ingredientId === ingredient.ingredientId);
                const maxMealsFromIngredient = Math.floor(ingredientStock.quantity / ingredient.quantity);
                return Math.min(minMeals, maxMealsFromIngredient);
            }, Infinity);

            mealQuantityResult.textContent = `You can make ${mealsCount} complete meals with the current stock.`;
            mealQuantityResult.style.display = 'block';
        } catch (error) {
            console.error('Error:', error);
            alert('An error occurred while calculating the possible meal quantity.');
        }
    } else {
        mealQuantityResult.style.display = 'none';
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

document.getElementById('checkIngredientsBtn').addEventListener('click', async function () {
    const mealId = document.getElementById('mealList').value;
    if (!mealId) {
        alert('Please select a meal to check ingredients.');
        return;
    }

    const ingredientsInfo = document.getElementById('ingredientsInfo');
    if (ingredientsInfo.style.display === 'none' || ingredientsInfo.style.display === '') {
        try {
            const mealIngredientsResponse = await fetch(`https://localhost:44342/api/MealIngredients/ByMeal/${mealId}`);
            if (!mealIngredientsResponse.ok) throw new Error('Failed to fetch meal ingredients');
            const mealIngredients = await mealIngredientsResponse.json();

            let ingredientsInfoHtml = '<div class="ingredient-info-panel">';
            for (const mealIngredient of mealIngredients) {
                const ingredientResponse = await fetch(`https://localhost:44342/api/Ingredients/${mealIngredient.ingredientId}`);
                if (!ingredientResponse.ok) throw new Error('Failed to fetch ingredient details');
                const ingredient = await ingredientResponse.json();

                ingredientsInfoHtml += `
                    <p><span class="ingredient-info">Ingredient:</span> ${ingredient.name}, <span class="ingredient-info">Required Quantity:</span> ${mealIngredient.quantity}, <span class="ingredient-info">Available Quantity:</span> ${ingredient.quantity}</p>
                `;
            }
            ingredientsInfoHtml += '</div>';
            ingredientsInfo.innerHTML = ingredientsInfoHtml;
            ingredientsInfo.style.display = 'block';
        } catch (error) {
            console.error('Error:', error);
            alert('An error occurred while fetching ingredients information.');
        }
    } else {
        ingredientsInfo.style.display = 'none';
    }
});


document.getElementById('ingredientQueryBtn').addEventListener('click', function () {
    window.location.href = '/Stock/IngredientQuery'; 
});

document.getElementById('addMealBtn').addEventListener('click', function () {
    window.location.href = '/Stock/AddMeal'; 
});

document.getElementById('deleteBtn').addEventListener('click', deleteMeal);