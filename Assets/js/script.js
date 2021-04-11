var searchBtnEl = $('.searchBtn');
var searchInput = $(".searchInput");
var apiKey = "7e19f82278f9f51f7a7d15c164352f7f";
// Left column locations
var locationNameEl = $(".locationName");
var currentDateEl = $(".currentDate");
var currentTimeEl = $('.currentTime');
var weatherIconEl = $(".weatherIcon");
var searchHistoryEl = $(".historyItems");

// Right column locations
var temperatureEl = $(".temp");
var humidityEl = $(".humidity");
var windSpeedEl = $(".windSpeed");
var uvIndexEl = $(".uvIndex");
var cardRow = $(".card-row");

// Create a current date variable
var today = new Date();
var dd = String(today.getDate()).padStart(2, '0');
var mm = String(today.getMonth() + 1).padStart(2, '0');
var yyyy = today.getFullYear();
var today = mm + '/' + dd + '/' + yyyy;


// var locationNameEl = document.getElementById("searchInput");

// fetch('http://api.openweathermap.org/data/2.5/forecast?q=&appid=7e19f82278f9f51f7a7d15c164352f7f', {
//   method: 'GET',
//   credentials: 'same-origin', 
//   redirect: 'follow',
// })
//   .then(function (response) {
//     return response.json();
//   })
//   .then(function (data) {
//     console.log(data);
//     document.append(data);
//   });

  

 
  
//   searchBtnEl.on('click',function(e){
//  e.preventDefault();
//  var weatherData = $(".searchInput").val();
//  console.log(weatherData);

//  var url = "https://api.openweathermap.org/data/2.5/forecast?q="+weatherData+"&appid=7e19f82278f9f51f7a7d15c164352f7f";
//   if(weatherData == ""){
//       alert("Enter a city name");
//   }else{
//   fetch(url).then(function(response){
//       if(response.ok){
        
//           return response.json();
//       }else{
//           throw new Error(Error);
//       }
//     }).then(function(data){
//         console.log(data);
//         // window.localStorage.setItem('Data', JSON.stringify(data));
//         // localStorage.getItem('Data');


//     })
// }
//   });
function showClock() {
    var TicToc = moment().format('MMM DD, YYYY hh:mm:ssA');
    currentTimeEl.text(TicToc);
} setInterval(showClock, 500);

searchBtnEl.on("click", function(e) {
    e.preventDefault();
    if (searchInput.val() === "") {
        alert("Enter a city name");
        return;
    }
    // console.log("clicked button")
    weatherSearch(searchInput.val());
});

function activatePlacesSearch() {
    let options = {
        types: ['(regions)']
    };
    let input = document.getElementById('srch-gmap');
    let autocomplete = new google.maps.places.Autocomplete(input, options);
}

  $(document).on("click", ".historyEntry", function() {
    console.log("clicked history item")
    var thisElement = $(this);
    weatherSearch(thisElement.text());
})

function renderSearchHistory(locationName) {
    searchHistoryEl.empty();
    var searchHistoryArr = JSON.parse(localStorage.getItem("searchHistory"));
    for (var i = 0; i < searchHistoryArr.length; i++) {
        // We put newListItem in loop because otherwise the text of the li element changes, rather than making a new element for each array index
        var loggedData = $("<li>").attr("class", "historyEntry");
        loggedData.text(searchHistoryArr[i]);
        searchHistoryEl.prepend(loggedData);
    }
}
if (JSON.parse(localStorage.getItem("searchHistory")) === null) {
    console.log("Cannot Locate")
}else{
    console.log("loading");
    renderSearchHistory();
}


function renderWeatherData(locationName, cityTemp, cityHumidity, cityWindSpeed, cityWeatherIcon, uvVal) {
  locationNameEl.text(locationName)
    // currentDateEl.text(`(${today})`)
    temperatureEl.text(`Temperature: ${cityTemp} °F`);
    humidityEl.text(`Humidity: ${cityHumidity}%`);
    windSpeedEl.text(`Wind Speed: ${cityWindSpeed} MPH`);
    uvIndexEl.text(`UV Index: ${uvVal}`);
    // weatherIconEl.attr("src", cityWeatherIcon);
}

