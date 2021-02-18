let map;
let displayState = false;
let mapElement = document.querySelector('#map');
let firstElement = document.querySelector('.first');
let inputBoxElement = document.querySelector("#pac-card");
let displayStoreElement = document.querySelector(".display-store");
let displayStoreAccorElement = displayStoreElement.querySelector('.accordion');
let centerGoElem = inputBoxElement.querySelector('.centerMove');
let inputElem = inputBoxElement.querySelector('#pac-input');
let currentCenter = { lat: 19.432608, lng: -99.133209 };
let bucketCont = inputBoxElement.querySelector('img.centerMove')
let currentZoomSet = 13;
let displayDistince = 5;
let markerStore = [];
inputElem.value = "";
let myHeaders = new Headers();
myHeaders.append("Authorization", "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJodHRwOi8vc2NoZW1hcy54bWxzb2FwLm9yZy93cy8yMDA1LzA1L2lkZW50aXR5L2NsYWltcy9uYW1lIjoiRHJlYW10ZW4gVXNlciIsImh0dHA6Ly9zY2hlbWFzLnhtbHNvYXAub3JnL3dzLzIwMDUvMDUvaWRlbnRpdHkvY2xhaW1zL2VtYWlsYWRkcmVzcyI6InVzZXJAZHJlYW10ZW4uY29tIiwiaHR0cDovL3NjaGVtYXMueG1sc29hcC5vcmcvd3MvMjAwNS8wNS9pZGVudGl0eS9jbGFpbXMvbmFtZWlkZW50aWZpZXIiOiI4IiwiaHR0cDovL3NjaGVtYXMubWljcm9zb2Z0LmNvbS93cy8yMDA4LzA2L2lkZW50aXR5L2NsYWltcy9yb2xlIjpbIkFkbWluaXN0cmF0b3IiLCJTaW0gQnVpbGRlciJdLCJleHAiOjE2MDA5MzM2MDYsImlzcyI6InByb2RpY3VzZ3JvdXAuY29tIiwiYXVkIjoicGctdXNlcnMifQ.g_AfNpo6bMhSKArQXcCR51bUTqABhguCnKTdn_rHfMs");
myHeaders.append("Cookie", "NID=204=hEYh-Eofh8PduDpIXZe_Gi5BquuXaIRIVkRYKpkxdMkosrvjcJheL_MxbFfxNfp-ACcegjD1iULKKMf5hsGD1MEB3A274cMqDc9j0b3SuDxsNASV_rvfxR46yVTFOuefr1TnBO7bQj3SoaSwD_z0Kioh-c0csH-C1JTAp4cqGfQ");

let requestOptions = {
  method: 'GET',
  headers: myHeaders,
  redirect: 'follow'
  // mode: "no-cors"
};
let responseDataFeed = {};
let responseDataEntry = {};
let mainResData = [];
fetch("https://spreadsheets.google.com/feeds/list/129jHCZrZYaiYpK8LJDToDG-weKH0mb6s_KLydPQNA8A/od6/public/basic?alt=json", requestOptions)
  .then(response => response.json())
  .then(result => {
    responseDataFeed = { feed } = result;
    responseDataEntry = { entry } = feed;
    let id = 0;
    for (const iterator of entry) {
      let string = iterator.content.$t;
      let properties = string.split(', ');
      let obj = {};
      let spam = [];
      properties.forEach((property) => {
        let tup = property.split(':');
        if (tup.length === 1) {
          spam.push(tup[0]);
        } else if (tup.length === 2) {
          obj[tup[0]] = tup[1].trim()
        } else if (tup.length === 3) {
          obj[tup[0]] = `${tup[1].trim()}:${tup[2].trim()}`
        }
      });
      // spam.push(obj.address);
      // [...obj.address] = spam;
      obj.id = id++;
      obj.latitude = parseFloat(obj.latitude);
      obj.longitude = parseFloat(obj.longitude);
      mainResData.push(obj);
      console.log(obj)
    }
    // currentCenter = { lat: mainResData[0].latitude, lng: mainResData[0].longitude };  
  })
  .catch(error => console.log('error', error));
  
  
  
