// This file is in the entry point in your webpack config.
import "./styles.scss";
$( document ).ready(function() {
  $("#background-image").fadeIn(1000);
  $("#title-pane").fadeIn(1000);
});

$("#search-submit").click(function(e){
  e.preventDefault()
  $.ajax({url: "https://sweaters-api.herokuapp.com/api/v1/forecast?city=denver&state=cogit ", success: function(result){
    console.log(result);
  }});
});
