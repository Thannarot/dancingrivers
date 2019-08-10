(function () {

	'use strict';

	angular.module('baseApp')
	.service('MapService', function ($http, $q) {
		var service = this;


		service.getMapType = function (mapId, mapToken, type) {
			var eeMapOptions = {
				getTileUrl: function (tile, zoom) {
					var url = 'https://earthengine.googleapis.com/map/';
					url += [mapId, zoom, tile.x, tile.y].join('/');
					url += '?token=' + mapToken;
					return url;
				},
				tileSize: new google.maps.Size(256, 256),
				opacity: 1.0,
				name: type
			};
			return new google.maps.ImageMapType(eeMapOptions);
		};

		service.getMap = function (options) {
			var config = {
				params: {
					action: 'get-map-id',
					Year: options.year
				}
			};
			var promise = $http.get('/api/mapclient/', config)
			.then(function (response) {
				return response.data;
			});
			return promise;
		};

		service.getStats = function (options) {
			var shape = options.shape;
			var year = options.year;
			var config = {
				params: {
					action: 'get-stats',
					Year: year,
					shape: shape
				}
			};

			if (shape) {
				var shapeType = shape.type;
				if (shapeType === 'polyline') {
					config.params.shape = shapeType;
					config.params.geom = shape.geom.toString();
				}
			}

			var promise = $http.get('/api/mapclient/', config)
			.then(function (response) {
				return response.data;
			});
			return promise;
		};

		service.removeGeoJson = function (map) {
			map.data.forEach(function (feature) {
				map.data.remove(feature);
			});
		};
		
		service.clearLayer = function (map, name) {
			map.overlayMapTypes.forEach(function (layer, index) {
				if (layer && layer.name === name) {
					map.overlayMapTypes.removeAt(index);
				}
			});
		};

		// Remove the Drawing Manager Polygon
		service.clearDrawing = function (overlay) {
			if (overlay) {
				overlay.setMap(null);
			}
		};

		service.getPolygonBoundArray = function (array) {
			var geom = [];
			for (var i = 0; i < array.length; i++) {
				var coordinatePair = [array[i].lng().toFixed(2), array[i].lat().toFixed(2)];
				geom.push(coordinatePair);
			}
			return geom;
		};


		service.getDrawingManagerOptions = function(type) {
			if (!type) {
				return {};
			}
			var typeOptions;
			if (type === 'polyline') {
				typeOptions = 'polylineOptions';
			}
			var drawingManagerOptions = {
				'drawingControl': false
			};
			drawingManagerOptions.drawingMode = type;
			drawingManagerOptions[typeOptions] = {
				'strokeColor': '#ffff00',
				'strokeWeight': 4,
				'fillColor': 'yellow',
				'fillOpacity': 0,
				'editable': true
			};

			return drawingManagerOptions;
		};

		service.buildChart = function (data, div, title) {
			// build the chart
			Highcharts.chart(div, {
				chart: {
					plotBackgroundColor: null,
					plotBorderWidth: null,
					plotShadow: false,
					type: 'pie',
					style: {
						fontFamily: 'Arial'
					}
				},
				title: {
					text: title,
					style: {
						fontSize: '14px'
					}
				},
				tooltip: {
					pointFormat: '{series.name}: <b>{point.percentage:.2f}% <br>value: {point.y}</b>'
				},
				plotOptions: {
					pie: {
						allowPointSelect: true,
						cursor: 'pointer',
						dataLabels: {
							enabled: true,
							format: '{point.percentage:.2f} %<br>value: {point.y}',
						},
						showInLegend: true
					}
				},
				series: [
					{
						name: 'Area',
						coloyByPoint: true,
						data: data
					}
				],
				credits: {
					enabled: false
				},
				exporting: {
					buttons: {
						contextButton: {
							menuItems: [
								"printChart",
								"separator",
								"downloadPNG",
								"downloadJPEG",
								"downloadPDF",
								"downloadSVG",
								"separator",
								"downloadCSV",
								"downloadXLS",
								//"viewData",
								//"openInCloud"
							]
						}
					}
				}
			});
		};

	});

})();
