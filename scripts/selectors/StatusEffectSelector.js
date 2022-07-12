let defaultOptions={
    onSelect:(statusEffect)=>{},
    onCancel:()=>{},
    filter:(i)=>true,
    // defaultSelect:null,
}
let Manager=require("Manager")
const Stys = require("Styles");


function statusEffectSelector(window,options){
    if(!window) throw new java.lang.NullPointerException("window is null");
    if(!options) options={};
    let opt=Object.assign({},defaultOptions,options);
    let lastTitle=window.title;
    window.setTitle((lastTitle.startsWith("@")?Core.bundle.get(lastTitle.substring(1)):lastTitle)+" - "+Core.bundle.get("selectStatusEffect"));
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

    let statusEffect=opt.defaultUnit||null;

    let e;
    let im;
    
    let draw;
    
    let statusEffects={};
    let dspN={};
    Vars.content.statusEffects().each(i=>{
        let modeName=i.minfo.mod?i.minfo.mod.name:"mindustry";
        if(!statusEffects[modeName]){
            statusEffects[modeName]=[]
            dspN[modeName]=i.minfo.mod?i.minfo.mod.meta.displayName:"Mindustry";
        }
        statusEffects[modeName].push(i);
    })
    let pane=body.pane(cons(t=>{
        draw=(wi)=>{
            t.clear()
            for(let mod in statusEffects){
                let m=mod;
                t.table(cons(t=>{
                    t.table(cons(t=>{
                        t.add(dspN[m]).size(256,32).left();
                        t.image().color(Color.valueOf("ffaa22")).size(wi-256,4).right();
                    })).row()
                    let w=Math.floor(wi/32);
                    let id=0;
                    let added=0;
                    t.table(cons(t=>{
                        for(let i of statusEffects[m]){
                            if(!opt.filter(i)) continue;
                            let ii=i;
                            let b=t.button(Core.atlas.drawable("aimclient-fill"),Stys.di,run(()=>{
                                e.get().setText((ii.minfo.mod?(ii.minfo.mod.name+"-"):"")+ii.name);
                                statusEffect=ii;
                                im.clear();
                                im.image(ii.uiIcon).size(32,32);
                            })).size(32,32).get();
                            b.replaceImage(new Image(i.uiIcon));
                            b.resizeImage(32);
                            id++;
                            added++;
                            if(id>=w){
                                id=0;
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
        statusEffect=Vars.content.getByName(ContentType.status,a)
        im.clear();
        im.image(statusEffect.uiIcon).size(32,32);
    }catch(_){}})).size(0,0);
    e.get().setValidator(new TextField.TextFieldValidator(){
        valid(text){
            try{return Vars.content.getByName(ContentType.status,text)!=null;}catch(e){
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
        opt.onSelect(statusEffect);
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
module.exports=statusEffectSelector;