exports.init=()=>{
    let datas=require("frags/Main").datas
    datas.push({
        valid(tile){
            return !!tile&&tile.build&&tile.build.power&&tile.build.power.graph
        },
        add(table,tile){
            table.image(this.icon).size(16)
            let bar=new (Stys.bar)(
                prov(()=>{
                    if(!(tile.build&&tile.build.power&&tile.build.power.graph)) return "N/A"
                    let graph=tile.build.power.graph
                    let io=graph.getLastPowerProduced()-graph.getLastPowerNeeded()
                    io*=60
                    io=Math.floor(io)
                    if(io>0) io="+"+io
                    return io+""
                }),
                prov(()=>{
                    if(!(tile.build&&tile.build.power&&tile.build.power.graph)) return Color.gray
                    let graph=tile.build.power.graph
                    let io=graph.getLastPowerProduced()-graph.getLastPowerNeeded()
                    if(io>0) return Color.red
                    if(io<0) return Color.green
                    return Color.yellow
                }),
                floatp(()=>{
                    if(!(tile.build&&tile.build.power&&tile.build.power.graph)) return 0
                    let graph=tile.build.power.graph
                    let io=graph.getLastPowerProduced()-graph.getLastPowerNeeded()
                    if(io>0) return graph.getLastPowerNeeded()/graph.getLastPowerProduced()
                    if(io<0) return graph.getLastPowerProduced()/graph.getLastPowerNeeded()
                    return 1
                })
            )
            table.add(bar).size((48*6)-16,16)
            return 16
        },
        name:"@frag-powerGraph",
        icon:Core.atlas.drawable("aimclient-frag-powerGraph")
    })
    datas.push({
        valid(tile){
            return !!tile&&tile.build&&tile.build.power&&tile.build.power.graph
        },
        add(table,tile){
            table.image(this.icon).size(16)
            table.label(prov(()=>{
                if(!(tile.build&&tile.build.power&&tile.build.power.graph)) return "[green]+P"
                let graph=tile.build.power.graph
                return "[green]+"+Math.floor(graph.getLastPowerProduced()*60)+""
            })).size((48*6-16)/2,16)
            table.label(prov(()=>{
                if(!(tile.build&&tile.build.power&&tile.build.power.graph)) return "[red]-P"
                let graph=tile.build.power.graph
                return "[red]-"+Math.floor(graph.getLastPowerNeeded()*60)+""
            })).size((48*6-16)/2,16)
            return 16
        },
        name:"@frag-powerGraph-IO",
        icon:Core.atlas.drawable("aimclient-frag-powerGraph-io")
    })
    datas.push({
        valid(tile){
            return !!tile&&tile.build&&tile.build.power&&tile.build.power.graph
        },
        add(table,tile){
            table.image(this.icon).size(16)
            let bar=new (Stys.bar)(
                prov(()=>{
                    if(!(tile.build&&tile.build.power&&tile.build.power.graph)) return "N/A"
                    let graph=tile.build.power.graph
                    return Math.floor(graph.getLastPowerStored())+"/"+graph.getTotalBatteryCapacity()
                }),
                prov(()=>Color.yellow),
                floatp(()=>{
                    if(!(tile.build&&tile.build.power&&tile.build.power.graph)) return 0
                    let graph=tile.build.power.graph
                    return graph.getLastPowerStored()/graph.getTotalBatteryCapacity()
                })
            )
            table.add(bar).size((48*6)-16,16)
            return 16
        },
        name:"@frag-powerGraph-battery",
        icon:Core.atlas.drawable("aimclient-frag-powerGraph-battery")
    })
}