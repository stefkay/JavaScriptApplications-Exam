var app = app || {};

app.homeController = (function(){
    function HomeController(viewBag){
        this.viewBag = viewBag;
    }

    HomeController.prototype.loadGuestHomePage = function(menu, container){
        this.viewBag.showGuestHomePage(menu, container);
    };

    HomeController.prototype.loadUserHomePage = function(menu, container){
        this.viewBag.showUserHomePage(menu, container);
    };

    return {
        load: function(viewBag){
            return new HomeController(viewBag);
        }
    }
})();