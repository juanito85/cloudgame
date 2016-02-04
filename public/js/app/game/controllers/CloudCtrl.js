'use strict';

angular.module('ds.game', []).
    controller('CloudCtrl',['$scope','$rootScope','GlobalData','$window', 'Restangular','$timeout','$interval','$filter','highscoreSrv',  
    function($scope, $rootScope, GlobalData, $window, Restangular, $timeout, $interval, $filter,highscoreSrv){
  
  
    $scope.$on('user:signedin', function() {
        $timeout(function(){
            $scope.user = GlobalData.customerAccount.contactEmail;    
        },1000);
    });
    
    $scope.$on('user:signedout', function(){
        $scope.user = undefined;
    });
  
    $scope.linkFound = false;
    $scope.games = 0;
    $scope.timer = null;
    var date;
    var zeit;
    var aktuell;
    var soundUrl = 'js/app/game/sound/';
    $scope.wholeGame = true;
    $scope.trackMouse = true;
    $scope.backgroundAudio = null;
    $scope.personalAudioStream = null;
    $scope.soundPlaying = true;
    

    
    $scope.startGame = function(){
        $scope.trackMouse = true;
        $scope.linkFound = false;
        $scope.gameStarted=true;
        $scope.calculateRandomPoint();
        date = new Date();
        $scope.startTimer();
        $scope.initAudio();
        $scope.soundPlaying = true;
    };
    
    $scope.stopGame = function(){
        $scope.stopTimer();
        $scope.gameStarted = false;
        $scope.personalAudioStream.fadeOut();
        if($scope.user){
            highscoreSrv.createHighScore($scope.user, $scope.games);
            $scope.games = 0;
        }
    };

            
    $scope.startTimer = function () {
        $scope.timer = $interval(function () {
            aktuell = new Date();
            zeit = (aktuell.getTime() - date.getTime()) / 1000;
            $scope.sec = Math.round(zeit);
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
      
    $scope.checkCloud = function(event){
        var x = event.clientX;
        var y = event.clientY;
        calculateDistance(x,y);
        if($scope.distance<10){
            $scope.linkFound = true;
            if($scope.soundPlaying){
                $scope.playSound("12");
                $scope.gamesPlayed();
                $scope.stopTimer();
                $scope.trackMouse = false;
                $scope.soundPlaying = false;
            }
        }
    };
    
    $scope.gamesPlayed = function(){
        $scope.games = $scope.games + 1;
    };  
      
    //TODO normalize it
    $scope.trackMousePosition = function(event){
        if($scope.trackMouse){
            var x = event.clientX;
            var y = event.clientY;
            calculateDistance(x,y);
            if($scope.distance<10){
                document.body.style.cursor = "pointer";
                if($scope.soundPlaying){
                    $scope.playSound("10");
                }
            }else if($scope.distance<40){
                if($scope.soundPlaying){
                    $scope.playSound("9");
                }
                document.body.style.cursor = "default";
            }else if($scope.distance<70){
                if($scope.soundPlaying){
                    $scope.playSound("8");
                }
                document.body.style.cursor = "default";
            }else if($scope.distance<100){
                if($scope.soundPlaying){
                    $scope.playSound("7");
                }
                document.body.style.cursor = "default";
            }else if($scope.distance<130){
                if($scope.soundPlaying){
                    $scope.playSound("6");
                }
                document.body.style.cursor = "default";
            }else if($scope.distance<160){
                if($scope.soundPlaying){
                    $scope.playSound("5");
                }
                document.body.style.cursor = "default";
            }else if($scope.distance<190){
                if($scope.soundPlaying){
                    $scope.playSound("4");
                }
                document.body.style.cursor = "default";
            }else if($scope.distance<210){
                if($scope.soundPlaying){
                    $scope.playSound("3");
                }
                document.body.style.cursor = "default";
            }else if($scope.distance<240){
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
        var maxScreenSize = fullScreenWidth - 300;
        var maxScreenHeight = fullScreenHeight - 200;
        var randomWidth=(Math.floor(Math.random()*maxScreenSize)+1);
        var randomHeight=(Math.floor(Math.random()*maxScreenHeight)+1);
        $scope.randomWidth =  50;//randomWidth;
        $scope.randomHeight = 50;//randomHeight;
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
            $scope.cowAudio.push(new buzz.sound(soundUrl + i + ".mp3"));
        }

        //$scope.backgroundAudio = new buzz.sound("sound/beat128.mp3");
        $scope.backgroundAudio2 = new buzz.sound(soundUrl + "fire.wav");
        $scope.personalAudioStream = new buzz.group($scope.backgroundAudio2);
        $scope.personalAudioStream.setVolume(10).play();
    }

    $scope.playSound = function (variable) {
        $scope.cowAudio[variable].setVolume(100).play(); 
    };

}]);