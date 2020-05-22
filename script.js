
var page = document.getElementById("content");
checkIfLoggedIn();

var showMovies = document.getElementById("movieButton");

showMovies.addEventListener("click", function () {

    printMovieList();

})

var addNewMovie = document.getElementById("addMovie");

addNewMovie.addEventListener("click", function () {
    insertDataNewMovie();
})

var returnMovieButton = document.getElementById("returnMovie");

returnMovieButton.addEventListener("click", function () {
    page.insertAdjacentHTML("afterend", 'MovieId: <input type="text" id="movieToReturn"><button id="returnRentedMovie">Return Movie</button>')
    
    var returnButton = document.getElementById("returnRentedMovie");

    returnButton.addEventListener("click", function(){
        var movieToReturn = document.getElementById("movieToReturn").value;

    fetch("https://localhost:44361/api/rentedfilm")
    .then(response => response.json())
    .catch(error => alert(error.message))
    .then(json => deleteReturnedMovie(movieToReturn));
    });

});

function deleteReturnedMovie(id) {
    console.log(id);
    fetch('https://localhost:44361/api/rentedfilm/' + id, {
        method: 'DELETE',
    })
        .then(response => response.json())
        .catch(error => console.log(error.message));
        alert("movie has been returned!");
};


function AddMovie(name, stock) {
    var actualStock = stock;
    var stringName = name.toString();
    var intStock = parseInt(actualStock);


    fetch('https://localhost:44361/api/film', {
        method: 'POST',
        headers: {
            'Content-type': 'application/json',
        },
        body: JSON.stringify({ stock: intStock, name: stringName }),
    })
        .then(response => response.json())
        .then(data => {
            console.log('Success:', data);
            alert("Movie was successfully added!");
        })
        .catch((error) => {
            console.log('Error:', error);
            alert("Could not perform the requested action");
        });
}

function checkIfLoggedIn() {

    if (localStorage.UserName != null) {
        greetUser();

    }
    else {
        showLoginPage();

    }
}



function printMovieList() {

    fetch("https://localhost:44361/api/Film")
        .then(function (response) {
            return response.json();
        })
        .then(function (json) {
            console.log("printMovieList", json);

            for (i = 0; i < json.length; i++) {
                console.log(json[i].name)
                movieList.insertAdjacentHTML("beforeend", "<div class='movieDiv'> + <p> Title: " + json[i].name + " | Stock: " + json[i].stock + " </p><button class='button' id='addTrivia1' onclick='addTrivia(" + json[i].id + ");' >Add new trivia</button> <button class='button' id='showTrivia' onclick='printTrivia(" + json[i].id + ");' >Print Trivia</button></div>");
            }

            
    
    page.insertAdjacentHTML("afterend", 'MovieId: <input type="text" id="movieId"><button id="rentMovie">Rent Movie</button>')

            var rentMovieButton = document.getElementById("rentMovie");

            rentMovieButton.addEventListener("click", function () {
                
                var id = document.getElementById("movieId").value;
    
            fetch("https://localhost:44361/api/film")
                .then(response => response.json())
                .catch(error => alert(error.message))
                .then(json => rentMovie(json, id));
    
        })
        });

        

                
};


function rentMovie(json, movieToRentId) {


    var lentMovie = json.find(x => x.id == movieToRentId)

    console.log(lentMovie);
    if (lentMovie.id == movieToRentId) {
        if (lentMovie.stock == 0) {

            console.log(foo);
            lentMovie.stock = foo.stock

            alert("No movies available, try later...");
        }
        else {
            lentMovie.stock--;

            addMovieAsRented(lentMovie.id);
        }
    }
}


function addMovieAsRented(movieId, filmStudioId) {
    var data = { filmId: movieId, studioId: filmStudioId };

    localStorage.userId = filmStudioId;

    fetch('https://localhost:44361/api/rentedfilm', {
        method: 'POST',
        headers: {
            'Content-type': 'application/json',
        },
        body: JSON.stringify(data),
    })
        .then(response => response.json())
        .then(data => {
            console.log('Success:', data);
            alert("Movie was successfully rented!");

        })
        .catch((error) => {
            console.log('Error:', error);
            alert("Could not perform the requested action");
        });

}



async function Login() {
    let user, password = "";
    userName = document.getElementById("username").value;
    pw = document.getElementById("pw").value

    try {
        const response = await fetch("https://localhost:44361/api/filmstudio");
        const data = await response.json();

        data.forEach(user => {
            if (user.password == pw && user.name == userName) {
                localStorage.UserName = user.name;
                localStorage.UserId = user.id;
            }
        });
        if (localStorage.UserName == null) {
            alert("Incorrect login")
        }
    } catch (error) {
        console.log(error);
    }
    location.reload();
    checkIfLoggedIn();
}



