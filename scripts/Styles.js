let f0=new java.lang.Float(0)
let rect=Core.atlas.drawable("aimclient-r")

let drawable=function(draw,w,h){
    return new Drawable(){
        draw(x,y,w,h,a,b,c,d,e){
            let ox=x,oy=y,sx=1,sy=1,r=0
            if(e!=undefined){
                x=x
                y=y
                ox=w
                oy=h
                w=a
                h=b
                sx=c
                sy=d
                r=e
            }
            draw(x+1,y+1,ox,oy,w,h,sx,sy,r)
            Draw.reset()
        },
        getBottomHeight(){return w?w:f0},
        getTopHeight(){return w?w:f0},
        getLeftWidth(){return h?h:f0},
        getRightWidth(){return h?h:f0},
        getMinHeight(){return w?w:f0},
        getMinWidth(){return h?h:f0},
        imageSize(){return f0},
        setBottomHeight(h){},
        setLeftHeight(h){},
        setRightHeight(h){},
        setTopHeight(h){},
        setMinHeight(h){}
    }
}
let emptyDrawable=drawable(function(x,y,ox,oy,w,h,sx,sy,r){

})
let buttonDisabledDrawable=drawable(function(x,y,ox,oy,w,h,sx,sy,r){
    Draw.color(Color.gray)
    Lines.stroke(Scl.scl(2))
    Lines.line(x,y,x+w-2,y)
    Lines.line(x,y,x,y+h-2)
    Lines.line(x+w-2,y,x+w-2,y+h-2)
    Lines.line(x,y+h-2,x+w-2,y+h-2)
    Draw.color(Color.gray)
    Draw.alpha(0.8)
    Draw.rect(rect,x+(w-2)/2,y+(h-2)/2,w-2,h-2)
    Draw.reset()
})
let buttonCheckedDrawable=drawable(function(x,y,ox,oy,w,h,sx,sy,r){
    Draw.color(module.exports.themeColor)
    Lines.stroke(Scl.scl(2))
    Lines.line(x,y,x+w-2,y)
    Lines.line(x,y,x,y+h-2)
    Lines.line(x+w-2,y,x+w-2,y+h-2)
    Lines.line(x,y+h-2,x+w-2,y+h-2)
    // Draw.color(Color.black)
    // Draw.alpha(0.2)
    // Draw.rect(rect,x+(w-2)/2,y+(h-2)/2,w-2,h-2)
    Draw.reset()
})
let buttonUpDrawable=drawable(function(x,y,ox,oy,w,h,sx,sy,r){
    Draw.color(Color.lightGray)
    Lines.stroke(Scl.scl(2))
    Lines.line(x,y,x+w-2,y)
    Lines.line(x,y,x,y+h-2)
    Lines.line(x+w-2,y,x+w-2,y+h-2)
    Lines.line(x,y+h-2,x+w-2,y+h-2)
    // Draw.color(Color.black)
    // Draw.alpha(0.2)
    // Draw.rect(rect,x+(w-2)/2,y+(h-2)/2,w-2,h-2)
    Draw.reset()
})
let buttonDownDrawable=drawable(function(x,y,ox,oy,w,h,sx,sy,r){
    Draw.color(Color.darkGray)
    Lines.stroke(Scl.scl(2))
    Lines.line(x,y,x+w-2,y)
    Lines.line(x,y,x,y+h-2)
    Lines.line(x+w-2,y,x+w-2,y+h-2)
    Lines.line(x,y+h-2,x+w-2,y+h-2)
    // Draw.color(Color.black)
    // Draw.alpha(0.2)
    // Draw.rect(rect,x+(w-2)/2,y+(h-2)/2,w-2,h-2)
    Draw.reset()
})
let buttonTexDrawable=drawable(function(x,y,ox,oy,w,h,sx,sy,r){
    Draw.color(Color.lightGray)
    Lines.stroke(Scl.scl(2))
    Lines.line(x,y,x+w-2,y)
    Lines.line(x,y,x,y+h-2)
    Lines.line(x+w-2,y,x+w-2,y+h-2)
    Lines.line(x,y+h-2,x+w-2,y+h-2)
    Draw.color(Color.black)
    Draw.alpha(0.8)
    Draw.rect(rect,x+(w-2)/2,y+(h-2)/2,w-2,h-2)
    Draw.reset()
})

