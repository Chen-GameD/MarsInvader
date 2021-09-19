Enemy = function(posX, posY){
    
    var pos = this.pos = new Vector2(posX,posY);
    console.log("enemy:"+pos);
    this.scale = 1;
    this.active = true;
    this.enemy = new Image();
	this.enemy.src="Assets/SpaceXShuttle/SpaceXShuttle.png";
    this.width = 10;
    this.enemy.onload = function(){
        width = this.width * this.scale;
    }

    if(view.scale == SCREEN_HEIGHT/700){
        this.scale = 1;
    } else{
        this.scale = 1;
    }

    this. setPos = function(x, y){
       
        pos.x = x;
        pos.y = y;
    }

    this.update = function(){
    
    };

    this.render = function(c){
        
        c.save(); 
		
		var x = pos.x - this.width / 2;
        var y = pos.y - this.width;
		c.translate(x, y); 
        
		c.scale(this.scale, this.scale); 

        //draw collision
        c.moveTo(x, y);
        c.lineTo(x + this.width, y);
        c.lineTo(x + this.width, y + this.width);
        c.lineTo(x, y + this.width);
        c.closePath();
		
	
		//test git
		c.drawImage(this.enemy,0, 0,10,10);
		
		c.restore(); 
    };
   
    this.crash = function(){
        this.active = false;
    };
};
