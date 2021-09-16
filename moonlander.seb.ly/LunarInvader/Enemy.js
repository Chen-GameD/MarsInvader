Enemy = function(posX, posY){
    var pos = this.pos = new Vector2(posX,posY),
    this.scale = 0.25;
    this.active = true;
    this.enemy = new Image();
	this.enemy.src="assets/SpaceXShuttle/socket.png";

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