let textFieldBackgroundDrawable=drawable(function(x,y,ox,oy,w,h,sx,sy,r){
    Draw.color(Color.lightGray)
    Lines.stroke(Scl.scl(2))
    Lines.line(x,y,x+w-2,y)
    Lines.line(x,y,x,y+6)
    Lines.line(x+w-2,y,x+w-2,y+6)
})
let textFieldDisabledBackgroundDrawable=drawable(function(x,y,ox,oy,w,h,sx,sy,r){
    Draw.color(Color.darkGray)
    Lines.stroke(Scl.scl(2))
    Lines.line(x,y,x+w-2,y)
    Lines.line(x,y,x,y+6)
    Lines.line(x+w-2,y,x+w-2,y+6)
})
let textFieldFocusedBackgroundDrawable=drawable(function(x,y,ox,oy,w,h,sx,sy,r){
    Draw.color(module.exports.themeColor)
    Lines.stroke(Scl.scl(2))
    Lines.line(x,y,x+w-2,y)
    Lines.line(x,y,x,y+6)
    Lines.line(x+w-2,y,x+w-2,y+6)
})
let textFieldInvalidBackgroundDrawable=drawable(function(x,y,ox,oy,w,h,sx,sy,r){
    Draw.color(Color.red)
    Lines.stroke(Scl.scl(2))
    Lines.line(x,y,x+w-2,y)
    Lines.line(x,y,x,y+6)
    Lines.line(x+w-2,y,x+w-2,y+6)
})
let textFieldCursorDrawable=drawable(function(x,y,ox,oy,w,h,sx,sy,r){
    Draw.color(Color.lightGray)
    Lines.stroke(Scl.scl(2))
    Lines.line(x,y,x,y+14)
},1,28)
let textFieldSelectionDrawable=drawable(function(x,y,ox,oy,w,h,sx,sy,r){
    Draw.color(module.exports.themeColor)
    Draw.alpha(0.8)
    Draw.rect(rect,x+w/2,y+h/2,w,h)
})

let textAreaBackgroundDrawable=drawable(function(x,y,ox,oy,w,h,sx,sy,r){
    Draw.color(Color.lightGray)
    Lines.stroke(Scl.scl(2))
    Lines.line(x,y,x+w-2,y)
    Lines.line(x,y,x,y+6)
    Lines.line(x+w-2,y,x+w-2,y+6)
    Lines.line(x,y+h-2,x,y+h-8)
    Lines.line(x+w-2,y+h-2,x+w-2,y+h-8)
    Lines.line(x,y+h-2,x+w-2,y+h-2)
})
let textAreaDisabledBackgroundDrawable=drawable(function(x,y,ox,oy,w,h,sx,sy,r){
    Draw.color(Color.darkGray)
    Lines.stroke(Scl.scl(2))
    Lines.line(x,y,x+w-2,y)
    Lines.line(x,y,x,y+6)
    Lines.line(x+w-2,y,x+w-2,y+6)
    Lines.line(x,y+h-2,x,y+h-8)
    Lines.line(x+w-2,y+h-2,x+w-2,y+h-8)
    Lines.line(x,y+h-2,x+w-2,y+h-2)
})
let textAreaFocusedBackgroundDrawable=drawable(function(x,y,ox,oy,w,h,sx,sy,r){
    Draw.color(module.exports.themeColor)
    Lines.stroke(Scl.scl(2))
    Lines.line(x,y,x+w-2,y)
    Lines.line(x,y,x,y+6)
    Lines.line(x+w-2,y,x+w-2,y+6)
    Lines.line(x,y+h-2,x,y+h-8)
    Lines.line(x+w-2,y+h-2,x+w-2,y+h-8)
    Lines.line(x,y+h-2,x+w-2,y+h-2)
})
let textAreaInvalidBackgroundDrawable=drawable(function(x,y,ox,oy,w,h,sx,sy,r){
    Draw.color(Color.red)
    Lines.stroke(Scl.scl(2))
    Lines.line(x,y,x+w-2,y)
    Lines.line(x,y,x,y+6)
    Lines.line(x+w-2,y,x+w-2,y+6)
    Lines.line(x,y+h-2,x,y+h-8)
    Lines.line(x+w-2,y+h-2,x+w-2,y+h-8)
    Lines.line(x,y+h-2,x+w-2,y+h-2)
})

