let Stys=require("Styles")
let controllers=[]
let tabl=null,tablc=null
module.exports.followUnit=Core.settings.get("ai-followUnit","1")==1
module.exports.currentController=null
module.exports.currentControllerI=null
let buttons=[]
let total=Vars.mobile?1:0
module.exports.init=function(MainWindow,childs,Manager){
    let ru=null;
    let b=MainWindow.bottomButtons.button(Core.atlas.drawable("aimclient-ai"),Stys.togglei,run(()=>{ru()})).size(42).left().top().get()
    b.resizeImage(32)
    MainWindow.table.table().size(0).row()
    let l1;
    let tc=MainWindow.table.table(Stys.button,cons(tz=>{
    tz.table(cons(table=>{
        tabl=table
        l1=table.add("").size(0).left().get()
    })).left().top()
    if(Vars.mobile){
        let b=tz.button(Core.atlas.drawable("aimclient-ai-followUnit"),Stys.is,run(()=>{
            module.exports.followUnit=!module.exports.followUnit
            Core.settings.put("ai-followUnit",module.exports.followUnit?"1":"0")
            if(module.exports.followUnit){
                if(Vars.player.unit())Core.camera.position.set(Vars.player.unit())
            }
        })).left().size(48).get()
        b.setChecked(module.exports.followUnit)
        b.resizeImage(32)
    }
    })).height(0).left().top().marginLeft(0).padLeft(48*0.23)
    MainWindow.table.row()
    tc.get().visibility=boolp(()=>b.isChecked()&&MainWindow.s)
    MainWindow.moveY.push(()=>{
        tc.height(b.isChecked()&&MainWindow.s?48:0)
        return b.isChecked()&&MainWindow.s?-24:0
    })
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
    require("ai/JoyStick").init()
}

/*
Events.run(Trigger.update,run(()=>{
    if(module.exports.currentController&&Vars.player.unit()){
        module.exports.currentController.unit=Vars.player.unit()
        module.exports.currentController.updateUnit()
        if(module.exports.currentController.isReady()&&Vars.mobile) Core.camera.position.set(Vars.player)
    }
}))
*/
Events.on(ClientLoadEvent,()=>{
let newInput=Vars.mobile?
    extend(MobileInput,{
        updateMovement(unit){
            if(module.exports.currentController){
                module.exports.currentController.unit=unit
                module.exports.currentController.updateUnit()
                if(module.exports.followUnit&&Vars.mobile) Core.camera.position.set(Vars.player)
            }else if(module.exports.followUnit) this.super$updateMovement(unit)
        }
    }):
    extend(DesktopInput,{})
Vars.control.input=newInput
})

module.exports.addAI=function(icon,controller){
    controllers.push(controller)
    total++
    let bu=tabl.button(icon,Stys.is,run(()=>{
        if(module.exports.currentController){
            module.exports.currentControllerI.kill(module.exports.currentController)
            module.exports.currentController=null
        }
        buttons.forEach(a=>a.setChecked(false))
        bu.setChecked(true)
        if(controller==null)module.exports.currentController=null
        if(controller&&Vars.player.unit()){
            module.exports.currentController=controller.create()
            module.exports.currentController.unit=Vars.player.unit()
            module.exports.currentControllerI=controller
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
require("ai/JoyStick")