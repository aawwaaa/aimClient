"use strict"

let icons=require("selectors/FileIcons");
let Window=require("Window");
let Manager=require("Manager")
let Stys=require("Styles");

module.exports=()=>{

    let rmDir=(f)=>{
        for(let fi of f.listFiles()){
            if(fi.isDirectory()){
                rmDir(fi);
            }else{
                fi.delete();
            }
        }
        f.delete();
    }

    icons.init();
    let window=new Window();
    window.setTitle("@Wfiles");

    let cboxes=[];
    let ms=[];

    let dir=Core.settings.get("lastDirectoryF",Core.settings.get("lastDirectory","./"));
    let historyL=[];
    let historyR=[];

    let body=new Table();
    let statusBar=new Table();
    let selectAll;
    let selectAllT;
    selectAll=statusBar.check("",new Boolc(){get(b){
        for(let c of cboxes) c.cbox.setChecked(b);
    }}).size(32,32);
    selectAllT=selectAll.get();
    selectAllT.setStyle(Stys.check);
    let top;
    let topC=body.table(cons(x=>{top=x})).size(0,0);
    let right;
    let left=top.button(Core.atlas.drawable("aimclient-back"),Stys.di,run(()=>{
        let d=historyL.pop();
        if(d){
            historyR.push(dir);
            this.changeDirectory(d,true);
            right.setDisabled(false);
        }
    })).size(32,32).get()
    left.resizeImage(16);
    right=top.button(Core.atlas.drawable("aimclient-next"),Stys.di,run(()=>{
        let d=historyR.pop();
        if(d){
            historyL.push(dir)
            this.changeDirectory(d,true);
        }
    })).size(32,32).get()
    right.resizeImage(16);
    let up=top.button(Core.atlas.drawable("aimclient-up"),Stys.di,run(()=>{
        dir=dir.split("/").slice(0,-1).join("/");
        if(dir==="")dir="/";
        this.changeDirectory(dir);
    })).size(32,32).get();
    up.resizeImage(16);
    let path=top.field(dir,cons((d)=>{})).size(1,32)
    let pathT=path.get();
    let editing=false;
    let edit=top.button(Core.atlas.drawable("aimclient-edit"),Stys.di,run(()=>{
        editing=!editing;
        if(!editing){
            if(new java.io.File(pathT.getText()).isDirectory()){
                dir=pathT.getText();
                this.changeDirectory(dir);
            }else{
                editing=true;
            }
        }
    })).size(32,32).get();
    edit.resizeImage(16);
    let reload=top.button(Core.atlas.drawable("aimclient-reload"),Stys.di,run(()=>{
        this.changeDirectory(dir);
    })).size(32,32).get();
    reload.resizeImage(16);
    body.row();

    body.update(()=>{
        left.setDisabled(historyL.length===0);
        right.setDisabled(historyR.length===0);
        up.setDisabled(dir==="/");
        pathT.setDisabled(!editing);
    })

    let paneT;
    let pane=body.pane(cons(t=>{
        paneT=t;
    })).grow();

    this.changeDirectory=function(directory,nc){
        if(!editing)pathT.setText(directory);
        if(selectAllT)selectAllT.setChecked(false);
        if(!nc)historyR=[];
        if(historyL[historyL.length-1]!=dir&&!nc)historyL.push(directory);
        cboxes=[];
        ms=[];
        dir=directory;
        Core.settings.put("lastDirectoryF",dir);
        paneT.clear();
        let width=Math.ceil(window.getW()/400);
        let wid=width*400;
        wid+=window.getW()-wid;
        let id=0;
        let ly=0;
        for(let f of new java.io.File(dir).list()){
            let x=id%width;
            let y=Math.floor(id/width);
            x*=wid/width;
            y*=32;
            if(y!=ly){
                ly=y;
                paneT.row();
            }
            // print(x+" "+y+" "+wid+" "+width)
            let fileN=f;
            let file=fileN;
            let fullPath=dir+(dir.endsWith("/")?"":"/")+file;
            let t=paneT.table(Styles.black6,cons(t=>{
                let cbox=t.check("",new Boolc(()=>{})).size(32,32).get();
                cbox.setStyle(Stys.check);
                let b=t.button(new Fi(fullPath).isDirectory()?icons.dir:icons.get(file.substring(file.lastIndexOf("."))),Stys.di,run(()=>{
                    if(!new Fi(fullPath).isDirectory()){
                        Manager.openFile(fullPath);
                    }else{
                        this.changeDirectory(fullPath);
                    }
                })).size(wid/width-32,32);
                b.get().resizeImage(16);
                let f=b.get().add(file).size(wid/width-32-32,32);
                cboxes.push({
                    cbox:cbox,
                    file:fullPath,
                    button:b,
                    f:new java.io.File(fullPath),
                    fi:new Fi(new java.io.File(fullPath))
                })
            })).size(wid/width,32)
            // t.get().touchable=Touchable.enabled;
            ms.push(t);
            id++;
        }
    }
    this.changeDirectory(dir);
    historyL.pop()

    let n1=body.add("").size(0,0).get();

    let newFileBar=new Table();

    let but=newFileBar.button(Core.atlas.drawable("aimclient-close"),Stys.di,run(()=>{
        window.setStatusBar(statusBar)
    })).size(128,32).get();
    but.resizeImage(16);
    but.add("@cancel")

    let field=newFileBar.field("",Stys.textField,cons((d)=>{})).size(128,32);
    let fieldT=field.get();

    let but1=newFileBar.button(Core.atlas.drawable("aimclient-file"),Stys.di,run(()=>{
        let f=fieldT.getText();
        if(f.length>0){
            let f1=new java.io.File(dir+(dir.endsWith("/")?"":"/")+f);
            f1.createNewFile();
            this.changeDirectory(dir);
        }
    })).size(128,32).get();
    but1.resizeImage(16);
    but1.add("@file")

    let but2=newFileBar.button(Core.atlas.drawable("aimclient-files"),Stys.di,run(()=>{
        let f=fieldT.getText();
        if(f.length>0){
            let f1=new java.io.File(dir+(dir.endsWith("/")?"":"/")+f);
            f1.mkdir();
            this.changeDirectory(dir);
        }
    })).size(128,32).get();
    but2.resizeImage(16);
    but2.add("@directory")

    let n3=newFileBar.add("").size(0,0).get();

    let bu=statusBar.button(Core.atlas.drawable("aimclient-add"),Stys.di,run(()=>{
        window.setStatusBar(newFileBar);
    })).size(128,32).get();
    bu.resizeImage(16);
    bu.add("@newFile")

    let e=statusBar.table();

    let parse=statusBar.button(Core.atlas.drawable("aimclient-parse"),Stys.di,run(()=>{
        if(Manager.fileClipbroadType=="") return;
        for(let i in Manager.fileClipbroad){
            let f=Manager.fileClipbroad[i];

            let f1=new java.io.File(dir+(dir.endsWith("/")?"":"/")+f.getName());
            // f1.createNewFile();
            java.nio.file.Files.copy(f.toPath(),f1.toPath(),java.nio.file.StandardCopyOption.REPLACE_EXISTING);

            if(Manager.fileClipbroadType=="cut"){
                f.delete();
                Manager.fileClipbroad[i]=f1;
            }

        }
        this.changeDirectory(dir);
    })).size(32,32).get();
    parse.resizeImage(16);

    let getSelectedFiles=function(){
        let files=[];
        for(let i in cboxes){
            if(cboxes[i].cbox.isChecked()){
                files.push(cboxes[i].file);
            }
        }
        return files;
    }

    let getSelectedFilesF=function(){
        let files=[];
        for(let i in cboxes){
            if(cboxes[i].cbox.isChecked()){
                files.push(cboxes[i].f);
            }
        }
        return files;
    }

    let getSelectedFilesFi=function(){
        let files=[];
        for(let i in cboxes){
            if(cboxes[i].cbox.isChecked()){
                files.push(cboxes[i].fi);
            }
        }
        return files;
    }

    let copy=statusBar.button(Core.atlas.drawable("aimclient-copy"),Stys.di,run(()=>{
        Manager.fileClipbroadType="copy";
        Manager.fileClipbroad=getSelectedFilesF();
    })).size(32,32).get();
    copy.resizeImage(16);

    let cut=statusBar.button(Core.atlas.drawable("aimclient-cut"),Stys.di,run(()=>{
        Manager.fileClipbroadType="cut";
        Manager.fileClipbroad=getSelectedFilesF();
    })).size(32,32).get();
    cut.resizeImage(16);

    let renameBar=new Table();

    let but3=renameBar.button(Core.atlas.drawable("aimclient-close"),Stys.di,run(()=>{
        window.setStatusBar(statusBar)
    })).size(128,32).get();
    but3.resizeImage(16);
    but3.add("@cancel")

    let field1=renameBar.field("",Stys.textField,cons((d)=>{})).size(128,32);

    let but4=renameBar.button(Core.atlas.drawable("aimclient-ok"),Stys.di,run(()=>{
        let f=getSelectedFiles();
        if(f.length==1){
            let f1=new java.io.File(f[0]);
            let f2=new java.io.File(f[0].substring(0,f[0].lastIndexOf("/"))+"/"+field1.get().getText());
            f1.renameTo(f2);
            this.changeDirectory(dir);
        }
        window.setStatusBar(statusBar);
    })).size(128,32).get();
    but4.resizeImage(16);
    but4.add("@rename")

    let rename=statusBar.button(Core.atlas.drawable("aimclient-rename"),Stys.di,run(()=>{
        let f=getSelectedFiles();
        if(f.length==1){
            window.setStatusBar(renameBar)
        }
    })).size(32,32).get();
    rename.resizeImage(16);

    let deleteF=statusBar.button(Core.atlas.drawable("aimclient-trash"),Stys.di,run(()=>{
        getSelectedFilesF().forEach(f=>{
            if(!f.isDirectory())f.delete();else rmDir(f);
        });
        this.changeDirectory(dir);
    })).size(32,32).get();
    deleteF.resizeImage(16);

    let n2=statusBar.add("").size(0,0).get();


    window.setBody(body);
    window.setStatusBar(statusBar);
    window.onResize=(w,h)=>{
        path.size(w-32*5,32)
        topC.size(w,32)
        pane.size(w,h-32);
        this.changeDirectory(dir)
        // let width=Math.ceil(w/400);
        // let wid=width*400;
        // wid+=w-wid;
        // let id=0;
        // let ly=0;
        // paneT.clear()
        // for(let i in ms){
        //     let t=ms[i].get();
        //     if(!t) continue;
        //     let x=id%width;
        //     let y=Math.floor(id/width);
        //     x*=wid/width;
        //     y*=32;
        //     if(y!=ly){
        //         ly=y;
        //         paneT.row();
        //     }
        //     t=paneT.add(t).size(wid/width,32);
        //     ms[i]=t;
        //     id++;
        // }
        // statusBar.size(w-32,32);
        let left=w-32;
        left-=32
        left-=128
        left-=32*5;
        e.size(left,32);

        // newFileBar.size(w,32);
        field.size(w-128*3-32,32);

        field1.size(w-128*2-32,32);

        n1.setText("-");
        n2.setText("-");
        n3.setText("-");
        n1.setText("");
        n2.setText("");
        n3.setText("");
    }
    window.setSize(500,400);
    window.center();
    window.show();

    historyL.pop()

}