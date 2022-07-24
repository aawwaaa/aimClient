//thank 144_ for gives me the inspiration

const Window = require("Window");
const Manager = require("Manager");
const Stys = require("Styles");

module.exports=(type,data)=>{

    let window=new Window();
    window.setTitle("@playerList");

    let body=new Table();
    let draw
    let p=body.pane(cons(t=>{
          draw=(w)=>{
            t.clear();
            let width=Math.floor(w/500);
            if(width==0) width=1
            let wid=w;
            let ww=wid/width;
            let id=0;
            let ly=0
            Groups.player.each(p=>{
                let y=Math.floor(id/width);
                if(y!=ly){
                    ly=y;
                    t.row();
                }
                let id=p.id-1,n=false
                if(p.name.includes("|")){
                    let spl=p.name.split("|")[1]
                    if(spl.length==3){
                        id=spl
                        n=true
                    }
                }
                t.table(Stys.button,cons(t=>{
                    t.table(cons(t=>{
                        t.add(p.name+"").size(ww*0.75-32,32)
                        t.button(Core.atlas.drawable("aimclient-copy"),Stys.di,run(()=>{
                            Core.app.setClipboardText(p.name+"");
                        })).size(32,32).get().resizeImage(16)
                        t.add((n?id:id+1)+"").size(ww*0.25-32,32)
                        t.button(Core.atlas.drawable("aimclient-copy"),Stys.di,run(()=>{
                            Core.app.setClipboardText(id+"");
                        })).size(32,32).get().resizeImage(16)
                    })).size(ww,32).row()
                    t.table(cons(t=>{
                        let w=ww/Manager.playerOp.filter(a=>a.valid(p,id)).length
                        Manager.playerOp.filter(a=>a.valid(p,id)).forEach(a=>{
                            let butt=t.button(a.icon?Core.atlas.drawable(a.icon):a.name,a.icon?Stys.di:Stys.dt,run(()=>{
                                a.run(p,id)
                            })).size(w,32).get()
                            if(a.icon){
                                butt.resizeImage(16)
                                butt.add(a.name).size(w-32,32)
                            }
                        })
                    })).size(ww,32).row()
                })).size(ww,64).row()
                id++
            })
        }
    }))
    
    let statusBar=new Table();

    let aa=body.add("").get();
    let ab=statusBar.add("").get();
    window.onResize=(w,h)=>{
        p.size(w,h)
        draw(w)
        aa.setText("-")
        ab.setText("-")
        aa.setText("")
        ab.setText("")
    }

    window.setBody(body);
    window.setStatusBar(statusBar);
    window.setSize(600,400)
    window.center();
    window.show();
}
Manager.playerOp.push({
    name:"@move",
    icon:"aimclient-move",
    valid(p,id){
        return true
    },
    run(p,id){
        Core.camera.position.x=p.x
        Core.camera.position.y=p.y
    }
})
Manager.playerOp.push({
    name:"@tap",
    icon:"aimclient-tap",
    valid(p,id){
        return true
    },
    run(p,id){
        Call.sendChatMessage("<AC"+Manager.version+"-"+Manager.versionType+">"+Core.bundle.get("tapMsg").replace("@",p.name))
    }
})
Manager.playerOp.push({
    name:"@kick",
    icon:"aimclient-break",
    valid(p,id){
        return true
    },
    run(p,id){
        if(Manager.connected){
            Call.sendChatMessage(";kick "+id)
        }else{
            Call.sendChatMessage("/votekick "+p.name)
            //Timer.schedule(()=>{Call.sendChatMessage("/vote kick "+id)},3)
        }
    }
})
Manager.playerOp.push({
    name:"@test",
    icon:"aimclient-test",
    valid(p,id){
        return !Manager.connected
    },
    run(p,id){
        Call.sendChatMessage("/test "+id)
    }
})
Manager.playerOp.push({
    name:"@mute",
    valid(p,id){
        return true
    },
    run(p,id){
        if(Manager.connected){
            Call.sendChatMessage(";mute "+id)
        }else{
            //Call.sendChatMessage("/vote mute "+p.name)
            Call.sendChatMessage("/mute "+id)
        }
    }
})
Manager.playerOp.push({
    name:"@forceOb",
    valid(p,id){
        return true
    },
    run(p,id){
        if(Manager.connected){
            Call.sendChatMessage(";fob "+id)
        }else{
            Call.sendChatMessage("/vote ob "+id)
        }
    }
})