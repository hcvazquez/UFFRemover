var transform = require("./src/transform/transform.js");
var transformES6 = require("./src/transform/transformES6.js");


// print process.argv
if(process.argv[4]!==null && process.argv[4]!==undefined && process.argv[4].length >0){
	if(process.argv[4]==="ES6:true"){
		console.log("ES6 to ES5");
		eval("transformES6."+process.argv[2]+"(\""+process.argv[3]+"\")");
	}
	eval("transform."+process.argv[2]+"(\""+process.argv[3]+"\",\""+process.argv[4]+"\")");
}else{
	eval("transform."+process.argv[2]+"(\""+process.argv[3]+"\")");
//console.log(process.argv[2]);
}
