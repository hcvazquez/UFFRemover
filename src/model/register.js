'use strict';
var parser = require('../task/parser.js');

var reg = [];
var loaded = false;
var lineReader = null;
var PROFILING_LABEL = "_PROFILING_INFO_"

var getFunctionName = function(node){
	if(node.id!=null){
		return node.id.name;
	}else{
		return node.id;
	}
}

var startInstrumentationLine = function(node,file){
	return "start function "+getFunctionName(node)+" from "+parser.trimFileName(file)+" in "+node.loc.start.line;
}

var endInstrumentationLine = function(node,file){
	return "end function "+getFunctionName(node)+" from "+parser.trimFileName(file)+" in "+node.loc.start.line;
}

var getKeyForNode = function(node,file){
	return startInstrumentationLine(node, file);
}

module.exports.getKeyForFunction = function(node,file){
	return "function "+getFunctionName(node)+" from "+parser.trimFileName(file)+" in line "+node.loc.start.line;
}

module.exports.getProfLabel = function(){
	return PROFILING_LABEL;
}

module.exports.getReg = function(){
	return reg;
}

module.exports.isLoaded = function(){
    return loaded;
}

module.exports.getReader = function(){
    return lineReader;
}

module.exports.get_start_instrumentation = function(node,file){
	var idKey = startInstrumentationLine(node,file);
	return "if(consoleLogArray.indexOf(\""+idKey+"\")=== -1){" +
				"consoleLogArray.push(\""+idKey+"\");" +
				"console.log(\""+PROFILING_LABEL+idKey+PROFILING_LABEL+"\");" +
			"}";
	//return "console.log(\""+PROFILING_LABEL+startInstrumentationLine(node,file)+PROFILING_LABEL+"\");";
}

module.exports.get_ga_instrumentation = function(node,file){
	var idKey = getFunctionName(node)+" from "+parser.trimFileName(file)+" in "+node.loc.start.line;
	return "window.$_gaEventSender('"+idKey+"');";
}


module.exports.get_end_instrumentation = function(node,file){
	return "console.log(\""+PROFILING_LABEL+startInstrumentationLine(node,file)+PROFILING_LABEL+"\");";
}

module.exports.isRegistered = function(line){
    //console.log("looking for "+getKeyFromLine(line));
	var key = getKeyFromLine(line);
	if(reg.indexOf(key) > -1 || reg.indexOf(key.replaceAll("\\","/")) > -1 || reg.indexOf(key.replaceAll("/","\\"))>-1 ){
		return true;
	}
	return false;
}

module.exports.getKeyFromLine = function(line){
    return getKeyFromLine(line);
}

var getKeyFromLine = function(line){
	var split = line.split(PROFILING_LABEL);
	return split[1];
}

module.exports.loadRegister = function(file){

	if(!loaded) {

		lineReader = require('readline').createInterface({
			input: require('fs').createReadStream(file)
		});

		lineReader.on('line', function (line) {
			var split = line.split(PROFILING_LABEL);
			if (split.length > 1) {
				if (reg.indexOf(split[1]) === -1) {
					reg.push(split[1]);
					//console.log('Line from file:', split[1]);
				}
				//console.log('Line from file:', split[1]);
			}
		});

		lineReader.on('close', function () {
			loaded = true;
		});
	}

}

module.exports.unregisterNode = function(node,file){
	var position = reg.indexOf(getKeyForNode(node,file));
	if(position > -1){
		delete reg[position];
	}
}

module.exports.printRegister = function(){
	console.log("----- REGISTER -----");
	for(var i=0;i<reg.length;i++){
		console.log(reg[i]);
	}
	console.log("--- END REGISTER ---");
}

