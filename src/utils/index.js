export const copyArray = (arr) => {
    return [...arr.map((rows) => [...rows])];
  };
  
 export const getDayOfYearKey = () => {
    const now = new Date();
    const start = new Date(now.getFullYear(), 0, 0);
    const diff = now - start;
    const oneDay = 1000 * 60 * 60 * 24;
    const day = Math.floor(diff/oneDay);
    const year = new Date().getUTCFullYear();
    return `${day}${year}`;
  };

  export const getDayOfYear = () => {
    const now = new Date();
    const start = new Date(now.getFullYear(), 0, 0);
    const diff = now - start;
    const oneDay = 1000 * 60 * 60 * 24;
    const day = Math.floor(diff/oneDay);
    return day;
  };

  export const setLetters = () => {
    const twelveCommon = [ 'r', 't', 'n', 'l', 'c', 'd', 'p', 'm', 'h', 'g', 'f', 'k'];
    const nextEight = ['b', 'y', 'w', 'v', 'x', 'j', 'q', 'z'];
    const vowels = ['a', 'i', 'o', 'u'];
    const theEleven = [];
    while (theEleven.length < 2){
      var thisRun = Math.floor(Math.random() * 4)
      if (theEleven.includes(vowels[thisRun])) {
      } else {
      theEleven.push(vowels[thisRun])
      }
    }
    theEleven.push('e');
    while (theEleven.length < 7){
      var thisRun = Math.floor(Math.random() * 12)
      if (theEleven.includes(twelveCommon[thisRun])) {
      } else {
      theEleven.push(twelveCommon[thisRun])
      }
    }
    while (theEleven.length != 9){
      var thisRun = Math.floor(Math.random() * 8)
      if (theEleven.includes(nextEight[thisRun])) {
      } else {
      theEleven.push(nextEight[thisRun])
      }
    }
    

    if (theEleven.includes('q') && theEleven.includes('z')) 
    {
      theEleven.pop();
      theEleven.push('b');
    }
    if (theEleven.includes('q') && theEleven.includes('x')) 
    {
      theEleven.pop();
      theEleven.push('b');
    }
    if (theEleven.includes('x') && theEleven.includes('z')) 
    {
      theEleven.pop();
      theEleven.push('b');
    }
    if (theEleven.includes('v') && theEleven.includes('z')) 
    {
      theEleven.pop();
      theEleven.push('y');
    }    if (theEleven.includes('x') && theEleven.includes('v')) 
    {
      theEleven.pop();
      theEleven.push('y');
    }    if (theEleven.includes('v') && theEleven.includes('q')) 
    {
      theEleven.pop();
      theEleven.push('y');
    // make sure always a u with the q.
    } if (theEleven.includes('q') && theEleven.includes('o') && theEleven.includes('i') ||
          theEleven.includes('q') && theEleven.includes('a') && theEleven.includes('i') ||
          theEleven.includes('q') && theEleven.includes('o') && theEleven.includes('a')
    ) 
    {
      theEleven.splice(0,1,'u');
    } 

    // console.log("this is how many letters: ", theEleven)
    theEleven.push('s');
    while (theEleven.length < 10){
      var thisRun = Math.floor(Math.random() * 12)
      if (theEleven.includes(twelveCommon[thisRun])) {
      } else {
      theEleven.push(twelveCommon[thisRun])
      }
    }
    // console.log("this is how many letters: ", theEleven.length, theEleven)
    return theEleven;

  }
  
