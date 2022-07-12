module.exports=(MainWindow,childs,Manager)=>{
    let t=new Table();
    let str=
    "AimClient "+Manager.version+"-"+Manager.versionType+"\n"
    + "[yellow]Test only / 仅供测试[]\n"
    + "Don't share it with anyone! / 不要分享给任何人!"
    t.add(str);
    childs.about={
        name:"@about",
        icon:Core.atlas.drawable("aimclient-info"),
        hasChild:false,
        info:t
    }
}