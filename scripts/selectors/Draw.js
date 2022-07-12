const Manager = require("Manager");

//[#ffee44]A[#44eeff]B [#44ff44]C[#44aaff]D [#ff66ff]E[#ff6666]F
let obj={
    icons:{
        A:{
            icon:Core.atlas.find("aimclient-A"),
            disabledIcon:Core.atlas.find("aimclient-disabledA")
        },
        B:{
            icon:Core.atlas.find("aimclient-B"),
            disabledIcon:Core.atlas.find("aimclient-disabledB")
        },
        C:{
            icon:Core.atlas.find("aimclient-C"),
            disabledIcon:Core.atlas.find("aimclient-disabledC")
        },
        D:{
            icon:Core.atlas.find("aimclient-D"),
            disabledIcon:Core.atlas.find("aimclient-disabledD")
        },
        E:{
            icon:Core.atlas.find("aimclient-E"),
            disabledIcon:Core.atlas.find("aimclient-disabledE")
        },
        F:{
            icon:Core.atlas.find("aimclient-F"),
            disabledIcon:Core.atlas.find("aimclient-disabledF")
        },
        rect:Core.atlas.find("aimclient-rect"),
        disabledRect:Core.atlas.find("aimclient-disabledRect"),
    },
    init(){
        this.icons.A.icon=Core.atlas.find("aimclient-A")
        this.icons.B.icon=Core.atlas.find("aimclient-B")
        this.icons.C.icon=Core.atlas.find("aimclient-C")
        this.icons.D.icon=Core.atlas.find("aimclient-D")
        this.icons.E.icon=Core.atlas.find("aimclient-E")
        this.icons.F.icon=Core.atlas.find("aimclient-F")
        this.icons.A.disabledIcon=Core.atlas.find("aimclient-disabledA")
        this.icons.B.disabledIcon=Core.atlas.find("aimclient-disabledB")
        this.icons.C.disabledIcon=Core.atlas.find("aimclient-disabledC")
        this.icons.D.disabledIcon=Core.atlas.find("aimclient-disabledD")
        this.icons.E.disabledIcon=Core.atlas.find("aimclient-disabledE")
        this.icons.F.disabledIcon=Core.atlas.find("aimclient-disabledF")
        this.icons.rect=Core.atlas.find("aimclient-rect")
        this.icons.disabledRect=Core.atlas.find("aimclient-disabledRect")
    }
}
let icons=obj.icons;

function drawFor(window,isActive){
    window.draw(isActive)

    let draws=window.draws;

    for(let p of draws.worldSelectorPoints){
        let e=p.enabled;
        if(typeof e=="function") e=e();
        if(!e) continue;
        let ps=[];
        let pns=[]
        for(let n in p){
            ps.push(p[n]);
            pns.push(n);
        }
        let p1=ps[0];
        let p1n=pns[0];
        let p2=ps[1];
        let p2n=pns[1];
        let p1x=p1.x;
        let p1y=p1.y;
        let p2x=p2.x;
        let p2y=p2.y;
        if(typeof p1x=="function") p1x=p1x();
        if(typeof p1y=="function") p1y=p1y();
        if(typeof p2x=="function") p2x=p2x();
        if(typeof p2y=="function") p2y=p2y();
        let minX=Math.min(p1x,p2x);
        let minY=Math.min(p1y,p2y);
        let maxX=Math.max(p1x,p2x)+8;
        let maxY=Math.max(p1y,p2y)+8;
        let w=maxX-minX;
        let h=maxY-minY;
        minX-=4
        minY-=4
        maxX-=4
        maxY-=4

        let iconP1=icons[p1n].icon;
        let iconP2=icons[p2n].icon;
        let disabledIconP1=icons[p1n].disabledIcon;
        let disabledIconP2=icons[p2n].disabledIcon;

        Draw.rect(isActive?iconP1:disabledIconP1,p1x,p1y,8,8)
        Draw.rect(isActive?iconP2:disabledIconP2,p2x,p2y,8,8)
        let rect=isActive?icons.rect:icons.disabledRect;
        Draw.rect(rect,minX+w/2,minY,w,1)
        Draw.rect(rect,minX,minY+h/2,1,h)
        Draw.rect(rect,minX+w,minY+h/2,1,h)
        Draw.rect(rect,minX+w/2,minY+h,w,1)
    }
}

Events.run(Trigger.draw,()=>{
    Manager.windows.forEach((window)=>{
        if(window==Manager.activeWindow) return;
        drawFor(window,false);
    })
    if(Manager.activeWindow) drawFor(Manager.activeWindow,true);
})
module.exports=obj;