var $jscomp=$jscomp||{};$jscomp.scope={};$jscomp.createTemplateTagFirstArg=function(a){return a.raw=a};$jscomp.createTemplateTagFirstArgWithRaw=function(a,b){a.raw=b;return a};var Camera=function(){this.pos=vec3.create();this.front=vec3.create();this.up=vec3.create();this.ySpeed=this.yaw=this.pitch=0;vec3.set(this.pos,0,0,3);vec3.set(this.front,0,0,-1);vec3.set(this.up,0,1,0)};
Camera.prototype.update=function(){this.pos[1]+=this.ySpeed*game.deltaTime;this.ySpeed-=1E-4*game.deltaTime;-5.4>=this.pos[0]&&(this.pos[0]=-5.4);4.4<=this.pos[0]&&(this.pos[0]=4.4);-5.4>=this.pos[2]&&(this.pos[2]=-5.4);4.4<=this.pos[2]&&(this.pos[2]=4.4)};var Obstacle=function(a){this.pos=a;this.usedToSpawn=!1};Obstacle.prototype.render=function(){gl.useProgram(game.shader);game.modelMatrix=mat4.create();mat4.translate(game.modelMatrix,game.modelMatrix,this.pos);gl.uniformMatrix4fv(gl.getUniformLocation(game.shader,"model"),!1,game.modelMatrix);gl.bindTexture(gl.TEXTURE_2D,texture.stone);gl.bindVertexArray(game.VAO);gl.drawArrays(gl.TRIANGLES,0,36)};
Obstacle.prototype.collideWithCamera=function(){return this.pos[0]-.5+1>game.camera.pos[0]&&this.pos[0]-.5<game.camera.pos[0]&&this.pos[1]-.5+1>game.camera.pos[1]&&this.pos[1]-.5<game.camera.pos[1]&&this.pos[2]-.5+1>game.camera.pos[2]&&this.pos[2]-.5<game.camera.pos[2]?!0:!1};
function spawnObstacles(){if(game.camera.pos[1]-20<=game.obstacles[game.obstacles.length-1].pos[1]&&!game.obstacles[game.obstacles.length-1].usedToSpawn){var a=Math.floor(4*Math.random()+1);game.obstacles[game.obstacles.length-1].usedToSpawn=!0;for(var b=0;b<a;b++){var c=new Obstacle(vec3.set(vec3.create(),Math.floor(10*Math.random()+-5),game.camera.pos[1]-21,Math.floor(10*Math.random()+-5)));game.obstacles.push(c)}1===Math.floor(20*Math.random())&&(a=new Powerup(vec3.set(vec3.create(),Math.floor(10*
Math.random()+-5),game.camera.pos[1]-21,Math.floor(10*Math.random()+-5))),game.powerups.push(a))}};var Wall=function(a,b){this.pos=a;this.scale=b};
Wall.prototype.render=function(){gl.useProgram(game.shader);this.pos[1]>=game.camera.pos[1]&&(this.pos[1]=game.camera.pos[1]-this.scale[1]/3);game.modelMatrix=mat4.create();mat4.translate(game.modelMatrix,game.modelMatrix,this.pos);mat4.scale(game.modelMatrix,game.modelMatrix,this.scale);gl.uniformMatrix4fv(gl.getUniformLocation(game.shader,"model"),!1,game.modelMatrix);gl.bindTexture(gl.TEXTURE_2D,texture.wall);gl.bindVertexArray(game.VAO);gl.drawArrays(gl.TRIANGLES,0,36)};var Powerup=function(a){this.pos=a;this.ability=game.powerupTypes[Math.floor(Math.random()*game.powerups.length)];this.used=!1};
Powerup.prototype.render=function(){gl.useProgram(game.shader);game.modelMatrix=mat4.create();mat4.translate(game.modelMatrix,game.modelMatrix,this.pos);mat4.scale(game.modelMatrix,game.modelMatrix,[.5,.5,.5]);gl.uniformMatrix4fv(gl.getUniformLocation(game.shader,"model"),!1,game.modelMatrix);gl.bindTexture(gl.TEXTURE_2D,texture.powerup);gl.bindVertexArray(game.VAO);gl.drawArrays(gl.TRIANGLES,0,36)};
Powerup.prototype.update=function(){if(this.pos[0]-.5+1>game.camera.pos[0]&&this.pos[0]-.5<game.camera.pos[0]&&this.pos[1]-.5+1>game.camera.pos[1]&&this.pos[1]-.5<game.camera.pos[1]&&this.pos[2]-.5+1>game.camera.pos[2]&&this.pos[2]-.5<game.camera.pos[2]){switch(this.ability){case "+score":game.score+=.5*game.score}this.used=!0;sound.powerup.play()}};var canvas=document.getElementById("canv"),gl=canvas.getContext("webgl2");
function main(){resizeEvent();lastFrame=Date.now();gl.enable(gl.DEPTH_TEST);game.currentState="playing";document.getElementById("main-menu").style.display="none";document.getElementById("score-display").style.display="block";canvas.requestPointerLock=canvas.requestPointerLock||canvas.mozRequestPointerLock;canvas.requestPointerLock();sound.wind.loop=!0;sound.wind.volume=0;sound.wind.play();sound.powerup.volume=.5;var a=new Obstacle(vec3.set(vec3.create(),Math.floor(10*Math.random()+-5),game.camera.pos[1]-
10,Math.floor(10*Math.random()+-5)));game.obstacles.push(a);a=new Wall(vec3.set(vec3.create(),-6,0,0),vec3.set(vec3.create(),1,50,12));game.walls.push(a);a=new Wall(vec3.set(vec3.create(),5,0,0),vec3.set(vec3.create(),1,50,12));game.walls.push(a);a=new Wall(vec3.set(vec3.create(),0,0,5),vec3.set(vec3.create(),12,50,1));game.walls.push(a);a=new Wall(vec3.set(vec3.create(),0,0,-6),vec3.set(vec3.create(),12,50,1));game.walls.push(a);render()};function resizeEvent(){canvas.width=window.innerWidth;canvas.height=window.innerHeight;gl.viewport(0,0,canvas.clientWidth,canvas.clientHeight);gl.useProgram(game.shader);game.viewMatrix=mat4.create();game.projectionMatrix=mat4.create();mat4.perspective(game.projectionMatrix,45*Math.PI/180,canvas.clientWidth/canvas.clientHeight,.1,100);gl.uniformMatrix4fv(gl.getUniformLocation(game.shader,"proj"),!1,game.projectionMatrix)}
function keyboardInput(){var a=vec3.set(vec3.create(),.1*game.deltaTime,.1*game.deltaTime,.1*game.deltaTime);pressedKeys[87]&&(game.camera.pos[0]+=game.camera.front[0]*a[0],game.camera.pos[2]+=game.camera.front[2]*a[2]);pressedKeys[83]&&(game.camera.pos[0]-=game.camera.front[0]*a[0],game.camera.pos[2]-=game.camera.front[2]*a[2]);pressedKeys[68]&&mat4.add(game.camera.pos,game.camera.pos,vec3.multiply(vec3.create(),vec3.normalize(vec3.create(),vec3.cross(vec3.create(),game.camera.front,game.camera.up)),
a));pressedKeys[65]&&mat4.sub(game.camera.pos,game.camera.pos,vec3.multiply(vec3.create(),vec3.normalize(vec3.create(),vec3.cross(vec3.create(),game.camera.front,game.camera.up)),a))}
function mouseMoveInput(a){game.camera.yaw+=.1*a.movementX;game.camera.pitch-=.1*a.movementY;-89>=game.camera.pitch&&(game.camera.pitch=-89);89<=game.camera.pitch&&(game.camera.pitch=89);a=vec3.create();a[0]=Math.cos(game.camera.yaw*Math.PI/180)*Math.cos(game.camera.pitch*Math.PI/180);a[1]=Math.sin(game.camera.pitch*Math.PI/180);a[2]=Math.sin(game.camera.yaw*Math.PI/180)*Math.cos(game.camera.pitch*Math.PI/180);game.camera.front=a}
function mouseDownInput(){"playing"==game.currentState&&(canvas.requestPointerLock=canvas.requestPointerLock||canvas.mozRequestPointerLock,canvas.requestPointerLock())}var pressedKeys={};window.addEventListener("resize",resizeEvent);window.addEventListener("mousemove",mouseMoveInput);window.addEventListener("mousedown",mouseDownInput);window.onkeyup=function(a){pressedKeys[a.keyCode]=!1};window.onkeydown=function(a){pressedKeys[a.keyCode]=!0};var lastFrame=Date.now();
function render(){if("playing"==game.currentState){var a=Date.now();game.deltaTime=(a-lastFrame)/10;lastFrame=a;keyboardInput();game.camera.update();spawnObstacles();mat4.lookAt(game.viewMatrix,game.camera.pos,mat4.add(vec3.create(),game.camera.pos,game.camera.front),game.camera.up);gl.uniformMatrix4fv(gl.getUniformLocation(game.shader,"view"),!1,game.viewMatrix);gl.clearColor(0,.5,1,1);gl.clear(gl.COLOR_BUFFER_BIT|gl.DEPTH_BUFFER_BIT);for(a=0;a<game.obstacles.length;a++)game.obstacles[a].render(),game.obstacles[a].collideWithCamera()&&
(game.currentState="dead",setTimeout(function(){document.getElementById("dead-menu").style.display="block";document.getElementById("dead-menu").style.color="white";document.getElementById("score-display").style.display="none";document.getElementById("score-text").innerHTML="Score: "+game.score;canvas.style.display="none";document.body.style.backgroundImage="none";document.body.style.backgroundColor="darkred";document.exitPointerLock=document.exitPointerLock||document.mozExitPointerLock;document.exitPointerLock()},
500)),0<game.obstacles[a].pos[1]-20-game.camera.pos[1]&&game.obstacles.splice(a,1);for(a=0;a<game.powerups.length;a++)game.powerups[a].render(),game.powerups[a].update(),(0<game.powerups[a].pos[1]-20-game.camera.pos[1]||game.powerups[a].used)&&game.powerups.splice(a,1);for(a=0;a<game.walls.length;a++)game.walls[a].render();.98>sound.wind.volume&&(sound.wind.volume+=1E-4*game.deltaTime);game.score=Math.round(10*(game.score-game.camera.ySpeed))/10;document.getElementById("score-display").innerHTML=
"Score: "+game.score}requestAnimationFrame(render)}
function setVertexData(){var a=gl.createBuffer(),b=gl.createVertexArray();gl.bindVertexArray(b);gl.bindBuffer(gl.ARRAY_BUFFER,a);gl.bufferData(gl.ARRAY_BUFFER,new Float32Array([-.5,-.5,-.5,0,0,.5,-.5,-.5,1,0,.5,.5,-.5,1,1,.5,.5,-.5,1,1,-.5,.5,-.5,0,1,-.5,-.5,-.5,0,0,-.5,-.5,.5,0,0,.5,-.5,.5,1,0,.5,.5,.5,1,1,.5,.5,.5,1,1,-.5,.5,.5,0,1,-.5,-.5,.5,0,0,-.5,.5,.5,1,0,-.5,.5,-.5,1,1,-.5,-.5,-.5,0,1,-.5,-.5,-.5,0,1,-.5,-.5,.5,0,0,-.5,.5,.5,1,0,.5,.5,.5,1,0,.5,.5,-.5,1,1,.5,-.5,-.5,0,1,.5,-.5,-.5,0,1,.5,
-.5,.5,0,0,.5,.5,.5,1,0,-.5,-.5,-.5,0,1,.5,-.5,-.5,1,1,.5,-.5,.5,1,0,.5,-.5,.5,1,0,-.5,-.5,.5,0,0,-.5,-.5,-.5,0,1,-.5,.5,-.5,0,1,.5,.5,-.5,1,1,.5,.5,.5,1,0,.5,.5,.5,1,0,-.5,.5,.5,0,0,-.5,.5,-.5,0,1]),gl.STATIC_DRAW);gl.vertexAttribPointer(0,3,gl.FLOAT,!1,20,0);gl.enableVertexAttribArray(0);gl.vertexAttribPointer(1,2,gl.FLOAT,!1,20,12);gl.enableVertexAttribArray(1);return b}
function createTexture(a){var b=gl.createTexture();gl.bindTexture(gl.TEXTURE_2D,b);gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_WRAP_S,gl.REPEAT);gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_WRAP_T,gl.REPEAT);gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_MAG_FILTER,gl.NEAREST);gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_MIN_FILTER,gl.NEAREST);var c=new Image;c.onload=function(){gl.bindTexture(gl.TEXTURE_2D,b);gl.texImage2D(gl.TEXTURE_2D,0,gl.RGB,gl.RGB,gl.UNSIGNED_BYTE,c);gl.generateMipmap(gl.TEXTURE_2D)};c.src=
a;return b}
function createShader(){var a=gl.createShader(gl.VERTEX_SHADER),b=gl.createShader(gl.FRAGMENT_SHADER);gl.shaderSource(a,vsSource);gl.shaderSource(b,fsSource);gl.compileShader(a);gl.compileShader(b);var c=gl.createProgram();gl.attachShader(c,a);gl.attachShader(c,b);gl.linkProgram(c);return gl.getShaderParameter(a,gl.COMPILE_STATUS)?gl.getShaderParameter(b,gl.COMPILE_STATUS)?c:(alert("An error occurred compiling the vertex shaders: "+gl.getShaderInfoLog(b)),null):(alert("An error occurred compiling the vertex shaders: "+gl.getShaderInfoLog(a)),
null)}var vsSource="#version 300 es\nlayout (location = 0) in vec3 aPos;\nlayout (location = 1) in vec2 aTexCoord;\nout mediump vec4 texCoord;\nuniform mat4 proj;\nuniform mat4 view;\nuniform mat4 model;\nvoid main() {\n    texCoord = vec4(aTexCoord, 1.0, 1.0);\n    gl_Position = proj * view * model * vec4(aPos, 1.0);\n}\n",fsSource="#version 300 es\nout mediump vec4 FragColor;\nin mediump vec4 texCoord;\nuniform sampler2D ourTexture;\nvoid main() {\n    FragColor = texture(ourTexture, vec2(texCoord));\n}\n";var game={VAO:setVertexData(),shader:createShader(),camera:new Camera,currentState:"main",deltaTime:0,obstacles:[],walls:[],powerups:[],powerupTypes:["+score"],score:0,projectionMatrix:mat4.create(),viewMatrix:mat4.create(),modelMatrix:mat4.create()},texture={stone:createTexture("data/img/stone.png"),wall:createTexture("data/img/wall.png"),powerup:createTexture("data/img/powerup.png")},sound={wind:new Audio("data/sfx/wind.wav"),powerup:new Audio("data/sfx/powerup.wav")};
