const config = require('../../config')
const { cache, watch } = require('../core')

const draw = require('./_draw')

const {
  BackgroundLayerBase,
  BaseClock,
  BaseOfflineNotice,
  BaseBottomStats,
  BaseTopOsInfo,
  BaseOpenWeather,
} = require('./components')

module.exports = function BaseTemplate(data = {}) {
  this.name = data.name || 'customSVGdemoName'
  this.white = data.white || '#ffffff'
  this.main = data.main || '#a0c0ff'
  this.mainAlt = data.mainAlt || '#ffa0c0'
  this.background = data.background || '#40404050'
  this.backgroundAlt = data.backgroundAlt || '#404040'
  this.containerBackground = data.containerBackground || '#555555'
  this.mainSuccess = data.mainSuccess || '#40ff40'
  this.mainWarn = data.mainWarn || '#FFA500'

  this.helperWidth = 1280
  this.helperHeight = 720

  this.superFontSize = 45
  this.mainFontSize = 30
  this.subFontSize = 20
  this.normalFontSize = 11
  this.strokeWidth = 3

  this.debugX = data.debugX || 140
  this.debugY = data.debugY || 45

  this.cacheData = {}

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
  }

  this.render = async () => {
    this.cacheData = {
      system: (await cache.get('system')) || {
        cpu: {},
        ram: {},
        deviceUserInfo: {},
      },
      netSpeed: (await cache.get('netSpeed')) || {
        external_ip: '0.0.0.0',
        latency: 0,
        download: 0,
        upload: 0,
      },
      svgStats: (await cache.get('svgStats')) || {
        lastExecTimeVal: 0,
        totalUpdates: 0,
        scale: 1,
        running: false,
        quality: 75,
      },
    }

    return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${
      this.helperWidth
    } ${this.helperHeight}"  height="${this.helperHeight}" width="${
      this.helperWidth
    }" class="${
      this.name
    }"  shape-rendering="geometricPrecision" font-family="monospace" >
              ${await this._render()}
            </svg>`
  }

  this._render = async () => {
    if (await config.get('exiting')) {
      return await BaseOfflineNotice({
        mainText: `${await config.get('title')}: [OFFLINE]`,
        altText: `Restart application to get it running`,
        width: this.helperWidth,
        mainColor: this.main,
        fontSize: this.normalFontSize,
      })
    } else {
      return `${await BackgroundLayerBase({
        width: this.helperWidth,
        height: this.helperHeight,
        strokeWidth: this.strokeWidth,
        mainColor: this.main,
        backColor: this.containerBackground,
      })}

            ${await BaseTopOsInfo({
              ...this.cacheData.system,
              width: this.helperWidth,
              mainColor: this.main,
              fontSize: this.normalFontSize,
            })}

            ${await BaseBottomStats({
              ...this.cacheData,
              width: this.helperWidth,
              mainColor: this.main,
              fontSize: this.normalFontSize,
            })}

            ${await BaseClock({
              ...((await cache.get('clock')) || { strTime: '', datePrint: '' }),
              posX: 1115,
              posY: 680,
              bigFontSize: this.subFontSize,
              smallFontSize: this.normalFontSize,
              altColor: this.backgroundAlt,
              mainColor: this.main,
              backColor: this.background,
            })}

            ${await BaseOpenWeather({
              whiteColor: this.white,
              mainColor: this.main,
              fontSize: this.normalFontSize,
              bigFontSize: this.subFontSize,
            })};
            ${await this.extendedInfoPanel()}

            ${
              (await config.get('debug'))
                ? await this.debug()
                : `${await draw.text(
                    1125,
                    25,
                    `<text fill="${this.main}">${this.cacheData.svgStats.lastExecTimeVal}</text>ms | ${this.cacheData.svgStats.totalUpdates}`,
                    this.white,
                    this.normalFontSize
                  )}`
            }`
    }
  }

  this.placeholder = async () => {
    let taskVIEW = ''

    let tasks = await watch.get()

    let taskNames = Object.keys(tasks)

    for (let i = 0; i < taskNames.length; i++) {
      taskVIEW += `${await draw.text(
        this.helpDim.X500,
        this.helpDim.Y + 330 + i * 22.5,
        `${taskNames[i]}`,
        this.white,
        8
      )}
                   ${await draw.text(
                     this.helpDim.X840,
                     this.helpDim.Y + 330 + i * 22.5,
                     `[ ${
                       tasks[taskNames[i]].enabled ? '✔ Enabled' : '❌ Disabled'
                     } ]`,
                     this.main,
                     8
                   )}
                   ${await draw.text(
                     this.helpDim.X500,
                     this.helpDim.Y + 337.5 + i * 22.5,
                     `${tasks[taskNames[i]].description}`,
                     this.white,
                     6
                   )}
                   ${await draw.text(
                     this.helpDim.X840,
                     this.helpDim.Y + 337.5 + i * 22.5,
                     `[ Δ ${tasks[taskNames[i]].interval}ms | Σ ${
                       tasks[taskNames[i]].runs
                     } ]`,
                     this.main,
                     6
                   )}`
    }

    return `<path d="M ${this.debugX + 520} ${
      this.debugY + 320
    } l 460 0 10 10 0 230 -10 10 -460 0 -10 -10  0 -230 10 -10" stroke="${
      this.main
    }" stroke-width="1" fill="#203040" ></path>
            ${await draw.text(
              this.helpDim.X500,
              this.helpDim.Y + 312.5,
              'vWatch Tasks:',
              this.main,
              this.subFontSize
            )}
            ${taskVIEW}`
  }

  this.vWatchDBG = async () => {
    const stats = await watch.stats()

    return `<path d="M ${this.helpDim.X} ${
      this.debugY + 320
    } l 460 0 10 10 0 230 -10 10 -460 0 -10 -10  0 -230 10 -10" stroke="${
      this.main
    }" stroke-width="1" fill="#203040" ></path>
            ${await draw.text(
              this.helpDim.X,
              this.helpDim.Y + 312.5,
              'vWatch Tasks Runner:',
              this.main,
              this.subFontSize
            )}

            ${await draw.text(
              this.helpDim.X,
              this.helpDim.Y + 345,
              'Total Tasks Count',
              this.white,
              this.normalFontSize
            )}
            ${await draw.text(
              this.helpDim.X300,
              this.helpDim.Y + 345,
              stats.totalTasksCount,
              this.white,
              this.normalFontSize
            )}

            ${await draw.text(
              this.helpDim.X,
              this.helpDim.Y + 360,
              'Active Tasks ',
              this.white,
              this.normalFontSize
            )}
            ${await draw.text(
              this.helpDim.X300,
              this.helpDim.Y + 360,
              stats.activeTasksCount,
              this.white,
              this.normalFontSize
            )}

            ${await draw.text(
              this.helpDim.X,
              this.helpDim.Y + 375,
              'Disabled Tasks ',
              this.white,
              this.normalFontSize
            )}
            ${await draw.text(
              this.helpDim.X300,
              this.helpDim.Y + 375,
              stats.disabledTasksCount,
              this.white,
              this.normalFontSize
            )}`
  }

  this.cacheDBG = async () => {
    let stats = await cache.stats()

    return `<path d="M ${this.debugX + 520} ${
      this.debugY + 50
    } l 460 0 10 10 0 230 -10 10 -460 0 -10 -10  0 -230 10 -10" stroke="${
      this.main
    }" stroke-width="1" fill="#203040" ></path>
            ${await draw.text(
              this.helpDim.X500,
              this.helpDim.Y + 42.5,
              'cache Info Stats:',
              this.main,
              this.subFontSize
            )}

            ${await draw.text(
              this.helpDim.X500,
              this.helpDim.Y60,
              'Items in Cache',
              this.white,
              this.normalFontSize
            )}
            ${await draw.text(
              this.helpDim.X840,
              this.helpDim.Y60,
              stats.count,
              this.white,
              this.normalFontSize
            )}

            ${await draw.text(
              this.helpDim.X500,
              this.helpDim.Y75,
              'Hits Count',
              this.white,
              this.normalFontSize
            )}
            ${await draw.text(
              this.helpDim.X840,
              this.helpDim.Y75,
              stats.hits,
              this.white,
              this.normalFontSize
            )}

            ${await draw.text(
              this.helpDim.X500,
              this.helpDim.Y90,
              'Misses Count:',
              this.white,
              this.normalFontSize
            )}
            ${await draw.text(
              this.helpDim.X840,
              this.helpDim.Y90,
              stats.misses,
              this.white,
              this.normalFontSize
            )}`
  }

  this.wallGuiDBG = async () => {
    return `<path d="M ${this.helpDim.X} ${
      this.debugY + 50
    } l 460 0 10 10 0 230 -10 10 -460 0 -10 -10  0 -230 10 -10" stroke="${
      this.main
    }" stroke-width="1" fill="#203040" ></path>
            ${await draw.text(
              this.helpDim.X,
              this.helpDim.Y + 42.5,
              'WallpaperGUI',
              this.main,
              this.subFontSize
            )}

            ${await draw.text(
              this.helpDim.X,
              this.helpDim.Y60,
              'Update TimeStamp',
              this.white,
              this.normalFontSize
            )}
            ${await draw.text(
              this.helpDim.X300,
              this.helpDim.Y60,
              `[ <text fill="${this.main}">${Date.now()}</text> ]`,
              this.white,
              this.normalFontSize
            )}

            ${await draw.text(
              this.helpDim.X,
              this.helpDim.Y75,
              'Render Exec. Time ',
              this.white,
              this.normalFontSize
            )}
            ${await draw.text(
              this.helpDim.X300,
              this.helpDim.Y75,
              `[ <text fill="${this.main}">${this.cacheData.svgStats.lastExecTimeVal}</text> ms ]`,
              this.white,
              this.normalFontSize
            )}

            ${await draw.text(
              this.helpDim.X,
              this.helpDim.Y90,
              'TotalUpdates ',
              this.white,
              this.normalFontSize
            )}
            ${await draw.text(
              this.helpDim.X300,
              this.helpDim.Y90,
              `[ <text fill="${this.main}">${this.cacheData.svgStats.totalUpdates}</text> ]`,
              this.white,
              this.normalFontSize
            )}

            ${await draw.text(
              this.helpDim.X,
              this.helpDim.Y105,
              'Running Looping Render ',
              this.white,
              this.normalFontSize
            )}
            ${await draw.text(
              this.helpDim.X300,
              this.helpDim.Y105,
              this.cacheData.svgStats.running
                ? '[ <text fill="' + this.mainSuccess + '">ACTIVE</text> ]'
                : '[ <text fill="' + this.mainWarn + '">DISABLED</text> ]',
              this.white,
              this.normalFontSize
            )}



            ${await draw.text(
              this.helpDim.X,
              this.helpDim.Y140,
              'SVG Template Info ',
              this.main,
              this.subFontSize
            )}

            ${await draw.text(
              this.helpDim.X,
              this.helpDim.Y155,
              'Name ',
              this.white,
              this.normalFontSize
            )}
            ${await draw.text(
              this.helpDim.X300,
              this.helpDim.Y155,
              `[ <text fill="${this.main}">${this.name}</text> ]`,
              this.white,
              this.normalFontSize
            )}

            ${await draw.text(
              this.helpDim.X,
              this.helpDim.Y170,
              'Random Colors ',
              this.white,
              this.normalFontSize
            )}
            ${await draw.text(
              this.helpDim.X300,
              this.helpDim.Y170,
              '[ <text fill="' + this.mainSuccess + '">ENABLED</text> ]',
              this.white,
              this.normalFontSize
            )}

            ${await draw.text(
              this.helpDim.X,
              this.helpDim.Y185,
              'Render Height ',
              this.white,
              this.normalFontSize
            )}
            ${await draw.text(
              this.helpDim.X300,
              this.helpDim.Y185,
              `[ <text fill="${this.main}">${this.helperHeight}</text> ]`,
              this.white,
              this.normalFontSize
            )}

            ${await draw.text(
              this.helpDim.X,
              this.helpDim.Y200,
              'Render Width ',
              this.white,
              this.normalFontSize
            )}
            ${await draw.text(
              this.helpDim.X300,
              this.helpDim.Y200,
              `[ <text fill="${this.main}">${this.helperWidth}</text> ]`,
              this.white,
              this.normalFontSize
            )}

            ${await draw.text(
              this.helpDim.X,
              this.helpDim.Y215,
              'Debug Position (x,y)',
              this.white,
              this.normalFontSize
            )}
            ${await draw.text(
              this.helpDim.X300,
              this.helpDim.Y215,
              `[ <text fill="${this.main}">${this.debugX}, ${this.debugY}</text> ]`,
              this.white,
              this.normalFontSize
            )}

            ${await draw.text(
              this.helpDim.X,
              this.helpDim.Y230,
              'Scale ',
              this.white,
              this.normalFontSize
            )}
            ${await draw.text(
              this.helpDim.X300,
              this.helpDim.Y230,
              `[ <text fill="${this.main}">${this.cacheData.svgStats.scale}</text> ]`,
              this.white,
              this.normalFontSize
            )}

            ${await draw.text(
              this.helpDim.X,
              this.helpDim.Y245,
              'Quality ',
              this.white,
              this.normalFontSize
            )}
            ${await draw.text(
              this.helpDim.X300,
              this.helpDim.Y245,
              `[ <text fill="${this.main}">${this.cacheData.svgStats.quality}</text> ]`,
              this.white,
              this.normalFontSize
            )}`
  }

  this.debug = async () => {
    // <path d="M 0 0 l 1280 0   0 720   -1280 0   0 -720" stroke="${this.main}40" stroke-width="6" fill="#000000A0" stroke-dasharray="10 5"></path>

    return `  <path d="M ${this.helpDim.X} ${
      this.debugY
    } l 960 0 20 20 0 540 -20 20 -960 0 -20 -20 0 -540 20 -20" stroke="#203040" stroke-width="2" fill="#203040A0" ></path>
                <path d="M ${this.helpDim.X} ${
      this.debugY
    } l 960 0 20 20  -20 20 -960 0 -20 -20 20 -20" stroke="#203040" stroke-width="2" fill="#101520" ></path>
                ${await draw.text(
                  this.helpDim.X + 5,
                  this.helpDim.Y,
                  'Debug Panel:',
                  this.white,
                  this.mainFontSize
                )}

                ${await this.wallGuiDBG()}
                ${await this.cacheDBG()}
                ${await this.vWatchDBG()}
                ${await this.placeholder()}`
  }

  this.renderEIP = async (props) => {
    return `
              <path d="M 35 15 l 110 0  20 20   -130 130  -20 -20  0 -110  20 -20" stroke="${
                this.main
              }" stroke-width="1" fill="#101520" ></path>
              ${await draw.text(
                35,
                40,
                '💻 EIP#1',
                this.white,
                this.subFontSize
              )}


              <path d="M 1135 15 l 110 0   20 20   0 110   -20 20   -130 -130  20 -20" stroke="${
                this.main
              }" stroke-width="1" fill="#101520" ></path>
              ${await draw.text(
                1140,
                40,
                '💹 ' + (await cache.get('npmTotalDownloads')),
                this.white,
                this.subFontSize
              )}


              <path d="M 5 145 l   25 25   0 380   -25 25   0 -430  " stroke="${
                this.main
              }" stroke-width="1" fill="#101520" ></path>
              ${await draw.text(10, 185, '🆒', this.main, this.normalFontSize)}

              <path d="M 1275 145 l   -25 25   0 380   25 25   0 -430  " stroke="${
                this.main
              }" stroke-width="1" fill="#101520" ></path>
              ${await draw.text(
                1255,
                545,
                '🆓',
                this.main,
                this.normalFontSize
              )}

        `
  }

  this.extendedInfoPanel = async (props) => {
    if (await cache.has('ExtendedInfoPanel'))
      return await cache.get('ExtendedInfoPanel')

    item = await this.renderEIP(props)
    await cache.set('ExtendedInfoPanel', item, 10000)

    return item
  }
}
