(() => {

  // Declare variable that will hold either an object or array
  let games;

  // Define a global variable to track what game of the day we are on, to allow for traversal of JSON object
  let gameNum = 0;

  // Game Class 
  class Game {
    constructor(homeTeam, awayTeam, winningPitcher, losingPitcher, venue) {
      this.homeTeam = homeTeam;
      this.awayTeam = awayTeam;
      this.winningPitcher = winningPitcher;
      this.losingPitcher = losingPitcher;
      this.venue = venue;

      // Return home team's name
      this.getHomeTeam = () => {
        return this.homeTeam;
      };

      // Return away team's name
      this.getAwayTeam = () => {
        return this.awayTeam;
      };

      // Get name of winning pitcher by concatenating first and last name
      this.getWinningPitcher = () => {
        return this.winningPitcher.first + ' ' + this.winningPitcher.last;
      };

      // Return name of losing pitcher by concatenating first and last name
      this.getLosingPitcher = () => {
        return this.losingPitcher.first + ' ' + this.losingPitcher.last;
      };

      // Return name of the venue the game was played at
      this.getVenue = () => {
        return this.venue;
      };
    }
  }

  // Get JSON Asyncronously from MLB API
  async function getJSONAsync(url) {
    /**
     * Lets the user know that the button is working and that data is being loaded. 
     * Shows for a max of 10 seconds to account for slow internet.
    */
    popup("Loading...", 10);
    let res = await fetch(url)
      .then(async res => {
        let jsObject = {};
        jsObject = await res.json();
        games = jsObject.data.games.game;
        // Check if there are no games first
        if (games != undefined) {
          // Check if there are multiple games in the game property, and fill the form accordingly using the proper data type
          if (games instanceof Array) {
            fillForm(games[gameNum]);
          }
          else {
            fillForm(games);
          }
        }
        // Tell the user there are no games on specified date then clear the results of previous data
        else {
          popup('No games on specified date', 2);
          clearForm();
        }
      })
      .then((res) => {
        if (games != undefined) {
          popup("Game loaded.", 1); // Let the user know the game data is loaded once the request completes
        }
      })
      .catch(() => {
        popup("Something went wrong. Please check your internet connection", 5);
      })
  }

  // Fill the form with specified game data
  this.fillForm = gameData => {
    // Reference to elements that are going to be filled
    let homeTeamNameEl = document.getElementById('homeTeamInput');
    let awayTeamNameEl = document.getElementById('awayTeamInput');
    let winningPitcherEl = document.getElementById('winningPitcherInput');
    let losingPitcherEl = document.getElementById('losingPitcherInput');
    let venueEl = document.getElementById('venueInput');

    // Declare and define new Game object
    let game = new Game(gameData.home_team_name, gameData.away_team_name, gameData.winning_pitcher, gameData.losing_pitcher, gameData.venue);
    // Set value of elements
    homeTeamNameEl.value = game.getHomeTeam();
    awayTeamNameEl.value = game.getAwayTeam();
    winningPitcherEl.value = game.getWinningPitcher();
    losingPitcherEl.value = game.getLosingPitcher();
    venueEl.value = game.getVenue();
  }
  // Function to clear form of all data
  this.clearForm = gameData => {
    // Reference to elements that are going to be cleared
    let homeTeamNameEl = document.getElementById('homeTeamInput');
    let awayTeamNameEl = document.getElementById('awayTeamInput');
    let winningPitcherEl = document.getElementById('winningPitcherInput');
    let losingPitcherEl = document.getElementById('losingPitcherInput');
    let venueEl = document.getElementById('venueInput');

    // Clear out the form values
    homeTeamNameEl.value = '';
    awayTeamNameEl.value = '';
    winningPitcherEl.value = '';
    losingPitcherEl.value = '';
    venueEl.value = '';
  }

  // Get next game's data from game array
  this.getNextGame = () => {
    // Make sure games is not undefined before doing anything
    if (games !== undefined) {
      gameNum++;
      if (gameNum < games.length) {
        fillForm(games[gameNum]);
      } else if (games instanceof Object || gameNum >= games.length) {
        gameNum = games.length;
        popup('Last game of the day', 3);
      }
    }
  }


  // Get previous game's data from game array
  this.getPrevGame = () => {
    if (games !== undefined) {
      gameNum--;
      if (gameNum >= 0) {
        fillForm(games[gameNum]);
      } else if (games instanceof Object || gameNum <= 0) {
        popup('First game of the day', 3);
      }
    }
  }

  // Retrieve button event handler
  this.getData = (year, month, day) => {
    this.year = year;
    this.month = month;
    this.year = day;

    // Url to retrieve data from API
    let tempUrl = `http://gd2.mlb.com/components/game/mlb/year_${year}/month_${month}/day_${day}/master_scoreboard.json`;
    getJSONAsync(tempUrl);
  }


  // Create message popup for certain amount of time
  this.popup = (msg, sec) => {
    this.msg = msg;
    let errorMsgEl = document.getElementById('errorMsg');
    errorMsgEl.className = 'show';

    //Set the error message element to have the content of the message specified
    document.getElementById('errorMsg').innerHTML = msg;

    setTimeout(() => {
      errorMsgEl.className = errorMsgEl.className.replace('show', 'hide');
    }, sec * 1000);
  }

  // Function to filter input
  this.sanitizeInput = (input, regex) => {
    this.regex = regex;
    input.value = input.value.replace(this.regex, '');
  }

})();