import { Meteor } from 'meteor/meteor';
import { Players } from '../imports/api/players.js';


Meteor.startup(() => {
  Meteor.publish("players", function playersPublication() {
      return Players.find();
  });

    return Meteor.methods({

        removeAllPlayers: function() {

            return Players.remove({});

        }

    });
});
