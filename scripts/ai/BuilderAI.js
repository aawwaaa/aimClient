let c=new (require("ai/Main").Controller)(
    function(){
        let ai=extend(BuilderAI,{
            isReady(){
                return true
            }
        })
        return ai
    },
    function(c){
        
    }
)

module.exports.init=()=>require("ai/Main").addAI(Core.atlas.drawable("aimclient-ai-builder"),c)