let displayChange = () => {
  if (displayStoreElement.classList.contains('display') === false) displayStoreElement.classList.add('display');
  if (firstElement.classList.contains('display-change') === false) firstElement.classList.add('display-change');
  if (inputBoxElement.classList.contains('display-change') === false) inputBoxElement.classList.add('display-change');
  if (mapElement.classList.contains('display-change') === false) mapElement.classList.add('display-change');
}
let displayStore = () => {
  mainResData.sort((a, b) => {
    disA = distance(a.latitude, a.longitude, currentCenter.lat, currentCenter.lng, 'K');
    disB = distance(b.latitude, b.longitude, currentCenter.lat, currentCenter.lng, 'K');
    return disA - disB;
  });
  // mainResData.forEach(element => {
  //   console.log(distance(element.latitude, element.longitude, currentCenter.lat, currentCenter.lng, 'K'))
  // });
  markerStore = mainResData.filter( item => {
    return distance(item.latitude, item.longitude, currentCenter.lat, currentCenter.lng, 'K') < displayDistince;
  });
  displayStoreAccorElement.innerHTML = '';
  markerStore.forEach(element => {
    addStore(element);
  });
  // DrowCircle(mapOptions, map, place.geometry.location, displayDistince );
  let infowindow = new google.maps.InfoWindow();
  let marker1;
  for (const key in markerStore) {
    if (markerStore.hasOwnProperty(key)) {
      const element = markerStore[key];
      
      marker1 = new google.maps.Marker({
        position: new google.maps.LatLng(element.latitude,element.longitude),
        icon: {url:document.querySelector('.icon-temp img:nth-child(1)').src, scaledSize: new google.maps.Size(22, 32)},
        map: map
      });
      let dispContent = `<b>${element.name}</b><br> ${element.address}<br>${element.phone}`
      google.maps.event.addListener(marker1, 'click', (function (marker1, key) {
        return function () {
          if (window.innerWidth > 1024) {
            infowindow.setContent(dispContent);
            infowindow.open(map, marker1);  
          } else {
            // body.scrollTop = 500;
          }
        }
      })(marker1, key));
    }
  }
  let mapOptions = {
    zoom:currentZoomSet
  }
  // map.setZoom(currentZoomSet);
  // DrowCircle(map, currentCenter, displayDistince );
}

let addStore = (element) => {
  let storeElemet = document.createElement('div');
    storeElemet.className = "store accordion-item";
    storeElemet.dataset.id = element.id;
    // let address = element.address.map(element1 => {
    //   return `${element1},<br>`;
    // })
    storeElemet.innerHTML = `
      <div class="title">
        <div class="title__key" data-accordion='title'>${element.key}</div>
        <div class="title__name" data-accordion='title'>${element.name}</div>
      </div>
      <div class="content">
        <div class="content__address">${element.address}</div>
        <div class="content__address">${element.postalcode}</div>
        <div class="content__address">${element.suburb}</div>
        <div class="content__phone">${element.phone}</div>
        <a href=${element.website} class="content__text" target="_blink">CITIO WEB</a>
        <div class="content__awrap"><a class="content__go" href="https://www.google.com.mx/maps/place/${element.latitude},${element.longitude}/" target="_blank">planener ruta</a></div>
      </div>
    `;
    displayStoreAccorElement.append(storeElemet);
}

