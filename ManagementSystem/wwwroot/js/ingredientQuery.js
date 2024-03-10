document.addEventListener('DOMContentLoaded', function () {
    fetchIngredients();
    setupModalTrigger();
});

function setupModalTrigger() {
    // Setting up Pop up tab
    var btn = document.getElementById('addIngredientBtn');
    var modal = document.getElementById('ingredientModal');
    var span = document.getElementsByClassName('close-button')[0];

    // When the user clicks the button, open the modal 
    btn.onclick = function () {
        modal.style.display = "block";
    };

    // When the user clicks on <span> (x), close the modal
    span.onclick = function () {
        modal.style.display = "none";
    };

    // Close the modal if the user clicks outside of it
    window.onclick = function (event) {
        if (event.target == modal) {
            modal.style.display = "none";
        }
    };
}

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
