var app = app || {};

app.userViewBag = (function(){

    function showRegisterPage(menu, container){
        $.get('templates/menu-login.html', function(templ){
            $(menu).html(templ);
        });
        $.get("templates/register.html", function(templ){
            $(container).html(templ);

            $('#register-button').on('click', function(){

                var username = $('#username').val();
                var password = $('#password').val();
                var confPass = $('#confirm-password').val();

                if(password === confPass){

                    Sammy(function(){
                        this.trigger('register-user', {username: username, password : password});
                    })

                }else{
                    noty({
                        layout: 'top',
                        type: 'error',
                        text: "Password mismatch. Try again!",
                        dismissQueue: true,
                        animation: {
                            open: {height: 'toggle'},
                            close: {height: 'toggle'},
                            easing: 'swing',
                            speed: 500
                        },
                        timeout: 800
                    });
                }
            })
        })
    }

    function showLoginPage(menu, container){
        $.get('templates/menu-login.html', function(templ){
            $(menu).html(templ);
        });
        $.get("templates/login.html", function(templ){
            $(container).html(templ);

            $("#login-button").on('click', function(){
                var username = $('#username').val();
                var password = $('#password').val();


                Sammy(function(){
                    this.trigger('login-user', {username: username, password : password});
                })
            })
        })
    }

    return {
        load: function(){
            return {
                showRegisterPage: showRegisterPage,
                showLoginPage:showLoginPage
            }
        }
    }
})();