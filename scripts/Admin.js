let console = require("admin/Console")

module.exports=(MainWindow,childs,Manager)=>{
    childs.admin={
        name:"@admin",
        icon:Core.atlas.drawable("aimclient-admin"),
        hasChild:true,
        childs:{},
        visibility:()=>Manager.connected&&Vars.player.admin
    }
    childs.admin.childs=Object.assign(childs.admin.childs,{
        console:{
            name:"@console",
            icon:Core.atlas.drawable("aimclient-serverConsole"),
            hasChild:false,
            run:()=>{
                console()
            }
        },
    })
}