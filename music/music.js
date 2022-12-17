const fs = require('fs')
const path = require('path')
const config = require('./config.json')
const { VoiceConnection, createAudioPlayer, createAudioResource, AudioPlayerStatus } = require('@discordjs/voice')
const { IntegrationExpireBehavior } = require('discord.js')

class Music {
    constructor() {
        console.log("Music constructor")
        this.map = JSON.parse(fs.readFileSync(config.mapping))
        this.queue = []
        this.maxDepth = config.maxDepth
        this.createPlayer()
        this.rep = 'none'
        this.connection = null;
        if(this.findAllFiles(config.location,0)){
           this.saveMapping();
        }



    }

    createPlayer(){
        this.player = createAudioPlayer();
        this.player.on(AudioPlayerStatus.Idle, () => {
                switch(this.rep){
                    case 'none':
                        this.queue.pop();
                        if(this.queue.length!=0){
                            this.playSong()
                        }
                    break;
                    case 'repall':
                        this.queue.push(this.queue.pop)
                        this.playSong()
                    break;
                    case 'repone':
                        this.playSong()
                    break;
                }
        });
        this.player.on('error', (err)=>{
            console.log(err)
            this.playSong();
        })
    }

    playSong(){
        let song = this.map[this.queue[0]].file
        console.log(song)
        let resource = createAudioResource(song, { inlineVolume: true });
        console.log(resource.volume)
//        resource.volume.setVolume(0.5);
        this.player.play(resource)
    }

    /**
     * @param {VoiceConnection} con 
     */
    setConnection(con){
        this.connection=con;
        this.connection.subscribe(this.player)
    }

    findAllFiles(dir,depth){
        if(depth>=this.maxDepth) return false;
        let change = false
        fs.readdirSync(dir).forEach((file)=>{
            let fullPath = dir+"/"+file;
            if(fs.lstatSync(fullPath).isDirectory()){
                change |= this.findAllFiles(fullPath,depth+1)
            }else{
                let fileName = path.parse(file).name
                if(!this.map[fileName]){
                    change=true
                    this.map[fileName] = {
                        "name": fileName,
                        "file" : fullPath,
                        "reference" : [fileName],
                        "base":null
                    }
                }
            }
        })
        return change;
    }

    saveMapping(){
        fs.writeFile(config.mapping,JSON.stringify(this.map),(err)=>{
            console.log("Error updating mapping file: "+err);
        })
    }

    play(song){
        if(!song) return "missing argument"
        if(!this.map[song]) return "song not found"
        this.queue.push(song)
        if(this.queue.length==1){
            this.playSong();
            return "Playing..."
        }else{
            return "Song added to queue position: " + this.queue.length;
        }
    }

    map(song, id){
        if(!(song&&id)) return "missing argument"
        let songObj = this.map[song]
        if(songObj.base!=null){
            songObj = this.map[songObj.base]
        }
        songObj.reference.push(id)
        this.map[id] = {
            "fileName" : id,
            "file" : songObj.file,
            "reference" : null,
            "base": songObj.fileName
        }
        this.saveMapping();
        return "successful mapping"
    }

    addToPlayList(playlist, song){
        if(!(song&&playlist)) return "missing argument"
    }

    removeFromPlayList(playlist, song){
        if(!(song&&playlist)) return "missing argument"
    
    }

    viewQueue(){
        if(this.queue.length == 0){
            return 'queue is empty'
        }
        let retval = ""
        this.queue.forEach((str,idx)=>{
            retval += (idx+1) + " | " + str + "\n"
        })
        return retval;
    }

    repeatOptions(type){
        if(!type) return "missing argument"
        this.rep = type
        return "now on repeat type: "+type
    }

    dequeue(song){
        if(!song) return "missing argument"
        this.queue.splice(song,1)
        return "song dequeued"
    }

    skip(){
        this.queue.pop();
        if(this.queue.length!=0){
            this.playSong()
        }
        return "song skipped"
    }

    disconnect(){
        this.connection.disconnect();
        this.connection.destroy();
        this.connection=null;
        this.player.stop();
        this.createPlayer();
        this.queue = []
        return "disconnected"
    }

}

let music = new Music()
module.exports = music;