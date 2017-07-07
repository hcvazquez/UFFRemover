'use strict';

module.exports.getProjectName = function(file,delimiter){
	var split = file.split(delimiter);
	var i = 0;
	var project;
	while(split[i]!=="node_modules" && i<split.length){
		i++;
	}
	if(split[i]==="node_modules"){
		project = split[i-1];	
	}
	return project;
}

module.exports.getProjectPath = function(file,delimiter){
	var split = file.split("node_modules");
	var i = 0;
	return split[0];
}

module.exports.getPackageName = function(file,delimiter){
	var split = file.split(delimiter);
	var i = split.length-1;
	var project = null;
	while(split[i]!=="node_modules" && i > -1){
		i--;
	}
	if(split[i]==="node_modules"){
		project = split[i+1];
	}
	return project;
}

module.exports.getFullPackageName = function(file,delimiter){
	var split = file.split(delimiter);
	var i = split.length-1;
	var project = "";
	while(split[i]!=="node_modules" && i > -1){
		i--;
	}
	if(split[i]==="node_modules"){
		for(var e = 0 ;e<i+2; e++){
			if(e!==i+1) {
				project = project + split[e] + delimiter;
			}else{
				project = project + split[e];
			}
		}
	}
	return project;
}

module.exports.getFileName = function(file,delimiter){
	var split = file.split(delimiter);
	return split[split.length-1];
}

module.exports.getBackupName = function(file){
	return file+"__original__.js";
}

module.exports.getInstrumentedPath = function(file,delimiter,projectName){
	var result = [];
	var newPath = file.replace("node_modules","node_modules_instrumented");
	var split = newPath.split(delimiter);
	var i = 1;
	var project;
	var baseDir = split[0];
	while(split[i]!=="node_modules_instrumented" && i<split.length-1){
		baseDir = baseDir.concat(delimiter+split[i]);
		i++;
	}
	while(i<split.length-1){
		baseDir = baseDir.concat(delimiter+split[i]);
		result.push(baseDir);
		i++;
	}
	return result;
}

module.exports.isInstrumentable = function(file){
	var split = file.split("node_modules");
	if(split.length>1){
		return true;
	}
	return false;
}

module.exports.changePath = function(file){
	return file.replace("node_modules","node_modules_instrumented");
}