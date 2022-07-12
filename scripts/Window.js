let Manager = require("Manager");
let Stys = require("Styles")
function Window(){
    this.onHide=()=>{};
    this.onShow=()=>{};
    this.onFullScreen=(fullScreen)=>{};
    this.onClose=()=>{};
    this.onResize=(width,height)=>{}

    this.title = "empty";
    this.resizable = true;
    this.draggable = true;
    this.x = 0;
    this.y = 0;
    this.wx = 0;
    this.wy = 0;
    this.width = 100;
    this.height = 100;
    this.resW=0;
    this.resH=0;
    this.resizing=false;

    let showing = false;
    let fullscreen = false;
    let fromServer = false;
    let center=false;
    let added=false;
    let resb;

    let that=this;

    let table=new Table();

    that.titleBarCell=table.table(cons(titleBar=>{
        
        let resizeButton=titleBar.button(Core.atlas.drawable("aimclient-arrowUD"),Stys.di,run(()=>{})).size(32,32);
        let lastX=0;
        let lastY=0;
        resizeButton.get().addListener(extend(InputListener,{
            touchDown(event,x,y,pointer,button){
                lastX=x;
                lastY=y;
                return true;
            },
            touchDragged(event,x,y,pointer){
                that._resizeDsp(lastX,y,lastX,lastY,false);
            },
            touchUp(event,x,y,pointer,button){
                that._resize(lastX,y,lastX,lastY,false);
            }
        }));
        resizeButton.get().visibility=boolp(()=>this.resizable);
        resizeButton.get().resizeImage(16)
        that.titleTextBar=titleBar.pane(cons(titleTextBar=>{
            let fromServerIcon=titleTextBar.image(Core.atlas.drawable("aimclient-fromServer")).size(16,16);
            fromServerIcon.get().visibility=boolp(()=>fromServer);
            titleTextBar.label(prov(()=>(Manager.activeWindow!=that?"[gray]":"")+(that.title.startsWith("@")?Core.bundle.get(that.title.substring(1)):that.title))).fillX();
        }));
        //that.titleTextBar.get().setBackground(Stys.button)
        that.titleTextBar.get().addListener(extend(InputListener,{
            touchDown:function(event, x, y, pointer, button){
                lastX = x;
                lastY = y;
                return true;
            },
            touchDragged:function(event, x, y, pointer){
                if(that.draggable&&!fullscreen){
                    center=false
                    let v=table.localToStageCoordinates(Tmp.v1.set(x, y));
                    that.x = -lastX + v.x;
                    that.y = -lastY + v.y;
                    that.x=that.x;
                    that.y=that.y;
                }
                return true;
            }
        }));
        resizeButton=titleBar.button(Core.atlas.drawable("aimclient-resize"),Stys.di,run(()=>{})).size(32,32);
        resizeButton.get().addListener(extend(InputListener,{
            touchDown(event,x,y,pointer,button){
                lastX=x;
                lastY=y;
                return true;
            },
            touchDragged(event,x,y,pointer){
                that._resizeDsp(x,y,lastX,lastY,false);
            },
            touchUp(event,x,y,pointer,button){
                that._resize(x,y,lastX,lastY,false);
            }
        }));
        resizeButton.get().visibility=boolp(()=>this.resizable);
        resizeButton.get().resizeImage(16)
        let minimizeButton=titleBar.button(Core.atlas.drawable("aimclient-hide"),Stys.di,run(()=>{
            that.hide();
        })).size(32,32);
        minimizeButton.get().resizeImage(16);
        let maximizeButton=titleBar.button(Core.atlas.drawable("aimclient-fullScreen"),Stys.di,run(()=>{
            that.fullscreen();
        })).size(32,32);
        maximizeButton.get().resizeImage(16)
        that.fullscreen=function(){
            if(fullscreen){
                fullscreen=false;
                center=false;
                that.resizeDsp(that.width,that.height);
                that.flush();
                table.setOrigin(Align.bottomLeft)
                table.setPosition(that.x,that.y);
                maximizeButton.get().replaceImage(new Image(Core.atlas.drawable("aimclient-fullScreen")));
                Manager.maximizeWindows.splice(Manager.maximizeWindows.indexOf(that),1);
            }else{
                fullscreen=true;
                that.resizeDsp(Manager.widthX(),Manager.heightX()-64);
                that.onResize(Manager.widthX(),Manager.heightX()-64);
                center=true;
                table.setOrigin(Align.center)
                table.setPosition(Math.round((Manager.width()-table.getWidth())/2),Math.round((Manager.height()-table.getHeight())/2));
                maximizeButton.get().replaceImage(new Image(Core.atlas.drawable("aimclient-consume")));
                Manager.maximizeWindows.push(that);
            }
            that.onFullScreen(fullscreen);
        }
        maximizeButton.get().setDisabled(boolp(()=>!that.resizable));
        let closeButton=titleBar.button(Core.atlas.drawable("aimclient-close"),Stys.di,run(()=>{
            that.close();
        })).size(32,32);
        closeButton.get().resizeImage(16)
    }));
    this.titleBarCell.get().setBackground(Stys.button);
    table.row();

    let bodyContainer=new Table();
    that.bodyCell=table.table(cons(body=>{
        body.add(bodyContainer);
    }));
    this.bodyCell.get().setBackground(Stys.button);
    table.row();

    let statusBarContainer=new Table();
    that.statusBarCell=table.table(cons(statusBar=>{
        that.statusBarContainerCell=statusBar.table(cons(statB=>{
            statB.add(statusBarContainer);
        }))
        // let resizeButton=statusBar.button(Core.atlas.drawable("aimclient-resize"),run(()=>{}));
        // let lastX=0;
        // let lastY=0;
        // resizeButton.get().addListener(extend(InputListener,{
        //     touchDown(event,x,y,pointer,button){
        //         lastX=x;
        //         lastY=y;
        //         return true;
        //     },
        //     touchDragged(event,x,y,pointer){
        //         that._resizeDsp(x,y,lastX,lastY,true);
        //     },
        //     touchUp(event,x,y,pointer,button){
        //         that._resize(x,y,lastX,lastY,true);
        //     }
        // }));=titleB
        // resizeButton.get().visibility=boolp(()=>this.resizable);
        let resizeButton=statusBar.button(Core.atlas.drawable("aimclient-arrowLR"),Stys.di,run(()=>{})).size(32,32);
        resizeButton.get().resizeImage(16)
        let lastX=0;
        let lastY=0;
        resizeButton.get().addListener(extend(InputListener,{
            touchDown(event,x,y,pointer,button){
                lastX=x;
                lastY=y;
                return true;
            },
            touchDragged(event,x,y,pointer){
                if(!that.resizable) return;
                that._resizeDsp(x,lastY,lastX,lastY,false);
            },
            touchUp(event,x,y,pointer,button){
                if(!that.resizable) return;
                that._resize(x,lastY,lastX,lastY,false);
            }
        }));
        resb=resizeButton
    }));
    this.statusBarCell.get().setBackground(Stys.button);


    this.setBody=function(body){
        bodyContainer.clear();
        this.body=body;
        bodyContainer.add(body);
    }

    this.setStatusBar=function(statusBar){
        statusBarContainer.clear();
        this.statusBar=statusBar;
        statusBarContainer.add(statusBar);
    }

    this.hide=function(){
        if(showing){
            showing=false;
            table.visible=false;
            that.onHide();
            Manager.events.fire("windowHide",this)
            if(Manager.maximizeWindows.indexOf(that)!=-1){
                Manager.maximizeWindows.splice(Manager.maximizeWindows.indexOf(that),1);
            }
        }
    }

    this.show=function(){
        if(!added){
            Manager.addWindow(that);
            Core.scene.add(table);
            added=true;
            Manager.events.fire("windowAdd",this)
        }
        if(!showing){
            showing=true;
            table.visible=true;
            that.onShow();
            Manager.events.fire("windowShow",this)
            if(fullscreen){
                Manager.maximizeWindows.push(that);
            }
        }
    }

    this.isShowing=()=>showing;

    this.close=function(){
        this.hide();
        table.remove();
        Manager.removeWindow(that);
        this.onClose();
        Manager.events.fire("windowClose",this)
    }

    this.setTitle=function(title){
        this.title=title;
        Manager.events.fire("windowTitleChange",this)
    }

    this.setResizable=function(res){
        this.resizable=res;
        resb.get().setDisabled(!res)
    }

    this.setDraggable=function(drag){
        that.draggable=drag;
    }

    this.setFromServer=function(from){
        fromServer=from;
    }

    this.center=function(){
        center=true;
        table.setOrigin(Align.center);
        table.setPosition(Math.floor((Manager.width()-table.getWidth())/2),Math.floor((Manager.height()-table.getHeight())/2));
    }

    this.isCenter=()=>center;

    this.setPosition=function(x,y){
        table.setPosition(x,y);
        that.x=x;
        that.y=y;
    }

    this.resize=function(width,height){
        that.width=width;
        that.height=height;
        this.resizeDsp(width,height);
    }

    this.resizeDsp=function(width,height){
        table.setSize(width,height+64);
        this.titleBarCell.size(width,32);
        this.titleTextBar.size(width-32*(4+(that.resizable?1:0)),32);
        this.bodyCell.size(width,height);
        this.statusBarCell.size(width,32);
        this.statusBarContainerCell.size(width-32,32);
        this.onResize(width,height);
        if(this.body) this.body.updateVisibility();
        if(this.statusBar) this.statusBar.updateVisibility();
    }

    this._gs=function(startX,startY,x,y,bottomRight){
        let width;
        let height;
        let wx=0;
        let wy=0;
        /**
         * topLeft:
         *     left,top:add
         *     right,bottom:sub
         * bottomRight:
         *     left,top:sub
         *     right,bottom:add
         */
        if(bottomRight){
            width=(x-startX)*1.2;
            height=startY-y;
            // wx=-width/2;
            wy=height/2;
        }else{
            width=x-startX;
            height=y-startY;
            // wx=-(width/2);
            // wy=-(height);
        }
        // width*=2;
        // height*=2;
        width+=that.width;
        height+=that.height;
        return [Math.max(width,96),Math.max(height,64),wx,wy]
    }

    let a=0;

    this._resizeDsp=function(x,y,startX,startY,bottomRight){
        if(fullscreen) return;
        a++;
        if(a<20) return;
        let wh=this._gs(startX,startY,x,y,bottomRight);
        // table.setPosition(that.x+wh[2],that.y+wh[3]);
        this.wx=wh[2];
        this.wy=wh[3];
        this.resW=wh[0];
        this.resH=wh[1];
        this.resizing=true;
    }

    this._resize=function(x,y,startX,startY,bottomRight){
        if(fullscreen) return;
        let wh=this._gs(startX,startY,x,y,bottomRight);
        // table.setPosition(that.x+wh[2],that.y+wh[3]);
        // that.x+=wh[2];
        // that.y+=wh[3];
        that.x+=wh[2];
        that.y+=wh[3];
        this.wx=0;
        this.wy=0;
        this.resize(wh[0],wh[1]);
        this.resizing=false;
    }
    this.isFullScreen=()=>fullscreen

    this.flush=()=>{
        if(fullscreen){
            this.resizeDsp(Manager.widthX(),Manager.heightX()-64);
        }else{
            this.resizeDsp(that.width,that.height);
        }
    }

    this.getW=()=>fullscreen?Manager.widthX():that.width
    this.getH=()=>fullscreen?Manager.heightX()-64:that.height



    
    table.addListener(extend(InputListener,{
        touchDown:function(event, x, y, pointer, button){
            Manager.activeWindow=that;
            table.toFront();
            return true;
        }
    }))
    let lw=0;
    let lh=0;
    table.update(run(()=>{
        if(this.resizing) return;
        if(fullscreen) return;
        if(center) return;
        let cx=that.x<0?0:that.x>Manager.width()*.8?Manager.width()-that.table.getWidth():that.x;
        let cy=that.y<0?0:that.y>Manager.height()-100?Manager.height()-that.table.getHeight():that.y;
        table.setPosition(Math.floor(cx+that.wx),Math.floor(cy+that.wy));
        if(this.resizing){
            // this.resizeDsp(this.resW,this.resH);
        }else if(lw!=that.width||lh!=that.height){
            table.setOrigin(Align.bottomLeft)
            this.resizeDsp(that.width,that.height);
            lw=that.width;
            lh=that.height;
        }
    }))

    //table.setBackground(Styles.black3);

    this.toFront=function(){
        table.toFront();
    }

    this.draw=(isActive)=>{}

    this.draws={
        worldSelectorPoints:[
            // {
            //     A:{
            //         x:0,y:0
            //     },
            //     B:{
            //         x:0,y:0
            //     },
            //     enabled:false
            // },
            // {
            //     C:{
            //         x:0,y:0
            //     },
            //     D:{
            //         x:0,y:0
            //     },
            //     enabled:false
            // },
            // {
            //     E:{
            //         x:0,y:0
            //     },
            //     F:{
            //         x:0,y:0
            //     },
            //     enabled:false
            // }
        ]
    }

    this.table=table;

    this.setSize=this.resize;

}
module.exports=Window;