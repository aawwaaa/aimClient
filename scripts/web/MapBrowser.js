const Window = require("Window");
const Manager = require("Manager");
const Selectors = require("selectors/Selectors")
const Stys = require("Styles")

function MapMeta(){
    this.id=0;
    this.name="";
    this.mapName="";
    this.author="";
    this.desc="";
    this.tags=[];
}

module.exports=(type,data)=>{

    let window=new Window();
    window.setTitle("@WmapBrowser");

    /**
     * [search                      ][Reload]
     * [tags                                ]
     * ======================================
     * id mapName author           [Download]
     * desc                        [Del][Upd]
     * [tag][tag]
     * ---------------------500px------------
     * ===[usid                  ][Upload]===
     * 
     * child page:
     *  sourceSelect
     *  upload
     *  update
     */

    let body=new Table();
    let source=Manager.sources.maps.get(Core.settings.get("ac-map-source",Manager.sources.maps.getDefaultSource().toString()))
    if(source==undefined) source=Manager.sources.maps.getDefaultSource()
    let draw;
    let maps=[];
    let flush=()=>{
        if(source==null) return;
        for(let k in source.tags){
            source.tags[k]=source.tags[k].startsWith("@")?Core.bundle.get(source.tags[k].substring(1)):source.tags[k]
        }
        source.list(m=>{
            maps=m
            Core.app.post(()=>{
                draw(window.getW())
            })
        })
    }
    let sourceSelect;
    let search;
    let ta=[]
    let tagsT;
    let currTag="all"
    let usid="";
    let page;
    let pageL;
    let amount;
    let top=body.table(cons(t=>{
        ta.push(t.table(cons(t=>{
            sourceSelect=Selectors.objectSelectButton(window,t,{
                onSelect(o){
                    if(o!=null){
                        source=o
                        Core.settings.put("ac-map-source",o.toString())
                        flush()
                    }
                },
                datas:Manager.sources.maps.sources
            })
            sourceSelect.setObject(source)
            search=t.field("",Stys.textField,cons(a=>{
                draw(window.getW())
            }))
            t.button(Core.atlas.drawable("aimclient-reload"),Stys.di,run(()=>{
                flush()
            })).size(32,32).get().resizeImage(16);
        })))
        t.row()
        ta.push(t.table(cons(t=>{t.add("a")})))
        t.row()
        ta.push(t.table(cons(t=>{
            t.button(Core.atlas.drawable("aimclient-back"),Stys.di,run(()=>{
                page.get().setText(page.get().getText()-1+"")
                if(page.get().getText()<0) page.get().setText(0+"")
                draw(window.getW())
            })).size(32,32).get().resizeImage(16);
            page=t.field("0",Stys.textField,cons(a=>{
                draw(window.getW())
            }))
            pageL=t.label(prov(x=>{return "/"+Math.floor(amount/30)}))
            t.button(Core.atlas.drawable("aimclient-next"),Stys.di,run(()=>{
                page.get().setText(+page.get().getText()+1+"")
                if(page.get().getText()>amount/30) page.get().setText(Math.floor(amount/30)+"")
                draw(window.getW())
            })).size(32,32).get().resizeImage(16);
        })))
    }))
    body.row()
    let pane=body.pane(cons(t=>{
        draw=(w)=>{
            if(source==null) return;
            ta[1].get().clear()
            let l=0;
            for(let _ in source.tags){l++}
            for(let tag in source.tags){
                let t=tag
                ta[1].get().button(source.tags[tag],Stys.dt,run(()=>{
                    currTag=t
                    draw(window.getW())
                })).size(Math.floor(w/l),32).get().setDisabled(currTag==tag)
            }
            
            t.clear();
            let width=Math.floor(w/500);
            if(width==0) width=1
            let wid=width*500;
            let ww=wid/width;
            // print(width)
            let id=0;
            let ly=0
            amount=source.search(maps,search.get().getText(),currTag).length
            let p=+page.get().getText()
            for(let map of source.search(maps,search.get().getText(),currTag).slice(p*30,p*30+30)){
                let y=Math.floor(id/width);
                if(y!=ly){
                    ly=y;
                    t.row();
                }
                t.table(Stys.button,cons(t=>{
                    /**
                     * ===============================
                     * id       name        [download]
                     * author   [tags]
                     * desc
                     * ===============================
                     */
                    let ma=map
                    t.table(cons(t=>{
                        t.label(prov(()=>"[gray]"+ma.id)).size(ww-64,32).left()
                        let butt=t.button(Core.atlas.drawable("aimclient-vote"),Stys.di,run(()=>{
                            Call.sendChatMessage(";nethostx "+ma.id)
                        })).size(32).get()
                        butt.resizeImage(16)
                        butt.setDisabled(!Manager.connected)
                        t.button(Core.atlas.drawable("aimclient-download"),Stys.di,run(()=>{
                            let statStr="@mapDownloading"
                            let hasErr=false
                            let canceled=false
                            let w=new Window()
                            w.setTitle("@mapDownload")
                            let b=new Table();
                            b.add(ma.mapName).row()
                            b.label(prov(()=>statStr)).size(480,32).row()
                            let areaa=b.area("",cons(a=>{})).size(480,0).touchable(Touchable.disabled)
                            let area=areaa.get()
                            area.visibility=boolp(()=>hasErr)
                            b.row()
                            let button=b.button("@cancel",Stys.dt,run(()=>{
                                canceled=true
                                w.close()
                            })).size(480,32).get()
                            w.setBody(b)
                            w.setSize(480,80)
                            w.setResizable(false)
                            w.center()
                            w.show()
                            w.onClose=()=>canceled=true
                            try{
                                source.download(ma,usid,fi=>{
                                    if(canceled) return;
                                    try{
                                        statStr="@mapImporting"
                                        Vars.maps.importMap(fi);
                                        statStr="@mapDownloadDone"
                                        button.setText("@ok")
                                        fi.delete()
                                    }catch(e){
                                        statStr="@mapImportFail"
                                        hasErr=true
                                        w.setSize(500,400)
                                        area.setText(e+"")
                                        button.setText("@ok")
                                        areaa.size(500,320)
                                    }
                                })
                            }catch(e){
                                statStr="@mapDownloadFail"
                                hasErr=true
                                w.setSize(500,400)
                                area.setText(e+"")
                                button.setText("@ok")
                                areaa.size(500,320)
                            }
                        })).size(32,32).get().resizeImage(16);
                    })).size(ww,32)
                    t.row()
                    t.label(prov(()=>ma.mapName)).size(ww,32).get().setWrap(true)
                    t.row()
                    t.label(prov(()=>Core.bundle.get("Mauthor")+ma.author)).size(ww,32).get().setWrap(true)
                    t.row()
                    t.table(cons(t=>{
                        let wi=ww;
                        if(map.tags==null) map.tags=[]
                        let str=""
                        for(let tag of map.tags){
                        str+="["+source.tags[tag]+"]"
                            wi-=wi/map.tags.length;
                        }
                        t.add(str).size(wi,32)
                    })).size(ww,32).row()
                    t.label(prov(()=>ma.desc)).width(ww).get().setWrap(true)
                    t.row()
                    //t.image().color(Color.gray).width(ww).height(2)
                    //t.row()
                    t.add("[white]").size(0,0)
                })).width(ww)
                id++
            }
        }
    }))
    
    let statusBar=new Table();

    let aa=body.add("").get();
    let ab=statusBar.add("").get();
    window.onResize=(w,h)=>{
        draw(w)
        top.size(w,32*3)
        ta.forEach(t=>t.size(w,32))
        sourceSelect.cell.size((w-32)*0.3,32)
        search.size((w-32)*0.7,32)
        page.size((w-64)*0.45,32)
        pageL.size((w-64)*0.55,32)
        pane.size(w,h-32*3)
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
    flush()
}
