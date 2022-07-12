const Window = require("Window");
const Manager = require("Manager");
const Selectors = require("selectors/Selectors");

module.exports=(type,data)=>{

    let window=new Window();
    window.setTitle("TestWindow");

    let body=new Table();

    let b=Selectors.teamSelectButton(window,body,{})
    b.cell.size(256,64);

    body.row();

    body.label(prov(()=>"< "+b.getTeam()+" >")).size(128,32)
    body.button("Clear",run(()=>{
        b.clearTeam();
    }))

    window.setBody(body);
    
    let statusBar=new Table();

    window.setStatusBar(statusBar);

    let aa=body.add("").get();
    let ab=statusBar.add("").get();
    window.onResize=(w,h)=>{
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