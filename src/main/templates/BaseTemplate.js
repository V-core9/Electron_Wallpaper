
const config = require('../../config');
const { cache, watch } = require('../core');


const draw = {
  rect: async (x, y, width, height, color) => `<rect x="${x}" y="${y}" width="${width}" height="${height}" fill="${color}" />`,
  circle: async (x, y, radius, color) => `<circle cx="${x}" cy="${y}" r="${radius}" fill="${color}" />`,
  text: async (x, y, text, color, size) => `<text x="${x}" y="${y}" fill="${color || this.main}"  text-rendering="geometricPrecision" font-size="${size || this.normalFontSize}">${text}</text>`,
  line: async (x1, y1, x2, y2, color) => `<line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" stroke="${color}" />`,
  polygon: async (points, color) => `<polygon points="${points}" fill="${color}" />`,
  path: async (d, color) => `<path d="${d}" fill="${color}" />`,
  image: async (x, y, width, height, data) => `<image x="${x}" y="${y}" width="${width}" height="${height}" href="${data}" alt="Description of the image" />`
};





module.exports = function BaseTemplate(data = {}) {




  this.name = data.name || "customSVGdemoName";
  this.white = data.white || "#ffffff";
  this.main = data.main || "#a0c0ff";
  this.mainAlt = data.mainAlt || "#ffa0c0";
  this.background = data.background || "#40404050";
  this.backgroundAlt = data.backgroundAlt || "#404040";
  this.containerBackground = data.containerBackground || "#555555";
  this.mainSuccess = data.mainSuccess || "#40ff40";
  this.mainWarn = data.mainWarn || "#FFA500";

  this.helperWidth = 1280;
  this.helperHeight = 720;


  this.superFontSize = 45;
  this.mainFontSize = 30;
  this.subFontSize = 20;
  this.normalFontSize = 11;
  this.strokeWidth = 3;


  this.debugX = data.debugX || 140;
  this.debugY = data.debugY || 45;


  this.cacheData = {};


  this.clock = {
    posX: 1115,
    posY: 680
  };


  this.helpDim = {
    X: this.debugX + 20,
    X300: this.debugX + 20 + 300,
    X500: this.debugX + 20 + 500,
    X840: this.debugX + 20 + 840,
    Y: this.debugY + this.mainFontSize,
    Y60: this.debugY + this.mainFontSize + 60,
    Y75: this.debugY + this.mainFontSize + 75,
    Y90: this.debugY + this.mainFontSize + 90,
    Y105: this.debugY + this.mainFontSize + 105,
    Y140: this.debugY + this.mainFontSize + 140,
    Y155: this.debugY + this.mainFontSize + 155,
    Y170: this.debugY + this.mainFontSize + 170,
    Y185: this.debugY + this.mainFontSize + 185,
    Y200: this.debugY + this.mainFontSize + 200,
    Y215: this.debugY + this.mainFontSize + 215,
    Y230: this.debugY + this.mainFontSize + 230,
    Y245: this.debugY + this.mainFontSize + 245,
  };


  this.render = async () => {

    this.cacheData = {
      clock: await cache.get('clock') || { strTime: "", datePrint: "" },
      system: await cache.get('system') || { cpu: {}, ram: {}, deviceUserInfo: {} },
      netSpeed: await cache.get('netSpeed') || { external_ip: "0.0.0.0", latency: 0, download: 0, upload: 0 },
      svgStats: await cache.get('svgStats') || { lastExecTimeVal: 0, totalUpdates: 0, scale: 1, running: false, quality: 75 },
    };

    if (await config.get('debug')) console.log(this.cacheData);

    return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${this.helperWidth} ${this.helperHeight}"  height="${this.helperHeight}" width="${this.helperWidth}" class="${this.name}"  shape-rendering="geometricPrecision" font-family="monospace" >
              ${await this.bckLayer()}
                ${await this.printOsInfo()}
                ${await this.printBotStats()}
                ${await this.printClock()}
                ${await this.extendedInfoPanel()}
                ${(await config.get('debug')) ? await this.debug() : `${await draw.text(1125, 25, `<text fill="${this.main}">${this.cacheData.svgStats.lastExecTimeVal}</text>ms | ${this.cacheData.svgStats.totalUpdates}`, this.white, this.normalFontSize)}`}
            </svg>`;

  };



  this.offlineNotice = async () => {
    return `<path d="M 170 697.5 l ${(this.helperWidth - 340)}  0 5 5 0 10 -5 5 ${-(this.helperWidth - 340)}  0 -5 -5 0 -10 5 -5" stroke="${this.main}80" stroke-width="1" fill="${this.main}50" ></path>
            ${await draw.text(180, 710, `V_WATCH: [OFFLINE]`, "#000000", this.normalFontSize)}
            ${await draw.text(640, 710, `Restart application to get it running`, "#000000", this.normalFontSize)}
            ${await draw.image(1080, 520, 200, 200, await cache.get("PICKLE_BASE64"))}`;
  };


  this.printOsInfo = async () => {
    const cpu = this.cacheData.system.cpu || { usage: -1, count: 0 };
    const ram = this.cacheData.system.ram;
    return `<path d="M 170 2.5 l ${(this.helperWidth - 340)}  0 5 5 0 10 -5 5 ${-(this.helperWidth - 340)}  0 -5 -5 0 -10 5 -5" stroke="${this.main}80" stroke-width="1" fill="${this.main}50" ></path>
              ${await draw.text(180, 15, `CPU: ${cpu.usage}% [Count: ${cpu.count}]`, this.main, this.normalFontSize)}
              ${await draw.text(640, 15, `RAM: ${ram.freemem}GB (${ram.freememproc}%) [Total: ${ram.totalmem}GB]`, this.main, this.normalFontSize)}`;
  };



  this.printBotStats = async () => {
    let { netSpeed, system } = this.cacheData;
    return `<path d="M 170 697.5 l ${(this.helperWidth - 340)}  0 5 5 0 10 -5 5 ${-(this.helperWidth - 340)}  0 -5 -5 0 -10 5 -5" stroke="${this.main}80" stroke-width="1" fill="${this.main}50" ></path>
            ${await draw.text(180, 710, `👤 ${system.deviceUserInfo}`, this.main, this.normalFontSize)}
            ${await draw.text(640, 710, `🌐 ${netSpeed.external_ip} [ D: ${netSpeed.download} Mbs / U:${netSpeed.upload} Mbs @ ${netSpeed.latency}ms]`, this.main, this.normalFontSize)}`;
  };



  this.printClock = async () => {
    return `<path d="M ${(this.clock.posX)}  ${(this.clock.posY)}  l  20 -20 110 0 20 20 -10 0 -15 -15 -100 0 -15 15 -10 0" stroke="#444" stroke-width="2" fill="${this.background}" ></path>
            ${await draw.text(this.clock.posX + 25, this.clock.posY + 2.5, this.cacheData.clock.strTime, this.main, this.subFontSize)}
            ${await draw.text(this.clock.posX + 22.5, this.clock.posY + 15, this.cacheData.clock.datePrint, this.backgroundAlt, this.normalFontSize)}
            <path d="M ${(this.clock.posX)}  ${(this.clock.posY + 5)}  l  20 20 110 0 20 -20 -10 0 -15 15 -100 0 -15 -15 -10 0" stroke="#444" stroke-width="2"  fill="${this.background}" ></path>`;
  };



  this.bckLayer = async () => {
    return `<path d="M 0 0 l ${this.helperWidth}  0 0 ${this.helperHeight} -${this.helperWidth} 0 -${this.helperWidth} -${this.helperHeight} " stroke="none" stroke-width="${this.strokeWidth}" fill="#000" ></path>
            <path d="M 30 10 l 120 0 20 20 ${this.helperWidth - 340} 0 20 -20 120 0 20 20 0 120 -20 20 0 ${this.helperHeight - 340} 20 20 0 120 -20 20 -120 0 -20 -20 -${this.helperWidth - 340} 0 -20 20 -120 0 -20 -20 0 -120 20 -20 0 -${this.helperHeight - 340} -20 -20 0 -120 20 -20" stroke="${this.main}50" stroke-width="${this.strokeWidth}" fill="${this.containerBackground}50" ></path>`;
  };



  this.placeholder = async () => {
    let taskVIEW = "";

    let tasks = await watch.getAll();

    let taskNames = Object.keys(tasks);

    for (let i = 0; i < taskNames.length; i++) {
      taskVIEW += `${await draw.text(this.helpDim.X500, this.helpDim.Y + 330 + i * 22.5, `${taskNames[i]}`, this.white, 8)}
                   ${await draw.text(this.helpDim.X840, this.helpDim.Y + 330 + i * 22.5, `[ ${(tasks[taskNames[i]].enabled) ? "✔ Enabled" : "❌ Disabled"} ]`, this.main, 8)}
                   ${await draw.text(this.helpDim.X500, this.helpDim.Y + 337.5 + i * 22.5, `${tasks[taskNames[i]].description}`, this.white, 6)}
                   ${await draw.text(this.helpDim.X840, this.helpDim.Y + 337.5 + i * 22.5, `[ Δ ${tasks[taskNames[i]].interval}ms | Σ ${tasks[taskNames[i]].runs} ]`, this.main, 6)}`;
    }

    return `<path d="M ${this.debugX + 520} ${this.debugY + 320} l 460 0 10 10 0 230 -10 10 -460 0 -10 -10  0 -230 10 -10" stroke="${this.main}" stroke-width="1" fill="#203040" ></path>
            ${await draw.text(this.helpDim.X500, this.helpDim.Y + 312.5, "vWatch Tasks:", this.main, this.subFontSize)}
            ${taskVIEW}`;
  };



  this.vWatchDBG = async () => {
    const stats = await watch.stats();

    return `<path d="M ${this.helpDim.X} ${this.debugY + 320} l 460 0 10 10 0 230 -10 10 -460 0 -10 -10  0 -230 10 -10" stroke="${this.main}" stroke-width="1" fill="#203040" ></path>
            ${await draw.text(this.helpDim.X, this.helpDim.Y + 312.5, "vWatch Tasks Runner:", this.main, this.subFontSize)}

            ${await draw.text(this.helpDim.X, this.helpDim.Y + 345, "Total Tasks Count", this.white, this.normalFontSize)}
            ${await draw.text(this.helpDim.X300, this.helpDim.Y + 345, stats.totalTasksCount, this.white, this.normalFontSize)}

            ${await draw.text(this.helpDim.X, this.helpDim.Y + 360, "Active Tasks ", this.white, this.normalFontSize)}
            ${await draw.text(this.helpDim.X300, this.helpDim.Y + 360, stats.activeTasksCount, this.white, this.normalFontSize)}

            ${await draw.text(this.helpDim.X, this.helpDim.Y + 375, "Disabled Tasks ", this.white, this.normalFontSize)}
            ${await draw.text(this.helpDim.X300, this.helpDim.Y + 375, stats.disabledTasksCount, this.white, this.normalFontSize)}`;
  };



  this.cacheDBG = async () => {
    let stats = await cache.stats();

    return `<path d="M ${this.debugX + 520} ${this.debugY + 50} l 460 0 10 10 0 230 -10 10 -460 0 -10 -10  0 -230 10 -10" stroke="${this.main}" stroke-width="1" fill="#203040" ></path>
            ${await draw.text(this.helpDim.X500, this.helpDim.Y + 42.5, "cache Info Stats:", this.main, this.subFontSize)}

            ${await draw.text(this.helpDim.X500, this.helpDim.Y60, "Items in Cache", this.white, this.normalFontSize)}
            ${await draw.text(this.helpDim.X840, this.helpDim.Y60, stats.count, this.white, this.normalFontSize)}

            ${await draw.text(this.helpDim.X500, this.helpDim.Y75, "Hits Count", this.white, this.normalFontSize)}
            ${await draw.text(this.helpDim.X840, this.helpDim.Y75, stats.hits, this.white, this.normalFontSize)}

            ${await draw.text(this.helpDim.X500, this.helpDim.Y90, "Misses Count:", this.white, this.normalFontSize)}
            ${await draw.text(this.helpDim.X840, this.helpDim.Y90, stats.misses, this.white, this.normalFontSize)}`;

  };



  this.wallGuiDBG = async () => {
    return `<path d="M ${this.helpDim.X} ${this.debugY + 50} l 460 0 10 10 0 230 -10 10 -460 0 -10 -10  0 -230 10 -10" stroke="${this.main}" stroke-width="1" fill="#203040" ></path>
            ${await draw.text(this.helpDim.X, this.helpDim.Y + 42.5, "WallpaperGUI", this.main, this.subFontSize)}

            ${await draw.text(this.helpDim.X, this.helpDim.Y60, "Update TimeStamp", this.white, this.normalFontSize)}
            ${await draw.text(this.helpDim.X300, this.helpDim.Y60, `[ <text fill="${this.main}">${Date.now()}</text> ]`, this.white, this.normalFontSize)}

            ${await draw.text(this.helpDim.X, this.helpDim.Y75, "Render Exec. Time ", this.white, this.normalFontSize)}
            ${await draw.text(this.helpDim.X300, this.helpDim.Y75, `[ <text fill="${this.main}">${this.cacheData.svgStats.lastExecTimeVal}</text> ms ]`, this.white, this.normalFontSize)}

            ${await draw.text(this.helpDim.X, this.helpDim.Y90, "TotalUpdates ", this.white, this.normalFontSize)}
            ${await draw.text(this.helpDim.X300, this.helpDim.Y90, `[ <text fill="${this.main}">${this.cacheData.svgStats.totalUpdates}</text> ]`, this.white, this.normalFontSize)}

            ${await draw.text(this.helpDim.X, this.helpDim.Y105, "Running Looping Render ", this.white, this.normalFontSize)}
            ${await draw.text(this.helpDim.X300, this.helpDim.Y105, (this.cacheData.svgStats.running) ? '[ <text fill="' + this.mainSuccess + '">ACTIVE</text> ]' : '[ <text fill="' + this.mainWarn + '">DISABLED</text> ]', this.white, this.normalFontSize)}



            ${await draw.text(this.helpDim.X, this.helpDim.Y140, "SVG Template Info ", this.main, this.subFontSize)}

            ${await draw.text(this.helpDim.X, this.helpDim.Y155, "Name ", this.white, this.normalFontSize)}
            ${await draw.text(this.helpDim.X300, this.helpDim.Y155, `[ <text fill="${this.main}">${this.name}</text> ]`, this.white, this.normalFontSize)}

            ${await draw.text(this.helpDim.X, this.helpDim.Y170, "Random Colors ", this.white, this.normalFontSize)}
            ${await draw.text(this.helpDim.X300, this.helpDim.Y170, '[ <text fill="' + this.mainSuccess + '">ENABLED</text> ]', this.white, this.normalFontSize)}

            ${await draw.text(this.helpDim.X, this.helpDim.Y185, "Render Height ", this.white, this.normalFontSize)}
            ${await draw.text(this.helpDim.X300, this.helpDim.Y185, `[ <text fill="${this.main}">${this.helperHeight}</text> ]`, this.white, this.normalFontSize)}

            ${await draw.text(this.helpDim.X, this.helpDim.Y200, "Render Width ", this.white, this.normalFontSize)}
            ${await draw.text(this.helpDim.X300, this.helpDim.Y200, `[ <text fill="${this.main}">${this.helperWidth}</text> ]`, this.white, this.normalFontSize)}

            ${await draw.text(this.helpDim.X, this.helpDim.Y215, "Debug Position (x,y)", this.white, this.normalFontSize)}
            ${await draw.text(this.helpDim.X300, this.helpDim.Y215, `[ <text fill="${this.main}">${this.debugX}, ${this.debugY}</text> ]`, this.white, this.normalFontSize)}

            ${await draw.text(this.helpDim.X, this.helpDim.Y230, "Scale ", this.white, this.normalFontSize)}
            ${await draw.text(this.helpDim.X300, this.helpDim.Y230, `[ <text fill="${this.main}">${this.cacheData.svgStats.scale}</text> ]`, this.white, this.normalFontSize)}

            ${await draw.text(this.helpDim.X, this.helpDim.Y245, "Quality ", this.white, this.normalFontSize)}
            ${await draw.text(this.helpDim.X300, this.helpDim.Y245, `[ <text fill="${this.main}">${this.cacheData.svgStats.quality}</text> ]`, this.white, this.normalFontSize)}`;
  };



  this.debug = async () => {
    // <path d="M 0 0 l 1280 0   0 720   -1280 0   0 -720" stroke="${this.main}40" stroke-width="6" fill="#000000A0" stroke-dasharray="10 5"></path>

    return `  <path d="M ${this.helpDim.X} ${this.debugY} l 960 0 20 20 0 540 -20 20 -960 0 -20 -20 0 -540 20 -20" stroke="#203040" stroke-width="2" fill="#203040A0" ></path>
                <path d="M ${this.helpDim.X} ${this.debugY} l 960 0 20 20  -20 20 -960 0 -20 -20 20 -20" stroke="#203040" stroke-width="2" fill="#101520" ></path>
                ${await draw.text(this.helpDim.X + 5, this.helpDim.Y, "Debug Panel:", this.white, this.mainFontSize)}

                ${await this.wallGuiDBG()}
                ${await this.cacheDBG()}
                ${await this.vWatchDBG()}
                ${await this.placeholder()}`;
  };



  this.renderEIP = async () => {
    let screenInfo = await cache.get("ScreenResolutionInfo") || { width: 0, height: 0, dpiScale: 1 };
    let weatherApi = await cache.get('weatherApi') || { main: {}, wind: {}, clouds: {}, weather: [{ main: "", description: "" }] };
    let wthMain = weatherApi.weather[0].main;
    let wthDescription = weatherApi.weather[0].description;
    let wthTemp = weatherApi.main.temp || 0;
    let wthWindSpeed = weatherApi.wind.speed || 0;


    /*`<path d="M 1135 705 l 110 0   20 -20   0 -110 -20 -20 -130 130  20 20 " stroke="${this.main}" stroke-width="1" fill="#101520" ></path>
    ${await draw.text(1140, 695, "📏 " + screenInfo.width + "x" + screenInfo.height + "px", this.white, this.normalFontSize)}
    ${await draw.text(1150, 680, "🔍 " + screenInfo.dpiScale + "dpi", this.white, this.normalFontSize)}`*/

    return `
              <path d="M 35 15 l 110 0  20 20   -130 130  -20 -20  0 -110  20 -20" stroke="${this.main}" stroke-width="1" fill="#101520" ></path>
              ${await draw.text(35, 40, "💻 EIP#1", this.white, this.subFontSize)}

              <path d="M 35 705 l 110 0   20 -20   -130 -130  -20 20   0 110   20 20" stroke="${this.main}" stroke-width="1" fill="#101520" ></path>
              ${await draw.text(35, 695, "😎 " + wthMain, this.white, this.normalFontSize)}
              ${await draw.text(35, 680, "🔥 " + wthTemp + "°C ", this.white, this.normalFontSize)}
              ${await draw.text(35, 665, "〰 " + wthWindSpeed + "m/s", this.white, this.normalFontSize)}

              <path d="M 1135 15 l 110 0   20 20   0 110   -20 20   -130 -130  20 -20" stroke="${this.main}" stroke-width="1" fill="#101520" ></path>
              ${await draw.text(1140, 40, "💹 " + await cache.get('npmTotalDownloads'), this.white, this.subFontSize)}

              

              <path d="M 5 145 l   25 25   0 380   -25 25   0 -430  " stroke="${this.main}" stroke-width="1" fill="#101520" ></path>
              ${await draw.text(10, 185, "🆒", this.main, this.normalFontSize)}

              <path d="M 1275 145 l   -25 25   0 380   25 25   0 -430  " stroke="${this.main}" stroke-width="1" fill="#101520" ></path>
              ${await draw.text(1255, 545, "🆓", this.main, this.normalFontSize)}

        `;

  };


  this.extendedInfoPanel = async () => {
    if (await cache.has('ExtendedInfoPanel')) return await cache.get('ExtendedInfoPanel');

    item = await this.renderEIP();
    await cache.set('ExtendedInfoPanel', item, 10000);

    return item;
  };


};
