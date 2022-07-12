const Window = require("Window");
const UnitInfo = require("tools/world/UnitInfo");
const Manager = require("Manager");
const Stys = require("Styles");

module.exports=(type,data)=>{

    let window=new Window();
    window.setTitle("@Wunits");

    let body=new Table();
    let draw;
    let cboxes=[]
    let selectAllT;

    let p=body.pane(cons(t=>{
        draw=(w)=>{
            selectAllT.setChecked(false);
            t.clear();
            cboxes=[]
            Groups.unit.each(u=>{
                t.table(Stys.button,cons(t=>{
                    /**
                     * <select> [img] type hp/maxhp team x,y <[move] [kill] [info]>
                     */
                    let cbox=t.check("",new Boolc(()=>{})).size(32,32).left()
                    cbox.get().setStyle(Stys.check)
                    t.image(Core.atlas.find(u.type.uiIcon)).size(16,16).left();
                    t.add(u.type.localizedName).size((w-32*4.5)*0.2-32,32).left()
                    t.label(prov(()=>Math.floor(u.health)+"/"+u.maxHealth)).size((w-32*4.5)*0.3,32).left()
                    t.label(prov(()=>u.team.id+"")).size((w-32*4.5)*0.2,32).left()
                    t.label(prov(()=>Math.floor(u.x)+","+Math.floor(u.y)+"")).size((w-32*4.5)*0.3,32).left()
                    t.table(cons(t=>{
                        t.button(Core.atlas.drawable("aimclient-move"),Stys.di,run(()=>{
                            Core.camera.position.x=u.x;
                            Core.camera.position.y=u.y;
                            if(Core.input instanceof DesktopInput){
                                Core.input.panning=true
                            }
                        })).size(32).get().resizeImage(16)
                        t.button(Core.atlas.drawable("aimclient-kill"),Stys.di,run(()=>{
                            if(Vars.net.client()){
                                Call.serverPacketReliable("killUnits",u.id)
                            }else{
                                u.kill()
                            }
                        })).size(32).get().resizeImage(16)
                        t.button(Core.atlas.drawable("aimclient-info"),Stys.di,run(()=>{
                            UnitInfo(u)
                        })).size(32).get().resizeImage(16)
                    })).size(32*3,32).right()
                    cboxes.push({
                        cbox:cbox.get(),
                        unit:u
                    })
                })).size(w-32,32).row()
            })
        }
    }))
    
    let statusBar=new Table();

    statusBar.button(Core.atlas.drawable("aimclient-reload"),Stys.di,run(()=>{
        draw(window.getW())
    })).size(32).get().resizeImage(16)

    selectAllT=statusBar.check("",new Boolc(){
        get(d){
            for(let i=0;i<cboxes.length;i++){
                cboxes[i].cbox.setChecked(d)
            }
        }
    }).size(32,32).get()
    selectAllT.setStyle(Stys.check);

    let e=statusBar.table()

    /**
     * <kill>
     */

    statusBar.button(Core.atlas.drawable("aimclient-kill"),Stys.di,run(()=>{
        if(Vars.net.client()){
            let a=cboxes.filter(c=>c.cbox.isChecked()).map(c=>c.unit.id).join("|")
            Call.serverPacketReliable("killUnits",a)
        }else{
            cboxes.filter(c=>c.cbox.isChecked()).map(c=>c.unit).forEach(u=>{
                u.kill()
            })
        }
    })).size(32).get().resizeImage(16)

    let aa=body.add("").get();
    let ab=statusBar.add("").get();
    window.onResize=(w,h)=>{
        p.size(w,h)
        draw(w)
        e.size(w-32*4,32)
        aa.setText("-")
        ab.setText("-")
        aa.setText("")
        ab.setText("")
    }

    let event=Manager.events.on("unitChange",()=>{
        draw(window.getW())
    })
    window.onClose=()=>event.cancel()

    window.setBody(body);
    window.setStatusBar(statusBar);
    window.setSize(600,300)
    window.center();
    window.show();
}