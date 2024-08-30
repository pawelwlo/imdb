const searchInput = document.getElementById("search");
const resultOutput = document.getElementById("search-results");
const searchButton = document.getElementById("search-button");
const wishListDisplay = document.getElementById("wishListMovies")
const resetButton = document.getElementById("reset-button")

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
               
                <img class="poster" src="${data['Poster']}">
                <div class="movie-text">
                    <p class="title">${data['Title']}</p>
                    <p>Year: ${data['Year']}</p>
                    <p>Actors: ${data['Actors']}</p>
                    <p>${data['Runtime']}</p>
                    <p><img class="rating" src="star.png"> ${data['imdbRating']}</p>
                    <p>Genre: ${data['Genre']}</p>
                    <p>${data['Plot'].slice(0,500)}...</p>
                    <button class="button add" id="button-wishList">+</button> <span id="add-button-text">Add to Watchlist</span>
                    <button class="button delete" id="delete-button">-</button>
                </div>
                
               
               
            </div>
            
           
        `
        
    };

    
    console.log(movie)
    movies.unshift(movie);
    localStorage.setItem("movies", JSON.stringify(movies));
    
    renderMovies();
    searchInput.value = "";
    location.reload(); 
}

// console.log(moviesFromLocalStorage)

function renderMovies() {
     if(resultOutput) {
          resultOutput.innerHTML = movies.map(movie => movie.content).join("");
          
     }
   
}
// const buttonWish = document.getElementById("button-wishList");
// const deleteButton = document.getElementById("delete-button")
// let moviesWishList = []

// function addToWishList(e) {
//      e.preventDefault();
     
//      let movieToAdd = e.target.parentElement.innerHTML;
//      moviesWishList.unshift(movieToAdd);
//      localStorage.setItem("moviesWishList", JSON.stringify(moviesWishList));
//      console.log("movie added to wish list")
//      renderMoviesWishList();
     
//  }

//  if(buttonWish) {
//      buttonWish.addEventListener("click", addToWishList)
//  }


// let movieToAddFromLocalStorage = JSON.parse(localStorage.getItem("moviesWishList"));

// if (movieToAddFromLocalStorage) {
//      moviesWishList = movieToAddFromLocalStorage;
//      renderMoviesWishList()
// }



// if(buttonWish) {
//      buttonWish.addEventListener("click", function(e) {
//           e.preventDefault();
//           console.log("button wish clicked")
//           let movieToAdd = e.target.parentElement.innerHTML;
//           moviesWishList.unshift(movieToAdd);
//           localStorage.setItem("moviesWishList", JSON.stringify((moviesWishList) ))
//           alert("New movie was added to your watch list")
//          renderMoviesWishList()
        
         
          
         
//      })
// }

// if(deleteButton) {
//      deleteButton.addEventListener("click", function(e) {
//           e.preventDefault()
//           const movieToDelete = e.target.parentElement.innerHTML;
//           movieToAddFromLocalStorage.removeItem(movieToDelete)
//           renderMoviesWishList()
//           console.log("movie deleted from wishlist")
//      }

//      )
// }

// function renderMoviesWishList() {
//      if (wishListDisplay) {
//           wishListDisplay.innerHTML = moviesWishList;
//      }
     
// }

// document.addEventListener("click", function(e){
//      console.log(e.target)
// })




// localStorage.setItem("moviesWishList", JSON.stringify(moviesWishList));

if (resetButton) {
     resetButton.addEventListener("click", function(){
          alert("your search results were cleared")
          
          window.localStorage.removeItem("movies");
          location.reload(); 
     })
}

