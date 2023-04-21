const Manager = require("Manager")

Vars.netClient.addPacketHandler("votes",(votes)=>{
    Manager.votes=JSON.parse(votes)
    Manager.events.fire("voteUpdate",Manager.votes)
})

// Vars.netClient.addPacketHandler("voteAgree",(id)=>{
//     Manager.votes.filter(vote=>vote&&vote.id==id).pop().agree++
// })

// Vars.netClient.addPacketHandler("voteDisagree",(id)=>{
//     Manager.votes.filter(vote=>vote&&vote.id==id).pop().disagree++
// })

Vars.netClient.addPacketHandler("voteDelete",(id)=>{
    Manager.votes[id]=null
    Manager.events.fire("voteUpdate",Manager.votes)
})