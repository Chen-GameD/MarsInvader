Enemy = function(posX, posY){
    var pos = this.pos = new Vector2(posX,posY);
    this.scale = 1;
    this.active = true;
    this.enemy = new Image();
	this.enemy.src="assets/SpaceXShuttle/socket.png";
    this.width = 10;
    this.shootInterval = 2000;
    this.currentInterval = Date.now();
    this.packages = [];
    this.packageActive = true;

    if(view.scale == SCREEN_HEIGHT/700){
        this.scale = 1;
    } else{
        this.scale = 1;
    }

    this. setPos = function(x, y){
        pos.x = x;
        pos.y = y;
    }

    this.update = function(playerPos){
        var time = Date.now() - this.currentInterval;
        if (time >= this.shootInterval && this.packageActive)
        {
            var pack = new Package(this.pos.x, this.pos.y, playerPos);
            this.packages.push(pack);
            this.currentInterval = Date.now();
        }
        for (var i = 0; i < this.packages.length; i++)
        {
            if (!this.packages[i].active)
            {
                this.packages.splice(i, 1);
            }
        }
        //console.log(i);

    };

    this.render = function(c){
        
        c.save(); 
		
		var x = pos.x - this.width / 2;
        var y = pos.y - this.width;
		c.translate(x, y); 
        
		c.scale(this.scale, this.scale); 

		//test git
		c.drawImage(this.enemy,0, 0,10,10);
		c.restore(); 

        c.beginPath();
        //draw collision
        c.moveTo(x, y);
        c.lineTo(x + this.width, y);
        c.lineTo(x + this.width, y + this.width);
        c.lineTo(x, y + this.width);
        c.closePath();

        c.stroke(); 
       

        for (var i = 0; i < this.packages.length; i++)
        {
            this.packages[i].update();
            this.packages[i].render(c);
        }
    };
   
    this.crash = function(){
        this.active = false;
    };
};
