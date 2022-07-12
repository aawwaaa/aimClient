const { events } = require("Manager");
const Window = require("Window");
const Manager = require("Manager");
const FileSelector = require("selectors/FileSelector");
const Stys = require("Styles")

let exts = eval("extend")

module.exports=(type,data)=>{

    let file;
    let str="";

    if(type=="path"){
        file=new Fi(data);
        str=file.readString();
    }

    if(type=="str"){
        str=data;
    }

    let window=new Window();
    window.setTitle("@WtextEditor");

    let body=new Table();

    let a=body.area(str,Stys.area,cons(t=>{
        str=t
    }));
    
    let statusBar=new Table();

    let load=statusBar.button(Core.atlas.drawable("aimclient-upload"),Stys.di,run(()=>{
        new FileSelector(window,{
            endsName:".txt",
            onSelect:f=>{
                file=new Fi(f);
                a.get().setText(file.readString());
            }
        })
    })).size(96,32).left().get();
    load.resizeImage(16);
    load.add("@load")

    let save=statusBar.button(Core.atlas.drawable("aimclient-save"),Stys.di,run(()=>{
        if(file) file.writeString(str); else{
            new FileSelector(window,{
                endsName:".txt",
                onSelect:f=>{
                    file=new Fi(f);
                    let fi=new java.io.File(f);
                    if(!fi.exists()) fi.createNewFile();
                    file.writeString(str);
                },
                save:true
            })
        }
    })).size(96,32).left().get();
    save.resizeImage(16);
    save.add("@save")

    let saveAs=statusBar.button(Core.atlas.drawable("aimclient-save"),Stys.di,run(()=>{
        new FileSelector(window,{
            endsName:".txt",
            onSelect:f=>{
                file=new Fi(f);
                let fi=new java.io.File(f);
                if(!fi.exists()) fi.createNewFile();
                file.writeString(str);
            },
            save:true
        })
    })).size(96,32).left().get();
    saveAs.resizeImage(16);
    saveAs.add("@saveAs")

    let label=statusBar.label(prov(()=>(file?file.name():"")+" "+str.split("\n").length+"Lines")).size(96,32)

    let aa=body.add("").get();
    let ab=statusBar.add("").get();
    window.onResize=(w,h)=>{
        a.size(w,h);

        let left=w-32;
        left-=96*3;

        label.size(left,32)
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


Manager.openFileMethods.txt=module.exports;
Manager.openFileMethods.js=module.exports;
Manager.openFileMethods.json=module.exports;
Manager.openFileMethods.prototies=module.exports;