let checkBoxOffDrawable=drawable(function(x,y,ox,oy,w,h,sx,sy,r){
    Draw.color(Color.lightGray)
    Lines.stroke(Scl.scl(2))
    Lines.line(x,y,x+w-2,y)
    Lines.line(x,y,x,y+h-2)
    Lines.line(x+w-2,y,x+w-2,y+h-2)
    Lines.line(x,y+h-2,x+w-2,y+h-2)

    
},32,32)
let checkBoxOffDisabledDrawable=drawable(function(x,y,ox,oy,w,h,sx,sy,r){
    Draw.color(Color.darkGray)
    Lines.stroke(Scl.scl(2))
    Lines.line(x,y,x+w-2,y)
    Lines.line(x,y,x,y+h-2)
    Lines.line(x+w-2,y,x+w-2,y+h-2)
    Lines.line(x,y+h-2,x+w-2,y+h-2)

    
},32,32)

let checkBoxOnDrawable=drawable(function(x,y,ox,oy,w,h,sx,sy,r){
    Draw.color(Color.lightGray)
    Lines.stroke(Scl.scl(2))
    Lines.line(x,y,x+w-2,y)
    Lines.line(x,y,x,y+h-2)
    Lines.line(x+w-2,y,x+w-2,y+h-2)
    Lines.line(x,y+h-2,x+w-2,y+h-2)
    Draw.rect(rect,x+(w-2)/2,y+(h-2)/2,w-8,h-8)
},32,32)
let checkBoxOnDisabledDrawable=drawable(function(x,y,ox,oy,w,h,sx,sy,r){
    Draw.color(Color.darkGray)
    Lines.stroke(Scl.scl(2))
    Lines.line(x,y,x+w-2,y)
    Lines.line(x,y,x,y+h-2)
    Lines.line(x+w-2,y,x+w-2,y+h-2)
    Lines.line(x,y+h-2,x+w-2,y+h-2)
    Draw.rect(rect,x+(w-2)/2,y+(h-2)/2,w-8,h-8)
},32,32)

let checkBoxOnOverDrawable=drawable(function(x,y,ox,oy,w,h,sx,sy,r){
    Draw.color(module.exports.themeColor)
    Lines.stroke(Scl.scl(2))
    Lines.line(x,y,x+w-2,y)
    Lines.line(x,y,x,y+h-2)
    Lines.line(x+w-2,y,x+w-2,y+h-2)
    Lines.line(x,y+h-2,x+w-2,y+h-2)
    Draw.rect(rect,x+(w-2)/2,y+(h-2)/2,w-8,h-8)
},32,32)
let checkBoxOverDrawable=drawable(function(x,y,ox,oy,w,h,sx,sy,r){
    Draw.color(module.exports.themeColor)
    Lines.stroke(Scl.scl(2))
    Lines.line(x,y,x+w-2,y)
    Lines.line(x,y,x,y+h-2)
    Lines.line(x+w-2,y,x+w-2,y+h-2)
    Lines.line(x,y+h-2,x+w-2,y+h-2)

    
},32,32)

