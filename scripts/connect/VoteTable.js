const Stys = require("Styles")
module.exports=function(vote,w){
    /**
     * Class Vote:
     * string vote,
     * string playername,
     * int endTime,
     * int agree,
     * int disagree,
     * int id
     */
    let t=new Table();

    
    t.table(Stys.button,cons(t=>{
        t.label(prov(()=>vote.vote)).size(w,64).top().pad(3);
    })).size(w,64).row()
    t.table(Stys.button,cons(t=>{
        t.label(prov(()=>vote.playername)).size(w,32).top().pad(3);
    })).size(w,32).row()
    t.table(Stys.button,cons(t=>{
        t.table(cons(t=>{
            t.label(prov(()=>Math.ceil((vote.endTime-Date.now())/1000)+"")).size(w/3,64)
        })).size(w/3,32);
        let agreeButton=t.button(Core.atlas.drawable("aimclient-y"),Stys.di,run(()=>{
            Call.serverPacketReliable("voteAgree",vote.id+"")
            vote.voted="Y"
        })).size(w/3,32).get();
        let disagreeButton=t.button(Core.atlas.drawable("aimclient-n"),Stys.di,run(()=>{
            Call.serverPacketReliable("voteDisagree",vote.id+"")
            vote.voted="N"
        })).size(w/3,32).get();
        agreeButton.resizeImage(16);
        agreeButton.label(prov(()=>(vote.voted=="Y"?"[stat]":"")+vote.agree)).size(w/3-32,32);
        agreeButton.update(run(()=>{
            agreeButton.setDisabled(vote.voted!="none");
            disagreeButton.setDisabled(vote.voted!="none");
        }))
        disagreeButton.resizeImage(16);
        disagreeButton.label(prov(()=>(vote.voted=="N"?"[stat]":"")+vote.disagree)).size(w/3-32,32);
    })).size(w,32);

    return t;
}