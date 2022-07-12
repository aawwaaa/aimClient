module.exports={
    create(type,length){
        return java.lang.reflect.Array.newInstance(type,length);
    },
    copy(src,dst,target,dst1,len){
        print(src+" "+dst+" "+target+" "+dst1+" "+len);
        java.lang.System.arraycopy(src,dst,target,dst1,len);
    }
}