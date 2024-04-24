/* * ==========================================================================
 * ==========================================================================
 * ==========================================================================
 * 
 * Harizma – Agency HTML5 Template
 * 
 * [Table of Contents]
 * 
 * 1. ArticleProject
 * 2. AsideCounters
 * 3. Burger
 * 4. Counter
 * 5. Form
 * 6. gmap
 * 7. Grid
 * 8. Header
 * 9. lazyLoad
 * 10. MenuOverlay
 * 11. Preloader
 * 12. ScrollDown
 * 13. lockScroll
 * 14. createOSScene
 * 15. ScrollUp
 * 16. SectionBlog
 * 17. SectionIntro
 * 18. SectionLatestProjects
 * 19. SectionPortfolio
 * 20. SectionServices
 * 21. sectionServicesTabs
 * 22. SectionTestimonials
 * 23. sliderGallery
 * 24. sliderImages
 * 25. SliderIntroBackgrounds
 * 26. SliderIntroContent
 * 27. SliderProjectBackgrounds
 * 28. SliderProjectContent
 * 29. SliderProjects
 * 30. SliderServices
 * 31. SliderTestimonials
 * 32. Tabs

 * ==========================================================================
 * ==========================================================================
 * ==========================================================================
 */

'use strict';

var $document = $(document);

/**
 * Default Theme Options
 * Used to prevent errors if there is
 * no data provided from backend
 */

if (typeof window.theme === 'undefined') {
	window.theme = {
		colors: {
			accentPrimary: '#1869ff',
		},
		typography: {
			fontPrimary: 'Open Sans',
			fontSecondary: 'Montserrat'
		}
	}
}

/**
 * ScrollMagic Setup
 */
window.SMController = new ScrollMagic.Controller();
window.SMSceneTriggerHook = 0.85;
window.SMSceneReverse = false;

/**
 * Theme Fonts
 */
window.fontPrimaryObserver = new FontFaceObserver(window.theme.typography.fontPrimary).load();
window.fontSecondaryObserver = new FontFaceObserver(window.theme.typography.fontSecondary).load();

Preloader();

$document.ready(function () {

	new AsideCounters($document);
	new ArticleProject($document);
	new Burger();
	new SectionBlog($document);
	new SectionIntro($document);
	new SectionLatestProjects($document);
	new SectionServices($document);
	new SectionServicesTabs($document);
	new SectionPortfolio($document);
	new ScrollUp();
	new Form();
	new GMap($document);
	new SectionTestimonials($document);
	new MenuOverlay();

});

/* ======================================================================== */
/* 1. ArticleProject */
/* ======================================================================== */
var ArticleProject = function ($scope) {

	var $target = $scope.find('.project');

	if (!$target.length) {
		return;
	}

	createSlider();

	function createSlider() {

		var
			$sliderImages = $target.find('.js-slider-images'),
			sliderImages = new SliderImages($sliderImages);

		// start from 2nd slide to not show empty space
		// from the left
		sliderImages.slideTo(1);

	}

}

/* ======================================================================== */
/* 2. AsideCounters */
/* ======================================================================== */
var AsideCounters = function ($scope) {

	var $target = $scope.find('.aside-counters');

	if (!$target) {
		return;
	}

	var $counter = $scope.find('.js-counter');

	$counter.each(function () {

		new Counter($(this));

	});

}

/* ======================================================================== */
/* 3. Burger */
/* ======================================================================== */
var Burger = function () {

	var
		OPEN_CLASS = 'burger_opened',
		$overlay = $('.header__wrapper-overlay-menu');

	var header = new Header();

	$(document).on('click', '.js-burger', function (e) {

		e.preventDefault();

		if (!$overlay.hasClass('in-transition')) {

			var $burger = $(this);

			if ($burger.hasClass(OPEN_CLASS)) {
				$burger.removeClass(OPEN_CLASS);
				header.closeOverlayMenu();
			} else {
				$burger.addClass(OPEN_CLASS);
				header.openOverlayMenu();
			}

		}

	});

}

/* ======================================================================== */
/* 4. Counter */
/* ======================================================================== */
var Counter = function ($target) {

	var $num = $target.find('.js-counter__number');

	if (!$target.length || !$num.length) {
		return;
	}

	var
		numberStart = $target.data('counter-start') || 0,
		numberTarget = $target.data('counter-target') || 100,
		animDuration = $target.data('counter-duration') || 4,
		counter = {
			val: numberStart
		};

	setCounterUp();
	animateCounterUp();

	function setCounterUp() {

		$num.text(numberStart.toFixed(0));

	}

	function animateCounterUp() {

		var tl = new TimelineMax();

		tl.to(counter, animDuration, {
			val: numberTarget.toFixed(0),
			ease: Power4.easeOut,
			onUpdate: function () {
				$num.text(counter.val.toFixed(0));
			}
		});

		createOSScene($target, tl);

	}

}

