const { app, Tray, Menu, nativeImage } = require('electron')
const path = require('path')
const si = require('systeminformation')
const openAboutWindow = require('about-window').default;

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
            click: () =>
                        openAboutWindow({
                            icon_path: path.join(__dirname, '../icon.png'),
                            copyright: 'Copyright (c) 2023 Mustafa Erdem Köşk',
                            package_json_dir: path.join(__dirname, '..'),
                            product_name: 'VeloFlow',
                            homepage: 'https://erdemkosk.com/',
                            adjust_window_size: true,

                        }),
         },
       ]
    },
    {
      role: 'quit',
      click: () => {
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

       tray.setTitle('⬇' + totalDownload + '   ⬆' + totalUpload)
       
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

app.on('window-all-closed', (event) => {
  event.preventDefault();
});
