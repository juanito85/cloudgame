angular.module('ds.game').factory('highscoreSrv', ['Restangular','TokenSvc', function(Restangular,TokenSvc){
     
    Restangular.setBaseUrl('https://api.yaas.io/gamecenter/highscore/v1/');
    
    
    var highscoreSrv = {};
    
    highscoreSrv.stripResponse = function(response){
        return Restangular.stripRestangular(response);
    };
    
    highscoreSrv.createHighScore = function(user, scores){
        var data = {
            'score':scores,
            'nickname': user
        };
        var headers = {
            'Authorization': 'Bearer '+TokenSvc.getToken(),
            'Content-Type':'application/json'
        };
        
        return Restangular.one('cloudgame/findtheinvisiblecloud/highscores').customPOST(data,"",{},headers);
    };

    return highscoreSrv;
}]);
