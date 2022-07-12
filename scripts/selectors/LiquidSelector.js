let defaultOptions={
    onSelect:(liquid)=>{},
    onCancel:()=>{},
    filter:(l)=>true,
    // defaultSelect:null,
}
let Manager=require("Manager")
const Stys = require("Styles");


function LiquidSelector(window,options){
    if(!window) throw new java.lang.NullPointerException("window is null");
    if(!options) options={};
    let opt=Object.assign({},defaultOptions,options);
    let lastTitle=window.title;
    window.setTitle((lastTitle.startsWith("@")?Core.bundle.get(lastTitle.substring(1)):lastTitle)+" - "+Core.bundle.get("selectItem"));
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

    let body=new Table();
    let statusBar=new Table();

    let liquid=opt.defaultUnit||null;

    let e;
    let im;
    
    let draw;
    
    let liquids={};
    let dspN={};
    Vars.content.liquids().each(l=>{
        let modeName=l.minfo.mod?l.minfo.mod.name:"mindustry";
        if(!liquids[modeName]){
            liquids[modeName]=[]
            dspN[modeName]=l.minfo.mod?l.minfo.mod.meta.displayName:"Mindustry";
        }
        liquids[modeName].push(l);
    })
    let pane=body.pane(cons(t=>{
        draw=(wi)=>{
            t.clear()
            for(let mod in liquids){
                let m=mod;
                t.table(cons(t=>{
                    t.table(cons(t=>{
                        t.add(dspN[m]).size(256,32).left();
                        t.image().color(Color.valueOf("ffaa22")).size(wi-256,4).right();
                    })).row()
                    let w=Math.floor(wi/32);
                    let i=0;
                    let added=0;
                    t.table(cons(t=>{
                        for(let l of liquids[m]){
                            if(!opt.filter(l)) continue;
                            let ll=l;
                            let b=t.button(Core.atlas.drawable("aimclient-fill"),Stys.di,run(()=>{
                                e.get().setText((ll.minfo.mod?(ll.minfo.mod.name+"-"):"")+ll.name);
                                liquid=ll;
                                im.clear();
                                im.image(ll.uiIcon).size(32,32);
                            })).size(32,32).get();
                            b.replaceImage(new Image(l.uiIcon));
                            b.resizeImage(32);
                            i++;
                            added++;
                            if(i>=w){
                                i=0;
                                t.row();
                            }
                        }
                    })).size(wi,Math.ceil(added/w)*32);
                }))
            }
        }
        draw(window.getW()-32)
    }))

    let n1=body.add("").get();

    let t=statusBar.button(Core.atlas.drawable("aimclient-close"),Stys.di,run(()=>{
        window.setTitle(lastTitle);
        window.setBody(lastBody);
        window.setStatusBar(lastStatusBar);
        window.onResize=lastOnResize;
        window.onHide=lastOnHide;
        window.onClose=lastOnClose;
        window.onShow=lastOnShow;
        window.onFullScreen=lastOnFullScreen;
        opt.onCancel()
        window.flush();
    })).size(96,32).get();
    t.resizeImage(16)
    t.add("@cancel").growX();

    im=statusBar.table().size(32,32).get();

    e=statusBar.field("",Stys.textField,cons(a=>{try{
        liquid=Vars.content.getByName(ContentType.liquid,a)
        im.clear();
        im.image(liquid.uiIcon).size(32,32);
    }catch(_){}})).size(0,0);
    e.get().setValidator(new TextField.TextFieldValidator(){
        valid(text){
            try{return Vars.content.getByName(ContentType.liquid,text)!=null;}catch(e){
                return false;
            }
        }
    });

    t=statusBar.button(Core.atlas.drawable("aimclient-ok"),Stys.di,run(()=>{
        window.setTitle(lastTitle);
        window.setBody(lastBody);
        window.setStatusBar(lastStatusBar);
        window.onResize=lastOnResize;
        window.onHide=lastOnHide;
        window.onClose=lastOnClose;
        window.onShow=lastOnShow;
        window.onFullScreen=lastOnFullScreen;
        opt.onSelect(liquid);
        window.flush();
    })).size(96,32).get()
    t.resizeImage(16);
    t.add("@ok").growX();
    let n2=statusBar.add("").size(0,0).get();


    window.setBody(body);
    window.setStatusBar(statusBar);
    window.onResize=(w,h)=>{
        pane.size(w,h);
        w-=32
        draw(w);

        let left=w-96*2-32;
        e.size(left,32);


        n1.setText("-");
        n2.setText("-");
        n1.setText("");
        n2.setText("");
    }
    window.flush()

}
module.exports=LiquidSelector;