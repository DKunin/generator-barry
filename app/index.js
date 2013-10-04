'use strict';
var util = require('util');
var path = require('path');
var yeoman = require('yeoman-generator');


var GeneratorJaderGenerator = module.exports = function GeneratorJaderGenerator(args, options, config) {
  yeoman.generators.Base.apply(this, arguments);

  this.on('end', function () {
    this.installDependencies({ skipInstall: options['skip-install'] });
  });

  this.pkg = JSON.parse(this.readFileAsString(path.join(__dirname, '../package.json')));
};

util.inherits(GeneratorJaderGenerator, yeoman.generators.Base);

GeneratorJaderGenerator.prototype.askFor = function askFor() {
  var cb = this.async();
  
  // have Yeoman greet the user.
  console.log(this.yeoman);
  var prompts = [
  
  {
  name: 'projectName',
  message: 'What do you call your project, sir?'
},{
  name: 'gitUser',
  message: 'Please enter your gitUserName, if you would happend to have one.'
},];

  this.prompt(prompts, function (props) {
    //this.someOption = props.someOption;
    this.projectName = props.projectName;
    this.gitUser = props.gitUser;
    cb();
  }.bind(this));
};

GeneratorJaderGenerator.prototype.askForModules = function askForModules() {
  var cb = this.async();
  var cssFormats = ['css', 'stylus'];
  var htmlFormats = ['html', 'jade'];
  var prompts = [{
    type: 'list',
    name: 'cssprep',
    message: 'What kind of a CSS preprocessor you want, if any, sir?',
    choices: cssFormats
  },{
    type: 'list',
    name: 'htmlprep',
    message: 'And, perhaps HTML preprocessor, if we are up to it, sir?',
    choices: htmlFormats
  }
  ,{
    type: 'checkbox',
    name: 'modules',
    message: 'Which modules would you like to include, sir?',
    choices: [{
      value: 'minificationModules',
      name: 'minification',
      checked: true
    }]
  }
  ];
  
  this.prompt(prompts, function (props) {
    var hasMod = function (mod) { return props.modules.indexOf(mod) !== -1; };
    this.stylusModule = (props.cssprep==='stylus');
    this.jadeModule = (props.htmlprep==='jade');//hasMod('jadeModule');
    this.minify = hasMod('minificationModules');
    cb();
  }.bind(this));
};


GeneratorJaderGenerator.prototype.app = function app() {
  var viewsFolder = 'app/views/';
  
  //Folders
  this.mkdir('app');
  this.mkdir('app/views');  
  this.mkdir('app/views/layouts');  
  this.mkdir('app/views/layouts/partials');  
  this.mkdir('app/styles');
  this.mkdir('app/js');
  this.mkdir('app/assets');
 
  //Views
  if(this.jadeModule) {
    this.template('jade/index.jade', viewsFolder+'index.jade');
    this.template('jade/layouts/_layout.jade', viewsFolder + '/layouts/_layout.jade');
    this.template('jade/layouts/partials/_footer.jade', viewsFolder + '/layouts/partials/_footer.jade');
    this.template('jade/layouts/partials/_header.jade', viewsFolder + '/layouts/partials/_header.jade');
    this.template('jade/layouts/partials/_html-header.jade', viewsFolder +'/layouts/partials/_html-header.jade');
  } else {
    this.template('index.html', 'app/index.html');
  }
  
  //Styles
  if(this.stylusModule) {
  this.template('styles/_style.styl', 'app/styles/style.styl');
  this.template('styles/_mixins.styl', 'app/styles/_mixins.styl');
  this.template('styles/_pure.styl', 'app/styles/_pure.styl');
  this.template('styles/_pure.css', 'app/styles/_pure.css');
  this.template('styles/_color.styl', 'app/styles/_color.styl');
  } else {
  this.template('styles/_pure.css', 'app/styles/_pure.css');
    this.template('style.css', 'app/styles/style.css');
  }
  
  //DevFiles
  this.template('Gruntfile.js', 'Gruntfile.js');
  this.template('_package.json', 'package.json');
  this.template('_bower.json', 'bower.json');
};

GeneratorJaderGenerator.prototype.projectfiles = function projectfiles() {
  this.copy('jshintrc', '.jshintrc');
};
