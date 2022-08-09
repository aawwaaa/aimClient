let stickVec=new Vec2()
let boostButton
let table
let size=+Core.settings.get("ac-joystick-size","300")
let tx=+Core.settings.get("ac-joystick-x","400")
let ty=+Core.settings.get("ac-joystick-y","400")
let c=new (require("ai/Main").Controller)(
    function(){
        let mv=new Vec2()
        function updateUnit(unit){
                let rect = Tmp.r3;

        let type = unit.type;
        if(type == null) return;

        let omni = unit.type.omniMovement;
        let allowHealing = type.canHeal;
        let validHealTarget = allowHealing && Vars.control.input.target instanceof Building && Vars.control.input.target.isValid() && Vars.control.input.target.team() == unit.team && Vars.control.input.target.damaged() && Vars.control.input.target.within(unit, type.range);
        let boosted = (unit instanceof Mechc && unit.isFlying());

        //reset Vars.control.input.target if:
        // - in the editor, or...
        // - it's both an invalid standard Vars.control.input.target and an invalid heal Vars.control.input.target
        if((Units.invalidateTarget(Vars.control.input.target, unit, type.range) && !validHealTarget) || Vars.state.isEditor()){
            Vars.control.input.target = null;
        }

        let attractDst = 15;

        let speed = unit.speed();
        let range = unit.hasWeapons() ? unit.range() : 0;
        let bulletSpeed = unit.hasWeapons() ? type.weapons.first().bullet.speed : 0;
        let mouseAngle = unit.angleTo(unit.aimX, unit.aimY);
        let aimCursor = omni && Vars.player.shooting && type.hasWeapons() && !boosted && type.faceTarget;

        if(aimCursor){
            unit.lookAt(mouseAngle);
        }else{
            unit.lookAt(unit.prefRotation());
        }

        mv.set(stickVec).limit(speed);
        mv.setAngle(Mathf.slerp(mv.angle(), unit.vel.angle(), 0.05));

        unit.hitbox(rect);
        rect.grow(4);

        if(boostButton) Vars.player.boosting = boostButton.isChecked()

        unit.movePref(mv);

        //update shooting if not building + not mining
        if(!Vars.player.unit().activelyBuilding() && Vars.player.unit().mineTile == null){

            //autofire Vars.control.input.targeting
            if(Vars.control.input.manualShooting){
                Vars.player.shooting = !Vars.control.input.boosted;
                unit.aim(Vars.player.mouseX = Core.input.mouseWorldX(), Vars.player.mouseY = Core.input.mouseWorldY());
            }else if(Vars.control.input.target == null){
                Vars.player.shooting = false;
                if(Core.settings.getBool("autotarget") && !(Vars.player.unit() instanceof BlockUnitUnit && Vars.player.unit().tile() instanceof ControlBlock && !Vars.player.unit().tile().shouldAutoTarget())){
                    if(Vars.player.unit().type.canAttack){
                        Vars.control.input.target = Units.closestTarget(unit.team, unit.x, unit.y, range, u => u.checkTarget(type.targetAir, type.targetGround), u => type.targetGround);
                    }

                    if(allowHealing && Vars.control.input.target == null){
                        Vars.control.input.target = Geometry.findClosest(unit.x, unit.y, Vars.indexer.getDamaged(Vars.player.team()));
                        if(Vars.control.input.target != null && !unit.within(Vars.control.input.target, range)){
                            Vars.control.input.target = null;
                        }
                    }
                }
                unit.aim(Core.input.mouseWorldX(), Core.input.mouseWorldY());
            }else{
                let intercept = Predict.intercept(unit, Vars.control.input.target, bulletSpeed);

                Vars.player.mouseX = intercept.x;
                Vars.player.mouseY = intercept.y;
                Vars.player.shooting = !Vars.control.input.boosted;

                unit.aim(Vars.player.mouseX, Vars.player.mouseY);
            }
        }

        unit.controlWeapons(Vars.player.shooting && !Vars.control.input.boosted);
            }
        Core.scene.add(table)
        return {isReady:()=>true,
            updateUnit(){
                updateUnit(this.unit)
            }
        }
    },
    function(c){
        table.remove()
    }
)

