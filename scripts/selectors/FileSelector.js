let defaultOptions={
    // directory:"./",
    selectDirectory:false,
    // fileFilter:(fileName)=>boolean,
    multiSelect:false,
    endsName:"",
    forceUseEndsName:false,
    onCancel:()=>{},
    onSelect:(files)=>{},
    save:false
}

let icons=require("selectors/FileIcons");
let Stys=require("Styles");
let Manager=require("Manager")


function FileSelector(window,options){
    icons.init()
    if(!window) throw new java.lang.NullPointerException("window is null");
    if(!options) options={};
    let opt=Object.assign({},defaultOptions,options);
    let lastTitle=window.title;
    window.setTitle((lastTitle.startsWith("@")?Core.bundle.get(lastTitle.substring(1)):lastTitle)+" - "+Core.bundle.get(opt.selectDirectory?"selectDirectory":"selectFile")+(opt.multiSelect?Core.bundle.get("multiSelect"):"")+(opt.save?" "+Core.bundle.get("save"):""));
    let lastBody=window.body;
    let lastStatusBar=window.statusBar;
    let lastOnResize=window.onResize;
    let lastOnHide=window.onHide;
    let lastOnClose=window.onClose;
    let lastOnShow=window.onShow;
    let lastOnFullScreen=window.onFullScreen;

    window.onResize=()=>{};
    window.onHide=()=>{};
    window.onClose=()=>{};
    window.onShow=()=>{};
    window.onFullScreen=()=>{};

    let cboxes=[];
    let ms=[];

    let dir=opt.directory||Core.settings.get("lastDirectory","./")
    let historyL=[];
    let historyR=[];

    let inp;
    let inpT;
    let endsName;
    let endsNameT;

    let body=new Table();
    let statusBar=new Table();
    let selectAll;
    let selectAllT;
    if(opt.multiSelect){
        selectAll=statusBar.check("",new Boolc(){get(b){
            for(let c of cboxes) c.cbox.setChecked(b);
        }}).size(32,32);
        selectAllT=selectAll.get();
        selectAllT.setStyle(Stys.check);
    }
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
    let path=top.field(dir,Stys.textField,cons((d)=>{})).size(1,32)
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
        Core.settings.put("lastDirectory",dir);
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
            if(opt.selectDirectory&&(!new Fi(fullPath).isDirectory()))continue;
            if(opt.forceUseEndsName&&!file.endsWith(opt.endsName))continue;
            if(opt.fileFilter&&!opt.fileFilter(file))continue;
            let t=paneT.button(new Fi(fullPath).isDirectory()?icons.dir:icons.get(file.substring(file.lastIndexOf("."))),Stys.di,run(()=>{
                if(new Fi(fullPath).isDirectory()&&(!opt.selectDirectory)){
                    this.changeDirectory(fullPath);
                }else{
                    inpT.setText(fileN);
                }
                if(!new Fi(fullPath).isDirectory()&&!opt.multiSelect){
                    let a=fileN.substring(0,fileN.lastIndexOf("."))
                    let b=fileN.substring(fileN.lastIndexOf("."))
                    if(a==""){a=b;b=""}
                    inpT.setText(a);
                    endsNameT.setText(b);
                }
            })).size(wid/width,32)
            ms.push(t);
            t=t.get()
            t.resizeImage(16);
            if(
                opt.multiSelect&&(((!opt.selectDirectory)&&(!new Fi(fullPath).isDirectory()))||
                ((opt.selectDirectory)&&(new Fi(fullPath).isDirectory())))
            ){
                let cbox=new CheckBox("");
                cbox.setChecked(false); 
                cbox.setStyle(Stys.checkBox);
                t.replaceImage(cbox)
                t.image(icons.get(file.substring(file.lastIndexOf(".")))).size(32,32)
                cboxes.push({
                    cbox:cbox,
                    file:fullPath,
                })
            }
            if(opt.selectDirectory){
                t.button(Core.atlas.drawable("aimclient-next"),Stys.di,run(()=>{
                    this.changeDirectory(fullPath);
                })).size(32,32).get().resizeImage(16);
            }

            t.add(file).size(wid/width-32-(opt.selectDirectory?32:0),32);
            id++;
        }
    }
    this.changeDirectory(dir);

    let n1=body.add("").size(0,0).get();

    let t=statusBar.button(Core.atlas.drawable("aimclient-close"),Stys.di,run(()=>{
        window.setTitle(lastTitle);
        window.setBody(lastBody);
        window.setStatusBar(lastStatusBar);
        window.onResize=lastOnResize;
        window.onHide=lastOnHide;
        window.onClose=lastOnClose;
        window.onShow=lastOnShow;
        window.onFullScreen=lastOnFullScreen;
        opt.onCancel();
        window.flush();
    })).size(96,32).get()
    t.resizeImage(16);
    t.add("@cancel").growX();
    let e=statusBar.table();
    if(!opt.multiSelect){
        inp=statusBar.field("",Stys.textField,cons(t=>{}))
        inpT=inp.get();
    }
    if(!opt.selectDirectory){
        endsName=statusBar.field(opt.endsName,Stys.textField,cons(t=>{}))
        endsNameT=endsName.get();
        endsNameT.setDisabled(opt.forceUseEndsName);
    }
    t=statusBar.button(Core.atlas.drawable("aimclient-ok"),Stys.di,run(()=>{
        window.setTitle(lastTitle);
        window.setBody(lastBody);
        window.setStatusBar(lastStatusBar);
        window.onResize=lastOnResize;
        window.onHide=lastOnHide;
        window.onClose=lastOnClose;
        window.onShow=lastOnShow;
        window.onFullScreen=lastOnFullScreen;
        if(!opt.multiSelect){
            if(!opt.selectDirectory){
                if(new java.io.File(dir+(dir.endsWith("/")?"":"/")+inpT.getText()+endsNameT.text).exists()||opt.save)opt.onSelect(dir+(dir.endsWith("/")?"":"/")+inpT.getText()+endsNameT.text);
            }else{
                if(new java.io.File(dir+(dir.endsWith("/")?"":"/")+inpT.getText()).isDirectory()||opt.save)opt.onSelect(dir+(dir.endsWith("/")?"":"/")+inpT.getText());
            }
        }else{
            let files=[];
            for(let cbox of cboxes){
                if(selectAllT.isChecked()||cbox.cbox.isChecked()){
                    files.push(cbox.file);
                }
            }
            opt.onSelect(files);
        }
        window.flush();
    })).size(96,32).get()
    t.resizeImage(16);
    t.add("@ok").growX();
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
        let left=w-96*2-32
        if(opt.multiSelect) left-=32
        if(!opt.selectDirectory){
            endsName.size(128,32);
            left-=128;
        }
        if(!opt.multiSelect){
            inp.size(left,32);
            left-=left;
        }
        e.size(left,32);
        n1.setText("-");
        n2.setText("-");
        n1.setText("");
        n2.setText("");
    }
    window.flush()

}
module.exports=FileSelector;