function insertDataNewMovie() {
    page.innerHTML = "";
    page.insertAdjacentHTML("afterend", 'Name: <input type="text" id="movieName"> Stock: <input type="text" id="stock"> <button id="postNewMovie">Add Movie</button> ')

    var addNewMovie = document.getElementById("postNewMovie");
    addNewMovie.addEventListener("click", function () {
        name = document.getElementById("movieName").value;
        stock = document.getElementById("stock").value
        AddMovie(name, stock);
    })
}




function printTrivia(Name)
{
    fetch("https://localhost:44361/api/filmtrivia")
        .then(function (response) {
            return response.json();
        })
        .then(function (json) {
            console.log("showTrivia", json);
            
            for (i = 0; i < json.length; i++) {
                console.log(json[i].trivia);
                console.log(json[i].filmId);
                movieList.insertAdjacentHTML("afterend", "<div class = showTrivia ><p>(" + json[i].filmId + ")" + json[i].trivia + "</p></div></div>")
            }
        });
}


function sendTrivia(FilmId, Trivia) {

    var trivia = Trivia.toString();
    var id = FilmId;

    var movieId = parseInt(id);

    fetch('https://localhost:44361/api/FilmTrivia', {
        method: 'POST',
        headers: {
            'Content-type': 'application/json',
        },
        body: JSON.stringify({ FilmId: movieId, Trivia: trivia }),
    })
        .then(response => response.json())
        .then(data => {
            console.log('Success:', data);
            alert("Trivia was successfully added");
        })
        .catch((error) => {
            console.log('Error:', error);
            alert("Could not perform the requested action");
        });
};


function addTrivia() {
    page.innerHTML = "";
    page.insertAdjacentHTML("afterbegin", 'Name: <input type="text" id="trivia"> MovieID: <input type="text" id="movieId"> <button id="submitTrivia">Submit Trivia</button> ')
    page.insertAdjacentHTML("beforeend", '<button id="WelcomepageId">Gå till Welcome Page</button>')

    var triviaButton = document.getElementById("submitTrivia");

    triviaButton.addEventListener("click", function () {
        id = document.getElementById("movieId").value;
        trivia = document.getElementById("trivia").value;
        sendTrivia(id, trivia);
    })
}


function showRegisterNewFilmstudio() {
    page.innerHTML = "";
    page.insertAdjacentHTML("afterbegin", 'Användarnamn: <input type="text" id="FilmstudioNamnId"> Lösenord: <input type="password" id="FilmstudioPasswordId"> <button id="SaveFilmstudioId">Save User</button> ')
    page.insertAdjacentHTML("beforeend", '<button id="WelcomepageId">Gå till Welcome Page</button>')

    var welcomePageButton = document.getElementById("WelcomepageId");

    welcomePageButton.addEventListener("click", function () {

        greetUser();

    })

    var RegistreraKnapp = document.getElementById("SaveFilmstudioId");

    RegistreraKnapp.addEventListener("click", function () {

        var usernameForNewMoviestudio = document.getElementById("FilmstudioNamnId").value;
        var pwForNewMoviestudio = document.getElementById("FilmstudioPasswordId").value;

        addMovieStudio(usernameForNewMoviestudio, pwForNewMoviestudio);

    })
}

function addMovieStudio(name, password) {

    var data = { name: name, password: password };
    location.reload();
    fetch('https://localhost:44361/api/FilmStudio', {
        method: 'POST',
        headers: {
            'Content-type': 'application/json',
        },
        body: JSON.stringify(data),
    })
        .then(response => response.json())
        .then(data => {
            alert("User successfully added!");
            console.log('Success:', data);

        })
        .catch((error) => {
            console.log('Error:', error);
            alert("Could not perform the requested action");
        });
};

function showLoginPage() {
    const loginDiv = document.getElementById("login");

    var signUpButton = document.getElementById("signUp");

    signUpButton.addEventListener("click", function () {

        showRegisterNewFilmstudio();

    })


    loginDiv.innerHTML =
        '<div class="login-container">' +
        '<div id="modal-register" class="modal">' +
        '<div class="modal-content">' +
        '<div class="modal-header">' +
        '<span class="close">&times;</span>' +
        `<h2>Register account</h2>` +
        '</div>' +
        '<div id="modal-body-register" class="modal-body">' +
        '</div>' +
        '</div>' +
        '</div>' +
        '<input type="text" placeholder="Username" id="username">' +
        '<input type="password" placeholder="Password" id="pw">' +
        '<button type="submit" onclick="Login()">Login</button>' +
        '</div>';
}

function greetUser() {
    const loginDiv = document.getElementById("login");
    userName = localStorage.UserName;
    loginDiv.innerHTML = '<div class="login-container" id="logOut">' +
        '<button type="submit" onclick="Logout()">Logout</button>' +
        `<p>Hello ${userName}</p>` +
        '</div>';
}

async function Logout() {
    localStorage.clear();
    location.reload();
    showLoginPage();
}







