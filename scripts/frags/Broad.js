exports.init=()=>{
    let datas=require("frags/Main").datas
    let Stys=require("Styles")
    datas.push({
        valid(){
            return !!Vars.player.unit()
        },
        add(table,tile){
            table.image(this.icon).size(16)
            let bar=new (Stys.bar)(
                prov(()=>!Vars.player.unit()?"N/A":Math.round(Vars.player.unit().health)+"/"+Vars.player.unit().maxHealth),
                prov(()=>Color.valueOf("ff0000")),
                floatp(()=>!Vars.player.unit()?0:Vars.player.unit().health/Vars.player.unit().maxHealth)
            )
            table.add(bar).size((48*6)-16,16)
            return 16
        },
        name:"@broad-self-health",
        icon:Core.atlas.drawable("aimclient-frag-health"),
        atTable:true
    })
    datas.push({
        valid(tile){
            return !!Vars.player.unit()
        },
        add(table,tile){
            table.image(this.icon).size(16)
            let bar=new (Stys.bar)(
                prov(()=>!Vars.player.unit()?"N/A":Math.round(Vars.player.unit().shield%Vars.player.unit().maxHealth)+"+"+Math.floor(Vars.player.unit().shield/Vars.player.unit().maxHealth)+"*"+Vars.player.unit().maxHealth),
                prov(()=>Color.valueOf("4488aa")),
                floatp(()=>!Vars.player.unit()?0:Vars.player.unit().shield%Vars.player.unit().maxHealth/Vars.player.unit().maxHealth)
            )
            table.add(bar).size((48*6)-16,16)
            return 16
        },
        name:"@broad-self-shield",
        icon:Core.atlas.drawable("aimclient-frag-shield"),
        atTable:true
    })
    
}