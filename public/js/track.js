
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

});

function initTrack(){
    tracks = req;
}
