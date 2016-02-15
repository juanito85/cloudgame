'use strict';
angular.module('ds.game', ["ngTouch"]).

        controller('CloudCtrl', ['$scope', '$rootScope', 'GlobalData', '$window', 'Restangular', '$timeout', '$interval', '$filter', 'highscoreSrv', 'musicSrv',
            function ($scope, $rootScope, GlobalData, $window, Restangular, $timeout, $interval, $filter, highscoreSrv, musicSrv) {

                $scope.hotZone = 44;

                $scope.$on('user:signedin', function (e) {
                    $scope.userAuthenticated = true;
                });

                $scope.$on('user:signedout', function () {
                    $scope.userAuthenticated = false;
                });

                $scope.linkFound = false;
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
                $scope.canPlay = true;

                $scope.startGame = function () {
                    $scope.trackMouse = true;
                    $scope.linkFound = false;
                    $scope.gameStarted = true;
                    $scope.calculateRandomPoint();
                    date = new Date();
                    $scope.startTimer();
                    $scope.soundPlaying = true;
                    $scope.startBackroundMusic();
                };

                $scope.getGraph = function (piwikId)
                {
                    var taste = [];
                    var xxx = musicSrv.getMusic(1, piwikId).then(function (response) {
                        console.log("heereee", response);
                        taste = response;
                        taste.shift();
                    });
                    console.log("response ", taste);
                }

                $scope.emitCategoryView = function (categoryName)
                {
                    var cat = {};
                    cat.path = [];
                    var path = {};
                    path.name = "" + categoryName;
                    cat.path.push(path);
                    $scope.$emit('category:opened', cat);
                };

                $scope.stopGame = function () {
                    $scope.stopTimer();
                    $scope.gameStarted = false;
                    $scope.personalAudioStream.fadeOut();
                    $scope.stopBackroundMusic();
                    var musicTasteBPM = musicSrv.getLastBPM();
                    //console.log("sending taste to Profile:", musicTasteBPM);
                    $scope.emitCategoryView(musicTasteBPM);
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

                $scope.playAgain = function () {
                    document.body.style.cursor = "default";
                    $scope.timer = null;
                    $scope.sec = 0;

                    var musicTasteBPM = musicSrv.getLastBPM();
                    //console.log("sending taste to Profile:", musicTasteBPM);
                    $scope.emitCategoryView(musicTasteBPM);
                    $scope.personalAudioStream.fadeOut();
                    $scope.stopBackroundMusic();
                    $scope.startGame();
                };

                $scope.onTouchmove = function ($event) {
                    var x = $event.originalEvent.touches[0].clientX;
                    var y = $event.originalEvent.touches[0].clientY;
                    $scope.checkDistance(x, y);
                    musicSrv.bpm(event);
                    if ($scope.distance < $scope.hotZone) {
                        $scope.foundTheCloud();
                    }
                }

                $scope.trackMousePosition = function (event) {
                    if ($scope.trackMouse) {
                        var x = event.clientX;
                        var y = event.clientY;
                        $scope.checkDistance(x, y);
                    }
                };

                $scope.clickOnCloud = function (event) {
                    var x = event.clientX;
                    var y = event.clientY;
                    calculateDistance(x, y);
                    musicSrv.bpm(event);
                    if ($scope.distance < $scope.hotZone) {
                        $scope.foundTheCloud();
                    }
                };

                $scope.foundTheCloud = function () {
                    $scope.linkFound = true;
                    $scope.imgSource = "js/app/game/img/cloudnew";
                    if ($scope.soundPlaying) {
                        $scope.playSound("12");
                        $scope.stopTimer();
                        $scope.trackMouse = false;
                        $scope.soundPlaying = false;
                    }
                    if ($scope.userAuthenticated) {
                        $scope.calculateScore();
                        $scope.userEmail = GlobalData.customerAccount.contactEmail;
                        highscoreSrv.createHighScore(GlobalData.customerAccount.contactEmail, $scope.score);
                    }
                };

                $scope.calculateScore = function () {
                    if (60 - $scope.sec <= 0) {
                        $scope.score = 1;
                    } else {
                        $scope.score = 60 - $scope.sec;
                    }

                };

           

                function calculateDistance(x, y) {
                    var a = $scope.randomWidth - x;
                    var b = $scope.randomHeight - y;
                    var c = Math.pow(Math.abs(a), 2) + Math.pow(Math.abs(b), 2);
                    $scope.distance = Math.sqrt(c);
                }
                ;

                $scope.calculateRandomPoint = function () {
                    var fullScreenWidth = $(window).width();
                    var fullScreenHeight = $(window).height();
                    var randomWidth = (Math.floor(Math.random() * fullScreenWidth) + 1);
                    var randomHeight = (Math.floor(Math.random() * fullScreenHeight) + 1);
                    $scope.randomWidth = randomWidth;
                    $scope.randomHeight = randomHeight;
                };

                $scope.initAudio = function () {
                    $scope.cowAudio = [];
                    for (var i = 0; i < 13; i++)
                    {
                        var mySound = new buzz.sound(soundUrl + i + ".wav");
                        mySound.bind("ended", function (e) {
                            $scope.canPlay = true;
                        });
                        $scope.cowAudio.push(mySound);
                    }

                    window.cowAudio = $scope.cowAudio;
                }

                $scope.compareMusic = function (a, b) {
                    if (a.relations[0].properties.viewCount < b.relations[0].properties.viewCount)
                        return 1;
                    else if (a.relations[0].properties.viewCount > a.relations[0].properties.viewCount)
                        return -1;
                    else
                        return 0;

                };

                $scope.startBackroundMusic = function () {
                    var visitorInfo = Piwik.getAsyncTracker();
                    var taste = [];
                    var personalBPM = 130;
                    var xxx = musicSrv.getMusic(1, visitorInfo.getVisitorId()).then(function (response) {
                        if (response.status === 200)
                        {
                            taste = response;
                            if (taste.length > 2)
                            {
                                taste.shift();
                                taste.sort($scope.compareMusic);
                                personalBPM = taste[0].id;
                            } else
                            {
                                personalBPM = 130 // default
                            }
                        } else
                        {
                            // empty, use default
                        }

                        $scope.backgroundAudio2 = new buzz.sound(soundUrl + "fire" + "_" + personalBPM + ".wav");
                        $scope.personalAudioStream = new buzz.group($scope.backgroundAudio2);
                        $scope.personalAudioStream.setVolume(40).play();
                    });
                };

                $scope.stopBackroundMusic = function () {
                    $scope.personalAudioStream.stop();
                };

          


            



     
    //TODO normalize it
    $scope.checkDistance = function(x, y, forcePlay){
        calculateDistance(x,y);
        if($scope.distance<$scope.hotZone){
            document.body.style.cursor = "pointer";
            if($scope.soundPlaying){
                $scope.playSound("10", forcePlay);
            }
        }else if($scope.distance<88){
            if($scope.soundPlaying){
                $scope.playSound("10", forcePlay);
            }
            document.body.style.cursor = "default";
        }else if($scope.distance<130){
            if($scope.soundPlaying){
                $scope.playSound("9", forcePlay);
            }
            document.body.style.cursor = "default";
        }else if($scope.distance<170){
            if($scope.soundPlaying){
                $scope.playSound("8", forcePlay);
            }
            document.body.style.cursor = "default";
        }else if($scope.distance<210){
            if($scope.soundPlaying){
                $scope.playSound("7", forcePlay);
            }
            document.body.style.cursor = "default";
        }else if($scope.distance<250){
            if($scope.soundPlaying){
                $scope.playSound("6", forcePlay);
            }
            document.body.style.cursor = "default";
        }else if($scope.distance<280){
            if($scope.soundPlaying){
                $scope.playSound("5", forcePlay);
            }
            document.body.style.cursor = "default";
        }else if($scope.distance<310){
            if($scope.soundPlaying){
                $scope.playSound("4", forcePlay);
            }
            document.body.style.cursor = "default";
        }else if($scope.distance<340){
            if($scope.soundPlaying){
                $scope.playSound("3", forcePlay);
            }
            document.body.style.cursor = "default";
        }else{
            if($scope.soundPlaying){
                $scope.playSound("2", forcePlay);
            }
            document.body.style.cursor = "default";
        }
    };


    
    $scope.stopBackroundMusic = function(){
         $scope.personalAudioStream.stop();   
    };
    
    $scope.playSound = function (variable, forcePlay) {
        if(forcePlay || $scope.canPlay || variable > 11) {
            $scope.canPlay = false;
            musicSrv.bpm("knödel");
            $scope.cowAudio[variable].setVolume(100).play();
        }
    };


    $scope.initAudio();
    angular.element("#game").on("touchstart", $scope.onTouchmove);
}]);

