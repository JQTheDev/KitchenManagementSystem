document.addEventListener('DOMContentLoaded', function () {
    fetchIngredients();
});

function fetchIngredients() {
    const endpoint = "https://localhost:44342/api/Ingredients"
    fetch(endpoint)
        .then(response => response.json())
        .then(data => {
            console.log(data);
            populateIngredients(data);
        })
        .catch(error => {
            console.error('Error fetching ingredients:', error);
        });
}

function populateIngredients(ingredients) {
    const selectElement = document.getElementById('ingredientList');

    ingredients.forEach(ingredient => {
        const option = document.createElement('option');
        option.value = ingredient.ingredientId;
        option.textContent = ingredient.name;
        selectElement.appendChild(option);
    });
}

//// Add event listener for your query button if needed
//document.getElementById('queryButton').addEventListener('click', function () {
//    // Logic to navigate to the ingredient query page or perform an action
//    window.location.href = 'path/to/your/ingredient-query-page.html';
//});