/* ======================================================================== */
/* 5. Form */
/* ======================================================================== */
var Form = function () {

	var $form = $('.js-ajax-form');

	if (!$form.length) {
		return;
	}

	$form.on('submit', function (e) {
		e.preventDefault();
	});

	validateForm();

	function validateForm() {

		$form.validate({
			errorElement: 'span',
			errorPlacement: function (error, element) {
				error.appendTo(element.parent()).addClass('form-control__error');
			},
			submitHandler: function (form) {
				ajaxSubmit();
			}
		});

	}

	function ajaxSubmit() {

		$.ajax({
			type: $form.attr('method'),
			url: $form.attr('action'),
			data: $form.serialize()
		}).done(function () {
			alert($form.attr('data-message-success'));
			$form.trigger('reset');
			floatLabels();
		}).fail(function () {
			alert($form.attr('data-message-error'));
		});
	}

}

/* ======================================================================== */
/* 6. gmap */
/* ======================================================================== */
var GMap = function ($scope) {

	var
		$wrapper = $scope.find('.gmap'),
		prevInfoWindow = false;

	if (typeof google === 'undefined' || typeof google.maps === 'undefined') {
		return;
	}

	createMap($wrapper);

	/**
	 * 
	 * @param {Map jQuery Object} $wrapper 
	 */
	function createMap($wrapper) {

		var $mapContainer = $wrapper.find('.gmap__container');

		if (!$mapContainer.length) {
			return;
		}

		var
			$markers = $wrapper.find('.gmap__marker'),
			ZOOM = parseInt($wrapper.attr('data-gmap-zoom')),
			SNAZZY_STYLES = $wrapper.attr('data-gmap-snazzy-styles');

		var argsMap = {
			center: new google.maps.LatLng(0, 0),
			zoom: ZOOM,
		};

		if (SNAZZY_STYLES) {

			try {
				SNAZZY_STYLES = JSON.parse(SNAZZY_STYLES);
				$.extend(argsMap, {
					styles: SNAZZY_STYLES
				});
			} catch (err) {
				console.error('Google Map: Invalid Snazzy Styles');
			}

		};

		var map = new google.maps.Map($mapContainer[0], argsMap);

		map.markers = [];

		$markers.each(function () {
			createMarker($(this), map);
		});

		centerMap(ZOOM, map);

	}

	/**
	 * 
	 * @param {Marker jQuery object} $marker 
	 * @param {Google Map Instance} map
	 */
	function createMarker($marker, map) {

		if (!$marker.length) {
			return;
		}

		var
			MARKER_LAT = parseFloat($marker.attr('data-marker-lat')),
			MARKER_LON = parseFloat($marker.attr('data-marker-lon')),
			MARKER_IMG = $marker.attr('data-marker-img'),
			MARKER_WIDTH = $marker.attr('data-marker-width'),
			MARKER_HEIGHT = $marker.attr('data-marker-height'),
			MARKER_CONTENT = $marker.attr('data-marker-content');

		/**
		 * Marker
		 */
		var argsMarker = {
			position: new google.maps.LatLng(MARKER_LAT, MARKER_LON),
			map: map
		};

		if (MARKER_IMG) {

			$.extend(argsMarker, {
				icon: {
					url: MARKER_IMG
				}
			});

		}

		if (MARKER_IMG && MARKER_WIDTH && MARKER_HEIGHT) {

			$.extend(argsMarker.icon, {
				scaledSize: new google.maps.Size(MARKER_WIDTH, MARKER_HEIGHT)
			});

		}

		var marker = new google.maps.Marker(argsMarker)

		map.markers.push(marker);

		/**
		 * Info Window (Content)
		 */
		if (MARKER_CONTENT) {

			var infoWindow = new google.maps.InfoWindow({
				content: MARKER_CONTENT
			});

			marker.addListener('click', function () {

				if (prevInfoWindow) {
					prevInfoWindow.close();
				}

				prevInfoWindow = infoWindow;

				infoWindow.open(map, marker);

			});

		}

	}

	/**
	 * 
	 * @param {Map Zoom} zoom 
	 * @param {Google Map Instance} map
	 */
	function centerMap(zoom, map) {

		var
			bounds = new google.maps.LatLngBounds(),
			newZoom;

		$.each(map.markers, function () {

			var item = this;
			newZoom = new google.maps.LatLng(item.position.lat(), item.position.lng());
			bounds.extend(newZoom);

		});

		if (map.markers.length == 1) {

			map.setCenter(bounds.getCenter());
			map.setZoom(zoom);

		} else {

			map.fitBounds(bounds);

		}
	}

}

/* ======================================================================== */
/* 7. Grid */
/* ======================================================================== */
var Grid = function ($grid) {

	var $target = $grid;

	if (!$target.length) {
		return;
	}


	var masonryGrid = $target.masonry({
		itemSelector: '.js-grid__item',
		columnWidth: '.js-grid__sizer',
		percentPosition: true
	});

	$target.find('.lazy-masonry').Lazy({
		afterLoad: function () {
			masonryGrid.masonry('layout');
		}
	});

	return masonryGrid;

}

