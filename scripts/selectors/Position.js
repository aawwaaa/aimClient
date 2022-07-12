const Manager = require("Manager");
const Stys = require("Styles");

let defaultOptions={
    onSelect:(x,y)=>{},
    onCancel:()=>{},
    unitGrid:false,
}

function PositionT(options){
    if(!options) options={};
    if(Manager.positionSelector) Manager.positionSelector.cancel();
    let opt=Object.assign({},defaultOptions,options);
    let worldX=Math.floor(Core.input.mouseWorldX())/(opt.unitGrid?8:1);
    let worldY=Math.floor(Core.input.mouseWorldY())/(opt.unitGrid?8:1);
    let dspX=Core.input.mouseX();
    let dspY=Core.input.mouseY();
    let table=new Table();
    // table.image().color(Color.orange).size(4,4).align(Align.bottomLeft);
    let text="";
    table.table().size(192,90).row()
    table.image(Core.atlas.drawable("aimclient-cross")).size(32,32).row()
    table.table(cons(t=>{
        t.table().size(192/2,82)
        t.table(Stys.button,cons(t=>{
            t.label(prov(()=>text)).size(192/2,50).row()
            t.button(Core.atlas.drawable("aimclient-close"),Stys.di,run(()=>{
                opt.onCancel();
                table.remove();
                Manager.positionSelector=null;
            })).size(192/4,32).get().resizeImage(16);
            t.button(Core.atlas.drawable("aimclient-ok"),Stys.di,run(()=>{
                opt.onSelect(worldX,worldY);
                table.remove();
                Manager.positionSelector=null;
            })).size(192/4,32).get().resizeImage(16);
        }))
    })).size(192,82);
    let t=Date.now()+200;
    table.update(()=>{
        if(Core.input.isTouched()){
            if(Date.now()>t){
                dspX=Core.input.mouseX();
                dspY=Core.input.mouseY();
                worldX=Math.floor(Core.input.mouseWorldX());
                worldY=Math.floor(Core.input.mouseWorldY());
                if(!opt.unitGrid){
                    worldX/=8
                    worldX=Math.floor(worldX)
                    worldY/=8
                    worldY=Math.floor(worldY)
                }
            }
        }else{
            t=Date.now()+200;
        }
        table.setPosition(dspX,dspY);
        text="["+worldX+","+worldY+"]\n"+(opt.unitGrid?"[UG]":"[WG]");
    })
    this.cancel=()=>{
        table.remove();
        Manager.positionSelector=null;
    }
    this.draw=()=>{
        let wx=worldX
        let wy=worldY
        if(opt.unitGrid){
            wx+=4
            wx/=8
        }else{
            wx+=0.5
        }
        wx=Math.floor(wx)
        if(opt.unitGrid){
            wy+=4
            wy/=8
        }else{
            wy+=0.5
        }
        wy=Math.floor(wy)
        wx*=8
        wy*=8
        // wx+=4
        // wy+=4
        Draw.rect(Core.atlas.find("aimclient-select"),wx,wy,8,8);
        Draw.rect(Core.atlas.find("aimclient-cross"),wx,wy,8,8);
    }
    Manager.positionSelector=this;
    Core.scene.add(table);
}

Events.run(Trigger.draw,()=>{
    if(Manager.positionSelector){
        Manager.positionSelector.draw();
    }
})

module.exports=PositionT;