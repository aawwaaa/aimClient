const Window = require("Window");
const Manager = require("Manager");
const UnitSelector = require("selectors/UnitSelector");
const TeamSelector = require("selectors/TeamSelector");
const Selectors=require("selectors/Selectors");
const Stys = require("Styles");

module.exports=(unit)=>{

    let window=new Window();
    window.setTitle("@WunitInfo");
    /**
     * [img] type <edit>
     * hp/maxhp <edit>
     * team <edit>
     * x,y <edit>
     */
    let body=new Table();
    let draw;
    let eff=null;
    body.table(cons(t=>{
        draw=(w)=>{
            t.clear();
            t.table(cons(t=>{
                t.image(Core.atlas.find(unit.type.uiIcon)).size(32,32).left()
                t.add(unit.type.localizedName).size(w-32*2,32).left()
                t.button(Core.atlas.drawable("aimclient-edit"),Stys.di,run(()=>{
                    new UnitSelector(window,{
                        onSelect(type){
                            unit.type=type;
                            if(Vars.net.client()) Call.serverPacketReliable("setUnitType",unit.id+"|"+type.id)
                            Manager.events.fire("unitChange",unit)
                        }
                    })
                })).size(32).get().resizeImage(16)
            })).size(w,32).row()
            t.table(cons(t=>{
                let editing=false;
                let healthField;
                let maxHealthField;
                let tT=new Table();
                t.add(tT).size(w-32,32);
                let t1=new Table()
                let t2=new Table()
                t1.label(prov(()=>Math.floor(unit.health)+"/"+unit.maxHealth)).size(w-32,32).left().get()
                t2.table(cons(t=>{
                    healthField=t.field("",Stys.textField,cons((h)=>{})).size((w-32)/2,32).left().get();
                    maxHealthField=t.field("",Stys.textField,cons((mh)=>{})).size((w-32)/2,32).right().get();
                    healthField.setValidator(new TextField.TextFieldValidator(){
                        valid(text){
                            return !isNaN(text);
                        }
                    });
                    maxHealthField.setValidator(new TextField.TextFieldValidator(){
                        valid(text){
                            return !isNaN(text);
                        }
                    });
                })).size(w-32,32).left()
                t.button(Core.atlas.drawable("aimclient-edit"),Stys.di,run(()=>{
                    if(editing){
                        try{
                            if(Vars.net.client()){
                                if(!(isNaN(healthField.getText())||isNaN(maxHealthField.getText()))){
                                    Call.serverPacketReliable("setUnitData",unit.id+"|"+JSON.stringify({
                                        health:healthField.getText(),
                                        maxHealth:maxHealthField.getText()
                                    }))
                                }
                                editing=false;
                                tT.clear()
                                tT.add(t1).size(w-32,32)
                            }else{
                                unit.health=healthField.getText();
                                unit.maxHealth=maxHealthField.getText();
                                editing=false;
                                tT.clear()
                                tT.add(t1).size(w-32,32)
                            }
                        }catch(e){
                        }
                    }else{
                        healthField.setText(unit.health+"")
                        maxHealthField.setText(unit.maxHealth+"")
                        editing=true;
                        tT.clear()
                        tT.add(t2).size(w-32,32)
                    }
                })).size(32,32).left().get().resizeImage(16)
                tT.clear()
                tT.add(editing?t2:t1).size(w-32,32)
            })).size(w,32).row()
            t.table(cons(t=>{
                t.image().color(unit.team.color).size(32,32).left()
                t.label(prov(()=>unit.team+"")).size(w-32*2,32).left()
                t.button(Core.atlas.drawable("aimclient-edit"),Stys.di,run(()=>{
                    new TeamSelector(window,{
                        onSelect(team){
                            unit.team=team;
                            if(unit.player) unit.player.team(team);
                            if(Vars.net.client()) Call.serverPacketReliable("setUnitTeam",unit.id+"|"+team.id)
                            Manager.events.fire("unitChange",unit)
                        }
                    })
                })).size(32).get().resizeImage(16)
            })).size(w,32).row()
            t.table(cons(t=>{
                let editing=false;
                let s;
                let tT=new Table();
                t.add(tT).size(w-32,32);
                let t1=new Table()
                let t2=new Table()
                t1.label(prov(()=>Math.floor(unit.x)+","+Math.floor(unit.y))).size(w-32,32)
                t2.table(cons(t=>{
                    s=Selectors.position(window,t,{
                        unitGrid:true,
                        onChange(x,y){}
                    })
                    s.cell.size(w-32,32)
                    s.resize(w-32,32)
                })).size(w-32,32).get()
                t.button(Core.atlas.drawable("aimclient-edit"),Stys.di,run(()=>{
                    if(editing){
                        editing=false;
                        tT.clear()
                        tT.add(t1).size(w-32,32)
                        let x=s.getX();
                        let y=s.getY();
                        if(Vars.net.client()){
                            Call.serverPacketReliable("setUnitPosition",unit.id+"|"+x+"|"+y);
                        }else{
                            unit.x=x;
                            unit.y=y;
                        }
                    }else{
                        s.setX(Math.floor(unit.x))
                        s.setY(Math.floor(unit.y))
                        editing=true;
                        tT.clear()
                        tT.add(t2).size(w-32,32)
                    }
                })).size(32,32).left().get().resizeImage(16)
                tT.clear()
                tT.add(editing?t2:t1).size(w-32,32)
            })).size(w,32).row()
            t.table(cons(t=>{
                let editing=false;
                let shieldField;
                let tT=new Table();
                t.add(tT).size(w-32,32);
                let t1=new Table()
                let t2=new Table()
                t1.label(prov(()=>Math.floor(unit.shield)+"")).size(w-32,32).left().get()
                t2.table(cons(t=>{
                    shieldField=t.field("",Stys.textField,cons((h)=>{})).size(w-32,32).left().get();
                    shieldField.setValidator(new TextField.TextFieldValidator(){
                        valid(text){
                            return !isNaN(text);
                        }
                    });
                })).size(w-32,32).left()
                t.button(Core.atlas.drawable("aimclient-edit"),Stys.di,run(()=>{
                    if(editing){
                        try{
                            if(Vars.net.client()){
                                if(!(isNaN(shieldField.getText()))){
                                    Call.serverPacketReliable("setUnitData",unit.id+"|"+JSON.stringify({
                                        shield:shieldField.getText()
                                    }))
                                }
                                editing=false;
                                tT.clear()
                                tT.add(t1).size(w-32,32)
                            }else{
                                unit.shield=shieldField.getText();
                                editing=false;
                                tT.clear()
                                tT.add(t1).size(w-32,32)
                            }
                        }catch(e){
                            print(e)
                        }
                    }else{
                        shieldField.setText(unit.shield+"")
                        editing=true;
                        tT.clear()
                        tT.add(t2).size(w-32,32)
                    }
                })).size(32,32).left().get().resizeImage(16)
                tT.clear()
                tT.add(editing?t2:t1).size(w-32,32)
            })).size(w,32).row()
            t.button("@setWeapon",Stys.dt,run(()=>{
                new UnitSelector(window,{
                    onSelect(type){
                        unit.setupWeapons(type)
                        if(Vars.net.client()) Call.serverPacketReliable("setUnitWeapon",unit.id+"|"+type.id)
                        Manager.events.fire("unitChange",unit)
                    }
                })
            })).size(w,32).row()
            t.table(Stys.buttonNoBackground,cons(t=>{
                t.table(cons(t=>{
                    t.add("@statusEffects").size(w-32,32)
                    t.button(Core.atlas.drawable("aimclient-reload"),Stys.di,run(()=>{
                        draw(w)
                    })).size(32,32).get().resizeImage(16)
                })).size(w,32).row()
                t.table(cons(t=>{
                    let s=Selectors.statusEffectSelectButton(window,t,{
                        onSelect(effe){
                            eff=effe
                        }
                    })
                    s.setStatusEffect(eff)
                    s.cell.size(200,32)
                    let i=t.field("",Stys.textField,cons(a=>{})).size(w-232,32).get()
                    i.setValidator(new TextField.TextFieldValidator(){
                        valid(text){
                            return text==""||(!isNaN(text));
                        }
                    });
                    t.button(Core.atlas.drawable("aimclient-add"),Stys.di,run(()=>{
                        if(!s.getStatusEffect()) return;
                        if(i.getText()==""){
                            unit.apply(s.getStatusEffect())
                        }else{
                            unit.apply(s.getStatusEffect(),+i.getText())
                        }
                        if(Vars.net.client()){
                            Call.serverPacketReliable("addUnitStatusEffect",unit.id+"|"+s.getStatusEffect().id+"|"+i.getText())
                        }
                        draw(w)
                    })).size(32,32).get().resizeImage(16)
                })).size(w,32).row()
                Vars.content.statusEffects().each(e=>{
                    if(unit.hasEffect(e)){
                        t.table(cons(t=>{
                            t.image(Core.atlas.find(e.uiIcon)).size(32,32)
                            t.add(e.localizedName).size(w-64,32)
                            let effect=e
                            t.button(Core.atlas.drawable("aimclient-trash"),Stys.di,run(()=>{
                                unit.unapply(effect)
                                if(Vars.net.client()){
                                    Call.serverPacketReliable("removeUnitStatusEffect",unit.id+"|"+effect.id)
                                }
                                draw(w)
                            })).size(32,32).get().resizeImage(16)
                        })).size(w,32).row()
                    }
                })
            }))

        }
    }))
    
    let statusBar=new Table();

    let aa=body.add("").get();
    let ab=statusBar.add("").get();
    window.onResize=(w,h)=>{
        draw(w)
        aa.setText("-")
        ab.setText("-")
        aa.setText("")
        ab.setText("")
    }

    window.setBody(body);
    window.setStatusBar(statusBar);
    window.setSize(500,400)
    window.center();
    window.show();
}