/* ======================================================================== */
/* 8. Header */
/* ======================================================================== */
var Header = function () {

	var
		$body = $('body'),
		$overlay = $('.header__wrapper-overlay-menu');

	if (!$overlay.length) {
		return;
	}

	var
		$pageWrapper = $('.page-wrapper'),
		$menu = $('.js-menu-overlay'),
		$menuLinks = $overlay.find('.menu-overlay > li > a .menu-overlay__item-wrapper'),
		$linksTop = $menu.find('> li > a'),
		$submenu = $overlay.find('.menu-overlay .sub-menu'),
		$submenuButton = $overlay.find('.js-submenu-back'),
		$submenuLinks = $submenu.find('> li > a .menu-overlay__item-wrapper'),
		$curtain1 = $overlay.find('.header__diagonal-curtain-1'),
		$curtain2 = $overlay.find('.header__diagonal-curtain-2'),
		$background = $overlay.find('.header__wrapper-background'),
		$backgrounds = $overlay.find('.header__background'),
		$overlayBackgrounds = $overlay.find('.header__overlay'),
		$overlayWidgets = $overlay.find('.header__wrapper-overlay-widgets');

	setOverlayMenu();

	if ($backgrounds.length) {
		hoverBackgrounds();
	}

	function setOverlayMenu() {

		TweenMax.set([$overlay, $overlayBackgrounds], {
			autoAlpha: 0
		});

		TweenMax.set([$menuLinks, $submenuLinks], {
			y: '100%'
		});

		TweenMax.set($overlayWidgets, {
			y: '10px',
			autoAlpha: 0
		});

		TweenMax.set([$submenu, $submenuButton], {
			autoAlpha: 0,
			x: '10px'
		});

		TweenMax.set($backgrounds, {
			autoAlpha: 0,
			scale: 1.1
		});

		TweenMax.set($curtain1, {
			x: '-50%',
		});

		TweenMax.set($curtain2, {
			x: '50%',
		});

	}

	this.closeOverlayMenu = function () {

		lockScroll(false);

		var tl = new TimelineMax();

		tl.timeScale(1.5);

		tl
			// .set($body, {
			// 	className: '-=body_lock-scroll'
			// })
			.set($overlay, {
				className: '+=in-transition',
			})
			.set($pageWrapper, {
				// display: 'block',
				className: '-=page-wrapper_hidden',
			})
			.to([$menuLinks, $submenuLinks], 0.6, {
				y: '-100%',
				ease: Power4.easeIn
			})
			.to($overlayWidgets, 0.6, {
				y: '-10px',
				autoAlpha: 0
			}, '-=0.3')
			.to($submenuButton, 0.6, {
				x: '-10px',
				autoAlpha: 0
			}, 0)
			.set($overlayBackgrounds, {
				autoAlpha: 0
			})
			.set($background, {
				backgroundColor: 'transparent'
			})
			.to($backgrounds, 1, {
				autoAlpha: 0,
				scale: 1.1,
				ease: Power4.easeOut,
			}, 0.4)
			.to($curtain1, 1, {
				x: '-50%',
				right: '20%',
				ease: Expo.easeInOut,
			}, 0.6)
			.to($curtain2, 1, {
				x: '50%',
				left: '80%',
				ease: Expo.easeInOut,
			}, 0.6)
			.set($overlay, {
				className: '-=in-transition'
			})
			.add(function () {
				setOverlayMenu();
			});

	};

	this.openOverlayMenu = function () {

		lockScroll(true);

		var tl = new TimelineMax();

		tl
			// .set($body, {
			// 	className: '+=body_lock-scroll'
			// })
			.set($overlay, {
				className: '+=in-transition',
				autoAlpha: 1
			})
			.to([$curtain1, $curtain2], 1, {
				x: '0%',
				ease: Expo.easeInOut,
			})
			.to($overlayBackgrounds, 0.3, {
				autoAlpha: 1
			})
			.staggerTo($menuLinks, 0.6, {
				y: '0%',
				ease: Power4.easeOut,
			}, .075, 0.8)
			.to($overlayWidgets, 0.6, {
				y: '0px',
				autoAlpha: 1
			}, '-=0.3')
			.to($background, 0.3, {
				backgroundColor: '#181818'
			})
			.set($pageWrapper, {
				// display: 'none',
				className: '+=page-wrapper_hidden',
			})
			.set($overlay, {
				className: '-=in-transition'
			});

	};

	function hoverBackgrounds() {

		$linksTop
			.on('mouseenter click', function () {

				if (Modernizr.mq('(min-width: 768px)')) {

					var
						postId = $(this).data('post-id'),
						$targetBackground = $backgrounds.filter('[data-header-background-for="' + postId + '"]');

					if (!$targetBackground.length) {
						return;
					}

					TweenMax.to($curtain1, 0.6, {
						right: '50%',
						ease: Expo.easeInOut
					});

					TweenMax.to($curtain2, 0.6, {
						left: '100%',
						ease: Expo.easeInOut
					});

					TweenMax.to($targetBackground, 0.6, {
						autoAlpha: 1,
						scale: 1,
						ease: Expo.easeInOut,
					});

				}

			})
			.on('mouseleave', function () {

				var $openedSubmenus = $('.sub-menu.opened');

				if ($openedSubmenus.length) {
					return;
				}

				var
					postId = $(this).data('post-id'),
					$targetBackground = $backgrounds.filter('[data-header-background-for="' + postId + '"]');

				TweenMax.to($curtain1, 0.6, {
					right: '20%',
					ease: Expo.easeInOut
				});

				TweenMax.to($curtain2, 0.6, {
					left: '80%',
					ease: Expo.easeInOut
				});

				TweenMax.to($targetBackground, 0.6, {
					autoAlpha: 0,
					scale: 1.1,
					ease: Expo.easeInOut,
				});

			});

	}

}

