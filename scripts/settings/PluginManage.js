const Window = require("Window");
const Manager = require("Manager");
const Stys = require("Styles");
const Packer = require("plugin/Packer")
const pluginInfo = require("settings/PluginInfo")

let tags=["@Tcont","@Tstyle",""]

for(let k in tags){
    tags[k]=tags[k].startsWith("@")?Core.bundle.get(tags[k].substring(1)):tags[k]
}

module.exports=(type,data)=>{

    let window=new Window();
    window.setTitle("@WpluginManage");
    /**
     * |========================================|
     * |name             ver|name...
     * |By:...              |By:...
     * |desc... [E][X][I][D]|
     * |[import]================================|
     * E:export
     * X:checkbox
     * I:info
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
            Manager.plugins.plugins.push.apply(Manager.plugins.plugins,Manager.plugins.tempPlugins)
            for(let plugin of Manager.plugins.plugins){
                let y=Math.floor(id/width);
                if(y!=ly){
                    ly=y;
                    t.row();
                }

                t.table(Stys.button,cons(t=>{
                    t.table(cons(t=>{
                        t.add((Manager.plugins.tempPlugins.includes(plugin)?"[gray]":"")+(Manager.plugins.pluginsFi[plugin.GUID]==undefined||plugin.deleted==true?"[red]":"")+plugin.name).size(ww-180,32)
                        t.add(plugin.version+"").size(180,32)
                    })).size(ww,32).row()
                    t.table(cons(t=>{
                        t.add("@Mauthor").size(120,32)
                        t.add(plugin.author+"").size(ww-120,32)
                    })).size(ww,32).row()
                    t.table(cons(t=>{
                        let pl=plugin;
                        t.label(prov(()=>pl.desc+"")).width(ww).get().setWrap(true)
                        t.row()
                        t.table(cons(t=>{
                            t.add(pl.tags.map((a,i)=>a?"["+tags[i]+"]":"").join("")).size(ww-32*5,32)
                            var b=t.button(Core.atlas.drawable("aimclient-reload"),Stys.di,run(()=>{
                                Manager.plugins.loadPlugin(pl)
                            })).size(32,32).get()
                            b.resizeImage(16)
                            b.setDisabled(!pl.tags[2])
                            b=t.button(Core.atlas.drawable("aimclient-export"),Stys.di,run(()=>{
                                new FileSelector(window,{
                                    endsName:".acpl",
                                    save:true,
                                    onSelect(f){
                                        try{
                                            new Fi(f).writeBytes(Packer.pack(pl))
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
                            })).size(32,32).get()
                            b.resizeImage(16)
                            b.setDisabled(Manager.plugins.pluginsFi[plugin.GUID]==undefined||plugin.deleted==true)
                            let c=t.check("",new Boolc(){
                                get(bool){
                                    Core.settings.put("ac-plugin-"+pl.GUID+"-disabled",bool?"false":"true")
                                }
                            }).size(32,32).get()
                            c.setChecked(Core.settings.get("ac-plugin-"+plugin.GUID+"-disabled","false")=="false")
                            c.setStyle(Stys.check)
                            t.button(Core.atlas.drawable("aimclient-info"),Stys.di,run(()=>{
                                pluginInfo(pl)
                            })).size(32,32).get().resizeImage(16)
                            var b=t.button(Core.atlas.drawable("aimclient-trash"),Stys.di,run(()=>{
                                Manager.plugins.delete(pl)
                                pl.deleted=true
                                draw(w)
                            })).size(32,32).get()
                            b.resizeImage(16)
                            b.setDisabled(Manager.plugins.pluginsFi[plugin.GUID]==undefined||plugin.deleted==true)
                        })).size(ww,32).right()
                    })).width(ww)
                })).width(ww)

                id++
            }
            Manager.plugins.plugins.splice(Manager.plugins.plugins.length-Manager.plugins.tempPlugins.length,Manager.plugins.tempPlugins.length)
        }
    }))
    
    let statusBar=new Table();

    let b=statusBar.button(Core.atlas.drawable("aimclient-import"),Stys.di,run(()=>{
        new FileSelector(window,{
            endsName:".acpl",
            onSelect(f){
                try{
                    let fi=new Fi(f)
                    Manager.plugins.import(fi)
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
    b.add("@import")

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