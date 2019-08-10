(function () {

	'use strict';

	angular.module('baseApp')
	.controller('dancingrivers' ,function ($scope, $timeout, MapService, appSettings, $tooltip, $modal, $alert, ngDialog,FileSaver, Blob, usSpinnerService) {

		// Earth Engine
		// Global Variables
		var EE_URL = 'https://earthengine.googleapis.com',
		DEFAULT_ZOOM = 10,
		MAX_ZOOM = 25,
		DEFAULT_CENTER = { lng: 94.800564, lat: 20.528518 },
		AREA_LIMIT = 20000,
		// Map options
		mapOptions = {
			center: DEFAULT_CENTER,
			zoom: DEFAULT_ZOOM,
			maxZoom: MAX_ZOOM,
			streetViewControl: false,
			zoomControl: true,
			fullscreenControl: false,
			mapTypeId: 'satellite',
			zoomControlOptions: {
				position: google.maps.ControlPosition.RIGHT_TOP
			},
			mapTypeControlOptions: {
				style: google.maps.MapTypeControlStyle.HORIZONTAL_BAR,
				position: google.maps.ControlPosition.TOP_CENTER
			},
		},
		// Map variable
		map = new google.maps.Map(document.getElementById('map'),mapOptions);

		var datepickerYearOptions = {
			format: 'yyyy',
			autoclose: true,
			startDate: new Date('1984'),
			endDate: new Date('2015'),
			clearBtn: true,
			startView: 'years',
			minViewMode: 'years',
			container: '.datepicker-year-class'
		};
		$('#datepicker-year').datepicker(datepickerYearOptions);
		$('#datepicker-year').datepicker("setDate", '2014' );
		$scope.startyear = '2014';
		// $scope variables
		$scope.overlays = {};
		$scope.shape = {};
		$scope.areaName = null;
		$scope.shownGeoJson = null;
		$scope.geometryBox = false;
		$scope.calculateBtn = false;
		$scope.clearBtn = false;
		$scope.showLoader = false;
		$scope.statisticsBox = false;
		$scope.premonsoon = '';
		$scope.postmonsoon = '';
		$scope.riverClassesColor = {};
		$scope.year = $('#datepicker-year').val();
		$scope.riverClassesColor = {};
		$scope.areaFilterName = {};
		$scope.areaFilterLat = {};
		$scope.areaFilterLng = {};
		// Setting variables
		$scope.areaVariableOptions = appSettings.areaFilter;
		$scope.riverClasses = appSettings.riverClasses;

		for (var i = 0; i < $scope.areaVariableOptions.length; i++) {
			$scope.areaFilterName[$scope.areaVariableOptions[i].name] = $scope.areaVariableOptions[i].name;
			$scope.areaFilterLat[$scope.areaVariableOptions[i].name] = $scope.areaVariableOptions[i].lat;
			$scope.areaFilterLng[$scope.areaVariableOptions[i].name] = $scope.areaVariableOptions[i].lng;
		}
		for (var index = 0; index < $scope.riverClasses.length; index++) {
			$scope.riverClassesColor[$scope.riverClasses[index].name] = $scope.riverClasses[index].color;
		}

		$('#datepicker-year').change(function(){
			$scope.year = $('#datepicker-year').val();
			$scope.updateRiverMap($scope.year);
		});

		/**
		* Drawing Tool Manager
		**/
		// Default the administrative area selection

		var drawingManager = new google.maps.drawing.DrawingManager();

		var stopDrawing = function () {
			drawingManager.setDrawingMode(null);
		};

		$scope.drawShape = function (type) {
			drawingManager.setOptions(MapService.getDrawingManagerOptions(type));
			drawingManager.setMap(map);
		};

		// Drawing Tool Manager Event Listeners
		google.maps.event.addListener(drawingManager, 'overlaycomplete', function (event) {
			// Clear Layer First
			MapService.clearDrawing($scope.overlays.polygon);
			MapService.removeGeoJson(map);

			var overlay = event.overlay;
			$scope.overlays.polygon = overlay;
			$scope.shape = {};

			var drawingType = event.type;
			$scope.shape.type = drawingType;
			if (drawingType === 'polyline') {
				var path = overlay.getPath();
				$scope.shape.geom = MapService.getPolygonBoundArray(path.getArray());
				$scope.test = $scope.shape.geom;
				$scope.geometryBox = true;
				$scope.calculateBtn = true;
				$scope.clearBtn = true;
				$scope.$apply();
				// Change event
				google.maps.event.addListener(path, 'insert_at', function () {
					var insert_path = event.overlay.getPath();
					$scope.shape.geom = MapService.getPolygonBoundArray(insert_path.getArray());
					$scope.$apply();
				});
				google.maps.event.addListener(path, 'remove_at', function () {
					var remove_path = event.overlay.getPath();
					$scope.shape.geom = MapService.getPolygonBoundArray(remove_path.getArray());
					$scope.$apply();
				});
				google.maps.event.addListener(path, 'set_at', function () {
					var set_path = event.overlay.getPath();
					$scope.shape.geom = MapService.getPolygonBoundArray(set_path.getArray());
					$scope.$apply();
				});
			}
			stopDrawing();
		});

		$scope.setCenterMap = function(name) {
			$scope.areaName = name;
			map.setCenter(new google.maps.LatLng($scope.areaFilterLat[name], $scope.areaFilterLng[name]));
			map.setZoom(10);
		};


		/**
		* Alert
		*/
		$scope.closeAlert = function () {
			$('.custom-alert').addClass('display-none');
			$scope.alertContent = '';
		};

		var showErrorAlert = function (alertContent) {
			$scope.alertContent = alertContent;
			$('.custom-alert').removeClass('display-none').removeClass('alert-info').removeClass('alert-success').addClass('alert-danger');
		};

		var showSuccessAlert = function (alertContent) {
			$scope.alertContent = alertContent;
			$('.custom-alert').removeClass('display-none').removeClass('alert-info').removeClass('alert-danger').addClass('alert-success');
		};

		var showInfoAlert = function (alertContent) {
			$scope.alertContent = alertContent;
			$('.custom-alert').removeClass('display-none').removeClass('alert-success').removeClass('alert-danger').addClass('alert-info');
		};


		/* Updates the image based on the current control panel config. */
		var loadMap = function (type, mapType) {
			map.overlayMapTypes.push(mapType);
			$scope.overlays[type] = mapType;
			$scope.showLoader = false;
		};
		/**
		* Get River Map.
		*/
		$scope.initMap = function (year, type) {
			$scope.showLoader = true;

			var parameters = {
				year: year
			};
			MapService.getMap(parameters)
			.then(function (data) {
				var mapType = MapService.getMapType(data.eeMapId, data.eeMapToken, type);
				loadMap(type, mapType);
				$timeout(function () {
					showInfoAlert('The map data shows the river change data for ' + $scope.year);
				}, 1000);
				//$scope.showLegend = true;
			}, function (error) {
				$scope.showLoader = false;
				showErrorAlert(error.error);
				console.log(error);
			});
		};

		// Update River Map
		$scope.updateRiverMap = function (year) {
			$scope.showLoader = true;
			$scope.closeAlert();
			MapService.clearLayer(map, 'rivermap');
			$scope.initMap(year, 'rivermap');
			if($scope.statisticsBox){
				$scope.getStats();
			}
			MapService.removeGeoJson(map);
		};

		// Get stats for the graph
		$scope.getStats = function () {
			$scope.showLoader = true;
			$scope.closeAlert();
			var parameters = {
				year: $scope.year,
				shape: $scope.shape
			};
			MapService.getStats(parameters)
			.then(function (data) {
				var graphData = [];
				for (var key in data) {
					graphData.push({ name: key, y: data[key], color: $scope.riverClassesColor[key] });
				}
				MapService.buildChart(graphData, 'chart', 'Type of Changes on Transect');
				$scope.nochangeval = data['No Change'];
				$scope.erosionval = data.Erosion;
				$scope.depositionval = data.Deposition;
				$scope.premonsoon = $scope.nochangeval + $scope.depositionval;
				$scope.postmonsoon = $scope.nochangeval + $scope.erosionval;
				$scope.statisticsBox  = true;
				$scope.showLoader = false;
				$timeout(function () {
					showInfoAlert('The pie chart show the river change ratio for '+ $scope.year);
				}, 1000);

			}, function (error) {
				console.log(error);
			});
		};


		$('#slide_show').on('click', function(){
			$('#fade-in').toggleClass('show');
			$('#slide_show').removeClass('slide show_obj');
			$('#slide_show').toggleClass('slide hide_obj');
			$('#fade-btn-hide').removeClass('box show');
			$('#fade-btn-hide').toggleClass('box show');
		});

		$('#slide_hide').on('click', function(){
			$('#fade-in').removeClass('show');
			$('#fade-btn-hide').removeClass('show');
			$('#slide_show').removeClass('slide hide_obj');
			$('#slide_show').toggleClass('slide show_obj');
		});


		$(".legend-info-button").click(function () {
			$("#legend-content").toggle();
			if ($("#legend-content").is(":visible") === true) {
				$("#legend-collapse").css("display","inline-block");
				$("#legend-expand").css("display","none");
			}
			else {
				$("#legend-collapse").css("display","none");
				$("#legend-expand").css("display","inline-block");
			}
		});

		$(".chart-info-button").click(function () {
			$("#chart-content").toggle();
			if ($("#chart-content").is(":visible") === true) {
				$("#chart-expand").css("display","none");
			}
			else {
				$("#chart-expand").css("display","inline-block");
			}
		});

		$(".tool-box-button").click(function () {
			$("#tool-box").toggle();
			if ($("#tool-box").is(":visible") === true) {
				$("#tool-expand").css("display","none");
			}
			else {
				$("#tool-expand").css("display","inline-block");
			}
		});

	});

})();
