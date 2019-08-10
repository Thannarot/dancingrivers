'use strict';

module.exports = {
    client: {
        css: [
            'dancingriver/static/css/*.css',
        ],
        js: [
            'dancingriver/static/app/*.js',
            'dancingriver/static/app/**/*.js'
        ],
        views: [
            'dancingriver/templates/*.html',
            'dancingriver/templates/**/*.html',
        ],
        templates: ['static/templates.js']
    },
    server: {
        gulpConfig: ['gulpfile.js']
    }
};
