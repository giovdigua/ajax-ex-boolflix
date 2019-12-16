$(document).ready( function () {

    $('#searchButton').click(function() {
        $('#films').empty();
        var query = $('#searchBar').val();
        console.log(query);
        var apiBase = 'https://api.themoviedb.org/3/search/movie/';


        $.ajax({
            url: apiBase,
            method:'GET',
            data:{
                api_key: '80ffe5b2b9aa99cf4d91d9de1be5363d',
                query:query
            },
            success:function (response) {

                var films = response.results;
                for (var i = 0; i < films.length; i++) {
                    var filmItem = i+1;
                    var title = films[i].title;
                    var originalTitle = films[i].original_title;
                    var language = films[i].original_language;
                    var vote = films[i].vote_average;
                    $('#films').append(`<li>Film nr° ${filmItem}<ul>
                        <li>Titolo: ${title}</li>
                        <li>Titolo originale: ${originalTitle}</li>
                        <li>Lingua: ${language}</li>
                        <li>Giudizio: ${vote}</li>
                        </ul></li>`);
                    console.log(films[i].title);
                }


            },
            error:function(err) {
                console.log(err);
            }
        });
    });



});
