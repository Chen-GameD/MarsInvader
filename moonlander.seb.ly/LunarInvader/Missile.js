Missile = function(velX, velY, posX, posY){
    


    var vel = this.vel = new Vector2(velX*2, velY),
        pos = this.pos = new Vector2(posX,posY),
        gravity = 0.002;
    this.scale = 0.25;
    this.active = true;
    this.missileImg = new Image();
	this.missileImg.src="assets/SpaceXShuttle/socket.png";

    if(view.scale == SCREEN_HEIGHT/700){
        this.scale = 0.6;
    } else{
        this.scale = 0.25;
    }

    this.update = function(){
    
        vel.y += gravity;
        pos.x += vel.x;
        pos.y += vel.y;
    };

    this.render = function(c, scale){
        
        c.save(); 
		
		
		c.translate(pos.x, pos.y); 
		c.scale(this.scale, this.scale); 
		
	
		//test git
		c.drawImage(this.missileImg,0, 0,10,10);
		
		c.restore(); 
    };
   
    this.crash = function(){
        this.active = false;
    };
};

