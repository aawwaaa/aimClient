const Window = require("Window");
const Manager = require("Manager");
const Stys = require("Styles");

module.exports=(type,data)=>{

    let window=new Window();
    window.setTitle("@style");

    let body=new Table();

    let draw;

    let pane=body.pane(cons(t=>{
        draw=(w)=>{
            t.clear()
            for(let name in Manager.styles.styles){
                let style=Manager.styles.styles[name];
                let n=name;
                t.table(cons(t=>{
                    t.table(style.button,cons(t=>{
                        t.image().color(style.themeColor).size(32,32)
                        t.add(name+"").size(w-232,32)
                    })).size(w-200,32)
                    t.button("@apply",style.defaultt,run(()=>{
                        Manager.styles.changeStyle(n);
                        let w=new Window()
                        w.setTitle("@info")
                        let b=new Table();
                        b.add("@maybeRestart").row()
                        b.button("@ok",Stys.dt,run(()=>{
                            w.close()
                        })).size(256,32).get()
                        w.setBody(b)
                        w.setSize(256,80)
                        w.setResizable(false)
                        w.center()
                        w.show()
                    })).size(200,32)
                })).size(w,32).row()
                let slider,sliderV=0;
                t.table(cons(t=>{
                    let left=w;
                    t.button("Text",style.defaultt,run(()=>{})).size(80,48)
                    t.button(Core.atlas.drawable("aimclient-info"),style.defaulti,run(()=>{})).size(48,48).get().resizeImage(16)
                    t.button("TText",style.togglet,run(()=>{})).size(80,48)
                    t.button(Core.atlas.drawable("aimclient-settings"),style.togglei,run(()=>{})).size(48,48).get().resizeImage(16)
                    t.check("Check",new Boolc(()=>{})).size(100,48).get().setStyle(style.check)
                    left-=48*2+80*2+100;
                    left/=2
                    t.field("TextField",style.textField,cons(t=>{})).size(left,48)
                    slider=t.slider(0,1,0.0001,0.5,new Floatc(){
                        get(v){
                            sliderV=v;
                        }
                    }).size(left,48).get()
                    slider.setStyle(style.slider)
                })).size(w,48).row()
                t.table(cons(t=>{
                    t.area("TextArea",style.area,cons(t=>{})).size(w,64)
                })).size(w,64).row()
                t.table(cons(t=>{
                    let s=style
                    let bar=new style.bar(prov(()=>"Bar"),prov(()=>s.themeColor),floatp(()=>sliderV));
                    t.add(bar).size(w,32)
                })).size(w,32).row()
            }
        }
    }))
    
    let statusBar=new Table();

    let aa=body.add("").get();
    let ab=statusBar.add("").get();
    window.onResize=(w,h)=>{
        pane.size(w,h)
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