const searchInput = document.getElementById("search");
const resultOutput = document.getElementById("search-results");
const searchButton = document.getElementById("search-button");

// localStorage.clear()

let movies = [];
let moviesFromLocalStorage = JSON.parse(localStorage.getItem("movies"));

if (moviesFromLocalStorage && moviesFromLocalStorage.length > 0) {
    movies = moviesFromLocalStorage;
    renderMovies();
}

searchButton.addEventListener("click", getFilms);

async function getFilms(e) {
    e.preventDefault();
    
    const res = await fetch(`http://www.omdbapi.com/?i=tt3896198&apikey=90ef2952&t=${searchInput.value}&plot=full`);
    const data = await res.json();
    
    let movie = {
        id: data['imdbID'],
        content: `
            <div class="movie">
                <img class="poster" src="${data['Poster']}">
                <div class="movie-text">
                    <p>Title: ${data['Title']}</p>
                    <p>Year: ${data['Year']}</p>
                    <p>Actors: ${data['Actors']}</p>
                    <p>${data['Runtime']}</p>
                    <p><img class="rating" src="star.png"> ${data['imdbRating']}</p>
                    <p>Genre: ${data['Genre']}</p>
                    <p>${data['Plot'].slice(0,500)}...</p>
                    <button id="button-wishList">+</button> <a>Watch list</a>
                </div>
            </div>
            <hr>
        `
    };

    movies.unshift(movie);
    localStorage.setItem("movies", JSON.stringify(movies));
    renderMovies();
    searchInput.value = "";
}

function renderMovies() {
    resultOutput.innerHTML = movies.map(movie => movie.content).join("");
}

console.log(moviesFromLocalStorage);