let sliderBackgroundDrawable=drawable(function(x,y,ox,oy,w,h,sx,sy,r){
    Draw.color(Color.lightGray)
    Lines.stroke(Scl.scl(2))
    Lines.line(x,y+(h-2)/2,x+w-2,y+(h-2)/2)
})
let sliderBackgroundDisabledDrawable=drawable(function(x,y,ox,oy,w,h,sx,sy,r){
    Draw.color(Color.darkGray)
    Lines.stroke(Scl.scl(2))
    Lines.line(x,y+(h-2)/2,x+w-2,y+(h-2)/2)
})
let sliderKnobDrawable=new Drawable(){
    draw(x,y,w,h,a,b,c,d,e){
        let ox=x,oy=y,sx=1,sy=1,r=0
        if(e!=undefined){
            x=x
            y=y
            ox=w
            oy=h
            w=a
            h=b
            sx=c
            sy=d
            r=e
        }
        Draw.color(Color.lightGray)
        Lines.stroke(Scl.scl(2))
        Lines.line(x,y,x+w-2,y)
        Lines.line(x,y+h-2,x+w-2,y+h-2)
        Lines.line(x+(w-2)/2,y,x+(w-2)/2,y+h-2)
        Draw.reset()
    },
    getBottomHeight(){return 6},
    getTopHeight(){return 6},
    getLeftWidth(){return 32},
    getRightWidth(){return 32},
    getMinHeight(){return 32},
    getMinWidth(){return 6},
    imageSize(){return f0},
    setBottomHeight(h){},
    setLeftHeight(h){},
    setRightHeight(h){},
    setTopHeight(h){},
    setMinHeight(h){}
}
let sliderDisabledKnobDrawable=new Drawable(){
    draw(x,y,w,h,a,b,c,d,e){
        let ox=x,oy=y,sx=1,sy=1,r=0
        if(e!=undefined){
            x=x
            y=y
            ox=w
            oy=h
            w=a
            h=b
            sx=c
            sy=d
            r=e
        }
        Draw.color(Color.lightGray)
        Lines.stroke(Scl.scl(2))
        Lines.line(x,y,x+w-2,y)
        Lines.line(x,y+h-2,x+w-2,y+h-2)
        Lines.line(x+(w-2)/2,y,x+(w-2)/2,y+h-2)
        Draw.reset()
    },
    getBottomHeight(){return 6},
    getTopHeight(){return 6},
    getLeftWidth(){return 32},
    getRightWidth(){return 32},
    getMinHeight(){return 32},
    getMinWidth(){return 6},
    imageSize(){return f0},
    setBottomHeight(h){},
    setLeftHeight(h){},
    setRightHeight(h){},
    setTopHeight(h){},
    setMinHeight(h){}
}
let sliderKnobOverDrawable=new Drawable(){
    draw(x,y,w,h,a,b,c,d,e){
        let ox=x,oy=y,sx=1,sy=1,r=0
        if(e!=undefined){
            x=x
            y=y
            ox=w
            oy=h
            w=a
            h=b
            sx=c
            sy=d
            r=e
        }
        Draw.color(module.exports.themeColor)
        Lines.stroke(Scl.scl(2))
        Lines.line(x,y,x+w-2,y)
        Lines.line(x,y+h-2,x+w-2,y+h-2)
        Lines.line(x+(w-2)/2,y,x+(w-2)/2,y+h-2)
        Draw.reset()
    },
    getBottomHeight(){return 6},
    getTopHeight(){return 6},
    getLeftWidth(){return 32},
    getRightWidth(){return 32},
    getMinHeight(){return 32},
    getMinWidth(){return 6},
    imageSize(){return f0},
    setBottomHeight(h){},
    setLeftHeight(h){},
    setRightHeight(h){},
    setTopHeight(h){},
    setMinHeight(h){}
}

