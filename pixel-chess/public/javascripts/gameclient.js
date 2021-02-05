const client = new WebSocket("ws://localhost:8080");
client.binaryType = "arraybuffer";

const board = document.querySelector(".chess-board");
const state = document.querySelector("#state h3");
var possibleMoves = [];
var possibleCaptures = [];
var playerType;

//TODO parse JSON messages, depending on message.type, resolve message
client.onmessage = function (event) {
    console.log(event.data);
    let msg = JSON.parse(event.data);
    resolveMsg(msg);
}

var possible = [];
function resolveMsg(msg) {
    switch(msg.type) {
    //TODO fix captures not becoming red
    case "possibleMoves":
        console.log(msg.data);
        possibleMoves = msg.data;
        for (let move of msg.data) {
            let e = document.getElementById(move.to);
            if (move.flags === 'c' || move.flags === 'e') {
                e.style.backgroundColor = "red";
                possible.push(e);
            }else {
                e.style.backgroundColor = "green";
                possible.push(e);
            }
        }
        break;
    case "validity":
        console.log(msg.data);
        if(msg.data == "valid") {
            let from = document.getElementById(cell1);
            let to = document.getElementById(cell2);
            to.innerHTML = from.innerHTML;
            from.innerHTML = '';
        }
        break;
    case "turn":
        console.log("Your turn");
        break;
    case "opponentMove":
        console.log("Opponent's move is: "+msg.data.from+";"+msg.data.to);
        let from = document.getElementById(msg.data.from);
        let to = document.getElementById(msg.data.to);
        to.innerHTML = from.innerHTML;
        from.innerHTML = '';
        break;
    case "check":
        console.log("You're in check!");
        let king;
        if (playerType === "White") {
            king = document.getElementById("white_king")
        }
        else if (playerType === "Black") {
            king = document.getElementById("black_king")
        }
        king.style.backgroundColor = "red";
        break;
    case "gameStart":
        console.log("Game has started");
        break;
    case "playerType":
        console.log(msg.data);
        if(msg.data === "Black") {
            playerType = "Black";
        }
        else if(msg.data === "White") {
            playerType = "White";
        }
        //TODO, flip board depending on color
        break;
    case "player-disconnect":
        console.log("Opponent disconnected");
        break;
    case "win":
        console.log("You WON!");
        break;
    case "lose":
        console.log("You LOSE!");
        break;
    case "draw":
        console.log("DRAW!")
    }
}

//TODO reset all possibleMoves if another cell is selected!
//TODO send move to server if possibleMove cell is selected after click on a piece
var pieceSelected = false;
var cell1 = null;
var cell2 = null;

board.addEventListener('click', (e)=>{
    let imgCell = document.getElementById(e.target.id);
    
    if (e.target.nodeName === 'TD') {
        if (!pieceSelected) {
            cell1 = e.target.id;
            console.log("Cell1 = "+cell1);
            client.send(cell1);
            pieceSelected = true;
        }else {
            cell2 = e.target.id;
            console.log("Cell2 = "+ cell2);
            if (cell1 != null && cell2 != null) {
                console.log(cell1+";"+cell2);
                client.send(cell1+";"+cell2);
                console.log("SENT!");
                for (cell of possible){
                    cell.style.backgroundColor = "";
                }
                possible = [];
                pieceSelected = false;
                if (playerType === "White") {
                    king = document.getElementById("white_king")
                }
                else if (playerType === "Black") {
                    king = document.getElementById("black_king")
                }
                king.style.backgroundColor = "";
            }
        }
        /*
        if(imgCell.hasChildNodes()){
            console.log(e.target.id);
            //imgCell.style.borderColor = "red";
            pieceSelected = true;
        }
        */
    //TODO make it work when pressing on image as well!!!
    }else if(e.target.nodeName === 'IMG'){
        console.log(imgCell.parentElement.id);
        if (!pieceSelected) {
            cell1 = e.target.parentElement.id;
            console.log("Cell1 = "+cell1);
            client.send(cell1);
            pieceSelected = true;
        }else {
            cell2 = e.target.parentElement.id;
            console.log("Cell2 = "+ cell2);
            if (cell1 != null && cell2 != null) {
                console.log(cell1+";"+cell2);
                client.send(cell1+";"+cell2);
                console.log("SENT!");
                for (cell of possible){
                    cell.style.backgroundColor = "";
                }
                possible = [];
                pieceSelected = false;
                if (playerType === "White") {
                    king = document.getElementById("white_king")
                }
                else if (playerType === "Black") {
                    king = document.getElementById("black_king")
                }
                king.style.backgroundColor = "";
            }
        }
    }

// });

// board.addEventListener('mouseover', (e)=>{
//     // if(e.target.nodeName.toUpperCase() === 'TD'){
//     //     let cell = document.getElementById(e.target.id);
//     //     cell.firstChild.style.position = "absolute";

//     //     cell.addEventListener('mouseout', (e)=>{
//     //         cell.firstChild.style.position = null;
//     //     });
//     // }

//     if(e.target.nodeName.toUpperCase() === 'IMG'){
//         let img = document.getElementById(e.target.id);
//     }
});