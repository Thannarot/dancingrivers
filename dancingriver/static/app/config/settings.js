angular.module('baseApp').constant('appSettings', {
	menus: [
		{
			'name': 'Home',
			'url': '/home/',
			'show': false
		},
		{
			'name': 'Map',
			'url': '/map/',
			'show': true
		},
		{
			'name': 'How To Use',
			'url': 'https://docs.google.com/document/d/e/2PACX-1vS7eInK_GfJjExG6TVJfQZl2Ig0MTkS-bTfsqljyFU6eQ69H0-N98FX6CSuIN0iSbk8iv7tGpbtBaLc/pub',
			'show': true
		},
	],
	applicationName: 'Dancing Rivers',
	footerLinks: [
		{
			'name': 'About',
			'url': 'https://servir.adpc.net/about/about-servir-mekong',
			'show': true
		},
		{
			'name': 'Tools',
			'url': 'https://servir.adpc.net/tools',
			'show': true
		},
		{
			'name': 'Geospatial Datasets',
			'url': 'https://servir.adpc.net/geospatial-datasets',
			'show': true
		},
		{
			'name': 'Resources and Publications',
			'url': 'https://servir.adpc.net/publications',
			'show': true
		},
		{
			'name': 'News',
			'url': 'https://servir.adpc.net/news',
			'show': true
		},
		{
			'name': 'Events',
			'url': 'https://servir.adpc.net/events',
			'show': true
		},
		{
			'name': 'Contact Us',
			'url': 'https://servir.adpc.net/about/contact-servir-mekong',
			'show': true
		},
		{
			'name': 'Privacy Policy',
			'url': '/privacy-policy/',
			'show': true
		}
	],
	partnersHeader: [
		{
			'alt': 'The United States Agency for International Development',
			'url': 'https://www.usaid.gov/',
			//'src': 'https://servir.adpc.net/themes/svmk/images/optimized/USAID_Logo_Color.png',
			'src': 'images/usaid.png',
			'className': 'usaid'
		},
		{
			'alt': 'The National Aeronautics and Space Administration',
			'url': 'https://www.nasa.gov/',
			//'src': 'https://servir.adpc.net/themes/svmk/images/optimized/NASA_Logo_Color.png',
			'src': 'images/nasa.png',
			'className': 'nasa'
		},
		{
			'alt': 'Asian Disaster Preparedness Center',
			'url': 'http://www.adpc.net/',
			//'src': 'https://servir.adpc.net/themes/svmk/images/optimized/partner-adbc.png',
			'src': 'images/adpc.png',
			'className': 'adpc'
		},
		{
			'alt': 'SERVIR',
			'url': 'https://servir.adpc.net/',
			//'src': 'https://servir.adpc.net/themes/svmk/images/optimized/Servir_Logo_Color.png',
			'src': 'images/servir-mekong.png',
			'className': 'servir'
		}
	],
	partnersFooter : [
		{
			'alt': 'Spatial Infomatics Group',
			'url': 'https://sig-gis.com/',
			//'src': 'https://servir.adpc.net/themes/svmk/images/optimized/partner-sig.png',
			'src': 'images/sig.png',
			'className': 'partner-sig'
		},
		{
			'alt': 'Stockholm Environment Institute',
			'url': 'https://www.sei-international.org/',
			//'src': 'https://servir.adpc.net/themes/svmk/images/optimized/partner-sei.png',
			'src': 'images/sei.png',
			'className': 'partner-sei'
		},
		{
			'alt': 'Deltares',
			'url': 'https://www.deltares.nl/en/',
			//'src': 'https://servir.adpc.net/themes/svmk/images/optimized/partner-deltares.png',
			'src': 'images/deltares.png',
			'className': 'partner-deltares'
		}
	],
	riverClasses : [
			{
				'name': 'No Change',
				'value': '1',
				'color': '#61C8FF'
			},
			{
				'name': 'Erosion',
				'value': '2',
				'color': '#cc3300'
			},
			{
				'name': 'Deposition',
				'value': '3',
				'color': '#ffff00'
			}
		],
	areaFilter : [
		{
			'name': 'Ayeyarwady',
			'lng': 95.59529338447058,
			'lat': 17.229826691245936
		},
		{
			'name': 'Bago',
			'lng': 95.10640178290805,
			'lat': 18.66428427580306
		},
		{
			'name': 'Kachin',
			'lng': 97.16923325630833,
			'lat': 24.232795513344634
		},
		{
			'name': 'Magway Central',
			'lng': 94.87535606995709,
			'lat': 20.359238108552866
		},
		{
			'name': 'Magway Lower',
			'lng': 95.17857269008961,
			'lat': 19.459201376298207
		},
		{
			'name': 'Magway Upper',
			'lng': 95.03647197410396,
			'lat': 21.294590411545613
		},
		{
			'name': 'Mandalay Central',
			'lng': 96.03745285832451,
			'lat': 22.102350019905916
		},
		{
			'name': 'Mandalay Lower',
			'lng': 95.31450649358567,
			'lat': 21.406059323210354
		},
		{
			'name': 'Mandalay Upper',
			'lng': 95.9879475359013,
			'lat': 23.30494399038136
		},
		{
			'name': 'Sagaing Upper',
			'lng': 96.27110093208957,
			'lat': 24.032272719272655
		},
		{
			'name': 'Sagaing Lower',
			'lng': 95.63122397686004,
			'lat': 21.93714157421888
		},
		{
			'name': 'Sagaing West',
			'lng': 94.6974220171453,
			'lat': 22.922613320621448
		}
	]
});
