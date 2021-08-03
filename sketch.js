var JOGAR = 1;
var ENCERRAR = 0;
var estadoJogo = JOGAR;

var trex, trex_correndo, trex_colidiu;
var solo, soloinvisivel, imagemdosolo;

var nuvem, grupodenuvens, imagemdanuvem;
var grupodeobstaculos, obstaculo1, obstaculo2, obstaculo3, obstaculo4, obstaculo5, obstaculo6;

var pontuacao;

var imgFimDeJogo,imgReiniciar
var somSalto , somCheckPoint, somMorte


function preload(){
  trex_correndo = loadAnimation("trex1.png","trex3.png","trex4.png");
  trex_colidiu = loadAnimation("trex_collided.png");
  
  imagemdosolo = loadImage("ground2.png");
  
  imagemdanuvem = loadImage("cloud.png");
  
  obstaculo1 = loadImage("obstacle1.png");
  obstaculo2 = loadImage("obstacle2.png");
  obstaculo3 = loadImage("obstacle3.png");
  obstaculo4 = loadImage("obstacle4.png");
  obstaculo5 = loadImage("obstacle5.png");
  obstaculo6 = loadImage("obstacle6.png");
    
  imgReiniciar = loadImage("restart.png")
  imgFimDeJogo = loadImage("gameOver.png")
  
  somSalto = loadSound("jump.mp3")
  somMorte = loadSound("die.mp3")
  somCheckPoint = loadSound("checkPoint.mp3")
}

function setup() {
  createCanvas(windowWidth,windowHeight);
  
  trex = createSprite(50,height-120,20,50);
  trex.addAnimation("running", trex_correndo);
  trex.addAnimation("collided" ,trex_colidiu);
  trex.scale = 0.5;
  
  solo = createSprite(width-50,height-70,400,20);
  solo.addImage("ground",imagemdosolo);
  solo.x = solo.width /2;
    
  fimDeJogo = createSprite(width / 2,height-400);
  fimDeJogo.addImage(imgFimDeJogo);
  
  reiniciar = createSprite(width / 2,height-360);
  reiniciar.addImage(imgReiniciar);
  
  fimDeJogo.scale = 0.5;
  reiniciar.scale = 0.5;
    
  soloinvisivel = createSprite(width/2,height-65,width,10);
  soloinvisivel.visible = false  ;
   
  //criar grupos de obstáculos e de nuvens
  grupodeobstaculos = createGroup();
  grupodenuvens = createGroup();
  
  console.log("Oi" + 5);
   
  trex.setCollider("circle",0,0,40);
  //trex.debug = true
  
  pontuacao = 0;
  
}

function draw() {
  
  background(180);
  //exibindo pontuação
  text("Pontuação: "+ pontuacao, width/2,height-600);
    
  console.log("isto é ",estadoJogo)
  
  
  if(estadoJogo === JOGAR){
    fimDeJogo.visible = false
    reiniciar.visible = false
    //move o solo  
    solo.velocityX = -(4 + pontuacao/100);
    //marcando pontuação
    pontuacao = pontuacao + Math.round(frameCount/60);
    
    if (solo.x < 0){
      solo.x = solo.width/2;
    }
    
    //saltar quando a tecla de espaço é pressionada
    if(keyDown("space")&& trex.y >= height-200) {
       trex.velocityY = -12;
  }
  
    //adicionar gravidade
    trex.velocityY = trex.velocityY + 0.8
   
    //gerar as nuvens
    gerarNuvens();
  
    //gerar obstáculos no solo
    gerarObstaculos();
    
    if(grupodeobstaculos.isTouching(trex)){
       estadoJogo = ENCERRAR;   
    }
  }
     else if (estadoJogo === ENCERRAR) {
      console.log("Ei")
      fimDeJogo.visible = true;
      reiniciar.visible = true;
     
      solo.velocityX = 0;
      trex.velocityY = 0
       
      //altera a animação do Trex
      trex.changeAnimation("collided", trex_colidiu);
     
      //define o tempo de vida dos objetos do jogo para que nunca sejam destruídos
    grupodeobstaculos.setLifetimeEach(-1);
    grupodenuvens.setLifetimeEach(-1);
     
     grupodeobstaculos.setVelocityXEach(0);
     grupodenuvens.setVelocityXEach(0);   
       
       if(mousePressedOver(reiniciar)){
         reset();
       }
       
     }
  
  
  //evita que o Trex caia no solo
  trex.collide(soloinvisivel);

  
  
  drawSprites();
}

function gerarObstaculos(){
 if (frameCount % 60 === 0){
   var obstaculo = createSprite(400,height-90,10,40);
  obstaculo.velocityX = -(6 + pontuacao/100);
      
    //gerar obstáculos aleatórios
    var rand = Math.round(random(1,6));
    switch(rand) {
      case 1: obstaculo.addImage(obstaculo1);
              break;
      case 2: obstaculo.addImage(obstaculo2);
              break;
      case 3: obstaculo.addImage(obstaculo3);
              break;
      case 4: obstaculo.addImage(obstaculo4);
              break;
      case 5: obstaculo.addImage(obstaculo5);
              break;
      case 6: obstaculo.addImage(obstaculo6);
              break;
      default: break;
    }
   
    //atribuir escala e tempo de duração ao obstáculo         
    obstaculo.scale = 0.5;
    obstaculo.lifetime = 300;
   
    //adicionar cada obstáculo ao grupo
    grupodeobstaculos.add(obstaculo);
 }
  
}

function gerarNuvens() {
  //escreva o código aqui para gerar as nuvens 
  if (frameCount % 60 === 0) {
    nuvem = createSprite(600,height-200,40,10);
    nuvem.y = Math.round(random(10,60));
    nuvem.addImage(imagemdanuvem);
    nuvem.scale = 0.5;
    nuvem.velocityX = -(3 + pontuacao/100);
    
     //atribuir tempo de duração à variável
    nuvem.lifetime = 134; 
    
    //ajustando a profundidade
    nuvem.depth = trex.depth;
    trex.depth = trex.depth + 1;
        
    //adiciondo nuvem ao grupo
   grupodenuvens.add(nuvem);
  }
}
function reset(){
  estadoJogo = JOGAR
   fimDeJogo.visible = false
   reiniciar.visible = false
  
  grupodeobstaculos.destroyEach()
  grupodenuvens.destroyEach()
  
  pontuacao = 0
  
  trex.changeAnimation("running", trex_correndo)
}