/* ======================================================================== */
/* 9. lazyLoad */
/* ======================================================================== */
function lazyLoad($scope, $elements, cb) {

	if (!$scope) {
		var $scope = $(document);
	}

	if (!$elements) {
		var $elements = $scope.find('.lazy');
	}

	$elements.Lazy({
		afterLoad: function (el) {

			if ($(el).hasClass('jarallax')) {
				$(el).jarallax();
			}

			if (cb !== undefined) {
				cb();
			}

		}
	});

}

/* ======================================================================== */
/* 10. MenuOverlay */
/* ======================================================================== */
var MenuOverlay = function () {

	var $menu = $('.js-menu-overlay');

	if (!$menu.length) {
		return;
	}

	var
		$overlay = $('.header__wrapper-overlay-menu'),
		$links = $menu.find('.menu-item-has-children > a'),
		$submenus = $menu.find('.sub-menu'),
		$submenuButton = $('.js-submenu-back'),
		$curtain1 = $overlay.find('.header__diagonal-curtain-1'),
		$curtain2 = $overlay.find('.header__diagonal-curtain-2'),
		$backgrounds = $overlay.find('.header__background'),
		OPEN_CLASS = 'opened',
		tl = new TimelineMax();

	function openSubmenu($submenu, $currentMenu) {

		var
			$currentLinks = $currentMenu.find('> li > a .menu-overlay__item-wrapper'),
			$submenuLinks = $submenu.find('> li > a .menu-overlay__item-wrapper');

		tl
			.set($overlay, {
				className: '+=in-transition',
			})
			.set($submenu, {
				autoAlpha: 1,
				zIndex: 100,
				y: '0px'
			})
			.to($currentLinks, 0.6, {
				y: '-100%',
				ease: Power4.easeIn
			}, '-=0.3')
			.staggerTo($submenuLinks, 0.6, {
				y: '0%',
				ease: Power4.easeOut
			}, 0.05)
			.set($overlay, {
				className: '-=in-transition',
			});

		$submenus.removeClass(OPEN_CLASS);
		$submenu.not($menu).addClass(OPEN_CLASS);

		if ($submenus.hasClass(OPEN_CLASS)) {
			tl.to($submenuButton, 0.3, {
				autoAlpha: 1,
				x: '0px'
			}, '-=0.6');
		} else {
			tl.to($submenuButton, 0.3, {
				autoAlpha: 0,
				x: '-10px'
			}, '-=0.6');
		}

	}

	function closeSubmenu($submenu, $currentMenu) {

		var
			$currentLinks = $currentMenu.find('> li > a .menu-overlay__item-wrapper'),
			$submenuLinks = $submenu.find('> li > a .menu-overlay__item-wrapper');

		tl
			.set($overlay, {
				className: '+=in-transition',
			})
			.set($submenu, {
				zIndex: -1
			})
			.to($submenuLinks, 0.6, {
				y: '100%',
				ease: Power4.easeIn
			}, '-=0.3')
			.staggerTo($currentLinks, 0.6, {
				y: '0%',
				ease: Power4.easeOut
			}, 0.05)
			.set($submenu, {
				autoAlpha: 0,
				y: '10px'
			})
			.set($overlay, {
				className: '-=in-transition',
			});

		$submenus.removeClass(OPEN_CLASS);
		$currentMenu.not($menu).addClass(OPEN_CLASS);

		if ($submenus.hasClass(OPEN_CLASS)) {
			TweenMax.to($submenuButton, 0.3, {
				autoAlpha: 1,
				x: '0px'
			}, '-=0.6');
		} else {

			TweenMax.to($submenuButton, 0.3, {
				autoAlpha: 0,
				x: '-10px'
			}, '-=0.6');

			TweenMax.to($curtain1, 0.6, {
				right: '20%',
				ease: Expo.easeInOut
			});

			TweenMax.to($curtain2, 0.6, {
				left: '80%',
				ease: Expo.easeInOut
			});

			TweenMax.to($backgrounds, 0.6, {
				autoAlpha: 0,
				scale: 1.1,
				ease: Expo.easeInOut,
			});

		}

	}

	$links.on('click', function (e) {

		e.preventDefault();

		if (!$overlay.hasClass('in-transition')) {
			var
				$el = $(this),
				$currentMenu = $el.parents('ul'),
				$submenu = $el.next('.sub-menu');

			openSubmenu($submenu, $currentMenu);
		}

	});

	$submenuButton.on('click', function (e) {

		e.preventDefault();

		if (!$overlay.hasClass('in-transition')) {
			var
				$openedMenu = $submenus.filter('.' + OPEN_CLASS),
				$prevMenu = $openedMenu.parent('li').parent('ul');

			closeSubmenu($openedMenu, $prevMenu);
		}

	})

}

