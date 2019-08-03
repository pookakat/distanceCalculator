var key = 'X--17FIfEB0jb8zftNSdtPZyS2XzTHOhOmkwqaYgx5o';

var addresses = [
    {'name': 'Me',
    'address': '1407 Mangum Avenue, Creedmoor, NC',
    'waypoint': ''
    },
    {'name': 'Mom',
     'address': '813 Running Brook Trail, Raleigh, NC',
     'waypoint': ''
    },
    {'name': 'Beach',
     'address': '14 Bateau Road, Hilton Head, SC',
     'waypoint': ''
    },
    {'name': 'Den',
     'address': '618 West King Street, Boone, NC',
     'waypoint': ''
    },
    {'name': 'Childhood',
     'address': '8209 Holly Berry Ct, Raleigh, NC',
     'waypoint': ''
    }
];

$('#start-app').click(function(event){
    event.preventDefault(event);
    var name = $('#name').val().trim();
    var location = $('#location').val().trim();

    var newUser = {
        'name': name,
        'address': location,
        'waypoint': ''
    };
    addresses.unshift(newUser);
    finishStats(addresses);
});

const finishStats = async function(addresses){

    for (var i=0; i<addresses.length; i++){
        addresses[i].waypoint = await geoCodingFun(addresses[i]).then((waypoint)=>{
             return waypoint;
        });
    };
    makeDisplay(addresses);
};

const geoCodingFun = async function(address){
    var platform = new H.service.Platform({
    'apikey': `${key}`
    });

    var geocoder = platform.getGeocodingService();
    var geocodingParams = {
        searchText: `${address.address}`
    };
         
    var onResult = function(result){
        var locations = result.Response.View[0].Result;
        for (j = 0;  j < locations.length; j++) {
        var waypoint = `${locations[j].Location.DisplayPosition.Latitude.toFixed(2)}, ${locations[j].Location.DisplayPosition.Longitude.toFixed(2)}`;
        };
        return waypoint;
    };

    return await geocoder.geocode(geocodingParams, onResult, function(e){
        console.log(e);
    });
};


const makeDisplay = async function(addresses){
    var start = addresses[0].waypoint;
    $('ul').empty();
    for (var i=1; i<addresses.length; i++){
        var endPoint = addresses[i].name;
        console.log(endPoint);
        $('ul').append(`<li class="${endPoint}"></li>`)
        var end = addresses[i].waypoint;
        calcDistance(start, end, endPoint);
    }
}

const calcDistance = async function(waypoint0, waypoint1, divClass){
    console.log(divClass);
    console.log(waypoint0, waypoint1);
    var platform = new H.service.Platform({
        'apikey': `${key}`
        });
    
    var router = platform.getRoutingService();
    let distance;
    router.calculateRoute({
        'waypoint0' : `geo!${waypoint0.replace(/\s/g, "")}`,
        'waypoint1' : `geo!${waypoint1.replace(/\s/g, "")}`,
        mode: "fastest;car;traffic:disabled",
    }, 
    function(result){
        distance = result.response.route[0].summary.distance * 0.00062137;
        distance = distance.toFixed(2);
        $(`.${divClass}`).empty();
        if (distance <= 30){
        $(`.${divClass}`).append(`${divClass}: ${distance} miles away`);
        }
        else{
        $(`.${divClass}`).append(`${divClass}: Seriously! Do you really want to drive ${distance} miles??`);    
        }
    }, function(error){
        console.error(error);
    });
    
}