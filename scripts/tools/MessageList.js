const { events } = require("Manager");
const Window = require("Window");
const Manager = require("Manager");
const FileSelector = require("selectors/FileSelector");
const Stys = require("Styles")

let exts = eval("extend")

let messages=[]

module.exports=()=>{
    let window=new Window()
    window.setTitle("@WmessageList");
    window.setSize(500,400);
    let d=true
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
    let event=events.on("msg",str=>{
        consoleObj.log(str)
    })
    window.onClose=()=>{event.cancel();}
    let statusBar=new Table();
    let b=statusBar.button(Core.atlas.drawable("aimclient-rollDownWhenNewLine"),Stys.is,run(()=>{
        d=!d;
        b.setChecked(d);
    })).size(32,32).left().get();
    b.resizeImage(16);
    b.setChecked(d);
    statusBar.label(prov(()=>d?"V":"-")).size(16,32)
    let c=statusBar.pane(cons(x=>{}))
    statusBar.table(cons(t=>{
        t.button(Core.atlas.drawable("aimclient-download"),Stys.di,run(()=>{
            new FileSelector(window,{
                endsName:".txt",
                save:true,
                onSelect:file=>{
                    let f=new Packages.arc.files.Fi(file);
                    f.writeString(messages.join("\n\n"))
                }
            })
        })).size(32,32).get().resizeImage(16)
    })).right()

    let aa=body.add("").get();
    let ab=statusBar.add("").get();
    window.onResize=(w,h)=>{
        c.size(w-32*3.5,32);
        p.size(w,h);
        aa.setText("-")
        ab.setText("-")
        aa.setText("")
        ab.setText("")
    }
    
    for(let m of messages){
        consoleObj.log(m)
    }

    window.setBody(body);
    window.setStatusBar(statusBar);
    window.setSize(500,500)
    window.center();
    window.show();
}

events.on("msg",str=>{
    messages.push(str)
})