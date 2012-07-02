
$(function() {
	var map = new BMap.Map("map"), marker = {};
	map.centerAndZoom(new BMap.Point(116.404, 39.915), 15);
	map.addControl(new BMap.NavigationControl());
	map.addControl(new BMap.ScaleControl());
	map.addControl(new BMap.OverviewMapControl());
	map.addControl(new BMap.MapTypeControl());
	Map = window.Map = {
		map: map,
		marker: marker,
	};

	now.ready(function() {
		var userId = getCookie('userid');
		if (userId) {
			now.userId = userId;
			now.relateUser2Client(userId);
			now.getLastPosition(userId, function(points) {
				points.forEach(function(point) {
					updatePosition(point);
				});
			});
		}
	});
});

$(function(){
    $("img[rel=popover]").popover();
});

// generate baidu MapIcon, use 5 kind of color, green, blue, yellow, red, gray
function BMapIcon(color) {
	var icon, index;
	switch (color) {
	case 'green':
		index = 0;
		break;
	case 'blue':
		index = 1;
		break;
	case 'red':
		index = 2;
		break;
	case 'yellow':
		index = 3;
		break;
	case 'gray':
		index = 4;
		break;
	default:
		index = 0;
		break;
	}
	icon = new BMap.Icon("/public/images/color_points.png", new BMap.Size(16, 16), {
		imageOffset: new BMap.Size(0 - index * 16, 0)
	});
	return icon;
}

function trim(s) {
	return s.replace(/(^\s*)|(\s*$)/g, '');
}

function getCookie(name) {
	var cookie = document.cookie,
	cookies, item, i, j;
	if (cookie.indexOf(name) > - 1) {
		cookies = cookie.split(";");
		for (i = 0; i < cookies.length; i++) {
			item = cookies[i];
			if (item) {
				j = item.split('=');
				if (name == trim(j[0])) {
					return trim(j[1]);
				}
			}
		}
	}
}

function updatePosition(position) {
	console.log(position);
	/*
    position.timestamp = parseFloat(position.timestamp);
    position.longitude = parseFloat(position.longitude);
    position.latitude = parseFloat(position.latitude);
    position.elevation = parseFloat(position.elevation);
    position.accuray = parseFloat(position.accuray);
    position.speed = parseFloat(position.speed);
    */
	var marker = Map.marker['xz' + position.deviceid];
	var point = new BMap.Point(position.longitude, position.latitude);
	if (marker) {
		marker.setPosition(point);
	} else {
		marker = new BMap.Marker(point, {
            icon: BMapIcon('blue')
		});
		Map.marker['xz' + position.deviceid] = marker;
		Map.map.addOverlay(marker);
	}
	Map.map.panTo(point);
}

now.updatePosition = function(position) {
	updatePosition(position);
}

