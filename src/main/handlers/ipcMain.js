const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

const { watch, cache } = require("../core");
const { log } = require("../../helpers/logger");
const config = require("../../config");

const tasks = require("../tasks");
let appTasks = require("../core/app-tasks");

watch.on("stop", async (key) => (appTasks[key].enabled = false));
watch.on("start", async (key) => (appTasks[key].enabled = true));
watch.on("delete", async (key) => delete appTasks[key]);
watch.on("end", async () => {
  appTasks = {};
});

module.exports = (ipcMain) => {
  try {
    ipcMain.handle("ping", async () => Date.now());

    ipcMain.handle("getConfig", async () => await config.get());

    ipcMain.handle("setAppTitle", async (event, arg) => {
      await config.set("title", arg);
      return await config.get("title");
    });

    ipcMain.handle(
      "setAppVersion",
      async (event, arg) => (config.version = arg)
    );

    ipcMain.handle(
      "listBackendAllCache",
      async () => (await cache.getAll()) || new Map()
    );

    ipcMain.handle("purgeBackendCache", async () => await cache.purge());

    ipcMain.handle("listBackendTasks", async (event, arg) =>
      JSON.stringify(await watch.stats())
    );

    ipcMain.handle(
      "startSpecificTask",
      async (event, arg) => await watch.start(arg)
    );

    ipcMain.handle(
      "stopSpecificTask",
      async (event, arg) => await watch.stop(arg)
    );

    ipcMain.handle(
      "deleteSpecificTask",
      async (event, arg) => await watch.delete(arg)
    );

    ipcMain.handle("endAllTasks", async () => await watch.end());

    //? App Debug Toggle
    ipcMain.handle("toggleDebug", async () => {
      const mainWindow = require("../mainWindow");
      await config.set("debug", !(await config.get("debug")));
      const status = await config.get("debug");
      if (status) {
        mainWindow.webContents.openDevTools();
      } else {
        mainWindow.webContents.closeDevTools();
      }
      return status;
    });

    //? Available Tasks
    ipcMain.handle("listAvailableTasks", async () => Object.keys(tasks));

    //? Window Maximize Toggle
    ipcMain.handle("maximizeAppToggle", async () => {
      const mainWindow = require("../mainWindow");
      await config.set("maximized", !(await config.get("maximized")));

      const status = await config.get("maximized");
      if (status) {
        mainWindow.maximize();
      } else {
        mainWindow.unmaximize();
      }
      return status;
    });

    //? Window Minimize Toggle
    ipcMain.handle("minimizeAppToggle", async () => {
      const mainWindow = require("../mainWindow");
      mainWindow.minimize();
    });

    ipcMain.handle("isMaximized", async () =>
      require("../mainWindow").isMaximized()
    );

    //? Exit Application Handle
    ipcMain.handle("EXIT_APPLICATION", async () => {
      if ((await config.get("minimizeToTray")) !== true) {
        require("../handlers/exiting")();
      } else {
        require("../notify").minimizeToTray();
        require("../mainWindow").hide();
        require("../tray").recreateMainMenu();
      }
    });

    ipcMain.handle("windowBlur", async () => {
      log("windowBlur Event");
    });

    ipcMain.handle("windowFocus", async () => {
      log("windowFocus Event");
    });

    ipcMain.handle("setOpenWeatherSettings", async (event, arg) => {
      await config.mSet(arg);
      return await config.get();
    });

    ipcMain.handle("toggleNotifications", async () => {
      await config.set("notify", !(await config.get("notify")));
      log("notifications set to: " + (await config.get("notify")));
      return await config.get("notify");
    });

    ipcMain.handle("createNewTask", async (event, arg) => {
      log("Create New Task: ", arg);
      const { name, interval, callback, enabled, initRun } = JSON.parse(arg);
      await watch.new(name, interval, tasks[callback], enabled);
      if (initRun) watch.run(name);
      appTasks[name] = { interval, callback, enabled, initRun };
      return await watch.stats();
    });

    ipcMain.handle("toggleMinimizeToTray", async () => {
      await config.set("minimizeToTray", !(await config.get("minimizeToTray")));
      log("minimize to tray set to: " + (await config.get("minimizeToTray")));
      return await config.get("minimizeToTray");
    });

    ipcMain.handle("domain/list", async () => {
      const data = await prisma.domain.findMany();
      console.log("domain/list", data);
      return data;
    });

    return true;
  } catch (error) {
    log(error);
    return false;
  }
};
