#!/bin/sh
cd /home/dancingrivers/dancingrivers
git reset --hard HEAD
git pull
gulp build
python manage.py collectstatic
