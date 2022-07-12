let obj={
    get:function(f){
        if(f in this)return this[f];
        return this.file;
    },
    init(){
        let obj=this;
        obj.dir=Core.atlas.drawable("aimclient-files")
        obj.file=Core.atlas.drawable("aimclient-file")
        obj[".js"]=Core.atlas.drawable("aimclient-jsFile")
        obj[".json"]=Core.atlas.drawable("aimclient-jsonFile")
    }
}

module.exports=obj;