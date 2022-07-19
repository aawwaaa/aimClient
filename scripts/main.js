/**
 * 
 */


if(Packages.arc.files) importPackage(Packages.arc.files)


require("Manager");
const Stys=require("Styles")
require("selectors/Draw")
require("plugin/Packer")
const Manager = require("Manager");
const MainWindow = require("MainWindow");
const Drawa=require("selectors/Draw");
MainWindow.menus={
    name:"main",
    icon:null,
    hasChild:true,
    childs:{
        main:{
            hasChild:true,
            childs:{}
        }
    }
}
let funcs=[
    require("Admin"),
    require("Windows"),
    require("Tools"),
    require("Web"),
    require("Plugin"),
    require("Server"),
    require("Settings"),
    require("About"),
    require("ai/m"),
    require("frags/m"),
    require("connect/Votes"),
]
let f=require("DefaultInfoT");
const { events } = require("Manager");

let load=()=>{
    
    Manager.acdir=Vars.dataDirectory.child("aimclient")
    Manager.acdir.mkdirs()

    Manager.tempDir=Manager.acdir.child("temp")
    Manager.tempDir.mkdirs()
    
    Manager.plugins.dir=Manager.acdir.child("plugins")
    Manager.plugins.dir.mkdirs()
    Manager.plugins.init()

    Manager.sources.dir=Manager.acdir.child("sources")
    Manager.sources.dir.mkdirs()
    Manager.sources.maps.dir=Manager.sources.dir.child("maps")
    Manager.sources.maps.dir.mkdirs()
    Manager.sources.plugins.dir=Manager.sources.dir.child("plugins")
    Manager.sources.plugins.dir.mkdirs()
    Manager.sources.init()
    
    
    Stys.load()

    Manager.load=true
    let logger=Log.logger;
    let logTypes={
        info:"[blue][I][]",
        warn:"[yellow][W][]",
        err:"[red][E][]",
        debug:"[cyan][D][]",
        none:"[white][]"
    }
    let newLogger=new Log.LogHandler(){
        log(type,msg){
            logger.log(type,msg)
            let str=logTypes[type]+" "+msg;
            Manager.events.fire("log",str);
        }
    }
    Log.logger=newLogger;
    let oldChatFrag=Vars.ui.chatfrag
    let newChatFrag=new JavaAdapter(ChatFragment,{
        addMessage(message){
            oldChatFrag.addMessage(message)
            this.super$addMessage(message)
            Manager.events.fire("msg",message)
        }
    })
    Vars.ui.chatfrag=newChatFrag
    MainWindow.init()
    MainWindow.defaultInfoT=f();
    MainWindow.infoT.clear()
    MainWindow.infoT.add(MainWindow.defaultInfoT);
    Drawa.init()
    funcs.forEach(x=>{try{x(MainWindow,MainWindow.menus.childs.main.childs,Manager)}catch(e){print(e)}});

    Manager.plugins.load()
}


Events.on(ClientLoadEvent,()=>{
    /*
    if(Version.build<135||Version.build>2000){
        let dialog=new Dialog("[yellow]<!>Warning<!>");
        dialog.cont.pane(cons(t=>{
            t.add("AimClient needs build 135 or higher to working good!").row();
            t.add("And if you try to use build 134 or lower, it maybe will crash your game!").row();
        })).row();
        dialog.cont.table(cons(t=>{
            t.button("still use it",()=>{
                dialog.hide();
                load();
            }).size(96,32)
            t.button("@ok",()=>{
                dialog.hide();
            }).size(96,32)
        }));
        dialog.show();
        return;
    }
    */
    load();
})

Events.on(UnitCreateEvent,(e)=>{
    events.fire("unitChange")
    events.fire("UnitCreate",e)
})
Events.on(UnitDestroyEvent,(e)=>{
    events.fire("unitChange")
    events.fire("UnitDestroy",e)
})

require("connect/init")