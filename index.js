const searchInput = document.getElementById("search");
const resultOutput = document.getElementById("search-results");
const searchButton = document.getElementById("search-button");
const wishListDisplay = document.getElementById("wishListMovies");
const resetButton = document.getElementById("reset-button");

// localStorage.clear()

let movies = [];
let moviesFromLocalStorage = JSON.parse(localStorage.getItem("movies"));

if (moviesFromLocalStorage && moviesFromLocalStorage.length > 0) {
    movies = moviesFromLocalStorage;
    renderMovies();
}

if (searchButton) {
    searchButton.addEventListener("click", getFilms);
}

async function getFilms(e) {
    e.preventDefault();
    
    const res = await fetch(`http://www.omdbapi.com/?i=tt3896198&apikey=90ef2952&t=${searchInput.value}&plot=full`);
    const data = await res.json();
    
    let movie = {
        id: data['imdbID'],
        content: `
            <div class="movie">
                <span class="id">${data['imdbID']}</span>
                <img class="poster" src="${data['Poster']}">
                <div class="movie-text">
                    <p class="title">${data['Title']}</p>
                    <p>Year: ${data['Year']}</p>
                    <p>Actors: ${data['Actors']}</p>
                    <p>${data['Runtime']}</p>
                    <p><img class="rating" src="star.png"> ${data['imdbRating']}</p>
                    <p>Genre: ${data['Genre']}</p>
                    <p>${data['Plot'].slice(0,500)}...</p>
                </div>
                <button class="button add" id="button-wishList">+</button> 
                <span id="add-button-text">Add to Watchlist</span>
                
            </div>
        `
    };

    movies.unshift(movie);
    localStorage.setItem("movies", JSON.stringify(movies));
    
    renderMovies();
    searchInput.value = "";
    location.reload(); 
}

function renderMovies() {
    if (resultOutput) {
        resultOutput.innerHTML = movies.map(movie => movie.content).join("");
    }
}

let moviesWishList = [];

let movieToAddFromLocalStorage = JSON.parse(localStorage.getItem("moviesWishList"));

if (movieToAddFromLocalStorage) {
    moviesWishList = movieToAddFromLocalStorage;
    renderMoviesWishList();
}

function renderMoviesWishList() {
    if (wishListDisplay) {
        wishListDisplay.innerHTML = moviesWishList.map(movie => {
            const tempDiv = document.createElement('div');
            tempDiv.innerHTML = movie;

            // Replace the wish list button with delete button
            const buttonWish = tempDiv.querySelector("#button-wishList");
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

    // Attempt to find the .movie element by moving up the DOM tree from the delete button
    const movieElement = e.target.previousElementSibling.innerHTML;
    console.log(movieElement)
    // Check if the .movie element was found
    // if (!movieElement) {
    //     console.error("Movie element not found. Please check the HTML structure.");
    //     return;
    // }

    // Get the innerHTML of the movie element
    const movieToDelete = movieElement.innerHTML;

    // Filter out the movie from the moviesWishList array
    moviesWishList = moviesWishList.filter(movie => movie !== movieToDelete);

    // Update localStorage with the modified wish list
    localStorage.setItem("moviesWishList", JSON.stringify(moviesWishList));

    console.log("Movie deleted from watch list");

    // Re-render the updated wish list
    renderMoviesWishList();
}




function addToWishList(e) {
    e.preventDefault();
    
    let movieToAdd = e.target.parentNode.innerHTML;

    moviesWishList.unshift(movieToAdd);
    localStorage.setItem("moviesWishList", JSON.stringify(moviesWishList));
    
    console.log("Movie added to wish list");
    
    renderMoviesWishList();
}

// Attach event listeners to the initial wish buttons if they exist
document.querySelectorAll("#button-wishList").forEach(button => {
    button.addEventListener("click", addToWishList);
});

if (resetButton) {
    resetButton.addEventListener("click", function(){
        alert("Your search results were cleared");
        window.localStorage.removeItem("movies");
        location.reload(); 
    });
}

document.addEventListener("click", function(e) {
    console.log(e.target)
})
console.log(moviesWishList)