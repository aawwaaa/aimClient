const spawn=require("tools/world/Spawn")
const fill=require("tools/world/Fill")
const units=require("tools/world/Units")

module.exports=(MainWindow,childs,Manager)=>{
    childs.world={
        name:"@world",
        icon:Core.atlas.drawable("aimclient-sandbox"),
        hasChild:true,
        childs:{
            spawn:{
                name:"@spawn",
                icon:Core.atlas.drawable("aimclient-spawn"),
                hasChild:false,
                run:()=>spawn(),
            },
            fill:{
                name:"@fill",
                icon:Core.atlas.drawable("aimclient-fill"),
                hasChild:false,
                run:()=>fill(),
            },
            units:{
                name:"@units",
                icon:Core.atlas.drawable("aimclient-units"),
                hasChild:false,
                run:()=>units(),
            }
        }
    }
}