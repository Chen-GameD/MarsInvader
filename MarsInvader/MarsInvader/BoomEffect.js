
BoomEffect= function(inPos, music){

    var pictures = [];
    var offset = 0,
        pos = inPos;
    this.active = true;

    var audio= new Audio();
    switch(music){
        case 1:audio.src = "assets/Music/Boom.mp3";break;
        case 2:audio.src = "assets/Music/Failure.mp3";
    }
    
    audio.volume = 0.3;
    audio.play();
    for(i = 0; i < 30; i++){
        pictures[i] = new Image();
        pictures[i].src =  "assets/Effect/Explosion"+(i+1)+".png";

    }
   

    this.render= function(c){

  //  console.log(c);
        c.save(); 
		
		c.translate(pos.x, pos.y); 
        
        if(offset==30){
            this.active = false;
        } else{
            c.drawImage(pictures[offset],-25,-25,50,50);
            offset++;
        }

		
		c.restore(); 
		
    };
};