/* ======================================================================== */
/* 11. Preloader */
/* ======================================================================== */
function Preloader() {

	var
		tl = new TimelineMax(),
		$pageWrapper = $('.page-wrapper'),
		$preloader = $('.preloader'),
		$bar = $preloader.find('.preloader__progress'),
		$fill = $preloader.find('.preloader__progress-fill'),
		$curtains = $preloader.find('.preloader__curtain'),
		$curtains = $curtains.get().reverse();

	function finish() {

		return new Promise(function (resolve) {

			Promise.all([window.fontPrimaryObserver, window.fontSecondaryObserver]).then(function () {

				tl
					.clear()
					.to($fill, 0.6, {
						scaleX: 1,
						transformOrigin: 'left center',
						ease: Expo.easeOut
					})
					.to($bar, 0.6, {
						autoAlpha: 0,
						y: '-30px'
					})
					.staggerTo($curtains, 1, {
						x: '-100%',
						ease: Expo.easeInOut,
					}, 0.1, '-=0.6')
					.set($preloader, {
						autoAlpha: 0
					})
					.add(function () {
						return resolve();
					}, '-=0.6');

			});

		})

	}

	function drawLoading() {

		tl
			.to($fill, 20, {
				scaleX: 1,
				transformOrigin: 'left center',
				ease: SlowMo.ease.config(0.7, 0.7, false)
			});

	}

	function animateUnload() {

		window.onbeforeunload = function () {
			$pageWrapper.addClass('page-wrapper_hidden');
			return;
		};

	}

	return new Promise(function (resolve, reject) {

		animateUnload();
		drawLoading();
		objectFitImages();
		$('.jarallax-video').jarallax();
		lazyLoad($document);
		$pageWrapper.removeClass('page-wrapper_hidden');

		if (!$preloader.length) {
			return resolve();
		} else {
			finish().then(function () {
				return resolve();
			});
		}

	});

}

/* ======================================================================== */
/* 12. ScrollDown */
/* ======================================================================== */
var ScrollDown = function ($target) {

	var $section = $target.closest('.section-fullheight');

	if (!$target.length || !$section.length) {
		return;
	}

	var
		offset = $section.height(),
		$body = $('html, body');

	$target.on('click', function (e) {

		e.preventDefault();
		$body.animate({
			scrollTop: offset
		}, 600, 'swing');

	});

}

/* ======================================================================== */
/* 13. lockScroll */
/* ======================================================================== */
function lockScroll(enabled) {

	var
		$body = $('body'),
		$window = $(window),
		LOCK_CLASS = 'body_lock-scroll',
		lastTop = $window.scrollTop();

	if (enabled === true) {

		$body
			.addClass(LOCK_CLASS)
			.css({
				top: -lastTop
			});

	} else {

		var
			offset = parseInt($body.css('top'), 10),
			offsetValue = Math.abs(offset);

		$body
			.removeClass(LOCK_CLASS)
			.css({
				top: 'auto'
			});

		$window.scrollTop(offsetValue);

	}

}

/* ======================================================================== */
/* 14. createOSScene */
/* ======================================================================== */
function createOSScene($el, tl, $customTrigger, noReveal) {

	var $trigger = $el;

	if ($customTrigger && $customTrigger.length) {
		$trigger = $customTrigger;
	}

	if (!noReveal) {
		// reveal hidden element first
		tl.add([TweenMax.set($el, {
			autoAlpha: 1
		})], 'start');
	}

	new $.ScrollMagic.Scene({
			triggerElement: $trigger,
			triggerHook: window.SMSceneTriggerHook,
			reverse: window.SMSceneReverse
		})
		.setTween(tl)
		.addTo(window.SMController);

}

/* ======================================================================== */
/* 15. ScrollUp */
/* ======================================================================== */
var ScrollUp = function () {

	var
		$target = $('.js-scroll-up'),
		tl = new TimelineMax();

	prepare();
	animate();
	scrollUp();

	function prepare() {

		if (!$target.length) {
			return;
		}

		TweenMax.set($target, {
			autoAlpha: 0,
			y: '20px'
		});

	}

	function animate() {

		if (!$target.length) {
			return;
		}

		var
			offset = $(window).height(),
			$trigger = $('body');

		tl.to($target, 0.6, {
			autoAlpha: 1,
			y: '0px'
		});

		new $.ScrollMagic.Scene({
				reverse: true,
				triggerElement: $trigger,
				offset: offset
			})
			.setTween(tl)
			.addTo(window.SMController);

	}

	function scrollUp() {

		if (!$target.length) {
			return;
		}

		$target.on('click', function (e) {

			e.preventDefault();

			$('html, body').stop().animate({
				scrollTop: 0
			}, 800, 'swing');

		});

	}

}

