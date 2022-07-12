let defaultOptions={
    onSelect:(block)=>{},
    onCancel:()=>{},
    filter:(b)=>true,
    // defaultSelect:null,
}
let Manager=require("Manager")
let Stys=require("Styles")


function BlockSelector(window,options){
    if(!window) throw new java.lang.NullPointerException("window is null");
    if(!options) options={};
    let opt=Object.assign({},defaultOptions,options);
    let lastTitle=window.title;
    window.setTitle((lastTitle.startsWith("@")?Core.bundle.get(lastTitle.substring(1)):lastTitle)+" - "+Core.bundle.get("selectBlock"));
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

    let block=opt.defaultUnit||null;

    let e;
    let im;
    
    let draw;
    
    let blocks={};
    let dspN={};
    Vars.content.blocks().each(b=>{
        let modeName=b.minfo.mod?b.minfo.mod.name:"mindustry";
        if(!blocks[modeName]){
            blocks[modeName]=[]
            dspN[modeName]=b.minfo.mod?b.minfo.mod.meta.displayName:"Mindustry";
        }
        blocks[modeName].push(b);
    })
    let pane=body.pane(cons(t=>{
        draw=(wi)=>{
            t.clear()
            for(let mod in blocks){
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
                        for(let b of blocks[m]){
                            if(!opt.filter(b)) continue;
                            let bb=b;
                            let bu=t.button(Core.atlas.drawable("aimclient-fill"),Stys.di,run(()=>{
                                e.get().setText((bb.minfo.mod?(bb.minfo.mod.name+"-"):"")+bb.name);
                                block=bb;
                                im.clear();
                                im.image(bb.uiIcon).size(32,32);
                            })).size(32,32).get();
                            bu.replaceImage(new Image(b.uiIcon));
                            bu.resizeImage(32);
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
        block=Vars.content.getByName(ContentType.block,a)
        im.clear();
        im.image(block.uiIcon).size(32,32);
    }catch(_){}})).size(0,0);
    e.get().setValidator(new TextField.TextFieldValidator(){
        valid(text){
            try{return Vars.content.getByName(ContentType.block,text)!=null;}catch(e){
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
        opt.onSelect(block);
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
module.exports=BlockSelector;