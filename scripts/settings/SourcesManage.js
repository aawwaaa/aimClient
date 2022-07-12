const Window = require("Window");
const Manager = require("Manager");
const Stys = require("Styles");


module.exports=(type,data)=>{

    let window=new Window();
    window.setTitle("@sourcesManage");
    /**
     * |========================================|
     * |       name                           ED|
     * |========================================|
     * E:export
     * D:delete
     */

    let body=new Table();

    let draw;

    let pane=body.pane(cons(t=>{
        draw=(w)=>{
            t.clear()
            
            let width=Math.floor(w/500);
            if(width==0) width=1
            let wid=width*500;
            let ww=wid/width;
            // print(width)
            let id=0;
            let ly=0
            let sources=[]
            sources.push.apply(sources,Manager.sources.maps.sources)
            sources.push.apply(sources,Manager.sources.plugins.sources)
            for(let source of sources){
                let y=Math.floor(id/width);
                if(y!=ly){
                    ly=y;
                    t.row();
                }

                t.table(Stys.button,cons(t=>{
                    t.add(source.type=="plugin"?"[PLUGIN]":"[MAP]").size(100,32)
                    t.add(source.toString()).size(ww-100-64,32)
                    let s=source
                    let b=t.button(Core.atlas.drawable("aimclient-export"),Stys.di,run(()=>{
                        new FileSelector(window,{
                            endsName:s.type=="plugin"?".acps":".acms",
                            save:true,
                            onSelect(f){
                                try{
                                    new Fi(f).writeString(s.str)
                                    draw(w)
                                }catch(e){
                                    let w=new Window()
                                    w.setTitle("@error")
                                    let b=new Table();
                                    b.area(e.toString(),cons(a=>{})).size(512,128).row()
                                    b.button("@ok",Stys.dt,run(()=>{
                                        w.close()
                                    })).size(512,32).get()
                                    w.setBody(b)
                                    w.setSize(512,80+128)
                                    w.setResizable(false)
                                    w.center()
                                    w.show()
                                }
                            }
                        })
                    })).size(32).get()
                    b.resizeImage(16)
                    b=t.button(Core.atlas.drawable("aimclient-trash"),Stys.di,run(()=>{
                        (s.type=="plugin"?Manager.sources.plugins.delete:Manager.sources.maps.delete)(s.toString())
                        draw(w)
                    })).size(32).get()
                    b.resizeImage(16)
                })).width(ww)
                id++
            }
        }
    }))
    
    let statusBar=new Table();

    let b=statusBar.button(Core.atlas.drawable("aimclient-import"),Stys.di,run(()=>{
        new FileSelector(window,{
            endsName:".acms",
            onSelect(f){
                try{
                    let fi=new Fi(f)
                    Manager.sources.maps.add(fi.readString())
                    draw(w)
                }catch(e){
                    let w=new Window()
                    w.setTitle("@error")
                    let b=new Table();
                    b.area(e.toString(),cons(a=>{})).size(512,128).row()
                    b.button("@ok",Stys.dt,run(()=>{
                        w.close()
                    })).size(512,32).get()
                    w.setBody(b)
                    w.setSize(512,80+128)
                    w.setResizable(false)
                    w.center()
                    w.show()
                }
            }
        })
    })).size(120,32).get()
    b.resizeImage(16)
    b.add("@importMapSource")

    b=statusBar.button(Core.atlas.drawable("aimclient-import"),Stys.di,run(()=>{
        new FileSelector(window,{
            endsName:".acps",
            onSelect(f){
                try{
                    let fi=new Fi(f)
                    Manager.sources.plugins.add(fi.readString())
                    draw(w)
                }catch(e){
                    let w=new Window()
                    w.setTitle("@error")
                    let b=new Table();
                    b.area(e.toString(),cons(a=>{})).size(512,128).row()
                    b.button("@ok",Stys.dt,run(()=>{
                        w.close()
                    })).size(512,32).get()
                    w.setBody(b)
                    w.setSize(512,80+128)
                    w.setResizable(false)
                    w.center()
                    w.show()
                }
            }
        })
    })).size(120,32).get()
    b.resizeImage(16)
    b.add("@importPluginSource")

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