/* ======================================================================== */
/* 16. SectionBlog */
/* ======================================================================== */
var SectionBlog = function ($scope) {

	var $target = $scope.find('.section-blog');

	if (!$target.length) {
		return;
	}

	createSlider();

	function createSlider() {

		var
			$sliderGallery = $target.find('.js-slider-gallery');

		new SliderGallery($sliderGallery);

	}

}

/* ======================================================================== */
/* 17. SectionIntro */
/* ======================================================================== */
var SectionIntro = function ($scope) {

	var $target = $scope.find('.section-intro');

	if (!$target.length) {
		return;
	}

	var
		$sliderContent = $target.find('.js-slider-intro-content'),
		$sliderBackgrounds = $target.find('.js-slider-intro-backgrounds'),
		sliderContent = new SliderIntroContent($sliderContent),
		sliderBackgrounds = new SliderIntroBackgrounds($sliderBackgrounds),
		$header = $('.header'),
		$contentContainer = $target.find('.section-intro__wrapper-content'),
		$sectionInner = $target.find('.section-fullheight__inner'),
		$curtain1 = $target.find('.section-intro__diagonal-curtain-1'),
		$curtain2 = $target.find('.section-intro__diagonal-curtain-2'),
		$scrollDown = $target.find('.js-scroll-down');

	if (sliderContent.slides.length <= 1) {
		sliderContent.destroy(true, true);
		sliderBackgrounds.destroy(true, true);
	} else {
		chainSliders();
	}

	new ScrollDown($scrollDown);
	// offsetHeader();
	// prepare();
	// animate();

	function chainSliders() {

		if (sliderContent && sliderBackgrounds) {

			sliderContent.controller.control = sliderBackgrounds;
			sliderBackgrounds.controller.control = sliderContent;

		}

	}

	function offsetHeader() {

		if ($header.length) {

			var offset = $header.height();

			if ($header.hasClass('header_absolute')) {
				$contentContainer.css({
					paddingTop: offset + 'px'
				});

			} else {

				$sectionInner.css({
					minHeight: 'calc(100vh - ' + offset + 'px)'
				});

			}

		}

	}

	function prepare() {

		TweenMax.set([$curtain1, $curtain2], {
			x: '-100%',
			y: '-100%'
		});

	}

	function animate() {
		TweenMax.staggerTo([$curtain1, $curtain2], 2, {
			x: '0%',
			y: '0%',
			ease: Expo.easeInOut
		}, 0.3);
	}

}

/* ======================================================================== */
/* 18. SectionLatestProjects */
/* ======================================================================== */
var SectionLatestProjects = function ($scope) {

	var $target = $scope.find('.section-latest-projects');

	if (!$target.length) {
		return;
	}

	var
		$slider = $target.find('.js-slider-projects'),
		$inners = $target.find('.section-latest-projects__inner'),
		$tabs = $target.find('.js-tabs');

	bindSliderTabs();
	createInnerSliders();

	function bindSliderTabs() {

		if (!$slider.length || !$tabs.length) {
			return;
		}

		var slider = new SliderProjects($slider);
		var tabs = new Tabs($tabs);

		// initial set
		tabs.setActiveTab(slider.activeIndex);

		// handle slides change
		slider.on('slideChange', function () {
			tabs.setActiveTab(this.activeIndex);
		});

		// handle clicks on tabs
		tabs.$items.on('click', function () {
			var index = $(this).index();
			slider.slideTo(index);
		});

	}

	function createInnerSliders() {

		if (!$inners.length) {
			return;
		}

		$inners.each(function () {

			var
				$el = $(this),
				$sliderContent = $el.find('.js-slider-project-content'),
				$sliderBackgrounds = $el.find('.js-slider-project-backgrounds'),
				sliderContent = new SliderProjectContent($sliderContent),
				sliderBackgrounds = new SliderProjectBackgrounds($sliderBackgrounds);

			chainSliders();

			function chainSliders() {

				if (sliderContent && sliderBackgrounds) {

					sliderContent.controller.control = sliderBackgrounds;
					sliderBackgrounds.controller.control = sliderContent;

				}

			}
		});

	}

}

/* ======================================================================== */
/* 19. SectionPortfolio */
/* ======================================================================== */
var SectionPortfolio = function ($scope) {

	var $target = $scope.find('.section-portfolio');

	if (!$target.length) {
		return;
	}

	var $filter = $target.find('.js-filter');
	var $grid = $target.find('.js-grid');

	bindGridTabs();

	function bindGridTabs() {

		if (!$filter.length) {
			return;
		}

		var filter = new Tabs($filter);
		var grid = new Grid($grid);

		grid.isotope();
		setTimeout(function () {
			filter.setActiveTab(0);
		}, 100);

		filter.$items.on('click', function (e) {

			e.preventDefault();

			var filterBy = $(this).attr('data-filter');

			grid.isotope({
				filter: filterBy
			});

		});

	}

}

