let Stys=require("Styles")
let flush,flusha
module.exports.datas=[]
module.exports.init=function(MainWindow,childs,Manager){
    let ru=null;
    MainWindow.table.table().size(0).row()
    let l1,l2;
    let ty=0
    let tc=MainWindow.table.table(Stys.button,cons(table=>{
        flush=()=>{
            table.clear()
            ty=0
            module.exports.datas.forEach(a=>{
                if(Core.settings.get("frag-disabled-"+a.name,"0")=="1") return
                if(a.atTable&&a.valid()){
                    let cell=table.table().width(48*6).left()
                    let res=a.add(cell.get())
                    cell.height(res)
                    ty+=res
                    table.row()
                }
            })
            l1=table.add("").size(0).left().get()
        }
        l1=table.add("").size(0).left().get()
    })).width(48*6).height(0).left().top().marginLeft(0).padLeft(48*0.23).touchable(Touchable.disabled)
    MainWindow.table.row()
    let ty1=0
    let ta=new Table()
    let tc1=ta.table(Stys.button,cons(table=>{
        flusha=(tile)=>{
            table.clear()
            ty1=0
            module.exports.datas.forEach(a=>{
                if(Core.settings.get("frag-disabled-"+a.name,"0")=="1") return
                if(!a.atTable&&a.valid(tile)){
                    let cell=table.table().width(48*6).left()
                    let res=a.add(cell.get(),tile)
                    cell.height(res)
                    ty1+=res
                    table.row()
                }
            })
            l2=table.add("").size(0).left().get()
        }
        l2=table.add("").size(0).left().get()
    })).width(48*6).height(0).left().top().marginLeft(0).touchable(Touchable.disabled)
    
    tc.get().visibility=boolp(()=>Core.settings.get("frag-show-table","1")=="1"&&MainWindow.s)
    ta.visibility=boolp(()=>Core.settings.get("frag-show","1")=="1"&&Vars.state.isGame())
    ta.update(run(()=>{
        ta.setPosition(Core.input.mouseX()+96+48*3,Core.input.mouseY()-128-ty1)
        //ta.toFront()
        tc1.height(ty1)
        l2.setText("-")
        l2.setText("")
    }))
    Core.scene.add(ta)
    MainWindow.moveY.push(()=>{
        tc.height(Core.settings.get("frag-show-table","1")=="1"&&MainWindow.s?ty:0)
        return Core.settings.get("frag-show-table","1")=="1"&&MainWindow.s?-Math.ceil(ty/2):0
    })
    tc.get().update(run(()=>{
        tc.height(Core.settings.get("frag-show-table","1")=="1"&&MainWindow.s?ty:0)
        l1.setText("-")
        l1.setText("")
    }))
    l1.setText("-")
    l1.setText("")
    require("frags/Basic").init()
    require("frags/Special").init()
    require("frags/Long").init()
    require("frags/Broad").init()
    let lastTile=null
    Events.run(Trigger.draw,run(()=>{
        let worldX=Math.round(Core.input.mouseWorldX()/8)
        let worldY=Math.round(Core.input.mouseWorldY()/8)
        let tile=Vars.world.tile(worldX,worldY)
        Draw.alpha(0.3)
        Draw.rect(Core.atlas.find("aimclient-cross"),worldX*8,worldY*8)
        Draw.reset()
    }))
    Events.run(Trigger.update,run(()=>{
        let worldX=Math.round(Core.input.mouseWorldX()/8)
        let worldY=Math.round(Core.input.mouseWorldY()/8)
        let tile=Vars.world.tile(worldX,worldY)
        if(tile!=lastTile){
            lastTile=tile
            flusha(tile)
        }
        flush()
    }))
}

require("frags/Basic")
require("frags/Special")
require("frags/Long")
require("frags/Broad")
