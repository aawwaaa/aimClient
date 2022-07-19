function getItemAmount(item){
    return Vars.player.team().core()?Vars.player.team().core().items.get(item):0
}

function chooseItem(unit){
    let min=Infinity
    let tier=unit.type.mineTier
    let item=Items.copper
    if(tier>=0&&getItemAmount(Items.copper)<min&&Vars.indexer.hasOre(Items.copper)){
        min=getItemAmount(Items.copper)
        item=Items.copper
    }
    if(tier>=0&&getItemAmount(Items.lead)<min&&Vars.indexer.hasOre(Items.lead)){
        min=getItemAmount(Items.lead)
        item=Items.lead
    }
    if(tier>=3&&getItemAmount(Items.titanium)<min&&Vars.indexer.hasOre(Items.titanium)){
        min=getItemAmount(Items.titanium)
        item=Items.titanium
    }
    if(tier>=0&&getItemAmount(Items.beryllium)<min&&Vars.indexer.hasOre(Items.beryllium)){
        min=getItemAmount(Items.beryllium)
        item=Items.beryllium
    }
    if(tier>=0&&getItemAmount(Items.graphite)<min&&Vars.indexer.hasOre(Items.graphite)){
        min=getItemAmount(Items.graphite)
        item=Items.graphite
    }
    return item
}

let c=new (require("ai/Main").Controller)(
    function(){
        let mining=true
        let targetItem=Items.copper
        let ore=null
        let ai=extend(AIController,{
            isReady(){
                return true
            },
            updateMovement(){
                let unit = this.unit;
                let core = unit.closestCore()
                if(!(unit.canMine()) || core == null) return
                if(unit.mineTile!=null&&!unit.mineTile.within(unit,unit.type.range)){
                    unit.mineTile=null
                }
                if(!mining){
                    unit.mineTile = null;
                    if(unit.stack.amount == 0){
                        mining = true;
                        return;
                    }
                    if(unit.within(core, unit.type.range-30)){
                        if(core.acceptStack(unit.stack.item, unit.stack.amount, unit) >= unit.stack.amount) Call.transferInventory(Vars.player,core); else Call.dropItem(0)
                        mining = true;
                    }else this.circle(core, unit.type.range/1.8)
                    return
                }
                if(
                    unit.stack.amount>=unit.type.itemCapacity||(
                        targetItem!=null&&
                        !unit.acceptsItem(targetItem)
                    )
                ){
                    mining=false
                    return
                }
                targetItem=chooseItem(unit)
                if(targetItem!=null){
                    ore=Vars.indexer.findClosestOre(core.x,core.y,targetItem);
                }
                if(ore!=null){
                    this.moveTo(ore, unit.type.range/4,20);
                    if(unit.within(ore,unit.type.range*0.5)){
                        unit.mineTile = ore;
                    }
                    if(ore.block() != Blocks.air){
                        mining = false;
                    }
                }
            }
        })
        return ai
    },
    function(c){
        
    }
)

module.exports.init=()=>require("ai/Main").addAI(Core.atlas.drawable("aimclient-ai-miner"),c)