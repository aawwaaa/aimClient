let defaultOptions={
    multiSelect:false,
    onCancel:()=>{},
    onSelect:(maps)=>{}
}

let Manager=require("Manager")
const Stys = require("Styles");


function MapSelector(window,options){
    let icon=Core.atlas.drawable("aimclient-map")
    if(!window) throw new java.lang.NullPointerException("window is null");
    if(!options) options={};
    let opt=Object.assign({},defaultOptions,options);
    let lastTitle=window.title;
    window.setTitle((lastTitle.startsWith("@")?Core.bundle.get(lastTitle.substring(1)):lastTitle)+" - "+Core.bundle.get("selectMap")+(opt.multiSelect?Core.bundle.get("multiSelect"):""));
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

    let inp;
    let inpT;

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

    let paneT;
    let draw;
    let pane=body.pane(cons(t=>{
        paneT=t;
        draw=function(){
            if(selectAllT)selectAllT.setChecked(false);
            cboxes=[];
            ms=[];
            paneT.clear();
            let width=Math.ceil(window.getW()/400);
            let wid=width*400;
            wid+=window.getW()-wid;
            let id=0;
            let ly=0;
            Vars.maps.all().each(m=>{
                let x=id%width;
                let y=Math.floor(id/width);
                x*=wid/width;
                y*=32;
                if(y!=ly){
                    ly=y;
                    paneT.row();
                }
                let map=m;
                let t=paneT.button(icon,Stys.di,run(()=>{
                    if(!opt.multiSelect){
                        inpT.setText(m.name());
                    }
                })).size(wid/width,32)
                ms.push(t);
                t=t.get()
                t.resizeImage(16);
                if(opt.multiSelect){
                    let cbox=new CheckBox("");
                    cbox.setChecked(false); 
                    t.replaceImage(cbox)
                    t.image(icon).size(32,32)
                    cboxes.push({
                        cbox:cbox,
                        map:m
                    })
                }
                t.add(map.name());
                id++;
            })
        }
    })).grow();

    draw()

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
        inpT.setValidator(new TextField.TextFieldValidator(){
            valid(text){
                return Vars.maps.byName(text)!=null
            }
        })
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
            if(Vars.maps.byName(inpT.getText()))opt.onSelect(Vars.maps.byName(inpT.getText()));
        }else{
            let maps=[];
            for(let cbox of cboxes){
                if(selectAllT.isChecked()||cbox.cbox.isChecked()){
                    maps.push(cbox.map);
                }
            }
            opt.onSelect(maps);
        }
        window.flush();
    })).size(96,32).get()
    t.resizeImage(16);
    t.add("@ok").growX();
    let n2=statusBar.add("").size(0,0).get();


    window.setBody(body);
    window.setStatusBar(statusBar);
    window.onResize=(w,h)=>{
        pane.size(w,h);
        draw()
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
module.exports=MapSelector;