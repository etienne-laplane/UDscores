import { Players } from '../imports/api/players.js';

var scores=[];
var scoresSort=[];
var colors=["#ce3c99",
		   "#a28c8c",
		   "#ca1111",
		   "#70b096",
		   "#e896ec",
		   "#32374d",
		   "#6676c8",
		   "#be6600",
		   "#bd9c5c",
		   "#ffcc06"];

Template.udcClassement.viewmodel({
  counter: 2000,
  sortable: '',
  players: function(){
    return Players.find();
  },
  onRendered: function(){
    var el = document.getElementById('players');

    setTimeout(() => {
      this.sort();
    },750);
  },
  sort: function() {
	  setTimeout(function(){
    $('.player').sort(function(a, b){return parseInt($(a).attr("data-score")) < parseInt($(b).attr("data-score"))}).each(function(index){
      switch(index){
        case 0:
          $(this).css("background-color", "rgba(0,0,0,0.1)");
          $(this).find(".player-name").css("border-left", "10px solid #E2C23B");
          break;
        case 1:
          $(this).css("background-color", "rgba(0,0,0,0.3)");
          $(this).find(".player-name").css("border-left", "10px solid silver");
          break;
        case 2:
          $(this).css("background-color", "rgba(0,0,0,0.5)");
          $(this).find(".player-name").css("border-left", "10px solid #9c836e");
          break;
        default:
          $(this).css("background-color", "rgba(0,0,0,0.6)");
          $(this).find(".player-name").css("border-left", "10px solid rgba(0,0,0,0)");
          break;
      }
    });
	  },3500);

    setTimeout(function(){
      $('#players').mixItUp({
        animation: {
          effects: 'stagger',
          duration: 1000
        },
        controls: {
          enable: false
        }
      });

      $('#players').mixItUp('sort', 'score:desc');
    },1200);
  }
});

Template.addPlayerForm.viewmodel({
  addPlayer: function(){
	  scores.push([]);
	  scoresSort.push([]);
    if(this.name() != '' && this.score() != ''){
      Players.insert({
        name: this.name(),
        score: parseInt(this.score()),
        tmpPoints: 0+parseInt(this.tmpPoints())
      })
    }
  },
  name: '',
  score: '',
  tmpPoints: ''
});

