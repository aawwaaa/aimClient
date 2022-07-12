const Window = require("Window");
const Manager = require("Manager");
const MapSelector = require("selectors/MapSelector")

module.exports=(type,data)=>{

    let window=new Window();
    window.setTitle("TestWindow");

    let body=new Table();

    body.button("MapSelector",run(()=>{
        new MapSelector(window,{})
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