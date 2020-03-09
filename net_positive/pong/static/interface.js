


$(document).ready(function(){

  updateScore()
  


function updateScore(){

  $("#player1tally").text(
    pong.players[0].score
  )
  $("#player2tally").text(
    pong.players[1].score
  )
}
})

