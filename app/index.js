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
  var prompts = [{
    type: 'confirm',
    name: 'someOption',
    message: 'Would you like to enable this option?',
    default: true
  },{
  name: 'projectName',
  message: 'What do you call your project?'
},{
  name: 'gitUser',
  message: 'Please enter your gitUserName, if you have one.'
}];

  this.prompt(prompts, function (props) {
    //this.someOption = props.someOption;
    this.projectName = props.projectName;
    this.gitUser = props.gitUser;
    cb();
  }.bind(this));
};

GeneratorJaderGenerator.prototype.askForModules = function askForModules() {
  var cb = this.async();

  var prompts = [{
    type: 'checkbox',
    name: 'modules',
    message: 'Which modules would you like to include?',
    choices: [{
      value: 'jadeModule',
      name: 'jade',
      checked: true
    }, {
      value: 'stylusModule',
      name: 'stylus',
      checked: true
    }]
  }];

  this.prompt(prompts, function (props) {
    var hasMod = function (mod) { return props.modules.indexOf(mod) !== -1; };
    this.jadeModule = hasMod('jadeModule');
    this.stylusModule = hasMod('stylusModule');
    cb();
  }.bind(this));
};


GeneratorJaderGenerator.prototype.app = function app() {
  this.mkdir('app');
  this.mkdir('app/views');
  this.mkdir('app/public');
  this.mkdir('app/public/css');
  this.mkdir('app/public/js');
  this.mkdir('app/public/assets');
  this.mkdir('app/styles');
  
  this.template('Gruntfile.js', 'Gruntfile.js');
  
  this.template('_package.json', 'package.json');
  this.template('_bower.json', 'bower.json');
};

GeneratorJaderGenerator.prototype.projectfiles = function projectfiles() {
  this.copy('editorconfig', '.editorconfig');
  this.copy('jshintrc', '.jshintrc');
};
