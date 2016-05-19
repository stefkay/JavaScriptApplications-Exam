var app = app || {};

app.router = $.sammy(function(){
    var container = "#container",
        menu = '#menu',
        classes = "#select-class",

    requester = app.requester.config('kid_-1P81m42GW',
        'a83182c9251a4ca9878951e139e6d929',
        'https://baas.kinvey.com/'),

    userViewBag = app.userViewBag.load(),
    heroViewBag = app.heroViewBag.load(),
    //dataViewBag = app.dataViewBag.load(),
    homeViewBag = app.homeViewBag.load(),

    userModel = app.userModel.load(requester),
    heroModel = app.heroModel.load(requester),
    //dataModel = app.dataModel.load(requester),

    userController = app.userController.load(userViewBag, userModel),
    heroController = app.heroController.load(heroViewBag, heroModel),
    //dataController = app.dataController.load(dataViewBag, dataModel),
    homeController = app.homeController.load(homeViewBag);

    this.before({except: {path: "#\/(login\/|register\/)?"}}, function(){
        if(!sessionStorage["sessionId"]){
            this.redirect("#/");
            return false;
        }
    });

    this.get('#/', function(){
        if(!sessionStorage['sessionId']){
            homeController.loadGuestHomePage(menu, container);
        }else{
            homeController.loadUserHomePage(menu, container);
        }
    });

    this.bind('redirectUrl', function(ev, data){
        this.redirect(data.url);
    });

    this.get('#/login/', function(){
        userController.loadLoginPage(menu, container);
    });

    this.bind('login-user', function(ev, data){
        userController.loginUser(data);
    });


    this.get('#/register/', function(){
        userController.loadRegisterPage(menu, container);
    });

    this.bind('register-user', function(ev, data){
        userController.registerUser(data);
    });

    this.get('#/heroes/list/', function(){
       heroController.listUserHeroes(container);
    });

    this.get("#/heroes/add/", function(){
        heroController.loadAddHeroPage(container);
    });


    this.get('#/logout/', function(){
        userController.logoutUser();
    });

    this.bind("add-hero", function(ev, heroData){
        heroController.addHero(heroData)
    });

    this.get("#/heroes/:id", function(){
        var id = this.params['id'];
        heroController.getUserHero(container, {id: id});
    });

    this.get("#/heroes/:id/store", function(){
        var id = this.params["id"];
        heroController.listStoreItems(container, {id: id});
    });

    this.bind("edit-hero", function(ev, hero){
        heroController.editHero(hero);
    })
});
app.router.run('#/');

