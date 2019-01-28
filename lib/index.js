// This file is in the entry point in your webpack config.
import "./styles.scss";
$( document ).ready(function() {
  $("#background-image").fadeIn(1000);
  $("#title-pane").fadeIn(1000);
  $("#search-field").focus();
});

$("#search-submit").click(function(e){
  e.preventDefault()
  var query = $("#search-field").val()
  if (query != "") {
    var query_url = "https://sweaters-api.herokuapp.com/api/v1/forecast?location_query=" + query;
    $.ajax({url: query_url,
      success: function(result){
        window.forecast = result;
        $("#search-submit").find("i").removeClass("fa-spinner spinning").addClass("fa-search");
        presentForecast();
      },
      error: function(XMLHttpRequest, textStatus, errorThrown) {
        $("#search-submit").find("i").removeClass("fa-spinner spinning").addClass("fa-search");
        $("#notice").html("I don't think that's a real place...")
      }});
    $("#search-submit").find("i").removeClass("fa-search").addClass("fa-spinner spinning");
  }
});

$("#search-field").focus(function(e) {
  $(this).parents("#search").addClass("border-highlight");
});

$("#search-field").focusout(function(e) {
  $(this).parents("#search").removeClass("border-highlight");
});

function presentForecast(){
  $("#title-pane").fadeOut(function(){
    $('#content')
    $('#top-bar').prepend($('#search').addClass('brighter')).fadeIn();
    $('#small-logo').fadeIn();
    $('#forecasts').fadeIn(populateForecasts());
  });
  $("#top-spacer").fadeOut();
}

function populateForecasts(){
  var location = forecast.data.attributes.location;
  var now = new Date();
  $('#forecast-location').html(`
    <ul>
      <li><h2>${location.city}, ${location.state}</h2></li>
      <li>${location.country}</li><br>
      <li><h3>${dateString(now)}<h3></li>
      <li><h2>${timeString(now)}<h2></li>
    </ul>
  `);

  var localForecast = forecast.data.attributes.current;
  var todays_forecast = forecast.data.attributes.daily[0];
  $('#forecast-general').html(`
    <ul>
      <li>${localForecast.summary}</li>
      <li><h1>${parseInt(localForecast.temperature)}°</h1></li>
      <li>feels like ${parseInt(localForecast.apparentTemperature)}°</li>
      <li>High: ${parseInt(todays_forecast.temperatureHigh)}°, Low: ${parseInt(todays_forecast.temperatureLow)}°</li>
    </ul>
  `);

  $('#forecast-details').html(`
    <ul>
      <h3>Details</h3>
      <li>Wind: ${parseInt(localForecast.windSpeed)} mph</li>
      <li>Wind gusts up to ${parseInt(localForecast.windGust)} mph</li>
      <li>Humidity: ${parseInt(localForecast.humidity * 100)}%</li>
      <li>Visibility: ${parseInt(localForecast.visibility)} miles</li>
      <li>UV Index: ${parseInt(localForecast.uvIndex)}</li>
    </ul>
  `);

  var next = forecast.data.attributes.next.summary;
  $('#forecast-description').html(next);

  var hours = forecast.data.attributes.hourly;
  hours.shift();
  for (var i = 0; i < 11; i++) {
    var time = new Date(hours[i].time * 1000)
    time = time.toLocaleTimeString("en-US", {hour: '2-digit', minute:'2-digit'});
    $("#hourly-forecast").append(`
      <div class="hour-forecast">
      ${time}
        <h2>${parseInt(hours[i].temperature)}°</h2>
        ${hours[i].summary}
      </div>
    `)
  }

  var days = forecast.data.attributes.daily;
  days.shift();
  for (var i = 0; i < 6; i++) {
    var date = new Date(days[i].time * 1000);
    var weekday = date.toLocaleDateString("en-US", {weekday: 'long'});
    var shortDate = date.toLocaleDateString("en-US", {month: 'long', day: 'numeric'});
    var high = days[i].temperatureHigh;
    var low = days[i].temperatureLow;
    var summary = days[i].summary;
    $("#weekly-forecast").append(`
      <div class="days-forecast">
       <div class="weekday">
         <h3>${weekday}</h3>
           ${shortDate}
       </div>
       <div>High of ${high}°, low of ${low}°<br>${summary}</div>
      </div>
    `);
  }

}

function dateString(today) {
  var options = { year: 'numeric', month: 'long', day: 'numeric' };
  return today.toLocaleDateString("en-US", options)
}

function timeString(now){
  return now.toLocaleTimeString("en-US", {hour: '2-digit', minute:'2-digit'});
}
