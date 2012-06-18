
$(function(){
    var map = new BMap.Map("map"), marker = {}, icon;
    map.centerAndZoom(new BMap.Point(116.404, 39.915), 15);
    map.addControl(new BMap.NavigationControl());  
    map.addControl(new BMap.ScaleControl());  
    map.addControl(new BMap.OverviewMapControl());  
    map.addControl(new BMap.MapTypeControl());  
    icon = new BMap.Icon("/public/images/point.png", new BMap.Size(10, 10));

    Map = window.Map = {
        map: map,
        marker: marker,
        icon: icon
    };

    now.ready(function(){
        var userId = getCookie('userid');    
        if(userId){
            now.userId = userId;
            now.relateUser2Client(userId);
            now.getLastPosition(userId, function(points){
                points.forEach(function(point){
                    updatePosition(point); 
                });
            });
        }
    });
});

function trim(s){
    return s.replace(/(^\s*)|(\s*$)/g, '');
}

function getCookie(name){
    var cookie = document.cookie, cookies, item, i, j;
    if(cookie.indexOf(name) > -1){
        cookies = cookie.split(";");
        for(i = 0; i < cookies.length; i++){
            item = cookies[i];
            if(item){
                j = item.split('=');
                if(name == trim(j[0])){
                    return trim(j[1]);
                }
            }
        }
    } 
}

function updatePosition(position){
    var marker = Map.marker['xz' + position.deviceid];
    var point = new BMap.Point(position.longitude, position.latitude);
    if(marker){
        marker.setPosition(point);
    } else {
        marker = new BMap.Marker(point, {icon: Map.icon});
        Map.marker['xz' + position.deviceid] = marker;
        Map.map.addOverlay(marker);
        Map.map.panTo(point);
    }
}

now.updatePosition = function(position){
    console.log(position)
    // TODO 
}
