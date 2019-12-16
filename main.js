$(document).ready( function () {

    $('#searchButton').click(function() {
        //Empty the list by returning the empty div films
        $('#films').empty();
        //create a variable to which I assign the value coming from the searchBar
        var query = $('#searchBar').val();
        //Set a variable for api base to easy future updates
        var apiBase = 'https://api.themoviedb.org/3/search/movie/';

        //AJAX call
        $.ajax({
            url: apiBase,
            method:'GET',
            data:{
                api_key: '80ffe5b2b9aa99cf4d91d9de1be5363d',
                query:query
            },
            success:function (response) {
                console.log(response);
                //Variable that contains tha array of films
                var films = response.results;
                if (films.length === 0) {
                    var emptyList = 'NO RESULT!'
                    $('#films').append(`<h1 id="noResult">${emptyList}</h1>`);
                    return;
                }
                for (var i = 0; i < films.length; i++) {
                    var filmItem = i+1;
                    var title = films[i].title;
                    var originalTitle = films[i].original_title;
                    var language = films[i].original_language;
                    var vote = films[i].vote_average;
                    var stars = vote/2 //Math.round(vote/2);
                    console.log(stars);
                    var giudice = function() {
                        var html = '';
                        for (var i = 0; i < 5.0; i++) {
                            if (i<stars) {
                                if (i+0.5 < stars) {
                                    html+='<i class="fas fa-star"></i>';
                                } else {

                                    html+='<i class="fas fa-star-half-alt"></i>';
                                }

                            } else {
                                html+='<i class="far fa-star"></i>';                                }
                        }
                        return html;
                    };
                    $('#films').append(`<li>Film nr° ${filmItem}<ul>
                        <li>Titolo: ${title}</li>
                        <li>Titolo originale: ${originalTitle}</li>
                        <li>Lingua: ${language}</li>
                        <li>Giudizio: ${giudice()}</li>
                        </ul></li><br>`);
                    console.log(films[i].title);
                }


            },
            error:function(err) {
                console.log(err);
            }
        });
    });



});
