const {dialog} = require('electron').remote;

const { getLangs, getKeysInFiles, getFilesInDirDeep, writeLangFile } = require('./lang');

const {ipcRenderer} = require('electron');
const fs = require('fs');
const path = require('path');

// Array diff
Array.prototype.diff = function(a) {
    return this.filter(function(i) {return a.indexOf(i) < 0;});
};


function getDirectory(){
  return new Promise((resolve, reject) => {
    dialog.showOpenDialog({properties: ['openDirectory']}, (paths) => {
      resolve(paths[0]);
    });
  });
}

document.ondragover = (ev) => {
  ev.preventDefault()
};
document.ondrop = (ev) => {
  app.setRootDir(ev.dataTransfer.files[0].path);
  ev.preventDefault()
};

ipcRenderer.on('save', (event) => {
  app.save();
});
ipcRenderer.on('open', (event) => {
  app.open();
});
ipcRenderer.on('reload', (event) => {
  app.reload();
});

const app = new Vue({
  el: '#app',
  created(){
    if(this.rootDir){
      this.setRootDir(this.rootDir);
    }
  },
  data(){
    return {
      rootDir: localStorage.getItem("rootDir") || null,
      selectedLangKey: null,
      langs: {},
      baseLanguage: localStorage.getItem("baseLanguage") || 'en',
      scannedKeys: null,
      query: '',
      newLangName: null,
      langDir: '/resources/lang',
      scanDirs: ['/resources/views','/app'],
    };
  },
  methods:{
    isLaravelDir(root_dir){
      try{
        return fs.statSync(root_dir+this.langDir).isDirectory();
      } catch(e){
        return false;
      }
    },
    open(){
      getDirectory().then((dir) => {
        this.setRootDir(dir);
      });
    },
    setRootDir(dir){
      if(!this.isLaravelDir(dir)){
        alert("🚨 Doesn't look like a Laravel directory");
        return false;
      }
      this.rootDir = dir;
      localStorage.setItem("rootDir", dir);
      
      const langs = getLangs(this.rootDir+this.langDir);
      if(Object.keys(langs).length > 0){
        this.langs = langs;
        this.selectedLangKey = Object.keys(this.langs)[0] || null;
      }
      else{
        this.langs = {};
        this.selectedLangKey = null;
      }
      this.scan();
      document.title = this.rootDir;
    },
    scan(){
      let files = [];
      this.scanDirs.forEach((dir) => {
        files = files.concat(getFilesInDirDeep(this.rootDir+dir));
      });
      files = Array.from(files);
      let keys = getKeysInFiles(files);
      this.scannedKeys = keys;
    },
    reload(){
      this.setRootDir(this.rootDir);
    },
    save(){
      Promise.all(Object.keys(this.langs).map((lang_key) => {
        return writeLangFile(path.join(this.rootDir, this.langDir, lang_key+".json"), this.langs[lang_key]);
      })).then(() => {
        alert("🙌 Files saved");
      }).catch((err) => {
        console.error(err);
        alert("😢 Something went wrong while saving");
      });
    },
    updateValue(key, value){
      Vue.set(this.langs[this.selectedLangKey], key, value);
    },
    addLang(){
      let lang_key = this.newLangName.toLowerCase();
      if(Object.keys(this.langs).find(item => item == lang_key)){
        alert("Language already exists");
        this.selectedLangKey = lang_key;
        this.newLangName = '';
        return;
      }
      let emptyLang = {};
      this.allKeys.forEach(key => {
        emptyLang[key] = (lang_key == this.baseLanguage) ? key : null;
      });
      Vue.set(this.langs, lang_key, emptyLang);
      this.selectedLangKey = lang_key;
      this.newLangName = '';
    }
  },
  computed:{
    selectedLang(){
      return this.langs[this.selectedLangKey] || {};
    },
    missingKeys(){
      if(!this.selectedLang) return [];
      
      let selectedKeys = Object.keys(this.selectedLang) || [];
      let scannedKeys = this.scannedKeys || [];
      
      return scannedKeys.diff(selectedKeys);
    },
    extraKeys(){
      let selectedKeys = Object.keys(this.selectedLang) || [];
      let scannedKeys = this.scannedKeys || [];
      
      return selectedKeys.diff(scannedKeys);
    },
    allKeys(){
      let keys = [];
      Object.keys(this.langs).forEach((lang_key) => {
        keys = keys.concat(Object.keys(this.langs[lang_key]));
      });
      keys = keys.concat(this.scannedKeys);
      return Array.from(new Set(keys));
    },
    allItems(){
      return this.allKeys.map((key) => {
        return {key, value: this.selectedLang[key] || null };
      });
    },
    filteredLangItems(){
      let q = this.query.toLowerCase();
      return this.allItems.filter((item) => {
        return q == '' || item.key.toLowerCase().indexOf(q) > -1;
      }).sort((a, b) => {
        if(a.key.toLowerCase() < b.key.toLowerCase()) return -1;
        if(a.key.toLowerCase() > b.key.toLowerCase()) return 1;
        return 0;
      });
    },
    numLangs(){
      return Object.keys(this.langs).length;
    }
  }
});
