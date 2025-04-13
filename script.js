const searchBox = document.querySelector('#search-input');
const searchBtn = document.querySelector('#searchBtn');
const recipeContainer = document.querySelector('.recipes-container');
const loading = document.getElementById('loading');
const hero=document.querySelector('.hero');

const modal = document.getElementById('recipe-modal');
const closeBtn = document.querySelector('.close-btn');
const modalTitle = document.getElementById('modal-title');
const modalImg = document.getElementById('modal-img');
const modalCategory = document.getElementById('modal-category');
const modalArea = document.getElementById('modal-area');
const modalInstructions = document.getElementById('modal-instructions');
const modalIngredients = document.getElementById('modal-ingredients');


// Fetch recipes from API
const fetchRecipes = async (query) => {
    recipeContainer.style.display="grid";
    console.log("Fetching recipes for:", query); // Debugging
    loading.style.display = 'block'; // Show loading text

    try {
        const response = await fetch(`https://www.themealdb.com/api/json/v1/1/search.php?s=${query}`);
        const data = await response.json();

        console.log("Fetched data:", data); // Debugging
        const meals = data.meals;
        recipeContainer.innerHTML = ''; // Clear previous recipes

        if (meals) {
            meals.forEach(meal => {
                const recipeCard = document.createElement('div');
                recipeCard.classList.add('recipe-card');
                recipeCard.setAttribute('data-recipe-id', meal.idMeal);

                // Recipe Image
                const recipeImage = document.createElement('img');
                recipeImage.classList.add('recipe-img');
                recipeImage.src = meal.strMealThumb;
                recipeCard.appendChild(recipeImage);

                // Recipe Title
                const recipeTitle = document.createElement('h3');
                recipeTitle.classList.add('recipe-title');
                recipeTitle.textContent = meal.strMeal;
                recipeCard.appendChild(recipeTitle);

                // Recipe Category
                const recipeCategory = document.createElement('p');
                recipeCategory.classList.add('recipe-category');
                recipeCategory.textContent = meal.strCategory;
                recipeCard.appendChild(recipeCategory);

                // Recipe Area
                const recipeArea = document.createElement('p');
                recipeArea.classList.add('recipe-area');
                recipeArea.textContent = meal.strArea;
                recipeCard.appendChild(recipeArea);

                // Append the card to the container
                recipeContainer.appendChild(recipeCard);
                recipeCard.addEventListener('click', () => showModal(meal));
                
            });
        } else {
            recipeContainer.innerHTML = '<p>No recipes found.</p>';
        }
    } catch (error) {
        console.error('Error fetching recipes:', error);
        recipeContainer.innerHTML = '<p>There was an error fetching the recipes.</p>';
    } finally {
        loading.style.display = 'none'; // Hide loading text
    }
};

const showModal = (meal) => {
    modalTitle.textContent = meal.strMeal;
    modalImg.src = meal.strMealThumb;
    modalCategory.textContent = meal.strCategory;
    modalArea.textContent = meal.strArea;
    modalInstructions.textContent = meal.strInstructions;

    modalIngredients.innerHTML = ''; // Clear previous ingredients
    for (let i = 1; i <= 20; i++) {
        const ingredient = meal[`strIngredient${i}`];
        const measure = meal[`strMeasure${i}`];

        if (ingredient && ingredient.trim() !== '') {
            const li = document.createElement('li');
            li.textContent = `${measure} ${ingredient}`;
            modalIngredients.appendChild(li);
        }
    }

    modal.style.display = 'block';
};
closeBtn.addEventListener('click', () => {
    modal.style.display = 'none';
});
// Handle search button click
searchBtn.addEventListener('click', () => {
    const query = searchBox.value.trim();
    console.log("Search button clicked, input value:", query); // Debugging
    if (query) {
        hero.style.display="none"
        fetchRecipes(query);
    } else {
        console.log("Empty query, no fetch."); // Debugging
    }
});

// Handle pressing Enter to search
searchBox.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
        const query = searchBox.value.trim();
        console.log("Enter key pressed, input value:", query); // Debugging
        if (query) {
            fetchRecipes(query);
        }
    }
});
