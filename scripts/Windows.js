const Stys = require("Styles")
module.exports=(MainWindow,childs,Manager)=>{
    //maxW=300
    let info=new Table();

    info.pane(cons(t=>{
        let wlist=[];
        Manager.events.on("windowAdd",(window)=>{
            let tabl=new Table();
            let title=tabl.button(window.title,Stys.dt,run(()=>{
                window.toFront();
            })).size(230-24*2,24).get()
            let minButton=tabl.button(Core.atlas.drawable("aimclient-hide"),Stys.di,run(()=>{
                if(window.isShowing()){
                    window.hide();
                }else{
                    window.show();
                }
            })).size(24,24).get();
            minButton.resizeImage(16);
            tabl.button(Core.atlas.drawable("aimclient-close"),Stys.di,run(()=>{
                window.close();
            })).size(24,24).get().resizeImage(16);
            t.add(tabl).size(250,24).row();
            //tabl.setBackground(Tex.button)

            wlist.push({window:window,table:tabl,minButton:minButton,title:title});
        });
        Manager.events.on("windowClose",(window)=>{
            let ind=wlist.map(x=>x.window).indexOf(window);
            if(ind!=-1){
                let w=wlist[ind];
                wlist.splice(ind,1);
                t.clear();
                for(let w of wlist){
                    let window=w.window;
                    let tabl=new Table();
                    w.title=tabl.button(window.title,Stys.dt,run(()=>{
                        window.toFront();
                    })).size(230-24*2,24).get()
                    w.minButton=tabl.button(window.isShowing()?Core.atlas.drawable("aimclient-hide"):Core.atlas.drawable("aimclient-consume"),Stys.di,run(()=>{
                        if(window.isShowing()){
                            window.hide();
                        }else{
                            window.show();
                        }
                    })).size(24,24).get();
                    w.minButton.resizeImage(16);
                    tabl.button(Core.atlas.drawable("aimclient-close"),Stys.di,run(()=>{
                        window.close();
                    })).size(24,24).get().resizeImage(16);
                    t.add(tabl).size(250,24).row();
                    //tabl.setBackground(Tex.button)
                    w.table=tabl;
                }
            }
        });
        Manager.events.on("windowShow",(window)=>{
            let ind=wlist.map(x=>x.window).indexOf(window);
            if(ind!=-1){
                let w=wlist[ind];
                w.minButton.replaceImage(new Image(Core.atlas.drawable("aimclient-hide")));
            }
        });
        Manager.events.on("windowHide",(window)=>{
            let ind=wlist.map(x=>x.window).indexOf(window);
            if(ind!=-1){
                let w=wlist[ind];
                w.minButton.replaceImage(new Image(Core.atlas.drawable("aimclient-consume")));
            }
        });
        Manager.events.on("windowTitleChange",(window)=>{
            let ind=wlist.map(x=>x.window).indexOf(window);
            if(ind!=-1){
                let w=wlist[ind];
                w.title.setText(window.title);
            }
        })
    })).grow();

    childs.windows={
        name:"@windows",
        icon:Core.atlas.drawable("aimclient-windows"),
        hasChild:false,
        info:info,
    }
}