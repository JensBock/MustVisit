import { Component, OnInit } from '@angular/core';
import { Line } from './honeycombanim.component.line';

@Component({
  selector: 'app-honeycombanim',
  templateUrl: './honeycombanim.component.html',
  styleUrls: ['./honeycombanim.component.css']
})
export class HoneycombanimComponent implements OnInit {

  c;
  opts;
  w;
  h;
  ctx;
  tick;
  lines;
  dieX;
  dieY;
  baseRad;
  line;

  constructor() { }

  initCanvas(){
    this.c = document.getElementById('c');

    this.w = this.c.width = window.innerWidth;
    this.h = this.c.height = window.innerHeight;
    this.ctx = this.c.getContext( '2d' );
    
        this.opts = {
          
          len: 100,
          count: 10,
          baseTime: 10,
          addedTime: 10,
          dieChance: .05,
          spawnChance: 1,
          sparkChance: .1,
          sparkDist: 10,
          sparkSize: 2,
          
          color: 'hsl(hue,100%,light%)',
          baseLight: 50,
          addedLight: 10, // [50-10,50+10]
          shadowToTimePropMult: 6,
          baseLightInputMultiplier: .01,
          addedLightInputMultiplier: .02,
          
          cx: this.w / 2,
          cy: this.h / 2,
          repaintAlpha: .05,
          hueChange: .1
        },
    
        this.tick = 0,
        this.lines = [],
        this.dieX = this.w / 2 / this.opts.len,
        this.dieY = this.h / 2 / this.opts.len,
        
        this.baseRad = Math.PI * 2 / 6;
        
        this.ctx.fillStyle = 'white';
        this.ctx.fillRect( 0, 0, this.w, this.h );
  }


  loop() {
    setTimeout(() => {
    window.requestAnimationFrame(() => this.loop());
    
    ++this.tick;
    
    this.ctx.globalCompositeOperation = 'source-over';
    this.ctx.shadowBlur = 0;
    this.ctx.fillStyle = 'rgba(75,75,75,alp)'.replace( 'alp', this.opts.repaintAlpha );
    this.ctx.fillRect( 0, 0, this.w, this.h );
    this.ctx.globalCompositeOperation = 'lighter';
    
    if( this.lines.length < this.opts.count && Math.random() < this.opts.spawnChance ){
      this.line = new Line( this.opts , this.dieX , this.dieY , this.ctx, this.baseRad,this.tick );
      this.lines.push( this.line );
    }
    
    this.lines.map(function( line ){
     line.step(); 
     });
     }, 50)
  }

  addListener(){
    window.addEventListener("resize", () => { this.resize() }, false);
  }

  resize(){
    this.w = this.c.width = window.innerWidth;
    this.h = this.c.height = window.innerHeight;
    this.ctx.fillStyle = 'black';
    this.ctx.fillRect( 0, 0, this.w, this.h );
    
    this.opts.cx = this.w / 2;
    this.opts.cy = this.h / 2;
    
    this.dieX = this.w / 2 / this.opts.len;
    this.dieY = this.h / 2 / this.opts.len;

  }

  ngOnInit() {
  this.initCanvas();
  this.loop();
  this.addListener();
  }

}
