const Window = require("Window");
const Selectors = require("selectors/Selectors");
const Stys = require("Styles");

module.exports=(_1,_2)=>{

    /**
     * Window:
     *   unitSelectButton
     *   teamSelectButton
     *   field (number,amount)
     *   positionSelectButton
     *   spawn button(statusBar)
     */

    let window=new Window();
    window.setTitle("@Wspawn");

    let body=new Table();

    body.add("@unit").left().row()

    let unitSelectButton=Selectors.unitSelectButton(window,body,{
        filter(unit){
            return unit!=UnitTypes.block;
        }
    });

    body.row()

    body.add("@team").left().row()

    let teamSelectButton=Selectors.teamSelectButton(window,body,{});

    body.row()

    body.add("@amount").left().row()
    let amountField=body.field("",Stys.textField,cons(()=>{}));
    amountField.get().setValidator(new TextField.TextFieldValidator(){
        valid(text){
            return !isNaN(text)&&text>0&&parseInt(text)==text;
        }
    });
    body.row()

    body.add("@position").left().row()
    let position=Selectors.position(window,body,{
        unitGrid:true,
    });
    
    let statusBar=new Table();

    let a=statusBar.table();

    let spawnButton=statusBar.button(Core.atlas.drawable("aimclient-spawn"),Stys.di,run(()=>{
        if(unitSelectButton.getUnit()==null) return;
        if(teamSelectButton.getTeam()==null) return;
        if(amountField.get().getText()<=0) return;
        if(isNaN(amountField.get().getText())) return;
        if(parseInt(amountField.get().getText())!=amountField.get().getText()) return;
        let amount=parseInt(amountField.get().getText());
        if(Vars.net.client()){
            Call.serverPacketReliable("spawn",unitSelectButton.getUnit().id+"|"+teamSelectButton.getTeam().id+"|"+position.getX()+"|"+position.getY()+"|"+amount);
        }else{
            for(let i=0;i<amount;i++){
                unitSelectButton.getUnit().spawn(teamSelectButton.getTeam(),position.getX(),position.getY());
            }
        }
    }))
    spawnButton.get().resizeImage(16);
    spawnButton.get().add("@spawn")
    spawnButton.size(128,32);

    let aa=body.add("").get();
    let ab=statusBar.add("").get();

    window.draw=()=>{
        Draw.rect(Core.atlas.find("aimclient-spawn"),position.getX(),position.getY(),8*4,8*4);
    }

    window.onResize=(w,h)=>{
        unitSelectButton.cell.size(w,32)
        teamSelectButton.cell.size(w,32)
        amountField.size(w,32)
        position.cell.size(w,32)
        position.resize(w,32)
        a.size(w-128-32,32)
        aa.setText("-")
        ab.setText("-")
        aa.setText("")
        ab.setText("")
    }

    window.setBody(body);
    window.setStatusBar(statusBar);
    window.setSize(400,300)
    window.center();
    window.show();
}