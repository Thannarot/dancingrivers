# -*- coding: utf-8 -*-

from django.conf import settings
import ee, json, os, time
from django.http import JsonResponse
from django.http import HttpResponse
import base64
# -----------------------------------------------------------------------------
class GEEApi():
    """ Google Earth Engine API """

    def __init__(self, year, shape, geom):

        ee.Initialize(settings.EE_CREDENTIALS)
        self.geom = geom
        self.IMAGE_COLLECTION = ee.ImageCollection(settings.EE_IMAGE_RIVER_COLLECTION)
        self.RIVERCLASSES = [
                {
                    'name': 'No Change',
                    'value': '1',
                    'color': '61C8FF'
                },
                {
                    'name': 'Erosion',
                    'value': '2',
                    'color': 'cc3300'
                },
                {
                    'name': 'Deposition',
                    'value': '3',
                    'color': 'ffff00'
                }
                ]
        self.palette = []
        for _class in self.RIVERCLASSES:
            self.palette.append(_class['color'])

        self.palette = ','.join(self.palette)

        self.INDEX_CLASS = {}
        for _class in self.RIVERCLASSES:
            self.INDEX_CLASS[int(_class['value'])] = _class['name']


    # -------------------------------------------------------------------------
    def _get_geometry(self, shape):

        if shape:
            if shape == 'rectangle':
                _geom = self.geom.split(',')
                coor_list = [float(_geom_) for _geom_ in _geom]
                geometry = ee.Geometry.Rectangle(coor_list)
                return geometry
            elif shape == 'circle':
                _geom = self.center.split(',')
                coor_list = [float(_geom_) for _geom_ in _geom]
                geometry = ee.Geometry.Point(coor_list).buffer(float(self.radius))
                return geometry
            elif shape == 'polygon':
                _geom = self.geom.split(',')
                coor_list = [float(_geom_) for _geom_ in _geom]
                geometry = ee.Geometry.Polygon(coor_list)
                return geometry
            elif shape == 'polyline':
                _geom = self.geom.split(',')
                coor_list = [float(_geom_) for _geom_ in _geom]
                geometry = ee.Geometry.LineString(coor_list)
                return geometry


    # -------------------------------------------------------------------------
    def get_river_stat(self, year, shape):
        self.geometry = self._get_geometry(shape)
        image = self.IMAGE_COLLECTION.filterDate('%s-01-01' % year,'%s-12-31' % year)
        self.selected_image = ee.Image(image.first())
        self.image_onchange = self.selected_image.eq(1)
        self.image_erosion = self.selected_image.eq(2)
        self.image_deposition = self.selected_image.eq(3)

        nochange_val = self.calc_length(self.image_onchange, self.selected_image)
        erosion_val = self.calc_length(self.image_erosion, self.selected_image)
        deposition_val = self.calc_length(self.image_deposition, self.selected_image)
        data = {'1': nochange_val, '2': erosion_val, '3': deposition_val }
        return {self.INDEX_CLASS[int(float(k))]:float('{0:.2f}'.format(v)) for k,v  in data.items()}

    # -------------------------------------------------------------------------
    def calc_length(self, inputmask, inputimage):
        image = inputimage.mask(inputmask);
        stats = image.reduceRegion(reducer = ee.Reducer.count(),
                                   geometry = self.geometry,
                                   scale = 30,
                                   maxPixels = 1E13
                                   )

        value = stats.get("nochange").getInfo()
        return value * 30;

    # -------------------------------------------------------------------------
    def get_map_id(self, year):
        self.image = self.IMAGE_COLLECTION.filterDate('%s-01-01' % year,'%s-12-31' % year)
        map_id = self.image.getMapId({
            'min': '1',
            'max': '3',
            'palette': self.palette
        })
        return {
            'eeMapId': str(map_id['mapid']),
            'eeMapToken': str(map_id['token'])
        }
