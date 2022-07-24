require("ai/Main")
require("Marks")
module.exports=(MainWindow,childs,Manager)=>{
    require("Marks").init()
    require("ai/Main").init(MainWindow,childs,Manager)
}