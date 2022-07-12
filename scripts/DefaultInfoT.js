const Manager=require("Manager");
module.exports=()=>{
    let t=new Table();
    t.label(prov(()=>Manager.connected?(
        Manager.connectData.broad?Manager.connectData.broad:"No info."
    ):"AimClient"))
    return t;
}