exports.init=()=>{
    let datas=require("frags/Main").datas
    let Stys=require("Styles")
    datas.push({
        valid(tile){
            return !!tile&&tile.build&&tile.build.items
        },
        add(table,tile){
            let a=0
            table.table(Stys.button,cons(t=>{
                tile.build.items.each((item,amount)=>{
                    if(amount<=0) return
                    t.image(Core.atlas.find(item.uiIcon)).size(16)
                    t.label(prov(()=>tile.build.items.get(item)+"")).size(48*6-16,16).row()
                    a++
                })
            }))
            return a*16
        },
        name:"@frag-items",
        icon:Core.atlas.drawable("aimclient-frag-items")
    })
    datas.push({
        valid(tile){
            return !!tile&&tile.build&&tile.build.liquids
        },
        add(table,tile){
            let a=0
            table.table(Stys.button,cons(t=>{
                tile.build.liquids.each((liquid,amount)=>{
                    if(amount<=0.05) return
                    t.image(Core.atlas.find(liquid.uiIcon)).size(16)
                    t.label(prov(()=>Math.floor(tile.build.liquids.get(liquid)*1000)/1000+"")).size(48*6-16,16).row()
                    a++
                })
            }))
            return a*16
        },
        name:"@frag-liquids",
        icon:Core.atlas.drawable("aimclient-frag-liquids")
    })
}