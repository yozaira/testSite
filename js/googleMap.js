var work = {
  "jobs": [
     {
      "employer": "Freelance",
      "title": "Web Developer",
      "dates": "Jan 2012- Present",
      "city": "Washington, DC",
      "description": "Lorem ipsum dolor sit amet, consectetaur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo ."
      }, {
      "employer": "USAID Child Health Integrated Program (MCHIP)",
      "title": "Communication & Social Media Assistant",
      "dates": "Jan 2010- November 2011",
      "city": "Atlanta, GA",
      "description": "Lorem ipsum dolor sit amet, consectetaur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo ."
      },{
      "employer": "Administrative Assistant",
      "title": "Communication and PR Assistant",
      "dates": "Feb 2008 - Dic 2009",
      "city": "Miami, Fl",
      "description": "Lorem ipsum dolor sit amet, consectetaur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo ."
      }
  ]
};


work.showJobsMap = function(work_obj) {   

  // to have only one InfoWindow open at a time, we need to declare a global
  // variable that will hold the InfoWindow object. This way nfoWindow object
  // can reused it over and over again on the map
  var infowindow;
  var map;
  var geocoder;     
  var bounds = new google.maps.LatLngBounds(); // LatLngBounds object
  var marker;
  var cities = [];  // array that will hold work location data


  // this function retrives location values (cities) from work 
  // object and passes values to city var array
  var getLocations = function ()  {
    for (var index in work_obj.jobs) {
      cities.push(work_obj.jobs[index].city); 
      // console.log(cities[index]);
    }
  }
  getLocations();

       
  function init() {
    // object literal containing the properties we want to pass to the map 
    // https://developers.google.com/maps/documentation/javascript/controls
    var options = {  
      zoom: 6,  
      center: new google.maps.LatLng(37.09, -95.71) , // usa coordinates   
      mapTypeId: google.maps.MapTypeId.ROADMAP,
      disableDefaultUI: true ,
      scrollwheel:false ,
      // draggable:false,
      // panControl: true,
      panControlOptions: {
        position: google.maps.ControlPosition.TOP_RIGHT     
      } ,
      zoomControl: true,
      zoomControlOptions: {
        style: google.maps.ZoomControlStyle.SMALL
        ,position: google.maps.ControlPosition.TOP_LEFT
      } ,
      mapTypeControl: true,
      mapTypeControlOptions: {
        style: google.maps.MapTypeControlStyle.HORIZONTAL_BAR,
        position: google.maps.ControlPosition.TOP_CENTER
      }
    };     
    // creating the map  
    map = new google.maps.Map(document.getElementById('map'), options);
    // use cities array to create the address on the map using google Geocoder object
    // https://developers.google.com/maps/documentation/javascript/geocoding
    createMapLocations(cities);
  }



  function addMarker(map, contentInfoWindow, geoLocation) {
    // center map
    map.setCenter(geoLocation);
    // add a marker to the map
    var marker = new google.maps.Marker({
      map: map,
      position: geoLocation, 
      animation: google.maps.Animation.DROP 
    });                                           
    // create the event listener. It now has access to the values of i and marker as they were during its creation
    google.maps.event.addListener(marker, 'click', function() { 
      if (typeof infowindow != 'undefined')  infowindow.close();
      infowindow = new google.maps.InfoWindow(); // creating the content of the InfoWindow
      infowindow.setContent(contentInfoWindow); // setting the content of the InfoWindow
      infowindow.open(map, marker); 
    });               
    // Extending the bounds object with each LatLng
    bounds.extend( geoLocation);    
    // Adjusting the map to new bounding box
    map.fitBounds(bounds);
  }



  function createMapLocations(location) {
    for(var i = 0; i < location.length; i++) {           
       // Wrapping the event listener inside an anonymous function that we immediately 
       // invoke and passes the variable i to.
       (function(i, marker) { 
        geocoder = new google.maps.Geocoder();  // instantiate a geocoder object  
        geocoder.geocode( { 'address': location[i] }, function(results, status) { 
          if(status == google.maps.GeocoderStatus.OK ) {
             // call addMarket function
             addMarker(map, location[i], results[0].geometry.location);
          }else {
            alert("Geocode was not successful for the following reason: " + status);      
          }         
        }); // geocode
      })(i, marker);
    } // end loop   
  } // end function


  // load the map when the document is loaded
  google.maps.event.addDomListener(window, 'load', init() );

}
work.showJobsMap(work);