inputBoxElement.onclick = (event) => {
  if (event.target.classList.contains('centerMove')) {
    findPosition();
    // displayChange();
    // map.setCenter({lat: currentCenter.lat, lng: currentCenter.lng});
    map.setZoom(currentZoomSet);
    if (bucketCont.classList.contains('active') === false) {
      bucketCont.classList.add('active');
    }
  }
  if (event.target.classList.contains('button-click')) {
    findNearStore();
  }
  if (event.target.classList.contains('button-close')) {
    inputElem.value = '';
  }
}
displayStoreElement.onclick = function(event) {
  let target = event.target;

  if (target.dataset.accordion === 'title'){
    let storeItem = target.parentElement.parentElement;
    let storeId = storeItem.dataset.id;
    let accItem = displayStoreElement.querySelectorAll('.accordion-item');
    let [selectStore] = mainResData.filter(item => { return (item.id == storeId); });
    if (storeItem.classList.contains('active')) {
      storeItem.classList.remove('active');
      map.setCenter({lat: currentCenter.lat, lng: currentCenter.lng});
      currentZoomSet = 13
      map.setZoom(currentZoomSet);
    } else {
      accItem.forEach((el2) => el2.classList.remove("active"));
      storeItem.classList.add("active");
      map.setCenter({lat: selectStore.latitude, lng: selectStore.longitude});
      currentZoomSet = 16
      map.setZoom(currentZoomSet);
    }
  }
  if (target.className === 'more-button') {
    // console.log(target.parentElement.scrollTop);
    let storeElemet = document.createElement('div');
      storeElemet.className = "no";
    if (displayDistince === 5){
      displayDistince = 10;
      storeElemet.innerHTML = "";
      target.before(storeElemet);
    } 
    else if (displayDistince < 100){
      displayDistince += 10;
    } 
    else if (displayDistince === 100){
      
      storeElemet.innerHTML = "¡No hay tienda más!";
      target.before(storeElemet);
      displayDistince += 10;
    } else {

    }
    displayStore();
  }
  if (bucketCont.classList.contains('active') === true) {
    bucketCont.classList.remove('active');
  }
};
let findNearStore = () => {
  mainResData.sort((a, b) => {
    disA = distance(a.latitude, a.longitude, currentCenter.lat, currentCenter.lng, 'K');
    disB = distance(b.latitude, b.longitude, currentCenter.lat, currentCenter.lng, 'K');
    return disA - disB;
  });
  displayStoreAccorElement.innerHTML = '';
  addStore(mainResData[0]);
  map.setCenter({lat: mainResData[0].latitude, lng: mainResData[0].longitude});
  currentZoomSet = 16
  map.setZoom(currentZoomSet);
  let infowindow = new google.maps.InfoWindow();
  let dispContent = `<b>${mainResData[0].name}</b><br> ${mainResData[0].address}<br>${mainResData[0].phone}`
  marker2 = new google.maps.Marker({
    position: new google.maps.LatLng(mainResData[0].latitude,mainResData[0].longitude),
    icon: {url:document.querySelector('.icon-temp img:nth-child(1)').src, scaledSize: new google.maps.Size(22, 32)},
    map: map
  });
  marker2.addListener("click", () => {
    if (window.innerWidth > 1024) {
      infowindow.setContent(dispContent);
      infowindow.open(map, marker2);  
    } else {
      console.log(displayStoreElement.scrollTop);
    }
    
  });
}
// This example requires the Places library. Include the libraries=places
// parameter when you first load the API. For example:
// <script src="https://maps.googleapis.com/maps/api/js?key=YOUR_API_KEY&libraries=places">
function initMap() {
  map = new google.maps.Map(mapElement, {
    center: { lat: currentCenter.lat, lng: currentCenter.lng },
    zoom: 14,
    streetViewControl: false,
    fullscreenControl: false,
    mapTypeControl: false
    // streetViewControl: false,
    // disableDefaultUI: true
  });
  streetExcute();
}

