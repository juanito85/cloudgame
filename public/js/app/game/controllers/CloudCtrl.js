'use strict';
angular.module('ds.game', ["ngTouch"]).
    controller('CloudCtrl',['$scope','$rootScope','GlobalData','$window', 'Restangular','$timeout','$interval','$filter','highscoreSrv',  
    function($scope, $rootScope, GlobalData, $window, Restangular, $timeout, $interval, $filter,highscoreSrv){
    
    $scope.hotZone = 44;
  
    $scope.$on('user:signedin', function(e) {
        $scope.user = true;
    });
    
    $scope.$on('user:signedout', function(){
        $scope.user = false;
    });
  
    $scope.linkFound = false;
    $scope.games = 0;
    $scope.timer = null;
    var date;
    var time;
    var currentTime;
    var soundUrl = 'js/app/game/sound/';
    $scope.wholeGame = true;
    $scope.trackMouse = true;
    $scope.backgroundAudio = null;
    $scope.personalAudioStream = null;
    $scope.soundPlaying = true;
    $scope.canPlay=true;
    
    $scope.startGame = function(){
        $scope.trackMouse = true;
        $scope.linkFound = false;
        $scope.gameStarted=true;
        $scope.calculateRandomPoint();
        date = new Date();
        $scope.startTimer();
        $scope.soundPlaying = true;
        $scope.startBackroundMusic();
    };
    
    $scope.stopGame = function(){
        $scope.stopTimer();
        $scope.gameStarted = false;
        $scope.personalAudioStream.fadeOut();
        if($scope.user){
            highscoreSrv.createHighScore(GlobalData.customerAccount.contactEmail, $scope.games);
            $scope.games = 0;
        }
    };

    $scope.startTimer = function () {
        $scope.timer = $interval(function () {
            currentTime = new Date();
            time = (currentTime.getTime() - date.getTime()) / 1000;
            $scope.sec = Math.round(time);
        }, 1000);
    };
             
    $scope.stopTimer = function () {
        $interval.cancel($scope.timer);
    };
    
    $scope.playAgain = function(){
        document.body.style.cursor = "default";
        $scope.timer = null;
        $scope.sec = 0;
        $scope.startGame();
    };
    
    $scope.onTouchmove = function($event) {
        var x = $event.originalEvent.touches[0].clientX;
        var y = $event.originalEvent.touches[0].clientY;
        $scope.checkDistance(x,y);
        if($scope.distance<$scope.hotZone){
            $scope.foundTheCloud();
        }
    }
     
    $scope.trackMousePosition = function(event){
        if($scope.trackMouse){
            var x = event.clientX;
            var y = event.clientY;
            $scope.checkDistance(x,y);
        }
    };
    
    $scope.clickOnCloud = function(event){
        var x = event.clientX;
        var y = event.clientY;
        calculateDistance(x,y);
        if($scope.distance<$scope.hotZone){
            $scope.foundTheCloud();
        }    
    };
    
    $scope.foundTheCloud = function(){
        $scope.linkFound = true;
        $scope.imgSource="js/app/game/img/cloudnew";
        if($scope.soundPlaying){
            $scope.playSound("12");
            $scope.gamesPlayed();
            $scope.stopTimer();
            $scope.trackMouse = false;
            $scope.soundPlaying = false;
        }
    };
    
    $scope.gamesPlayed = function(){
        $scope.games = $scope.games + 1;
    };  
      
    //TODO normalize it
    $scope.checkDistance = function(x, y){
        calculateDistance(x,y);
        if($scope.distance<$scope.hotZone){
            document.body.style.cursor = "pointer";
            if($scope.soundPlaying){
                $scope.playSound("10");
            }
        }else if($scope.distance<88){
            if($scope.soundPlaying){
                $scope.playSound("9");
            }
            document.body.style.cursor = "default";
        }else if($scope.distance<130){
            if($scope.soundPlaying){
                $scope.playSound("8");
            }
            document.body.style.cursor = "default";
        }else if($scope.distance<170){
            if($scope.soundPlaying){
                $scope.playSound("7");
            }
            document.body.style.cursor = "default";
        }else if($scope.distance<210){
            if($scope.soundPlaying){
                $scope.playSound("6");
            }
            document.body.style.cursor = "default";
        }else if($scope.distance<250){
            if($scope.soundPlaying){
                $scope.playSound("5");
            }
            document.body.style.cursor = "default";
        }else if($scope.distance<280){
            if($scope.soundPlaying){
                $scope.playSound("4");
            }
            document.body.style.cursor = "default";
        }else if($scope.distance<310){
            if($scope.soundPlaying){
                $scope.playSound("3");
            }
            document.body.style.cursor = "default";
        }else if($scope.distance<340){
            if($scope.soundPlaying){
                $scope.playSound("2");
            }
            document.body.style.cursor = "default";
        }else{
            if($scope.soundPlaying){
                $scope.playSound("1");
            }
            document.body.style.cursor = "default";
        }
    };
    
     function calculateDistance(x,y){
         var a = $scope.randomWidth-x;
         var b = $scope.randomHeight-y;
         var c = Math.pow(Math.abs(a),2) + Math.pow(Math.abs(b),2);
         $scope.distance = Math.sqrt(c);
     };
    
    $scope.calculateRandomPoint = function(){
        var fullScreenWidth = $(window).width();
        var fullScreenHeight = $(window).height();
        var randomWidth=(Math.floor(Math.random()*fullScreenWidth)+1);
        var randomHeight=(Math.floor(Math.random()*fullScreenHeight)+1);
        //$scope.randomWidth =  randomWidth;
        //$scope.randomHeight = randomHeight;
        $scope.randomWidth = 0;
        $scope.randomHeight = 0;
    };
    
    /**
     * loads 2 background audio files and intitites the streams
     * place for multiplexing.
     * Also the cow sounds are preloaded.
     * @returns {undefined}
     */
    $scope.initAudio = function () {
        $scope.cowAudio = [];
        for (var i = 0; i < 13; i++)
        {
            var mySound = new buzz.sound(soundUrl + i + ".wav");
            mySound.bind("ended", function(e) {
                $scope.canPlay = true;
            });
            $scope.cowAudio.push(mySound);
        }

        window.cowAudio = $scope.cowAudio;
        //$scope.backgroundAudio = new buzz.sound("sound/beat128.mp3");
        $scope.backgroundAudio2 = new buzz.sound(soundUrl + "fire.wav");
        $scope.personalAudioStream = new buzz.group($scope.backgroundAudio2);
    }
    
    $scope.startBackroundMusic = function(){
        $scope.personalAudioStream.setVolume(40).play();        
    };

    $scope.playSound = function (variable) {
        if($scope.canPlay || variable > 11) {
            $scope.canPlay = false;
            $scope.cowAudio[variable].setVolume(100).play();
        }
    };


    $scope.initAudio();
    angular.element("#game").on("touchstart", $scope.onTouchmove);
}]);