let Stys=require("Styles")
let flush
module.exports.datas=[]
module.exports.init=function(MainWindow,childs,Manager){
    let ru=null;
    MainWindow.table.table().size(0).row()
    let l1;
    let ty=0
    let tc=MainWindow.table.table(Stys.button,cons(table=>{
        flush=(tile)=>{
            table.clear()
            ty=0
            module.exports.datas.forEach(a=>{
                if(Core.settings.get("frag-disabled-"+a.name,"0")=="1") return
                if(a.valid(tile)){
                    let cell=table.table().width(48*6).left()
                    let res=a.add(cell.get(),tile)
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
    tc.get().visibility=boolp(()=>Core.settings.get("frag-show","1")=="1"&&MainWindow.s)
    MainWindow.moveY.push(()=>{
        tc.height(Core.settings.get("frag-show","1")=="1"&&MainWindow.s?ty:0)
        return Core.settings.get("frag-show","1")=="1"&&MainWindow.s?-Math.ceil(ty/2):0
    })
    tc.get().update(run(()=>{
        tc.height(Core.settings.get("frag-show","1")=="1"&&MainWindow.s?ty:0)
        l1.setText("-")
        l1.setText("")
    }))
    l1.setText("-")
    l1.setText("")
    require("frags/Basic").init()
    require("frags/Special").init()
    let lastTile=null
    Events.run(Trigger.update,run(()=>{
        let worldX=Math.round(Core.input.mouseWorldX()/8)
        let worldY=Math.round(Core.input.mouseWorldY()/8)
        let tile=Vars.world.tile(worldX,worldY)
        if(tile!=lastTile){
            lastTile=tile
            flush(tile)
        }
    }))
}

require("frags/Basic")
require("frags/Special")