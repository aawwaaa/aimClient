let console=require("tools/Console")
let files=require("tools/Files")
let textEditor=require("tools/TextEditor")
let testWindow=require("tools/TestWindow")
let messageList=require("tools/MessageList")

let world=require("tools/World")
let Stys=require("Styles")
module.exports=(MainWindow,childs,Manager)=>{
    childs.tools={
        name:"@tools",
        icon:Core.atlas.drawable("aimclient-tools"),
        hasChild:true,
        childs:{}
    }
    world(MainWindow,childs.tools.childs,Manager);
    childs.tools.childs=Object.assign(childs.tools.childs,{
        testWindow:{
            name:"TestWindow",
            hasChild:false,
            run:()=>testWindow()
        },
        files:{
            name:"@files",
            icon:Core.atlas.drawable("aimclient-files"),
            hasChild:false,
            run:()=>{
                files();
            }
        },
        textEditor:{
            name:"@textEditor",
            icon:Core.atlas.drawable("aimclient-textEditor"),
            hasChild:false,
            run:()=>{
                textEditor();
            }
        },
        console:{
            name:"@console",
            icon:Core.atlas.drawable("aimclient-console"),
            hasChild:false,
            run:()=>{
                console();
            }
        },
        messageList:{
            name:"@messageList",
            icon:Core.atlas.drawable("aimclient-messageList"),
            hasChild:false,
            run:()=>{
                messageList();
            }
        }
    })
    MainWindow.bottomButtons.button(Core.atlas.drawable("aimclient-messageList"),Stys.di,run(()=>{
        messageList();
    })).size(48).get().resizeImage(16)
}