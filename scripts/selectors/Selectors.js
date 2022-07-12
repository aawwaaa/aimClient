const TeamSelector=require("selectors/TeamSelector");
const UnitSelector=require("selectors/UnitSelector");
const BlockSelector=require("selectors/BlockSelector");
const ItemSelector=require("selectors/ItemSelector");
const LiquidSelector=require("selectors/LiquidSelector");
const ObjectSelector=require("selectors/ObjectSelector");
const StatusEffectSelector=require("selectors/StatusEffectSelector");
const PositionT=require("selectors/Position");
const Stys=require("Styles");

module.exports={
    teamSelectButton:function(window,table,opt){
        let ta=new Table();
        let img=(c)=>ta.image().color(c).get();
        let team=opt.defaultTeam||null;
        let b=table.button(Core.atlas.drawable("aimclient-close"),Stys.di,run(()=>{
            new TeamSelector(window,opt);
        }));
        b.get().resizeImage(16);
        let lastOnSelect=opt.onSelect;
        opt.onSelect=(t)=>{
            team=t;
            if(t)b.get().replaceImage(img(t.color));else b.get().replaceImage(new Image(Core.atlas.drawable("aimclient-close")));
            if(lastOnSelect)lastOnSelect(t);
        }
        b.get().label(prov(()=>(team!=null?("[#"+team.color.toString()+"]"+team.name):"@none")))
        return {
            getTeam:()=>team,
            setTeam:(t)=>{
                team=t;
                if(t)b.get().replaceImage(img(t.color));else b.get().replaceImage(new Image(Core.atlas.drawable("aimclient-close")));
                if(lastOnSelect)lastOnSelect(t);
            },
            clearTeam:()=>{
                team=null;
                b.get().replaceImage(new Image(Core.atlas.drawable("aimclient-close")));
            },
            cell:b,
            button:b.get()
        }
    },
    unitSelectButton:function(window,table,opt){
        let unit=opt.defaultUnit||null;
        let b=table.button(Core.atlas.drawable("aimclient-close"),Stys.di,run(()=>{
            new UnitSelector(window,opt);
        }));
        b.get().resizeImage(16);
        let lastOnSelect=opt.onSelect;
        opt.onSelect=(u)=>{
            unit=u;
            if(u)b.get().replaceImage(new Image(u.uiIcon));else b.get().replaceImage(new Image(Core.atlas.drawable("aimclient-close")));
            if(lastOnSelect)lastOnSelect(u);
        }
        b.get().label(prov(()=>(unit!=null?unit.localizedName:"@none")))
        return {
            getUnit:()=>unit,
            setUnit:(u)=>{
                unit=u;
                if(u)b.get().replaceImage(new Image(u.uiIcon));else b.get().replaceImage(new Image(Core.atlas.drawable("aimclient-close")));
                if(lastOnSelect)lastOnSelect(t);
            },
            clearUnit:()=>{
                unit=null;
                b.get().replaceImage(new Image(Core.atlas.drawable("aimclient-close")));
            },
            cell:b,
            button:b.get()
        }
    },
    blockSelectButton:function(window,table,opt){
        let block=opt.defaultBlock||null;
        let b=table.button(Core.atlas.drawable("aimclient-close"),Stys.di,run(()=>{
            new BlockSelector(window,opt);
        }
        ));
        b.get().resizeImage(16);
        let bu=b;
        let lastOnSelect=opt.onSelect;
        opt.onSelect=(b)=>{
            block=b;
            if(b)bu.get().replaceImage(new Image(b.uiIcon));else bu.get().replaceImage(new Image(Core.atlas.drawable("aimclient-close")));
            if(lastOnSelect)lastOnSelect(b);
        }
        b.get().label(prov(()=>(block!=null?block.localizedName:"@none")))
        return {
            getBlock:()=>block,
            setBlock:(b)=>{
                block=b;
                if(b)bu.get().replaceImage(new Image(b.uiIcon));else bu.get().replaceImage(new Image(Core.atlas.drawable("aimclient-close")));
                if(lastOnSelect)lastOnSelect(b);
            },
            clearBlock:()=>{
                block=null;
                b.get().replaceImage(new Image(Core.atlas.drawable("aimclient-close")));
            },
            cell:b,
            button:b.get()
        }
    },
    itemSelectButton:function(window,table,opt){
        let item=opt.defaultItem||null;
        let b=table.button(Core.atlas.drawable("aimclient-close"),Stys.di,run(()=>{
            new ItemSelector(window,opt);
        }
        ));
        b.get().resizeImage(16);
        let lastOnSelect=opt.onSelect;
        opt.onSelect=(i)=>{
            item=i;
            if(i)b.get().replaceImage(new Image(i.uiIcon));else b.get().replaceImage(new Image(Core.atlas.drawable("aimclient-close")));
            if(lastOnSelect)lastOnSelect(i);
        }
        b.get().label(prov(()=>(item!=null?item.localizedName:"@none")))
        return {
            getItem:()=>item,
            setItem:(i)=>{
                item=i;
                if(i)b.get().replaceImage(new Image(i.uiIcon));else b.get().replaceImage(new Image(Core.atlas.drawable("aimclient-close")));
                if(lastOnSelect)lastOnSelect(i);
            },
            clearItem:()=>{
                item=null;
                b.get().replaceImage(new Image(Core.atlas.drawable("aimclient-close")));
            },
            cell:b,
            button:b.get()
        }
    },
    liquidSelectButton:function(window,table,opt){
        let liquid=opt.defaultLiquid||null;
        let b=table.button(Core.atlas.drawable("aimclient-close"),Stys.di,run(()=>{
            new LiquidSelector(window,opt);
        }
        ));
        b.get().resizeImage(16);
        let lastOnSelect=opt.onSelect;
        opt.onSelect=(l)=>{
            liquid=l;
            if(l)b.get().replaceImage(new Image(l.uiIcon));else b.get().replaceImage(new Image(Core.atlas.drawable("aimclient-close")));
            if(lastOnSelect)lastOnSelect(l);
        }
        b.get().label(prov(()=>(liquid!=null?liquid.localizedName:"@none")))
        return {
            getLiquid:()=>liquid,
            setLiquid:(l)=>{
                liquid=l;
                if(l)b.get().replaceImage(new Image(l.uiIcon));else b.get().replaceImage(new Image(Core.atlas.drawable("aimclient-close")));
                if(lastOnSelect)lastOnSelect(l);
            },
            clearLiquid:()=>{
                liquid=null;
                b.get().replaceImage(new Image(Core.atlas.drawable("aimclient-close")));
            },
            cell:b,
            button:b.get()
        }
    },
    statusEffectSelectButton:function(window,table,opt){
        let statusEffect=opt.defaultStatusEffect||null;
        let b=table.button(Core.atlas.drawable("aimclient-close"),Stys.di,run(()=>{
            new StatusEffectSelector(window,opt);
        }
        ));
        b.get().resizeImage(16);
        let lastOnSelect=opt.onSelect;
        opt.onSelect=(s)=>{
            statusEffect=s;
            if(s)b.get().replaceImage(new Image(s.uiIcon));else b.get().replaceImage(new Image(Core.atlas.drawable("aimclient-close")));
            if(lastOnSelect)lastOnSelect(s);
        }
        b.get().label(prov(()=>(statusEffect!=null?statusEffect.localizedName:"@none")))
        return {
            getStatusEffect:()=>statusEffect,
            setStatusEffect:(s)=>{
                statusEffect=s
                if(s)b.get().replaceImage(new Image(s.uiIcon));else b.get().replaceImage(new Image(Core.atlas.drawable("aimclient-close")));
                if(lastOnSelect)lastOnSelect(s);
            },
            clearLiquid:()=>{
                statusEffect=null;
                b.get().replaceImage(new Image(Core.atlas.drawable("aimclient-close")));
            },
            cell:b,
            button:b.get()
        }
    },
    objectSelectButton(window,table,opt){
        let obj=opt.defaultObj||null;
        let b=table.button(obj?obj.toString():"null",Stys.dt,run(()=>{
            new ObjectSelector(window,opt);
        }
        ));
        let lastOnSelect=opt.onSelect;
        opt.onSelect=(o)=>{
            obj=o;
            b.get().setText(o?o.toString():"null")
            if(lastOnSelect)lastOnSelect(o);
        }
        return {
            getObject:()=>obj,
            setObject:(o)=>{
                obj=o;
                b.get().setText(o?o.toString():"null")
                if(lastOnSelect)lastOnSelect(o);
            },
            clearObject:()=>{
                obj=null;
                b.get().setText(obj?obj.toString():"null")
            },
            cell:b,
            button:b.get()
        }
    },
    position:function(window,table,opt){
        let x=0;
        let y=0;
        let cells;
        let cell=table.table(Stys.buttonNoBackground,cons(t=>{
            cells=[
                t.field("0",Stys.textField,cons(d=>{
                    if(!isNaN(d)){
                        x=d;
                        if(opt.onChange){
                            opt.onChange(x,y);
                        }
                    }
                })),
                t.field("0",Stys.textField,cons(d=>{
                    if(!isNaN(d)){
                        y=d;
                        if(opt.onChange){
                            opt.onChange(x,y);
                        }
                    }
                }))
            ]
            cells.forEach(a=>{
                a.get().setValidator(new TextField.TextFieldValidator(){
                    valid(text){
                        return !isNaN(text);
                    }
                });
            })
            t.button(Core.atlas.drawable("aimclient-here"),Stys.di,run(()=>{
                x=opt.unitGrid?Math.floor(Vars.player.x):Vars.player.tileX()
                y=opt.unitGrid?Math.floor(Vars.player.y):Vars.player.tileY()
                cells[0].get().setText(x+"");
                cells[1].get().setText(y+"");
                if(opt.onChange){
                    opt.onChange(x,y);
                }
            })).size(32,32).get().resizeImage(16);
            t.button(Core.atlas.drawable("aimclient-cross"),Stys.di,run(()=>{
                new PositionT({
                    onSelect:(xa,ya)=>{
                        x=xa;
                        y=ya;
                        cells[0].get().setText(x+"");
                        cells[1].get().setText(y+"");
                        if(opt.onChange){
                            opt.onChange(x,y);
                        }
                    },
                    unitGrid:opt.unitGrid?true:false
                })
            })).size(32,32).get().resizeImage(16);
        }))
        return {
            cell:cell,
            getX:()=>x,
            getY:()=>y,
            setX:(xa)=>{
                x=xa;
                cells[0].get().setText(xa+"");
            },
            setY:(ya)=>{
                y=ya;
                cells[1].get().setText(ya+"");
            },
            resize:(w,_h)=>{
                cells.forEach(a=>a.size((w-64)/2,32));
            }
        }
    }
}
