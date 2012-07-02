$(function() {
	setInterval(function() {
		var ul = $(".carousel-news > ul"),
		lastLi = ul.find("li:last"),
		height = lastLi.height();

		lastLi.clone().insertBefore(".carousel-news li:first");
		lastLi.remove();

		ul.css("top", - height + "px").animate({
			top: "+=" + height
		},
		800, function() {});
	},
	4000);
});

$(function() {
    turningPoker();
});

function turningPoker(){

    var icons = ["chrome", "ie", "firefox", "safari", "opera"],
        eq = randomInt(21),
        icon = icons[randomInt(5)];
    rotateHotUser(".hot-user div:eq(" + eq + ")", "/public/images/browser_icon/128-" + icon + ".png");
    setTimeout(function() {
        turningPoker();
	},
    randomInt() * 400);
}

function rotateHotUser(element, imageSrc) {
	var el = $(element),
	oldPic = el.find("img"),
	newPic = $('<a href="#"><img src="' + imageSrc + '" /></a>');
	el.css({
		"-webkit-transform": "rotateY(90deg)"
	});
	setTimeout(function() {
		el.html('<a href="#"><img src="' + imageSrc + '" /></a>');
		el.css({
			"-webkit-transform": "rotateY(0deg)"
		});
	},
	1000);
}

function randomInt(end, start) {
	if (typeof(start) == "undefined") {
		start = 0;
	}
	if (typeof(end) == "undefined") {
		end = 10;
	}
	return Math.floor(Math.random() * (end - start) + start);
}

