const Window = require("Window");
const Selectors = require("selectors/Selectors");
const Stys = require("Styles");
const BlockSelector = require("selectors/BlockSelector");

module.exports=(type,data)=>{

    /**
     * Position:
     * [position1]
     * [position2]
     * Block:
     * [blockSelectButton][clear]
     * Team:
     * [teamSelectButton]
     * rotation:
     * [TextField]
     * Floor:
     * [blockSelectButton][clear]
     * Overlay:
     * [blockSelectButton][clear]
     * If:
     * Block:
     * [blockSelectButton][clear]
     * Floor:
     * [blockSelectButton][clear]
     * Overlay:
     * [blockSelectButton][clear]
     * 
     * datapacket:
     * fill pos1x|pos1y|pos2x|pos2y|block.id|team.id|rotation|floor.id|overlay.id|ifblock.id|iffloor.id|ifoverlay.id
     */
    
    let window=new Window();
    window.setTitle("@Wfill");
    let tables=[]
    let body=new Table();
    let pos1,pos2
    let n1=body.table(cons(t=>{
        t.add("@position").row()
        pos1=Selectors.position(null,t,{})
        t.row()
        pos2=Selectors.position(null,t,{})
    }))
    body.row()
    let blockSB;
    let overlaySB
    let floorSB;
    let ifBlockSB
    let ifFloorSB
    let ifOverlaySB;
    let teamSB;
    let rotationField;
    let n2,n3
    let nn=body.table(cons(t=>{
        n2=t.table(cons(t=>{
            t.add("@block").row()
            tables.push(t.table(cons(t=>{
                blockSB=Selectors.blockSelectButton(window,t,{
                    filter(block){
                        if(Block==Blocks.air) return true;
                        return !(block instanceof Floor || block instanceof OverlayFloor);
                    }
                })
                t.button(Core.atlas.drawable("aimclient-close"),Stys.di,run(()=>{
                    blockSB.clearBlock();
                })).size(32,32).get().resizeImage(16)
            })))
            t.row()
            t.add("@team").row()
            teamSB=Selectors.teamSelectButton(window,t,{})
            t.row()
            t.add("@rotation").row()
            rotationField=t.field("",Stys.textField,cons(()=>{}));
            rotationField.get().setValidator(new TextField.TextFieldValidator(){
                valid(text){
                    return !isNaN(text)&&text>=0&&text<=255&&parseInt(text)==text;
                }
            })
            t.row()
            tables.push(t.table(cons(t=>{
                t.add("@floor").row()
                floorSB=Selectors.blockSelectButton(window,t,{
                    filter(block){
                        return block instanceof Floor&&(!(block instanceof OverlayFloor));
                    }
                })
                t.button(Core.atlas.drawable("aimclient-close"),Stys.di,run(()=>{
                    floorSB.clearBlock();
                })).size(32,32).get().resizeImage(16)
            })))
            t.row()
            t.add("@overlay").row()
            
            tables.push(t.table(cons(t=>{
                overlaySB=Selectors.blockSelectButton(window,t,{
                    filter(block){
                        if(Block==Blocks.air) return true;
                        return block instanceof OverlayFloor;
                    }
                })
                t.button(Core.atlas.drawable("aimclient-close"),Stys.di,run(()=>{
                    overlaySB.clearBlock();
                })).size(32,32).get().resizeImage(16)
            })))
        }))
        n3=t.table(cons(t=>{
            t.add("@if").row()
            t.add("@block").row()
            
            tables.push(t.table(cons(t=>{
                ifBlockSB=Selectors.blockSelectButton(window,t,{
                    filter(block){
                        return !(block instanceof Floor || block instanceof OverlayFloor);
                    }
                })
                t.button(Core.atlas.drawable("aimclient-close"),Stys.di,run(()=>{
                    ifBlockSB.clearBlock();
                })).size(32,32).get().resizeImage(16)
            })))
            t.row()
            t.add("@floor").row()
            
            tables.push(t.table(cons(t=>{
                ifFloorSB=Selectors.blockSelectButton(window,t,{
                    filter(block){
                        return block instanceof Floor&&(!(block instanceof OverlayFloor));
                    }
                })
                t.button(Core.atlas.drawable("aimclient-close"),Stys.di,run(()=>{
                    ifFloorSB.clearBlock();
                })).size(32,32).get().resizeImage(16)
            })))
            t.row()
            t.add("@overlay").row()
            tables.push(t.table(cons(t=>{
                ifOverlaySB=Selectors.blockSelectButton(window,t,{
                    filter(block){
                        return block instanceof OverlayFloor;
                    }
                })
                t.button(Core.atlas.drawable("aimclient-close"),Stys.di,run(()=>{
                    ifOverlaySB.clearBlock();
                })).size(32,32).get().resizeImage(16);
            })))
        }))
    }))

    let statusBar=new Table();

    let e=statusBar.table();

    let fill=statusBar.button(Core.atlas.drawable("aimclient-fill"),Stys.di,run(()=>{
        let pos1x=pos1.getX();
        let pos1y=pos1.getY();
        let pos2x=pos2.getX();
        let pos2y=pos2.getY();
        let block=blockSB.getBlock();
        let team=teamSB.getTeam();
        let rotation=+rotationField.get().getText();
        let floor=floorSB.getBlock();
        let overlay=overlaySB.getBlock();
        let ifblock=ifBlockSB.getBlock();
        let iffloor=ifFloorSB.getBlock();
        let ifoverlay=ifOverlaySB.getBlock();
        let minX=Math.min(pos1x,pos2x);
        let minY=Math.min(pos1y,pos2y);
        let maxX=Math.max(pos1x,pos2x);
        let maxY=Math.max(pos1y,pos2y);
        if(Vars.net.client()){
            Call.serverPacketReliable("fill",minX+"|"+minY+"|"+maxX+"|"+maxY+"|"+(block?block.id:-1)+"|"+(team?team.id:0)+"|"+rotation+"|"+(floor?floor.id:-1)+"|"+(overlay?overlay.id:-1)+"|"+(ifblock?ifblock.id:-1)+"|"+(iffloor?iffloor.id:-1)+"|"+(ifoverlay?ifoverlay.id:-1));
        }else{
            for(let x=minX+(block?Math.ceil(block.size/2):1)-1;x<=maxX;x+=block?Math.ceil(block.size/2):1){
                for(let y=minY+(block?Math.ceil(block.size/2):1)-1;y<=maxY;y+=block?Math.ceil(block.size/2):1){
                    if(!Vars.world.tile(x,y)) continue;
                    if(ifblock) if(Vars.world.tile(x,y).block()!=ifblock) continue;
                    if(iffloor) if(Vars.world.tile(x,y).floor()!=iffloor) continue;
                    if(ifoverlay) if(Vars.world.tile(x,y).overlay()!=ifoverlay) continue;
                    if(block) Vars.world.tile(x,y).setNet(block,team?team:Team.get(0),isNaN(rotation)?0:rotation);
                    Vars.world.tile(x,y).setFloorNet(floor!=null?floor:Vars.world.tile(x,y).floor(),overlay!=null?overlay:Vars.world.tile(x,y).overlay());
                }
            }
        }
    })).size(128,32).get()
    fill.add("@fill")
    fill.resizeImage(16)

    window.draws.worldSelectorPoints=[
        {
            A:{
                x:()=>pos1.getX()*8,
                y:()=>pos1.getY()*8
            },
            B:{
                x:()=>pos2.getX()*8,
                y:()=>pos2.getY()*8
            },
            enabled:true
        }
    ]


    let aa=body.add("").get();
    let ab=statusBar.add("").get();
    window.onResize=(w,h)=>{
        tables.forEach(a=>a.size(w,32))
        n1.size(w,32*3)
        pos1.cell.size(w,32)
        pos1.resize(w,32)
        pos2.cell.size(w,32)
        pos2.resize(w,32)
        nn.size(w,h-32*3)
        n2.size(w/2,h-32*3)
        teamSB.cell.size(w/2,32)
        rotationField.size(w/2,32)
        blockSB.cell.size(w/2-32,32)
        floorSB.cell.size(w/2-32,32)
        overlaySB.cell.size(w/2-32,32)
        n3.size(w/2,h-32*3)
        ifBlockSB.cell.size(w/2-32,32)
        ifFloorSB.cell.size(w/2-32,32)
        ifOverlaySB.cell.size(w/2-32,32)
        e.size(w-32-128,32)
        aa.setText("-")
        ab.setText("-")
        aa.setText("")
        ab.setText("")
    }

    window.setBody(body);
    window.setStatusBar(statusBar);
    window.setSize(600,400)
    window.center();
    window.show();
}