const searchInput = document.getElementById("search");
const resultOutput = document.getElementById("search-results");
const searchButton = document.getElementById("search-button");
const wishListDisplay = document.getElementById("wishListMovies");
const resetButton = document.getElementById("reset-button");

let movies = [];
let movie = "";
let moviesWishList = [];
let moviesFromLocalStorage = JSON.parse(localStorage.getItem("movies"));
let movieToAddFromLocalStorage = JSON.parse(localStorage.getItem("moviesWishList"));

if (moviesFromLocalStorage && moviesFromLocalStorage.length > 0) {
    movies = moviesFromLocalStorage;
    renderMovies();
}

if (movieToAddFromLocalStorage) {
    moviesWishList = movieToAddFromLocalStorage;
    renderMoviesWishList();
}

if (searchButton) {
    searchButton.addEventListener("click", getFilms);
}

async function getFilms(e) {
    e.preventDefault();
    
    const res = await fetch(`https://www.omdbapi.com/?i=tt3896198&apikey=90ef2952&t=${searchInput.value}&plot=full`);
    const data = await res.json();
    let buttonId = data['imdbID'];
    movie = {
        id: data['imdbID'],
        content: `
            <div class="movie">
                <img class="poster" src="${data['Poster']}">
                <div class="movie-text">
                    <span class="id">${data['imdbID']}</span>
                    <p class="title">${data['Title']}</p>
                    <p>Year: ${data['Year']}</p>
                    <p>Actors: ${data['Actors']}</p>
                    <p>${data['Runtime']}</p>
                    <p><img class="rating" src="star.png"> ${data['imdbRating']}</p>
                    <p>Genre: ${data['Genre']}</p>
                    <p>${data['Plot'].slice(0, 500)}...</p>
                    
                </div>
                
                <button class="button add" id="add-${buttonId}">+</button> 
                <span id="add-button-text">Add to Watchlist</span>
            </div>
        `
    };

    movies.unshift(movie);
    localStorage.setItem("movies", JSON.stringify(movies));
    
    renderMovies();
    attachAddToWishListListeners(); // Attach the listeners to new buttons
    searchInput.value = "";
}

function renderMovies() {
    if (resultOutput) {
        resultOutput.innerHTML = movies.map(movie => movie.content).join("");
    }
}

// Attach event listeners to add buttons for the rendered movies
function attachAddToWishListListeners() {
    document.querySelectorAll(".button.add").forEach(button => {
        button.addEventListener("click", addToWishList);
    });
}

function addToWishList(e) {
    e.preventDefault();

    const movieElement = e.target.closest(".movie");
    const movieId = movieElement.querySelector(".id").textContent;

    // Find the movie by ID
    const movieToAdd = movies.find(m => m.id === movieId);

    if (movieToAdd && !moviesWishList.some(m => m.id === movieId)) {
        moviesWishList.unshift(movieToAdd.content);
        localStorage.setItem("moviesWishList", JSON.stringify(moviesWishList));
        console.log("Movie added to wish list");
        renderMoviesWishList();
    }
}

function renderMoviesWishList() {
    if (wishListDisplay) {
        wishListDisplay.innerHTML = moviesWishList.map(movie => {
            const tempDiv = document.createElement('div');
            tempDiv.innerHTML = movie;

            // Replace the wish list button with delete button
            const buttonWish = tempDiv.querySelector(".button.add");
            const wishText = tempDiv.querySelector('#add-button-text');

            if (buttonWish) {
                buttonWish.outerHTML = `<button class="button delete" id="delete-button">-</button>`;
            }

            if (wishText) {
                wishText.outerHTML = `<span id="delete-button-text">Remove from Watchlist</span>`;
            }

            return tempDiv.innerHTML;
        }).join("");

        // Attach event listeners to the delete buttons
        document.querySelectorAll("#delete-button").forEach(button => {
            button.addEventListener("click", deleteFromWishList);
        });
    }
}

function deleteFromWishList(e) {
    e.preventDefault();

    const movieElement = e.target.closest(".movie");
    const movieId = movieElement.querySelector(".id").textContent;

   
    moviesWishList = moviesWishList.filter(movie => !movie.includes(movieId));

    localStorage.setItem("moviesWishList", JSON.stringify(moviesWishList));
    console.log("Movie deleted from watch list");
    renderMoviesWishList();
}


if (resetButton) {
    resetButton.addEventListener("click", function(){
        alert("Your search results were cleared");
        localStorage.removeItem("movies");
        location.reload();
    });
}

