const Manager = require("Manager")

Vars.netClient.addPacketHandler("gameover",(msg)=>{
    Manager.gameoverMessage=msg
})

Vars.netClient.addPacketHandler("gameoverTimer",(time)=>{
    Manager.gameoverTimer=Date.now()+(+time)
})

module.exports=function(MainWindow){
    MainWindow.table.table().size(0).row()
    let tc=MainWindow.table.table(cons(t=>Stys.button,{
        t.label(prov(()=>Manager.gameoverMessage)).size(48*5,150).row()
        t.label(prov(()=>Core.bundle.get("gameoverTimer").replace("@",Math.floor((Manager.gameoverTimer-Date.now())/1000*10)/10))).size(48*5,50)
    })).top().left().height(0).minWidth(48*5)
    let t=tc.get()
    t.visibility=boolp(()=>MainWindow.s&&Manager.gameoverTimer>Date.now());
    t.update(run(()=>{
        tc.height((Manager.gameoverTimer>Date.now()&&MainWindow.s)*200)
    }))
    MainWindow.moveY.push(()=>-(MainWindow.s&&MainWindow.gameoverTimer>Date.now())*100)
}