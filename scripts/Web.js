let mapBrowser=require("web/MapBrowser");
let pluginBrowser=require("web/PluginBrowser");

module.exports=(MainWindow,childs,Manager)=>{
    childs.web={
        name:"@webService",
        icon:Core.atlas.drawable("aimclient-web"),
        hasChild:true,
        childs:{}
    }
    childs.web.childs=Object.assign(childs.web.childs,{
        mapBrowser:{
            name:"@mapBrowser",
            icon:Core.atlas.drawable("aimclient-netmap"),
            hasChild:false,
            run:()=>{
                mapBrowser();
            }
        },
        pluginBrowser:{
            name:"@pluginBrowser",
            icon:Core.atlas.drawable("aimclient-plugin"),
            hasChild:false,
            run:()=>{
                pluginBrowser();
            }
        }
    })
}