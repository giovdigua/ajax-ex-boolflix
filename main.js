$(document).ready( function () {

    var templateCardHtml = $('#card-template').html();
    var templateCardCompiled = Handlebars.compile(templateCardHtml);
    var apiBase = 'https://api.themoviedb.org/3';
    var apiKey = '80ffe5b2b9aa99cf4d91d9de1be5363d';
    var searchMovie = '/search/movie/';
    var searchSerie = '/search/tv/';
    var posterPrefixPath = 'https://image.tmdb.org/t/p/w342';



    //Search trigger from enter downNOT WORKING
    $('#searchBar').keypress(function(event) {
        if(event.which == 13) {
            search();
        }


    });


    //Search trigger from button click
    $('#searchButton').click(search);


    /*----------------------  FUNCTIONS  ----------------------*/

    //This function active the searchBar
    function search() {
        //REmove eventualy warning class on placeholder
        $('#searchBar').removeClass('warning');
        //create a variable to which I assign the value coming from the searchBar
        var query = $('#searchBar').val();
        if (query) {
            //Empty the list by returning the empty div films
            $('#films').empty();
            $('#series').empty();

            //Empty the search bar and put again the placeholder
            $('#searchBar').val('');
            $('#searchBar').attr('placeholder','Search your movie or serial');
            //AJAX calls
            getAPISearch(searchMovie,query);
            getAPISearch(searchSerie,query);
        } else {
            var text = $('#searchBar').addClass('warning');
            text.attr('placeholder','THE QUERY CANNOT BE EMPTY');
        }
        //$('#searchBar').removeClass('warning');
    }


    //This function call the api using a ajax call,parametre is the query of search
    function getAPISearch(typeSearch,query) {
        $.ajax({
            url: apiBase + typeSearch,
            method:'GET',
            data:{
                api_key:apiKey,
                query:query
            },
            success:function (response) {

                //Variable that contains tha array of films
                var films = response.results;

                if (films.length === 0) {
                    if (typeSearch == searchMovie) {
                        $('#films').append(`<h1 class="noResult">'NO MOVIES found for your query!'</h1>`);
                    }else{
                        $('#series').append(`<h1 class="noResult">'NO SERIES found for your query!'</h1>`);
                    }


                }

                getResults(films);

            },
            error:function(err) {
                console.log(err);
            }
        });
    }
    //This funcyion print the result on the page
    function getResults(results) {
        for (var i = 0; i < results.length; i++) {
            var result = results[i];
            var title;
            var originalTitle;
            var container;
            var poster
            if (result.hasOwnProperty('title')) {
                 title = result.title;
                 container = $('#films');
            } else {
                 title = result.name;
                 container = $('#series');
            }
            if (result.hasOwnProperty('original_title')) {
                 originalTitle = result.original_title;
            } else {
                 originalTitle = result.original_title;
            }

            poster = result.poster_path === null ?'imgPlaceholder.jpg': posterPrefixPath+result.poster_path;
            var overview = result.overview === ''?'NO OVERVIEW':result.overview;
            var lang = result.original_language;
            lang = lang === 'en'?'gb':lang;
            lang = lang === 'ja'?'jp':lang;
            var vote = result.vote_average;
            var stars = vote/2 //Math.round(vote/2);
            var giudice = rating(stars);
            var id = result.id;


            var films = {
                posterIMG: poster,
                filmTitle: title,
                plot: overview,
                rate:stars,
                vote:giudice,
                lang: lang,
                data_id:id
            }
            var actualCard = templateCardCompiled(films)
             container.append(actualCard);


                // `<li>Film nr° ${filmItem}<ul>
                // <li>Titolo: ${title}</li>
                // <li><img src="${poster}"></li>
                // <li>Titolo originale: ${originalTitle}</li>
                // <li>Lingua: ${language} <img  src="flags/${language==='en'?'gb':language}.png" alt="language flag "></li>
                // <li>Giudizio: ${giudice}</li>
                // </ul></li><br>`);
             $.ajax({
                 url: apiBase + `/movie/${id}`,
                 method:'GET',
                 data:{
                     api_key:apiKey,
                     append_to_response:'credits'


                 },
                 success:function (response) {
                     var idFilm = response.id;
                     var actors = response.credits.cast;
                     var listHTML = '';
                     var conteneirList = $(`.card[data-id="${idFilm}"] .cast ul`);
                     console.log(conteneirList);
                     for (var i = 0; i < actors.length; i++) {
                         var character =  actors[i].character;
                         var actorName = actors[i].name;
                         listHTML+= `<li>Character: ${character} Actor: ${actorName}</li>`;
                         if (i > 3) {
                                break;
                         }

                     }
                     conteneirList.append(listHTML);

                 },
                 error:function(err) {
                     console.log(err);
                 }
             });

        }
    }

    //This function transform the rating from number to stars
    function rating(rate) {
        var html = '';
        for (var i = 0; i < 5; i++) {
            if (i<rate) {
                if (i+0.5 < rate) {
                    html+='<i class="fas fa-star"></i>';
                } else {

                    html+='<i class="fas fa-star-half-alt"></i>';
                }

            } else {
                html+='<i class="far fa-star"></i>';                                }
        }
        return html;
    };
});
