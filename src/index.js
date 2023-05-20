const { app, Tray, Menu, nativeImage, shell } = require('electron')
const si = require('systeminformation')

let tray

let totalDownload = 0;
let totalUpload = 0;

si.networkInterfaceDefault().then(data => defaultNetwork = data);
si.networkInterfaces().then(data => {
    defaultNetwork = data.filter(networkInterface => networkInterface.iface === defaultNetwork)[0];
});

app.whenReady().then(() => {
  const icon = nativeImage.createEmpty()
  tray = new Tray(icon)

  const template = [
    {
       role: 'about',
       submenu: [
          {
            label: 'Learn More',
            click: (menuItem, window, e) => {
             shell.openExternal("https://www.erdemkosk.com")
          }
         },
       ]
    },
    {
      role: 'quit',
      click: (menuItem, window, e) => {
        app.quit();
     }
   }
 ]
 
 const menu = Menu.buildFromTemplate(template)
 tray.setContextMenu(menu)

  setInterval(function() {
    si.networkStats().then(data => {
        
        totalDownload = bytesToSize((data[0].rx_sec) ? (data[0].rx_sec).toFixed() : 0);
        totalUpload = bytesToSize((data[0].tx_sec) ? (data[0].tx_sec).toFixed() : 0);

       tray.setTitle('⬆' + totalDownload + '   ⬇' + totalUpload)
        
    });
  }, 1000)
})

app.dock.hide();

function bytesToSize(bytes) {
  var sizes = ['B', 'KB', 'MB', 'GB', 'TB'];
  if (bytes == 0) return '  0  B';
  var i = parseInt(Math.floor(Math.log(bytes) / Math.log(1024)));

  let val = (bytes / Math.pow(1024, i)).toFixed();

  if(val.toString().length === 1){
    val = '  ' + val; 
  }

  if(val.toString().length === 2){
    val = ' ' + val; 
  }

  return val + ' ' + sizes[i];
}