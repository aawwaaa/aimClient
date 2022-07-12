const { events } = require("Manager");
const Window = require("Window");
const Manager = require("Manager");
const FileSelector = require("selectors/FileSelector");
const Stys = require("Styles")

let exts = eval("extend")

module.exports=()=>{
    let msg_a=+Core.settings.get("aimclient-msg-a","0.6");
    let history=[];
    let sind=0;
    let typing=false;
    let window=new Window();
    let d=true;
    window.setTitle("@Wconsole");
    window.setFromServer(true);
    window.setSize(500,400);
    /**
     * ============================
     * |  console                 |
     * ----------------------------
     * input                      |
     * [d]--------[<][>][C][V][L][R]
     * ============================
     * d: down if new line
     * <: prev
     * >: next
     * C: copy
     * V: paste
     * L: loadFile
     * R: run
     */

    let body=new Table();
    let log;
    let consoleObj={}
    let p=body.pane(cons(t=>{
        log=(msg,m)=>{
            let ma=m;
            t.add(msg).growX();
            t.button(Core.atlas.drawable("aimclient-copy"),Stys.di,run(()=>{
                Core.app.setClipboardText(ma);
            })).size(20,20).right().get().resizeImage(16);
            t.row();
            if(d){
                Timer.schedule(()=>p.get().setScrollY(p.get().getMaxY()),0.02)
            }
        }
        consoleObj.log=(m)=>log(m+"",m+"")
        consoleObj.add=(e)=>{let cell=t.add(e).growX().left();t.row();return cell}
        consoleObj.clear=()=>{t.clear()}
    }));
    let event=events.on("serverJSLog",str=>{
        log(str.replace("|DATA|",""),str.substring(str.indexOf("|DATA|")+6));
    })
    window.onClose=()=>{event.cancel();}
    body.row();
    let lastY=0;
    let i=body.image().color(Stys.themeColor).size(100,10).growX();
    i.get().addListener(exts(InputListener,{
        touchDown(event, x, y, pointer, button){
            lastY=y;
            return true;
        },
        touchUp(event, x, y, pointer, button){
            let my=y-lastY;
            my*=Manager.scale();
            my/=window.height;
            msg_a-=my;
            msg_a=msg_a>0?msg_a<1?msg_a:1:0;
            if(!window.isFullScreen())window.resize(window.width,window.height);else{
                window.onResize(Manager.width(),Manager.height()-64)
                window.body.updateVisibility();
                window.statusBar.updateVisibility();
            }
            Core.settings.put("aimclient-msg-a",msg_a.toString());
        }
    }));
    body.row();
    let inp=body.area("",Stys.area,cons(data=>{
        if(!typing){
            typing=true;
            sind=history.length;
        }
        history[sind]=data;
    })).growX().fillY()
    
    // body.label(()=>window.width+"x"+window.height).size(0,0);
    let input=inp.get();
    let statusBar=new Table();
    let b=statusBar.button(Core.atlas.drawable("aimclient-rollDownWhenNewLine"),Stys.is,run(()=>{
        d=!d;
        b.setChecked(d);
    })).size(32,32).left().get();
    b.setChecked(d);
    b.resizeImage(16);
    statusBar.label(prov(()=>d?"V":"-")).size(16,32)
    let c=statusBar.pane(cons(x=>{}))
    statusBar.table(cons(t=>{
        t.label(prov(()=>(sind+1)+"/"+history.length)).size(48*3,32)
        t.button("<",Stys.dt,run(()=>{
            typing=false
            input.setText(history[--sind]);
        })).size(32,32)
        t.button(">",Stys.dt,run(()=>{
            typing=false
            input.setText(history[++sind]);
        })).size(32,32)
        t.button(Core.atlas.drawable("aimclient-copy"),Stys.di,run(()=>{
            Core.app.setClipboardText(input.getText().replace(/\r/g, '\n'));
        })).size(32,32).get().resizeImage(16)
        t.button(Core.atlas.drawable("aimclient-parse"),Stys.di,run(()=>{
            input.setText(Core.app.getClipboardText());
        })).size(32,32).get().resizeImage(16)
        t.button(Core.atlas.drawable("aimclient-upload"),Stys.di,run(()=>{
            new FileSelector(window,{
                endsName:".js",
                onSelect:file=>{
                    let f=new Packages.arc.files.Fi(file);
                    let str=f.readString();
                    // log("[lightgray]> [File][] "+file,file);
                    Call.serverPacketReliable("jsExecuteF",f.name()+"|DATA|"+str);
                }
            })
        })).size(32,32).get().resizeImage(16)
        t.button(Core.atlas.drawable("aimclient-run"),Stys.di,run(()=>{
            
            let str=input.getText().replace(/\r/g, '\n');
            if(str!=history[sind-1]) sind++;
            history[sind-1]=str;
            // log("[lightgray]>[] "+str,str);
            Call.serverPacketReliable("jsExecute",str);
        })).size(32*3,32)
        // t.label(()=>window.width+"x"+window.height).size(0,0);
    })).right()

    let aa=body.add("").get();
    let ab=statusBar.add("").get();
    window.onResize=(w,h)=>{
        c.size(w-32*9-96-48*2,32);
        p.size(w,h*msg_a-15);
        i.size(w,10);
        inp.size(w,h*(1-msg_a)-15);
        aa.setText("-")
        ab.setText("-")
        aa.setText("")
        ab.setText("")
    }

    log("use Console.log(string) to log.");
    log("use Console.info/warn/err/debug(string) to log with head.");

    window.setBody(body);
    window.setStatusBar(statusBar);
    window.setSize(500,500)
    window.center();
    window.show();

    body.update(run(()=>{
        if(!Manager.connected) window.close()
        if(!Vars.player.admin) window.close()
    }))
}

Vars.netClient.addPacketHandler("serverJSLog",data=>{
    Manager.events.fire("serverJSLog",data);
})