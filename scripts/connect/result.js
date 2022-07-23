let data="",hasData=false
Vars.netClient.addPacketHandler("result",(msg)=>{
    data=msg
    hasData=true
})
const Manager = require("Manager")

module.exports=function(MainWindow){
    MainWindow.table.table().size(0).row()
    let tc=MainWindow.table.table(Stys.button,cons(t=>{
        t.label(prov(()=>data)).size(48*8-40,220)
        t.button(Core.atlas.drawable("aimclient-close"),Stys.di,run(()=>{
            hasData=false
        })).size(40).top().right().get().resizeImage(16)
    })).top().left().height(0).minWidth(48*8).marginLeft(18)
    let t=tc.get()
    t.visibility=boolp(()=>MainWindow.s&&hasData);
    t.update(run(()=>{
        tc.height((MainWindow.s&&hasData)*220)
    }))
    MainWindow.moveY.push(()=>-(MainWindow.s&&hasData)*110)
}