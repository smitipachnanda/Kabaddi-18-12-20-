var database, position1, position2;
var player1, player1Animation;
var player2, player2Animation;
var player1Score;
var player2Score;
var gameState = 0;
var message


function preload(){
    player1Animation = loadAnimation("assests/player1a.png", "assests/player1b.png", "assests/player1a.png");
    player2Animation = loadAnimation("assests/player2a.png", "assests/player2b.png", "assests/player2a.png");

}

function setup(){
    createCanvas(600,600);
    database = firebase.database()

    player1 = createSprite(125,300,20,20);
    player1.addAnimation("red player", player1Animation);
    player1.scale = 0.3;
    player1.frameDelay = 8;
    //player1.debug = true;
    player1.setCollider("circle", 0,0,100);

    player2 = createSprite(475,300,20,20);
    player2.addAnimation("yellow player", player2Animation);
    player2.scale = -0.3;
    player2.frameDelay = 8;
    //player2.debug = true;
    player2.setCollider("circle", 0,0,100);

    var player1Ref = database.ref('player1/position');
    player1Ref.on("value",readPosition1)  

    var player2Ref = database.ref('player2/position');
    player2Ref.on("value",readPosition2)

    var p1scoreRef= database.ref('player1Score');
    p1scoreRef.on("value",readScore1)
    
    var p2ScoreRef = database.ref('player2Score');
    p2ScoreRef.on("value",readScore2)

    var gameStateRef = database.ref('gameState');
    gameStateRef.on("value", readgameState)

}

 function draw(){
    background("white");

    centreLine();
    yellowLine();
    redLine();

    if(gameState===0){
  
        showText();

    if(keyDown("space")){
    toss()
    }

    database.ref('player1/position').update({
        x:125,
        y:300
    })
    database.ref('player2/position').update({
        x:475,
        y:300
    })

    }

    if(gameState===1){
        if(keyDown(LEFT_ARROW)){
            p1writePosition(0,-5)
        }
        if(keyDown(RIGHT_ARROW)){
            p1writePosition(0,5)
        }
        if(keyDown(UP_ARROW)){
            p1writePosition(5,0)
        }
        if(keyDown(DOWN_ARROW)){
            p1writePosition(-5,0)
        }
        if(keyDown("w")){
            p2writePosition(0,-5)
        }
        if(keyDown("s")){
            p2writePosition(0,5)
        }
    

        if(player1.x>475){
            //gameState = 3,

            database.ref('/').update({
                gameState:3,
                player1Score:player1Score + 5,
                player2Score:player2Score - 5
            
            })

           // alert("Red player wins");
            
        }
    
            if(gameState===3){
              //  showText();
                reset();   
        }

        if(player2.isTouching(player1) && player1.x<475){
          // gameState = 4

                database.ref('/').update({
                gameState:4,
                player1Score:player1Score - 5,
                player2Score:player2Score + 5,
     

            })
            alert("Red player lose")
            
        }

            if(gameState===4){
              // showText();
               reset();
    
        }
    }


        if(gameState===2){
            if(keyDown("a")){
                p2writePosition(0,-5)
            }
            if(keyDown("d")){
                p2writePosition(0,5)
            }
            if(keyDown("w")){
                p2writePosition(-5,0)
            }
            if(keyDown("s")){
                p2writePosition(5,0)
            }
            if(keyDown(LEFT_ARROW)){
                p1writePosition(0,-5)
            }
            if(keyDown(RIGHT_ARROW)){
                p1writePosition(0,5)
            }
                
                if(player2.x<125){       
                // gameState = 5,
                 database.ref('/').update({    

                    gameState:5,
                    player2Score:player2Score + 5,
                    player1Score:player1Score - 5
                })
                //alert("Yellow player wins");

                }

                if(gameState===5){

                  //  showText();
                    reset();
                }


            if(player1.isTouching(player2) && player2.x>125){
            
                   // gameState = 6
                     database.ref('/').update({
                    gameState:6,
                    player2Score:player2Score - 5,
                    player1Score:player1Score + 5,
     

                })
                alert("Yellow player lose")
            
            }

            if(gameState===6){
              //  showText();
                 reset();
            }
        }
   
            resetBtn();

    drawSprites();


    textSize(15)
    text("Yellow player score: " + player2Score,140,20 )
    text("Red player score: " + player1Score, 335,20)


}

function showText(){
    fill("blue");
    noStroke()
    textSize(20)
    text("Press Space to toss",215,300)
}

function readPosition1(data){
    position1 = data.val();
    player1.x = position1.x;
    player1.y = position1.y
}

function readPosition2(data){
    position2 = data.val();
    player2.x = position2.x;
    player2.y = position2.y
}

function readScore1(data){
    player1Score = data.val()
}

function readScore2(data){
    player2Score = data.val()
}

function readgameState(data){
gameState = data.val()
}

function centreLine(){
    for(var i = 0; i<600; i = i+20){
        strokeWeight(1)
        line(300,i,300,i+10);
    }
}

function yellowLine(){
    for(var i = 0; i<600; i = i+20){
        strokeWeight(3);
        stroke("yellow");
        line(125,i,125,i+10);
    } 
}

function redLine(){
    for(var i = 0; i<600; i = i+20){
        strokeWeight(3);
        stroke("red");
        line(475,i,475,i+10);
    } 
}

function toss(){
    var rand = Math.round(random(1,2))
    if(rand===1){
        database.ref('/').update({
            gameState:1
        })
        alert("Red player's turn")
    }

    if(rand===2){
        database.ref('/').update({
            gameState:2
        })
        alert("yellow player's turn")
    }
}

function p1writePosition(x,y){
    database.ref('player1/position').set({
        x: position1.x + x,
        y: position1.y + y
    })
}

function p2writePosition(x,y){
    database.ref('player2/position').set({
        x: position2.x + x,
        y: position2.y + y
    })
}

/*function updatep1Score(){
    database.ref('player1Score').update({
        player1Score:player1Score + 5
    })
}

function updatep2Score(){
    database.ref('player2Score').update({
        player2Score:player2Score + 5
    })
}*/

function reset(){
    database.ref('/').update({
        gameState:0,
    })

    database.ref('player1/position').update({
        x:125,
        y:300
    })
    database.ref('player2/position').update({
        x:475,
        y:300
    })
    

    }


function resetBtn(){
    var reset = createButton('Reset');
    reset.position(1250,750)
    reset.mousePressed(function(){
        clear();
        database.ref('player1/position').update({
            x:125,
            y:300
        })
        database.ref('player2/position').update({
            x:475,
            y:300
        })

        database.ref('/').update({
            gameState:0,
            player1Score:0,
            player2Score:0
        

        })

    })

}


