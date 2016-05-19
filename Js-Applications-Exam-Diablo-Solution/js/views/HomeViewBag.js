var app = app || {};

app.homeViewBag = (function(){

    function showGuestHomePage(menu, container){
        $.get('templates/menu-login.html', function(templ){
           $(menu).html(templ);
        });

        $.get('templates/welcome-guest.html', function(templ){
            $(container).html(templ);
        });
    }

    function showUserHomePage(menu, container){
        $.get('templates/menu-home.html', function(templ){
            $(menu).html(templ);
        });
        $.get('templates/welcome-user.html', function(templ){
            var data = {
                username: sessionStorage['username']
            };
            var rendered = Mustache.render(templ, data);
            $(container).html(rendered);
        });
    }

    return {
        load: function(){
            return {
                showGuestHomePage: showGuestHomePage,
                showUserHomePage: showUserHomePage
            }
        }
    }
})();