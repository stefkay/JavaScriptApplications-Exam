var app = app || {};

app.requester = (function(){
    function Requester(appKey, appSecret, baseUrl){
        this.appKey = appKey;
        this.appSecret = appSecret;
        this.baseUrl = baseUrl;
    }

    Requester.prototype.get = function(url, useSession){
        var headers = getHeaders.call(this, false, useSession);
        return makeRequest('GET', url, headers, null);
    };

    Requester.prototype.post = function(url, data, useSession){
        var headers = getHeaders.call(this, data, useSession);
        return makeRequest("POST", url, headers, data);
    };

    Requester.prototype.put = function(url, data, useSession){
        var headers = getHeaders.call(this, true, useSession);
        return makeRequest('PUT', url, headers, data);
    };

    Requester.prototype.delete = function(url, useSession){
        var headers = getHeaders.call(this, false, useSession);
        return makeRequest('DELETE', url, headers, null);
    };

    function getHeaders(isJSON, useSession){
        var headers = {},
            token;

        if(isJSON){
            headers["Content-Type"] = 'application/json';
        }
        if(useSession){
            token =  sessionStorage['sessionId'];
            headers['Authorization'] = 'Kinvey '+ token;
        }else{
            token = this.appKey+':'+this.appSecret;
            headers['Authorization'] = 'Basic ' + btoa(token);
        }
        return headers;
    }

    function makeRequest(method, url, headers, data){
        var defer = Q.defer();
        $.ajax({
            method: method,
            url: url,
            headers : headers,
            data: JSON.stringify(data)||null,
            success: function(data){
                defer.resolve(data);
            },
            error: function(data){
                defer.reject(data);
            }
        });

        return defer.promise;
    }

    return {
        config: function(appKey, appSecret, baseUrl){
            return new Requester(appKey, appSecret, baseUrl)
        }
    }
})();