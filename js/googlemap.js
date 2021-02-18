// Initialize and add the map
var map;
var marker;
var init = 0;

$(document).on('change', '#addline1', function () {
  var add = $('#addline1').val();
  getLatLong(add);
})
$(document).on('change', '#country_selector', function () {
  if(init == 1)
  {
    var add = $('#addline1').val();
    getLatLong(add);
  }
})

// $(document).on('change', '#cp', function () {
//   var cp = $('#cp').val();
//   getLatLong(cp);
// })

//get map from country name and cp
// function getLatLong(cp)
// {
//     var geocoder = new google.maps.Geocoder();
//     var countryData = $("#country_selector").countrySelect("getSelectedCountryData");
//     var cou = countryData['iso2'];
//     geocoder.geocode( { componentRestrictions: { 
//       country: cou, 
//       postalCode: cp
//   }  }, function(results, status) {
//         if (status == google.maps.GeocoderStatus.OK) {
//             var lat = results[0].geometry.location.lat();
//             var lng = results[0].geometry.location.lng();
//             result = {lat:lat, lng:lng};
//             console.log(result);
//             map.setCenter(result);
//             map.setZoom(10);
//             marker.setPosition(result);
//             marker.setVisible(true);    
//         } else {
//           console.log(status);
//             result = "Unable to find address: " + status;
//         }
//     });
// }
function initMap() {
  // The location of Uluru
  var lat = parseFloat($('#lat').val());
  var lng = parseFloat($('#lng').val());
  if(isNaN(lat))
    lat = 0;
  if(isNaN(lng))
    lng = 0;
  
  result = {lat:lat, lng: lng};
  // The map, centered at Uluru
  map = new google.maps.Map(
    document.getElementById('map'), {zoom: 15, center: result});
  // The marker, positioned at Uluru
  marker = new google.maps.Marker({position: result, map: map});
}


function getLatLong(add)
{
    var geocoder = new google.maps.Geocoder();
    // var countryData = $("#country_selector").countrySelect("getSelectedCountryData");
    // var cou = countryData['iso2'];
    var cou = $("#country_selector").val();
    add = add + ' ' + cou;
    geocoder.geocode( { address: add }, function(results, status) {
        if (status == google.maps.GeocoderStatus.OK) {
            var lat = results[0].geometry.location.lat();
            var lng = results[0].geometry.location.lng();
            result = {lat:lat, lng:lng};
            map.setCenter(result);
            map.setZoom(15);
            marker.setPosition(result);
            marker.setVisible(true);    
            var lat = marker.getPosition().lat();
            var lng = marker.getPosition().lng();
            $('#lat').val(lat);
            $('#lng').val(lng);
        } else {
            result = "Unable to find address: " + status;
        }
    });
    init = 1;
}

