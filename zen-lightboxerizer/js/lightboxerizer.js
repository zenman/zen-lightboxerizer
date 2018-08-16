document.addEventListener("DOMContentLoaded", function() {
	var lightboxables = [],
		lightbox_map = {},
		valid_images = ['jpg', 'jpeg', 'gif', 'png'];

	['.gallery', '.lightbox'].forEach(function(gal){
		var galleries = document.querySelectorAll(gal);
		if (galleries.length){
			for (var g = 0; g < galleries.length; g++) {
				lightboxables.push(galleries[g]);
			}
		}
	});

	if (lightboxables.length){
		for (var lb = 0, imgs; lb < lightboxables.length; lb++) {
			lightbox_map['gallery-'+lb] = [];

			imgs = lightboxables[lb].querySelectorAll('img');
			for (var i = 0; i < imgs.length; i++) {
				lightbox_map['gallery-'+lb].push(imgs[i]);
			}

			lightboxables[lb].addEventListener('click', lightboxit);
		}
	}

	var wp_captions = document.querySelectorAll('.wp-caption, .lightboxme');
	if (wp_captions.length){
		lightbox_map['singles'] = [];
		for (var c = 0, _img; c < wp_captions.length; c++) {
			_img = wp_captions[c].querySelector('img');
			if (_img.parentNode.nodeName === 'A' && _img.parentNode.href.indexOf(window.location.host) > -1 && valid_images.indexOf(_img.parentNode.href.substr(-3)) > -1){
				wp_captions[c].addEventListener('click', lightboxit);
				lightbox_map['singles'].push(_img);
			}
		}
	}

	if (Object.keys(lightbox_map).length){
		late_load_stylesheet();

		var lightbox = document.createElement('div'),
			lightbox_image_holder = document.createElement('figure'),
			lightbox_image = document.createElement('img'),
			loader = document.createElement('span'),
			prevBtn = document.createElement('span'),
			nextBtn = document.createElement('span'),
			nextNode,
			prevNode;

		lightbox.id = 'lightboxerizer';
		loader.className = 'lightboxerizer-loader';
		lightbox.appendChild(loader);
		lightbox.appendChild(lightbox_image_holder);
		lightbox_image_holder.appendChild(lightbox_image);
		prevBtn.className = 'prev'
		prevBtn.setAttribute('title', 'Display the previous image');
		lightbox.appendChild(prevBtn);
		nextBtn.className = 'next'
		nextBtn.setAttribute('title', 'Display the next image');
		lightbox.appendChild(nextBtn);
		lightbox.style.display = 'none';
		document.body.appendChild(lightbox);

		lightbox.addEventListener('click', function(evt){
			if (evt.target.nodeName === 'SPAN'){
				if (evt.target.className === 'prev') {
					lightboxupdate(prevNode);
				} else {
					lightboxupdate(nextNode);
				}
			} else {
				lightboxclose();
			}
		});

		document.addEventListener('keyup', lightboxkeys);
	}

	function lightboxit(e){
		if (e.target.nodeName === 'IMG' && window.innerWidth > 810){
			e.preventDefault();

			lightboxupdate(e.target);
			lightbox.classList.add('active');
		}
	}

	function lightboxupdate(clicked){
		if (!clicked.parentNode.href){
			return lightboxclose();
		}
		var img = new Image();
		img.src = clicked.parentNode.href;
		lightbox_image_holder.previousElementSibling.style.opacity = 1;
		lightbox_image.style.opacity = 0;

		lightboxindex(clicked);

		checkimg(img);
	}

	function lightboxindex(_img){
		var index;
		Object.keys(lightbox_map).some(function(scope){
			index = lightbox_map[scope].indexOf(_img);

			if (index > -1){
				nextNode = lightbox_map[scope][((index + 1) % lightbox_map[scope].length)];
				prevNode = lightbox_map[scope][((index + (lightbox_map[scope].length - 1)) % lightbox_map[scope].length)];
				return true;
			}
		});
	}

	function lightboxclose(evt){
		lightbox.classList.add('fading');
		lightbox.classList.remove('active');
		setTimeout(function(){
			if (lightbox.className !== 'active'){
				lightbox.classList.remove('fading');
				lightbox_image.src = '';
			}
		}, 800);
	}

	function lightboxkeys(evt){
		if (lightbox_image.src !== ''){
			var key = evt.which || evt.keyCode || 0;
			switch (key) {
				case 39: // ->
				case 75: // k
				case 68: // d
				case 61: // +
				case 107: // +
				case 190: // >
				case 34: // pagedown
					lightboxupdate(nextNode);
					break;
				case 37: // <-
				case 74: // j
				case 65: // a
				case 109: // -
				case 173: // -
				case 188: // <
				case 33: // pageup
					lightboxupdate(prevNode);
					break;
				case 27: // esc
				case 88: // x
				case 81: // q
				case 8: // backspace
					lightboxclose();
					break;
			}
		}
	}

	function checkimg(i){
		setTimeout(function(){
			if (i.complete){
				lightbox_image.src = i.src;
				lightbox_image.style.opacity = 1;
				lightbox_image_holder.previousElementSibling.style.opacity = 0;
			} else {
				checkimg(i);
			}
		}, 100);
	}

	function late_load_stylesheet(){
		var stylesheet = document.createElement('link');
		stylesheet.href = lightboxerizer.plugindir + '/css/lightboxerizer.min.css';
		stylesheet.type = 'text/css';
		stylesheet.rel = 'stylesheet';
		document.head.appendChild(stylesheet);
	}
});
