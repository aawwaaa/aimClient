const Window = require("Window");
const Manager = require("Manager");
const FileSelector = require("selectors/FileSelector");
const Stys = require("Styles");
const Packer = require("plugin/Packer");

module.exports=(type,data)=>{

    let window=new Window();
    window.setTitle("fileIO");

    let currPlugin={
        name:"",
        author:"",
        desc:"",
        version:"",
        mainFilePath:"",
        GUID:"",
        tags:[false,false,false],
        lastAccessTime:0,
        files:{},           //{fileName:File/Object}
    }
    let fileName="untitled";

    let body=new Table();
    let localPath="";

    let draw;
    let pane=body.pane(cons(t=>{
        draw=(w)=>{
            t.clear()
            t.table(cons(t=>{
                t.label(prov(()=>localPath)).size(w-32,32)
                t.button(Core.atlas.drawable("aimclient-edit"),Stys.di,run(()=>{
                    new FileSelector(window,{
                        selectDirectory:true,
                        onSelect(file){
                            localPath=new Fi(file).path()
                        },
                        save:true
                    })
                })).size(32,32).get().resizeImage(16)
            })).size(w,32)
            t.row()
            t.table(cons(t=>{
                let b=t.button(Core.atlas.drawable("aimclient-download"),Stys.di,run(()=>{
                    try{
                        let fi=new Fi(localPath)
                        let files={}
        
                        let l=(fi,obj)=>{
                            for(let f of fi.list()){
                                if(f.isDirectory()){
                                    obj[f.name()]={}
                                    l(f,obj[f.name()])
                                }else{
                                    obj[f.name()]=f.readBytes()
                                }
                            }
                        }
                        l(fi,files)
                        Manager.debug=files
                        currPlugin.files=files
                    }catch(e){
                        let w=new Window()
                        w.setTitle("@error")
                        let b=new Table();
                        b.add("happen a error in saving:").row()
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
                })).size(w/2,32).get()
                b.resizeImage(16)
                b.add("save to plugin")
                b=t.button(Core.atlas.drawable("aimclient-upload"),Stys.di,run(()=>{
                    try{
                        let fi=new Fi(localPath)
                        fi.mkdirs()
                        fi.emptyDirectory()
        
                        let l=(obj,fi)=>{
                            for(let name in obj){
                                if(obj[name].length==undefined){
                                    fi.mkdirs()
                                    l(obj[name],fi.child(name))
                                }else{
                                    // print(name+" "+obj[name])
                                    fi.child(name).writeBytes(obj[name])
                                }
                            }
                        }
                        l(currPlugin.files,fi)
                    }catch(e){
                        let w=new Window()
                        w.setTitle("@error")
                        let b=new Table();
                        b.add("happen a error in saving:").row()
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
                })).size(w/2,32).get()
                b.resizeImage(16)
                b.add("save to local")
            })).size(w,32)

        }
    }))
    
    let statusBar=new Table();

    let label=statusBar.label(prov(()=>fileName)).left();
    let b;
    b=statusBar.button(Core.atlas.drawable("aimclient-add"),Stys.di,run(()=>{
        fileName="untitled";
        currPlugin={
            name:"",
            author:"",
            desc:"",
            version:"",
            mainFilePath:"",
            GUID:"",
            tags:[false,false,false],
            lastAccessTime:0,
            files:{},           //{fileName:File/Object}
        }
    })).size(120,32).get()
    b.resizeImage(16)
    b.add("new")

    b=statusBar.button(Core.atlas.drawable("aimclient-upload"),Stys.di,run(()=>{
        new FileSelector(window,{
            onSelect(file){
                let fi=new Fi(file);
                try{
                    currPlugin=Packer.unpack(fi.readBytes());
                    fileName=fi.name();
                    draw(window.getW())
                }catch(e){
                    let w=new Window()
                    w.setTitle("@error")
                    let b=new Table();
                    b.add("happen a error in loading:").row()
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
            },
            endsName:".acpl"
        })
    })).size(120,32).get()
    b.resizeImage(16)
    b.add("load")

    b=statusBar.button(Core.atlas.drawable("aimclient-save"),Stys.di,run(()=>{
        new FileSelector(window,{
            onSelect(file){
                let fi=new Fi(file);
                try{
                    fi.writeBytes(Packer.pack(currPlugin))
                    fileName=fi.name();
                }catch(e){
                    let w=new Window()
                    w.setTitle("@error")
                    let b=new Table();
                    b.add("happen a error in saving:").row()
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
            },
            endsName:".acpl",
            save:true
        })
    })).size(120,32).get()
    b.resizeImage(16)
    b.add("save")

    let aa=body.add("").get();
    let ab=statusBar.add("").get();
    window.onResize=(w,h)=>{
        label.size(w-120*3-32,32);
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