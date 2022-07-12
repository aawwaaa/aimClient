var ACP={
    name:"...",
    author:"...",
    desc:"...",
    version:"...",
    mainFilePath:"...",
    bundleDir:"...",
    GUID:"...",
    tags:[],            //boolean[]
    lastAccessTime:0,
    files:{},           //{fileName:File/Object}
}

module.exports={
    /**
     * 
     * @param {ACP} plugin 
     * @returns {byte[]}
     */
    pack(plugin){

        let stream=new java.io.ByteArrayOutputStream();

        let writes=new Writes(new java.io.DataOutputStream(stream));

        writes.str(plugin.name)
        writes.str(plugin.author)
        writes.str(plugin.desc)
        writes.str(plugin.version)
        writes.str(plugin.mainFilePath)
        writes.str(plugin.bundleDir)
        writes.str(plugin.GUID)
        writes.i(plugin.tags.length)
        for(let d of plugin.tags){
            writes.bool(d?true:false)
        }
        writes.l(Date.now())
        let i=0;
        let wf=(obj,father)=>{
            for(let name in obj){
                writes.bool(true)
                writes.str(name)
                writes.i(i)
                writes.i(father)
                let file=obj[name];
                if(file.length==undefined){
                    writes.bool(false)
                    wf(file,i++)
                }else{
                    writes.bool(true)
                    writes.i(file.length)
                    writes.b(file)
                    i++
                }
            }
        }
        wf(plugin.files,-1)
        writes.bool(false)


        return stream.toByteArray();
    },
    /**
     * 
     * @param {byte[]} data 
     * @returns {ACP}
     */
    unpack(data){
        let ACP={
            name:"...",
            author:"...",
            desc:"...",
            version:"...",
            mainFilePath:"...",
            bundleDir:"...",
            GUID:"...",
            tags:[],            //boolean[]
            lastAccessTime:0,
            files:{},           //{fileName:File/Object}
        }

        let reads=new Reads(new java.io.DataInputStream(new java.io.ByteArrayInputStream(data)));

        ACP.name=reads.str()
        ACP.author=reads.str()
        ACP.desc=reads.str()
        ACP.version=reads.str()
        ACP.mainFilePath=reads.str()
        ACP.bundleDir=reads.str()
        ACP.GUID=reads.str()
        let len=reads.i()
        for(let i=0;i<len;i++){
            ACP.tags.push(reads.bool())
        }
        ACP.lastAccessTime=reads.l()

        let idF={}
        idF[-1]={}
        let idN={}
        let inDir={}

        while(reads.bool()){
            let name=reads.str()
            let id=reads.i()
            let father=reads.i()
            idN[id]=name
            if(!reads.bool()){
                idF[father][name]={}
                idF[id]=idF[father][name]
                inDir[id]=father!=-1
            }else{
                let len=reads.i()
                let arr=java.lang.reflect.Array.newInstance(java.lang.Byte.TYPE,len)
                let file=reads.b(arr)
                idF[father][name]=file
                idF[id]=file
                inDir[id]=father!=-1
            }
        }

        for(let id in inDir){
            let root=!inDir[id]
            let file=idF[id]
            let name=idN[id]

            if(root){
                ACP.files[name]=file
            }
        }

        return ACP;
    }
}