function weatherSearch(myCity) {
    var queryUrl = `https://api.openweathermap.org/data/2.5/weather?q=${myCity}&APPID=${apiKey}&units=imperial`;
    $.ajax({
        url: queryUrl,
        method: "GET"
    })
    .then(function(weatherData) {
        var cityObj = {
            locationName: weatherData.name,
            cityTemp: weatherData.main.temp,
            cityHumidity: weatherData.main.humidity,
            cityWindSpeed: weatherData.wind.speed,
            cityUVIndex: weatherData.coord,
            cityWeatherIconName: weatherData.weather[0].icon
        }
    var queryUrl = `https://api.openweathermap.org/data/2.5/uvi?lat=${cityObj.cityUVIndex.lat}&lon=${cityObj.cityUVIndex.lon}&APPID=${apiKey}&units=imperial`
    $.ajax({
        url: queryUrl,
        method: 'GET'
    })
    .then(function(uvData) {
        if (JSON.parse(localStorage.getItem("searchHistory")) == null) {
            var searchHistoryArr = [];
            // Keeps user from adding the same city to the searchHistory array list more than once
            if (searchHistoryArr.indexOf(cityObj.locationName) === -1) {
                searchHistoryArr.push(cityObj.locationName);
                // store our array of searches and save 
                localStorage.setItem("searchHistory", JSON.stringify(searchHistoryArr));
                var renderedWeatherIcon = `https:///openweathermap.org/img/w/${cityObj.cityWeatherIconName}.png`;
                renderWeatherData(cityObj.locationName, cityObj.cityTemp, cityObj.cityHumidity, cityObj.cityWindSpeed, renderedWeatherIcon, uvData.value);
                renderSearchHistory(cityObj.locationName);
            }else{
                var renderedWeatherIcon = `https:///openweathermap.org/img/w/${cityObj.cityWeatherIconName}.png`;
                renderWeatherData(cityObj.locationName, cityObj.cityTemp, cityObj.cityHumidity, cityObj.cityWindSpeed, renderedWeatherIcon, uvData.value);
            }
        }else{
            var searchHistoryArr = JSON.parse(localStorage.getItem("searchHistory"));
            // Keeps user from adding the same city to the searchHistory array list more than once
            if (searchHistoryArr.indexOf(cityObj.locationName) === -1) {
                searchHistoryArr.push(cityObj.locationName);
                // store our array of searches and save 
                localStorage.setItem("searchHistory", JSON.stringify(searchHistoryArr));
                var renderedWeatherIcon = `https:///openweathermap.org/img/w/${cityObj.cityWeatherIconName}.png`;
                renderWeatherData(cityObj.locationName, cityObj.cityTemp, cityObj.cityHumidity, cityObj.cityWindSpeed, renderedWeatherIcon, uvData.value);
                renderSearchHistory(cityObj.locationName);
            }else{
                var renderedWeatherIcon = `https:///openweathermap.org/img/w/${cityObj.cityWeatherIconName}.png`;
                renderWeatherData(cityObj.locationName, cityObj.cityTemp, cityObj.cityHumidity, cityObj.cityWindSpeed, renderedWeatherIcon, uvData.value);
            }
        }
    })
        
    });
    getFiveDayForecast();

    function getFiveDayForecast() {
        cardRow.empty();
        var queryUrl = `https://api.openweathermap.org/data/2.5/forecast?q=${myCity}&APPID=${apiKey}&units=imperial`;
        $.ajax({
            url: queryUrl,
            method: "GET"
        })
        .then(function(fiveDayReponse) {
            for (var i = 0; i != fiveDayReponse.list.length; i+=8 ) {
                var cityObj = {
                    date: fiveDayReponse.list[i].dt_txt,
                    icon: fiveDayReponse.list[i].weather[0].icon,
                    temp: fiveDayReponse.list[i].main.temp,
                    humidity: fiveDayReponse.list[i].main.humidity
                }
                var dateStr = cityObj.date;
                var trimmedDate = dateStr.substring(0, 10); 
                var weatherIco = `https:///openweathermap.org/img/w/${cityObj.icon}.png`;
                createForecastCard(trimmedDate, weatherIco, cityObj.temp, cityObj.humidity);
            }
        })
    }   
}

function createForecastCard(date, icon, temp, humidity) {

    // HTML elements we will create to later
    var fiveDaysCardEl = $("<div>").attr("class", "five-day-card");
    var dateCard = $("<h3>").attr("class", "card-text");
    var cardIcon = $("<img>").attr("class", "weatherIcon");
    var cardTemperature = $("<p>").attr("class", "card-text");
    var cardHumidity = $("<p>").attr("class", "card-text");

    cardRow.append(fiveDaysCardEl);
    dateCard.text(date);
    cardIcon.attr("src", icon);
    cardTemperature.text(`Temp: ${temp} °F`);
    cardHumidity.text(`Humidity: ${humidity}%`);
    fiveDaysCardEl.append(dateCard, cardIcon, cardTemperature, cardHumidity);
}