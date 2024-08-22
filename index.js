const searchInput = document.getElementById("search");
const resultOutput = document.getElementById("search-results");
const searchButton = document.getElementById("search-button");
const wishListDisplay = document.getElementById("wishListMovies")
const resetButton = document.getElementById("reset-button")

// localStorage.clear()

if (resetButton) {
     resetButton.addEventListener("click", function(){
          alert("your search results were cleared")
          
          window.localStorage.removeItem("movies");
          location.reload(); 
     })
}



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
               
                <img class="poster" src="${data['Poster']}">
                <div class="movie-text">
                    <p>Title: ${data['Title']}</p>
                    <p>Year: ${data['Year']}</p>
                    <p>Actors: ${data['Actors']}</p>
                    <p>${data['Runtime']}</p>
                    <p><img class="rating" src="star.png"> ${data['imdbRating']}</p>
                    <p>Genre: ${data['Genre']}</p>
                    <p>${data['Plot'].slice(0,500)}...</p>
                    
                </div>
                
               
               
            </div>
            <button id="button-wishList">+</button> <a id="add-button-text">Add to Watchlist</a>
           
            <hr>
        `
    };

//     document.addEventListener("click", function(e) {
//      if (e.target && e.target.classList.contains("button-wishList")) {
//          addToWishList(e);
         
//      }
//  });
    movies.unshift(movie);
    localStorage.setItem("movies", JSON.stringify(movies));
    renderMovies();
    searchInput.value = "";
    location.reload(); 
}



function renderMovies() {
     if(resultOutput) {
          resultOutput.innerHTML = movies.map(movie => movie.content).join("");
          
     }
   
}

let buttonWish = document.getElementById("button-wishList");
let moviesWishList = []


let movieToAddFromLocalStorage = JSON.parse(localStorage.getItem("moviesWishList"));

if (movieToAddFromLocalStorage) {
     moviesWishList = movieToAddFromLocalStorage;
     renderMoviesWishList()
}

// function addToWishList(e) {
//      e.preventDefault();
//      let movieElement = e.target.closest('.movie');
//      let movieToAdd = movieElement.outerHTML;
//      moviesWishList.unshift(movieToAdd);
//      localStorage.setItem("moviesWishList", JSON.stringify(moviesWishList));
//      renderMoviesWishList();
     
//  }

if(buttonWish) {
     buttonWish.addEventListener("click", function(e) {
          e.preventDefault();
          console.log(e)
          let movieToAdd = e.target.parentElement.innerHTML;
          moviesWishList.unshift(movieToAdd);
          localStorage.setItem("moviesWishList", JSON.stringify((moviesWishList) ))
          alert("New movie was added to your watch list")
         renderMoviesWishList()
         
         
          
         
     })
}



function renderMoviesWishList() {
     if (wishListDisplay) {
          wishListDisplay.innerHTML = moviesWishList;
     }
     
}

document.addEventListener("click", function(e){
     console.log(e.target)
})

const removeString = '<button id="button-wishList">+</button> <a id="add-button-text">Add to Watchlist</a>';
let newWishList = moviesWishList.map(item=> item.replace(removeString, ''))

moviesWishList = newWishList;
localStorage.setItem("moviesWishList", JSON.stringify(moviesWishList));

console.log(newWishList)