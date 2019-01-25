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
  
}
