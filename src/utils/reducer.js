// utils/reducer.js

const initialState = {
    hasPurchased_sixs_3dollar_unlimited: false,
    challenge: false,
    noTimer: false,
    score: 0,
    highScore: 0,
    maxScore: 100,
    streak: 0,
    lastPlayedDate: null,
    highScorePercentage: 0, 
  };
  
  const reducer = (state = initialState, action) => {
    switch (action.type) {
      case 'UPDATE_HAS_PURCHASED':
        if (!state.hasPurchased_sixs_3dollar_unlimited) {
          // Only update the state if the variable is currently false
          return {
            ...state,
            hasPurchased_sixs_3dollar_unlimited: action.payload,
          };
        }
        // If the variable is already true, return the current state without updating
        return state;
    case 'SET_CHALLENGE':
      return {
        ...state,
        challenge: action.payload,
      };
    case 'SET_TIMER':
      return {
        ...state,
        noTimer: action.payload,
      };
    case 'SET_GAME_MODE':
      return {
        ...state,
        gameMode: action.payload
      };
    case "UPDATE_MAX_SCORE":
      return {
        ...state,
        maxScore: action.payload // Update the maxScore with the payload value
      };
    case "INCREMENT_SCORE":
      const newScore = state.score + action.payload;
      const newHighScore = newScore > state.highScore ? newScore : state.highScore;
      const newHighScorePercentage = (newHighScore / state.maxScore) * 100; // Use the state value for maxScore to calculate the percentage
      
      // let newStreak = state.streak; // Initialize newStreak to the current streak value
      
      // if (!state.lastPlayedDate || currentDate !== lastPlayedDate) {
      //   newStreak = 0;
      // }
      
      newStreak++; // Increment the streak by 1
      return {
        ...state,
        score: newScore,
        highScore: newHighScore,
        highScorePercentage: newHighScorePercentage,
        // streak: newStreak,
        lastPlayedDate: currentDate // Update the lastPlayedDate
      };
    case "RESET_SCORE":
      return {
        ...state,
        score: 0
      };
// Other cases for other actions
    default:
      return state;
  }
  };
  
  
  export default reducer;
  