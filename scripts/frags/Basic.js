exports.init=()=>{
    let datas=require("frags/Main").datas
    let Stys=require("Styles")
    datas.push({
        valid(tile){
            return !!tile
        },
        add(table,tile){
            table.image(this.icon).size(16)
            table.add(tile.x+","+tile.y).size((48*6)-16)
            return 16
        },
        name:"@frag-position",
        icon:Core.atlas.drawable("aimclient-frag-pos")
    })
    datas.push({
        valid(tile){
            return !!tile
        },
        add(table,tile){
            table.image(this.icon).size(16)
            table.image(Core.atlas.find(tile.block().uiIcon)).size(16)
            table.add(tile.block().localizedName+" ("+tile.block().name+" #"+tile.block().id+")").size((48*6)-32)
            return 16
        },
        name:"@frag-block",
        icon:Core.atlas.drawable("aimclient-frag-block")
    })
    datas.push({
        valid(tile){
            return !!tile
        },
        add(table,tile){
            table.image(this.icon).size(16)
            table.image(Core.atlas.find(tile.floor().uiIcon)).size(16)
            table.add(tile.floor().localizedName+" ("+tile.floor().name+" #"+tile.floor().id+")").size((48*6)-32)
            return 16
        },
        name:"@frag-floor",
        icon:Core.atlas.drawable("aimclient-frag-floor")
    })
    datas.push({
        valid(tile){
            return !!tile
        },
        add(table,tile){
            table.image(this.icon).size(16)
            table.image(Core.atlas.find(tile.overlay().uiIcon)).size(16)
            table.add(tile.overlay().localizedName+" ("+tile.overlay().name+" #"+tile.overlay().id+")").size((48*6)-32)
            return 16
        },
        name:"@frag-overlay",
        icon:Core.atlas.drawable("aimclient-frag-overlay")
    })
    datas.push({
        valid(tile){
            return !!tile&&tile.build
        },
        add(table,tile){
            table.image(this.icon).size(16)
            table.add("[#"+tile.build.team.color+"]"+tile.build.team).size((48*6)-16)
            return 16
        },
        name:"@frag-team",
        icon:Core.atlas.drawable("aimclient-frag-team")
    })
    datas.push({
        valid(tile){
            return !!tile&&tile.build
        },
        add(table,tile){
            table.image(this.icon).size(16)
            let bar=new (Stys.bar)(
                prov(()=>!tile.build?"N/A":Math.round(tile.build.health)+"/"+tile.block().health),
                prov(()=>Color.valueOf("ff0000")),
                floatp(()=>!tile.build?0:tile.build.health/tile.block().health)
            )
            table.add(bar).size((48*6)-16,16)
            return 16
        },
        name:"@frag-health",
        icon:Core.atlas.drawable("aimclient-frag-health")
    })
    datas.push({
        valid(tile){
            return !!tile&&tile.build
        },
        add(table,tile){
            table.image(this.icon).size(16)
            table.add(tile.build.config()+"").size((48*6)-16,16)
            return 16
        },
        name:"@frag-config",
        icon:Core.atlas.drawable("aimclient-frag-config")
    })
}