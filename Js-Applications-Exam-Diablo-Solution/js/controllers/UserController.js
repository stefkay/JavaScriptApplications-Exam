var app = app || {};

app.userController = (function(){
	
    function UserController(viewBag, model) {
        this.model = model;
        this.viewBag = viewBag;
    }

    UserController.prototype.loadRegisterPage = function(menu, container){
        this.viewBag.showRegisterPage(menu, container);
    };

    UserController.prototype.registerUser = function(data){
        return this.model.register(data)
            .then(function(success) {
                sessionStorage['sessionId'] = success._kmd.authtoken;
                sessionStorage['username'] = success.username;
                sessionStorage['userId'] = success._id;

                noty({
                        layout: 'top',
                        type: 'success',
                        text: "Successful registration!",
                        dismissQueue: true,
                        animation: {
                            open: {height: 'toggle'},
                            close: {height: 'toggle'},
                            easing: 'swing',
                            speed: 500
                        },
                        timeout: 800
                    });

                    Sammy(function(){
                    this.trigger('redirectUrl', {url: "#/"});
                })
            },
            function(error){
                noty({
                	layout: 'top',
                    type: 'error',
                    text: "Unsuccessful sign up, please try again!",
                    dismissQueue: true,
                    animation: {
                		open: {height: 'toggle'},
                		close: {height: 'toggle'},
                		easing: 'swing',
                		speed: 500
                    },
                    timeout: 800
                });
            })
            .done();
    };

    UserController.prototype.loadLoginPage = function(menu, container){
        this.viewBag.showLoginPage(menu, container);
    };

    UserController.prototype.loginUser = function(data){
        return this.model.login(data)
            .then(function(success){

                sessionStorage['sessionId'] = success._kmd.authtoken;
                sessionStorage['username'] = success.username;
                sessionStorage['userId'] = success._id;

                noty({
                	layout: 'top',
                    type: 'success',
                    text: "Successful login!",
                    dismissQueue: true,
                    animation: {
                		open: {height: 'toggle'},
                		close: {height: 'toggle'},
                		easing: 'swing',
                		speed: 500
                    },
                    timeout: 800
                });
                
                Sammy(function(){
                    this.trigger('redirectUrl', {url: "#/"});
                })
            }, function(){
                noty({
                	layout: 'top',
                    type: 'error',
                    text: "Unsuccessful login, please try again!",
                    dismissQueue: true,
                    animation: {
                		open: {height: 'toggle'},
                		close: {height: 'toggle'},
                		easing: 'swing',
                		speed: 500
                    },
                    timeout: 800
                });
            })
            .done();
    };

    UserController.prototype.logoutUser = function(){
        return this.model.logout()
            .then(function(){
                sessionStorage.clear();
                
                noty({
                	layout: 'top',
                    type: 'success',
                    text: "You successfully logged out!",
                    dismissQueue: true,
                    animation: {
                		open: {height: 'toggle'},
                		close: {height: 'toggle'},
                		easing: 'swing',
                		speed: 500
                    },
                    timeout: 800
                });
                
                Sammy(function(){
                    this.trigger('redirectUrl', {url:"#/"});
                })
            }).done();
    };

    return {
        load : function(viewBag, model){
            return new UserController(viewBag, model);
        }
    };

})();