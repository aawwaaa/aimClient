const Window = require("Window");
const Manager = require("Manager");
const Stys = require("Styles");

module.exports=(plugin)=>{

    let window=new Window();
    window.setTitle("@WpluginInfo");

    let body=new Table();

    let draw;

    let pane=body.pane(cons(t=>{
        draw=(w)=>{
            t.clear()
            /**
             * name
             * author
             * version
             * desc
             * GUID
             * lastPackedTime -> lastAccessTime
             */
            t.table(Stys.buttonNoBackground,cons(t=>{
                t.add("@Mname").size(120,32)
                t.add(plugin.name+"").size(w-120,32)
            })).size(w,32).row()
            t.table(Stys.buttonNoBackground,cons(t=>{
                t.add("@Mauthor").size(120,32)
                t.add(plugin.author+"").size(w-120,32)
            })).size(w,32).row()
            t.table(Stys.buttonNoBackground,cons(t=>{
                t.add("@Mversion").size(120,32)
                t.add(plugin.version+"").size(w-120,32)
            })).size(w,32).row()
            t.table(Stys.buttonNoBackground,cons(t=>{
                t.add("@Mdesc").size(w,32).row()
                t.add(plugin.desc+"").width(w).get().setWrap(true)
            })).width(w).row()
            t.table(Stys.buttonNoBackground,cons(t=>{
                t.add("GUID: ").size(120,32)
                t.add(plugin.GUID+"").size(w-120,32)
            })).size(w,32).row()
            t.table(Stys.buttonNoBackground,cons(t=>{
                t.add("@MlastPackedTime").size(120,32)
                let utcTime=plugin.lastAccessTime;
                let time=new Date(utcTime);
                t.add(time.toLocaleString()+"").size(w-120,32)
            })).size(w,32).row()
        }
    }))
    
    let statusBar=new Table();

    let aa=body.add("").get();
    let ab=statusBar.add("").get();
    window.onResize=(w,h)=>{
        pane.size(w,h)
        draw(w)
        aa.setText("-")
        ab.setText("-")
        aa.setText("")
        ab.setText("")
    }

    window.setBody(body);
    window.setStatusBar(statusBar);
    window.setSize(500,400)
    window.center();
    window.show();
}