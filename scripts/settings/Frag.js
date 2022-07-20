const Window = require("Window");
const Manager = require("Manager");
const Selectors = require("selectors/Selectors")
const Stys = require("Styles")

function MapMeta(){
    this.id=0;
    this.name="";
    this.mapName="";
    this.author="";
    this.desc="";
    this.tags=[];
}

module.exports=(type,data)=>{

    let window=new Window();
    window.setTitle("@frag-settings");

    let body=new Table();
    let top=body.check("@frag-enabled",new Boolc(){
        get(e){
            Core.settings.put("frag-show",e?"1":"0")
        }
    })
    top.get().setChecked(Core.settings.get("frag-show","1")=="1")
    top.get().setStyle(Stys.check)
    body.row()
    let draw
    let pane=body.pane(cons(t=>{
        draw=(w)=>{
            t.clear()
            let width=Math.floor(w/300);
            if(width==0) width=1
            let wid=width*300;
            let ww=wid/width;
            let id=0;
            let ly=0
            for(let data of require("frags/Main").datas){
                let y=Math.floor(id/width);
                if(y!=ly){
                    ly=y;
                    t.row();
                }
                let n=data.name
                let a=t.check("",new Boolc(){
                    get(e){
                        Core.settings.put("frag-disabled-"+n,e?"0":"1")
                    }
                }).size(ww,32).get()
                a.setChecked(Core.settings.get("frag-disabled-"+n,"0")==0)
                a.image(data.icon).size(16)
                a.add(data.name).growX()
                a.setStyle(Stys.check)
                id++
            }
        }
    }))
    
    let statusBar=new Table();

    let aa=body.add("").get();
    let ab=statusBar.add("").get();
    window.onResize=(w,h)=>{
        draw(w)
        top.size(w,32)
        pane.size(w,h-32)
        aa.setText("-")
        ab.setText("-")
        aa.setText("")
        ab.setText("")
    }

    window.setBody(body);
    window.setStatusBar(statusBar);
    window.setSize(600,400)
    window.center();
    window.show();
}
