var app = app || {};

app.heroViewBag = (function(){

    function showAddHeroPage(selector, data){
        $.get('templates/add-hero.html', function(templ){
            var repo = {
                classes: []
            };
            for(var i in data){
                repo.classes.push({
                    "name": data[i].name,
                    "attack-points": data[i]["attack-points"],
                    "defense-points": data[i]["defense-points"],
                    "life-points": data[i]["life-points"],
                    "_id": data[i]._id
                });
            }
            var rendered = Mustache.render(templ, {classes: repo.classes});
            $(selector).html(rendered);

            $('#addHero').on('click', function(){
                var name = $("#name").val();
                var classId = $('input:checked').val().trim();

                if(name && classId){
                    Sammy(function(){
                        this.trigger('add-hero', {name: name, class: classId});
                    });
                }
            })
        })
    }

    function showUserHeroes(selector, heroes, classes){
        $.get('templates/heroes.html', function(templ){
            var classRepo = [];
            for(var c in classes){
                classRepo.push({
                    id: classes[c]._id,
                    name: classes[c].name
                });
            }
            var heroRepo = {
                heroes: []
            };

            for(var h in heroes){
                var heroClassId = heroes[h].class._id;
                var className;
                classRepo.forEach(function(c){
                    if(c['id'].trim() == heroClassId.trim()){
                        className = c["name"];
                    }
                });
                heroRepo.heroes.push({
                    id: heroes[h]._id.trim(),
                    imageUrl: "imgs/"+className.toLowerCase()+".png",
                    name: heroes[h].name
                });
            }
            var rendered = Mustache.render(templ, heroRepo);
            $(selector).html(rendered);
        })
    }

    function showNoHeroesPage(selector){
        $.get("templates/no-heroes.html", function(templ){
            $(selector).html(templ);
        })
    }

    function showUserHero(selector, hero, types){
        $.get("templates/hero.html", function(templ){
            var typeRepo = [];
            for(var t in types){
                typeRepo.push({
                    id: types[t]._id,
                    name: types[t].name
                });
            }

            var items = [];
            if(hero.items){
                for(var i in hero.items){
                    items.push({
                        itemName : hero.items[i]._obj.name,
                        itemAttackPoints: hero.items[i]._obj["attack-points"],
                        itemDefensePoints: hero.items[i]._obj["defense-points"],
                        itemLifePoints: hero.items[i]._obj["life-points"],
                    })
                }
            }

            var totalItemAttackPoints = 0;
            var totalItemDefensePoints = 0;
            var totalItemLifePoints = 0;
            items.forEach(function(i){
               totalItemAttackPoints += i.itemAttackPoints;
               totalItemDefensePoints += i.itemDefensePoints;
               totalItemLifePoints += i.itemLifePoints;
            });

            var data = {
                imageUrl: "imgs/"+ hero["class"]._obj.name.toLowerCase() + ".png",
                name: hero.name,
                attackPoints: parseInt(hero.class._obj["attack-points"])+totalItemAttackPoints,
                defensePoints: parseInt(hero.class._obj["defense-points"]) +totalItemDefensePoints ,
                lifePoints: parseInt(hero.class._obj["life-points"]) + totalItemLifePoints,
                id: hero._id,
                items: items
            };

            var rendered = Mustache.render(templ, data);
            $(selector).html(rendered);
        });


    }

    function showStoreItems(selector, hero, items) {
        $.get("templates/store.html", function (templ) {
            var repo = {
                items: []
            };


            for (var i in items) {
                console.log(items[i].type._obj._id);
                repo.items.push({
                    name: items[i].name,
                    type: {
                        name: items[i].type._obj.name,
                        _id: items[i].type._obj._id
                    },
                    "attack-points": items[i]["attack-points"],
                    "defense-points": items[i]["defense-points"],
                    "life-points": items[i]["life-points"],
                    _id: items[i]._id
                })
            }

            var rendered = Mustache.render(templ, repo);

            $(selector).html(rendered);

            $('.buy').on('click', function (e) {
                var heroId = hero._id,
                    typeId = $(e.target).attr("data-typeId"),
                    itemId = $(e.target).attr("data-id"),
                    itemType = $(e.target).attr("data-type"),
                    itemName = $(e.target).parent().parent().find("h3").html();

                console.log(itemName);

                var answer;
                var alreadyAdded = false;

                if (hero.items.some(function (item) {
                        return (typeId == item._obj.type._id);
                    })) {
                    noty({
                        layout: 'top',
                        type: 'confirm',
                        text: "You already have " + itemType + ". Do you want to throw it and buy this item instead?",
                        dismissQueue: true,
                        animation: {
                            open: {height: 'toggle'},
                            close: {height: 'toggle'},
                            easing: 'swing',
                            speed: 500
                        },
                        buttons: [
                            {
                                addClass: 'btn btn-primary', text: 'YES', onClick: function ($noty) {
                                hero.items = hero.items.filter(function (item) {
                                    return typeId !== item._obj.type._id;
                                });

                                hero.items.push({
                                    "_type": "KinveyRef",
                                    "_id": itemId,
                                    "_collection": "items"
                                });

                                Sammy(function () {
                                    this.trigger("edit-hero", hero);
                                });

                                $noty.close();

                                noty({text: 'You successfully added ' + itemName + ' to your hero!', type: 'success', timeout: 600});
                            }
                            },
                            {
                                addClass: 'btn btn-danger', text: 'CANCEL', onClick: function ($noty) {
                                $noty.close();
                                noty({
                                    text: 'You clicked "Cancel" button',
                                    type: 'error',
                                    timeout: 600
                                });
                            }
                            }
                        ]
                    });
                } else {
                    hero.items.push({
                        "_type": "KinveyRef",
                        "_id": itemId,
                        "_collection": "items"
                    });

                    noty({text: 'You successfully added ' + itemName + ' to your hero!', type: 'success', timeout: 600});

                    Sammy(function () {
                        this.trigger("edit-hero", hero);
                    });
                }
            });
        });
    }

    return {
        load: function(){
            return {
                showUserHeroes: showUserHeroes,
                showNoHeroesPage: showNoHeroesPage,
                showAddHeroPage : showAddHeroPage,
                showUserHero : showUserHero,
                showStoreItems : showStoreItems
            }
        }

    }
})();