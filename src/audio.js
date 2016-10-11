let sounds={};

sounds.circle=new Audio("/assets/audio/circle.wav");
sounds.cross=new Audio("/assets/audio/cross.wav");

export let play = sound=>{
    if(sounds[sound]){
        sounds[sound].currentTime=0;
        sounds[sound].play();
    }
};
