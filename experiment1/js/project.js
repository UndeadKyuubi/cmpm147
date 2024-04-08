// project.js - A program to generate a stories of wild west duels with weird and wacky twists
// Author: Brandon Jacobson
// Date: 4/7/2024

function main() {
  const fillers = {
    mood: ["scary", "weak", "brave", "frail", "strong", "lonely", "honorable", "forlorn", "happy", "nerdy", "frightened"],
    item: ["smelly fish", "pool noodle", "sock full of tumbleweeds", "sharpened banana", "frozen ferret", "popsicle stick", "imaginary gun", "venus flytrap", "pocket full of sand", "cactus on a stick", "thrown playing cards", "a handful of poker chips"],
    num: ["two", "three", "twenty", "so many", "too many", "an unsatisfying number of", "barely any", "an unspecified amount of", "surely a satisfactory number of"],
    looty: ["gleaming", "valuable", "esteemed", "rare", "exalted", "scintillating", "kinda gross but still usefull", "complete garbage"],
    loots: ["coins", "chalices", "ingots", "hides", "boots", "cowboy hats", "razors", "combs", "pants"],
    cowboy: ["Buffalo Bill", "Billy the Kid", "Butch Cassidy", "Doc Holliday", "Annie Oakley", "Jesse James", "Wyatt Earp", "Billy Stiles", "Wild Bill Hickok", "John Wesley Hardin"],
    date: ["tonight", "tomorrow", "in a week", "in a month", "in two months", "in six months", "in a year", "in 5 years", "in 10 years"],
    time: ["3am", "4am", "5am", "midnight", "high noon", "2:47 pm exactly"],
    place: ["the saloon", "the old church", "the barbershop", "the old, dusty storage closet", "the cemetary", "the haunted creek", "the middle of nowhere", "the hills", "the desert by that one weird looking cactus"],
    prob: ["unlikely", "exceedingly unlikely", "highly unlikely", "likely", "exceedingly likely", "highly likely", "very likely", "very very likely", "very unlikely", "very very unlikely"],
    steps: ["two", "five", "ten", "twenty", "fifty", "one hundred", "five hundred", "one thousand", "five thousand", "ten thousand", "one hundred thousand", "one million"],
    weather: ["rainy", "foggy", "sunny with clear skies", "hot", "cold", "humid", "snowy"],
    
  };
  
  const template = `$cowboy, I challenge you to a duel! You are very $mood and I think it would be a thrilling fight!
  
  Should you accept, it will take place $date at $time in $place! In the $prob event that you win the duel, I will grant you the boon of $num $looty $loots!
  
  I shall explain the rules for you! We will each choose our weapon first. Personally, I will be using a $item as my weapon! You won't stand a chance!
  
  Then we will each turn our backs to one another and take $steps paces. Then we will wait for the convenient, cinematic tumbleweed to cross between us before turning around!
  
  It will surely be a duel for the ages! So, are you interested? Oh... but uh, if it ends up being $weather on the day of the duel, then we will reschedule it.
  `;
  
  
  // STUDENTS: You don't need to edit code below this line.
  
  const slotPattern = /\$(\w+)/;
  
  function replacer(match, name) {
    let options = fillers[name];
    if (options) {
      return options[Math.floor(Math.random() * options.length)];
    } else {
      return `<UNKNOWN:${name}>`;
    }
  }
  
  function generate() {
    let story = template;
    while (story.match(slotPattern)) {
      story = story.replace(slotPattern, replacer);
    }
  
    /* global box */
    $("#box").text(story);
  }
  
  /* global clicker */
  $("#clicker").click(generate);
  
  generate();
}

// let's get this party started - uncomment me
main();