let streetExcute = () => {
  const card = document.getElementById("pac-card");
  const input = document.getElementById("pac-input");
  // map.controls[google.maps.ControlPosition.TOP_RIGHT].push(card);
  // console.log(input.value);
  const autocomplete = new google.maps.places.Autocomplete(input);

  // Bind the map's bounds (viewport) property to the autocomplete object,
  // so that the autocomplete requests use the current map bounds for the
  // bounds option in the request.
  autocomplete.bindTo("bounds", map);
  // Set the data fields to return when the user selects a place.
  autocomplete.setFields(["address_components", "geometry", "icon", "name"]);
  const infowindow = new google.maps.InfoWindow();
  // const infowindowContent = document.getElementById("infowindow-content");
  // infowindow.setContent(infowindowContent);
  // const marker = new google.maps.Marker({
  //   map,
  //   icon: {url:document.querySelector('.icon-temp img:nth-child(2)').src, scaledSize: new google.maps.Size(32, 42)},
  //   // anchorPoint: new google.maps.Point(0, -29),
  // });
  // marker.addListener("click", () => {
  //   findNearStore();
  // });
  autocomplete.addListener("place_changed", () => {

    infowindow.close();
    // marker.setVisible(false);
    const place = autocomplete.getPlace();

    if (!place.geometry) {
      return;
    }
    displayState = true;
    displayChange();
    currentCenter.lat = place.geometry.location.lat();
    currentCenter.lng = place.geometry.location.lng();
    displayStore();

    // If the place has a geometry, then present it on a map.
    if (place.geometry.viewport) {
      map.fitBounds(place.geometry.viewport);
    } else {
      map.setCenter(place.geometry.location);
      map.setZoom(14); // Why 17? Because it looks good.
    }
    map.setZoom(currentZoomSet);
    marker.setPosition(place.geometry.location);
    marker.setVisible(true);
    let address = "";
    console.log(place.address_components);
    if (place.address_components) {
      address = [
        (place.address_components[0] &&
          place.address_components[0].short_name) ||
          "",
        (place.address_components[1] &&
          place.address_components[1].short_name) ||
          "",
        (place.address_components[2] &&
          place.address_components[2].short_name) ||
          "",
      ].join(" ");
    }
    // infowindowContent.children["place-icon"].src = place.icon;
    // infowindowContent.children["place-name"].textContent = place.name;
    // infowindowContent.children["place-address"].textContent = address;
    // infowindow.open(map, marker);
  });
  autocomplete.setTypes(["geocode"]);
}



window.onresize = resize;

function resize() {
  // console.log(window.innerWidth);
}

let findPosition = () => {
  let infowindow1 = new google.maps.InfoWindow();
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const pos = {
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        };
        
        console.log(pos);
        currentCenter.lat = position.coords.latitude;
        currentCenter.lng = position.coords.longitude;
        console.log(currentCenter);
        displayChange();
        // infowindow1.setPosition(currentCenter);
        // infowindow1.setContent("Location found.");
        // infowindow1.open(map);
        map.setCenter(currentCenter);
        // const marker = new google.maps.Marker({
        //   map,
        //   icon: {url:document.querySelector('.icon-temp img:nth-child(2)').src, scaledSize: new google.maps.Size(32, 42)},
        //   position: new google.maps.LatLng(currentCenter.lat,currentCenter.lng)
        // });
        // marker.addListener("click", () => {
        //   findNearStore();
        // });
        // marker.setMap(map);
      },
      // () => {
      //   handleLocationError(true, infoWindow1, map.getCenter());
      // }
    );
  } else {
    // Browser doesn't support Geolocation
    handleLocationError(false, infowindow1, map.getCenter());
  }
}
function handleLocationError(browserHasGeolocation, infowindow1, pos) {
  // infowindow1.setPosition(pos);
  // infowindow1.setContent(
  //   browserHasGeolocation
  //     ? "Error: The Geolocation service failed."
  //     : "Error: Your browser doesn't support geolocation."
  // );
  // infowindow1.open(map);
}
let distance = (lat1, lon1, lat2, lon2, unit) => {
    var radlat1 = Math.PI * lat1/180;
    var radlat2 = Math.PI * lat2/180;
    var radlon1 = Math.PI * lon1/180;
    var radlon2 = Math.PI * lon2/180;
    var theta = lon1-lon2;
    var radtheta = Math.PI * theta/180;
    var dist = Math.sin(radlat1) * Math.sin(radlat2) + Math.cos(radlat1) * Math.cos(radlat2) * Math.cos(radtheta);
    dist = Math.acos(dist);
    dist = dist * 180/Math.PI;
    dist = dist * 60 * 1.1515;
    if (unit == 'M') {
        dist = dist;
    }
    if (unit=='K') {
        dist = dist * 1.609344;
    }
    if (unit=='N') {
        dist = dist * 0.8684;
    }
    return dist;
}

function DrowCircle( map, pos, km ) {
  var populationOptions = {
    strokeColor: '#FF0000',
    strokeOpacity: 0.8,
    strokeWeight: 2,
    fillColor: '#440000',
    fillOpacity: 0.35,
    map: map,
    center: pos,
    radius: Math.sqrt(km*500) * 100
  };
  // Add the circle for this city to the map.
  cityCircle = new google.maps.Circle(populationOptions);
}

