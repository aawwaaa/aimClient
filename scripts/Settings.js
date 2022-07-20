let style=require("settings/Style")
let pluginManage=require("settings/PluginManage")
let sourcesManage=require("settings/SourcesManage")
let fragSettings=require("settings/Frag")

module.exports=(MainWindow,childs,Manager)=>{
    childs.settings={
        name:"@settings",
        icon:Core.atlas.drawable("aimclient-settings"),
        hasChild:true,
        childs:{}
    }
    childs.settings.childs=Object.assign(childs.settings.childs,{
        style:{
            name:"@style",
            icon:Core.atlas.drawable("aimclient-style"),
            hasChild:false,
            run:()=>{
                style();
            }
        },
        pluginManage:{
            name:"@pluginManage",
            icon:Core.atlas.drawable("aimclient-plugin"),
            hasChild:false,
            run:()=>{
                pluginManage();
            }
        },
        sourcesManage:{
            name:"@sourcesManage",
            icon:Core.atlas.drawable("aimclient-source"),
            hasChild:false,
            run:()=>{
                sourcesManage();
            }
        },
        fragSettings:{
            name:"@frag-settings",
            icon:Core.atlas.drawable("aimclient-frag"),
            hasChild:false,
            run:()=>{
                fragSettings();
            }
        },
    })
}