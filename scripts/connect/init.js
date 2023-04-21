const Manager = require("Manager")
const Stys = require("Styles")

//use reflex to get Vars.net.clientListeners
let clazz=Vars.net.getClass()
let field=clazz.getDeclaredField("clientListeners");
field.setAccessible(true);
let clientListeners=field.get(Vars.net);
let superHandlerConnect=clientListeners.get(Packages.mindustry.net.Packets.Connect)
let superHandlerDisonnect=clientListeners.get(Packages.mindustry.net.Packets.Disconnect)


Vars.net.handleClient(Packages.mindustry.net.Packets.Connect, (packet) => {
    superHandlerConnect.get(packet);
    if(!Manager.load) return;
    Call.serverPacketReliable("AimClientConnect",JSON.stringify({
        version:Manager.version,
        versionType:Manager.versionType,
        color:Stys.themeColor.toString()
    }))
    Manager.events.fire("connect");
})

Vars.netClient.addPacketHandler("AimClientConnectResponse",(data)=>{
    if(!Manager.load) return;
    Vars.player.sendMessage("[ACc] "+Core.bundle.get("conn1"))
    Manager.connected=true
    Manager.connectData=JSON.parse(data)
    let mods=[]
    Vars.mods.eachEnabled(cons(m=>{
        mods.push({
            name:m.meta.name,
            hidden:m.meta.hidden,
            version:m.meta.version,
            author:m.meta.author,
            description:m.meta.description,
            GUID:"unknown",
            acplugin:false
        })
    }))
    Manager.plugins.plugins.forEach(p=>{
        if(Core.settings.get("ac-plugin-"+p.GUID+"-disabled","false")!="false") return;
        mods.push({
            name:"[ACPL]"+p.name,
            hidden:true,
            version:p.version,
            author:p.author,
            description:p.description,
            GUID:p.GUID,
            acplugin:true
        })
    })
    Call.serverPacketReliable("AimClientR1",JSON.stringify(mods))
})

Vars.netClient.addPacketHandler("Broad",(data)=>{
    if(Manager.connectData.broad){
        Manager.connectData.broad=data
    }
})

Vars.net.handleClient(Packages.mindustry.net.Packets.Disconnect, (packet) => {
    superHandlerDisonnect.get(packet);
    if(!Manager.load) return;
    Manager.connected=false
    Manager.connectData={}
    Manager.events.fire("disconnect")
})
require("connect/vote")
require("connect/result")
require("connect/gameover")