/* ======================================================================== */
/* 20. SectionServices */
/* ======================================================================== */
var SectionServices = function ($scope) {

	var $target = $scope.find('.section-services');

	if (!$target.length) {
		return;
	}

	var
		$servicesHover = $target.find('.js-service-hover'),
		$backgrounds = $target.find('.js-service-hover__background');

	if ($servicesHover.length && $backgrounds.length) {
		hoverBackgrounds();
	}

	function hoverBackgrounds() {

		TweenMax.set($backgrounds, {
			autoAlpha: 0,
			scale: 1.1
		});

		$servicesHover
			.on('mouseenter touchstart', function (e) {

				var
					postId = $(this).data('services-post-id'),
					$targetBackground = $backgrounds.filter('[data-services-background-for="' + postId + '"]'),
					$otherBackgrounds = $backgrounds.not($targetBackground);

				TweenMax.to($otherBackgrounds, 0.6, {
					autoAlpha: 0,
					scale: 1.1,
					ease: Expo.easeInOut,
				});

				TweenMax.to($targetBackground, 0.6, {
					autoAlpha: 1,
					scale: 1,
					ease: Expo.easeInOut
				});

			}).on('mouseleave touchend', function (e) {

				TweenMax.to($backgrounds, 0.6, {
					autoAlpha: 0,
					scale: 1.1,
					ease: Expo.easeInOut,
				});

			});

	}

}

/* ======================================================================== */
/* 21. sectionServicesTabs */
/* ======================================================================== */
var SectionServicesTabs = function ($scope) {

	var $target = $scope.find('.section-services-tabs');

	if (!$target.length) {
		return;
	}

	var
		$slider = $target.find('.js-slider-services'),
		$tabs = $target.find('.js-tabs');

	bindSliderTabs();

	function bindSliderTabs() {

		if (!$slider.length || !$tabs.length) {
			return;
		}

		var slider = new SliderServices($slider);
		var tabs = new Tabs($tabs);

		// initial set
		tabs.setActiveTab(slider.activeIndex);

		// handle slides change
		slider.on('slideChange', function () {
			tabs.setActiveTab(this.activeIndex);
		});

		$(window).on('resize', function () {
			tabs.setActiveTab(this.activeIndex);
		})

		// handle clicks on tabs
		tabs.$items.on('click', function () {
			var index = $(this).index();
			slider.slideTo(index);
		});

	}

}

/* ======================================================================== */
/* 22. SectionTestimonials */
/* ======================================================================== */
var SectionTestimonials = function ($scope) {

	var $target = $scope.find('.section-testimonials');

	if (!$target.length) {
		return;
	}

	var $slider = $target.find('.js-slider-testimonials');

	createSlider();

	function createSlider() {

		if (!$slider.length) {
			return;
		}

		var slider = new SliderTestimonials($slider);

	}

}

/* ======================================================================== */
/* 23. sliderGallery */
/* ======================================================================== */
var SliderGallery = function ($slider) {

	if (!$slider.length) {
		return;
	}

	var slider = new Swiper($slider, {
		autoplay: {
			delay: 6000
		},
		speed: 800,
		preloadImages: false,
		lazy: {
			loadPrevNext: true,
			loadOnTransitionStart: true
		},
		watchSlidesProgress: true,
		watchSlidesVisibility: true,
		pagination: {
			el: '.js-slider-gallery__nav',
			type: 'bullets',
			bulletElement: 'div',
			clickable: true,
			bulletClass: 'slider-nav__dot',
			bulletActiveClass: 'slider-nav__dot_active'
		}
	});

	return slider;

}

/* ======================================================================== */
/* 24. sliderImages */
/* ======================================================================== */
var SliderImages = function ($slider) {

	if (!$slider.length) {
		return;
	}

	var slider = new Swiper($slider, {
		speed: 800,
		parallax: true,
		preloadImages: false,
		lazy: {
			loadPrevNext: true,
			loadOnTransitionStart: true
		},
		watchSlidesProgress: true,
		watchSlidesVisibility: true,
		centeredSlides: true,
		slidesPerView: 1.75,
		spaceBetween: 30,
		pagination: {
			el: '.js-slider-images__nav',
			type: 'bullets',
			bulletElement: 'div',
			clickable: true,
			bulletClass: 'slider-nav__dot',
			bulletActiveClass: 'slider-nav__dot_active'
		},
		navigation: {
			nextEl: '.js-slider-images__next',
			prevEl: '.js-slider-images__prev',
		},
		breakpoints: {
			1400: {
				slidesPerView: 1.33,
				spaceBetween: 15
			},
			1200: {
				slidesPerView: 1.2,
				spaceBetween: 15
			}
		}
	});

	return slider;

}

/* ======================================================================== */
/* 25. SliderIntroBackgrounds */
/* ======================================================================== */
var SliderIntroBackgrounds = function () {

	var $slider = $('.js-slider-intro-backgrounds');

	if (!$slider.length) {
		return;
	}

	var slider = new Swiper($slider, {
		speed: 1200,
		watchSlidesVisibility: true,
		preloadImages: false,
		lazy: {
			loadPrevNext: true
		},
		direction: 'vertical'
	});

	return slider;

}

