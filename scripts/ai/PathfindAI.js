const Pos1=require("selectors/Position")
let pathfinded=false
let path=new Seq()
let pathIndex=0

module.exports.tileHueristics=[]
module.exports.tileHueristics.push(new Astar.TileHueristic(){
    cost(tile){
        let cost=0
        if(tile.solid()) cost+=300000
        if(tile.dangerous()) cost+=500
        if(tile.floor().isLiquid) cost+=50000
        if(tile.floor().isDeep()) cost+=100000
        for(let i=0;i<4;i++) if(tile.nearby(i)&&(tile.nearby(i).solid()||tile.nearby(i).floor().isLiquid)) cost+=3
        return cost
    }
})
module.exports.tileHueristics.push(new Astar.TileHueristic(){
    cost(tile){
        let cost=0
        if(tile.solid()) cost+=300000
        if(tile.dangerous()) cost+=500
        if(!tile.floor().isLiquid) cost+=100000
        if(!tile.floor().isDeep()) cost+=50000
        for(let i=0;i<4;i++) if(tile.nearby(i)&&(tile.nearby(i).solid()||!tile.nearby(i).floor().isLiquid)) cost+=3
        return cost
    }
})
module.exports.tilePossibles=[]
module.exports.tilePossibles.push((tile)=>!tile.solid())
module.exports.tilePossibles.push((tile)=>!tile.floor().isLiquid)

var FLYING=new Astar.TileHueristic(){
    cost(tile){
        let cost=0
        return cost
    }
}

let c=new (require("ai/Main").Controller)(
    function(){
        pathfinded=false
        let showed=false
        let ai=extend(AIController,{
            isReady(){
                return pathfinded
            },
            updateMovement(){
                let unit = this.unit;
                if(!unit) return
                if(!pathfinded&&showed) return
                if(!unit.type.flying&&!module.exports.tileHueristics[unit.pathType()]) return
                if(!pathfinded){
                    showed=true
                    new Pos1({
                        onSelect:(x,y)=>{
                            try{
                            path=new Seq()
                            pathIndex=0
                            Astar.pathfind(unit.tileX(),unit.tileY(),x,y,unit.type.flying?FLYING:module.exports.tileHueristics[unit.pathType()],boolf(tile=>unit.type.flying||module.exports.tilePossibles[unit.pathType()](tile))).each(a=>path.add(a))
                            pathfinded=true
                            }catch(e){}
                        },
                        unitGrid:false
                    })
                    return
                }
                if(pathIndex>=path.size) return
                let tile=path.get(pathIndex)
                unit.movePref(Tmp.v1.trns(unit.angleTo(tile.x*8, tile.y*8), this.unit.speed()));
                if(unit.within(tile.x*8,tile.y*8,6)){
                    pathIndex++
                }
            }
        })
        return ai
    },
    function(c){
        path=new Seq()
        pathfinded=false
    }
)

Events.run(Trigger.draw,run(()=>{
    if(!pathfinded) return
    Draw.color(Color.cyan)
    Lines.stroke(2)
    for(let i=0;i<path.size-2;i++){
        let curr=path.get(i)
        let next=path.get(i+1)
        Lines.line(curr.x*8,curr.y*8,next.x*8,next.y*8)
    }
    Draw.reset()
}))

module.exports.init=()=>require("ai/Main").addAI(Core.atlas.drawable("aimclient-ai-pathfind"),c)