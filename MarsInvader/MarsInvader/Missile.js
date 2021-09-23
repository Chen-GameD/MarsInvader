Missile = function(velX, velY, posX, posY){
    


    var vel = this.vel = new Vector2(velX*2, velY),
        pos = this.pos = new Vector2(posX,posY),
        gravity = 0.02;
    this.scale = 0.25;
    this.active = true;
    this.missileImg = new Image();
	this.missileImg.src="Assets/Car/car.png";

    if(view.scale == SCREEN_HEIGHT/700){
        this.scale = 0.6;
    } else{
        this.scale = 0.25;
    }

    this.update = function(){
       
        var enemies = landscape.enemy;
        var length = enemies.length;

        for(i = 0; i < length; i++){
            var dis = (pos.x - enemies[i].pos.x)*(pos.x - enemies[i].pos.x) +(pos.y - enemies[i].pos.y)*(pos.y - enemies[i].pos.y);
            
            if( dis<100){
                enemies[i].active = false;
                this.crash();
                return;
            }
        }
     
        vel.y += gravity*2;
        pos.x += vel.x;
        pos.y += vel.y;


    };

    this.render = function(c, scale){
        
        c.save(); 
		
		
		c.translate(pos.x, pos.y); 
		c.scale(this.scale, this.scale); 
		
	    c.rotate(0.5);
		//test git
		c.drawImage(this.missileImg,0, 0,408/12,149/12);
		
		c.restore(); 
    };
   
    this.crash = function(){
        this.active = false;
        boomEffects[boomLength++] = new BoomEffect(pos, 1);
        
    };
};

