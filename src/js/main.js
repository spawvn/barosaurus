(function(){
    var appId = "278edd4ed5e7fe759066e58f7ebf261b";
    var endpoint = "http://api.openweathermap.org/data/2.5/";
    var forecastDetailsLimit = 5;
    // We use city IDs to avoid ambiguity in the results
    var cityIds = "2759794,703448,2643743,2267057,3128760";

    init();

    function init(){
        document.addEventListener("DOMContentLoaded", function(){
            var forceCache = false;
            getCitiesData(forceCache);
        });
    };

    function getCurrentTime(){
        // In minutes
        return Math.floor(new Date() / 60000);
    };

    function request(URL, method, onLoad, onError){
        var req = new XMLHttpRequest();
        req.onload = onLoad;
        req.onerror = onError;
        req.open(method, URL, true);
        req.send();
    };

    function getCitiesData(forceCache){
        var currentTime = getCurrentTime();
        var storedData = [];
        var storedDataTimeStamp = localStorage.getItem("citiesWeather_timeStamp") || 0;

        try {
            storedData = JSON.parse(localStorage.getItem("citiesWeather"));
        }
        catch (error) {
            console.log("Expected JSON");
            storedDataTimeStamp = 0;
        }

        // New data will be fetched only of there is no cached data, or if cache is more than 10 minutes old
        // This is in accordance with openweathermap.org API usage recommendations, to avoid API abuse
        if(currentTime - storedDataTimeStamp < 10) {
            // Use cached data
            renderList(storedData);
        }
        else {
            if(!forceCache) {
                // Fetch new data
                fetchCitiesData();
            }
            else {
                // Application can not start
                showCriticalError();
            }
        }
    };

    function fetchCitiesData(){
        var requestURL = endpoint + 'group?id='+cityIds+'&APPID='+appId+'&units=metric';

        function onLoad() {
            var data = JSON.parse(this.responseText);

            localStorage.setItem("citiesWeather", JSON.stringify(data.list));
            localStorage.setItem("citiesWeather_timeStamp", getCurrentTime());

            renderList(data.list);
        }
        function onError(err) {
            console.log('Fetch Error', err);
            // Try to fall back to cached data
            var forceCache = true;
            getCitiesData(forceCache);
        }

        request(requestURL, "get", onLoad, onError);
    };

    function fetchCityForecast(cityId){
        var requestURL = endpoint + 'forecast?id='+ cityId +'&appid='+ appId +'&units=metric';

        function onLoad() {
            var data = JSON.parse(this.responseText);
            renderCityForecast(cityId, data.list);
        }
        function onError(err) {
            console.log('Fetch Error', err);
        }

        request(requestURL, "get", onLoad, onError);
    };

    function renderList(list){
        var loader = document.getElementById("loader-main");
        var container = document.getElementById("city-list");
        if (!loader || !container) return;

        container.innerHTML = "";
        list.forEach(function(item){
            var el = document.createElement("div");
            el.className = "city-item";
            el.onclick = function(){
                fetchCityForecast(item.id);
            };

            var template = '<h3 class="city-title">'+ item.name +'</h3>'+
                '<img class="weather-icon" src="https://openweathermap.org/img/w/'+ item.weather[0].icon +'.png">'+
                '<div class="city-temp">'+ Math.round(item.main.temp) +'°C</div>'+
                '<div class="city-wind-strength">Wind: '+ item.wind.speed +' m/s</div>'+
                '<div id="city-details-'+ item.id +'" class="city-details hidden"></div>';

            el.innerHTML = template;
            container.appendChild(el);
        });

        loader.classList.add("hidden");
        container.classList.remove("hidden");
    };

    function renderCityForecast(cityId, list){
        list.length = forecastDetailsLimit;
        var container = document.getElementById("city-details-" + cityId);
        if (!container) return;

        var template = "";
        list.forEach(function(item){
            var time = item.dt_txt.substr(11, 5);
            var temp = Math.round(item.main.temp);
            template += '<div class="details-item">' +
                '<span class="details-time">'+ time +'</span>' +
                '<span class="details-temp">'+ temp +'°C</span>' +
            '</div>'
        });

        container.innerHTML = template;
        // Make sure to hide only the items that need hiding
        var visibleItems = document.querySelectorAll(".city-details:not(.hidden)");
        visibleItems.forEach(function(i){
            i.classList.add("hidden");
        });
        container.classList.remove("hidden");
    };

    function showCriticalError() {
        var loader = document.getElementById("loader-main");
        var errorContainer = document.getElementById("error-container");
        errorContainer.innerHTML = "We are truly sorry, but current weather is a mystery to us at the moment.<br/>" +
            "Meanwhile, consider looking out the window.";

        loader.classList.add("hidden");
        errorContainer.classList.remove("hidden");
    };
})();
