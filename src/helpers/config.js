const path = require('path');
const v_fs = require('v_file_system');
const v_rifier = require('v_rifier');


//? SETTINGS
let app_debug = false;
let maximize = false;
let app_version = '0.0.0';
let app_title = 'Electron Wallpaper';
let app_description = 'Electron Wallpaper is a desktop wallpaper manager for Windows, Mac and Linux.';
let weatherApiKey = v_fs.readSy(path.join(__dirname, "openweather_api_key.txt")) || '';
let weatherCity = 'Kljajicevo';
let weatherUnits = 'metric';



//? SETTERS VALIDATION
const setAppTitle = async (val) => {
  if (await v_rifier.isName(val) === true) app_title = val;
};

const setAppDescription = async (val) => {
  if (await v_rifier.isText(val) === true) app_title = val;
};

const setAppVersion = async (val) => {
  const parts = val.split('.');

  if ((parts.length === 3) && (await v_rifier.isInteger(parts[0]) === true) && (await v_rifier.isInteger(parts[1]) === true) && (await v_rifier.isInteger(parts[2]) === true)) {
    app_version = val;
  }
};



//? CONFIG Object
const config = {


  set debug(value) {
    if (typeof value === 'boolean') app_debug = value;
  },

  get debug() {
    return app_debug;
  },

  async toggleDebug() {
    this.debug = !this.debug;
    return this.debug;
  },



  //* Maximize SET/GET/Toggle
  set maximize(value) {
    if (typeof value === 'boolean') maximize = value;
  },

  get maximize() {
    return maximize;
  },

  async toggleMaximize() {
    this.maximize = !this.maximize;
    return this.maximize;
  },



  //* Application Title
  set title(val) {
    setAppTitle(val);
  },

  get title() {
    return app_title;
  },



  //* Application Description
  set description(val) {
    setAppTitle(val);
  },

  get description() {
    return app_description;
  },



  //* Version SET/GET
  set version(val) {
    setAppVersion(val);
  },

  get version() {
    return app_version;
  },


  //? WEATHER SETTINGS
  //* API Key SET/GET
  set weatherApiKey(val) {
    weatherApiKey = val;
  },

  get weatherApiKey() {
    return weatherApiKey;
  },

  //* City SET/GET
  set weatherCity(val) {
    weatherCity = val;
  },

  get weatherCity() {
    return weatherCity;
  },

  //* Units SET/GET
  set weatherUnits(val) {
    weatherUnits = val;
  },

  get weatherUnits() {
    return weatherUnits;
  }



};



module.exports = config;