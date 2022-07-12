const Window = require("Window");
const Manager = require("Manager");
const FileSelector = require("selectors/FileSelector");
const Stys = require("Styles");
const Packer = require("plugin/Packer");
const JArray = require("jio/JArray");

module.exports=(type,data)=>{

    let window=new Window();
    window.setTitle("infoEdit");

    let currPlugin={
        name:"",
        author:"",
        desc:"",
        version:"",
        mainFilePath:"",
        bundleDir:"",
        GUID:"",
        tags:[false,false,false],
        lastAccessTime:0,
        files:{},           //{fileName:File/Object}
    }
    let fileName="untitled";

    let body=new Table();
    let draw;
    let pane=body.pane(cons(t=>{
        /**
         * name(0/256)-----
         * [textField     ]
         * author(0/128)---
         * [textField     ]
         * desc(0/576)-----
         * |--------------|
         * |textArea      |
         * |--------------|
         * version(0/16)---
         * [textField     ]
         * tags------------
         * [X]CONT [X]STYLE
         * GUID(0/64)
         * [textField     ]
         * mainPath(0/64)--
         * [textField     ]
         */
        draw=(w)=>{
            t.clear()
            t.label(prov(()=>"name")).row()
            t.field(currPlugin.name,Stys.textField,cons(a=>currPlugin.name=a)).size(w,32).row()
            t.label(prov(()=>"author")).row()
            t.field(currPlugin.author,Stys.textField,cons(a=>currPlugin.author=a)).size(w,32).row()
            t.label(prov(()=>"version")).row()
            t.field(currPlugin.version,Stys.textField,cons(a=>currPlugin.version=a)).size(w,32).row()
            
            t.label(prov(()=>"desc")).row()
            t.area(currPlugin.desc,Stys.area,cons(a=>currPlugin.desc=a)).size(w,192).row()

            
            t.label(prov(()=>"tags")).row()
            t.table(cons(t=>{
                let c=t.check("cont",new Boolc(){get:a=>currPlugin.tags[0]=a}).size(w/2,32).get()
                c.setStyle(Stys.check)
                c.setChecked((currPlugin.tags[0]&true)==1)
                c=t.check("style",new Boolc(){get:a=>currPlugin.tags[1]=a}).size(w/2,32).get()
                c.setStyle(Stys.check)
                c.setChecked((currPlugin.tags[1]&true)==1)
            })).size(w,32).row()
            let c=t.check("hot reload",new Boolc(){get:a=>currPlugin.tags[2]=a}).size(w,32).get()
            c.setStyle(Stys.check)
            c.setChecked((currPlugin.tags[2]&true)==1)
            t.row()

            t.label(prov(()=>"GUID")).row()
            t.field(currPlugin.GUID,Stys.textField,cons(a=>currPlugin.GUID=a)).size(w,32).row()
            t.label(prov(()=>"mainFilePath")).row()
            t.field(currPlugin.mainFilePath,Stys.textField,cons(a=>currPlugin.mainFilePath=a)).size(w,32).row()
            t.label(prov(()=>"bundleDir")).row()
            t.field(currPlugin.bundleDir,Stys.textField,cons(a=>currPlugin.bundleDir=a)).size(w,32).row()
            
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
            bundleDir:"",
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