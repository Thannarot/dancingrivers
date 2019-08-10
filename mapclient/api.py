# -*- coding: utf-8 -*-

from celery.result import AsyncResult
from core import GEEApi
from django.conf import settings
from django.http import JsonResponse
from datetime import datetime
import json
import time

def api(request):

    get = request.GET.get
    action = get('action', '')

    if action:
        public_methods = ['get-map-id', 'get-stats']
        if action in public_methods:
            year = get('Year', 2010)
            shape = get('shape', '')
            geom = get('geom', '')
            core = GEEApi(year, shape, geom)
            if action == 'get-map-id':
                data = core.get_map_id(year=year)
            elif action == 'get-stats':
                data = core.get_river_stat(year=year, shape=shape)
            return JsonResponse(data, safe=False)
