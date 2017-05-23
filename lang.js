const fs = require('fs');
const path = require('path');
const config = require('./config.js');

function getFilesInDirDeep(dir){
  //console.log(`Looking into dir ${dir}`);
  
  if(!fs.statSync(dir).isDirectory()){
    console.log(`${dir} is not a directory`);
    return [];
  }
  
  let items = fs.readdirSync(dir);
  let files = items
    .filter((item) => fs.statSync(path.join(dir, item)).isFile())
    .map((filename) => path.join(dir, filename)); // Filename with dir
  let directories = items.filter((item) => fs.statSync(path.join(dir, item)).isDirectory());
  
  //console.log(`Found ${files.length} file(s) in ${dir}`);
  
  directories.forEach((sub_dir) => {
    files = files.concat(getFilesInDirDeep(path.join(dir, sub_dir)));
  });
  
  return files;
}

function getKeysInFiles(files){
  const pattern = /(__)\(\s*[\'"](.*?)[\'"]\s*[\),]/g;
  let keys = new Set();
  let found = new Set();
  for(let i = 0; files.length > i; i++){
    let fileContent = fs.readFileSync(files[i], 'utf8');
    let matches = null;
    while(matches = pattern.exec(fileContent)){
        keys.add(matches[2]);
        
        // Also record in which files it was found
        found.add(matches[2]);
        if(!found[matches[2]]) found[matches[2]] = [];
        found[matches[2]].push(files[i]);
    };
  }
  return {keys: Array.from(keys), found} ;
}


function getLangs(dir){
  if(!fs.statSync(dir).isDirectory()){
    console.log(`${dir} is not a directory`);
    return null;
  }
  
  let items = fs.readdirSync(dir);
  let jsonFiles = items.filter((filename) => {
      return fs.statSync(path.join(dir, filename)).isFile() && filename.endsWith('.json');
    });
  
  let lang = {};
  jsonFiles.forEach((filename) => {
    lang[filename.substr(0, filename.indexOf('.'))] = require(path.join(dir, filename));
  });
    
  return lang;
}

function writeLangFile(file, json){
  
  let sortedObject = {};
  if(config.get('sortKeysOnSave')){
    Object.keys(json)
        .sort()
        .forEach(function(v, i) {
            sortedObject[v] = json[v];
         });
  }
  else{
    sortedObject = json;
  }

  const indentation = " ".repeat(config.get('saveIndentation'));

  return new Promise((resolve, reject) => {
    fs.writeFile(file, JSON.stringify(sortedObject, null, indentation), function(err) {
      if(err) reject(err);
      else resolve(file);
    });
  });
}

module.exports = { getLangs, getKeysInFiles, getFilesInDirDeep, writeLangFile };

        