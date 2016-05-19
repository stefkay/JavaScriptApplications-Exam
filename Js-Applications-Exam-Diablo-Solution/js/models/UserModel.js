var app = app || {};

app.userModel = (function(){
    function UserModel(requester){
        this.requester = requester;
        this.serviceUrl = requester.baseUrl + "user/" + requester.appKey + "/";
    }

    UserModel.prototype.login = function(data){
        var requestUrl = this.serviceUrl + 'login';
        return this.requester.post(requestUrl, data, false);
    };

    UserModel.prototype.register = function(data){
        return this.requester.post(this.serviceUrl, data, false);
    };

    UserModel.prototype.logout = function(){
        var requestUrl = this.serviceUrl + "_logout";
        return this.requester.post(requestUrl, null, true);
    };

    UserModel.prototype.edit = function(data){
        var requestUrl = this.serviceUrl + sessionStorage['userId'];
        return this.requester.put(requestUrl, data, true);
    };

    UserModel.prototype.getUser = function(){
        var requestUrl = this.serviceUrl + sessionStorage['userId'];
        return this.requester.get(requestUrl, true);
    };

    return {
        load: function(requester){
            return new UserModel(requester);
        }
    }
})();