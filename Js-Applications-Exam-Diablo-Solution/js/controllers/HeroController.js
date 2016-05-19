var app = app || {};

app.heroController = (function(){
    function HeroController(viewBag, model){
        this.viewBag = viewBag;
        this.model = model;
    }

    HeroController.prototype.loadAddHeroPage = function(selector){
        this.listAvailableHeroClasses(selector);
    };

    HeroController.prototype.addHero = function(data){
        var hero = {
            name: data.name,
            class: {
                "_type": "KinveyRef",
                "_id": data.class,
                "_collection": "hero-classes"
            },
            items: []
        };
        return this.model.add(hero)
            .then(function(success){

                noty({
                	layout: 'top',
                    type: 'success',
                    text: "You successfully added a hero!",
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
                    this.trigger('redirectUrl', {url:"#/heroes/list/"});
                });

            }, function(error){
                noty({
                	layout: 'top',
                    type: 'error',
                    text: "Error adding a hero, please try again!",
                    dismissQueue: true,
                    animation: {
                		open: {height: 'toggle'},
                		close: {height: 'toggle'},
                		easing: 'swing',
                		speed: 500
                    },
                    timeout: 800
                });
            }).done();
    };

    HeroController.prototype.listUserHeroes = function(container) {
        var _this = this;
        return this.model.getHeroClasses()
            .then(function (classes) {
                return _this.model.getUserHeroes()
                    .then(function (heroes) {
                        if (heroes.length > 0) {
                            _this.viewBag.showUserHeroes(container, heroes, classes);
                        } else {
                            _this.viewBag.showNoHeroesPage(container);
                        }
                    }, function (error) {
                        //TODO implement
                        console.log(error);
                    })
            }).done();

    };

    //TODO heroId comes from view as an id to an html element - heroId or {id:id}
    HeroController.prototype.getUserHero = function(selector, data){
        var _this = this;
            return this.model.getHero(data)
                .then(function(hero) {
                    return _this.model.getItemTypes()
                        .then(function (types) {
                            _this.viewBag.showUserHero(selector, hero, types);
                        }, function (error) {
                            //TODO implement
                            console.log(error);
                        })
                }, function(error){
                    console.error(error);
                }).done();
    };

    //TODO data all hero properties - changed
    HeroController.prototype.editHero = function(data){
        return this.model.edit(data)
            .then(function(hero){
                Sammy(function(){
                    this.trigger("redirectUrl", {url: "#/heroes/"+hero._id});
                })
            }, function(error){
                //TODO implement
                console.log(error);
            }).done();
    };

    HeroController.prototype.listAvailableHeroClasses = function(selector){
        var _this = this;
        return this.model.getHeroClasses()
            .then(function(classes){
                _this.viewBag.showAddHeroPage(selector, classes);
            }, function(error){
                //TODO implement
                console.log(error);
            }).done(function(){
        });
    };

    HeroController.prototype.listStoreItems = function(selector, data){
        var _this = this;
        return this.model.getHero(data)
            .then(function(hero){
                return _this.model.getStoreItems()
                    .then(function(storeItems){
                        _this.viewBag.showStoreItems(selector, hero, storeItems);//{id: id}
                    }, function(error){
                        //TODO implement
                        console.log(error);
                    })
            })
    };

    HeroController.prototype.listAvailableItemTypes = function(){
        return this.model.getItemTypes()
            .then(function(success){
                //TODO implement actions
                console.log(success);
            }, function(error){
                //TODO implement
                console.log(error);
            }).done();
    };

    return {
        load: function(viewBag, model){
            return new HeroController(viewBag, model);
        }
    }

})();