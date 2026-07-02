(function(){
  "use strict";

  const header = document.getElementById('mainHeader');
  const footer = document.getElementById('mainFooter');
  const headerLogo = document.getElementById('headerLogo');

  let userInteracted = false;
  let autoTimer = null;

  function revealHeaderFooter() {
    if (header) header.classList.add('visible');
    if (footer) footer.classList.add('visible');
    if (headerLogo) headerLogo.classList.add('visible');
  }

  function setupAutoTrigger() {
    autoTimer = setTimeout(() => {
      if (!userInteracted) revealHeaderFooter();
      autoTimer = null;
    }, 3000);   // 3‑second delay before revealing header/footer
  }

  // Click anywhere to reveal immediately
  document.addEventListener('click', () => {
    userInteracted = true;
    if (autoTimer) {
      clearTimeout(autoTimer);
      autoTimer = null;
    }
    revealHeaderFooter();
  }, { once: true });

  setupAutoTrigger();

  // ========== 100 RANDOM QUESTIONS ==========
  const homeQuestions = [
    "If a blind man suddenly gains the gift of sight, will he still walk with his eyes closed?",
    "What is the sound of one hand clapping?",
    "Does the light exist without darkness?",
    "If God is all‑powerful, can He create a rock so heavy He cannot lift it?",
    "What lies at the edge of the universe?",
    "Why does the firefly glow, even when no one sees?",
    "Is the universe a thought in the mind of a sleeping giant?",
    "What colour is the wind?",
    "If a tree falls in a forest and no one is around, does it make a sound?",
    "Can silence speak louder than words?",
    "Why does time only move forward?",
    "What existed before the beginning?",
    "Does the soul have a weight?",
    "If love is infinite, why do we measure it?",
    "What is the shape of emptiness?",
    "Can a mirror reflect itself?",
    "Where does the flame go when the candle is blown out?",
    "Why does the moon follow us when we walk?",
    "What is the distance between two thoughts?",
    "Does the bird know it is singing?",
    "If the stars could speak, what would they say?",
    "What colour are the dreams of the blind?",
    "Why does sorrow carve deeper than joy?",
    "If water remembers, what stories do raindrops tell?",
    "Can the infinite be contained in a single grain of sand?",
    "What is the taste of mercy?",
    "Why does the heart beat without permission?",
    "Does the mountain feel the wind eroding its face?",
    "If numbers are infinite, why do we count them?",
    "What is the quietest sound in the world?",
    "Why do shadows disappear when we look at them?",
    "Does the ocean dream of the shore?",
    "What is the colour of forgiveness?",
    "If the wind could draw, what would its art look like?",
    "Why does the sun rise every morning?",
    "What is the weight of a promise?",
    "Can you catch a sunbeam in your hand?",
    "If a star dies, does its light live forever?",
    "Why does the river never stop flowing?",
    "What is the taste of truth?",
    "Does the flower feel the bee's kiss?",
    "If the universe is expanding, what is it expanding into?",
    "Why does the moon have a face?",
    "What is the song of the spheres?",
    "Can silence be heard?",
    "If the world is a stage, who is the audience?",
    "What is the colour of hope?",
    "Why does the nightingale sing only at night?",
    "Does the sunrise know it is beautiful?",
    "What is the scent of memory?",
    "If God is love, why is there hate?",
    "Can a thought be seen?",
    "What is the sound of a rainbow?",
    "Why does the heart ache for what it cannot have?",
    "Does the seed know it will become a forest?",
    "What is the taste of freedom?",
    "If the eyes are the windows to the soul, what do tears see?",
    "Why does the dawn break if the night was already broken?",
    "Is the shadow cast by the soul longer than the shadow cast by the body?",
    "Does the echo know the voice that gave it life?",
    "What is the weight of a sigh?",
    "Can a prayer be measured in decibels?",
    "If the universe is a canvas, who holds the brush?",
    "Why does the butterfly forget its caterpillar past?",
    "What is the distance between a question and its answer?",
    "Does the mountain bow to the sky, or the sky to the mountain?",
    "If God is everywhere, why do we search for Him?",
    "What is the fragrance of a memory?",
    "Can a broken heart become whole without leaving scars?",
    "Why do rivers flow to the sea, knowing they will never return?",
    "What is the color of the moment before dawn?",
    "If truth is a diamond, how many facets does it have?",
    "Does the star know it guides the lost?",
    "What song does the silence sing?",
    "Is the firefly a fallen star that forgot how to die?",
    "Why does the human heart long for the infinite?",
    "What is the name of the wind that never stops?",
    "Can you count the raindrops that fell on the just and the unjust?",
    "If the mind can travel to the edge of the universe, is the body truly its prison?",
    "What is the taste of eternity?",
    "Does the seed dream of the tree it will become?",
    "Why does the nightingale sing when the world is asleep?",
    "Can you hear the grass growing?",
    "What is the weight of a feather in the hand of God?",
    "If the stars are the footprints of angels, where are they walking?",
    "Why does the candle weep while it gives light?",
    "Is the ocean's depth a reflection of the sky's depth?",
    "What is the sound of a soul being born?",
    "Can a word change the course of the universe?",
    "Why does the sun share its warmth with both the good and the evil?",
    "What is the texture of a dream?",
    "If the heart is a compass, what is its true north?",
    "Does the dust remember the star it came from?",
    "What is the language spoken by the birds at dawn?",
    "Can a tear wash away a sin?",
    "Why does the horizon always recede?",
    "What is the shape of a prayer?",
    "If the soul is a garden, who tends it?",
    "Does the silence after a storm hold more than the storm itself?",
    "What is the temperature of grace?",
    "Why does the universe exist instead of nothing?"
  ];

  const randomIndex = Math.floor(Math.random() * homeQuestions.length);
  const questionElement = document.getElementById('homeQuestion');
  if (questionElement) {
    questionElement.textContent = homeQuestions[randomIndex];
  }
})();