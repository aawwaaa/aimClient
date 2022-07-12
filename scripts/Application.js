const Window = require("Window");
const Manager = require("Manager");
const Stys = require("Styles");

module.exports=(type,data)=>{

    let window=new Window();
    window.setTitle("@empty");

    let body=new Table();
    
    let statusBar=new Table();

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