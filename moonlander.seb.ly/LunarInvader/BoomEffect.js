
BoomEffect= function(inPos){

    var pictures = [];
    var offset = 0,
        pos = inPos;
    this.active = true;
    for(i = 0; i < 30; i++){
        pictures[i] = new Image();
        pictures[i].src =  "Assets/Effect/ExPlosion/sequence/Explosion"+(i+1)+".png";

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