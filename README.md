# generator-barry [![NPM version](https://badge.fury.io/js/generator-barry.png)](http://badge.fury.io/js/generator-barry) [![NPM version](https://david-dm.org/dkunin/generator-barry.png)](https://david-dm.org/dkunin/generator-barry.png)

A generator for [Yeoman](http://yeoman.io).

Generator that gives you ability to rapidly scaffold a front-end development app. Named after Barry Allen, "The Flash".

Currently includes the ability to choose to generate simple app structure with:
- jade
- stylus
- minification

## Helping components
- Connect for creating simple server, delivering the static in app folder
- Livereloading

##Install 
[![NPM](https://nodei.co/npm/generator-barry.png?downloads=true)](https://nodei.co/npm/generator-barry/)

      npm install -g generator-barry

##Start 

      yo barry

##Usage 
Run command to serve static files/or live generation of jade/stylus
      
      grunt 
      // or
      grunt serve

##To-do
- add HAML
- add LESS, SASS
- add image optimization

#Changelog

##0.1.10
- Updated dependencies
- Added empty js file to start with
- Updated grunt file - so watch would see the js folder
- When there is no need in jade - the view folder doesn't build

##0.1.9
- Fixed minor bugs

##0.1.8
- Updated dependencies

##0.1.7
- Added module grunt-size-report

##0.1.6
- Fixed a typo in README.md

##0.1.5
- Added grunt-time, for measuring elapsed time for grunt tasks

##0.1.4
- Added minification
- Switched inclusion of scripts to radio-like selection choice  