module.exports.init=()=>{
    if(Vars.mobile)require("ai/Main").addAI(Core.atlas.drawable("aimclient-ai-joyStick"),c)
    table=new Table()
    let t1,tt,t2,t3,t4,img
    let la=[]
    let draw
    let tn=table.table(Stys.button,cons(t=>{
        t1=t.table(Stys.buttonNoBackground,cons(t=>{
            tt=t.add("@joystick").height(32).left()
            let lastX,lastY
            tt.get().addListener(extend(InputListener,{
                touchDown:function(event, x, y, pointer, button){
                    lastX = x;
                    lastY = y;
                    return true;
                },
                touchDragged:function(event, x, y, pointer){
                    let v=table.localToStageCoordinates(Tmp.v1.set(x, y));
                    tx = -lastX + v.x;
                    ty = -lastY + v.y;
                    Core.settings.put("ac-joystick-x",tx.toString())
                    Core.settings.put("ac-joystick-y",ty.toString())
                    return true;
                }
            }))
            let b=t.button(Core.atlas.drawable("aimclient-resize"),Stys.di,run(()=>{})).size(32).right().get()
            b.resizeImage(16)
            b.addListener(extend(InputListener,{
                touchDown:function(_,x,y){
                    lastX=x
                    lastY=y
                    return true
                },
                touchUp:function(_,x,y){
                    //print("resize")
                    let mx=x-lastX
                    let my=y-lastY
                    let movX=Math.abs(mx)
                    let movY=Math.abs(my)
                    if(movX>movY) size+=mx; else size+=my
                    draw(size)
                    Core.settings.put("ac-joystick-size",size.toString())
                    return true
                }
            }))
            la.push(t.add("").size(0).get())
        })).height(32)
        t.row()
        t2=t.table(cons(t=>{
            t3=t.table(Stys.button,cons(t=>{
                img=t.image(Core.atlas.find("aimclient-ai-joyStick")).size(32).left().bottom()
                la.push(t.add("").size(0).get())
            })).touchable(Touchable.enabled)
            t4=t.table(cons(t=>{
                boostButton=t.button(Core.atlas.drawable("aimclient-boost"),Stys.is,run(()=>{})).size(96,48).top().get()
                boostButton.resizeImage(32)
                t.row()
                t.button(Core.atlas.drawable("aimclient-pickBuildingUp"),Stys.di,run(()=>{
                    if(Vars.player.unit()&&Vars.player.unit().tileOn()&&Vars.player.unit().tileOn().build) Call.requestBuildPayload(Vars.player, Vars.player.unit().tileOn().build);
                })).size(96,48).top().get().resizeImage(32)
                t.row()
                t.button(Core.atlas.drawable("aimclient-pickUnitUp"),Stys.di,run(()=>{
                    if(Vars.player.unit()&&
                        Units.closest(
                            Vars.player.team(),
                            Vars.player.unit().x,
                            Vars.player.unit().y,
                            48,
                            boolf(u=>u!=Vars.player.unit()))
                    )
                    try{Call.requestUnitPayload(Vars.player, Units.closest(
                        Vars.player.team(),
                        Vars.player.unit().x,
                        Vars.player.unit().y,
                        48,
                        boolf(u=>u!=Vars.player.unit())));
                    }catch(e){}
                })).size(96,48).top().get().resizeImage(32)
                t.row()
                t.button(Core.atlas.drawable("aimclient-payloadDrop"),Stys.di,run(()=>{
                    Vars.control.input.tryDropPayload();
                })).size(96,48).top().get().resizeImage(32)
                la.push(t.add("").size(0).get())
            })).left()
            la.push(t.add("").size(0).get())
        }))
        la.push(t.add("").size(0).get())
    }))
    draw=size=>{
        tn.size(size+96,size+32)
        t1.size(size+96,32)
        tt.size(size+96-32,32)
        t2.size(size+96,size)
        t3.size(size,size)
        //t3.get().resizeImage(size)
        t4.size(96,size)
        la.forEach(a=>{
            a.setText("-")
            a.setText("")
        })
    }
    t3.get().addListener(extend(InputListener,{
        touchDown:function(){
            //print("down")
            img.size(48)
            la.forEach(a=>{
                a.setText("-")
                a.setText("")
            })
            return true
        },
        touchDragged:function(e,x,y,p){
            //print("drag")
            let ax=x-t3.get().x-16
            let ay=y-t3.get().y-16
            ax=Math.min(size,Math.max(0,ax))
            ay=Math.min(size,Math.max(0,ay))
            img.padLeft(ax-size/2)
            img.padBottom(ay-size/2)
            ax/=size
            ay/=size
            ax-=0.5
            ay-=0.5
            ax*=Vars.player.unit()?Vars.player.unit().speed():0
            ay*=Vars.player.unit()?Vars.player.unit().speed():0
            stickVec.set(ax,ay)
            la.forEach(a=>{
                a.setText("-")
                a.setText("")
            })
            return true
        },
        touchUp:function(){
            //print("up")
            img.padLeft(0)
            img.padBottom(size/2)
            img.size(64)
            la.forEach(a=>{
                a.setText("-")
                a.setText("")
            })
            stickVec.set(0,0)
            return true
        }
    }))
    
    table.update(()=>{
        table.setPosition(tx+table.width,ty+table.height)
        table.toFront()
    })
    table.visibility=boolp(()=>Vars.state.isGame())
    draw(size)
    module.exports.table=table
}
        