/* ======================================================================== */
/* 26. SliderIntroContent */
/* ======================================================================== */
var SliderIntroContent = function ($slider) {

	if (!$slider.length) {
		return;
	}

	var slider = new Swiper($slider, {
		speed: $slider.data('speed') || 1200,
		autoplay: {
			enabled: $slider.data('autoplay-enabled') || false,
			delay: $slider.data('autoplay-delay') || 6000,
		},
		pagination: {
			el: '.js-slider-intro-content__nav',
			type: 'bullets',
			bulletElement: 'div',
			clickable: true,
			bulletClass: 'slider-nav__dot',
			bulletActiveClass: 'slider-nav__dot_active'
		},
		simulateTouch: false
	});

	return slider;

}

/* ======================================================================== */
/* 27. SliderProjectBackgrounds */
/* ======================================================================== */
var SliderProjectBackgrounds = function ($slider) {

	if (!$slider.length) {
		return false;
	}

	var slider = new Swiper($slider, {
		effect: 'fade',
		fadeEffect: {
			crossFade: true
		},
		speed: 1200,
		watchSlidesVisibility: true,
		preloadImages: false,
		lazy: {
			loadPrevNext: true
		},
		watchSlidesProgress: true,
		simulateTouch: false,
		nested: true
	});

	return slider;

}

/* ======================================================================== */
/* 28. SliderProjectContent */
/* ======================================================================== */
var SliderProjectContent = function ($slider) {

	if (!$slider.length) {
		return false;
	}

	var slider = new Swiper($slider, {
		speed: 1200,
		preloadImages: false,
		lazy: {
			loadPrevNext: true,
			loadOnTransitionStart: true
		},
		watchSlidesProgress: true,
		watchSlidesVisibility: true,
		pagination: {
			el: $slider.find('.js-slider-project-content__nav'),
			type: 'bullets',
			bulletElement: 'div',
			clickable: true,
			bulletClass: 'slider-nav__dot',
			bulletActiveClass: 'slider-nav__dot_active',
		},
		navigation: {
			nextEl: '.js-slider-project-content__next',
			prevEl: '.js-slider-project-content__prev',
		},
		parallax: true,
		nested: true,
		breakpoints: {
			767: {
				parallax: false
			}
		}
	});

	return slider;

}

/* ======================================================================== */
/* 29. SliderProjects */
/* ======================================================================== */
var SliderProjects = function ($slider) {

	if (!$slider.length) {
		return;
	}

	var slider = new Swiper($slider, {
		effect: 'fade',
		fadeEffect: {
			crossFade: true
		},
		speed: 1200,
		simulateTouch: false,
	});

	return slider;

}

/* ======================================================================== */
/* 30. SliderServices */
/* ======================================================================== */
var SliderServices = function ($slider) {

	if (!$slider.length) {
		return;
	}

	var slider = new Swiper($slider, {
		speed: 800,
		autoHeight: true
	});

	return slider;

}

/* ======================================================================== */
/* 31. SliderTestimonials */
/* ======================================================================== */
var SliderTestimonials = function ($slider) {

	if (!$slider.length) {
		return;
	}

	var slider = new Swiper($slider, {
		autoHeight: true,
		speed: 800,
		lazy: {
			loadPrevNext: true,
			loadOnTransitionStart: true
		},
		pagination: {
			el: $slider.find('.js-slider-testimonials__nav'),
			type: 'bullets',
			bulletElement: 'div',
			clickable: true,
			bulletClass: 'slider-nav__dot',
			bulletActiveClass: 'slider-nav__dot_active',
		},
	});

	return slider;

}

/* ======================================================================== */
/* 32. Tabs */
/* ======================================================================== */
var Tabs = function ($tabs) {

	if (!$tabs.length) {
		return;
	}

	var
		self = this,
		itemClass = '.js-tabs__item',
		$items = $(itemClass),
		activeItemClass = 'tabs__item_active';

	this.$tabs = $tabs;
	this.$items = $items;

	bindEvents();
	updateLinePosition();

	function bindEvents() {

		$(document)
			.on('mouseenter', itemClass, function () {

				updateLinePosition($(this));

			})
			.on('mouseleave', itemClass, function () {

				updateLinePosition($items.filter('.' + activeItemClass));

			})
			.on('click', itemClass, function () {

				var $el = $(this);

				$items.removeClass(activeItemClass);
				$el.addClass(activeItemClass);
				updateLinePosition($el);

			});

	}

	function updateLinePosition($target) {

		var
			$line = self.$tabs.find('.js-tabs__underline');

		if (!$line.length) {
			return;
		}

		if (!$target || !$target.length) {

			TweenMax.to($line, 0.6, {
				width: 0
			});

		} else {

			var
				headingWidth = $target.find('h4').innerWidth(),
				headingPos = $target.find('h4').position().left,
				colPos = $target.position().left;

			TweenMax.to($line, 0.6, {
				ease: Expo.easeInOut,
				width: headingWidth,
				x: headingPos + colPos,
			});

		}

	}

	this.setActiveTab = function (index) {

		var $target = $items.eq(index);
		if (!$target) {
			return;
		}

		$items.removeClass(activeItemClass);
		$target.addClass(activeItemClass);
		updateLinePosition($target, self.$tabs);

	};

}

//# sourceMappingURL=components.js.map
