export class Line {
	x;
	y;
	addedX;
	addedY;
	rad;
	lightInputMultiplier;
	color;
	opts;
	cumulativeTime;
	time;
	targetTime;
	ctx;
	tick;
	baseRad;
	dieX;
	dieY;

	constructor(
		opts:{},
		dieX:{},
		dieY:{},
		ctx:{},
		baseRad: {},
		tick: {}

	  ) {
	  if (opts){
	  	this.opts = opts;
	  	this.dieX = dieX;
	  	this.dieY = dieY;
	  	this.ctx = ctx;
	  	this.baseRad = baseRad;
	  	this.tick = tick;
	  	this.reset();
	  } 
	    
	 }

    reset() {
	    this.x = 0;
	    this.y = 0;
	    this.addedX = 0;
	    this.addedY = 0;
	    
	    this.rad = 0;
	    
	    this.lightInputMultiplier = this.opts.baseLightInputMultiplier + this.opts.addedLightInputMultiplier * Math.random();
	    
	    this.color = this.opts.color.replace( 'hue', this.tick * this.opts.hueChange );
	    this.cumulativeTime = 0;
	    
	    this.beginPhase();
    }

	beginPhase(){
	  
	  this.x += this.addedX;
	  this.y += this.addedY;
	  
	  this.time = 0;
	  this.targetTime = ( this.opts.baseTime + this.opts.addedTime * Math.random() ) |0;
	  
	  this.rad += this.baseRad * ( Math.random() < .5 ? 1 : -1 );
	  this.addedX = Math.cos( this.rad );
	  this.addedY = Math.sin( this.rad );
	  
	  if( Math.random() < this.opts.dieChance || this.x > this.dieX || this.x < -this.dieX || this.y > this.dieY || this.y < -this.dieY )
	    this.reset();
	}


    step() {
	  ++this.time;
	  ++this.cumulativeTime;
	  
	  if( this.time >= this.targetTime )
	    this.beginPhase();
	  
	  var prop = this.time / this.targetTime,
	      wave = Math.sin( prop * Math.PI / 2  ),
	      x = this.addedX * wave,
	      y = this.addedY * wave;
	  
	  this.ctx.shadowBlur = prop * this.opts.shadowToTimePropMult;
	  this.ctx.fillStyle = this.ctx.shadowColor = this.color.replace( 'light', this.opts.baseLight + this.opts.addedLight * Math.sin( this.cumulativeTime * this.lightInputMultiplier ) );
	  this.ctx.fillRect( this.opts.cx + ( this.x + x ) * this.opts.len, this.opts.cy + ( this.y + y ) * this.opts.len, 2, 2 );
	  
	  if( Math.random() < this.opts.sparkChance )
	    this.ctx.fillRect( this.opts.cx + ( this.x + x ) * this.opts.len + Math.random() * this.opts.sparkDist * ( Math.random() < .5 ? 1 : -1 ) - this.opts.sparkSize / 2, this.opts.cy + ( this.y + y ) * this.opts.len + Math.random() * this.opts.sparkDist * ( Math.random() < .5 ? 1 : -1 ) - this.opts.sparkSize / 2, this.opts.sparkSize, this.opts.sparkSize )
    }
}