let sliderKnobDownDrawable=new Drawable(){
    draw(x,y,w,h,a,b,c,d,e){
        let ox=x,oy=y,sx=1,sy=1,r=0
        if(e!=undefined){
            x=x
            y=y
            ox=w
            oy=h
            w=a
            h=b
            sx=c
            sy=d
            r=e
        }
        Draw.color(Color.darkGray)
        Lines.stroke(Scl.scl(2))
        Lines.line(x,y,x+w-2,y)
        Lines.line(x,y+h-2,x+w-2,y+h-2)
        Lines.line(x+(w-2)/2,y,x+(w-2)/2,y+h-2)
        Draw.reset()
    },
    getBottomHeight(){return 6},
    getTopHeight(){return 6},
    getLeftWidth(){return f0},
    getRightWidth(){return f0},
    getMinHeight(){return f0},
    getMinWidth(){return 6},
    imageSize(){return f0},
    setBottomHeight(h){},
    setLeftHeight(h){},
    setRightHeight(h){},
    setTopHeight(h){},
    setMinHeight(h){}
}

function acBar(n,c,r){
    let name=n
    let color=c
    let fraction=r
    let bar=new JavaAdapter(Bar,{
        draw(){
            if(fraction==null) return;
            let x=this.x,y=this.y,w=this.width,h=this.height
            let f=fraction instanceof Floatp?fraction.get():fraction
            let c=color instanceof Prov?color.get():color
            let n=name instanceof Prov?name.get():name
            if(isNaN(f)) f=0
            if(!isFinite(f)) f=1
            if(f<0) f=0
            if(f>1) f=1
            let mx=f*(w-2)
            Draw.color(Color.lightGray)
            Lines.stroke(Scl.scl(3))
            Lines.line(x,y,x,y+h-3)
            Lines.line(x+w-3,y,x+w-3,y+h-3)
            Draw.color(c)
            Draw.rect(rect,x+mx/2,y+(h-2)/2,mx,(h-12))

            let font=Fonts.outline;
            let lay=Pools.obtain(GlyphLayout,function(){
                let a1=arguments[0]
                let a2=arguments[1]
                let a3=arguments[2]
                let a4=arguments[3]
                let a5=arguments[4]
                let a6=arguments[5]
                let a7=arguments[6]
                let a8=arguments[7]
                let a9=arguments[8]

                switch(arguments.length){
                    case 0:
                        return new GlyphLayout()
                    case 2:
                        return new GlyphLayout(a1,a2)
                    case 6:
                        return new GlyphLayout(a1,a2,a3,a4,a5,a6)
                    case 9:
                        return new GlyphLayout(a1,a2,a3,a4,a5,a6,a7,a8,a9)
                    default:
                        print(arguments.length)
                        return new GlyphLayout()
                }
            })

            font.setColor(1,1,1,1)
            font.getCache().clear()
            font.getCache().addText(n, this.x + this.width / 3.5 - lay.width / 2, this.y + this.height / 1.5 + lay.height / 2 + 1)
            font.getCache().draw(1)

            Pools.free(lay)
        },
        reset(r){
            fraction=r
        },
        blink(c){
            color=c
            return bar
        },
        set(n,r,c){
            name=n
            fraction=r
            color=c
        }
    },n,c,r)
    return bar;
}

