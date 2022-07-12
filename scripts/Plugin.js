let infoEdit=require("plugin/InfoEdit")
let fileIO=require("plugin/FileIO")

module.exports=(MainWindow,childs,Manager)=>{
    childs.plugin={
        name:"@plugin",
        icon:Core.atlas.drawable("aimclient-plugin"),
        hasChild:true,
        childs:{}
    }
    childs.plugin.childs=Object.assign(childs.plugin.childs,{
        infoEdit:{
            name:"info edit",
            hasChild:false,
            run:()=>{
                infoEdit();
            }
        },
        fileIO:{
            name:"file io",
            hasChild:false,
            run:()=>{
                fileIO();
            }
        },
    })
}