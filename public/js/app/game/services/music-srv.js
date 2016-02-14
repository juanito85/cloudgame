angular.module('ds.game').factory('musicSrv', ['Restangular', 'MusicREST', function (Restangular, musicREST) {

        var musicSrv = {};

        musicSrv.count = 0;
        musicSrv.msecsFirst = 0;
        musicSrv.msecsPrevious = 0;
        musicSrv.supportedBPM = [90, 130, 142, 160, 180];
        musicSrv.lastBPM = 130;

        musicSrv.getLastBPM = function () {
            return musicSrv.lastBPM;
        }

        musicSrv.getMusic = function (speed, piwikId) {

            var x = musicREST.Music.all("stream/neighbours/cdm/Session/" + piwikId + "?include=relations/cdm/Session/cdm/Category/cdm/VIEWED").getList();


            return x;
        };


        musicSrv.getClosest = function (array, find) {
            return array.reduce(function (prev, curr) {
                return (Math.abs(curr - find) <= Math.abs(prev - find) ? curr : prev);
            });
        }

        musicSrv.bpm = function bpm(e)
        {
            musicSrv.timeSeconds = new Date;
            musicSrv.msecs = musicSrv.timeSeconds.getTime();
            if ((musicSrv.msecs - musicSrv.msecsPrevious) > 1000 * 4)
            {
                musicSrv.count = 0;
            }

            if (musicSrv.count == 0)
            {
                //document.TAP_DISPLAY.T_AVG.value = "First Beat";
                //document.TAP_DISPLAY.T_TAP.value = "First Beat";
                musicSrv.msecsFirst = musicSrv.msecs;
                musicSrv.count = 1;
            }
            else
            {
                musicSrv.bpmAvg = 60000 * musicSrv.count / (musicSrv.msecs - musicSrv.msecsFirst);
                //console.log("exact bpm: ", Math.round(musicSrv.bpmAvg * 100) / 100);
                //console.log("rounded bpm: ", Math.round(musicSrv.bpmAvg));
                //console.log("closest match: ", musicSrv.getClosest(musicSrv.supportedBPM, Math.round(musicSrv.bpmAvg)));
                musicSrv.lastBPM = musicSrv.getClosest(musicSrv.supportedBPM, Math.round(musicSrv.bpmAvg));
                musicSrv.count++;
                //document.TAP_DISPLAY.T_TAP.value = count;
            }
            musicSrv.msecsPrevious = musicSrv.msecs;
            return true;
        }




        return musicSrv;
    }]);