let exports={
    load(){
        let empty=Core.atlas.drawable("")
        rect=Core.atlas.find("aimclient-r")
        let i=new ImageButton.ImageButtonStyle(buttonUpDrawable,buttonDownDrawable,null,null,null,null)
        i.disabled=buttonDisabledDrawable
        i.over=buttonCheckedDrawable
        let t=new TextButton.TextButtonStyle(buttonUpDrawable,buttonDownDrawable,null,Fonts.def)
        t.disabled=buttonDisabledDrawable
        t.over=buttonCheckedDrawable
        let is=new ImageButton.ImageButtonStyle(buttonUpDrawable,buttonDownDrawable,buttonCheckedDrawable,null,null,null)
        is.disabled=buttonDisabledDrawable
        let ts=new TextButton.TextButtonStyle(buttonUpDrawable,buttonDownDrawable,buttonCheckedDrawable,Fonts.def)
        ts.disabled=buttonDisabledDrawable

        let tf=new TextField.TextFieldStyle()
        tf.font=Fonts.def
        tf.fontColor=Color.white
        tf.background=textFieldBackgroundDrawable
        tf.disabledBackground=textFieldDisabledBackgroundDrawable
        tf.focusedBackground=textFieldFocusedBackgroundDrawable
        tf.invalidBackground=textFieldInvalidBackgroundDrawable
        tf.cursor=textFieldCursorDrawable
        tf.selection=textFieldSelectionDrawable

        let ta=new TextField.TextFieldStyle()
        ta.font=Fonts.def
        ta.fontColor=Color.white
        ta.background=textAreaBackgroundDrawable
        ta.disabledBackground=textAreaDisabledBackgroundDrawable
        ta.focusedBackground=textAreaFocusedBackgroundDrawable
        ta.invalidBackground=textAreaInvalidBackgroundDrawable
        ta.cursor=textFieldCursorDrawable
        ta.selection=textFieldSelectionDrawable

        let cb=new CheckBox.CheckBoxStyle()
        cb.checkboxOff=checkBoxOffDrawable
        cb.checkboxOn=checkBoxOnDrawable
        cb.checkboxOver=checkBoxOverDrawable
        cb.checkboxOnOver=checkBoxOnOverDrawable
        cb.checkboxOffDisabled=checkBoxOffDisabledDrawable
        cb.checkboxOnDisabled=checkBoxOnDisabledDrawable
        cb.font=Fonts.def
        cb.fontColor=Color.white

        let sl=new Slider.SliderStyle()
        sl.background=sliderBackgroundDrawable
        sl.disabledBackground=sliderBackgroundDisabledDrawable
        sl.knob=sliderKnobDrawable
        sl.knobOver=sliderKnobOverDrawable
        sl.knobDown=sliderKnobDownDrawable
        sl.disabledKnob=sliderDisabledKnobDrawable



        
        let Manager=require("Manager")
        this.empty=emptyDrawable
        // for (let key in Manager) {
        //     print(key)
        // }
        
        Manager.styles.registerStyle("forest",{
            defaulti:i,
            defaultt:t,
            togglei:is,
            togglet:ts,

            button:buttonTexDrawable,
            buttonNoBackground:buttonUpDrawable,

            //TODO
            textField:tf,
            area:ta,
            check:cb,
            slider:sl,
            bar:acBar,

            themeColor:Color.acid
        })
        
        Manager.styles.registerStyle("aimclient",{
            defaulti:i,
            defaultt:t,
            togglei:is,
            togglet:ts,

            button:buttonTexDrawable,
            buttonNoBackground:buttonUpDrawable,

            //TODO
            textField:tf,
            area:ta,
            check:cb,
            slider:sl,
            bar:acBar,

            themeColor:Color.valueOf("55aaff")
        })

        Manager.styles.registerStyle("mindustry",{
            defaulti:Styles.defaulti,
            defaultt:Styles.defaultt,
            togglei:Styles.clearTogglei,
            togglet:Styles.togglet,

            button:Tex.button,
            buttonNoBackground:Tex.button,

            //TODO
            textField:Styles.defaultField,
            area:Styles.areaField,
            check:Styles.defaultCheck,
            slider:Styles.defaultSlider,
            bar:Bar,

            themeColor:Color.orange
        })

        Manager.plugins.loadStyles()

        Manager.styles.load()

        this.aci=i;
        this.act=t;
        this.acis=is;
        this.acts=ts;
        this.buttonChecked=buttonCheckedDrawable
        this.buttonDisabled=buttonDisabledDrawable
        this.buttonUp=buttonUpDrawable
        this.buttonDown=buttonDownDrawable
    },
    di:null,
    dt:null,
    is:null,
    ts:null,
    button:null,
    textField:null,
    area:null,
    check:null,
    slider:null,

    aci:null,
    act:null,
    acis:null,
    acts:null,
    empty:null,
    buttonChecked:null,
    buttonDisabled:null,
    buttonUp:null,
    buttonDown:null,
    
}
module.exports=exports
