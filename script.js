

$(document).ready(function() {
    var board = [
        [null, null, null],
        [null, null, null],
        [null, null, null]
      ],
      me = "",
      opponent = "",
      myMark = "",
      oppoMark = "",
      myScore = 0,
      opponentScore = 0,
      turn,
      alternate = false,
      player = "alternate",
      difficulty = "impossible";
  
    $("#settings-button").click(function() {
      $("#filter").css('display', 'block');
      $("#settings").css('display', 'inline-block').addClass("animated flipInX");
      window.setTimeout(function() {
        $("#filter").css('opacity', '0.9');
      }, 10);
    });
    $("#start").click(function() {
      myScore = 0;
      opponentScore = 0;
      $(".score-text").html('0');
      $("#filter").css('opacity', '0');
      $("#settings").addClass("animated flipOutX");
      window.setTimeout(function() {
        $("#filter").css('display', 'none');
        $("#settings").css('display', 'none').removeClass("animated flipOutX");
      }, 400);
      reset();
    });
    $("#cross").click(function() {
      player = "cross";
      $(this).css('background-color', '#555');
      $("#alternate, #circle").css('background-color', 'transparent');
    });
    $("#alternate").click(function() {
      player = "alternate";
      $(this).css('background-color', '#555');
      $("#cross, #circle").css('background-color', 'transparent');
    });
    $("#circle").click(function() {
      player = "circle";
      $(this).css('background-color', '#555');
      $("#alternate, #cross").css('background-color', 'transparent');
    });
    $("#easy").click(function() {
      difficulty = "stupid";
      $(this).css('background-color', '#555');
      $("#medium, #hard").css('background-color', 'transparent');
    });
    $("#medium").click(function() {
      difficulty = "normal";
      $(this).css('background-color', '#555');
      $("#easy, #hard").css('background-color', 'transparent');
    });
    $("#hard").click(function() {
      difficulty = "impossible";
      $(this).css('background-color', '#555');
      $("#easy, #medium").css('background-color', 'transparent');
    });
  
    reset();
  
    $(".square").click(function() {
      if ($(this).html() == "" && turn == opponent) {
        $(this).html(oppoMark);
        var m = $(this).attr('id').charAt(7),
          n = $(this).attr('id').charAt(8);
        board[m][n] = opponent;
        if (checkWin(opponent, board, true)) {
          console.log(opponent + " wins!");
          opponentScore++;
          $("#score-opponent").html(opponentScore);
        window.setTimeout(function() {
          reset();
        }, 2000);
        } else if (checkTie(board)) {
        console.log("It's a tie!");
        $(".mark").addClass('animated zoomOut');
        window.setTimeout(function() {
          reset();
        }, 400); 
        } else {
          blink(me);
          window.setTimeout(function() {
            myTurn();
          }, 500);
        }
      }
    });
  
    function beginGame() {
      var m = Math.floor(Math.random() * 3);
      var n = Math.floor(Math.random() * 3);
      if (board[m][n] == null) {
        window.setTimeout(function() {
          board[m][n] = me;
          $("#square-" + m + n).html(myMark);
          blink(opponent);
        }, 500);
      } else {
        beginGame();
      }
    }
  
    function myTurn() {
      board = chooseMove();
      blink(opponent);
      for (var m = 0; m < 3; m++) {
        for (var n = 0; n < 3; n++) {
          if (board[m][n] == me) {
            $("#square-" + m + n).html(myMark);
          } else if (board[m][n] == opponent) {
            $("#square-" + m + n).html(oppoMark);
          }
        }
      }
      if (checkWin(me, board, true)) {
        console.log(me + " wins!");
        myScore++;
        $("#score-mine").html(myScore);
        window.setTimeout(function() {
          reset();
        }, 2000);
      } else if (checkTie(board)) {
        console.log("It's a tie!");
        $(".mark").addClass('animated zoomOut');
        window.setTimeout(function() {
          reset();
        }, 400); 
      }
    }
  
    function checkWin(player, thisBoard, forReal) {
      function blinkSquares(square0, square1, square2) {
        turn = 'none';
        var mark;
        if (player == me) {mark = myMark;}
        else {mark = oppoMark;}
        window.setTimeout(function() {$("#square-"+square0+", #square-"+square1+", #square-"+square2).html('');},100);
        window.setTimeout(function() {
        $("#square-"+square0+", #square-"+square1+", #square-"+square2).html(mark);}, 600);
        window.setTimeout(function() {
        $("#square-"+square0+", #square-"+square1+", #square-"+square2).html('');}, 1100);
        window.setTimeout(function() {
        $("#square-"+square0+", #square-"+square1+", #square-"+square2).html(mark);
        $(".mark").addClass('animated zoomOut');}, 1600);
      }
      for (var m = 0; m < 3; m++) {
        if (thisBoard[m][0] == player && thisBoard[m][1] == player && thisBoard[m][2] == player) {
          if (forReal) {blinkSquares(m+'0',m+'1',m+'2');}
          return (true);
        }
      }
      for (var n = 0; n < 3; n++) {
        if (thisBoard[0][n] == player && thisBoard[1][n] == player && thisBoard[2][n] == player) {
          if (forReal) {blinkSquares('0'+n,'1'+n,'2'+n);}
          return (true);
        }
      }
      if (thisBoard[0][0] == player && thisBoard[1][1] == player && thisBoard[2][2] == player) {
        if (forReal) {blinkSquares('00','11','22');}
        return (true);
      }
      if (thisBoard[0][2] == player && thisBoard[1][1] == player && thisBoard[2][0] == player) {
        if (forReal) {blinkSquares('02','11','20');}
        return (true);
      }
      return (false);
    }
  
    function checkTie(thisBoard) {
      var tie = true;
      for (var m = 0; m < 3; m++) {
        for (var n = 0; n < 3; n++) {
          if (thisBoard[m][n] == null) {
            tie = false;
          }
        }
      }
      return tie;
    }
  
    function getPayoff(thisBoard) {
      if (checkWin(me, thisBoard)) {
        return (1);
      } else if (checkWin(opponent, thisBoard)) {
        return (-1);
      } else if (checkTie(thisBoard)) {
        return (0);
      } else {
        return (null);
      }
    }
  
    function makeTree(thisBoard, player, depth) {
  
      var tree = [];
      var otherPlayer;
      if (player == me) {
        otherPlayer = opponent;
      } else {
        otherPlayer = me;
      }
      if (!depth) {
        depth = 0;
      }
      for (var m = 0; m < 3; m++) {
        for (var n = 0; n < 3; n++) {
          if (thisBoard[m][n] == null) {
            var newBoard = JSON.parse(JSON.stringify(thisBoard));
            newBoard[m][n] = player;
            if (difficulty == "stupid") {
              tree.push({
                player: player,
                board: newBoard,
                payoff: null,
                branches: null
              });
            } else {
              var payoff = getPayoff(newBoard);
              var branches = null;
              if (payoff == null && difficulty == "impossible" || payoff == null && difficulty == "normal" && depth < 2 || payoff == null && difficulty == "hard" && depth < 4) {
                branches = makeTree(newBoard, otherPlayer, depth + 1);
              }
              tree.push({
                player: player,
                board: newBoard,
                payoff: payoff,
                branches: branches
              });
            }
          }
        }
      }
      for (var key in tree) {
        if (tree[key].payoff == null) {
          tree[key].payoff = miniMax(tree[key]);
        }
      }
      return tree;
    }
  
    function miniMax(thisNode) {
      var payoffs = [];
      for (var key in thisNode.branches) {
        payoffs.push(thisNode.branches[key].payoff);
      }
      if (thisNode.player == opponent) {
        return Math.max.apply(null, payoffs);
      } else {
        return Math.min.apply(null, payoffs);
      }
    }
  
    function chooseMove() {
      var tree = makeTree(board, me);
      var win = [],
        tie = [],
        dunno = [],
        lose = [];
      for (var key in tree) {
        switch (tree[key].payoff) {
          case 1:
            win.push(tree[key].board);
            break;
          case 0:
            tie.push(tree[key].board);
            break;
          case -1:
            lose.push(tree[key].board);
            break;
          default:
            dunno.push(tree[key].board);
            break;
        }
      }
      if (win.length > 0) {
        return win[Math.floor(Math.random() * win.length)];
      }
      if (tie.length > 0) {
        return tie[Math.floor(Math.random() * tie.length)];
      }
      if (dunno.length > 0) {
        return dunno[Math.floor(Math.random() * dunno.length)];
      }
      return lose[Math.floor(Math.random() * lose.length)];
    }
  
    function blink(player) {
      var icon;
      turn = player;
      if (player == me) {
        icon = ".fa-laptop";
      } else {
        icon = ".fa-user";
      }
      $(icon).css('color', '#4d4');
      window.setTimeout(function() {
        $(icon).css('color', '#bbb');
      }, 500);
      window.setTimeout(function() {
  
        if (player == turn) {
          blink(player);
        }
      }, 1000);
    }
  
    function reset() {
      board = [
        [null, null, null],
        [null, null, null],
        [null, null, null]
      ];
      $(".square").html('');
      if (player == "circle" || player == "alternate" && alternate) {
        me = "x",
          opponent = "o",
          myMark = '<i class="mark fa fa-times"></i>',
          oppoMark = '<i class="mark fa fa-circle-o"></i>';
        blink(me);
        beginGame();
      } else {
        me = "o",
          opponent = "x",
          myMark = '<i class="mark fa fa-circle-o"></i>',
          oppoMark = '<i class="mark fa fa-times"></i>';
        blink(opponent);
      }
      alternate = !alternate;
    }
  });