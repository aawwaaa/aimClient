const Manager = require("Manager")
const VoteTable=require("connect/VoteTable")

module.exports=function(MainWindow){
    MainWindow.table.table().size(0).row()
    MainWindow.table.table(cons(t=>{
        let draw=(votes)=>{
            t.clear();
            t.update(run(()=>{
                for(let vote of Manager.votes){
                    if(vote==null) continue;
                    if(Date.now()>vote.endTime){
                        Manager.votes.splice(Manager.votes.indexOf(vote),1);
                        draw(Manager.votes);
                    }
                }
            }))
            for(let vote of votes){
                if(vote==null) continue;
                t.add(new VoteTable(vote,48*3.5+120)).size(48*3.5+120,32*4).top().row();
            }
        }
        Manager.events.on("voteUpdate",(votes)=>{
            draw(votes)
        })
    })).top().left().minWidth(48*4+120).get().visibility=boolp(()=>MainWindow.s);
    MainWindow.moveY.push(()=>-(Manager.votes.filter(x=>x!=null).length*32*2))
}