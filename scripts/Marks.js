const Stys=require("Styles")
const Pos1=require("selectors/Position")
const Manager=require("Manager")
var obj={
    init(){
        const MainWindow=require("MainWindow")
        this.markIcons.defend=Core.atlas.find("aimclient-defend") 
        this.markIcons.attack=Core.atlas.find("aimclient-attack") 
        this.markIcons.gather=Core.atlas.find("aimclient-gather") 
        this.markIcons.what=Core.atlas.find("aimclient-what") 
        this.markIcons.mark=Core.atlas.find("aimclient-mark") 
        let ru=null;
        //for(let a in MainWindow) print(a)
        let b=MainWindow.bottomButtons.button(Core.atlas.drawable("aimclient-targ"),Stys.togglei,run(()=>{ru()})).size(48,48).left().top().get()
        b.resizeImage(32)
        let l1;
        let tc=MainWindow.table.table(Stys.button,cons(table=>{
        table.button(Core.atlas.drawable("aimclient-defend"),Stys.di,run(()=>{
            new Pos1({
                onSelect:(x,y)=>Call.sendChatMessage("<AC"+Manager.version+"-"+Manager.versionType+"><Defend>/"+Core.bundle.get("mark-defend")+" ("+x+","+y+")"),
                unitGrid:false
            })
        })).size(48).get().resizeImage(32)
        table.button(Core.atlas.drawable("aimclient-attack"),Stys.di,run(()=>{
            new Pos1({
                onSelect:(x,y)=>Call.sendChatMessage("<AC"+Manager.version+"-"+Manager.versionType+"><Attack>/"+Core.bundle.get("mark-attack")+" ("+x+","+y+")"),
                unitGrid:false
            })
        })).size(48).get().resizeImage(32)
       table.button(Core.atlas.drawable("aimclient-gather"),Stys.di,run(()=>{
           new Pos1({
               onSelect:(x,y)=>Call.sendChatMessage("<AC"+Manager.version+"-"+Manager.versionType+"><Gather>/"+Core.bundle.get("mark-gather")+" ("+x+","+y+")"),
               unitGrid:false
           })
       })).size(48).get().resizeImage(32)
       table.button(Core.atlas.drawable("aimclient-what"),Stys.di,run(()=>{
           new Pos1({
               onSelect:(x,y)=>Call.sendChatMessage("<AC"+Manager.version+"-"+Manager.versionType+"><What>/"+Core.bundle.get("mark-what")+" ("+x+","+y+")"),
               unitGrid:false
           })
       })).size(48).get().resizeImage(32)
       table.button(Core.atlas.drawable("aimclient-mark"),Stys.di,run(()=>{
           new Pos1({
               onSelect:(x,y)=>Call.sendChatMessage("<AC"+Manager.version+"-"+Manager.versionType+"><Mark>/"+Core.bundle.get("mark-mark")+" ("+x+","+y+")"),
               unitGrid:false
           })
       })).size(48).get().resizeImage(32)
       l1=table.add("").size(0).get()
        })).width(48*5).height(0).left().top().minWidth(48*5).padLeft(48*0.23)
        MainWindow.table.row()
        tc.get().visibility=boolp(()=>b.isChecked()&&MainWindow.s)
       MainWindow.moveY.push(()=>b.isChecked()&&MainWindow.s?-24:0)
       ru=()=>{
           tc.height(b.isChecked()&&MainWindow.s?48:0)
           l1.setText("-")
           l1.setText("")
           Core.settings.put("marks-show",b.isChecked()?"1":"0")
       }
       l1.setText("-")
       l1.setText("")
       Timer.schedule(()=>{
        b.setChecked(Core.settings.get("marks-show","1")=="1")
        tc.height(b.isChecked()&&MainWindow.s?48:0)
    },1)
    },
    marks:[],
    markIcons:{}
}
Events.on(WorldLoadEvent,()=>{
    obj.marks=[]
})
Events.run(Trigger.draw,()=>{
    obj.marks.forEach(m=>{
        Draw.rect(obj.markIcons[m.type],m.x*8,m.y*8,24,24)
    })
    obj.marks=obj.marks.filter(m=>Date.now()<m.endTime)
})
let types={
    Defend:"defend",
    Attack:"attack",
    Gather:"gather",
    What:"what",
    Mark:"mark"
}
Manager.events.on("msg",msg=>{
    for(let k in types){
        let a=k
        if(msg.includes("<"+k+">")){
            msg.replace(/\([0-9]{1,},[0-9]{1,}\)/,(d)=>{
                let pos=d.substring(1).substring(0,d.length-2).split(",")
                obj.marks.push({
                    type:types[a],
                    x:pos[0],
                    y:pos[1],
                    endTime:Date.now()+30000
                })
            })
            break
        }
    }
})
module.exports=obj