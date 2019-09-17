class SimpleParticle {
   constructor( x, y, fill) {

      this.x = x;
      this.y =y;
      this.speedX = 4 - Math.random() * 6;
      this.speedY = 3 - Math.random() * 4;
      this.radius = Math.random() * 10 + 3; // minimum radius should be 3
      this.life = 3140;
      this.startTime = Date.now();
      this.fill = fill;
      this.gravity = 0;

      this.draw = this.draw.bind(this);
   }

   draw(context) {

      if( this.life >= 0 && this.radius > 0 ) {

         context.beginPath();
         context.arc( this.x ,this.y , this.radius , 0 , Math.PI * 2 );
         context.fillStyle = this.fill[Math.floor(Math.random() * this.fill.length)];
         context.fill();

         this.life--;
         this.radius -= 0.1;
         this.x += this.speedX;
         this.y += this.speedY - Math.sin(this.gravity);
         this.gravity += 0.1 ;
      }

   }
}

class ParticleFactory {

   constructor(context, count = 50 , once = false, x = 20 , y = 20) {
      this.particles = [];

      this.once = once;
      this.colors = ["#50cad4", "#0562d1", "#8667ff", "#0947db", "#07d89d"];
      this.colors_r = ["#ed2d96", "#c61a78", "#931ac6", "#efb2c8", "#c61a56"];
      this.colors_g = ["#fff9b2", "#b2eeff", "#f3943f", "#8df9c0", "#8d97f9"];

      let ar = [this.colors, this.colors_r, this.colors_g];
      ar = ar[Math.floor(Math.random() * ar.length)];

      for (let i = 0; i < count; i++) {

         this.particles.push(new SimpleParticle(x, y, ar ));
      }

      this.context = context;
      this.updateFrames = this.updateFrames.bind(this);
   }


   updateFrames() {

      if (this.particles && this.particles.length === 0)
         return;

      if(this.context)
         this.context.clearRect(0, 0, window.innerWidth, window.innerHeight)



      for (let i = 0; i < this.particles.length; i++) {


         this.particles[i].draw(this.context);

         if (i === this.particles.length - 1) {
            let percent = (Date.now() - this.particles[i].startTime) / 2000;

            if (percent > 1) {

               this.particles = [];
               console.log(this.once)
               if (this.once == true)
                  return;


               let boundX = Math.round( window.innerWidth * Math.random());
               let boundY = Math.round(window.innerHeight/2 * Math.random());

               let ar = [this.colors, this.colors_r, this.colors_g];
               ar = ar[Math.floor(Math.random() * ar.length)];

               console.log(boundX , boundY);
               for (let i = 0; i < ( Math.floor(40 + Math.random() * 20 ) ); i++) {
                  this.particles.push(new SimpleParticle(boundX, boundY,ar));
               }
            }
         }
      }



      window.requestAnimationFrame(this.updateFrames);
   }
}

jQuery(function() {

  let canvas = document.querySelector('#canvasGenerator');
   canvas.width = window.innerWidth;
   canvas.height = window.innerHeight - 160;
  let context = canvas.getContext("2d");
   let bounds =   canvas.getBoundingClientRect();

  let particleSystem = new ParticleFactory(context);

   window.requestAnimationFrame(particleSystem.updateFrames);

   canvas.addEventListener("click",function(e){
      // console.log(e.clientX,bounds.left,e.clientX - bounds.left)
      let particleSystem = new ParticleFactory(context, 40, true, e.clientX, e.clientY - bounds.top );
      window.requestAnimationFrame(particleSystem.updateFrames);
   })

});
