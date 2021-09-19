Package = function(posX, posY, targetPos){
    var pos = this.pos = new Vector2(posX,posY);
    this.targetPos = targetPos;
    this.scale = 1;
    this.active = true;
    this.package = new Image();
	this.package.src="Assets/Package/Package1.png";
    this.width = 10;
    this.moveSpeed = 1;
    this.centerPos = new Vector2(0, 0);
    this.sinA = (targetPos.y - this.pos.y) / Math.sqrt(Math.pow(targetPos.y - this.pos.y, 2) + Math.pow(targetPos.x - this.pos.x, 2));
    this.cosA = (targetPos.x - this.pos.x) / Math.sqrt(Math.pow(targetPos.y - this.pos.y, 2) + Math.pow(targetPos.x - this.pos.x, 2));

    this.setPos = function(x, y){
        pos.x = x;
        pos.y = y;
    };

    this.update = function(){
        if (this.active)
        {
            this.pos.x += this.moveSpeed * this.cosA;
            this.pos.y += this.moveSpeed * this.sinA;
            this.centerPos.x = this.pos.x + this.width / 2;
            this.centerPos.y = this.pos.y + this.width / 2;
            //console.log(this.pos.x, this.pos.y);
        }

        if (this.pos.y <= 0)
        {
            this.destroy();
        }
    };

    this.render = function(c){
        
        c.save(); 
		
		var x = pos.x - this.width / 2;
        var y = pos.y - this.width;
		c.translate(x, y); 
        
		c.scale(this.scale, this.scale); 

		//test git
		c.drawImage(this.package,0, 0,10,10);
		
		c.restore(); 

        //draw collision
        c.beginPath();
        c.moveTo(x, y);
        c.lineTo(x + this.width, y);
        c.lineTo(x + this.width, y + this.width);
        c.lineTo(x, y + this.width);
        c.closePath();
        c.stroke();
    };
   
    this.destroy = function(){
        this.active = false;
    };
};
