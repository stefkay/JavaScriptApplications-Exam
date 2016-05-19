var app = app || {};

app.heroModel = (function(){

    function HeroModel(requester){
        this.requester = requester;
        this.serviceUrl = requester.baseUrl + "appdata/" + requester.appKey + "/";
    }

    HeroModel.prototype.add = function(data){
        console.log(data);
        var requestUrl = this.serviceUrl + 'heroes';
        console.log(requestUrl);
        return this.requester.post(requestUrl, data, true);
    };

    HeroModel.prototype.getUserHeroes = function(){
        var creatorId = sessionStorage['userId'];
        var requestUrl = this.serviceUrl + 'heroes/?query={"_acl.creator":"'+creatorId+'"}&resolve=class';
        return this.requester.get(requestUrl, true);
    };

    HeroModel.prototype.getHero = function(data) {
        var requestUrl = this.serviceUrl + "heroes/" + data.id + '?resolve=class,items,items.type';
        return this.requester.get(requestUrl, true);
    };

    HeroModel.prototype.edit = function(data){
        var requestUrl = this.serviceUrl+"heroes/" + data._id;
        return this.requester.put(requestUrl, data, true);
    };

    HeroModel.prototype.getHeroClasses = function(){
        var requestUrl = this.serviceUrl + 'hero-classes/';
        return this.requester.get(requestUrl, true);
    };

    HeroModel.prototype.getStoreItems = function(){
        var requestUrl = this.serviceUrl  + 'items/?resolve=type';
        return this.requester.get(requestUrl, true);
    };

    HeroModel.prototype.getItemTypes = function(){
        var requestUrl = this.serviceUrl  + 'item-types';
        return this.requester.get(requestUrl, true);
    };

    return {
        load: function(requester){
                return new HeroModel(requester);
            }
        }
})();