Template.updatePlayerForm.viewmodel({
  players: function(){
    return Players.find();
  },
  score: '',
  selected: '0',
  updatePlayers: function(){
    var _this = this;
    $(".player-points").each(function(index) {
		scores[index].push($(this).val());
		scoresSort[index].push($(this).val());
		scoresSort[index].sort(function(a,b){return parseInt(b)-parseInt(a)});console.log(scoresSort);
		var color="#e8b258";
		var deuxpluspetit=0;
		for(var jeu=0;jeu <scores[index].length;jeu++){
			if(parseInt(scores[index][jeu])<parseInt($(this).val())){
				deuxpluspetit++;
			}
		}
		if(deuxpluspetit<2){
			//faut aller chercher la couleur du #3
			var scoreachercher=scoresSort[index][scoresSort[index].length-3];
			var indexatrouver=0;
			for(var jeu=0;jeu <scores[index].length;jeu++){
				if(scoreachercher==scores[index][jeu]){
					indexatrouver=jeu;
				}
			}
			color=colors[indexatrouver];
		}
		else{
			console.log("ZOPH HAMSTERBALL");
			color = colors[scores[index].length-1];
		}
		

		var total=0;
		for(var i=0;i<scoresSort[index].length-2;i++){
			total=total+parseInt(scoresSort[index][i]);
		}
		var toadd = total-parseInt($('#'+$(this).attr('data-id')+' .score-total').text());
		if(toadd==0){
			color="#000000";
		}
        setTimeout(() => {
          _this.updatePlayer($(this).attr('data-id'), "0"+toadd,color);
          $(this).val('');
          if (index === $(".player-points").length - 1) {
            setTimeout(function(){
              $("canvas").remove();
              _this.parent().sort();
            },4000);
          }
          }, index * 4500);
    });
  },
  updatePlayer: function(id, tmpPoints, color){
    var _this = this;

    $('#'+id+' .score-to-add').css("opacity", "1");
    $('#'+id+' .score-to-add').css("width", "600px");
    $('#'+id+' .score-to-add').css("height", "600px");
    $('#'+id+' .score-to-add').css("line-height", "600px");
    $('#'+id+' .score-to-add').attr("visible", true);
	$('#'+id+' .score-to-add').css("background-color", color);

    this.animeCanvas();

    Players.update(id, { $set: {
      tmpPoints: 0 + parseInt(tmpPoints)
    }});

    setTimeout(function(selectedPlayer) {
      $('#'+selectedPlayer+' .score-to-add').css("opacity","0");

      setTimeout(function(){
        $('#'+selectedPlayer+' .score-to-add').css("width", "0px");
        $('#'+selectedPlayer+' .score-to-add').css("height", "0px");
        $('#'+selectedPlayer+' .score-to-add').css("line-height", "0px");
		
      },1000);

      $('#'+selectedPlayer+' .score-to-add').attr("visible", false);

      var player = Players.findOne(selectedPlayer);
      var total = player.score + parseInt(player.tmpPoints);
	  if (parseInt(tmpPoints)==0){
		  
	  }else{
      var interval = setInterval(() => {
        var scoreTotal = parseInt($('#'+selectedPlayer+' .score-total').text());
        if(scoreTotal === total){
          clearInterval(interval);
          $('#'+selectedPlayer+' .score-total').text('');
          Players.update(player._id, { $set: {
            tmpPoints: 0,
            score: player.score + parseInt(player.tmpPoints)
          }});
        } else {
          $('#' + selectedPlayer + ' .score-total').text(scoreTotal + 1);
        }

      }, 5);}
    }, 3000, id);
  },
  animeCanvas: function(){
    var lines = [];

    var scene = new THREE.Scene();
    var camera = new THREE.PerspectiveCamera( 75, 550 / 100, 1, 1000 );
    camera.position.set(0,0,100);
    camera.lookAt(new THREE.Vector3(0, 0, 0));

    var renderer = new THREE.WebGLRenderer({ alpha: true } );
    renderer.setSize( 550, 100 );


    function createLine() {
      var width=Math.floor(Math.random()*4+1);
      var height=Math.floor(Math.random()*99+20);
      var opacity=1;
      switch(width){
        case 4:
          opacity= 0.4;
          break;
        case 3:
          opacity= 0.3;
          break;
        case 2:
          opacity= 0.2;
          break;
        case 1:
          opacity= 0.1;
          break;
      }

      var geometry = new THREE.BoxGeometry(width,height,1);
      var material = new THREE.MeshBasicMaterial( { color: 0xFFFFFF, transparent: true, opacity: opacity } );

      var speed = Math.random()*3+0.5;

      var line = [new THREE.Mesh( geometry, material), speed];

      var num = Math.floor(Math.random()*150) + 1;
      num *= Math.floor(Math.random()*2) == 1 ? 1 : -1;

      line[0].position.x = num;
      line[0].position.y = -150;
      line[0].width = 3;

      scene.add(line[0]);

      lines.push(line);
    }

    function render() {
      requestAnimationFrame( render );
      for(var i=0; i<lines.length; i++){
        lines[i][0].translateY(lines[i][1]);
      }
      renderer.render( scene, camera );
    }

    $('.score-to-add[visible=true]').append(renderer.domElement);


    for(var i=0;i<50;i++)
      createLine();

    render();
  }
});

Template.substractPlayerForm.viewmodel({
  players: function(){
    return Players.find();
  },
  score: '',
  tmpPoints: '',
  selected: '0',
  substractPlayer: function(){
    if(this.tmpPoints != '') {

      var player = Players.findOne(this.selected());
      var total = parseInt(player.score) - parseInt(this.tmpPoints());

      Players.update(this.selected(), {
        $set: {
          score: total
        }
      }, () => {
        this.parent().sort();
      });

      this.tmpPoints('');
    }
  }
});

Template.reset.viewmodel({
  reset: function(){
    var r = confirm("On supprime tout ?");
    if(r==true)
      Meteor.call('removeAllPlayers')
  }
});
