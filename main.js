$(document).ready( function () {

    var templateCardHtml = $('#card-template').html();
    var templateCardCompiled = Handlebars.compile(templateCardHtml);
    var apiBase = 'https://api.themoviedb.org/3/search/movie/';
    var apiKey = '80ffe5b2b9aa99cf4d91d9de1be5363d';



    //Search trigger from enter downNOT WORKING
    $('#searchBar').keyup(function(event) {
        if(event.which == 13) {
            search();
        }
        console.log(event.which);

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
            //Empty the search bar and put again the placeholder
            $('#searchBar').val('');
            $('#searchBar').attr('placeholder','Search your movie or serial');
            //AJAX call
            getAPI(query);
        } else {
            var text = $('#searchBar').addClass('warning');
            text.attr('placeholder','THE QUERY CANNOT BE EMPTY');
        }
        //$('#searchBar').removeClass('warning');
    }


    //This function call the api using a ajax call,parametre is the query of search
    function getAPI(query) {
        $.ajax({
            url: apiBase,
            method:'GET',
            data:{
                api_key:apiKey,
                query:query
            },
            success:function (response) {

                //Variable that contains tha array of films
                var films = response.results;
                console.log(films);
                if (films.length === 0) {
                    var emptyList = 'NO RESULT!'
                    $('#films').append(`<h1 id="noResult">${emptyList}</h1>`);

                }

                getResults(films);

            },
            error:function(err) {
                console.log(err);
            }
        });
    }
    //This funcyion print the result on the page
    function getResults(result) {
        for (var i = 0; i < result.length; i++) {

            var title = result[i].title;
            var poster = 'https://image.tmdb.org/t/p/w342'+result[i].poster_path;
            var overview = result[i].overview === ''?'NO OVERVIEW':result[i].overview;
            var originalTitle = result[i].original_title;
            var language = result[i].original_language;
            var vote = result[i].vote_average;
            var stars = vote/2 //Math.round(vote/2);
            var giudice = rating(stars);
            var films = {
                posterIMG: poster,
                filmTitle: title,
                plot: overview,
                vote:giudice
            }
            $('#films').append(templateCardCompiled(films));

                // `<li>Film nr° ${filmItem}<ul>
                // <li>Titolo: ${title}</li>
                // <li><img src="${poster}"></li>
                // <li>Titolo originale: ${originalTitle}</li>
                // <li>Lingua: ${language} <img  src="flags/${language==='en'?'gb':language}.png" alt="language flag "></li>
                // <li>Giudizio: ${giudice}</li>
                // </ul></li><br>`);

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
