const Manager = require("Manager")

Vars.netClient.addPacketHandler("pvpProtect",(time)=>{
    Manager.pvpProtect=Vars.state.tick+(+time)
})

module.exports=function(MainWindow){
    MainWindow.table.table().size(0).row()
    let tc=MainWindow.table.table(cons(t=>{
        t.label(prov(()=>Core.bundle.get("pvpProtect").replace("@",Math.floor((Manager.pvpProtect-Date.now())/60/60*10)/10))).size(48*5,50)
    })).top().left().height(0).minWidth(48*5)
    let t=tc.get()
    t.visibility=boolp(()=>MainWindow.s&&Manager.pvpProtect>Vars.state.tick);
    t.update(run(()=>{
        tc.height((Manager.pvpProtect>Vars.state.tick&&MainWindow.s)*50)
    }))
    MainWindow.moveY.push(()=>-(MainWindow.s&&MainWindow.protectTimer>Vars.state.tick)*25)
}