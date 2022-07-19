let Stys=require("Styles")
let controllers=[]
let tabl=null,tablc=null
let currentController=null
let currentControllerI=null
let buttons=[]
let total=0
module.exports.init=function(MainWindow,childs,Manager){
    let ru=null;
    let b=MainWindow.bottomButtons.button(Core.atlas.drawable("aimclient-ai"),Stys.togglei,run(()=>{ru()})).size(48,48).left().top().get()
    b.resizeImage(32)
    MainWindow.table.table().size(0).row()
    let l1;
    let tc=MainWindow.table.table(Stys.button,cons(table=>{
        tabl=table
        l1=table.add("").size(0).left().get()
    })).height(0).left().top().marginLeft(0).padLeft(48*0.23)
    MainWindow.table.row()
    tc.get().visibility=boolp(()=>b.isChecked()&&MainWindow.s)
    MainWindow.moveY.push(()=>b.isChecked()&&MainWindow.s?-24:0)
    ru=()=>{
        tc.height(b.isChecked()&&MainWindow.s?48:0)
        l1.setText("-")
        l1.setText("")
        Core.settings.put("ai-show",b.isChecked()?"1":"0")
    }
    tablc=tc
    Timer.schedule(()=>{
        b.setChecked(Core.settings.get("ai-show","1")=="1")
        tc.height(b.isChecked()&&MainWindow.s?48:0)
    },1)
    l1.setText("-")
    l1.setText("")
    let ab=module.exports.addAI(Core.atlas.drawable("aimclient-close"),null)
    ab.resizeImage(16)
    ab.setChecked(true)
    require("ai/MinerAI").init()
    require("ai/BuilderAI").init()
    require("ai/PathfindAI").init()
}

Events.run(Trigger.update,run(()=>{
    if(currentController&&Vars.player.unit()){
        currentController.unit=Vars.player.unit()
        currentController.updateUnit()
        if(currentController.isReady()&&Vars.mobile) Core.camera.position.set(Vars.player)
    }
}))

module.exports.addAI=function(icon,controller){
    controllers.push(controller)
    total++
    let bu=tabl.button(icon,Stys.togglei,run(()=>{
        if(currentController){
            currentControllerI.kill(currentController)
            currentController=null
        }
        buttons.forEach(a=>a.setChecked(false))
        bu.setChecked(true)
        if(controller==null)currentController=null
        if(controller&&Vars.player.unit()){
            currentController=controller.create()
            currentController.unit=Vars.player.unit()
            currentControllerI=controller
        }
    })).left().size(48).get()
    tablc.width(total*48)
    buttons.push(bu)
    return bu
}

module.exports.Controller=function(create,kill){
    this.create=()=>create()
    this.kill=(currentController)=>kill(currentController)
}

require("ai/MinerAI")
require("ai/BuilderAI")
require("ai/PathfindAI")