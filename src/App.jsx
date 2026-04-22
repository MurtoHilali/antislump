import { useState, useEffect, useMemo, useCallback, useRef, createContext, useContext } from "react";

/* ── STORAGE KEY ── */
const DONE_KEY = "mini_projects_done_v1";

/* ── CATEGORY CONFIG ── */
const CAT_CONFIG = {
  "Writing":               { icon: "✍️",  hue: 35  },
  "Art & Drawing":         { icon: "🎨",  hue: 15  },
  "Coding":                { icon: "💻",  hue: 200 },
  "Bioinformatics":        { icon: "🧬",  hue: 155 },
  "Music":                 { icon: "🎵",  hue: 270 },
  "Fitness":               { icon: "🏃",  hue: 130 },
  "Cooking":               { icon: "🍳",  hue: 45  },
  "Photography":           { icon: "📷",  hue: 55  },
  "Science & Learning":    { icon: "🔬",  hue: 190 },
  "Mindfulness":           { icon: "🧘",  hue: 320 },
  "Language":              { icon: "🌐",  hue: 210 },
  "Game Design":           { icon: "🎲",  hue: 340 },
  "Craft & Making":        { icon: "✂️",  hue: 0   },
  "Social & Community":    { icon: "🤝",  hue: 180 },
  "Productivity":          { icon: "⚡",  hue: 90  },
  "Travel & Exploration":  { icon: "🗺️",  hue: 30  },
  "Personal Development":  { icon: "🚀",  hue: 220 },
  "Creative":              { icon: "💫",  hue: 285 },
  "DIY & Woodworking":     { icon: "🔨",  hue: 25  },
  "Gardening & Outdoors":  { icon: "🌱",  hue: 110 },
  "Fashion & Upcycling":   { icon: "🧵",  hue: 300 },
  "AI & Automation":       { icon: "🤖",  hue: 185 },
  "Data Science & ML":     { icon: "📊",  hue: 230 },
  "Hardware & Electronics":{ icon: "⚙️",  hue: 40  },
  "Wildcard":              { icon: "🎯",  hue: 0   },
};

function catColor(cat, alpha = 1) {
  const h = CAT_CONFIG[cat]?.hue ?? 200;
  return `hsla(${h},70%,65%,${alpha})`;
}
function catBg(cat, alpha = 0.12) {
  const h = CAT_CONFIG[cat]?.hue ?? 200;
  return `hsla(${h},70%,55%,${alpha})`;
}
function catColorL(cat, alpha = 1) {
  const h = CAT_CONFIG[cat]?.hue ?? 200;
  return `hsla(${h},65%,38%,${alpha})`;
}
function catBgL(cat, alpha = 0.12) {
  const h = CAT_CONFIG[cat]?.hue ?? 200;
  return `hsla(${h},65%,50%,${alpha})`;
}

const ThemeCtx = createContext(true); // true = dark

/* ── DATA (1000+ ideas) ── */
const ALL_IDEAS = [
  // ─── WRITING (1-80) ───
  {id:1,cat:"Writing",title:"6-Word Memoir",desc:"Compress your entire life story into exactly six words. Iterate until it's honest."},
  {id:2,cat:"Writing",title:"One-Page Short Story",desc:"Write a complete story—beginning, tension, and resolution—on a single page."},
  {id:3,cat:"Writing",title:"Yelp Review of Your Childhood Home",desc:"Rate and review your childhood home like a restaurant. Be brutally honest."},
  {id:4,cat:"Writing",title:"Letter to Your 10-Year-Old Self",desc:"Write with real advice, real warnings, and genuine encouragement."},
  {id:5,cat:"Writing",title:"Wikipedia Article for a Fake Town",desc:"Invent a town. Write its full Wikipedia entry: history, demographics, notable residents."},
  {id:6,cat:"Writing",title:"Instruction Manual for an Emotion",desc:"Write assembly-style instructions for feeling a specific emotion. Include warnings."},
  {id:7,cat:"Writing",title:"Villain Origin Story (1 page)",desc:"Give a genuinely compelling backstory to a villain you invent from scratch."},
  {id:8,cat:"Writing",title:"Newspaper Front Page from 2150",desc:"Write three headline articles from a newspaper 125 years in the future."},
  {id:9,cat:"Writing",title:"Haiku Sequence (10 haikus)",desc:"Write 10 thematically linked haikus that collectively tell a story."},
  {id:10,cat:"Writing",title:"Overheard Conversation",desc:"Write a complete, vivid conversation between two strangers you invent."},
  {id:11,cat:"Writing",title:"Bedtime Story for Adults",desc:"Write a genuinely relaxing bedtime story—for grown-ups and their actual anxieties."},
  {id:12,cat:"Writing",title:"Product Listing for an Invisible Object",desc:"Write an Amazon-style listing for something that can't be seen or sold."},
  {id:13,cat:"Writing",title:"Diary Entry from a Minor Historical Figure",desc:"Pick someone in the background of history. Write their diary on a famous day."},
  {id:14,cat:"Writing",title:"Apology Letter from an Inanimate Object",desc:"A broken umbrella. A slow computer. An alarm clock. Pick one. Make it apologize."},
  {id:15,cat:"Writing",title:"Dream Journal Entry (Invented)",desc:"Write the most vivid, surreal fake dream you can imagine in journal format."},
  {id:16,cat:"Writing",title:"Employee of the Month: Most Mediocre Worker",desc:"Write the blurb for an imaginary company's most impressively unremarkable employee."},
  {id:17,cat:"Writing",title:"Three Versions of the Same Breakup",desc:"Write the same breakup from both people's perspective, then from a mutual friend's."},
  {id:18,cat:"Writing",title:"Nature Journal Entry",desc:"Go outside for 10 minutes. Observe closely. Write a naturalist's journal entry."},
  {id:19,cat:"Writing",title:"Alternate History Paragraph",desc:"Pick one historical event and rewrite a paragraph where it went differently."},
  {id:20,cat:"Writing",title:"Cocktail Menu for Emotions",desc:"Design a full bar menu where every drink is named after and evokes an emotion."},
  {id:21,cat:"Writing",title:"Weather Report for Your Inner State",desc:"Write a meteorological forecast for your current emotional condition."},
  {id:22,cat:"Writing",title:"Two-Line Horror Stories (20 of them)",desc:"Write 20 two-sentence horror stories. Make each one actually land."},
  {id:23,cat:"Writing",title:"Found Poetry from Spam Emails",desc:"Copy subject lines from your spam folder. Arrange them into a poem."},
  {id:24,cat:"Writing",title:"Recipe for a Memory",desc:"Write a recipe for recreating a specific personal memory, with ingredients and method."},
  {id:25,cat:"Writing",title:"Press Release for Your Own Life",desc:"Write a corporate press release announcing something mundane you did today."},
  {id:26,cat:"Writing",title:"Glossary of Made-Up Words",desc:"Invent 15 words the English language desperately needs. Define each."},
  {id:27,cat:"Writing",title:"Unsent Text Messages",desc:"Write 10 texts you've never sent to different people in your life."},
  {id:28,cat:"Writing",title:"Science Fiction Elevator Pitches (5)",desc:"Write 5 one-paragraph pitches for original, genuinely interesting sci-fi stories."},
  {id:29,cat:"Writing",title:"Children's Book About a Dark Topic",desc:"Write a cheerful children's book on something adult. Title, text, scene descriptions."},
  {id:30,cat:"Writing",title:"Field Guide Entry for a Human Behavior",desc:"Write a David Attenborough-style entry about a common, specific human habit."},
  {id:31,cat:"Writing",title:"Ransom Note Using Only Magazine Words",desc:"Write a dramatic ransom note using only cut-out-style stylized magazine words."},
  {id:32,cat:"Writing",title:"One-Act Play in a Waiting Room",desc:"Two strangers, one waiting room, 10 minutes of dialogue. Something is revealed."},
  {id:33,cat:"Writing",title:"Manifesto for Something Tiny",desc:"Write a passionate manifesto about something completely trivial: a snack, a font, a habit."},
  {id:34,cat:"Writing",title:"Book Review of Your Own Life",desc:"Review your life so far as if it were a novel. Include a star rating and blurb."},
  {id:35,cat:"Writing",title:"50 Things You Believe",desc:"Write 50 things you genuinely believe, big and small, without explanation."},
  {id:36,cat:"Writing",title:"Neighborhood Walk as Epic Fantasy",desc:"Describe a walk around your block entirely in the style of Tolkien."},
  {id:37,cat:"Writing",title:"Dialogue Between Two Objects in Your Room",desc:"Pick two nearby objects. Write their conversation while you sleep."},
  {id:38,cat:"Writing",title:"90-Second Speech You'll Never Give",desc:"Write a speech for an occasion that will never happen but you wish would."},
  {id:39,cat:"Writing",title:"Confessions of a Minor Character",desc:"Pick someone in the background of a famous story. Write their first-person confession."},
  {id:40,cat:"Writing",title:"Terms & Conditions for a Friendship",desc:"Write the full legal-style T&C for becoming your friend. Include clauses."},
  {id:41,cat:"Writing",title:"Stream of Consciousness (10 minutes)",desc:"Set a timer. Write without stopping, lifting pen, or censoring. Go."},
  {id:42,cat:"Writing",title:"Tourist Guide to Your Hometown (Honest)",desc:"Write a travel guide for your actual hometown. Honest, funny, and specific."},
  {id:43,cat:"Writing",title:"Complaint Letter to the Universe",desc:"Write a formal complaint to the cosmos about something specific that's bothering you."},
  {id:44,cat:"Writing",title:"Fake Reddit Thread",desc:"Write a full thread—OP, top comments, controversial reply, mod note—about something fictional."},
  {id:45,cat:"Writing",title:"Academic Abstract for Something Unacademic",desc:"Write a rigorous academic abstract for: your morning routine, a bad date, a nap."},
  {id:46,cat:"Writing",title:"Stage Directions Only",desc:"Write a dramatic story using only stage direction text—no dialogue. All action."},
  {id:47,cat:"Writing",title:"Voicemail from Your Future Self",desc:"Write the transcript of a voicemail left by you, 20 years from now."},
  {id:48,cat:"Writing",title:"Rejection Letter for Today's Sunrise",desc:"Write a formal rejection from the Sunset Committee declining today's sunrise proposal."},
  {id:49,cat:"Writing",title:"Personals Ad from a Historical Figure",desc:"Write a dating app profile for a famous historical figure. Be specific."},
  {id:50,cat:"Writing",title:"Annotated Bibliography of Your Life (5 sources)",desc:"List 5 books, films, or experiences that shaped you. Write a paragraph annotation for each."},
  {id:51,cat:"Writing",title:"The Perfect Day, Written Out",desc:"Write a full, detailed account of your perfect day from waking to sleep."},
  {id:52,cat:"Writing",title:"Fake Horoscopes (All 12 Signs)",desc:"Write horoscopes for all 12 signs. Make them specific, weird, and somehow true."},
  {id:53,cat:"Writing",title:"Technical Documentation for Magic",desc:"Write developer-style docs for a magical power as if it were an API endpoint."},
  {id:54,cat:"Writing",title:"Genre-Swap Your Commute",desc:"Rewrite your daily commute as a Western, Romance, Horror, and Noir. One paragraph each."},
  {id:55,cat:"Writing",title:"Obituary for a Bad Habit",desc:"Write the sincere obituary for a habit you've given up or want to."},
  {id:56,cat:"Writing",title:"A Letter You'll Never Send",desc:"Write the letter you actually want to send to someone. Don't hold back."},
  {id:57,cat:"Writing",title:"Autobiography in Bullet Points",desc:"Write your entire life story in under 30 bullets. Every single one must matter."},
  {id:58,cat:"Writing",title:"Index for a Book That Doesn't Exist",desc:"Write the back-of-book index for an imaginary book. The index tells its own story."},
  {id:59,cat:"Writing",title:"Screenplay Scene (One Location, Two People)",desc:"Write one scene: one location, two characters, one revelation. Proper screenplay format."},
  {id:60,cat:"Writing",title:"Ode to Something Overlooked",desc:"Write a genuine ode to something almost nobody writes poetry about."},
  {id:61,cat:"Writing",title:"Newspaper Corrections Column (Fictional)",desc:"Write a corrections column for a fake newspaper. The mistakes escalate absurdly."},
  {id:62,cat:"Writing",title:"Closing Arguments in a Ridiculous Trial",desc:"Write the passionate closing argument in a trial over something completely silly."},
  {id:63,cat:"Writing",title:"One-Sentence Summaries of Every Year of Your Life",desc:"Write one honest sentence for each year of your life so far."},
  {id:64,cat:"Writing",title:"Pitch Bible for a TV Show That Should Exist",desc:"Write a full TV pitch for a show you actually want to watch."},
  {id:65,cat:"Writing",title:"Wrong Number Text Chain",desc:"Write a full text conversation between strangers who've reached the wrong number."},
  {id:66,cat:"Writing",title:"Encyclopedia Entry on Something Mundane",desc:"Write a thorough encyclopedia entry on something completely ordinary near you."},
  {id:67,cat:"Writing",title:"Scathing Review of a Dream You Had",desc:"Write a sarcastic Rotten Tomatoes–style review of a dream you actually had."},
  {id:68,cat:"Writing",title:"Footnotes for Your Day",desc:"Narrate your ordinary day with absurd academic footnotes explaining every small action."},
  {id:69,cat:"Writing",title:"Mission Statement for Your Ideal Life",desc:"Write the corporate mission statement for the life you actually want to live."},
  {id:70,cat:"Writing",title:"Fake Kickstarter Campaign",desc:"Write the full campaign copy for an absurd Kickstarter that somehow makes total sense."},
  {id:71,cat:"Writing",title:"The Most Boring Story Ever Written",desc:"Deliberately write the most tediously boring story you can—executed with mastery."},
  {id:72,cat:"Writing",title:"Museum Placard for Your Favorite Object",desc:"Write the museum placard for your most-loved physical possession."},
  {id:73,cat:"Writing",title:"Bureaucratic Forms for Life Events",desc:"Design the form you'd fill out to apply for: falling in love, forgiveness, a career change."},
  {id:74,cat:"Writing",title:"50 Questions You've Never Been Asked",desc:"Write 50 original, genuinely interesting questions you've never been asked."},
  {id:75,cat:"Writing",title:"Prose Poem About a Scientific Fact",desc:"Take one real scientific fact and write a prose poem from inside it."},
  {id:76,cat:"Writing",title:"Things I Know for Sure",desc:"Write 20 things you know with absolute certainty. Be surprisingly specific."},
  {id:77,cat:"Writing",title:"Grocery List as Poem",desc:"Rewrite a boring grocery list as a meaningful, beautiful poem."},
  {id:78,cat:"Writing",title:"Portrait in Second Person",desc:"Write a description of someone using only 'you'—no names, no he/she/they."},
  {id:79,cat:"Writing",title:"Flight Safety Card for Emotional Turbulence",desc:"Design the laminated safety card for navigating an emotional crisis. Include diagrams."},
  {id:80,cat:"Writing",title:"What I'm Running Toward / Running From",desc:"Write honestly about what you're moving toward and what you're running away from."},

  // ─── ART & DRAWING (81-160) ───
  {id:81,cat:"Art & Drawing",title:"Draw Your Room from Memory",desc:"Close your eyes, recall your bedroom, then draw it. Compare after."},
  {id:82,cat:"Art & Drawing",title:"One-Line Portrait",desc:"Draw a portrait of someone using a single unbroken line."},
  {id:83,cat:"Art & Drawing",title:"Blind Contour Drawing (5 subjects)",desc:"Draw 5 objects without ever looking at your paper. Frame the best one."},
  {id:84,cat:"Art & Drawing",title:"Invent a New Animal",desc:"Design a believable new animal with labeled anatomy. Where does it live? What does it eat?"},
  {id:85,cat:"Art & Drawing",title:"Map of an Imaginary City",desc:"Draw the street map of a fictional city. Name every neighborhood and major street."},
  {id:86,cat:"Art & Drawing",title:"Self-Portrait as a Fruit",desc:"Draw a self-portrait where all your features are replaced by the qualities of one fruit."},
  {id:87,cat:"Art & Drawing",title:"Texture Rubbings Collage",desc:"Make rubbings from 10 different textured surfaces. Arrange them into a composition."},
  {id:88,cat:"Art & Drawing",title:"Illustrated Alphabet of a Theme",desc:"Draw a small illustrated letter for each letter of the alphabet in a chosen theme."},
  {id:89,cat:"Art & Drawing",title:"Doodle Your Day as a Timeline",desc:"Draw today as a visual timeline with small illustrations at each event."},
  {id:90,cat:"Art & Drawing",title:"Villain Costume Design",desc:"Design the full costume for a villain you invent. Include material notes."},
  {id:91,cat:"Art & Drawing",title:"Cross-Section of Your Dream House",desc:"Draw a side-view cross-section of your perfect house with every room labeled."},
  {id:92,cat:"Art & Drawing",title:"Draw Using Only Dots",desc:"Create a scene or portrait using only stippled dots. No lines allowed."},
  {id:93,cat:"Art & Drawing",title:"Geometric Animal Interpretation",desc:"Recreate an animal using only geometric shapes—triangles, circles, rectangles."},
  {id:94,cat:"Art & Drawing",title:"Thumbnail Storyboard (6 panels)",desc:"Storyboard a 6-panel micro-film of a story with no words at all."},
  {id:95,cat:"Art & Drawing",title:"Draw an Emotion as a Landscape",desc:"What does grief look like as mountains? What does joy look like as a forest? Draw one."},
  {id:96,cat:"Art & Drawing",title:"Invent a Board Game Board",desc:"Draw the game board for an original board game. Label all spaces and regions."},
  {id:97,cat:"Art & Drawing",title:"10 Faces in 10 Minutes",desc:"Draw 10 different faces in 10 minutes. Each must have a completely distinct personality."},
  {id:98,cat:"Art & Drawing",title:"Recreate a Famous Painting from Memory",desc:"Without looking, draw your version of a famous painting you know well."},
  {id:99,cat:"Art & Drawing",title:"Postage Stamp Design (Series of 4)",desc:"Design 4 stamps in a series for a fictional country or celebration."},
  {id:100,cat:"Art & Drawing",title:"Molecule-Style Drawing of an Emotion",desc:"Draw an emotion as if it were a molecular compound diagram, with components labeled."},
  {id:101,cat:"Art & Drawing",title:"Draw from Music",desc:"Listen to one song and draw whatever images arise. Don't overthink it."},
  {id:102,cat:"Art & Drawing",title:"Pattern Design (Repeat Tile)",desc:"Draw a tile that would look beautiful repeated as an infinite wallpaper pattern."},
  {id:103,cat:"Art & Drawing",title:"Book Cover Redesign",desc:"Redesign the cover of your favorite book. Make it better than the original."},
  {id:104,cat:"Art & Drawing",title:"Character Design Turnaround",desc:"Design a character and draw them from front, side, and back view."},
  {id:105,cat:"Art & Drawing",title:"Microscopic World Illustration",desc:"Draw a detailed scene as if viewed through a microscope—a drop of pond water."},
  {id:106,cat:"Art & Drawing",title:"Invent a Font (Just the Alphabet)",desc:"Design a complete 26-letter alphabet in your own invented typeface."},
  {id:107,cat:"Art & Drawing",title:"Draw Your Hand 10 Different Ways",desc:"5 careful observational drawings of your own hands from different angles and styles."},
  {id:108,cat:"Art & Drawing",title:"Fantasy Tattoo Design",desc:"Design the tattoo you'd get if you had no fear. Make it meaningful and beautiful."},
  {id:109,cat:"Art & Drawing",title:"Design a Tarot Card",desc:"Invent your own tarot card: name it, draw the image, write upright and reversed meanings."},
  {id:110,cat:"Art & Drawing",title:"Architectural Cross-Section of a Tree",desc:"Draw the inside of a tree as if it were a building: rooms, floors, inhabitants."},
  {id:111,cat:"Art & Drawing",title:"Imaginary Plant Field Guide Plate",desc:"Illustrate a fictional plant in meticulous botanical style. Label root, stem, flower, seed."},
  {id:112,cat:"Art & Drawing",title:"Creature from the Deep",desc:"Invent a deep-sea creature. Illustrate it with annotations as if from a biology textbook."},
  {id:113,cat:"Art & Drawing",title:"Heraldic Coat of Arms for Yourself",desc:"Design your personal coat of arms: symbols, colors, motto, and all."},
  {id:114,cat:"Art & Drawing",title:"Draw 20 Things That Make You Happy",desc:"Tiny sketches: 20 things that genuinely bring you joy, arranged on one page."},
  {id:115,cat:"Art & Drawing",title:"Monster Design Lineup (5 Monsters)",desc:"Design 5 original monsters. Each should feel truly different from the others."},
  {id:116,cat:"Art & Drawing",title:"Design Your Own Currency",desc:"Draw a banknote with denomination, imagery, and security features for an imaginary nation."},
  {id:117,cat:"Art & Drawing",title:"Infographic Poster About Yourself",desc:"Hand-draw an infographic with data visualizations about your own life and personality."},
  {id:118,cat:"Art & Drawing",title:"Abstract Self-Portrait",desc:"Draw yourself without drawing a face. Represent your identity through abstract form."},
  {id:119,cat:"Art & Drawing",title:"Vintage Travel Poster for Your City",desc:"Design a retro travel poster for your city. Bold colors, clean shapes, iconic imagery."},
  {id:120,cat:"Art & Drawing",title:"Typography Poster (Handmade)",desc:"Letter a quote you love by hand. Make the typography the entire artwork."},
  {id:121,cat:"Art & Drawing",title:"Facial Expression Sheet (12 Expressions)",desc:"Design one character. Draw them expressing 12 completely different emotions."},
  {id:122,cat:"Art & Drawing",title:"Zentangle-Style Meditation Drawing",desc:"Fill a page with structured patterns and shapes. No plan. Respond to what's there."},
  {id:123,cat:"Art & Drawing",title:"Draw in Someone Else's Style",desc:"Pick an artist you admire. Draw something completely new, imitating their style."},
  {id:124,cat:"Art & Drawing",title:"Illustrated Constellation (Invented)",desc:"Invent a new constellation. Draw the star pattern and the mythological figure it represents."},
  {id:125,cat:"Art & Drawing",title:"Word Portrait",desc:"Fill the outline of a face with tiny handwritten words that describe that person."},
  {id:126,cat:"Art & Drawing",title:"Your Life as a Movie Poster",desc:"Design the movie poster for the film of your life. Title, tagline, imagery, credits."},
  {id:127,cat:"Art & Drawing",title:"Sketch Your Current View in 3 Styles",desc:"Draw exactly what you see right now in three styles: realistic, abstract, cartoon."},
  {id:128,cat:"Art & Drawing",title:"Silhouette Study (5 Silhouettes)",desc:"Draw 5 recognizable things as black silhouettes only. See how little info is needed."},
  {id:129,cat:"Art & Drawing",title:"Night Sky Map (Observed or Imagined)",desc:"Go outside at night and draw what you see. Or invent your own sky from scratch."},
  {id:130,cat:"Art & Drawing",title:"'Exploded' Drawing of an Object",desc:"Draw an everyday object with its components separated and labeled, like a repair manual."},
  {id:131,cat:"Art & Drawing",title:"Draw an Impossible Machine",desc:"Design a machine that does something logically impossible. Label its components."},
  {id:132,cat:"Art & Drawing",title:"Treasure Map for Somewhere Real",desc:"Draw a treasure map of a real place you know, in old adventure map style."},
  {id:133,cat:"Art & Drawing",title:"Emotional Color Palette",desc:"Mix or select colors that represent 10 different emotions. Label each one and why."},
  {id:134,cat:"Art & Drawing",title:"Draw Every Chair in Your Space",desc:"Quick observational sketches of every chair or seat in the room you're in right now."},
  {id:135,cat:"Art & Drawing",title:"Logo for an Imaginary Company",desc:"Design a professional-looking logo for a business you invent right now."},
  {id:136,cat:"Art & Drawing",title:"Anatomical Drawing of a Fictional Creature",desc:"Draw the internal organs of a creature you invent, labeled like a biology diagram."},
  {id:137,cat:"Art & Drawing",title:"Spirit Animal with Symbolic Details",desc:"Draw your spirit animal. Annotate every detail with what it symbolizes about you."},
  {id:138,cat:"Art & Drawing",title:"Paper Cutting Silhouette",desc:"Fold paper and cut a detailed silhouette scene. Unfold to reveal the result."},
  {id:139,cat:"Art & Drawing",title:"Design a Patch for a Fictional Club",desc:"Design an embroidered-style patch for an imaginary club you'd want to belong to."},
  {id:140,cat:"Art & Drawing",title:"Propaganda Poster for a Personal Value",desc:"Design a bold propaganda-style poster promoting something you actually believe in."},
  {id:141,cat:"Art & Drawing",title:"Hand-Illuminate a Letter",desc:"Take one letter and create a medieval-style illuminated letter around it."},
  {id:142,cat:"Art & Drawing",title:"Draw 10 Variations of a Simple Shape",desc:"Start with a circle. Draw 10 completely different things it could be or become."},
  {id:143,cat:"Art & Drawing",title:"Architectural Ruins Sketch",desc:"Draw a crumbling, overgrown ruin. Make it beautiful. Invent its history."},
  {id:144,cat:"Art & Drawing",title:"Tiny World on a Leaf",desc:"Draw a detailed tiny civilization or ecosystem living on a single leaf."},
  {id:145,cat:"Art & Drawing",title:"Map Your Current Headspace",desc:"Draw a map of your current mental state: what's central, what's in the corners."},
  {id:146,cat:"Art & Drawing",title:"Icon Set for Your Hobbies (10 icons)",desc:"Design 10 simple, consistent icons representing your personal interests."},
  {id:147,cat:"Art & Drawing",title:"Draw a Sound",desc:"What does a specific song or sound look like? Draw it without musical symbols."},
  {id:148,cat:"Art & Drawing",title:"Cartoon Your Morning Routine",desc:"Illustrate your actual morning routine as a 6-panel comic strip."},
  {id:149,cat:"Art & Drawing",title:"Invent a Flag for Your Household",desc:"Design a flag for your home: colors, symbols, and a motto that fits your household."},
  {id:150,cat:"Art & Drawing",title:"30-Second Gesture Drawings (20 of them)",desc:"Set a timer for 30 seconds per drawing. Draw 20 figures or objects. Speed is the art."},
  {id:151,cat:"Art & Drawing",title:"Knot Design (Celtic or Original)",desc:"Design an intricate knotwork pattern. Let it grow organically from a simple starting shape."},
  {id:152,cat:"Art & Drawing",title:"Graph Data Visually (Handmade)",desc:"Take any interesting dataset and draw a hand-illustrated infographic from scratch."},
  {id:153,cat:"Art & Drawing",title:"Artist Trading Card (Playing Card Size)",desc:"Create a unique piece of art on a 3.5×2.5 inch card. Something special."},
  {id:154,cat:"Art & Drawing",title:"Fingerprint Art",desc:"Use fingerprints and ink to create a scene or portrait. Only fingerprints, no brushes."},
  {id:155,cat:"Art & Drawing",title:"5 Chairs, 5 Personalities",desc:"Draw 5 different chairs, each designed for a specific personality type or mood."},
  {id:156,cat:"Art & Drawing",title:"Draw the View from Your Window Right Now",desc:"Observational drawing. No editing. Draw exactly what you see out your nearest window."},
  {id:157,cat:"Art & Drawing",title:"Symmetry Drawing (Fold and Mirror)",desc:"Fold paper, draw on one half, unfold to reveal the mirror. Do 5 of these."},
  {id:158,cat:"Art & Drawing",title:"Design Your Own Periodic Table Element",desc:"Invent an element beyond 118. Symbol, atomic mass, properties, discovery story."},
  {id:159,cat:"Art & Drawing",title:"Color Wheel Using Things Found in Nature",desc:"Collect 12+ natural materials. Arrange them in a color wheel. Photograph it."},
  {id:160,cat:"Art & Drawing",title:"Draw 5 Objects at 5 Different Scales",desc:"Pick an object. Draw it at microscopic, normal, giant, galactic, and quantum scales."},

  // ─── CODING · GENERAL (161-240) ───
  {id:161,cat:"Coding",title:"FizzBuzz with a Personal Twist",desc:"Implement FizzBuzz but with your own rules—use three numbers that mean something to you."},
  {id:162,cat:"Coding",title:"ASCII Art Generator",desc:"Write a script that converts a string into large ASCII block letters."},
  {id:163,cat:"Coding",title:"Personal Fortune Cookie Generator",desc:"Script that outputs a random fortune from a list of 50 you write yourself."},
  {id:164,cat:"Coding",title:"Text-Based Adventure Game (3 Rooms)",desc:"Build a 3-room text adventure with branching choices and at least two endings."},
  {id:165,cat:"Coding",title:"Caesar Cipher Encoder/Decoder",desc:"Implement a Caesar cipher that can encode and decode any text with any shift value."},
  {id:166,cat:"Coding",title:"Word Frequency Counter",desc:"Script that takes any text input and returns the top 10 most common words."},
  {id:167,cat:"Coding",title:"Simple Markdown to HTML Converter",desc:"Manually implement conversion for bold, italic, and headers. No libraries."},
  {id:168,cat:"Coding",title:"Guess the Number Game",desc:"Code the classic guessing game with hints, a max guess limit, and a score tracker."},
  {id:169,cat:"Coding",title:"Temperature Unit Converter",desc:"Build a converter between Celsius, Fahrenheit, and Kelvin with a clean CLI interface."},
  {id:170,cat:"Coding",title:"Anagram Detector",desc:"Write a function that checks if two strings are anagrams of each other."},
  {id:171,cat:"Coding",title:"Simple Stack Implementation from Scratch",desc:"Implement a stack data structure without using built-in list methods. Add unit tests."},
  {id:172,cat:"Coding",title:"Roman Numeral Converter",desc:"Convert between integers and Roman numerals in both directions."},
  {id:173,cat:"Coding",title:"Todo List with File Persistence",desc:"CLI todo list that saves to a text file and persists between sessions."},
  {id:174,cat:"Coding",title:"Fibonacci Sequence Visualizer",desc:"Print the Fibonacci sequence, visualizing each number as a bar of asterisks."},
  {id:175,cat:"Coding",title:"Morse Code Translator",desc:"Build a two-way translator between English text and Morse code."},
  {id:176,cat:"Coding",title:"Rock Paper Scissors with Statistics",desc:"Build the game and track win/loss/draw statistics over a full session."},
  {id:177,cat:"Coding",title:"Countdown Timer with Custom Message",desc:"Build a CLI countdown timer that displays a custom message when it hits zero."},
  {id:178,cat:"Coding",title:"Binary to Decimal Converter",desc:"Convert between binary and decimal in both directions. Add hex for bonus."},
  {id:179,cat:"Coding",title:"Personal Quote Database (JSON)",desc:"Script to add, view, and randomly display quotes stored in a JSON file."},
  {id:180,cat:"Coding",title:"Blackjack Card Game (CLI)",desc:"Code a playable CLI blackjack game with basic dealer logic."},
  {id:181,cat:"Coding",title:"Password Strength Checker",desc:"Write a checker that evaluates passwords on multiple criteria and gives a strength score."},
  {id:182,cat:"Coding",title:"Linked List from Scratch",desc:"Implement a singly linked list with insert, delete, and traverse methods. Add tests."},
  {id:183,cat:"Coding",title:"Sorting Visualizer (ASCII)",desc:"Visualize bubble sort step-by-step in the terminal using ASCII bar charts."},
  {id:184,cat:"Coding",title:"Hangman in the Terminal",desc:"Build a fully playable terminal hangman game with a word list you choose."},
  {id:185,cat:"Coding",title:"Recursive Maze Solver",desc:"Generate a simple maze as a 2D list and write a recursive function to solve it."},
  {id:186,cat:"Coding",title:"Wordwrap Function from Scratch",desc:"Implement a word-wrap function that wraps text at a specified column width."},
  {id:187,cat:"Coding",title:"Calendar Printer (Any Month)",desc:"Build a function that prints a calendar for any month/year in ASCII format."},
  {id:188,cat:"Coding",title:"Conway's Game of Life (Terminal)",desc:"Implement Conway's Game of Life and display it frame by frame in the terminal."},
  {id:189,cat:"Coding",title:"Simple Template Engine",desc:"Build a basic template engine that replaces {{variables}} in strings with values."},
  {id:190,cat:"Coding",title:"Tic-Tac-Toe with Minimax AI",desc:"Build tic-tac-toe and implement the minimax algorithm for an unbeatable AI opponent."},
  {id:191,cat:"Coding",title:"Number to Words Converter",desc:"Convert any integer (up to millions) into its English word representation."},
  {id:192,cat:"Coding",title:"CSV to Markdown Table Converter",desc:"Write a script that converts a CSV file into a formatted Markdown table."},
  {id:193,cat:"Coding",title:"Generative Poem from Markov Chain",desc:"Train a character-level Markov chain on a corpus of poetry. Generate poems from it."},
  {id:194,cat:"Coding",title:"Spell Checker (Edit Distance)",desc:"Implement a basic spell checker using Levenshtein edit distance to suggest corrections."},
  {id:195,cat:"Coding",title:"Static Site Generator (Minimal)",desc:"Write a script that takes Markdown files and generates HTML pages from a template."},
  {id:196,cat:"Coding",title:"Regex Tester with Explanations",desc:"Build a tool that tests regex patterns against samples and explains each match group."},
  {id:197,cat:"Coding",title:"Text Diff Tool",desc:"Implement a basic line-by-line diff comparison tool between two text files."},
  {id:198,cat:"Coding",title:"Simple State Machine",desc:"Implement a configurable state machine. Model a vending machine or traffic light."},
  {id:199,cat:"Coding",title:"Generative Grammar Engine",desc:"Build a context-free grammar engine that generates random sentences from defined rules."},
  {id:200,cat:"Coding",title:"Git Log Visualizer",desc:"Parse git log output and render a simple ASCII branch graph in the terminal."},
  {id:201,cat:"Coding",title:"Sunrise/Sunset Calculator",desc:"Implement the algorithm to calculate sunrise and sunset times given lat/lon and date."},
  {id:202,cat:"Coding",title:"Log Parser and Summarizer",desc:"Write a script that parses a log file and produces a summary of errors, warnings, events."},
  {id:203,cat:"Coding",title:"Simple Rate Limiter (Token Bucket)",desc:"Implement a token-bucket rate limiter from scratch. Test it with a simulation."},
  {id:204,cat:"Coding",title:"Bracket Balancer",desc:"Write a function to check if all brackets in a string are balanced. Handle nested types."},
  {id:205,cat:"Coding",title:"Meeting Cost Calculator",desc:"Input number of people and hourly rates. Show a real-time counter of the meeting's cost."},
  {id:206,cat:"Coding",title:"Dungeon Room Generator",desc:"Script that randomly generates a D&D-style room description with contents and monsters."},
  {id:207,cat:"Coding",title:"Vocabulary Flashcard CLI",desc:"Build a CLI flashcard tool that loads word/definition pairs from a file and quizzes you."},
  {id:208,cat:"Coding",title:"Recursive Directory Tree Printer",desc:"Write a recursive function to print a directory tree, like the Unix `tree` command."},
  {id:209,cat:"Coding",title:"Readability Score Calculator",desc:"Implement the Flesch-Kincaid readability formula for any input text."},
  {id:210,cat:"Coding",title:"Prime Factorization Visualizer",desc:"Print the prime factorization of any number as a factor tree in ASCII art."},
  {id:211,cat:"Coding",title:"Color Palette Generator (Hex Codes)",desc:"Script that generates harmonious color palettes from a seed hex color."},
  {id:212,cat:"Coding",title:"ISBN Validator",desc:"Implement the checksum algorithm to validate ISBN-10 and ISBN-13 numbers."},
  {id:213,cat:"Coding",title:"Soundex Phonetic Encoder",desc:"Implement the Soundex algorithm for phonetic string matching."},
  {id:214,cat:"Coding",title:"Simple Pub/Sub Event System",desc:"Implement a basic publish-subscribe event system from scratch. Test it."},
  {id:215,cat:"Coding",title:"Mastermind Code Game",desc:"Build the classic Mastermind color-guessing game with hints in the terminal."},
  {id:216,cat:"Coding",title:"Number Base Converter (2–36)",desc:"Convert any integer between any two bases from 2 to 36. Show the conversion steps."},
  {id:217,cat:"Coding",title:"Scrabble Score Calculator",desc:"Calculate the Scrabble score for any word, with and without bonus tiles."},
  {id:218,cat:"Coding",title:"Pomodoro Timer (CLI)",desc:"Build a configurable Pomodoro timer with work/break alternation and session counter."},
  {id:219,cat:"Coding",title:"Personal CLI Journal",desc:"Build a CLI journal where each entry is timestamped and saved to a file."},
  {id:220,cat:"Coding",title:"Budget Pie Chart (ASCII)",desc:"Takes expense categories and draws a rough ASCII pie chart in the terminal."},
  {id:221,cat:"Coding",title:"Random Story Generator",desc:"Build a mad-libs style story generator with interchangeable nouns, verbs, and settings."},
  {id:222,cat:"Coding",title:"Interval Timer (Multiple Rounds)",desc:"Build a configurable interval training timer with round/rest alternation."},
  {id:223,cat:"Coding",title:"Simple ORM (One Table)",desc:"Build a simple ORM that maps one Python class to a SQLite table. Add CRUD methods."},
  {id:224,cat:"Coding",title:"Password Generator with Rules",desc:"Build a password generator with configurable rules for strength and character sets."},
  {id:225,cat:"Coding",title:"File Duplicate Finder",desc:"Script that scans a directory and reports any duplicate filenames or file sizes."},
  {id:226,cat:"Coding",title:"Barcode Checksum Verifier",desc:"Implement EAN-13 barcode checksum verification from scratch."},
  {id:227,cat:"Coding",title:"Dice Roller with Statistics",desc:"Simulate rolling dice (any number, any type) and show statistical distribution."},
  {id:228,cat:"Coding",title:"Habit Tracker (CSV Persistence)",desc:"CLI tool to log daily habits and show a weekly streak summary."},
  {id:229,cat:"Coding",title:"ASCII Word Cloud",desc:"Generate an ASCII word cloud from any input text, sized by frequency."},
  {id:230,cat:"Coding",title:"Number Spiral Printer",desc:"Print a number spiral that fills an NxN grid clockwise from center."},
  {id:231,cat:"Coding",title:"Star Pattern Printer (10 Patterns)",desc:"Print 10 different star/number patterns using loops. Push the complexity."},
  {id:232,cat:"Coding",title:"Exquisite Corpse Story Tool",desc:"CLI tool for Exquisite Corpse: takes a line, hides it, prompts for next."},
  {id:233,cat:"Coding",title:"Daily Affirmation Rotator",desc:"Script that displays a different affirmation from your own list each day of the year."},
  {id:234,cat:"Coding",title:"Music Scale Generator",desc:"Given a root note and scale type, print the notes in that scale."},
  {id:235,cat:"Coding",title:"Sentence Complexity Ranker",desc:"Rank sentences in a paragraph by complexity. Output sorted from simplest to hardest."},
  {id:236,cat:"Coding",title:"Leet Speak Encoder/Decoder",desc:"Build a full 1337 encoder/decoder with configurable substitution tables."},
  {id:237,cat:"Coding",title:"Random Name Generator",desc:"Build a generator with prefix/suffix tables for fantasy, sci-fi, and realistic names."},
  {id:238,cat:"Coding",title:"Color Name Finder",desc:"Given any hex code, find the closest named CSS color and display them side by side."},
  {id:239,cat:"Coding",title:"Conway's Game of Life: HighLife Variant",desc:"Implement the HighLife variant. Compare emergent patterns to standard Life."},
  {id:240,cat:"Coding",title:"Matrix Transpose Function",desc:"Write a function to transpose a 2D matrix. Visualize it before and after."},

  // ─── CODING · BIOINFO (241-310) ───
  {id:241,cat:"Bioinformatics",title:"Protein Sequence → Playlist",desc:"Map each amino acid to a musical note or BPM range. Feed in insulin, p53, or your favorite protein and generate its 'song' as a text track list. Bonus: check if a cancer mutation changes the vibe from lo-fi to death metal."},
  {id:242,cat:"Bioinformatics",title:"DNA → RNA → Protein Translator",desc:"Build the full central dogma pipeline from scratch: DNA → mRNA transcription → codon table translation → protein sequence. Handle start/stop codons properly. Test it on a real gene."},
  {id:243,cat:"Bioinformatics",title:"FASTA File Reader & Stats",desc:"Write a parser that reads a FASTA file, extracts all sequences and headers, and prints: number of sequences, shortest, longest, mean length, and total bases."},
  {id:244,cat:"Bioinformatics",title:"GC Content Sliding Window Plot",desc:"Calculate GC content for any DNA sequence. Scan a sliding window across a genome segment and plot GC% variation as an ASCII bar graph."},
  {id:245,cat:"Bioinformatics",title:"Reverse Complement Generator",desc:"Given a DNA strand, produce its reverse complement. Then verify base-pairing rules by checking the pair of the pair equals the original."},
  {id:246,cat:"Bioinformatics",title:"Amino Acid Composition Analyzer",desc:"Given a protein sequence, calculate the percentage of each amino acid. Print a bar chart. Compare two proteins side by side—try a membrane protein vs. a soluble one."},
  {id:247,cat:"Bioinformatics",title:"Open Reading Frame (ORF) Finder",desc:"Scan a DNA string in all 6 reading frames (+3 and -3). Find and print all ORFs longer than 100 codons with their position and frame."},
  {id:248,cat:"Bioinformatics",title:"Needleman-Wunsch Aligner from Scratch",desc:"Implement the Needleman-Wunsch global alignment algorithm. Align two short protein sequences, print the full scoring matrix, and output the final alignment."},
  {id:249,cat:"Bioinformatics",title:"Amino Acid → Zodiac Sign Encoder",desc:"Assign each of the 20 amino acids to a zodiac sign or element based on their chemistry. Feed in a protein and print its 'astrological profile'. Is TP53 a Scorpio? Is collagen definitely a Capricorn?"},
  {id:250,cat:"Bioinformatics",title:"Protein Molecular Weight Calculator",desc:"Write a function that calculates the molecular weight of any protein from its amino acid sequence using a hardcoded residue mass table. Validate against a known protein from UniProt."},
  {id:251,cat:"Bioinformatics",title:"Hydrophobicity Profile Plotter",desc:"Calculate the Kyte-Doolittle hydrophobicity score for a protein using a sliding window. Print the profile as an ASCII plot. Flag potential transmembrane helices."},
  {id:252,cat:"Bioinformatics",title:"Protein Isoelectric Point Estimator",desc:"Estimate the pI of a protein by iteratively finding the pH where net charge ≈ 0. Use simplified pKa values. Test on insulin vs. histone H4 (hint: wildly different pIs)."},
  {id:253,cat:"Bioinformatics",title:"Restriction Enzyme Digest Simulator",desc:"Hardcode 10 common restriction enzyme recognition sequences (EcoRI, HindIII, etc.). Given a DNA input, find all cut sites and output the resulting fragment sizes."},
  {id:254,cat:"Bioinformatics",title:"Protein Charge at Any pH",desc:"Calculate the net charge of a protein at a given pH using its sequence and residue pKa values. Print the charge curve from pH 0–14 as an ASCII graph."},
  {id:255,cat:"Bioinformatics",title:"Protein Secondary Structure Guesser",desc:"Implement a simple Chou-Fasman-style predictor. Given a short peptide, output predicted H (helix), E (sheet), or C (coil) for each residue. See how wrong it is."},
  {id:256,cat:"Bioinformatics",title:"BLOSUM62 Alignment Scorer",desc:"Hardcode the BLOSUM62 matrix as a dict. Write a function to score any pairwise alignment manually. Score 5 real alignments from a paper you've read."},
  {id:257,cat:"Bioinformatics",title:"PCR Primer Design Tool",desc:"Given a DNA sequence, design a primer pair: 18–22 bp, GC content 40–60%, Tm ~60°C, no obvious self-complementarity. Output both primers and predicted product size."},
  {id:258,cat:"Bioinformatics",title:"SMILES String Validator",desc:"Write a basic SMILES validator: check balanced parentheses/brackets, valid atom symbols, and legal bond characters. Test on 10 real molecules from a database."},
  {id:259,cat:"Bioinformatics",title:"Molecular Formula Parser & MW",desc:"Parse a molecular formula (e.g. C8H10N4O2 for caffeine) into an element count dict. Calculate molecular weight. Handle nested groups and hydrates."},
  {id:260,cat:"Bioinformatics",title:"pH & Titration Curve Plotter",desc:"Given an acid's pKa and concentrations, calculate pH using Henderson-Hasselbalch. Plot the full titration curve of a weak acid as an ASCII graph."},
  {id:261,cat:"Bioinformatics",title:"k-mer Index Builder",desc:"Build a k-mer index of any DNA sequence (k=3 to 7). Query it with a short sequence to find all match positions. This is BLAST's core intuition."},
  {id:262,cat:"Bioinformatics",title:"Trypsin Digest Simulator",desc:"Simulate trypsin digestion: cleave after K or R unless followed by P. Output resulting peptide fragments, their masses, and lengths. Useful for proteomics thinking."},
  {id:263,cat:"Bioinformatics",title:"Protein → Spotify Mood Classifier",desc:"Based on a protein's computed hydrophobicity, charge, and size, classify it as a Spotify mood or genre. Is TP53 'melancholic indie'? Is collagen 'ambient chill'? Is insulin 'hyperpop'?"},
  {id:264,cat:"Bioinformatics",title:"Amino Acid to Emoji Translator",desc:"Assign each of the 20 amino acids an emoji based on their properties (🧲 for charged, 🛢️ for hydrophobic, 🌸 for aromatic, etc.). Translate a full protein to its emoji string. Is cytochrome c cute?"},
  {id:265,cat:"Bioinformatics",title:"Codon Usage Table Builder",desc:"Given any CDS sequence, build a codon usage table. Which synonymous codons are preferred? Compare E. coli codon bias vs. a yeast gene."},
  {id:266,cat:"Bioinformatics",title:"Protein as D&D Character Sheet",desc:"Generate a D&D character sheet for any protein: Strength from MW, Dexterity from intrinsic disorder estimate, Constitution from thermostability, Intelligence from information content, Charisma from surface accessibility."},
  {id:267,cat:"Bioinformatics",title:"BioProject Title Markov Generator",desc:"Paste 20 PubMed abstract titles into a Markov chain. Generate 20 fake but plausible-sounding research paper titles. Submit one to your PI and see if they notice."},
  {id:268,cat:"Bioinformatics",title:"Phylogenetic Tree Printer (UPGMA)",desc:"Given a hardcoded distance matrix of 6–8 species, implement UPGMA clustering and print the resulting tree as ASCII. Use a group of organisms you find interesting."},
  {id:269,cat:"Bioinformatics",title:"Genome Coverage Calculator",desc:"Given read length, genome size, and number of reads, calculate average sequencing coverage via Lander-Waterman. Plot coverage vs. read count as an ASCII curve."},
  {id:270,cat:"Bioinformatics",title:"Protein Motif Scanner",desc:"Hardcode 5 known motifs as regex-like patterns (RGD, KDEL, CAAX, RXL, NLS). Scan a protein sequence for all hits and report position and context."},
  {id:271,cat:"Bioinformatics",title:"Sequence Logo Generator (ASCII)",desc:"Given a multiple sequence alignment, calculate positional frequency and draw an ASCII sequence logo where character size represents conservation."},
  {id:272,cat:"Bioinformatics",title:"Lipinski Rule of 5 Checker",desc:"Given a molecule's MW, logP, H-donors, and H-acceptors, check Lipinski's Ro5. Evaluate 10 real drug molecules. Which ones technically 'shouldn't' be oral drugs?"},
  {id:273,cat:"Bioinformatics",title:"Protein RMSD Calculator (Simplified)",desc:"Given two lists of 3D Cα coordinates (hardcoded from a real structure), calculate RMSD before and after optimal superposition using SVD-based rotation."},
  {id:274,cat:"Bioinformatics",title:"RNA Folding Energy Estimator",desc:"Estimate free energy of RNA secondary structure using a simplified nearest-neighbor model. Find the most stable hairpin in a 30-nucleotide sequence."},
  {id:275,cat:"Bioinformatics",title:"Variant Effect Predictor (Stub)",desc:"Given a protein sequence and a single amino acid substitution, predict the likely effect: conservative vs. non-conservative using amino acid property tables from Dayhoff."},
  {id:276,cat:"Bioinformatics",title:"Shannon Entropy per MSA Position",desc:"Calculate Shannon entropy per position in a multiple sequence alignment. Identify the most and least conserved positions. Great for spotting functional residues."},
  {id:277,cat:"Bioinformatics",title:"Protein → Cocktail Recipe",desc:"Map amino acid properties to cocktail ingredients: charged → sour/tart, hydrophobic → smoky/whisky, aromatic → floral/gin, polar → light/prosecco. Generate a signature cocktail for any protein. What does p53 taste like?"},
  {id:278,cat:"Bioinformatics",title:"VCF File Parser & Ti/Tv Ratio",desc:"Write a VCF parser. Filter by QUAL and FILTER field. Output: SNP/indel counts, Ti/Tv ratio, and most affected chromosomes."},
  {id:279,cat:"Bioinformatics",title:"BED File Parser & Overlap Detector",desc:"Write a BED file parser. Report features per chromosome, total covered bases, average feature width, and any overlapping intervals."},
  {id:280,cat:"Bioinformatics",title:"RNA-seq Mock Differential Expression",desc:"Generate two mock count matrices (control vs. treatment) with 5 known differential genes buried in noise. Write a fold-change + t-test filter to recover them."},
  {id:281,cat:"Bioinformatics",title:"Amino Acid Personality Quiz",desc:"Build a 10-question personality quiz whose answers map to amino acid properties. At the end: reveal which amino acid you are and your predicted secondary structure tendency."},
  {id:282,cat:"Bioinformatics",title:"Protein → Periodic Table Assignment",desc:"Map each amino acid to a periodic table element based on chemistry (size, charge, aromaticity). Translate a famous protein. Is glycine hydrogen? Is tryptophan gold?"},
  {id:283,cat:"Bioinformatics",title:"WDL Workflow Skeleton Generator",desc:"Write a Python script that takes a list of task names and generates a valid WDL workflow skeleton with stub task definitions and an organized call block."},
  {id:284,cat:"Bioinformatics",title:"Proteomics Peptide HPLC Ranker",desc:"Use amino acid hydrophobicity coefficients to estimate HPLC retention order for a set of 10 peptides. Output ranked from most to least hydrophilic."},
  {id:285,cat:"Bioinformatics",title:"Gene Expression ASCII Heatmap",desc:"Given a gene expression matrix (8 genes × 6 samples), normalize it and print an ANSI color-coded ASCII heatmap. Sort genes by variance."},
  {id:286,cat:"Bioinformatics",title:"Codon Optimization Tool",desc:"Given a protein and a target organism's codon usage table (hardcoded), back-translate to a codon-optimized DNA sequence. Compare with a naïve back-translation."},
  {id:287,cat:"Bioinformatics",title:"Chromosome Karyotype Printer",desc:"Hardcode human chromosome sizes from hg38. Print an ASCII karyotype showing relative sizes with Mb tick marks. Label the centromeres."},
  {id:288,cat:"Bioinformatics",title:"CDS Annotation Extractor",desc:"Parse a hardcoded GenBank-format feature table. Extract all CDS features: gene names, positions, product names, and protein translations."},
  {id:289,cat:"Bioinformatics",title:"Pairwise Sequence Identity Calculator",desc:"Given two aligned sequences, calculate % identity, % similarity using BLOSUM62 signs, gap count, and gap-compressed identity."},
  {id:290,cat:"Bioinformatics",title:"InterPro Domain Scanner (Stub)",desc:"Hardcode 5 domain profiles as simplified position-specific score matrices. Scan a query protein and report which domains are found and where."},
  {id:291,cat:"Bioinformatics",title:"Michaelis-Menten Pathway Simulator",desc:"Model 3 enzymes in a linear pathway, each with Km and Vmax. Simulate substrate flux using simplified MM kinetics. Plot steady-state concentrations as ASCII."},
  {id:292,cat:"Bioinformatics",title:"DNA Base Composition Tester",desc:"Test whether a genome segment's base composition differs significantly from random using a chi-squared test. Apply to multiple sliding windows."},
  {id:293,cat:"Bioinformatics",title:"Smith-Waterman Local Aligner",desc:"Implement Smith-Waterman local alignment. Compare a query peptide against a longer target sequence. Find the highest-scoring local match and display it."},
  {id:294,cat:"Bioinformatics",title:"Protein Stability Hot Spot Predictor",desc:"Using simplified rules (burial, charged contacts, proline positions), flag potential stability hot spots per residue. Output a 'mutation sensitivity' list."},
  {id:295,cat:"Bioinformatics",title:"FASTA N50 & Assembly Stats",desc:"Given a multi-FASTA file of contigs, compute N50, N90, total assembly size, number of contigs, longest contig, and GC%. Format as a polished CLI report."},
  {id:296,cat:"Bioinformatics",title:"ClinVar Variant Rule Classifier",desc:"Hardcode 20 variant entries (pathogenic, benign, VUS). Write a rule-based classifier using amino acid properties to predict pathogenicity. Evaluate accuracy."},
  {id:297,cat:"Bioinformatics",title:"Nucleotide Statistics Reporter",desc:"Analyze any DNA/RNA sequence: dinucleotide frequency, CpG ratio, purine/pyrimidine ratio, longest homopolymer run. Format as a pretty report."},
  {id:298,cat:"Bioinformatics",title:"Protein MW Ladder Simulator",desc:"Given a list of protein names and masses, simulate an SDS-PAGE gel as ASCII. Show bands at correct relative positions on the 'gel'. Label the ladder bands."},
  {id:299,cat:"Bioinformatics",title:"BLOSUM Matrix Builder (Mini)",desc:"Given a toy MSA of 10 sequences, calculate substitution scores for 2 amino acid pairs using observed vs. expected substitution frequency. Compare to real BLOSUM62."},
  {id:300,cat:"Bioinformatics",title:"Mock AlphaFold Confidence Scorer",desc:"Given a protein sequence, assign a fake per-residue pLDDT score using simple rules (IDRs score low, hydrophobic cores score high). Plot the profile as ASCII."},
  {id:301,cat:"Bioinformatics",title:"Protein → Music Video Concept",desc:"Analyze a protein's structural regions. Generate a music video treatment where each domain is a scene: disordered regions are chaotic cuts, alpha helices are smooth pans, beta sheets are staccato shots."},
  {id:302,cat:"Bioinformatics",title:"Drug Repurposing Similarity Finder",desc:"Hardcode 20 drug targets as protein feature vectors (MW, charge, hydrophobicity). For a new target, find the most similar existing drug target using Euclidean distance."},
  {id:303,cat:"Bioinformatics",title:"Synthetic Biology Part Registry Mock",desc:"Build a small CLI 'parts registry': add genetic parts (promoters, RBSs, CDSs, terminators), tag them with properties, and compose a virtual operon from compatible parts."},
  {id:304,cat:"Bioinformatics",title:"Protein Contact Map (Hardcoded)",desc:"Given a list of 3D Cα coordinates, compute a contact map (residues within 8Å). Print it as an ASCII matrix. Identify secondary structure patterns from the map."},
  {id:305,cat:"Bioinformatics",title:"Genomic Variant Hotspot Finder",desc:"Given a list of variant positions on a chromosome, use a sliding window to find mutation hotspots. Plot density as ASCII. Label the top 3 hotspot regions."},
  {id:306,cat:"Bioinformatics",title:"Protein Folding: The Haiku Sequence",desc:"For each stage of protein folding (random coil → molten globule → native state), generate a haiku that describes the thermodynamics. Use actual ΔG values in the poems."},
  {id:307,cat:"Bioinformatics",title:"Metabolomics Peak Matcher",desc:"Given two lists of mass spectrometry m/z peaks (hardcoded), match peaks within a tolerance window. Report matched pairs, unmatched peaks, and match rate."},
  {id:308,cat:"Bioinformatics",title:"Anticodon → Codon Lookup Table",desc:"Build a complete anticodon-to-codon lookup table from the genetic code. Given a tRNA anticodon sequence, report which amino acid it carries and all synonymous codons."},
  {id:309,cat:"Bioinformatics",title:"Protein Expression System Selector",desc:"Rule-based CLI: given a protein's properties (size, disulfides, glycosylation, toxicity), recommend the best expression system: E. coli, yeast, insect, or mammalian. Explain the reasoning."},
  {id:310,cat:"Bioinformatics",title:"Bioinformatics Pipeline Cost Estimator",desc:"Given a pipeline's steps (FASTQ → alignment → variant calling → annotation), number of samples, and data size, estimate AWS/GCP compute costs. Build the cost model from first principles."},

  // ─── MUSIC (311-370) ───
  {id:311,cat:"Music",title:"Write a Song in an Unfamiliar Key",desc:"Force yourself into a key you rarely use. Write a complete song with verse and chorus."},
  {id:312,cat:"Music",title:"12-Bar Blues Improvisation",desc:"Record yourself improvising over a 12-bar blues progression for 5 minutes."},
  {id:313,cat:"Music",title:"Transcribe a Solo by Ear",desc:"Transcribe a short (under 1 minute) instrumental solo by listening only. No tabs."},
  {id:314,cat:"Music",title:"a cappella Arrangement",desc:"Arrange a pop song for voice only: melody, bass, harmony, and percussion parts."},
  {id:315,cat:"Music",title:"Field Recording Session (30 min)",desc:"Go outside with your phone. Record 10 interesting sounds. Pick your favorite."},
  {id:316,cat:"Music",title:"Write a Song About Your Commute",desc:"Walk somewhere. Write a song inspired entirely by what you see and hear."},
  {id:317,cat:"Music",title:"Invent a Musical Scale",desc:"Create an original scale by choosing intervals. Name it. Write a melody in it."},
  {id:318,cat:"Music",title:"Percussion Composition (Body Only)",desc:"Compose and perform a 2-minute rhythm piece using only body percussion."},
  {id:319,cat:"Music",title:"50 Lyric Lines (30 min timed)",desc:"Set a timer. Write 50 lyric lines in 30 minutes. Don't edit. Just generate."},
  {id:320,cat:"Music",title:"Play 4 Chords 10 Different Ways",desc:"Pick 4 chords. Play them in 10 completely different rhythms, voicings, or styles."},
  {id:321,cat:"Music",title:"Song from a Single Image",desc:"Find an image that moves you. Write a complete song inspired by only that image."},
  {id:322,cat:"Music",title:"Cover a Song in a Different Genre",desc:"Take a pop hit and perform it as jazz, classical, metal, or folk."},
  {id:323,cat:"Music",title:"Melody from a Conversation",desc:"Record a mundane conversation. Map the speech rhythm and pitch to musical notes. Play it."},
  {id:324,cat:"Music",title:"Drone Meditation Recording",desc:"Create a 5-minute ambient drone piece using any instrument or voice. Record it."},
  {id:325,cat:"Music",title:"Write a Song in 15 Minutes (Full)",desc:"Set a 15-minute timer. Write and record a complete song. Whatever comes out, release it."},
  {id:326,cat:"Music",title:"Reharmonize a Standard",desc:"Take a jazz standard and rewrite its chord progression with completely different chords."},
  {id:327,cat:"Music",title:"Set a Poem to Music",desc:"Pick a poem (not your own). Write a melody and chord structure for it. Perform it."},
  {id:328,cat:"Music",title:"One-Chord Song Challenge",desc:"Write a song using literally only one chord. Make it emotionally compelling anyway."},
  {id:329,cat:"Music",title:"Write a Song with Weird Time Signature",desc:"Compose and play something in 5/4, 7/8, or 11/16. Make it feel natural."},
  {id:330,cat:"Music",title:"Write a Jingle for Something You Love",desc:"Write a 30-second jingle for a brand, object, or concept you genuinely love."},
  {id:331,cat:"Music",title:"Minimalist Composition (3 Notes Only)",desc:"Write a complete piece of music using only 3 different notes. Make it interesting."},
  {id:332,cat:"Music",title:"Write Your Theme Song",desc:"The music that plays when you walk into a room. Write and record it. Make it YOU."},
  {id:333,cat:"Music",title:"Study One Musician for One Hour",desc:"Deep-listen to 5 songs by one artist. Take notes on their recurring techniques."},
  {id:334,cat:"Music",title:"Modal Music Exploration",desc:"Play the same melody in all 7 modal scales. Record each. Describe the feeling of each."},
  {id:335,cat:"Music",title:"Write a Lullaby",desc:"Compose an original lullaby: simple, repetitive, genuinely soothing."},
  {id:336,cat:"Music",title:"Ambient Texture Session",desc:"Create 5 minutes of ambient sound using voice, instrument, or found objects. No melody."},
  {id:337,cat:"Music",title:"Music Theory Concept Deep Dive",desc:"Pick one theory concept you're fuzzy on. Spend 45 focused minutes going deep."},
  {id:338,cat:"Music",title:"Mirror Song (Write a Response Track)",desc:"Pick a song you love. Write a response from the other character's perspective."},
  {id:339,cat:"Music",title:"Compose in Silence (Notation Only)",desc:"Compose a piece of music without an instrument. Notation only. Hear it in your head."},
  {id:340,cat:"Music",title:"Remix a Nursery Rhyme",desc:"Take any nursery rhyme and reimagine it in your own style."},
  {id:341,cat:"Music",title:"Sight-Reading Session (30 min)",desc:"Find sheet music you've never seen. Spend 30 minutes sight-reading. Log progress."},
  {id:342,cat:"Music",title:"Improvise with a Kitchen Timer",desc:"Set a timer for random intervals. Each ring: change key, tempo, or feel."},
  {id:343,cat:"Music",title:"Write a Diss Track About a Bad Habit",desc:"Write a rap diss track targeting one of your own bad habits. Make it actually funny."},
  {id:344,cat:"Music",title:"Score a Walk",desc:"Go on a 15-minute walk. Write music that perfectly captures what you experienced."},
  {id:345,cat:"Music",title:"Annotated Playlist (10 Songs, Written)",desc:"Make a 10-song playlist and write a paragraph about why each song is there."},
  {id:346,cat:"Music",title:"Chord Progression Journal (20 progressions)",desc:"Write and play 20 original chord progressions. Rate each one. Note your favorites."},
  {id:347,cat:"Music",title:"Compose a Birthday Song (Good Version)",desc:"Write a birthday song that isn't Happy Birthday—genuinely beautiful or funny."},
  {id:348,cat:"Music",title:"First Take Only Recording",desc:"Record a full solo performance of one song. Use only the first take. No edits."},
  {id:349,cat:"Music",title:"Write a Song That Makes You Laugh",desc:"Write a genuinely funny song. Not ironic. Actually funny, with jokes that land."},
  {id:350,cat:"Music",title:"Album Artwork for an Imaginary Album",desc:"Design and draw the cover art for an album you'll never make. Name the tracklist."},

  // ─── FITNESS (351-390) ───
  {id:351,cat:"Fitness",title:"Design Your Personal Workout",desc:"Write a personalized workout from scratch. Research each exercise. Do it once."},
  {id:352,cat:"Fitness",title:"Mobility Flow Sequence (30 min)",desc:"Design and perform a 30-minute mobility and stretching flow. Write it out first."},
  {id:353,cat:"Fitness",title:"Pushup Form Perfection",desc:"Record yourself doing 10 pushups. Critique your form. Fix issues. Record again."},
  {id:354,cat:"Fitness",title:"Walk 10,000 Steps (Consciously)",desc:"Walk 10k steps, but make it intentional: observe, photograph, or journal throughout."},
  {id:355,cat:"Fitness",title:"Try a Martial Art Move",desc:"Learn one basic technique from a martial art you've never studied. Practice 30 min."},
  {id:356,cat:"Fitness",title:"Handstand Practice Session",desc:"Spend 30 minutes on handstand progression: wall holds, kick-ups, balance practice."},
  {id:357,cat:"Fitness",title:"Breath Work (Box Breathing, 20 min)",desc:"Learn box breathing. Spend 20 minutes practicing with full attention to each phase."},
  {id:358,cat:"Fitness",title:"Design a Bodyweight Circuit",desc:"Design a 5-exercise bodyweight circuit, set reps and rounds, complete it 3 times."},
  {id:359,cat:"Fitness",title:"Sprint Intervals (10 Rounds)",desc:"Sprint 20 seconds, walk 40 seconds. 10 rounds. Track how you feel before and after."},
  {id:360,cat:"Fitness",title:"Core Strength Session (30 min)",desc:"Plan and perform a 30-minute core-only session. No crunches—effective movements only."},
  {id:361,cat:"Fitness",title:"Log Your Personal Records",desc:"Test and record 10 different fitness benchmarks. This is your starting point."},
  {id:362,cat:"Fitness",title:"Learn a Dance Move (Any Style)",desc:"Find a 10-minute tutorial for a specific dance move. Practice until you can do it."},
  {id:363,cat:"Fitness",title:"Animal Flow Movement Session",desc:"Learn the basic Animal Flow movements. Spend 30 minutes flowing between them."},
  {id:364,cat:"Fitness",title:"Design Your 30-Day Challenge",desc:"Write a 30-day progressive fitness challenge starting from your actual current level."},
  {id:365,cat:"Fitness",title:"Balance and Proprioception Training",desc:"Single-leg balance, eyes-closed balance, and wobble variations for 30 minutes."},
  {id:366,cat:"Fitness",title:"Jump Rope Routine",desc:"Learn or design a 10-minute jump rope routine. Master it within the hour."},
  {id:367,cat:"Fitness",title:"Complete a Beginner's Yoga Video",desc:"Pick one beginner yoga video and follow through the entire thing without pausing."},
  {id:368,cat:"Fitness",title:"Meditation Walk (Phone Free)",desc:"Walk for 30 minutes with no phone. Focus entirely on your senses. Write afterward."},
  {id:369,cat:"Fitness",title:"Cycling Route Planning + Ride",desc:"Plan a 30-minute cycling route. Ride it. Note what you'd change next time."},
  {id:370,cat:"Fitness",title:"5K Walk for Time",desc:"Walk a 5K course (outdoors or tracked). Record your time. Note your observations."},

  // ─── COOKING (371-410) ───
  {id:371,cat:"Cooking",title:"Master One Knife Cut",desc:"Pick one professional knife cut (brunoise, chiffonade, etc.). Practice for 30 minutes."},
  {id:372,cat:"Cooking",title:"Make a Stock from Scratch",desc:"Gather vegetable scraps or bones. Make a proper stock. Write the recipe down."},
  {id:373,cat:"Cooking",title:"3-Course Meal from Your Fridge",desc:"Inventory your fridge right now. Design and cook a 3-course meal using only those ingredients."},
  {id:374,cat:"Cooking",title:"Make Fresh Pasta from Scratch",desc:"Flour, eggs, salt. Roll and cut pasta by hand. Cook it. Taste it."},
  {id:375,cat:"Cooking",title:"Original Spice Blend Creation",desc:"Design and mix your own spice blend. Name it. Write the recipe. Test it on something."},
  {id:376,cat:"Cooking",title:"Perfect the Fried Egg (8 Ways)",desc:"Make 8 fried eggs: different oils, temperatures, and techniques. Compare the results."},
  {id:377,cat:"Cooking",title:"Cocktail/Mocktail Creation",desc:"Design an original drink. Name it. Write the recipe. Make two and taste-test them."},
  {id:378,cat:"Cooking",title:"Properly Caramelize Onions",desc:"Learn the actual technique. Spend 45 minutes making properly caramelized onions."},
  {id:379,cat:"Cooking",title:"Make Bread Without Yeast",desc:"Soda bread, bannock, or another quick bread. From scratch, in one hour."},
  {id:380,cat:"Cooking",title:"Recipe Without a Recipe",desc:"Cook a complete dish using no recipe. Just knowledge, instinct, and what's available."},
  {id:381,cat:"Cooking",title:"10 Vinaigrette Variations",desc:"Make 10 different vinaigrettes using different acids, oils, and aromatics. Taste each."},
  {id:382,cat:"Cooking",title:"Flavor Pairing Experiment",desc:"Pick two unusual flavor partners. Design and cook a dish that makes them work."},
  {id:383,cat:"Cooking",title:"Compound Butter (5 Flavors)",desc:"Make 5 different flavored compound butters. Roll them. Label. Taste test on bread."},
  {id:384,cat:"Cooking",title:"Cook a Full Meal in One Pan",desc:"Design and execute a complete meal—protein, starch, and vegetable—in a single pan."},
  {id:385,cat:"Cooking",title:"Zero-Waste Cooking Session",desc:"Cook something using parts you'd normally throw away: scraps, peels, stems, bones."},
  {id:386,cat:"Cooking",title:"Make Your Own Hot Sauce",desc:"Blend, cook, and bottle an original hot sauce from scratch. Test heat levels."},
  {id:387,cat:"Cooking",title:"Make Cheese from Scratch",desc:"Ricotta or paneer can be made in under 30 minutes. Make it. Write the recipe."},
  {id:388,cat:"Cooking",title:"One-Person Tasting Menu",desc:"Prepare 5 tiny tasting courses for yourself alone. Set the table. Make it ceremonial."},
  {id:389,cat:"Cooking",title:"Make Something You've Always Feared",desc:"Pick one technique you've always avoided. Research it. Do it."},
  {id:390,cat:"Cooking",title:"Blind Taste Test (Your Pantry)",desc:"With eyes closed, try 10 things from your pantry. See how many you can identify."},

  // ─── PHOTOGRAPHY (391-440) ───
  {id:391,cat:"Photography",title:"One-Hour Street Photography Walk",desc:"Go outside with your camera. No posing, no setup. Shoot 50+ images. Pick your best 5."},
  {id:392,cat:"Photography",title:"Self-Portrait Without Your Face",desc:"Take 10 self-portraits that are entirely about you but don't show your face."},
  {id:393,cat:"Photography",title:"Single-Color Photo Series (10 Images)",desc:"Photograph 10 things in a single dominant color. Arrange them into a series."},
  {id:394,cat:"Photography",title:"Macro Photography Session",desc:"Get as close as your camera allows to mundane things. Find 5 images that look alien."},
  {id:395,cat:"Photography",title:"Light Painting Long Exposure",desc:"Set up a long exposure in the dark. Use a flashlight to paint shapes in the air."},
  {id:396,cat:"Photography",title:"Shadow and Silhouette Series",desc:"Shoot exclusively the shadows of things, not the things themselves. 10 strong images."},
  {id:397,cat:"Photography",title:"Shoot With One Fixed Focal Length",desc:"Pick one lens or crop. Shoot 40 frames. Work within the constraint."},
  {id:398,cat:"Photography",title:"Manual Settings Mastery Session",desc:"Shoot 20 images in full manual mode. Intentionally over-expose, under-expose, nail it."},
  {id:399,cat:"Photography",title:"Photo Series: 10 Doors",desc:"Photograph 10 doors in your neighborhood. Look for personality, age, and character."},
  {id:400,cat:"Photography",title:"Reflection Photography",desc:"Find reflective surfaces everywhere. Photograph 15 compelling reflections."},
  {id:401,cat:"Photography",title:"Shoot the Same Subject 30 Ways",desc:"Pick one object. Photograph it 30 times with different angle, light, and framing."},
  {id:402,cat:"Photography",title:"Golden Hour Portfolio (15 Images)",desc:"Go out 30 minutes before sunset. Shoot until 15 after. Curate your best 15."},
  {id:403,cat:"Photography",title:"Black and White Only Session",desc:"Shoot 30 images with no color in mind—think only in tone, contrast, and texture."},
  {id:404,cat:"Photography",title:"Architecture Walk",desc:"Walk through your city looking only at buildings. 20 images that reveal architectural interest."},
  {id:405,cat:"Photography",title:"Create a Diptych Series (5 Pairs)",desc:"Shoot 5 pairs of images that speak to each other without being identical."},
  {id:406,cat:"Photography",title:"Rain Photography",desc:"Go out in the rain. Photograph the rain itself: puddles, drops, blurred motion."},
  {id:407,cat:"Photography",title:"Shoot Only from Ground Level",desc:"Spend an hour photographing everything from ground level or below. 30+ frames."},
  {id:408,cat:"Photography",title:"Tell a Story in 5 Frames",desc:"Plan and shoot a 5-image story with a clear beginning, tension, and resolution."},
  {id:409,cat:"Photography",title:"Window Light Portrait",desc:"Use a single window and natural light to shoot 15 portrait variations. No flash."},
  {id:410,cat:"Photography",title:"Night Photography Walk",desc:"Go out after dark. Shoot 20 images using only available artificial light."},
  {id:411,cat:"Photography",title:"Edit 10 Old Photos with New Intent",desc:"Take 10 images you've shot before. Re-edit them with completely different intent."},
  {id:412,cat:"Photography",title:"15-Minute Photowalk (100m Radius)",desc:"You cannot move more than 100m from a starting point. Find 20 interesting images."},
  {id:413,cat:"Photography",title:"Still Life in the Style of a Painter",desc:"Recreate the lighting and composition of a famous still life painting using photography."},
  {id:414,cat:"Photography",title:"Contact Sheet Review (Your Best 50)",desc:"Go through your photo library. Make a best-of contact sheet. Print or save it."},
  {id:415,cat:"Photography",title:"Forced Perspective Series",desc:"Create 5 forced perspective images that toy with scale in interesting ways."},
  {id:416,cat:"Photography",title:"Motion Blur Experiments",desc:"Pan with subjects, intentionally blur static scenes, and freeze fast motion. 20 images."},
  {id:417,cat:"Photography",title:"Photograph Infrastructure",desc:"Pipes, cables, vents, ducts—find industrial beauty in the infrastructure around you."},
  {id:418,cat:"Photography",title:"Shoot a Zine (12 Pages)",desc:"Plan and shoot a 12-page photo zine on a specific theme. Lay it out in your head."},
  {id:419,cat:"Photography",title:"Critique 10 of Your Own Photos",desc:"Pick 10 images you've taken. Write a paragraph of honest critique for each."},
  {id:420,cat:"Photography",title:"Water Photography Session",desc:"Find water anywhere. Photograph its movement, stillness, reflection, and texture."},

  // ─── SCIENCE & LEARNING (421-490) ───
  {id:421,cat:"Science & Learning",title:"Feynman Technique: Teach One Concept",desc:"Pick a concept you think you know. Explain it on paper as if to a 12-year-old. Find the gaps."},
  {id:422,cat:"Science & Learning",title:"Build a Simple Crystal Growing Experiment",desc:"Grow salt or sugar crystals with household materials. Photograph and document."},
  {id:423,cat:"Science & Learning",title:"Map One Scientific Paper's Argument",desc:"Read one paper in your field. Diagram its full argument: question, method, result, conclusion."},
  {id:424,cat:"Science & Learning",title:"Fermi Estimation Practice (10 Problems)",desc:"Estimate 10 quantities you can't look up: grains of sand on a beach, piano tuners in Chicago."},
  {id:425,cat:"Science & Learning",title:"Astronomy Observation Log",desc:"Go outside at night. Identify and log 10 celestial objects using a star map."},
  {id:426,cat:"Science & Learning",title:"Memory Palace Construction",desc:"Learn the method of loci. Build a memory palace for 20 items. Test yourself."},
  {id:427,cat:"Science & Learning",title:"Cognitive Bias Catalogue (10 Biases)",desc:"Research 10 cognitive biases you've never heard of. Write a personal example of each."},
  {id:428,cat:"Science & Learning",title:"Draw the Cell Cycle from Memory",desc:"Draw and label the complete cell cycle from memory. Check yourself afterward."},
  {id:429,cat:"Science & Learning",title:"History of One Everyday Object",desc:"Pick any object near you. Research its full history. Write 300 words on where it came from."},
  {id:430,cat:"Science & Learning",title:"Calculate Something Interesting About Your Life",desc:"Estimate: how many times your heart has beaten. How far you've walked. Meals eaten."},
  {id:431,cat:"Science & Learning",title:"Philosophy of Mind Crash Course",desc:"Summarize 3 major positions in philosophy of mind in plain language. Write your own view."},
  {id:432,cat:"Science & Learning",title:"Build a Paper Bridge (Strength Test)",desc:"Build a bridge from one sheet of paper and tape. Test how much weight it can hold."},
  {id:433,cat:"Science & Learning",title:"Statistical Experiment on Your Life",desc:"Collect data on something in your daily routine. Run basic statistics. Draw conclusions."},
  {id:434,cat:"Science & Learning",title:"Learn a Statistical Test and Apply It",desc:"Learn one statistical test you've never used. Apply it to a dataset you find or create."},
  {id:435,cat:"Science & Learning",title:"Design a Thought Experiment",desc:"Invent a thought experiment that gets at a philosophical question you care about."},
  {id:436,cat:"Science & Learning",title:"Geology Walk (Rock Types Near You)",desc:"Walk your neighborhood. Identify and photograph 5 different rock or mineral types."},
  {id:437,cat:"Science & Learning",title:"Draw and Label: DNA Replication",desc:"Draw the full DNA replication process step by step from memory. Check afterward."},
  {id:438,cat:"Science & Learning",title:"Protein Folding: Draw the Process",desc:"Research and draw the steps of protein folding from sequence to tertiary structure."},
  {id:439,cat:"Science & Learning",title:"Write Your Own Explainer Article",desc:"Pick a complex topic in your field. Write a 400-word explainer that's genuinely clear."},
  {id:440,cat:"Science & Learning",title:"AlphaFold Explainer (Written)",desc:"Write the clearest possible 500-word explanation of how AlphaFold predicts protein structure."},
  {id:441,cat:"Science & Learning",title:"CRISPR Mechanism Diagram",desc:"Draw and annotate the full CRISPR-Cas9 mechanism from memory: guide RNA, cleavage, repair."},
  {id:442,cat:"Science & Learning",title:"Research a Biotech Company's Pipeline",desc:"Pick a biotech company. Map their full clinical pipeline: indications, stages, and mechanisms."},
  {id:443,cat:"Science & Learning",title:"Annotate a Scientific Figure",desc:"Find a figure from a paper in your field. Write a complete annotation of every element."},
  {id:444,cat:"Science & Learning",title:"Concept Map of Your Field",desc:"Draw a concept map linking the major ideas, figures, and debates in your academic field."},
  {id:445,cat:"Science & Learning",title:"Teach a Biology Concept via Analogy",desc:"Explain gene regulation, protein folding, or signal transduction using only pop culture analogies."},
  {id:446,cat:"Science & Learning",title:"Draw the Central Dogma as a Comic Strip",desc:"Illustrate DNA replication, transcription, and translation as a 9-panel comic strip."},
  {id:447,cat:"Science & Learning",title:"Physics of Your Kitchen",desc:"Research the physics happening in your kitchen during cooking. Write 5 examples with explanation."},
  {id:448,cat:"Science & Learning",title:"Chemistry of Cooking: 5 Reactions",desc:"Research 5 chemical reactions in cooking you've never thought about. Demonstrate one at home."},
  {id:449,cat:"Science & Learning",title:"Gut Microbiome 30-Minute Dive",desc:"Read and take notes on the gut microbiome for 30 minutes. Summarize what surprised you."},
  {id:450,cat:"Science & Learning",title:"Map Your Experimental Workflow",desc:"Draw the full workflow of the last experiment or computational analysis you ran. Be exhaustive."},

  // ─── MINDFULNESS (451-500) ───
  {id:451,cat:"Mindfulness",title:"Gratitude Map (Visual)",desc:"Draw a visual map of everything you're grateful for right now. No limits, no rules."},
  {id:452,cat:"Mindfulness",title:"Values Clarification Exercise",desc:"From a list of 100 values, narrow to your top 5. Write why each made the cut."},
  {id:453,cat:"Mindfulness",title:"Sensory Inventory",desc:"Sit still for 10 minutes. Write every sound, texture, smell, and visual you notice."},
  {id:454,cat:"Mindfulness",title:"Life Wheel Assessment",desc:"Rate 8 areas of your life on a scale of 1-10. Write your honest assessment of each."},
  {id:455,cat:"Mindfulness",title:"Fear Inventory",desc:"List every fear you have, big and small. For each: is it rational? Can you act on it?"},
  {id:456,cat:"Mindfulness",title:"5-Year Vision Writing",desc:"Write a vivid, specific description of your life in exactly 5 years. Make it concrete."},
  {id:457,cat:"Mindfulness",title:"Eulogy Exercise (Write Your Own)",desc:"Write the eulogy you'd want someone to deliver at your funeral. Be honest."},
  {id:458,cat:"Mindfulness",title:"Morning Pages (3 Pages, Handwritten)",desc:"Write 3 pages by hand, first thing, without stopping. Let whatever comes, come."},
  {id:459,cat:"Mindfulness",title:"Energy Audit",desc:"List 20 activities in your life. Mark each as energy-giving or energy-draining."},
  {id:460,cat:"Mindfulness",title:"Forgiveness Letter (Don't Send)",desc:"Write a complete, sincere letter of forgiveness—to someone else or to yourself."},
  {id:461,cat:"Mindfulness",title:"Body Scan Journal",desc:"Do a body scan from head to toe. Write what you notice in each body region."},
  {id:462,cat:"Mindfulness",title:"Cognitive Distortion Check",desc:"List 5 recent negative thoughts. Identify the distortion. Write a reframe for each."},
  {id:463,cat:"Mindfulness",title:"Nature Sit (30 min, No Phone)",desc:"Find any outdoor spot. Sit for 30 minutes. No phone. Write what you noticed after."},
  {id:464,cat:"Mindfulness",title:"Regret Minimization Exercise",desc:"Imagine yourself at 80. What would you most regret not doing now? Write 10 answers."},
  {id:465,cat:"Mindfulness",title:"Anti-Résumé (Failures & Rejections)",desc:"Write the résumé of your failures: jobs not gotten, projects that failed, things you quit."},
  {id:466,cat:"Mindfulness",title:"Map Your Social Network",desc:"Draw a network map of the people in your life. Note relationship quality and frequency."},
  {id:467,cat:"Mindfulness",title:"Create a Personal Manifesto",desc:"Write 10-20 statements that define how you want to live. Specific and actionable."},
  {id:468,cat:"Mindfulness",title:"Negative Visualization Practice",desc:"Vividly imagine losing the 10 things most important to you. Write how you feel. Re-appreciate."},
  {id:469,cat:"Mindfulness",title:"Time Audit (Where Does It Go?)",desc:"Track every 15-minute block of your day for 2 days. Categorize. Draw conclusions."},
  {id:470,cat:"Mindfulness",title:"Write Your Life's Chapter Titles",desc:"Divide your life into chapters. Give each a title. Note what chapter you're in now."},
  {id:471,cat:"Mindfulness",title:"Goal Setting with OKRs (For Yourself)",desc:"Write 3 personal objectives with 3 key results each. Be specific and measurable."},
  {id:472,cat:"Mindfulness",title:"Letter from Your Future Self",desc:"Write a letter from your 70-year-old self to you right now. What do they want you to know?"},
  {id:473,cat:"Mindfulness",title:"Explore One Philosophy for One Hour",desc:"Pick Stoicism, Taoism, or Existentialism. Read 30 minutes. Write 30 minutes."},
  {id:474,cat:"Mindfulness",title:"Write Your Personal Mission Statement",desc:"Write a genuine, specific, true statement of who you are and what you stand for."},
  {id:475,cat:"Mindfulness",title:"One-Page Life Review",desc:"Write an honest one-page review of your life so far: what's working, what isn't, what's next."},
  {id:476,cat:"Mindfulness",title:"Assumptions Inventory",desc:"List 20 assumptions you make about yourself, people, and the world. Question each one."},
  {id:477,cat:"Mindfulness",title:"Digital Habit Audit",desc:"Review your screen time. Log what you're actually doing on your phone. Be honest."},
  {id:478,cat:"Mindfulness",title:"What I'm Running Toward / Running From",desc:"Write honestly about what you're moving toward and what you're running away from."},
  {id:479,cat:"Mindfulness",title:"Design Your Ideal Morning Routine",desc:"Research and design your ideal morning routine. Write it in detail. Try it tomorrow."},
  {id:480,cat:"Mindfulness",title:"Gratitude for Difficulty",desc:"List 10 hard things that happened to you. Write what each one gave you."},

  // ─── LANGUAGE (481-520) ───
  {id:481,cat:"Language",title:"Learn 30 Words in a Language You're Studying",desc:"Learn 30 new vocabulary words using flashcards, SRS, or your own method. Quiz yourself."},
  {id:482,cat:"Language",title:"Write a Short Story in a Foreign Language",desc:"Write a 1-page story in a language you're learning. No translation tools."},
  {id:483,cat:"Language",title:"Shadow a Native Speaker (30 min)",desc:"Find audio in your target language. Shadow the speaker's rhythm, sounds, and intonation."},
  {id:484,cat:"Language",title:"Create a Fictional Language (Basic Grammar)",desc:"Design a grammar for an invented language: pronoun system, verb conjugation, sentence order."},
  {id:485,cat:"Language",title:"Translate a Poem (Preserve the Feeling)",desc:"Translate a short poem from a language you know. Prioritize emotion over literalness."},
  {id:486,cat:"Language",title:"Etymological Family Tree",desc:"Pick a Latin or Greek root. Map all the English words that come from it in a tree diagram."},
  {id:487,cat:"Language",title:"Untranslatable Words Catalogue (20 Words)",desc:"Research and collect 20 words from other languages with no English equivalent."},
  {id:488,cat:"Language",title:"Cross-Linguistic False Friends List",desc:"List 20 'false friends'—words that look alike in two languages but mean different things."},
  {id:489,cat:"Language",title:"Design a Writing System",desc:"Invent an alphabet or syllabary. Design each character. Write a sample text in it."},
  {id:490,cat:"Language",title:"Language Family Tree Drawing",desc:"Draw the full tree of an entire language family from proto-language to modern descendants."},
  {id:491,cat:"Language",title:"Rhetoric Analysis: Famous Speech",desc:"Pick a famous speech. Identify and label every rhetorical device you can find."},
  {id:492,cat:"Language",title:"Idiom Collection (30 from One Language)",desc:"Collect 30 idioms from a language you're learning. Write literal translation and actual meaning."},
  {id:493,cat:"Language",title:"Slang Dictionary: Your Language Right Now",desc:"Write a real dictionary of current slang with definitions, examples, and tone notes."},
  {id:494,cat:"Language",title:"Onomatopoeia Survey (Across 5 Languages)",desc:"Collect how 20 sounds are represented onomatopoetically across 5 different languages."},
  {id:495,cat:"Language",title:"Word Association Chain (50 Words)",desc:"Start with one word. Make a chain of 50 free associations. Analyze where you ended up."},
  {id:496,cat:"Language",title:"Write an Original Myth in Your Target Language",desc:"Write a creation myth or folk tale from scratch in a language you're studying."},
  {id:497,cat:"Language",title:"Poetry Translation Comparison",desc:"Find 3 translations of the same foreign poem. Compare them. Write which is best and why."},
  {id:498,cat:"Language",title:"IPA Phonemic Inventory Practice",desc:"Learn the sounds of the IPA. Transcribe 10 words from your native language."},
  {id:499,cat:"Language",title:"Sound Change Rules (Invented Language)",desc:"Invent a set of historical sound changes that could produce a fictional daughter language."},
  {id:500,cat:"Language",title:"Calligraphy Practice Session (Any Script)",desc:"Spend 45 minutes practicing calligraphy in any script: your own, or a foreign one."},

  // ─── GAME DESIGN (501-550) ───
  {id:501,cat:"Game Design",title:"Design a Card Game (Two Players)",desc:"Design a two-player card game with original mechanics. Write the rules. Playtest it."},
  {id:502,cat:"Game Design",title:"Design a One-Page Dungeon",desc:"Create a complete dungeon: map, rooms, monsters, treasure, and secret—on a single page."},
  {id:503,cat:"Game Design",title:"Write a TTRPG Character Background",desc:"Write a richly detailed RPG character background with 3 flaws, 2 goals, and 5 key memories."},
  {id:504,cat:"Game Design",title:"World Map for a Campaign Setting",desc:"Draw a detailed world map for an original RPG setting. Name every region."},
  {id:505,cat:"Game Design",title:"Write a Monster Manual Entry",desc:"Design an original monster: stats, lore, tactics, and 3 unique abilities. Illustrate it."},
  {id:506,cat:"Game Design",title:"Design a Dice Game from Scratch",desc:"Invent a complete dice game using only standard dice. Write rules. Test it solo."},
  {id:507,cat:"Game Design",title:"NPC Gallery (10 NPCs)",desc:"Write 10 fully realized NPCs: name, appearance, voice, motivation, and secrets."},
  {id:508,cat:"Game Design",title:"Mystery Scenario One-Page",desc:"Design a mystery: 1 culprit, 3 suspects, 5 clues, and a solution that fits."},
  {id:509,cat:"Game Design",title:"Magic System Design",desc:"Invent a complete magic system: rules, costs, limits, and cultural implications."},
  {id:510,cat:"Game Design",title:"Faction Relationships Map",desc:"Design 5 factions for a fictional world. Draw their relationships: alliances, rivalries, secrets."},
  {id:511,cat:"Game Design",title:"Villain Motivation and Plan",desc:"Design a fully realized villain: their history, worldview, plan, and what would stop them."},
  {id:512,cat:"Game Design",title:"Speed Design: 3 Games in 45 Minutes",desc:"Design 3 different mini-games in 45 minutes. Write the rules for each. Rate yourself."},
  {id:513,cat:"Game Design",title:"Random Table Collection (5 Tables)",desc:"Write 5 different d20 random tables for an RPG setting of your choice."},
  {id:514,cat:"Game Design",title:"Campaign Hook (5 Different Hooks)",desc:"Write 5 completely different hooks that could start an RPG campaign. Each must compel."},
  {id:515,cat:"Game Design",title:"Design a Hidden Role Game",desc:"Create an original social/hidden role game (Mafia-style) with unique roles and mechanics."},
  {id:516,cat:"Game Design",title:"Worldbuilding: One Culture in Depth",desc:"Design one fictional culture: history, religion, food, clothing, and social structure."},
  {id:517,cat:"Game Design",title:"Write a Flavor Text Collection (20 Entries)",desc:"Write 20 pieces of game flavor text: item descriptions, location descriptions, lore snippets."},
  {id:518,cat:"Game Design",title:"One-Session Adventure Module",desc:"Write a complete one-session adventure: hook, 3 encounters, climax, and resolution."},
  {id:519,cat:"Game Design",title:"Tarot Deck for Your Setting",desc:"Design a full 22-card major arcana tarot deck themed around your fictional world."},
  {id:520,cat:"Game Design",title:"Design a Heist (Paper Plan)",desc:"Plan a fictional heist in complete detail: target, team, method, and escape."},
  {id:521,cat:"Game Design",title:"Artifact/Item Catalogue (10 Items)",desc:"Design 10 original magical or technological items with name, appearance, and properties."},
  {id:522,cat:"Game Design",title:"Draw a City Map for Your Campaign",desc:"Draw a detailed city map with neighborhoods, landmarks, and points of interest labeled."},
  {id:523,cat:"Game Design",title:"Solo RPG Session (One Hour)",desc:"Find or write a solo TTRPG. Play it for a full hour. Write the story that emerged."},
  {id:524,cat:"Game Design",title:"Quest Design (5 Quests)",desc:"Write 5 fully designed quests: objectives, complications, multiple outcomes, and rewards."},
  {id:525,cat:"Game Design",title:"Game Balance Analysis (Existing Game)",desc:"Pick any game you play. Write a detailed analysis of one balance problem and how to fix it."},

  // ─── CRAFT & MAKING (526-580) ───
  {id:526,cat:"Craft & Making",title:"Origami: Learn 3 New Folds",desc:"Find instructions for 3 origami models you've never folded. Complete all three."},
  {id:527,cat:"Craft & Making",title:"Hand-Bound Mini Book",desc:"Bind a small notebook by hand using folded paper and a needle and thread."},
  {id:528,cat:"Craft & Making",title:"Candle Making (Basic)",desc:"Melt wax, add scent, pour into a mold or jar. Make 3 candles with different scents."},
  {id:529,cat:"Craft & Making",title:"Pressed Flower Composition",desc:"Collect and press flowers/leaves. Arrange them into a composition. Seal it."},
  {id:530,cat:"Craft & Making",title:"Macramé Keychain",desc:"Learn basic macramé knots and make a keychain from string or twine."},
  {id:531,cat:"Craft & Making",title:"Friendship Bracelet (Original Pattern)",desc:"Design and knot a friendship bracelet with an original color pattern."},
  {id:532,cat:"Craft & Making",title:"Wire Sculpture (Small)",desc:"Bend wire into a small figurine or abstract sculpture. Mount it on a base."},
  {id:533,cat:"Craft & Making",title:"Soap Carving",desc:"Carve a bar of soap into any shape using a kitchen knife or similar tool."},
  {id:534,cat:"Craft & Making",title:"Hand Lettering on Rocks",desc:"Collect 5 smooth rocks. Paint meaningful words or illustrations on each one."},
  {id:535,cat:"Craft & Making",title:"Embroidery Sampler (5 Basic Stitches)",desc:"Learn 5 basic embroidery stitches. Make a sampler showing all 5 on one cloth."},
  {id:536,cat:"Craft & Making",title:"Blackout Poetry from a Book Page",desc:"Take a printed page. Use a marker to cover most words. The remaining words are the poem."},
  {id:537,cat:"Craft & Making",title:"Linocut Print",desc:"Carve a simple design into a lino block and print it 10 times. Note the variation."},
  {id:538,cat:"Craft & Making",title:"Mini Zine (Hand-Folded, 8 Pages)",desc:"Fold and cut one sheet of paper into an 8-page zine. Fill all 8 pages."},
  {id:539,cat:"Craft & Making",title:"Air Dry Clay Sculpture",desc:"Make a small original sculpture from air dry clay. Let it dry. Paint it if you want."},
  {id:540,cat:"Craft & Making",title:"Washi Tape Mosaic",desc:"Use washi tape strips to create a mosaic pattern or scene on a canvas or card."},
  {id:541,cat:"Craft & Making",title:"Tie Dye Experiment",desc:"Tie-dye one piece of clothing or fabric using a technique you've never tried."},
  {id:542,cat:"Craft & Making",title:"Natural Dye Experiment",desc:"Dye fabric or paper using natural materials: berries, turmeric, beets, onion skins."},
  {id:543,cat:"Craft & Making",title:"Weave a Miniature Tapestry",desc:"Build a tiny cardboard loom. Weave a small but complete tapestry with yarn or thread."},
  {id:544,cat:"Craft & Making",title:"Collage: Your Current Aesthetic",desc:"Cut from magazines/printed materials. Create a collage that captures your current taste."},
  {id:545,cat:"Craft & Making",title:"Custom Tote Bag (Hand-Painted)",desc:"Paint an original design on a plain canvas tote bag using fabric paint."},
  {id:546,cat:"Craft & Making",title:"Handmade Greeting Cards (5 Unique Cards)",desc:"Design and make 5 original greeting cards using whatever materials you have."},
  {id:547,cat:"Craft & Making",title:"Terrarium in a Bottle",desc:"Build a closed ecosystem terrarium inside a sealed bottle. Layer soil, plants, water."},
  {id:548,cat:"Craft & Making",title:"DIY Sketchbook Binding",desc:"Bind your own sketchbook: cut paper, fold signatures, stitch and glue a cover."},
  {id:549,cat:"Craft & Making",title:"Copper Wire Jewelry",desc:"Bend and coil copper wire into a ring, pendant, or earring pair."},
  {id:550,cat:"Craft & Making",title:"Paper Cutting (Kirigami)",desc:"Cut an intricate 3D pop-up or flat cutting pattern from a single sheet of paper."},
  {id:551,cat:"Craft & Making",title:"Scrimshaw-Style Scratch Drawing",desc:"Scratch a detailed design into dark-painted cardboard to reveal white underneath."},
  {id:552,cat:"Craft & Making",title:"Photo Collage (Physical, Printed)",desc:"Print 20 photos. Cut and arrange them into a physical collage with a theme."},
  {id:553,cat:"Craft & Making",title:"Sew a Small Pouch",desc:"Hand or machine sew a simple zippered or drawstring pouch. Actually use it."},
  {id:554,cat:"Craft & Making",title:"Custom Playing Card Design",desc:"Redesign one suit of a playing card deck (13 cards) with original artwork."},
  {id:555,cat:"Craft & Making",title:"Shadow Box Assembly",desc:"Collect meaningful small objects and arrange them in a box frame. Photograph it."},

  // ─── SOCIAL & COMMUNITY (556-580) ───
  {id:556,cat:"Social & Community",title:"Write Letters to 3 Old Friends",desc:"Handwrite letters to three people you haven't spoken to in over a year. Send them."},
  {id:557,cat:"Social & Community",title:"Bake Something for a Neighbor",desc:"Make something edible. Bring it to a neighbor you don't know well. Introduce yourself."},
  {id:558,cat:"Social & Community",title:"Plan a Perfect Night for Someone Else",desc:"Design and arrange a perfect night for a friend or partner. No shortcuts."},
  {id:559,cat:"Social & Community",title:"Teach Something You Know for Free",desc:"Share a skill you have with someone who doesn't. Make it a real lesson."},
  {id:560,cat:"Social & Community",title:"Donate 30 Items from Your Home",desc:"Fill a bag with 30 things you no longer need. Drop it off at a donation center."},
  {id:561,cat:"Social & Community",title:"Volunteer for 1 Hour",desc:"Find a local food bank, park cleanup, or shelter. Show up for one hour. Do the work."},
  {id:562,cat:"Social & Community",title:"Make a Care Package",desc:"Assemble a thoughtful care package for someone going through a hard time. Send it."},
  {id:563,cat:"Social & Community",title:"Interview a Family Member About Their Past",desc:"Record a conversation with an older family member about their life. Ask 10 real questions."},
  {id:564,cat:"Social & Community",title:"Leave Encouraging Notes in Public",desc:"Write 10 encouraging notes on paper. Leave them in library books, park benches, cafés."},
  {id:565,cat:"Social & Community",title:"Thank You Note Session (10 Notes)",desc:"Write sincere, specific thank-you notes to 10 people who've helped you. Send them."},
  {id:566,cat:"Social & Community",title:"Host a Mini Potluck (4-6 People)",desc:"Organize a small potluck. Handle all the logistics. Make it actually happen."},
  {id:567,cat:"Social & Community",title:"Walk and Talk with Someone",desc:"Invite one person for a walking conversation. 45 minutes. Phones away."},
  {id:568,cat:"Social & Community",title:"Co-Create Something with a Friend",desc:"Pick a project (song, drawing, story, meal) and make it together with someone else."},
  {id:569,cat:"Social & Community",title:"Introduce Two People Who Should Meet",desc:"Think of two people who'd benefit from meeting. Make the introduction happen today."},
  {id:570,cat:"Social & Community",title:"Write a LinkedIn Recommendation",desc:"Write an honest, specific, compelling recommendation for someone who deserves it."},

  // ─── PRODUCTIVITY (571-610) ───
  {id:571,cat:"Productivity",title:"GTD Weekly Review",desc:"Conduct a complete Getting Things Done weekly review: clear inboxes, update projects, plan ahead."},
  {id:572,cat:"Productivity",title:"Desk Reorganization",desc:"Clear your desk completely. Rebuild it from scratch with intention. Keep only what earns its place."},
  {id:573,cat:"Productivity",title:"Inbox Zero",desc:"Process your email inbox to zero. Every email: reply, file, delegate, or delete."},
  {id:574,cat:"Productivity",title:"Note-Taking System Redesign",desc:"Evaluate your current notes. Design a better system. Migrate your most important notes."},
  {id:575,cat:"Productivity",title:"One-Year Plan (Handwritten)",desc:"Write out your full plan for the next 12 months across every major life area."},
  {id:576,cat:"Productivity",title:"File System Cleanup",desc:"Spend an hour organizing your computer's file system. Delete ruthlessly. Name things properly."},
  {id:577,cat:"Productivity",title:"Subscription Audit",desc:"List every subscription you pay for. Cancel or pause anything you don't actively use."},
  {id:578,cat:"Productivity",title:"Brain Dump (Everything Out)",desc:"Write everything in your head onto paper: tasks, worries, ideas, plans. Don't organize. Just dump."},
  {id:579,cat:"Productivity",title:"Project Documentation",desc:"Pick an ongoing project. Write a complete documentation file: goals, status, next steps, blockers."},
  {id:580,cat:"Productivity",title:"Create a Weekly Template",desc:"Design your ideal weekly schedule as a time-block template you'll actually try to follow."},
  {id:581,cat:"Productivity",title:"Knowledge Base Article (For Yourself)",desc:"Write a detailed how-to guide for a process you do repeatedly. Make it reusable."},
  {id:582,cat:"Productivity",title:"Reading List Curation (6 Months)",desc:"Build your definitive reading list for the next 6 months. Research each book before adding."},
  {id:583,cat:"Productivity",title:"Batch Process All Admin Tasks",desc:"Collect all small admin tasks (forms, emails, calls). Complete them all in one session."},
  {id:584,cat:"Productivity",title:"Photo Library Cleanup (1 Hour)",desc:"Delete duplicates, blurry photos, and screenshots from your camera roll. Organize the rest."},
  {id:585,cat:"Productivity",title:"Financial Snapshot",desc:"Add up all income, spending, savings, and debt. Write a clear one-page financial snapshot."},
  {id:586,cat:"Productivity",title:"Habit Stack Design",desc:"Design a habit stack for your morning or evening using existing habits as anchors."},
  {id:587,cat:"Productivity",title:"Contact List Cleanup",desc:"Go through your phone contacts. Update, merge, and delete. Add notes about who people are."},
  {id:588,cat:"Productivity",title:"Review and Update Your Resume",desc:"Open your resume. Update every section. Is it current? Is it accurate? Is it good?"},
  {id:589,cat:"Productivity",title:"Build a Personal Wiki (Starter Page)",desc:"Start a personal wiki: write one page for a topic important to your life or work."},
  {id:590,cat:"Productivity",title:"Meal Plan for the Week (Full Plan)",desc:"Plan every meal for 7 days. Write the grocery list. Commit to it."},

  // ─── TRAVEL & EXPLORATION (591-630) ───
  {id:591,cat:"Travel & Exploration",title:"Urban Sketching Walk",desc:"Walk somewhere in your city. Sit and sketch 3 scenes you find beautiful or interesting."},
  {id:592,cat:"Travel & Exploration",title:"Neighborhood Archaeology Walk",desc:"Research your neighborhood's history. Walk it looking for physical evidence of the past."},
  {id:593,cat:"Travel & Exploration",title:"Find the Highest Point Near You",desc:"Research and reach the highest accessible point within 5km of you. Photograph it."},
  {id:594,cat:"Travel & Exploration",title:"Eat at a New Neighborhood Restaurant",desc:"Pick a nearby restaurant you've always ignored. Go. Write a full review."},
  {id:595,cat:"Travel & Exploration",title:"Visit a Museum You've Never Been To",desc:"Go to a local museum. Spend 45 minutes looking. Write about one thing that stayed with you."},
  {id:596,cat:"Travel & Exploration",title:"Get Off at an Unfamiliar Transit Stop",desc:"Ride any bus or train to a stop you've never been to. Explore on foot for 30 minutes."},
  {id:597,cat:"Travel & Exploration",title:"Travel Guide for Your Neighborhood",desc:"Write a genuine travel guide to your own neighborhood as if for a discerning visitor."},
  {id:598,cat:"Travel & Exploration",title:"Find Something Historical Within 1km",desc:"Research your immediate area. Find a building, plaque, or site with historical significance."},
  {id:599,cat:"Travel & Exploration",title:"Plan an Imaginary Trip (Full Itinerary)",desc:"Plan a fully detailed 7-day trip to anywhere in the world as if you were actually going."},
  {id:600,cat:"Travel & Exploration",title:"Visit a Farmer's Market, Cook What You Find",desc:"Visit a local market. Buy 3 unfamiliar items. Go home and cook something with them."},
  {id:601,cat:"Travel & Exploration",title:"Interview a Shop Owner",desc:"Walk into a small local business. Ask the owner about the story behind it. Write it."},
  {id:602,cat:"Travel & Exploration",title:"Park Observation Session",desc:"Go to a public park. Sit for 45 minutes. Write detailed observations of everything you see."},
  {id:603,cat:"Travel & Exploration",title:"Visit a Cemetery and Learn One Story",desc:"Walk a local cemetery. Find an interesting headstone. Research the person's life."},
  {id:604,cat:"Travel & Exploration",title:"Library Deep Dive (Unfamiliar Section)",desc:"Go to your library. Browse a section you've never explored. Check out something surprising."},
  {id:605,cat:"Travel & Exploration",title:"Night Walk with Journaling",desc:"Go for a 30-minute walk after dark. Pay close attention. Write 500 words afterward."},
  {id:606,cat:"Travel & Exploration",title:"Sunrise Observation",desc:"Wake up early. Watch the full sunrise with full attention. Write a description immediately after."},
  {id:607,cat:"Travel & Exploration",title:"Find Your City's Best View",desc:"Research or explore until you find a view of your city that moves you. Photograph it."},
  {id:608,cat:"Travel & Exploration",title:"Eat Only Foods from One Country for a Day",desc:"Plan and eat an entire day of meals from a single country's cuisine."},
  {id:609,cat:"Travel & Exploration",title:"Map Your Personal City",desc:"Draw a hand-drawn map of YOUR city—not real geography, but the places that matter to you."},
  {id:610,cat:"Travel & Exploration",title:"Walk Barefoot Somewhere Unusual",desc:"Take off your shoes somewhere safe but unfamiliar: grass, pebbles, sand. Walk and notice."},

  // ─── PERSONAL DEVELOPMENT (611-650) ───
  {id:611,cat:"Personal Development",title:"Cold Pitch Something You Want",desc:"Write and send a cold email to someone whose work you admire. Make it real and specific."},
  {id:612,cat:"Personal Development",title:"Research a Career Path for 1 Hour",desc:"Spend an hour seriously researching one career path you're curious about. Write what you find."},
  {id:613,cat:"Personal Development",title:"Negotiate Something (Anything)",desc:"Find one thing to negotiate: a bill, a rate, a fee. Research the ask. Make it."},
  {id:614,cat:"Personal Development",title:"Public Speaking Practice (Record Yourself)",desc:"Prepare and deliver a 3-minute speech on any topic. Record it. Watch it. Improve it."},
  {id:615,cat:"Personal Development",title:"Write Your Personal Brand Statement",desc:"Write a genuine, specific, true statement of who you are and what you stand for professionally."},
  {id:616,cat:"Personal Development",title:"Map Your Skills to a Career Gap",desc:"Take a job you want. List its requirements. Map your skills against them. Find the gaps."},
  {id:617,cat:"Personal Development",title:"Conduct a Mock Interview with Yourself",desc:"Write 10 interview questions for your target role. Answer them out loud. Record yourself."},
  {id:618,cat:"Personal Development",title:"Write 10 STAR Method Stories",desc:"Write 10 strong STAR-format stories from your experience. Cover diverse competencies."},
  {id:619,cat:"Personal Development",title:"Create a Learning Plan for a New Skill",desc:"Pick a skill you want. Build a serious 3-month curriculum with resources and milestones."},
  {id:620,cat:"Personal Development",title:"Network Coffee Chat (Arrange One)",desc:"Find one person in your field you'd like to learn from. Write and send the request."},
  {id:621,cat:"Personal Development",title:"Update Your LinkedIn Profile Completely",desc:"Rewrite every section of your LinkedIn profile from scratch with fresh eyes."},
  {id:622,cat:"Personal Development",title:"Failure Debrief (One Honest Write-Up)",desc:"Pick one significant failure. Write an honest debrief: what happened, why, and what you'd change."},
  {id:623,cat:"Personal Development",title:"Research Your Industry's Current Landscape",desc:"Spend an hour reading about major trends, players, and debates in your field. Summarize."},
  {id:624,cat:"Personal Development",title:"Write a Cover Letter You're Proud Of",desc:"Write one truly excellent cover letter for a job you actually want."},
  {id:625,cat:"Personal Development",title:"360-Degree Self Review",desc:"Write a thorough self-review from multiple angles: professional, social, creative, health."},
  {id:626,cat:"Personal Development",title:"Write Your Own Job Description",desc:"Write the job description for the exact role you want to have in 3 years. Be specific."},
  {id:627,cat:"Personal Development",title:"Research a Figure in Your Field",desc:"Pick someone respected in your field. Research their career path. Write what you'd emulate."},
  {id:628,cat:"Personal Development",title:"Portfolio Review (Self-Critique)",desc:"Review your current portfolio or body of work. Write an honest assessment of strengths and gaps."},
  {id:629,cat:"Personal Development",title:"Write an Op-Ed on Something You Care About",desc:"Write a fully formed 500-word opinion piece on a topic in your field or life."},
  {id:630,cat:"Personal Development",title:"Write a Grant/Fellowship Application Essay",desc:"Draft the personal statement for a fellowship or grant you're actually eligible for."},
  {id:631,cat:"Personal Development",title:"Map Your Professional Network",desc:"Draw a network map of your professional connections. Note strength and gaps."},
  {id:632,cat:"Personal Development",title:"Write Your 2-Minute Elevator Pitch",desc:"Write and rehearse a 2-minute pitch answering: what do you do and what are you looking for?"},
  {id:633,cat:"Personal Development",title:"Create a Personal Board of Directors",desc:"Identify 5 people (real or historical) you'd want on your personal advisory board. Write why."},
  {id:634,cat:"Personal Development",title:"Build a Reading Plan for Your Field",desc:"Find and annotate the 10 must-read books, papers, or resources in your professional field."},
  {id:635,cat:"Personal Development",title:"Write a Toast for Your Future Self",desc:"Write the toast you want someone to give at your retirement party. 3 minutes, heartfelt."},

  // ─── CREATIVE (636-720) ───
  {id:636,cat:"Creative",title:"Invent a New Sport",desc:"Create an entirely original sport with rules, equipment, field size, and positions. Diagram it."},
  {id:637,cat:"Creative",title:"Build a Conspiracy Theory (for Fun)",desc:"Create an elaborate, internally consistent (but fictional) conspiracy theory. Make it convincing."},
  {id:638,cat:"Creative",title:"Design a Theme Park (Map and Rides)",desc:"Design an original theme park. Draw the map and describe the 10 main attractions."},
  {id:639,cat:"Creative",title:"Invent a Holiday",desc:"Create a new holiday: its name, date, origin story, traditions, foods, and symbols."},
  {id:640,cat:"Creative",title:"Write a Fake Academic Paper Abstract",desc:"Write the abstract for a ridiculous but internally consistent fake academic paper."},
  {id:641,cat:"Creative",title:"Write a Menu for a Restaurant on Another Planet",desc:"What do they eat on Mars? On a space station? Design the full menu with descriptions."},
  {id:642,cat:"Creative",title:"Invent 10 New Olympic Sports",desc:"Design 10 events that should be in the Olympics. Write the rules and scoring for each."},
  {id:643,cat:"Creative",title:"Design a School for Something Unusual",desc:"Design a school for: spies, dragons, ghosts, time travelers. Curriculum, teachers, rules."},
  {id:644,cat:"Creative",title:"Write the Wikipedia Article for a Fictional Person",desc:"Make them historically plausible. Write it in full Wikipedia format with references."},
  {id:645,cat:"Creative",title:"Design a Mythological Pantheon",desc:"Create a complete pantheon: domains, relationships, symbols, and creation myth."},
  {id:646,cat:"Creative",title:"Write a Travel Log from Another Dimension",desc:"Write the travel journal of someone visiting a parallel universe. What's the same? Different?"},
  {id:647,cat:"Creative",title:"Create a Secret Society",desc:"Design a secret society: initiation, hierarchy, symbols, and ultimate goal."},
  {id:648,cat:"Creative",title:"Invent a Fictional Music Genre",desc:"Name and describe a genre that doesn't exist. Write its history, key artists, and albums."},
  {id:649,cat:"Creative",title:"Write a Creation Myth",desc:"Write an original creation myth for the universe from the perspective of a new culture you invent."},
  {id:650,cat:"Creative",title:"Invent an Alien Civilization",desc:"Design an alien civilization: biology, culture, history, technology, and first contact story."},
  {id:651,cat:"Creative",title:"Write a Fictional Dictionary of Slang from 2150",desc:"Invent 20 future slang terms with definitions and example sentences."},
  {id:652,cat:"Creative",title:"Invent 10 New Phobias",desc:"Invent 10 new phobias for modern anxieties that don't have names yet. Give them Latin names."},
  {id:653,cat:"Creative",title:"Write the Manual for a Fictional Machine",desc:"Write the complete operating manual for a machine that exists only in a story."},
  {id:654,cat:"Creative",title:"Alternate Ending for a Book You Love",desc:"Write a satisfying alternate ending for a book whose ending disappointed you."},
  {id:655,cat:"Creative",title:"Write the Opening Scene of 5 Different Novels",desc:"Write 5 distinct opening scenes, each for a completely different novel."},
  {id:656,cat:"Creative",title:"Invent a Cryptid",desc:"Design a new cryptid: region, description, behaviors, and legendary sightings."},
  {id:657,cat:"Creative",title:"Design a City That Grew Organically",desc:"Draw a city that grew before urban planning—organic streets, old districts, historical layers."},
  {id:658,cat:"Creative",title:"Invent a Philosophical Position",desc:"Create an original philosophical position with a name, core arguments, and historical context."},
  {id:659,cat:"Creative",title:"Write the Field Guide for Your Social Group",desc:"Write a naturalist's field guide to the specific social ecosystem of a friend group you know."},
  {id:660,cat:"Creative",title:"Write a Complete Mythology (5 Myths)",desc:"Write 5 myths for a culture you invent. Each should explain something in the natural world."},
  {id:661,cat:"Creative",title:"Design a Fictional Airline",desc:"Name and brand a fictional airline: livery, routes, safety card, and loyalty program."},
  {id:662,cat:"Creative",title:"Write a Museum Exhibit About Something Personal",desc:"Curate an exhibit about something from your life. Name the rooms, describe the artifacts."},
  {id:663,cat:"Creative",title:"Write the Back Cover Blurb for Your Life",desc:"Write the book back cover summary of your life story. Make people want to read it."},
  {id:664,cat:"Creative",title:"Invent a New Breakfast Cereal",desc:"Name it, design the box, write the ingredients, and invent the mascot and origin story."},
  {id:665,cat:"Creative",title:"Design a Personal Library Classification System",desc:"Create your own Dewey Decimal-like system for organizing your personal book collection."},
  {id:666,cat:"Creative",title:"Create an Art Manifesto",desc:"Write your personal manifesto about what art is for, what it must do, and what you stand for."},
  {id:667,cat:"Creative",title:"Invent Words English Needs (5 Words)",desc:"Invent 5 genuinely useful words. Write their etymology, definition, and usage examples."},
  {id:668,cat:"Creative",title:"Design a Soundtrack for a Film That Doesn't Exist",desc:"Write the tracklist, with artist and mood notes, for an imaginary film."},
  {id:669,cat:"Creative",title:"Invent a Fictional Annual Festival",desc:"Design a festival: origin story, schedule, foods, music, and what it celebrates."},
  {id:670,cat:"Creative",title:"Write a Time Capsule for 2075",desc:"Write the contents of a time capsule for someone opening it 50 years from now."},
  {id:671,cat:"Creative",title:"Design a City That Doesn't Exist",desc:"Plan a fictional city: layout, neighborhoods, transit, culture, and history."},
  {id:672,cat:"Creative",title:"Invent a Religion",desc:"Design a complete fictional religion: cosmology, ethics, rituals, texts, and schisms."},
  {id:673,cat:"Creative",title:"Write Fake Yelp Reviews for a Fictional Location",desc:"Write 5 fake reviews (different star ratings) for a place that doesn't exist."},
  {id:674,cat:"Creative",title:"Write a Newspaper Column As Yourself in 2050",desc:"Write a column from your 50-years-older perspective reflecting on the world and your choices."},
  {id:675,cat:"Creative",title:"Cast a Film of Your Life",desc:"Cast real actors in roles from your life. Write the casting notes for each person."},
  {id:676,cat:"Creative",title:"Invent an Impossible Machine",desc:"Design a machine that does something logically impossible. Label all components."},
  {id:677,cat:"Creative",title:"Write a Secret Society's Founding Document",desc:"Write the charter, oath, and first meeting minutes of a secret society you invent."},
  {id:678,cat:"Creative",title:"Design a Dream Library",desc:"Draw the floor plan and describe every section of your ideal personal library."},
  {id:679,cat:"Creative",title:"Write a Side Character's Entire Backstory",desc:"Pick any named side character from any story. Write their full biography."},
  {id:680,cat:"Creative",title:"Write Your Life's Unsolved Mysteries",desc:"List the questions from your past that remain unanswered. Write what you do and don't know."},

  // ─── WILDCARD (681-810) ───
  {id:681,cat:"Wildcard",title:"Recreate Your Favorite Album Art by Hand",desc:"Draw or paint your favorite album cover by hand. No tracing."},
  {id:682,cat:"Wildcard",title:"Write a Song Parody About Your Job",desc:"Take a well-known song. Rewrite the lyrics about your daily work experience."},
  {id:683,cat:"Wildcard",title:"Make Homemade Ink",desc:"Brew ink from berries, walnut husks, or iron gall. Write or draw with it."},
  {id:684,cat:"Wildcard",title:"Complete a Crossword (The Hard One)",desc:"Find a Sunday NYT or cryptic crossword. Sit with it for one hour. Get as far as you can."},
  {id:685,cat:"Wildcard",title:"Attempt a Magic Trick",desc:"Learn one card trick or sleight of hand. Practice for 45 minutes. Perform it."},
  {id:686,cat:"Wildcard",title:"Draw Every Meal You Ate This Week",desc:"From memory, sketch every meal you ate in the past 7 days. One page per day."},
  {id:687,cat:"Wildcard",title:"Solve 20 Sudoku Puzzles Back to Back",desc:"Find a Sudoku book or app. Do 20 puzzles in one session. Track completion times."},
  {id:688,cat:"Wildcard",title:"Write a Thank-You to Someone Who Changed Your Life",desc:"Write a full, sincere, specific letter to the person who changed your trajectory most."},
  {id:689,cat:"Wildcard",title:"Attempt a DIY Repair",desc:"Find something broken in your home. Research the repair. Attempt it."},
  {id:690,cat:"Wildcard",title:"Map Your House from Memory",desc:"Draw your home's floor plan entirely from memory, to scale as best you can."},
  {id:691,cat:"Wildcard",title:"Deep Clean One Neglected Space",desc:"Pick the most neglected space in your home. Give it a complete, thorough deep clean."},
  {id:692,cat:"Wildcard",title:"Make Your Own Puzzle",desc:"Draw or print an image. Glue it to cardboard. Cut it into 20+ irregular pieces. Solve it."},
  {id:693,cat:"Wildcard",title:"Memorize a Poem",desc:"Pick a poem you love. Spend 45 minutes memorizing it. Recite it from memory at the end."},
  {id:694,cat:"Wildcard",title:"Do Something You've Been Avoiding",desc:"Pick the thing you've been putting off most. Do it. Completely. Right now."},
  {id:695,cat:"Wildcard",title:"Complete a Paint-by-Numbers",desc:"Find a paint-by-numbers kit. Finish it in one sitting. Hang it unironically."},
  {id:696,cat:"Wildcard",title:"Write a Speech for Your Younger Self's Graduation",desc:"What would you say to yourself at 18? Write the full commencement speech."},
  {id:697,cat:"Wildcard",title:"Make Ice Cream from Scratch",desc:"Make ice cream in a bag or hand-churned. Invent an original flavor. Eat it."},
  {id:698,cat:"Wildcard",title:"Learn to Juggle (Or Get Closer)",desc:"Spend 45 minutes on juggling fundamentals. Record your starting and ending ability."},
  {id:699,cat:"Wildcard",title:"Build a Cardboard Model",desc:"Cut and build a small cardboard model of a building, vehicle, or object you design."},
  {id:700,cat:"Wildcard",title:"Press and Mount a Leaf Collection",desc:"Collect 10 different leaves. Press, mount, and label each one properly."},
  {id:701,cat:"Wildcard",title:"Solve a Rubik's Cube (Learn the Algorithm)",desc:"Learn the beginner's method. Apply it. Solve one full cube. Write what you learned."},
  {id:702,cat:"Wildcard",title:"Write 10 Micro-Essays (100 Words Each)",desc:"Write 10 complete, polished micro-essays on 10 different topics. Exactly 100 words each."},
  {id:703,cat:"Wildcard",title:"Do Something Analog You Usually Do Digitally",desc:"Plan in a paper planner. Write a letter instead of an email. Read a paper book."},
  {id:704,cat:"Wildcard",title:"Create a Reading Playlist for a Book You Love",desc:"Make a playlist that perfectly accompanies a book you love. Write the annotation."},
  {id:705,cat:"Wildcard",title:"Draw Your Family Tree (Artistic Version)",desc:"Draw your family tree as an actual illustrated tree with portraits or symbols for each person."},
  {id:706,cat:"Wildcard",title:"Make a Stop-Motion Flipbook",desc:"Draw 40+ sequential frames at the corner of a notebook. Flip through it. It moves."},
  {id:707,cat:"Wildcard",title:"Write a Play in 15 Minutes (Then Perform It Alone)",desc:"Write a short play. Then read all parts aloud in different voices. The audience is you."},
  {id:708,cat:"Wildcard",title:"Make a Time Capsule Box",desc:"Fill a small box with items from right now. Seal it. Set a calendar reminder to open it in 5 years."},
  {id:709,cat:"Wildcard",title:"Write Your Own Eulogy (Sincere Version)",desc:"Write the eulogy you wish someone would give at your funeral. Make it true."},
  {id:710,cat:"Wildcard",title:"Decorate One Room with Only What You Already Own",desc:"Rearrange objects to create a better-decorated space. No new purchases."},
  {id:711,cat:"Wildcard",title:"Plan the Perfect Museum (Themed)",desc:"Design a museum on a theme you love: layout, exhibitions, gift shop, and café menu."},
  {id:712,cat:"Wildcard",title:"Spend 1 Hour Learning to Draw One Thing",desc:"Pick one thing you can't draw well. Spend a full hour getting better at just that."},
  {id:713,cat:"Wildcard",title:"Make a Playlist for Every Year of Your Life",desc:"Find one song that represents each year of your life. Write why for at least 5."},
  {id:714,cat:"Wildcard",title:"Host a Solo Film Festival (3 Short Films)",desc:"Find 3 short films on a theme. Watch them. Write a review of the festival."},
  {id:715,cat:"Wildcard",title:"Reread a Childhood Book",desc:"Find a book you loved as a child. Reread it. Write what's different reading it now."},
  {id:716,cat:"Wildcard",title:"Spend 1 Hour on a Skill You Gave Up",desc:"Pick something you used to do that you stopped. Spend one hour returning to it."},
  {id:717,cat:"Wildcard",title:"Complete a Worry List and Triage It",desc:"List every worry in your head. Categorize: actionable, unactionable, irrelevant. Act on one."},
  {id:718,cat:"Wildcard",title:"Write a Profile of Your Hometown",desc:"Write a 500-word magazine-style profile of your hometown. Make it honest and specific."},
  {id:719,cat:"Wildcard",title:"Make Your Own Herbal Tea Blend",desc:"Research herbal flavor pairing. Blend your own loose-leaf tea from dried herbs. Test it."},
  {id:720,cat:"Wildcard",title:"Write the Perfect Apology",desc:"Write a real, sincere apology for something you owe someone. Send it or don't."},
  {id:721,cat:"Wildcard",title:"Spend an Hour on Flow (Any Skill)",desc:"Pick any skill you have. Set up ideal conditions. Work for an hour in pure flow."},
  {id:722,cat:"Wildcard",title:"Write 10 Things You'd Tell a Stranger",desc:"If you could tell a complete stranger 10 things you know to be true, what would they be?"},
  {id:723,cat:"Wildcard",title:"Make Something Out of Recycled Materials",desc:"Use only trash, cardboard, or recyclables. Make something useful or beautiful."},
  {id:724,cat:"Wildcard",title:"Write and Read Aloud a Poem Right Now",desc:"Write a poem in 20 minutes. Read it aloud. Record it. Listen back."},
  {id:725,cat:"Wildcard",title:"Write the Most Honest Thing You Know",desc:"Write the single most honest, uncomfortable, true thing you know about yourself. Sit with it."},
  {id:726,cat:"Wildcard",title:"Create a 'Done List' for the Past Year",desc:"Write everything you accomplished in the past year, no matter how small. Be exhaustive."},
  {id:727,cat:"Wildcard",title:"Make Homemade Play-Dough and Sculpt Something",desc:"Make play-dough from flour and salt. Sculpt 5 small objects. Photograph them."},
  {id:728,cat:"Wildcard",title:"Write a Friendship Documentary",desc:"Write a documentary profile of a friendship you value. History, key moments, what it means."},
  {id:729,cat:"Wildcard",title:"Write Your Life's Chapter Titles (Expanded)",desc:"Divide your life into chapters, including the one you're in and the one you want next."},
  {id:730,cat:"Wildcard",title:"Make Fresh Pasta and Invent a Sauce",desc:"Hand-roll pasta from scratch. Invent a sauce from whatever's in your fridge. Serve it."},
  {id:731,cat:"Wildcard",title:"Design a Tattoo Sleeve (Conceptually)",desc:"Design the full conceptual layout of a sleeve tattoo: images, themes, placement, flow."},
  {id:732,cat:"Wildcard",title:"Write 50 Things That Are True About Right Now",desc:"Write 50 true statements about your current moment: the room, the feeling, the season."},
  {id:733,cat:"Wildcard",title:"Cold Plunge (or Cold Shower)",desc:"Take a fully cold shower. Time it. Write about the physiological and mental experience."},
  {id:734,cat:"Wildcard",title:"Write the Game of Your Life as a Video Game Script",desc:"Write the intro cinematic, tutorial, and final boss for a video game about your life."},
  {id:735,cat:"Wildcard",title:"Visit a Bookstore and Buy Something Random",desc:"Go to a bookstore. Pick something from a genre you'd never read. Buy it. Start it."},
  {id:736,cat:"Wildcard",title:"Write a Mock Grant for Something Absurd",desc:"Write a rigorous scientific-sounding grant proposal for researching something ridiculous."},
  {id:737,cat:"Wildcard",title:"Find Your City's Best Hidden Gem",desc:"Research and visit a place in your city that almost nobody knows about. Write it up."},
  {id:738,cat:"Wildcard",title:"Write the Foreword to Your Imaginary Collected Works",desc:"Write the foreword an editor might write for a collected edition of your life's work."},
  {id:739,cat:"Wildcard",title:"Write a Fake Yelp Review for Your Own Brain",desc:"Leave a 1–5 star review for your own mind. Be specific. Complain about the management."},
  {id:740,cat:"Wildcard",title:"Attempt a Recipe in a Language You Don't Read",desc:"Find a recipe in a language you don't know. Attempt to cook it using only the photos."},
  {id:741,cat:"Wildcard",title:"Write Your Personal Mission Statement (3 Versions)",desc:"Write 3 versions of your personal mission statement: poetic, professional, and honest."},
  {id:742,cat:"Wildcard",title:"Write the Most Encouraging Thing You Could Hear",desc:"Write yourself the most encouraging, honest, loving message you could possibly receive."},
  {id:743,cat:"Wildcard",title:"Make a Packing List for Your Dream Trip",desc:"Pack (in writing) for the trip of your dreams. Research every item. Make it completist."},
  {id:744,cat:"Wildcard",title:"Start Something",desc:"Pick any idea on this list and just start. Don't finish. Don't plan. Just begin. The momentum is the point."},
  {id:745,cat:"Wildcard",title:"Write a Letter of Recommendation for Your Best Work",desc:"Write the most enthusiastic possible recommendation letter for a piece of work you're proud of."},
  {id:746,cat:"Wildcard",title:"Explore an Online Archive for 1 Hour",desc:"Pick the Internet Archive, a national library, or old newspaper archive. Explore with curiosity."},
  {id:747,cat:"Wildcard",title:"Rearrange Your Living Space",desc:"Move furniture in one room. See if a new arrangement serves you better. Actually do it."},
  {id:748,cat:"Wildcard",title:"Complete a Jigsaw Puzzle (500 pieces)",desc:"Do a 500-piece jigsaw. Don't stop. Develop a system. Finish it."},
  {id:749,cat:"Wildcard",title:"Design a Scent Based on a Memory",desc:"Describe a specific memory. Identify every smell in it. Describe a perfume that captures them all."},
  {id:750,cat:"Wildcard",title:"Solve a Lateral Thinking Puzzle Set",desc:"Find a set of 10 lateral thinking puzzles. Work through them systematically. Note your process."},
  {id:751,cat:"Wildcard",title:"Make a Hand-Drawn Comic Strip (8 Panels)",desc:"Write and draw an 8-panel comic strip with setup, development, and a punchline."},
  {id:752,cat:"Wildcard",title:"Write a Top 10 List Worth Sharing",desc:"Write a genuinely useful, interesting, original top-10 list on any topic. Make it publishable."},
  {id:753,cat:"Wildcard",title:"Spend One Hour Doing Absolutely Nothing",desc:"Sit or lie down. No phone, no book, no music. One full hour. Just exist. Write after."},
  {id:754,cat:"Wildcard",title:"Make a Scrapbook Page",desc:"Gather photos, ticket stubs, notes, and scraps. Make one beautifully composed scrapbook page."},
  {id:755,cat:"Wildcard",title:"Research and Write About a Local Historical Event",desc:"Find an event that happened in your city or region. Research it. Write 500 words."},
  {id:756,cat:"Wildcard",title:"Write a History of Your Home",desc:"Research your home's full ownership and building history. Write a 500-word history."},
  {id:757,cat:"Wildcard",title:"Draw Self-Portraits Every Morning for a Week (Plan It)",desc:"Plan and start this: one quick self-portrait each morning for 7 days. Do the first one now."},
  {id:758,cat:"Wildcard",title:"Catalog All Your Current Projects",desc:"List every active project in your life (creative, professional, personal). Evaluate each."},
  {id:759,cat:"Wildcard",title:"Write a Myth for Something in Your Life",desc:"Write a creation myth explaining why something in your personal life is the way it is."},
  {id:760,cat:"Wildcard",title:"Write Your Life's Unsolved Mysteries",desc:"List the questions from your past that remain unanswered. Write what you do and don't know."},
  {id:761,cat:"Wildcard",title:"Teach a Pet a New Trick (or Try)",desc:"Find a new trick to teach your pet. Or find a video and replicate the training method."},
  {id:762,cat:"Wildcard",title:"Make a Stop-Motion Animation (8 frames)",desc:"Place an object. Move it 1cm. Photograph. Repeat 8 times. Play the frames in sequence."},
  {id:763,cat:"Wildcard",title:"Write a Character Sketch of Someone on Your Commute",desc:"Observe someone discreetly. Write their character sketch from nothing but what you see."},
  {id:764,cat:"Wildcard",title:"Make Pressed Flower Cards (5 Cards)",desc:"Press flowers and leaves. Create 5 botanical art cards by arranging and gluing them."},
  {id:765,cat:"Wildcard",title:"Explore a Subject for 1 Hour You Know Nothing About",desc:"Pick any subject you know absolutely nothing about. Spend one hour going deep. Write what surprised you."},
  {id:766,cat:"Wildcard",title:"Write a Wikipedia-Style Article About Your Day",desc:"Write today's events as a formal Wikipedia article with citations, categories, and a lead paragraph."},
  {id:767,cat:"Wildcard",title:"Solve a Crossword You Write Yourself",desc:"Create a 10-clue crossword on a topic you know well. Verify it solves. Give it to someone."},
  {id:768,cat:"Wildcard",title:"Build Something with LEGO or Blocks",desc:"Build something from imagination using whatever building toys you have. No instructions."},
  {id:769,cat:"Wildcard",title:"Write the Dictionary of You",desc:"Write a personal glossary of the words, phrases, and concepts that define your inner world."},
  {id:770,cat:"Wildcard",title:"Revisit Your Hometown (or A Place That Shaped You)",desc:"Visit somewhere important from your earlier life. Observe what's changed. Write about it."},
  {id:771,cat:"Wildcard",title:"Write a Satire About Something That Annoys You",desc:"Write a sharp, funny satirical piece about something that genuinely irritates you."},
  {id:772,cat:"Wildcard",title:"Learn the Bones of the Hand",desc:"Draw your hand. Label every bone from memory. Check your accuracy."},
  {id:773,cat:"Wildcard",title:"Write an Extremely Detailed Recipe for Something Simple",desc:"Write a recipe for toast, a boiled egg, or a glass of water. Make it rigorously detailed."},
  {id:774,cat:"Wildcard",title:"Draw Your Ideal Coffee Shop Interior",desc:"Draw the full interior illustration of the perfect café, every detail of ambiance included."},
  {id:775,cat:"Wildcard",title:"Write a 30-Day Habit Proposal (For One Habit)",desc:"Choose one habit. Write a full 30-day plan with progressions, contingencies, and metrics."},
  {id:776,cat:"Wildcard",title:"Make a Mix CD You'd Give to Your Best Friend",desc:"Design a 12-song mix. Write the liner notes for why each song is there. Make it special."},
  {id:777,cat:"Wildcard",title:"Write a Mock Press Release About Something Personal",desc:"Write a professional corporate press release about something mundane happening in your life."},
  {id:778,cat:"Wildcard",title:"Invent a Word and Use It in a Sentence 10 Ways",desc:"Invent one new word. Write 10 sentences using it in 10 different contexts."},
  {id:779,cat:"Wildcard",title:"Go an Entire Hour Without Checking Your Phone",desc:"Set it face down. Timer on. Write about what you noticed when the hour was up."},
  {id:780,cat:"Wildcard",title:"Design Your Dream Workspace",desc:"Write and draw your ideal working environment in full: space, routine, tools, ambiance, culture."},
  {id:781,cat:"Wildcard",title:"Write a 500-Word Essay on a Topic You Disagree With",desc:"Argue for a position you personally disagree with. Make the strongest possible case. Then rebut it."},
  {id:782,cat:"Wildcard",title:"Make a Homemade Board Game",desc:"Design and physically make a complete board game with a board, pieces, and rulebook."},
  {id:783,cat:"Wildcard",title:"Practice a Foreign Phrase Until It Sounds Right",desc:"Find a phrase in a language you're learning. Spend 30 minutes on pronunciation until it sounds native."},
  {id:784,cat:"Wildcard",title:"Write a Detailed Dream Journal for a Week (Plan It Now)",desc:"Start tonight. Keep a notebook beside your bed. Write every dream immediately upon waking. Do this for 7 days."},
  {id:785,cat:"Wildcard",title:"Go to Bed One Hour Earlier Than Usual",desc:"Tonight. No scrolling, no content. One hour earlier. Write about the morning after."},
  {id:786,cat:"Wildcard",title:"Write 20 Opening Lines for Novels You'll Never Write",desc:"Write 20 killer first lines for 20 different books. Each should make you want to read the rest."},
  {id:787,cat:"Wildcard",title:"Make a Menu for Your Fantasy Restaurant",desc:"Design the full menu of your dream restaurant. Name every dish. Write descriptions."},
  {id:788,cat:"Wildcard",title:"Write a One-Person Play (10 Minutes)",desc:"Write a 10-minute monologue. Perform it alone. Record it. Watch it without cringing."},
  {id:789,cat:"Wildcard",title:"Learn to Whistle Properly",desc:"If you can't whistle, spend 45 minutes learning. If you can, learn a more complex technique."},
  {id:790,cat:"Wildcard",title:"Make a Sock Puppet and Film a Scene",desc:"Make a sock puppet. Write a 1-minute scene. Film it on your phone. Watch it."},
  {id:791,cat:"Wildcard",title:"Write a Field Guide Entry for a Person You Know",desc:"Write a naturalist's field guide entry for a real person you know well. Habitat, behaviors, diet."},
  {id:792,cat:"Wildcard",title:"Build a Tiny Garden (Even on a Windowsill)",desc:"Plant something. A seed, a herb, anything. Put it in a container. Commit to keeping it alive."},
  {id:793,cat:"Wildcard",title:"Write a Strongly Worded Letter to Your Past Self",desc:"Pick a specific moment where you made a bad decision. Write a clear, direct letter about it."},
  {id:794,cat:"Wildcard",title:"Research the History of Your Name",desc:"Research your full name: etymology, origin, historical figures who shared it, meaning."},
  {id:795,cat:"Wildcard",title:"Write a Thorough Complaint About a Minor Inconvenience",desc:"Pick something trivially annoying. Write a 500-word, maximally thorough formal complaint about it."},
  {id:796,cat:"Wildcard",title:"Create a Signature Drink",desc:"Design and mix a signature drink that represents your personality. Name it. Write the recipe."},
  {id:797,cat:"Wildcard",title:"Write the Instructions for Being You",desc:"Write a complete operational guide for being you: how you work, what you need, your quirks."},
  {id:798,cat:"Wildcard",title:"Make a Giant List: 100 Things You Want to Do",desc:"Write 100 things you want to do before you die. No filter. No order. Just get to 100."},
  {id:799,cat:"Wildcard",title:"Write a 'User Reviews' Page for Yourself",desc:"Write 5 reviews of yourself from different perspectives: friend, colleague, critic, parent, stranger."},
  {id:800,cat:"Wildcard",title:"Spend 30 Minutes Staring Out the Window",desc:"No phone. No agenda. Just look outside for 30 minutes. Write what you thought about after."},
  {id:801,cat:"Wildcard",title:"Research a Completely Random Country",desc:"Pick a country you know nothing about. Spend 45 minutes reading about it. Write 5 surprising things."},
  {id:802,cat:"Wildcard",title:"Write a Theme Song for a Friend",desc:"Write and record or notate a 30-second theme song that captures one specific friend."},
  {id:803,cat:"Wildcard",title:"Build a Physical Object Without Instructions",desc:"Take materials you have. Build something. Anything. Just make a physical thing from scratch."},
  {id:804,cat:"Wildcard",title:"Write Your Personal Credo (10 Lines)",desc:"Write 10 lines that you genuinely live by or want to live by. Make each one specific."},
  {id:805,cat:"Wildcard",title:"Take a Photo That Makes You Proud",desc:"Go out specifically to take one photograph you're genuinely proud of. Don't stop until you get it."},
  {id:806,cat:"Wildcard",title:"Write a Review of This Year So Far",desc:"Write an honest review of your current year: what happened, what worked, what didn't, your rating."},
  {id:807,cat:"Wildcard",title:"Teach Something to a Rubber Duck",desc:"Pick a concept you're trying to understand. Explain it out loud to an inanimate object. Write what you learned."},
  {id:808,cat:"Wildcard",title:"Complete Something You've Left Unfinished",desc:"Find one creative, personal, or professional project you've abandoned. Finish it right now."},
  {id:809,cat:"Wildcard",title:"Make a Detailed Budget for Your Dream Life",desc:"Price out every element of the life you actually want to live. What would it cost per year?"},
  {id:810,cat:"Wildcard",title:"Write the Story of How You Got Here",desc:"Write a complete, honest account of the chain of decisions and accidents that led you to exactly where you are right now."},

  // ─── WRITING (811-830) ───
  {id:811,cat:"Writing",title:"Micro-Fiction Marathon",desc:"Write 10 complete stories in exactly 50 words each. Every one needs a beginning, middle, and end. Set a timer and don't stop."},
  {id:812,cat:"Writing",title:"Restaurant Review for a Fictional Diner",desc:"Invent a restaurant that doesn't exist. Write a full Yelp-style review, including the ambiance, the server's name, and one dish that was inexplicably perfect."},
  {id:813,cat:"Writing",title:"Stage Directions Where Nothing Happens",desc:"Write a full page of stage directions for a scene in which absolutely nothing occurs. Make it gripping."},
  {id:814,cat:"Writing",title:"Your Personal Theme Song Lyrics",desc:"Write the complete lyrics—verse, chorus, bridge—for the theme song of your life. Don't be modest. Make it an earworm."},
  {id:815,cat:"Writing",title:"Choose-Your-Own-Adventure (One Page)",desc:"Write a one-page CYOA with at least three decision points and three distinct endings. Use second person. Make at least one ending absurd."},
  {id:816,cat:"Writing",title:"Eulogy for the Current Year",desc:"Write a sincere funeral eulogy for the year you're currently in. Acknowledge its flaws, celebrate the unexpected, and wish it well."},
  {id:817,cat:"Writing",title:"Missed Connections: Historical Edition",desc:"Write a Craigslist-style 'missed connections' post between two historical figures who never actually met. Make it very specific."},
  {id:818,cat:"Writing",title:"World's Most Detailed To-Do List",desc:"Write a to-do list for one completely mundane task—like making toast—broken into at least 30 specific, absurdly granular steps."},
  {id:819,cat:"Writing",title:"Limerick Family Portrait",desc:"Write a limerick about every person in your immediate family or household. Each one must be accurate, kind, and actually funny."},
  {id:820,cat:"Writing",title:"Wikipedia Entry for Yourself in 2050",desc:"Write the Wikipedia summary paragraph for yourself as you'll be known in 30 years. Aim high. Include at least one wildly unexpected fact."},
  {id:821,cat:"Writing",title:"Cover Letter for a Job That Doesn't Exist",desc:"Write a full, sincere cover letter for a job opening that has never existed: Professional Cloud Namer, Chief Vibes Officer, Head of Fictional Cartography."},
  {id:822,cat:"Writing",title:"10 Fortunes That Are Actually Useful",desc:"Write 10 fortune-cookie-sized pieces of advice that are specific, actionable, and genuinely good. None of them may be vague."},
  {id:823,cat:"Writing",title:"Origin Story for Your Name",desc:"Write a fictional, mythological origin story for your first name. Go full epic—gods, prophecies, betrayals, the works."},
  {id:824,cat:"Writing",title:"Terms & Conditions for Your Birthday Party",desc:"Write the full legal-style T&C that guests must agree to before attending your birthday. Include liability clauses and cookie policy."},
  {id:825,cat:"Writing",title:"Press Conference: Mundane Announcement",desc:"Write a full press conference transcript in which you announce something completely mundane—you bought a new plant, you switched to decaf—as if it's global news."},
  {id:826,cat:"Writing",title:"Poem from One Page of a Random Book",desc:"Open any book to a random page. Write a poem using only words that appear on that page. No words from outside it."},
  {id:827,cat:"Writing",title:"Making Of: A Day in Your Life",desc:"Write a 'making of' documentary script for an ordinary day in your life. Interview yourself. Include behind-the-scenes drama about breakfast."},
  {id:828,cat:"Writing",title:"Pitch for a Startup Nobody Needs",desc:"Write a full startup pitch—problem, solution, market size, business model—for a company that solves a problem absolutely nobody has."},
  {id:829,cat:"Writing",title:"Dialogue: Present You vs. 80-Year-Old You",desc:"Write a full conversation between you now and you at 80. Make it awkward, tender, and at least a little funny."},
  {id:830,cat:"Writing",title:"Legal Contract for a Friendship",desc:"Write a full legally-styled contract for becoming your friend. Include obligations, breach conditions, renewal terms, and a governing law clause."},

  // ─── ART & DRAWING (831-850) ───
  {id:831,cat:"Art & Drawing",title:"Childhood Home from Memory",desc:"Draw every room of your childhood home entirely from memory. Don't look anything up. Label what you remember and leave blank what you don't."},
  {id:832,cat:"Art & Drawing",title:"Visual Timeline of Your Day",desc:"Illustrate today as a timeline using only icons and tiny drawings—no words. Every event gets a doodle."},
  {id:833,cat:"Art & Drawing",title:"5 Self-Portraits, 5 Styles",desc:"Draw yourself five times, each in a completely different style: realistic, cubist, cartoon, pixel art, and one style you invent."},
  {id:834,cat:"Art & Drawing",title:"Creature for Each Letter of Your Name",desc:"Design a small, distinct creature for each letter of your first name. Give each one a habitat and one special ability."},
  {id:835,cat:"Art & Drawing",title:"Minimalist Book Poster",desc:"Design a minimalist poster for your favorite book using no text—just shapes, color, and composition to capture the feeling of it."},
  {id:836,cat:"Art & Drawing",title:"Your Personal Flag",desc:"Design a flag for yourself: choose colors and symbols that mean something real to you. Write the key explaining each element."},
  {id:837,cat:"Art & Drawing",title:"Dream City Cross-Section",desc:"Draw your ideal city in a side-view cross-section, underground to rooftop. Label every level and zone."},
  {id:838,cat:"Art & Drawing",title:"Hand-Illustrated Monthly Calendar",desc:"Illustrate next month's calendar by hand. Give each week its own decorative theme."},
  {id:839,cat:"Art & Drawing",title:"Non-Dominant Hand Portrait",desc:"Draw a portrait of someone you know using only your non-dominant hand. Commit fully. Do not switch."},
  {id:840,cat:"Art & Drawing",title:"Packaging Design for a Product You'd Buy",desc:"Design the full packaging for a product you'd genuinely want to buy—front, back, and side panel with made-up copy."},
  {id:841,cat:"Art & Drawing",title:"Three-Panel Comic: A Recurring Thought",desc:"Turn a thought that won't leave your head into a three-panel comic strip. Give it a punchline."},
  {id:842,cat:"Art & Drawing",title:"Still Life: Inside Your Fridge",desc:"Open your fridge. Draw exactly what you see as a formal still life, as if it belongs in an art museum."},
  {id:843,cat:"Art & Drawing",title:"Abstract Painting for a Song",desc:"Play one song you love. Paint or draw whatever the music makes you see. Don't think. Just react."},
  {id:844,cat:"Art & Drawing",title:"10 Idioms, Illustrated Literally",desc:"Choose 10 idioms and illustrate each one as if it were literally true. 'Barking up the wrong tree.' 'Break a leg.' Go."},
  {id:845,cat:"Art & Drawing",title:"Fantasy Map of Your Town",desc:"Redraw your hometown as a fantasy world map—rename the streets, add ruins and dungeons, give it a dramatic legend."},
  {id:846,cat:"Art & Drawing",title:"Paper Cut Artwork",desc:"Using only scissors and a single sheet of paper, create a detailed silhouette scene. No glue, no color—just the cut."},
  {id:847,cat:"Art & Drawing",title:"Five Hands, Five Positions",desc:"Draw your own hand five times in five completely different positions. Take your time. Make each one a study."},
  {id:848,cat:"Art & Drawing",title:"Creature Evolved for Your Bedroom",desc:"Design an animal that evolved specifically to survive in your bedroom. Justify its adaptations with a labeled diagram."},
  {id:849,cat:"Art & Drawing",title:"Hand-Lettered Quote Poster",desc:"Pick a quote that genuinely moves you and hand-letter it as a designed poster. Play with size, weight, and layout."},
  {id:850,cat:"Art & Drawing",title:"Illustrate a Wikipedia Article",desc:"Pick a Wikipedia article on something obscure and illustrate it—create the diagram or image the article deserves but doesn't have."},

  // ─── CODING (851-870) ───
  {id:851,cat:"Coding",title:"Random Workout Generator CLI",desc:"Build a command-line tool that generates a random workout: 5 exercises, 3 sets each, with randomized rep counts and rest times."},
  {id:852,cat:"Coding",title:"Number-to-Words Converter",desc:"Write a function that converts any integer to its English words (42 → 'forty-two', 1001 → 'one thousand and one'). Handle edge cases."},
  {id:853,cat:"Coding",title:"Longest Sentence Finder",desc:"Write a script that reads any text file and finds and prints the longest sentence, its word count, and its line number."},
  {id:854,cat:"Coding",title:"Dice Roller with Modifiers",desc:"Build a CLI dice roller for tabletop gaming: support notation like '2d6+3', '1d20', '4d4-1'. Print each roll and the total."},
  {id:855,cat:"Coding",title:"Book Tracker with Text File DB",desc:"Build a simple library tracker in Python. Store books (title, author, status) in a plain text file. Support add, list, and mark-read."},
  {id:856,cat:"Coding",title:"Random Colour Palette Generator",desc:"Write a script that generates 5 harmonious hex colour codes based on a randomly chosen hue and harmony type (complementary, triadic, analogous)."},
  {id:857,cat:"Coding",title:"Caesar Cipher Encoder/Decoder",desc:"Build a full Caesar cipher tool: encode and decode any text with any shift value. Add a brute-force 'crack' mode that tries all 25 shifts."},
  {id:858,cat:"Coding",title:"Terminal Wordle Clone",desc:"Build a working Wordle clone in the terminal. 5-letter words, 6 guesses, coloured feedback (use ANSI codes). Load your own word list."},
  {id:859,cat:"Coding",title:"Grocery List CLI",desc:"Write a grocery list manager: add items, remove items, mark as bought, and display the remaining list. Save state to a file."},
  {id:860,cat:"Coding",title:"Daily Affirmation Picker",desc:"Write a script that reads a list of affirmations from a file and prints one random one, formatted nicely, each time it runs."},
  {id:861,cat:"Coding",title:"Days-Until Calculator",desc:"Write a script that takes any future date as input and prints: days until, weeks until, and a fun message when fewer than 7 days remain."},
  {id:862,cat:"Coding",title:"Reading List Tracker with Ratings",desc:"Build a CLI reading tracker: log books with title, author, start date, finish date, and a 1-5 rating. Show average rating and days per book."},
  {id:863,cat:"Coding",title:"Tip Calculator with Split",desc:"Build a tip calculator that takes bill total, tip percentage, and number of diners. Output individual amounts, tip per person, and total per person."},
  {id:864,cat:"Coding",title:"Fake Company Name Generator",desc:"Build a generator that combines random syllables and business-y suffixes to produce plausible-sounding fake tech company names. Generate 10 at a time."},
  {id:865,cat:"Coding",title:"Password Strength Checker",desc:"Write a script that rates any password 1–10 based on length, character variety, and common patterns. Print specific improvement suggestions."},
  {id:866,cat:"Coding",title:"Simple Interest Calculator + Graph",desc:"Build a compound interest calculator that takes principal, rate, and years and prints a year-by-year ASCII bar graph of the growth."},
  {id:867,cat:"Coding",title:"Text-Based 'Higher or Lower' Game",desc:"Build a number guessing game that tells you 'higher' or 'lower' after each guess, counts your attempts, and gives a score at the end."},
  {id:868,cat:"Coding",title:"Personal Journal Word Frequency Counter",desc:"Write a script that reads a journal entry text file and prints the 20 most frequently used meaningful words (excluding stop words)."},
  {id:869,cat:"Coding",title:"Unit Converter CLI",desc:"Build a unit conversion tool for: weight (kg/lb/oz), length (m/ft/in/cm), and volume (L/ml/cups/oz). Accept input in any supported unit."},
  {id:870,cat:"Coding",title:"Sentence Generator from Word Lists",desc:"Write a function that takes lists of adjectives, nouns, and verbs and generates grammatically plausible random sentences. Generate 20 and pick the best."},

  // ─── BIOINFORMATICS (871-880) ───
  {id:871,cat:"Bioinformatics",title:"Amino Acid Frequency Counter",desc:"Write a Python script that reads any protein sequence (paste it in) and prints a sorted bar chart of amino acid frequency. Test it on insulin and collagen."},
  {id:872,cat:"Bioinformatics",title:"Find All ORFs in a DNA Sequence",desc:"Write a script that scans a DNA string for all open reading frames (start to stop codon) in both strands. Print each ORF with its length."},
  {id:873,cat:"Bioinformatics",title:"Reverse Complement Checker",desc:"Write a script that takes any DNA sequence and outputs its reverse complement, then verifies by taking the reverse complement of that and checking it matches the original."},
  {id:874,cat:"Bioinformatics",title:"GC Content Heatmap (Text)",desc:"Take any genome segment. Calculate GC% in non-overlapping 50bp windows and print a text-based heatmap using block characters. Find the richest region."},
  {id:875,cat:"Bioinformatics",title:"DNA-to-Protein Translator",desc:"Build the full central dogma pipeline: DNA → mRNA (transcription) → protein (using codon table, with stop codon handling). Test on a real gene from NCBI."},
  {id:876,cat:"Bioinformatics",title:"Hamming Distance Calculator",desc:"Write a script to compute the Hamming distance between two equal-length sequences. Then find the position of every mismatch and print the alignment visually."},
  {id:877,cat:"Bioinformatics",title:"Codon Usage Table Builder",desc:"Given any DNA sequence, count how many times each codon appears and print the full codon usage table. Compare two genes from the same organism."},
  {id:878,cat:"Bioinformatics",title:"One-Letter to Three-Letter Amino Acid Converter",desc:"Write a bidirectional converter between one-letter and three-letter amino acid codes. Test on 5 real protein sequences from UniProt."},
  {id:879,cat:"Bioinformatics",title:"FASTA Stats Reader",desc:"Write a FASTA file parser that reports: number of sequences, shortest, longest, median length, and total nucleotide count. Test it on a file you download from NCBI."},
  {id:880,cat:"Bioinformatics",title:"Palindromic Sequence Detector",desc:"Write a script that checks whether a DNA sequence is a palindrome (equals its own reverse complement). Find all palindromic subsequences longer than 4bp."},

  // ─── MUSIC (881-895) ───
  {id:881,cat:"Music",title:"16-Bar Pentatonic Melody",desc:"Compose a 16-bar melody using only the pentatonic scale. Write it out on paper or tab. Play it through at least 5 times and refine it."},
  {id:882,cat:"Music",title:"Chord Transcription by Ear",desc:"Pick a song you love. Listen to it section by section and write down every chord change by ear. Compare to a tab site when you're done."},
  {id:883,cat:"Music",title:"Original Song Structure: Three Songs",desc:"Write the complete structure (key, tempo, chord progression, section order) for three original songs you haven't written yet. Keep the chord charts."},
  {id:884,cat:"Music",title:"Body Percussion Groove",desc:"Create a full rhythmic pattern using only clapping, stomping, and body percussion. Notate it using your own symbols. Record a 1-minute performance."},
  {id:885,cat:"Music",title:"Song Parody: Your Daily Life",desc:"Write a full parody version of a well-known song about something from your actual daily routine. All verses and the chorus must be your own words."},
  {id:886,cat:"Music",title:"Invent a Time-Signature Piece",desc:"Compose a short piece in a time signature you've never used: 7/8, 5/4, or 11/8. Write it out. Clap or tap through it until it feels natural."},
  {id:887,cat:"Music",title:"Ear-Training Melody Notation",desc:"Listen to any simple melody on YouTube. Pause and notate it by ear on paper, bar by bar. Transcribe the full thing before checking against sheet music."},
  {id:888,cat:"Music",title:"Album Concept Art & Tracklist",desc:"Design a complete imaginary album: name, 10 tracks with running times, a hand-drawn cover, and a one-paragraph liner note for each song."},
  {id:889,cat:"Music",title:"Playlist That Tells a Story",desc:"Build a playlist where the song order creates a clear narrative arc—beginning, complication, crisis, resolution. Write a sentence about each transition."},
  {id:890,cat:"Music",title:"Theory Analysis of a 2-Minute Song",desc:"Pick any song under 2 minutes. Write a complete analysis: key, mode, chord function (I, IV, V, ii, etc.), structure, and any borrowed chords."},
  {id:891,cat:"Music",title:"Fictional Band Bio",desc:"Create a full fictional band: name, genre, 5-member roster with instruments, a brief history, a signature sound, and a setlist for their comeback show."},
  {id:892,cat:"Music",title:"Soundscape Collage",desc:"Record 10 environmental sounds on your phone in one hour. Arrange them into a 60-second piece with a beginning, middle, and end. No music software required."},
  {id:893,cat:"Music",title:"Jingle in Under Two Minutes",desc:"Write and record a jingle for an imaginary product. Must have a hook, a brand mention, and actual melody. Time yourself: two minutes to write it."},
  {id:894,cat:"Music",title:"Duet Arrangement on Paper",desc:"Take a melody you know and arrange it as a duet: write out both the melody voice and a second harmony part, noting instrument and key."},
  {id:895,cat:"Music",title:"Genre Deep-Dive Review",desc:"Pick a genre you've never explored. Listen to three canonical albums from it. Write a 400-word essay: what defines the genre, what surprised you, what you'd recommend first."},

  // ─── FITNESS (896-910) ───
  {id:896,cat:"Fitness",title:"Mobility Flow from Scratch",desc:"Design a 10-move morning mobility sequence and perform it twice through. Write down every movement, duration, and how it felt. Refine it until you'd actually do it daily."},
  {id:897,cat:"Fitness",title:"Bodyweight Circuit: 8 Exercises, 3 Rounds",desc:"Design and complete a full bodyweight circuit—8 exercises, 3 rounds, 45 seconds on / 15 seconds off. Log your reps for each exercise each round."},
  {id:898,cat:"Fitness",title:"1-Mile Time Trial",desc:"Run a mile as fast as you can and record your time. Log your pace per quarter mile, your perceived effort, and what you'd change next time."},
  {id:899,cat:"Fitness",title:"100-Rep Challenge",desc:"Pick one bodyweight exercise. Complete 100 reps however you need to—break it into sets. Log every set. Don't stop until you hit 100."},
  {id:900,cat:"Fitness",title:"30-Minute Jump Rope Session",desc:"Jump rope for 30 minutes. Count your skips per minute at 5-minute intervals. Log any stumbles. By the end, you should be better than when you started."},
  {id:901,cat:"Fitness",title:"7-Day Beginner Split (Design + Day 1)",desc:"Design a complete 7-day workout split for a beginner. Write out every session. Then do Day 1 right now."},
  {id:902,cat:"Fitness",title:"Handstand Practice Session",desc:"Spend 30 minutes practicing handstands against a wall. Track how long you can hold each attempt. Write a technique note after each fall."},
  {id:903,cat:"Fitness",title:"Chair & Wall Workout",desc:"Design and complete a workout using only a chair and a wall. No equipment. Minimum 8 exercises. Work up a sweat."},
  {id:904,cat:"Fitness",title:"Beginner Yoga Flow",desc:"Lead yourself through a 30-minute yoga flow using only poses you already know. No phone, no video—go from memory. Write what you forgot afterward."},
  {id:905,cat:"Fitness",title:"Staircase Rep Ladder",desc:"Pick one exercise. Do 1 rep, rest 10 seconds. Do 2, rest 20. Keep adding a rep until you can't complete the set. Then descend. Log every round."},
  {id:906,cat:"Fitness",title:"Balance Routine: 10 Moves",desc:"Design a balance-focused routine with 10 movements on one or both feet. Master each one before moving to the next. Log your hold times."},
  {id:907,cat:"Fitness",title:"Sport-Specific Warm-Up Design",desc:"Design a complete warm-up routine for a sport you play or love. Must include dynamic stretches, activation moves, and sport-specific drills. Try it once."},
  {id:908,cat:"Fitness",title:"Desk Worker Stretch Routine",desc:"Design a stretching routine specifically for someone who sits at a desk all day. Target hips, chest, neck, and wrists. Write it up as a shareable guide."},
  {id:909,cat:"Fitness",title:"20-Minute HIIT You Designed",desc:"Design and complete a 20-minute HIIT session: you pick the exercises, work/rest ratios, and format. Log everything. Rate it honestly out of 10."},
  {id:910,cat:"Fitness",title:"Beginner 8-Week Running Plan",desc:"Write a complete 8-week couch-to-5K-style running plan. Every session, every week, with rest days. Include pacing notes and a week-8 goal race."},

  // ─── COOKING (911-925) ───
  {id:911,cat:"Cooking",title:"Fresh Pasta from Scratch",desc:"Make egg pasta from flour and eggs only. Roll it by hand, cut it into fettuccine, and cook it. Dress it in brown butter and sage. Taste what you made."},
  {id:912,cat:"Cooking",title:"Soda Bread in One Hour",desc:"Bake a classic Irish soda bread—flour, baking soda, buttermilk, salt—start to finish in under an hour. No yeast. No waiting."},
  {id:913,cat:"Cooking",title:"Your Own Spice Blend",desc:"Mix a spice blend from scratch using at least 5 spices you already own. Name it. Write down the exact ratios. Use it on something today."},
  {id:914,cat:"Cooking",title:"Three Courses, Five Ingredients",desc:"Cook a full three-course meal using exactly five ingredients total. Plan the menu first. Make it work."},
  {id:915,cat:"Cooking",title:"Quick Refrigerator Pickles",desc:"Pickle something in 30 minutes using vinegar, salt, sugar, and whatever vegetables you have. Let them sit while you eat, then taste the result."},
  {id:916,cat:"Cooking",title:"Homemade Butter in a Jar",desc:"Pour heavy cream into a jar. Shake it for 15–20 minutes until you get butter. Salt it, shape it, eat it on bread you also made (or didn't)."},
  {id:917,cat:"Cooking",title:"A Dish from Childhood, From Memory",desc:"Cook a dish you ate as a child, entirely from memory. No recipe. Write down what you remembered correctly and what you'd do differently."},
  {id:918,cat:"Cooking",title:"Smoothie Bowl as Artwork",desc:"Make a smoothie bowl and design the toppings as a deliberate composition—color, pattern, texture. Photograph it before eating."},
  {id:919,cat:"Cooking",title:"Shakshuka from Pantry Staples",desc:"Make shakshuka using only what you have: canned tomatoes, eggs, onion, spices. No cheating with a recipe—use your instincts. Taste and adjust."},
  {id:920,cat:"Cooking",title:"Cuisine You've Never Cooked",desc:"Pick a national cuisine you've never cooked. Look up one traditional dish. Make it with what you can find or substitute. Write about the experience."},
  {id:921,cat:"Cooking",title:"Soup from the Fridge",desc:"Make a soup from only ingredients already in your fridge or pantry—no shopping allowed. Season it properly. Make it genuinely delicious."},
  {id:922,cat:"Cooking",title:"Geometric Cookie Decoration",desc:"Bake a batch of simple shortbread or sugar cookies. Decorate each one with a different geometric pattern in icing. Make them look intentional."},
  {id:923,cat:"Cooking",title:"Mocktail Menu: Three Original Drinks",desc:"Invent three original mocktail recipes. Give each one a name, a written recipe, and a suggested glass. Make at least one and taste it."},
  {id:924,cat:"Cooking",title:"Homemade Granola",desc:"Make a batch of granola from scratch. Customize the oats, sweetener, fat, and at least three mix-ins. Bake it until golden and let it cool before tasting."},
  {id:925,cat:"Cooking",title:"One-Pan Roasted Vegetable Dish",desc:"Roast six or more vegetables together in one pan. Season them thoughtfully, vary the cuts, and serve them with a sauce you make from scratch."},

  // ─── PHOTOGRAPHY (926-940) ───
  {id:926,cat:"Photography",title:"10-Photo Story",desc:"Tell a complete story in exactly 10 photographs—no more, no fewer. Plan the shots first. Every image must be necessary."},
  {id:927,cat:"Photography",title:"Golden Hour Shoot",desc:"Set up outside 30 minutes before sunset or after sunrise. Shoot for the full 30-minute window. Edit your 5 best shots before uploading anything."},
  {id:928,cat:"Photography",title:"Texture Library",desc:"Photograph 15 different textures in your immediate environment. Arrange them in a grid. Every one should be visually distinct."},
  {id:929,cat:"Photography",title:"Found Typography Series",desc:"Photograph letters and numbers occurring naturally in the environment—signs, cracks, shadows, plants. Spell out your name or a word."},
  {id:930,cat:"Photography",title:"30 Shots in 30 Minutes",desc:"Walk outside. Take exactly 30 photographs in 30 minutes. No deleting. Review them all afterward and write one sentence about the best three."},
  {id:931,cat:"Photography",title:"Product Photography: Ordinary Object",desc:"Pick something boring from your home—a mug, a spoon, a stapler—and shoot it as if it were a luxury product. Use available light only."},
  {id:932,cat:"Photography",title:"Reflective Surface Portraits",desc:"Shoot a self-portrait series using only reflective surfaces: windows, water, mirrors, metal. Each image must use a different surface."},
  {id:933,cat:"Photography",title:"Color Study",desc:"Choose one specific color. Photograph 20 objects of exactly that color in one hour. Vary the composition, depth, and angle every shot."},
  {id:934,cat:"Photography",title:"Then and Now Diptych",desc:"Find an old photograph taken in a specific location. Return to that spot today. Recreate the shot as closely as possible. Present them as a pair."},
  {id:935,cat:"Photography",title:"Architecture Details Series",desc:"Choose one building. Photograph only its details—door handles, window frames, textures, shadows, signage. Create a 10-image series."},
  {id:936,cat:"Photography",title:"Meal Lifecycle",desc:"Document the complete lifecycle of a meal: raw ingredients, preparation stages, plated dish, and the aftermath. 8 images minimum."},
  {id:937,cat:"Photography",title:"Shadow Study",desc:"Spend one hour photographing shadows. Vary the light source, subject, and surface. Find at least one shadow that looks like something else entirely."},
  {id:938,cat:"Photography",title:"Flat Lay Composition",desc:"Create and shoot a flat lay using 10 or more objects arranged thoughtfully. Use the rule of thirds. Shoot from directly above. Edit it before you're done."},
  {id:939,cat:"Photography",title:"Night Photography: Available Light Only",desc:"Go outside after dark. Shoot 5 images using no artificial lighting you control—only ambient light from streets, windows, and signs."},
  {id:940,cat:"Photography",title:"Photo Essay: Morning",desc:"Create an 8-image photo essay about morning. No people. Every image should feel like quiet, early light, and possibility."},

  // ─── SCIENCE & LEARNING (941-955) ───
  {id:941,cat:"Science & Learning",title:"Crystal Growing",desc:"Make a supersaturated salt or sugar solution and let crystals grow on a string or stick overnight. Photograph the result every 2 hours if you can."},
  {id:942,cat:"Science & Learning",title:"Strawberry DNA Extraction",desc:"Extract real DNA from a strawberry using dish soap, salt, and rubbing alcohol—things you already have. See the stringy DNA strands with your own eyes."},
  {id:943,cat:"Science & Learning",title:"Catapult from Popsicle Sticks",desc:"Build a working catapult from popsicle sticks and rubber bands. Test it with paper balls. Measure range and refine the design three times."},
  {id:944,cat:"Science & Learning",title:"Visual Pythagorean Proof",desc:"Draw and annotate a complete visual proof of the Pythagorean theorem that requires no algebra—just geometry and labeling. Make it beautiful."},
  {id:945,cat:"Science & Learning",title:"Homemade Barometer",desc:"Build a simple barometer from a jar, a balloon stretched over the top, and a straw as a pointer. Calibrate it against weather forecasts for three days."},
  {id:946,cat:"Science & Learning",title:"Surface Tension Experiments",desc:"Test surface tension with paperclips on water. Then add soap drop by drop and watch what happens. Write a one-paragraph explanation of why."},
  {id:947,cat:"Science & Learning",title:"How Rainbows Form: Full Explanation",desc:"Write and diagram a complete explanation of how rainbows form—light, water, refraction, reflection, and why the colors are in the order they are."},
  {id:948,cat:"Science & Learning",title:"Build a Homopolar Motor",desc:"Build a homopolar motor using a AA battery, a neodymium magnet, and a short piece of copper wire. Make it spin. Then explain why it works in writing."},
  {id:949,cat:"Science & Learning",title:"Height from Similar Triangles",desc:"Calculate the height of a building, tree, or tall object near you using only a ruler and the principles of similar triangles. Show your full working."},
  {id:950,cat:"Science & Learning",title:"Science FAQ for Something Confusing",desc:"Pick one scientific concept you find confusing. Write a FAQ page for it—at least 8 questions, answered in plain English with analogies."},
  {id:951,cat:"Science & Learning",title:"Paper 3D Geometric Solid",desc:"Construct a paper model of a dodecahedron or icosahedron from a printed net. Fold and glue every tab. Write the name and properties on it when done."},
  {id:952,cat:"Science & Learning",title:"Water Clock",desc:"Build a working clepsydra from two plastic bottles. Calibrate it against a real clock. Measure how far off it is after 10 minutes and why."},
  {id:953,cat:"Science & Learning",title:"Write a Scientific Paper Abstract (for Fun)",desc:"Write a rigorous mock scientific abstract for an experiment you could theoretically run on something you care about. Include method, results, and conclusion."},
  {id:954,cat:"Science & Learning",title:"Electroscope from Foil and a Jar",desc:"Build a simple electroscope from a glass jar, metal wire, and two strips of aluminum foil. Test it with a charged balloon and document the results."},
  {id:955,cat:"Science & Learning",title:"Scale Solar System on Paper",desc:"Draw the solar system to scale on a strip of paper. You'll find out very quickly that space is mostly nothing. Label every planet's actual distance from the Sun."},

  // ─── MINDFULNESS (956-965) ───
  {id:956,cat:"Mindfulness",title:"Mindful Drawing Session",desc:"Sit somewhere quiet. Draw what you can see without lifting your pen and without looking at the paper. Do this for 20 minutes. Frame the result."},
  {id:957,cat:"Mindfulness",title:"Loving-Kindness Meditation",desc:"Practice a 20-minute loving-kindness meditation. Extend compassion to yourself, someone you love, a stranger, and someone difficult. Journal afterward."},
  {id:958,cat:"Mindfulness",title:"Two-Hour Digital Detox",desc:"Put every screen away for exactly two hours. Do something physical or creative. Write honestly about what arose: restlessness, boredom, relief, ideas."},
  {id:959,cat:"Mindfulness",title:"Seven Days of Gratitude",desc:"Write 5 things you're genuinely grateful for each day for 7 days. Start today. Make them specific—no generic answers. Review them on day 7."},
  {id:960,cat:"Mindfulness",title:"Walking Meditation",desc:"Walk for 20 minutes paying attention only to physical sensations: foot contact, breath, air, temperature. When the mind wanders, gently return. Write what you noticed."},
  {id:961,cat:"Mindfulness",title:"Personal Anchor Ritual",desc:"Design a 3-step ritual you can do in under 2 minutes when you're anxious or overwhelmed. Write it on a card. Practice it once right now."},
  {id:962,cat:"Mindfulness",title:"Resentment Letter (Then Let Go)",desc:"Write a full, honest letter about a resentment you're holding. Then ceremonially destroy it—burn it, shred it, or delete it. Write about how that felt."},
  {id:963,cat:"Mindfulness",title:"30 Minutes of Watching Your Thoughts",desc:"Sit still for 30 minutes. Write down every thought that arises—just the subject, not the full thought. At the end, look at the list and find the patterns."},
  {id:964,cat:"Mindfulness",title:"Design Your Minimum Viable Day",desc:"Write a description of the simplest, most essential version of a good day for you. Strip it to the bare minimum that would feel like enough."},
  {id:965,cat:"Mindfulness",title:"What Do I Actually Want?",desc:"Set a 20-minute timer and journal continuously on the single question: 'What do I actually want?' Don't stop writing. Don't edit. Read it back once."},

  // ─── LANGUAGE (966-975) ───
  {id:966,cat:"Language",title:"200-Word Story in Your Target Language",desc:"Write a 200-word story in a language you're learning. Use only what you know. It will be imperfect. That's the point. Read it aloud when finished."},
  {id:967,cat:"Language",title:"30-Day Language Learning Plan",desc:"Map out the first 30 days of learning a language you want to start: resources, daily hours, goals per week. Write day 1's actual session."},
  {id:968,cat:"Language",title:"Children's Book in a Target Language",desc:"Write and illustrate (with simple drawings) a 8-page children's story in your target language. Keep the vocabulary achievable. Read it aloud."},
  {id:969,cat:"Language",title:"Transcribe and Translate a 2-Minute Clip",desc:"Find a 2-minute clip of native speech in your target language. Pause and transcribe it sentence by sentence. Then translate it. Note every gap."},
  {id:970,cat:"Language",title:"15 Idioms in Context",desc:"Learn 15 idioms in your target language. Write a context sentence using each one. Read them all aloud. Try using 3 of them in a real conversation this week."},
  {id:971,cat:"Language",title:"Top-100 Word Self-Quiz",desc:"Find the 100 most common words in your target language. Test yourself on all 100. Circle every miss. Study those only, then test again."},
  {id:972,cat:"Language",title:"Letter to a Pen Pal",desc:"Write a full letter to an imaginary pen pal in your target language. Introduce yourself, ask questions, describe your week. At least 200 words."},
  {id:973,cat:"Language",title:"Pronunciation Guide for Tricky Sounds",desc:"Identify the 8 sounds in your target language that are hardest for you. Write a guide explaining mouth position for each. Record yourself practicing."},
  {id:974,cat:"Language",title:"Translate a Song You Love",desc:"Take a song you know well and translate it into your target language, keeping the meaning as close as possible. Read it aloud to the original instrumental."},
  {id:975,cat:"Language",title:"Grammar Cheat Sheet",desc:"Write a one-page grammar cheat sheet for the 5 trickiest rules in your target language. Use examples you create yourself. Design it to actually be useful."},

  // ─── GAME DESIGN (976-985) ───
  {id:976,cat:"Game Design",title:"New Rules for a Standard Deck",desc:"Invent a card game played with a standard 52-card deck and your own rules only. Write the complete rulebook and play a test round by yourself."},
  {id:977,cat:"Game Design",title:"Party Game for 4–20 Players",desc:"Design a party game that works with 4 people or 20. Write the full rules, any materials needed, and a 'how to play' summary in under 100 words."},
  {id:978,cat:"Game Design",title:"One-Page Tabletop RPG",desc:"Create a complete one-page tabletop RPG: setting, character creation, resolution mechanic, and a starter adventure. Playable with two people in an hour."},
  {id:979,cat:"Game Design",title:"Text-Message Word Game",desc:"Design a word game that works entirely over text message. Write the rules. Test it with a willing friend or family member right now."},
  {id:980,cat:"Game Design",title:"Solo Pen-and-Paper Puzzle",desc:"Design a logic puzzle playable with only a pen and paper. Write the instructions and create three instances of the puzzle at increasing difficulty."},
  {id:981,cat:"Game Design",title:"Game Where the Objective Changes",desc:"Design a game where the win condition changes secretly each round. Write full rules. Include a method for tracking the shifting objective."},
  {id:982,cat:"Game Design",title:"Trivia Game About Your Own Life",desc:"Create a trivia game about your own life for friends and family to play. Write 30 questions at three difficulty levels. Prepare an answer key."},
  {id:983,cat:"Game Design",title:"Scavenger Hunt for Your Neighborhood",desc:"Design a scavenger hunt with 15 clues for your neighborhood. Write every clue. Each must lead logically to the next. Include a prize at the end."},
  {id:984,cat:"Game Design",title:"Game Design Document (5-Minute Game)",desc:"Write a full GDD for a game that takes exactly 5 minutes to play: mechanics, win conditions, aesthetics, target audience, and one screenshot sketch."},
  {id:985,cat:"Game Design",title:"Household Object Sport",desc:"Invent a sport or physical game that can be played entirely using household objects. Write the rules, field dimensions, and scoring system."},

  // ─── CRAFT & MAKING (986-1000) ───
  {id:986,cat:"Craft & Making",title:"Hand-Sewn Journal",desc:"Make a journal with a hand-sewn Coptic binding. Cut the pages, fold the signatures, punch the holes, and sew it together. Write the first entry before you put it down."},
  {id:987,cat:"Craft & Making",title:"Vegetable Stamp Wrapping Paper",desc:"Cut shapes from potatoes, carrots, or bell peppers and use them as stamps. Create a full sheet of original patterned wrapping paper."},
  {id:988,cat:"Craft & Making",title:"Simple Homemade Soap",desc:"Make a small batch of melt-and-pour soap. Add color, scent, and a design pressed into the top. Let it set and test it before the hour is up."},
  {id:989,cat:"Craft & Making",title:"Magazine Collage",desc:"Cut images and text from magazines and create a deliberate collage around a single theme or feeling. Glue it, frame it (or don't), and title it."},
  {id:990,cat:"Craft & Making",title:"Polymer Clay Mini Sculpture",desc:"Build a small figure or object from polymer clay. Give it a name and a backstory. Bake it according to the package. Photograph the finished piece."},
  {id:991,cat:"Craft & Making",title:"Macramé Wall Hanging",desc:"Make a simple macramé wall hanging using square knots on a dowel. Trim the fringe into a shape. Hang it before you decide it's done."},
  {id:992,cat:"Craft & Making",title:"Tissue Paper Stained Glass",desc:"Create a stained glass effect on a window or glass frame using torn tissue paper and PVA glue. Let it dry in the light."},
  {id:993,cat:"Craft & Making",title:"Homemade Paper",desc:"Make paper from newspaper pulp, a screen, and water. Press it flat, let it dry, and write something on it with the pen you used to plan this project."},
  {id:994,cat:"Craft & Making",title:"Cork & Foil Wax Seal Stamp",desc:"Carve a design into the flat end of a wine cork. Press it into melted wax (or a wax seal) and test the impression. Use it on an envelope today."},
  {id:995,cat:"Craft & Making",title:"Decoupage Bowl",desc:"Blow up a balloon. Layer torn newspaper strips with PVA glue over the bottom half. Let it dry completely, pop the balloon, and paint the result."},
  {id:996,cat:"Craft & Making",title:"Bead and Wire Pendant",desc:"Wire-wrap a bead or stone into a simple pendant using craft wire. Attach it to a chain or cord. Wear it today."},
  {id:997,cat:"Craft & Making",title:"Pressed Flower Card",desc:"Collect flowers or leaves. Press them between heavy books for 30 minutes. Arrange them on card stock and seal with a laminating sheet or PVA. Give it to someone."},
  {id:998,cat:"Craft & Making",title:"Knit or Crochet a Square",desc:"Knit or crochet a 10x10cm square using basic stitches. Cast on, work the rows, cast off. Name the color and write what you'd do with 50 of them."},
  {id:999,cat:"Craft & Making",title:"Cardboard Puppet Theater",desc:"Build a small puppet theater from a cardboard box. Cut a stage opening, decorate the frame, and make two simple sock puppets. Put on a 2-minute show."},
  {id:1000,cat:"Craft & Making",title:"Terrarium in a Jar",desc:"Layer gravel, activated charcoal, and soil in a glass jar. Plant something small inside. Seal it if you want a closed system. Name it."},

  // ─── SOCIAL & COMMUNITY (1001-1010) ───
  {id:1001,cat:"Social & Community",title:"Handwritten Letter to a Distant Friend",desc:"Write and post a real handwritten letter to someone you haven't spoken to in over a year. No text, no email—stamp and everything."},
  {id:1002,cat:"Social & Community",title:"Game Night Plan + Invites",desc:"Choose 3 games, write the invites (real or digital), design the snack menu, and send the invites before this hour is up. Set the date."},
  {id:1003,cat:"Social & Community",title:"Skill Swap with a Friend",desc:"Identify one skill you have that a friend doesn't. Schedule a session where you each teach the other something for 30 minutes. Do the scheduling now."},
  {id:1004,cat:"Social & Community",title:"Appreciation Cards: Five People",desc:"Write a genuine appreciation card for five people in your life—not on birthdays, not for anything they did, just because. Hand-deliver or mail at least one today."},
  {id:1005,cat:"Social & Community",title:"Welcome Guide for a New Neighbor",desc:"Write a practical, warm welcome guide for someone new to your street or building: best local spots, unwritten rules, and your contact info."},
  {id:1006,cat:"Social & Community",title:"Potluck with Assigned Constraints",desc:"Plan a potluck dinner. Assign each guest a specific dish and one dietary or flavor constraint they must honor. Write and send all the assignments."},
  {id:1007,cat:"Social & Community",title:"Show and Tell Call",desc:"Organize a 30-minute video call where each participant has 5 minutes to show one thing they've made recently. Schedule it and send the calendar invite now."},
  {id:1008,cat:"Social & Community",title:"Group Scrapbook Page",desc:"Create one scrapbook page documenting a shared memory with a group of friends. Include photos, drawings, captions, and handwritten notes from each person if possible."},
  {id:1009,cat:"Social & Community",title:"5-Minute Household Presentation",desc:"Prepare and deliver a 5-minute presentation to your household or a friend about something you care about and they probably don't know enough about. Take questions."},
  {id:1010,cat:"Social & Community",title:"Random Acts of Kindness Day",desc:"Plan five specific acts of kindness you'll do today. Not vague—specific actions for specific people. Do all five before midnight. Write what happened."},

  // ─── PRODUCTIVITY (1011-1020) ───
  {id:1011,cat:"Productivity",title:"Full Someday/Maybe Review",desc:"Go through every unfinished project you have. Write them all down. For each one: do it, schedule it, delegate it, or delete it. Don't stop until every item is resolved."},
  {id:1012,cat:"Productivity",title:"Energy Audit",desc:"Map your energy levels across a typical week, hour by hour. Identify your peak focus hours. Redesign your schedule to put your hardest work in those slots."},
  {id:1013,cat:"Productivity",title:"Inbox Zero: One Channel",desc:"Pick one inbox—email, texts, or notes app—and reach zero. Archive, reply, delete, or action everything. Write the rules you'll use to keep it there."},
  {id:1014,cat:"Productivity",title:"Personal OKRs for This Quarter",desc:"Write 3 objectives and 3 key results for each for the next 90 days. Make the key results specific and measurable. Schedule a review date."},
  {id:1015,cat:"Productivity",title:"Stop-Doing List",desc:"Write a list of things you commit to stop doing in the next month. Be specific. Include time-wasters, draining obligations, and habits. Keep the list somewhere visible."},
  {id:1016,cat:"Productivity",title:"Shutdown Ritual Design",desc:"Design a work-day shutdown ritual in 5 steps or fewer. Practice it right now. Include a clear signal that work is done for the day."},
  {id:1017,cat:"Productivity",title:"Top 3 Time Wasters: Countermeasures",desc:"Identify the 3 things that most reliably waste your time. For each, design one specific countermeasure. Implement at least one today."},
  {id:1018,cat:"Productivity",title:"Done List for the Past Month",desc:"Write everything you accomplished in the past 30 days—big and tiny. Include everything. Read it back and notice how much more you did than you thought."},
  {id:1019,cat:"Productivity",title:"Personal Metrics Dashboard",desc:"On paper, design the dashboard you'd use if you tracked your life systematically. What 5 metrics would matter most? How would you visualize them?"},
  {id:1020,cat:"Productivity",title:"Habit Trigger-Routine-Reward Map",desc:"Pick one habit you want to build. Map out the cue, the routine, and the reward. Make the reward immediate and the routine specific. Do the habit once right now."},

  // ─── TRAVEL & EXPLORATION (1021-1030) ───
  {id:1021,cat:"Travel & Exploration",title:"Neighborhood Map from Memory",desc:"Draw a detailed map of your neighborhood entirely from memory. Then go outside and walk it with your map. Annotate every mistake and discovery."},
  {id:1022,cat:"Travel & Exploration",title:"Completely New Street",desc:"Walk down a street in your town you've never set foot on. Spend 30 minutes there. Write a portrait of it: the buildings, sounds, smells, people, and feeling."},
  {id:1023,cat:"Travel & Exploration",title:"Hyper-Niche City Guide",desc:"Write a travel guide for your city aimed at a very specific visitor: a 60-year-old amateur mycologist, a competitive sandwich judge, a first-time cat owner. Be useful."},
  {id:1024,cat:"Travel & Exploration",title:"30-Minute Walk Photo Essay",desc:"Take a 30-minute walk and photograph it. Write a 200-word essay using exactly 8 of those photos. The essay should have a point."},
  {id:1025,cat:"Travel & Exploration",title:"Hidden Gems Research Project",desc:"Research and write up 5 genuinely overlooked places within 30 miles of you. Not Yelp-famous—actually hidden. Include directions and best time to visit."},
  {id:1026,cat:"Travel & Exploration",title:"Ordinary Place, Extraordinary Attention",desc:"Go somewhere utterly mundane near you—a car park, a bus stop, a corner shop—and write about it as if you're a travel writer who finds it fascinating. Make it fascinating."},
  {id:1027,cat:"Travel & Exploration",title:"Museum or Gallery Visit: One Deep Look",desc:"Go to a gallery or museum. Spend your full time in front of a single work. Then write 300 words about it: what you see, what you feel, what you want to know."},
  {id:1028,cat:"Travel & Exploration",title:"3-Day Dream Trip Itinerary",desc:"Design a detailed 3-day itinerary for a city you've always wanted to visit. Research opening times, book nothing, but plan everything. Include meals and transit."},
  {id:1029,cat:"Travel & Exploration",title:"Themed Neighborhood Walk",desc:"Walk your neighborhood looking for one specific thing: a color, a material, a shape, a letter. Photograph every example you find. Create a mini exhibition."},
  {id:1030,cat:"Travel & Exploration",title:"Postcard from Right Here",desc:"Write a postcard (real or imaginary) from exactly where you are right now, to someone who's never been there. Sell it. Make them want to visit."},

  // ─── PERSONAL DEVELOPMENT (1031-1040) ───
  {id:1031,cat:"Personal Development",title:"Skills Inventory",desc:"List every skill you have, from trivial to impressive. Include things you've never put on a CV. Sort them into four quadrants: love/hate × good at/not good at."},
  {id:1032,cat:"Personal Development",title:"Fear Audit",desc:"List everything you've avoided in the past year. For each item, write one sentence about why. Then circle the three that are costing you the most."},
  {id:1033,cat:"Personal Development",title:"Eulogy Values Exercise",desc:"Write the eulogy you'd want spoken at your funeral. What would you want said about who you were and how you lived? Then extract your actual values from it."},
  {id:1034,cat:"Personal Development",title:"Circles of Control",desc:"Draw three concentric circles: what you control, what you influence, and what you must accept. Fill them in honestly. Put something in 'accept' that you've been fighting."},
  {id:1035,cat:"Personal Development",title:"Personal Not-To-Do List",desc:"Write a list of behaviors you formally commit to stopping. Specific actions, not vague intentions. Sign it. Put a date on it. Keep it where you can see it."},
  {id:1036,cat:"Personal Development",title:"Monthly Review Template",desc:"Design a monthly review template you'll actually use. Include what went well, what didn't, what you're carrying into next month, and one number to track. Complete one for last month."},
  {id:1037,cat:"Personal Development",title:"Letter of Permission",desc:"Write a letter to yourself giving yourself explicit permission to do something you've been waiting for. Be specific about what you're allowing and why you deserve it."},
  {id:1038,cat:"Personal Development",title:"Personal Decision-Making Framework",desc:"Write a framework for making decisions. Include the criteria you use, how you weight them, and the process you follow. Apply it to one real pending decision."},
  {id:1039,cat:"Personal Development",title:"Bad Day Recovery Plan",desc:"Design a specific plan for your most common type of bad day. What are the early warning signs? What are the interventions? What does recovery look like?"},
  {id:1040,cat:"Personal Development",title:"Five-Year Vision in Concrete Terms",desc:"Write your five-year vision in as much specific, concrete detail as you can. Where do you live? What are you working on? Who are you with? What do mornings feel like?"},

  // ─── CREATIVE (1041-1050) ───
  {id:1041,cat:"Creative",title:"Fictional Country: Full Build",desc:"Design a fictional country from scratch: name, flag (draw it), map, capital city, population, government type, one famous dish, and three things it's known for."},
  {id:1042,cat:"Creative",title:"Elaborate Alter Ego",desc:"Create a fully realized alter ego with a name, backstory, signature look, defining personality traits, and three things they'd do that you never would."},
  {id:1043,cat:"Creative",title:"2-Minute Stand-Up Set",desc:"Write and perform a 2-minute stand-up comedy set. Record yourself doing it. It must have a setup, a punchline, and at least two callbacks."},
  {id:1044,cat:"Creative",title:"Fictional Museum Exhibit",desc:"Design a museum exhibit around a theme you care about. Name the exhibit, describe 5 artifacts with their labels, and write the wall text for the entrance."},
  {id:1045,cat:"Creative",title:"World-Building Bible",desc:"Write the foundational document for a fictional universe: the physical rules of the world, its history in 200 words, three factions, and one unresolved mystery."},
  {id:1046,cat:"Creative",title:"Fictional Holiday",desc:"Invent a holiday: name it, write its origin myth, list its three main traditions, name its special food, and describe how people feel about it 100 years after it was created."},
  {id:1047,cat:"Creative",title:"12-Page Hand-Illustrated Children's Book",desc:"Write and illustrate a complete 12-page children's book by hand. Give it a title page, an ending, and at least one plot twist. Read it aloud when done."},
  {id:1048,cat:"Creative",title:"Sci-Fi Short Story: One Room",desc:"Write a science fiction short story set entirely in a single room. No leaving. The world-building has to happen through what's inside."},
  {id:1049,cat:"Creative",title:"Fictional Band Discography",desc:"Create a complete discography for a fictional band: 5 albums over 15 years, each with a title, cover art description, tracklist, and one-line critical reception."},
  {id:1050,cat:"Creative",title:"Mythology for a Natural Phenomenon",desc:"Write a mythology—gods, conflict, sacrifice, lesson—that explains a natural phenomenon of your choosing. Make it feel ancient and inevitable."},

  // ─── DIY & WOODWORKING (1051-1080) ───
  {id:1051,cat:"DIY & Woodworking",title:"Restore a Cutting Board",desc:"Sand a wooden cutting board back through 80, 120, and 220 grit. Apply food-safe oil, let it soak in, wipe it off. It should look almost new."},
  {id:1052,cat:"DIY & Woodworking",title:"Phone Stand from Scrap Wood",desc:"Cut two pieces of scrap wood, sand them, and glue them into a wedge-shaped phone stand. Let it dry. It should hold your phone at a useful angle."},
  {id:1053,cat:"DIY & Woodworking",title:"Wall-Mounted Key Rack",desc:"Find a plank, sand it smooth, drill pilot holes, and screw in 4 cup hooks. Mount it by the door. Use it before the end of the day."},
  {id:1054,cat:"DIY & Woodworking",title:"Basic Birdhouse",desc:"Build a simple birdhouse from plywood using a jigsaw or hand saw. Drill an entry hole, assemble with wood glue and nails, and paint it with exterior paint."},
  {id:1055,cat:"DIY & Woodworking",title:"Wood Burned Serving Board",desc:"Sand a pine serving board smooth. Design a simple pattern—initials, a geometric border, a plant—and burn it with a wood-burning pen. Apply food-safe finish."},
  {id:1056,cat:"DIY & Woodworking",title:"Simple Wooden Step Stool",desc:"Cut two side pieces and a top from 2x6 lumber. Sand everything. Assemble with wood glue and screws. It should hold your weight without wobbling."},
  {id:1057,cat:"DIY & Woodworking",title:"Wooden Coasters: Set of Four",desc:"Cut four circles or squares from a 2x4. Sand to 220 grit. Add a simple burned, painted, or stained design on each. Apply a matte finish coat."},
  {id:1058,cat:"DIY & Woodworking",title:"Hand-Carved Butter Knife",desc:"Take a piece of soft basswood. Use a whittling knife to shape a butter knife—blade and handle. Sand it smooth. Apply mineral oil. Use it at breakfast."},
  {id:1059,cat:"DIY & Woodworking",title:"Wooden Desk Tray",desc:"Cut a rectangle of pine into a shallow tray: base plus four low sides. Glue and clamp the joints. Sand the whole thing and apply a wax finish."},
  {id:1060,cat:"DIY & Woodworking",title:"Hand-Painted Wood Slice Decoration",desc:"Find a wood slice or cross-section. Sand it lightly. Paint a landscape, geometric design, or quote on it. Seal it. Attach a hanging loop."},
  {id:1061,cat:"DIY & Woodworking",title:"Balsa Wood Drawer Organizer",desc:"Measure a drawer. Cut balsa wood strips to fit. Assemble a grid insert with wood glue. No nails needed. Test fit and adjust before the glue sets."},
  {id:1062,cat:"DIY & Woodworking",title:"Rope Shelf",desc:"Cut a plank, drill two holes at each end, thread thick rope through, and knot it below. Hang it from two ceiling hooks. Level it before putting anything on it."},
  {id:1063,cat:"DIY & Woodworking",title:"Cedar Planter Box",desc:"Cut four fence boards into two lengths. Assemble a simple box with wood glue and deck screws. Add a base with drainage holes. Plant something immediately."},
  {id:1064,cat:"DIY & Woodworking",title:"Wooden Magnetic Knife Strip",desc:"Drill recesses into a hardwood plank, embed rare-earth magnets with epoxy, and sand the surface flush. Mount it on the kitchen wall and test the hold strength."},
  {id:1065,cat:"DIY & Woodworking",title:"Simple Toolbox",desc:"Build a rectangular toolbox from half-inch plywood with a center dowel handle. Cut, sand, assemble with glue and brads. Paint or stain it before filling."},
  {id:1066,cat:"DIY & Woodworking",title:"Laptop Stand from One Sheet of Plywood",desc:"Design and cut a laptop stand from a single piece of plywood using only two cuts and a dado or slot joint. Sand and oil. Test it for wobble."},
  {id:1067,cat:"DIY & Woodworking",title:"Wooden Spice Rack",desc:"Cut a thin plank with a front lip to stop jars rolling off. Add two side pieces and mount it inside a cabinet door on small hinges."},
  {id:1068,cat:"DIY & Woodworking",title:"Raised Plant Stand",desc:"Cut four legs and a square top from 2x4 lumber. Assemble with pocket screws or mortise joints. Sand smooth. The plant on top should not wobble."},
  {id:1069,cat:"DIY & Woodworking",title:"Hand-Carved Wooden Spoon",desc:"Start with a spoon blank or a soft-wood offcut. Carve the bowl with a gouge and the handle with a whittling knife. Sand progressively and oil at the end."},
  {id:1070,cat:"DIY & Woodworking",title:"Window Box Planter",desc:"Cut cedar boards into sides, ends, and a base with drainage holes. Assemble with waterproof glue and exterior screws. Mount it under a window and plant it."},
  {id:1071,cat:"DIY & Woodworking",title:"Fold-Down Wall Desk",desc:"Mount a plank on a piano hinge to the wall. Add a support chain or leg that folds flat. The desk should fold up and lock away in under 5 seconds."},
  {id:1072,cat:"DIY & Woodworking",title:"Wooden Magazine Rack",desc:"Build a slanted magazine rack from two side panels, a back, and two dowel rails. Sand it, stain it, and fill it before you call it done."},
  {id:1073,cat:"DIY & Woodworking",title:"Simple Wooden Sawhorse",desc:"Build one sawhorse from 2x4 lumber following a basic pattern. It must hold your full weight. Build two if you finish early."},
  {id:1074,cat:"DIY & Woodworking",title:"Perpetual Calendar Blocks",desc:"Cut wooden blocks and paint or burn numbers and month names on the faces. Arrange them in a small tray or rack so any date can be displayed."},
  {id:1075,cat:"DIY & Woodworking",title:"Pallet Wood Crate",desc:"Disassemble a shipping pallet. Cut and assemble the reclaimed boards into a storage crate with a lid. Sand the rough edges. Name it."},
  {id:1076,cat:"DIY & Woodworking",title:"Wooden Card and Photo Holder",desc:"Cut a plank and add a slot or wire across the top to hold cards, photos, or notes vertically. Sand and finish. Fill it immediately."},
  {id:1077,cat:"DIY & Woodworking",title:"Wax-Finish End Grain Board",desc:"Build or find a thick end-grain cutting board. Plane or sand it flat. Apply beeswax finish, working it into the grain. It should feel completely different after."},
  {id:1078,cat:"DIY & Woodworking",title:"Wooden Pencil Bookmarks",desc:"Cut thin plywood into bookmark shapes. Sand edges smooth. Drill a hole for a tassel. Burn or paint a design on each. Give them away."},
  {id:1079,cat:"DIY & Woodworking",title:"Wooden Trivet from Dowels",desc:"Arrange wooden dowels side by side on two parallel cross pieces. Glue everything with wood glue and clamp. It should protect a surface from a hot pan."},
  {id:1080,cat:"DIY & Woodworking",title:"Drawer Repair",desc:"Find a drawer in your home that sticks, wobbles, or won't close properly. Diagnose the problem, fix it—re-glue joints, plane a tight edge, add wax—and test it 10 times."},

  // ─── GARDENING & OUTDOORS (1081-1110) ───
  {id:1081,cat:"Gardening & Outdoors",title:"Pot Herb Garden",desc:"Plant at least three different herbs in small terracotta pots from seeds or cuttings. Label each one. Water them. Put them somewhere they'll actually get light."},
  {id:1082,cat:"Gardening & Outdoors",title:"Compost Bin from a Plastic Tub",desc:"Drill 20 holes in a plastic storage bin for drainage and airflow. Fill it with alternating green and brown material. Add worms if you can. Label the start date."},
  {id:1083,cat:"Gardening & Outdoors",title:"Nature Journal: 5 Sketched Plants",desc:"Go outside. Find 5 different plants you can identify or want to identify. Sketch each one in detail, noting location, date, and any features you notice."},
  {id:1084,cat:"Gardening & Outdoors",title:"Pressed Flower Frame",desc:"Collect flowers or leaves from your garden or local area. Press them between books for 30 minutes minimum. Arrange them on paper and frame them."},
  {id:1085,cat:"Gardening & Outdoors",title:"Simple Raised Bed Frame",desc:"Cut two 2x6 boards into four lengths. Screw them into a rectangle. Set it on level ground, fill with compost and soil mix. Plant something today."},
  {id:1086,cat:"Gardening & Outdoors",title:"Three Sisters Garden",desc:"Research the three sisters companion planting method. Prepare a bed or containers for corn, beans, and squash. Plant them in the right configuration."},
  {id:1087,cat:"Gardening & Outdoors",title:"Egg Carton Seed Starter",desc:"Fill an egg carton with potting mix. Sow seeds in each cell. Label every variety with a toothpick flag. Water gently. Track germination daily."},
  {id:1088,cat:"Gardening & Outdoors",title:"Pine Cone Bird Feeder",desc:"Roll a pine cone in peanut butter, then in birdseed. Tie a string to it and hang it in a tree. Watch what visits within the hour."},
  {id:1089,cat:"Gardening & Outdoors",title:"Cold Frame from an Old Window",desc:"Build a simple cold frame from four scrap boards and an old window pane as the lid. Place it over an existing bed or plant a few seedlings inside immediately."},
  {id:1090,cat:"Gardening & Outdoors",title:"Seed Saving Project",desc:"Collect seeds from peppers, tomatoes, or herbs you have at home. Rinse and dry them. Store them in labelled paper envelopes. Calculate the sow date for next year."},
  {id:1091,cat:"Gardening & Outdoors",title:"Bamboo Insect Hotel",desc:"Bundle bamboo tubes and hollow stems in a wooden frame or plastic bottle. Hang it in a sheltered, sunny spot. Label the target insects."},
  {id:1092,cat:"Gardening & Outdoors",title:"Wildflower Identification Walk",desc:"Walk for 30 minutes looking for plants you don't know. Photograph 10, identify them using a field guide or app, and write their names and one fact about each."},
  {id:1093,cat:"Gardening & Outdoors",title:"Bamboo Trellis",desc:"Push bamboo canes into the soil in a fan or grid pattern. Tie cross-bars with garden twine. Plant a climber at the base. It should look intentional."},
  {id:1094,cat:"Gardening & Outdoors",title:"Foraging Guide for Your Area",desc:"Research and write a field guide page for 5 edible plants that grow near you. Include: how to identify, when to harvest, one recipe, and any lookalikes to avoid."},
  {id:1095,cat:"Gardening & Outdoors",title:"Jar Terrarium",desc:"Layer gravel, activated charcoal, and potting soil in a large glass jar. Plant small ferns or moss. Seal it if you're making a closed system. Name your ecosystem."},
  {id:1096,cat:"Gardening & Outdoors",title:"4-Season Garden Plan",desc:"Design a planting plan for a bed that has something blooming or growing in every season. Sketch the layout. Write the variety names and succession dates."},
  {id:1097,cat:"Gardening & Outdoors",title:"Hand-Painted Plant Pot",desc:"Take a plain terracotta pot. Sketch a design, then paint it with acrylic paint. Seal it with a varnish. Plant something in it before the day is over."},
  {id:1098,cat:"Gardening & Outdoors",title:"Banana Peel Plant Food",desc:"Soak banana peels in water for 24 hours. Use the liquid to water a plant. Start the process now and write up the simple instructions for others."},
  {id:1099,cat:"Gardening & Outdoors",title:"Bee and Butterfly Garden Plan",desc:"Research which flowers in your climate attract bees and butterflies. Design a planting plan using at least 8 species that provide coverage from spring to autumn."},
  {id:1100,cat:"Gardening & Outdoors",title:"Rain Barrel from a Large Container",desc:"Fit a tap near the base of a large container and connect it to a downpipe diverter. Test that water flows cleanly from tap. Calculate the container's litre capacity."},
  {id:1101,cat:"Gardening & Outdoors",title:"Moon Planting Calendar",desc:"Research lunar gardening. Create a planting calendar for next month matching above-ground crops to waxing moon phases and root crops to the waning phase."},
  {id:1102,cat:"Gardening & Outdoors",title:"Window Box Color Theme",desc:"Plan and plant a window box with a strict color theme: all-white, hot orange and yellow, cool blue and purple. Every plant should earn its spot."},
  {id:1103,cat:"Gardening & Outdoors",title:"Worm Farm from Stacking Bins",desc:"Drill holes in two stacking plastic bins. Add bedding, food scraps, and worms to the top bin. Collect leachate from the bottom bin. Label the build date."},
  {id:1104,cat:"Gardening & Outdoors",title:"Jute Macramé Plant Hanger",desc:"Cut jute rope into lengths. Tie a series of square knots and half-hitch knots to create a plant hanger. Hang a pot in it before you put it away."},
  {id:1105,cat:"Gardening & Outdoors",title:"Rock Garden Markers",desc:"Collect 10 smooth rocks. Paint a plant name on each one with paint pens or acrylic. Seal them. Put them in the ground by the corresponding plant."},
  {id:1106,cat:"Gardening & Outdoors",title:"Propagate a Houseplant",desc:"Take a cutting from a healthy houseplant. Root it in water or soil. Label it with the species name, cutting date, and expected root time."},
  {id:1107,cat:"Gardening & Outdoors",title:"Wildlife Corner Plan",desc:"Designate a corner of your garden as a wildlife zone. Plan what to plant and what to leave: nettles, log pile, wildflowers. Write the no-maintenance pledge."},
  {id:1108,cat:"Gardening & Outdoors",title:"Natural Wreath",desc:"Gather branches, dried seed heads, pinecones, and leaves from outside. Wire them into a ring. Hang it before you decide it's not finished enough."},
  {id:1109,cat:"Gardening & Outdoors",title:"Container Vegetable Garden: Three Crops",desc:"Choose three vegetables suitable for containers in your climate. Get the right pot sizes, soil mix, and sow or transplant all three today."},
  {id:1110,cat:"Gardening & Outdoors",title:"Build a Simple Water Feature",desc:"Use a pot, a small submersible pump, and some stones to make a self-contained water feature. Fill it, test the pump, adjust the flow. Listen to it."},

  // ─── FASHION & UPCYCLING (1111-1140) ───
  {id:1111,cat:"Fashion & Upcycling",title:"Spiral Tie-Dye T-Shirt",desc:"Pinch the center of a white t-shirt, twist it into a spiral, secure with rubber bands, and apply two or three colors of fabric dye. Rinse, reveal, wear."},
  {id:1112,cat:"Fashion & Upcycling",title:"Cut-Off Denim Shorts",desc:"Take old jeans. Cut them to your desired length. Fray the hem by pulling horizontal threads. Wash and dry them. Wear them today."},
  {id:1113,cat:"Fashion & Upcycling",title:"Embroidered Collar",desc:"Sketch a floral or geometric design on the collar of a plain shirt. Embroider it with a split stitch or satin stitch. It should look deliberate and handmade."},
  {id:1114,cat:"Fashion & Upcycling",title:"Re-Dye a Faded Garment",desc:"Take a faded black or dark garment. Dye it in a bucket according to fabric dye instructions. Rinse until the water runs clear. Compare before and after."},
  {id:1115,cat:"Fashion & Upcycling",title:"Oversized Shirt to Crop Top",desc:"Take a shirt that's too big. Cut it to crop length. Tie the front hem or hem it by hand. It should take under 10 minutes and look like you meant it."},
  {id:1116,cat:"Fashion & Upcycling",title:"Hand-Painted Canvas Shoes",desc:"Clean a pair of plain canvas shoes. Sketch a design lightly. Paint with fabric paint using thin brushes. Seal with fabric medium. Let dry fully before wearing."},
  {id:1117,cat:"Fashion & Upcycling",title:"Denim Jacket Patch Job",desc:"Find or make 3 patches that mean something to you. Iron or sew them onto a denim jacket in a layout you've planned. Step back and look at it properly."},
  {id:1118,cat:"Fashion & Upcycling",title:"Jersey Infinity Scarf",desc:"Cut a rectangle of jersey fabric (no fraying). Fold it into a loop and sew or glue the two short ends together. That's it. Wear it."},
  {id:1119,cat:"Fashion & Upcycling",title:"Fabric Scrunchie",desc:"Cut a strip of fabric 50x10cm. Fold and sew lengthwise, thread elastic through, and join the ends. Your first scrunchie in under 30 minutes."},
  {id:1120,cat:"Fashion & Upcycling",title:"Potato Stamp Tote Bag",desc:"Carve a design into a halved potato. Press it in fabric paint and stamp a repeating pattern onto a plain canvas tote. Let dry. Use it."},
  {id:1121,cat:"Fashion & Upcycling",title:"Sweater to Fingerless Gloves",desc:"Cut the sleeves off an old sweater at the wrist length you want. Cut a thumb hole. Hem the cut edge if needed. Two gloves in under 20 minutes."},
  {id:1122,cat:"Fashion & Upcycling",title:"Fabric Headband",desc:"Cut two strips of fabric, stack them right-sides together, sew around three edges, turn right-side out, join the ends. Add elastic if needed."},
  {id:1123,cat:"Fashion & Upcycling",title:"10-Item Capsule Wardrobe",desc:"Open your wardrobe. Choose 10 items that work together. Photograph 5 complete outfits from those 10 items only. Write a sentence about why each item earns its place."},
  {id:1124,cat:"Fashion & Upcycling",title:"Garment Mending",desc:"Find something wearable you've been ignoring because of a fault—a hem, a button, a seam. Fix it right now. It should take under 30 minutes. Wear it this week."},
  {id:1125,cat:"Fashion & Upcycling",title:"No-Sew Canvas Tote",desc:"Cut a piece of canvas into a rectangle. Fold the sides up and glue with fabric glue. Cut two handle strips. Glue them on. Let dry completely before use."},
  {id:1126,cat:"Fashion & Upcycling",title:"Bleach Pattern Hoodie",desc:"Lay a dark hoodie flat. Apply tape or stencils in a geometric pattern. Spray with diluted bleach. Wait, then rinse thoroughly. Remove tape and reveal."},
  {id:1127,cat:"Fashion & Upcycling",title:"Drawstring Bag",desc:"Cut two fabric rectangles. Sew them together on three sides. Fold over the top and sew a channel for a drawstring. Thread the string through. Done."},
  {id:1128,cat:"Fashion & Upcycling",title:"Natural Dye Fabric Swatch",desc:"Simmer onion skins, turmeric, or beets in water. Soak a pre-mordanted cotton swatch for 30 minutes. Rinse and dry. You made a color from plants."},
  {id:1129,cat:"Fashion & Upcycling",title:"Patchwork Coin Pouch",desc:"Cut fabric scraps into squares. Sew them into a rectangle. Fold in half, sew the sides, add a zip or button closure. Small enough to fit in any pocket."},
  {id:1130,cat:"Fashion & Upcycling",title:"Embroidered Canvas Hat",desc:"Take a plain cap. Sketch a design on the front panel. Stitch it in satin stitch or backstitch. It should be clearly visible from across a room."},
  {id:1131,cat:"Fashion & Upcycling",title:"Style Mood Board",desc:"Create a physical or digital mood board for a personal style you want to develop. Include colors, textures, silhouettes, and one specific piece you'd buy first."},
  {id:1132,cat:"Fashion & Upcycling",title:"Men's Shirt to Shoulder Bag",desc:"Take a button-up shirt. Cut off the sleeves and collar. Sew or glue the bottom shut. Use the button placket as the closure. Add a strap. Carry it."},
  {id:1133,cat:"Fashion & Upcycling",title:"Braided Fabric Belt",desc:"Cut 3 long strips of faux leather or thick fabric. Braid them together. Attach a simple D-ring or tie closure at each end. Try it on before trimming the length."},
  {id:1134,cat:"Fashion & Upcycling",title:"Garment Redesign Sketch",desc:"Pick a piece of clothing you own but never wear. Sketch three ways you could redesign it into something you would wear. Commit to one and make the first cut."},
  {id:1135,cat:"Fashion & Upcycling",title:"Pillow Cover from Fabric You Love",desc:"Cut two rectangles of fabric the size of your pillow plus seam allowance. Sew three sides, insert the pillow, sew the fourth side closed. Done in under 30 minutes."},
  {id:1136,cat:"Fashion & Upcycling",title:"Embroidered Fabric Bookmark",desc:"Cut a strip of stiff fabric. Embroider your name, a word, or a small motif on it. Backstitch a border. Seal the ends. Put it in a book you're reading."},
  {id:1137,cat:"Fashion & Upcycling",title:"Slow Fashion Wardrobe Design",desc:"Sketch a fictional 10-piece 'slow fashion' wardrobe for a person you invent. Specify fabric, country of origin, and how each piece works with the others."},
  {id:1138,cat:"Fashion & Upcycling",title:"Zippered Pencil Case",desc:"Cut two fabric rectangles. Sew a zip along the top edge. Fold right-sides together, sew the sides and bottom. Turn right-side out. Fill it with things."},
  {id:1139,cat:"Fashion & Upcycling",title:"Sew a Tote from Scratch",desc:"Cut a canvas rectangle for the body and two strips for handles. Sew the body into a bag shape. Attach the handles securely. It should hold a week's groceries."},
  {id:1140,cat:"Fashion & Upcycling",title:"5 Outfits, 8 Items",desc:"Lay out 8 items from your wardrobe. Photograph 5 complete, wearable outfits using only those items. Write one sentence about each look."},

  // ─── AI & AUTOMATION (1141-1160) ───
  {id:1141,cat:"AI & Automation",title:"Automation Flowchart: Weekly Tasks",desc:"Draw a complete flowchart on paper for automating your most repetitive weekly task. Every decision, every branch, every output. No code yet—just the logic."},
  {id:1142,cat:"AI & Automation",title:"File Renamer by Date",desc:"Write a Python script that scans a folder and renames every file to include its creation date as a prefix (YYYY-MM-DD_originalname). Test it on a test folder."},
  {id:1143,cat:"AI & Automation",title:"Rule-Based Chatbot",desc:"Build a Python chatbot using only if/elif/else logic—no AI, no APIs. It should handle at least 15 different inputs and give useful responses to each one."},
  {id:1144,cat:"AI & Automation",title:"Regex Extractor",desc:"Write a Python script using only the `re` module to extract phone numbers, email addresses, and URLs from any block of text you paste in. Test it on 5 examples."},
  {id:1145,cat:"AI & Automation",title:"Project Folder Setup Script",desc:"Write a shell script that creates a timestamped project folder with standard subdirectories (src, docs, output, data) and a blank README.txt. Run it."},
  {id:1146,cat:"AI & Automation",title:"CSV Daily Summary",desc:"Write a Python script that reads a CSV file and prints a formatted summary: row count, column names, numeric column stats, and any obvious anomalies."},
  {id:1147,cat:"AI & Automation",title:"Folder File Watcher",desc:"Write a Python script that monitors a folder and logs a timestamped entry to a text file every time a new file appears. Test it by dropping files in."},
  {id:1148,cat:"AI & Automation",title:"Email Triage Decision Tree on Paper",desc:"Draw a decision tree for routing your email automatically: by sender, subject keywords, or label. Make it specific enough that a script could follow it."},
  {id:1149,cat:"AI & Automation",title:"ICS Calendar Parser",desc:"Write a Python script that reads an .ics calendar export and prints this week's events: title, date, time, and duration. Export your calendar to test it."},
  {id:1150,cat:"AI & Automation",title:"File Organizer by Extension",desc:"Write a Python script that scans a folder and moves every file into a subfolder named after its extension (pdf/, jpg/, txt/, etc.). Test on a cluttered Downloads folder."},
  {id:1151,cat:"AI & Automation",title:"Overdue TODO Reminder",desc:"Write a script that reads a TODO.txt file where each item has a due date, and prints all overdue items highlighted in red using ANSI codes."},
  {id:1152,cat:"AI & Automation",title:"RSS Headline Scraper",desc:"Write a Python script using `urllib` and `xml.etree` to parse an RSS feed and print today's headlines with links. No external libraries allowed."},
  {id:1153,cat:"AI & Automation",title:"Weekly Habit Report from CSV",desc:"Write a script that reads a daily habits CSV (date, habit1, habit2...) and generates a weekly completion percentage for each habit."},
  {id:1154,cat:"AI & Automation",title:"Morning Setup Shell Script",desc:"Write a shell script that opens your most-used apps, creates today's work folder, and prints your top 3 tasks from a text file. Run it tomorrow morning."},
  {id:1155,cat:"AI & Automation",title:"Markdown to HTML Converter",desc:"Write a Python script that converts a Markdown file to a valid, styled HTML page. Handle headers, bold, italic, links, and paragraph breaks without using libraries."},
  {id:1156,cat:"AI & Automation",title:"Auto Backup to Dated Zip",desc:"Write a Python script that zips a specified folder and saves it as foldername_YYYY-MM-DD.zip in a backup location. Add it to cron or run it manually."},
  {id:1157,cat:"AI & Automation",title:"Personal Finance Flowchart",desc:"Draw a complete flowchart for automating your monthly personal finances: income routing, bill payments, savings transfers, and discretionary spending decisions."},
  {id:1158,cat:"AI & Automation",title:"Mood Logger CLI",desc:"Write a Python script that prompts you for a mood rating (1-10) and a note, then appends a timestamped entry to a CSV. Include a 7-day average display on launch."},
  {id:1159,cat:"AI & Automation",title:"Daily Quote from a File",desc:"Write a script that reads a text file of quotes (one per line), picks a random one, and prints it formatted nicely each time it runs. Set it to run at login."},
  {id:1160,cat:"AI & Automation",title:"Expense Log Summarizer",desc:"Write a Python script that reads a CSV of expenses (date, category, amount) and outputs a monthly total per category as a formatted text table."},

  // ─── DATA SCIENCE & ML (1161-1185) ───
  {id:1161,cat:"Data Science & ML",title:"Public Dataset Summary",desc:"Download any public CSV dataset from Kaggle or the UCI repository. Write a 300-word summary: what it contains, who collected it, what questions it could answer."},
  {id:1162,cat:"Data Science & ML",title:"Five Hand-Drawn Charts",desc:"Find a dataset. Draw 5 charts by hand on paper: a bar chart, line chart, scatter plot, histogram, and pie chart from the same dataset. Label everything properly."},
  {id:1163,cat:"Data Science & ML",title:"Summary Statistics Script",desc:"Write a Python script that loads any CSV and prints mean, median, mode, standard deviation, min, and max for every numeric column. Format it as a clean table."},
  {id:1164,cat:"Data Science & ML",title:"Scatter Plot: Two Variables",desc:"Pick any two numeric variables from a dataset you find interesting. Plot them in matplotlib. Add a title, axis labels, and a trend line. Save the image."},
  {id:1165,cat:"Data Science & ML",title:"Manual Dataset Cleaning",desc:"Find a messy dataset. Clean it by hand in a spreadsheet or with Python: remove duplicates, standardize date formats, fix capitalization, handle missing values. Document every decision."},
  {id:1166,cat:"Data Science & ML",title:"Data Story: One Insight",desc:"Find one interesting pattern in any dataset. Write a 400-word 'data story' explaining what you found, why it matters, and what you'd investigate next."},
  {id:1167,cat:"Data Science & ML",title:"Word Frequency Counter: Gutenberg Book",desc:"Download any book from Project Gutenberg. Write a Python script to count word frequencies, exclude common stop words, and print the top 30 most-used meaningful words."},
  {id:1168,cat:"Data Science & ML",title:"Hand-Drawn Decision Tree",desc:"Pick a classification problem you care about. Draw a complete decision tree by hand with at least 4 levels of splits. Label every node and leaf."},
  {id:1169,cat:"Data Science & ML",title:"Dataset Bias Audit",desc:"Take any dataset and write a bias audit: who is overrepresented, who is underrepresented, what collection method might have introduced bias, and what decisions you'd caution against."},
  {id:1170,cat:"Data Science & ML",title:"Linear Regression from Scratch",desc:"Implement simple linear regression using only NumPy—no scikit-learn. Fit a line to any two-variable dataset. Print the slope, intercept, and R² value."},
  {id:1171,cat:"Data Science & ML",title:"Visualize Your Screen Time",desc:"Export your screen time or phone usage data. Load it into Python. Create a bar chart showing daily totals and a line chart showing week-over-week trends."},
  {id:1172,cat:"Data Science & ML",title:"Pearson Correlation by Hand",desc:"Take two numeric data series of 10 values each. Calculate Pearson correlation coefficient by hand, showing all working. Then verify with a single NumPy call."},
  {id:1173,cat:"Data Science & ML",title:"Personal Data Diary",desc:"Track one personal metric every day for 5 days (sleep, mood, steps, water). Then load it into Python and plot a line chart with annotations on notable days."},
  {id:1174,cat:"Data Science & ML",title:"Confusion Matrix by Hand",desc:"Create 10 binary classification predictions vs. actuals. Draw the confusion matrix by hand. Calculate precision, recall, F1 score, and accuracy from it."},
  {id:1175,cat:"Data Science & ML",title:"KNN from Scratch",desc:"Implement k-nearest neighbors classification from scratch in Python using only lists and math. Test it on the Iris dataset loaded from a CSV. Print accuracy."},
  {id:1176,cat:"Data Science & ML",title:"Manual Annotation Dataset",desc:"Design a binary classification task. Annotate 50 examples yourself (e.g., tweet sentiment: positive/negative). Export to CSV. Calculate inter-rater agreement if a friend annotates 10."},
  {id:1177,cat:"Data Science & ML",title:"Bias-Variance Explainer",desc:"Write a one-page explanation of the bias-variance tradeoff using a cooking analogy. Include a hand-drawn diagram. Make it readable by someone who's never taken a stats class."},
  {id:1178,cat:"Data Science & ML",title:"Bar Chart Race in Python",desc:"Find a dataset with values changing over time across categories. Build an animated bar chart race in matplotlib. Export it as a GIF or video."},
  {id:1179,cat:"Data Science & ML",title:"Data Cleaning Pipeline",desc:"Write a Python function that takes a raw CSV and returns a cleaned DataFrame: strips whitespace, standardizes column names, removes duplicates, fixes data types. Test on real messy data."},
  {id:1180,cat:"Data Science & ML",title:"Chart Critique and Redesign",desc:"Find a chart online that you think misrepresents data. Write a 200-word critique explaining the problem. Then redraw it by hand in a way that's more honest."},
  {id:1181,cat:"Data Science & ML",title:"Pivot Table in Python",desc:"Load a CSV with categorical and numeric data. Build a pivot table using pandas showing totals and means grouped by two categorical variables. Visualize one slice."},
  {id:1182,cat:"Data Science & ML",title:"ML Pipeline Pseudocode",desc:"Write complete pseudocode for a machine learning pipeline: data collection, cleaning, feature engineering, model selection, training, evaluation, and deployment. Make every step explicit."},
  {id:1183,cat:"Data Science & ML",title:"Choropleth Map",desc:"Find a dataset with a value per country or region. Plot it as a colored map using matplotlib or plotly. Adjust the color scale until it tells the story clearly."},
  {id:1184,cat:"Data Science & ML",title:"Word Cloud from Your Writing",desc:"Collect your last 50 messages, emails, or journal entries. Build a word cloud in Python. Notice what it says about what you think and talk about most."},
  {id:1185,cat:"Data Science & ML",title:"Simple Recommendation Algorithm",desc:"Create a 5x5 user-item ratings matrix. Implement item-item collaborative filtering from scratch. Given one user's ratings, recommend their top 3 unrated items."},

  // ─── HARDWARE & ELECTRONICS (1186-1210) ───
  {id:1186,cat:"Hardware & Electronics",title:"LED and Resistor on a Breadboard",desc:"Wire a single LED with a correctly calculated current-limiting resistor to a 9V battery on a breadboard. Calculate the resistor value first, then test it."},
  {id:1187,cat:"Hardware & Electronics",title:"Voltage Divider Circuit",desc:"Build a two-resistor voltage divider. Calculate the expected output voltage. Measure it with a multimeter. Compare measured to calculated and explain any difference."},
  {id:1188,cat:"Hardware & Electronics",title:"SOS in Morse Code: Arduino LED",desc:"Program an Arduino to blink an LED in the SOS Morse code pattern. Implement it using delays. Then refactor to use millis() instead."},
  {id:1189,cat:"Hardware & Electronics",title:"Toggle Button to LED",desc:"Wire a push button with a pull-down resistor to an Arduino. Program it so each press toggles the LED on or off. Test it 20 times without failure."},
  {id:1190,cat:"Hardware & Electronics",title:"Solder a Beginner Kit",desc:"Buy or find a simple through-hole soldering kit (LED matrix, flashing light kit). Solder every component. Test it. Your solder joints should be shiny and cone-shaped."},
  {id:1191,cat:"Hardware & Electronics",title:"555 Timer Buzzer Alarm",desc:"Build an astable 555 timer circuit that drives a buzzer at an audible frequency. Calculate the frequency using your component values before you build it."},
  {id:1192,cat:"Hardware & Electronics",title:"Light-Activated LED",desc:"Wire a photoresistor in a voltage divider with an LED. The LED should turn on when you cover the sensor and turn off in light. No microcontroller needed."},
  {id:1193,cat:"Hardware & Electronics",title:"Homemade Battery Tester",desc:"Build a simple battery tester from an LED, a resistor, and two wire probes. Test 10 batteries from around your home. Sort them into good, weak, and dead."},
  {id:1194,cat:"Hardware & Electronics",title:"AND Gate from Switches and LED",desc:"Wire two switches and an LED on a breadboard so the LED only lights when both switches are on. Document the truth table. Try OR and NOT next."},
  {id:1195,cat:"Hardware & Electronics",title:"Hand-Drawn Circuit Schematic",desc:"Design a circuit you want to build on paper. Use correct schematic symbols for every component. Label all values. Check it for short circuits before building."},
  {id:1196,cat:"Hardware & Electronics",title:"Temperature Logger to Serial",desc:"Wire a DHT11 or DS18B20 sensor to an Arduino. Print temperature and humidity readings to Serial Monitor every 5 seconds. Graph the output in the Serial Plotter."},
  {id:1197,cat:"Hardware & Electronics",title:"555 Astable Metronome",desc:"Build a 555 timer in astable mode as an adjustable-tempo metronome. Use a potentiometer to vary the tempo. Calculate the BPM range your component values allow."},
  {id:1198,cat:"Hardware & Electronics",title:"Headphone Cable Repair",desc:"Find a broken pair of headphones. Diagnose which cable or connection is faulty with a multimeter. Solder the repair. Test with audio before putting it back together."},
  {id:1199,cat:"Hardware & Electronics",title:"Capacitor Charge/Discharge Demo",desc:"Build an RC circuit with a capacitor and resistor. Watch the LED dim slowly as the cap charges. Calculate the time constant and measure it in reality."},
  {id:1200,cat:"Hardware & Electronics",title:"Servo Sweep",desc:"Wire a hobby servo to an Arduino. Write a sketch that sweeps from 0° to 180° and back, pausing at each end. Control the speed with a potentiometer."},
  {id:1201,cat:"Hardware & Electronics",title:"Two-Bit Binary Counter",desc:"Wire two LEDs to two toggle switches on a breadboard. Map the four switch combinations to binary 0–3. Label each LED as a bit. Flash through all four states."},
  {id:1202,cat:"Hardware & Electronics",title:"Rain Detector Circuit",desc:"Scratch two parallel sets of exposed copper traces onto cardboard. Bridge them with water and watch an LED light up. Explain why the water conducts."},
  {id:1203,cat:"Hardware & Electronics",title:"Piezo Melody Player",desc:"Wire a piezo buzzer to an Arduino. Write a sketch that plays a simple melody using tone() and note frequency values. Choose a melody you'll recognize."},
  {id:1204,cat:"Hardware & Electronics",title:"PCB Layout by Hand",desc:"Take a circuit you've already built on a breadboard. Draw its PCB layout by hand on graph paper: component pads, copper traces, and drill holes. Check for crossings."},
  {id:1205,cat:"Hardware & Electronics",title:"Soil Moisture Indicator",desc:"Push two nails into damp soil connected by wire to an LED and battery. The LED should light when the soil is wet. Calibrate 'wet' by testing known conditions."},
  {id:1206,cat:"Hardware & Electronics",title:"7-Segment Manual Display",desc:"Wire a 7-segment display to 7 switches. Build a look-up table so each switch pattern shows a digit. Display your initials if the display supports letters."},
  {id:1207,cat:"Hardware & Electronics",title:"Hand-Crank Generator",desc:"Wind 50+ turns of enameled copper wire around a cardboard tube. Pass a strong magnet through the coil while measuring the output voltage. Calculate expected EMF."},
  {id:1208,cat:"Hardware & Electronics",title:"Transistor-Switched Fan",desc:"Wire a small DC fan through an NPN transistor controlled by an Arduino PWM pin. Write a sketch that ramps the fan from 0 to full speed and back over 5 seconds."},
  {id:1209,cat:"Hardware & Electronics",title:"Traffic Light Sequence",desc:"Wire three LEDs (red, yellow, green) to an Arduino. Program a realistic traffic light sequence with correct timings. Add a pedestrian button that triggers a crossing phase."},
  {id:1210,cat:"Hardware & Electronics",title:"Electronics Project Spec",desc:"Design a complete electronics project you could build in a weekend. Write: what it does, full component list with part numbers, hand-drawn schematic, estimated cost, and build time."},

  // ─── WILDCARD (1211-1225) ───
  {id:1211,cat:"Wildcard",title:"$10 Thrift Store Challenge",desc:"Go to a thrift store with exactly $10. Buy whatever speaks to you. Make or do something with it before the day is over. Document the result."},
  {id:1212,cat:"Wildcard",title:"Cook a Cuisine You've Never Tried",desc:"Pick a national cuisine you have zero experience with. Cook one traditional dish from it without a recipe—use instinct and the ingredient list from your research."},
  {id:1213,cat:"Wildcard",title:"Single Sheet of Paper Tower",desc:"Using one sheet of A4 or letter paper and no tape, build the tallest freestanding structure you can in 30 minutes. Measure it. Beat it."},
  {id:1214,cat:"Wildcard",title:"Review Your Own Personality",desc:"Write a thorough review of your own personality as if you'd just met yourself. Be fair. Include 3 stars you'd take back and 3 things you'd recommend."},
  {id:1215,cat:"Wildcard",title:"Perfect Morning: Minute by Minute",desc:"Plan your ideal morning in extreme detail—every minute from waking to noon. Include what you eat, wear, and think. Try it tomorrow."},
  {id:1216,cat:"Wildcard",title:"One Hour, No Screens",desc:"Put every screen away for exactly one hour. Do something physical or creative. When the hour is up, write down what arose: what you noticed, made, or thought about."},
  {id:1217,cat:"Wildcard",title:"Life Map",desc:"Draw a map of your life's major decision points. Show the forks in the road, the paths not taken, and where you are now. Label the moments that mattered."},
  {id:1218,cat:"Wildcard",title:"Museum Exhibition Concept",desc:"Write a complete proposal for a museum exhibition on a topic you're obsessed with. Name it, describe 5 artifacts or installations, and write the wall text for the entrance."},
  {id:1219,cat:"Wildcard",title:"Relationship Playlist Archive",desc:"Create a playlist for each significant relationship in your life—a friend, a family member, a chapter, a place. Write a liner note for each one. Keep the archive."},
  {id:1220,cat:"Wildcard",title:"Useful Thing from Trash",desc:"Build something useful from items you'd normally discard this week. It must function. Document the before and after."},
  {id:1221,cat:"Wildcard",title:"Retirement Speech, 30 Years Out",desc:"Write the speech you'd give at your own retirement party 30 years from now. Be specific about what you accomplished, who you thanked, and what you're proud of."},
  {id:1222,cat:"Wildcard",title:"Everything You Own in One Category",desc:"Pick one category—books, clothes, shoes, mugs. Count every item you own in it. List them all. Decide which 20% you'd keep if you had to cut it by 80%."},
  {id:1223,cat:"Wildcard",title:"This Year's Highlight Reel",desc:"Create a scrapbook page (physical or digital) documenting the best moments of the past 12 months. Include photos, a ticket stub, a quote, and one sentence about what it means."},
  {id:1224,cat:"Wildcard",title:"Card Trick in One Hour",desc:"Learn one card trick from scratch. Practice it until you can perform it smoothly from start to finish. Perform it for the first person you can find."},
  {id:1225,cat:"Wildcard",title:"Staycation Itinerary",desc:"Design a complete itinerary for an ideal 48-hour staycation: every meal, activity, and rest period planned out. Include one thing you've never done in your own city."},
];

const PER_PAGE = 50;
const ALL_CATS = ["All", ...Object.keys(CAT_CONFIG)];
/* Maps idea.id → display number (array-position-based, updates when ideas are added) */
const IDEA_NUM = new Map(ALL_IDEAS.map((idea, i) => [idea.id, i + 1]));

/* ── COMPONENTS ── */
function Checkbox({ checked, onChange }) {
  const dark = useContext(ThemeCtx);
  const [pop, setPop] = useState(false);
  const handleClick = (e) => {
    e.stopPropagation();
    setPop(true);
    setTimeout(() => setPop(false), 250);
    onChange();
  };
  return (
    <button
      onClick={handleClick}
      aria-label={checked ? "Mark undone" : "Mark done"}
      style={{
        width: 22, height: 22, borderRadius: 6, border: "none", cursor: "pointer",
        flexShrink: 0, display: "flex", alignItems: "center", justifyContent: "center",
        background: checked ? "hsla(155,70%,55%,0.2)" : dark ? "rgba(255,255,255,0.07)" : "rgba(0,0,0,0.06)",
        outline: checked ? "1.5px solid hsla(155,70%,55%,0.6)" : dark ? "1.5px solid rgba(255,255,255,0.15)" : "1.5px solid rgba(0,0,0,0.18)",
        transition: "all 0.15s",
        transform: pop ? "scale(1.35)" : "scale(1)",
      }}
    >
      {checked && (
        <svg width="12" height="9" viewBox="0 0 12 9" fill="none">
          <path d="M1 4.5L4.5 8L11 1" stroke="hsl(155,70%,55%)" strokeWidth="2"
            strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      )}
    </button>
  );
}

function IdeaRow({ idea, done, onToggle, idx }) {
  const dark = useContext(ThemeCtx);
  const cc = dark ? catColor : catColorL;
  const cb = dark ? catBg : catBgL;
  const [hov, setHov] = useState(false);
  const col = cc(idea.cat);
  const icon = CAT_CONFIG[idea.cat]?.icon ?? "•";
  const displayNum = IDEA_NUM.get(idea.id) ?? idea.id;
  return (
    <div
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      style={{
        display: "flex", alignItems: "center", gap: 14,
        padding: "11px 16px",
        background: done
          ? (dark ? "rgba(6,214,160,0.03)" : "rgba(6,214,160,0.05)")
          : hov
            ? (dark ? "rgba(255,255,255,0.04)" : "rgba(255,255,255,0.7)")
            : "transparent",
        borderBottom: dark ? "1px solid rgba(255,255,255,0.05)" : "1px solid rgba(0,0,0,0.05)",
        transition: "background 0.15s",
        opacity: done ? 0.55 : 1,
        animation: `fadeUp 0.2s ease both`,
        animationDelay: `${Math.min(idx * 10, 150)}ms`,
      }}
    >
      <span style={{ fontSize: 10, color: dark ? "rgba(255,255,255,0.2)" : "rgba(0,0,0,0.25)", width: 32, flexShrink: 0, textAlign: "right", fontVariantNumeric: "tabular-nums" }}>
        {displayNum}
      </span>
      <span style={{
        fontSize: 10, fontWeight: 600, letterSpacing: "0.5px",
        color: col, background: cb(idea.cat, 0.15),
        border: `1px solid ${cc(idea.cat, 0.2)}`,
        borderRadius: 5, padding: "2px 7px", flexShrink: 0,
        display: "flex", alignItems: "center", gap: 3, whiteSpace: "nowrap",
      }}>
        <span>{icon}</span> {idea.cat}
      </span>
      <div style={{ flex: 1, minWidth: 0 }}>
        <span style={{
          fontSize: 13, fontWeight: 600, lineHeight: 1.3,
          color: done
            ? (dark ? "rgba(255,255,255,0.35)" : "rgba(10,15,25,0.35)")
            : (dark ? "rgba(255,255,255,0.9)" : "rgba(10,15,25,0.9)"),
          textDecoration: done ? "line-through" : "none",
          marginRight: 10,
        }}>{idea.title}</span>
        <span style={{ fontSize: 12, color: dark ? "rgba(255,255,255,0.3)" : "rgba(10,15,25,0.42)", lineHeight: 1.5 }}>
          {idea.desc}
        </span>
      </div>
      <Checkbox checked={done} onChange={onToggle} />
    </div>
  );
}

function IdeaCard({ idea, done, onToggle, delay }) {
  const dark = useContext(ThemeCtx);
  const cc = dark ? catColor : catColorL;
  const cb = dark ? catBg : catBgL;
  const [hov, setHov] = useState(false);
  const col = cc(idea.cat);
  const bg = dark
    ? (done ? "rgba(6,214,160,0.04)" : cb(idea.cat, hov ? 0.08 : 0.04))
    : (done ? "rgba(6,214,160,0.06)" : `rgba(255,255,255,${hov ? 0.82 : 0.65})`);
  const icon = CAT_CONFIG[idea.cat]?.icon ?? "•";
  const displayNum = IDEA_NUM.get(idea.id) ?? idea.id;
  return (
    <div
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      style={{
        background: bg,
        border: `1px solid ${hov && !done ? cc(idea.cat, 0.3) : done ? "rgba(6,214,160,0.22)" : dark ? "rgba(255,255,255,0.07)" : "rgba(0,0,0,0.07)"}`,
        borderRadius: 16,
        padding: "18px 20px",
        backdropFilter: "blur(14px)",
        transition: "all 0.18s ease",
        transform: hov && !done ? "translateY(-2px)" : "none",
        boxShadow: hov && !done
          ? dark
            ? `0 10px 30px rgba(0,0,0,0.35), 0 0 0 1px ${cc(idea.cat, 0.1)}`
            : `0 8px 24px rgba(0,0,0,0.10), 0 0 0 1px ${cc(idea.cat, 0.15)}`
          : dark ? "none" : "0 2px 8px rgba(0,0,0,0.05)",
        opacity: done ? 0.55 : 1,
        animation: `fadeUp 0.3s ease both`,
        animationDelay: `${delay}ms`,
        position: "relative",
        overflow: "hidden",
      }}
    >
      {hov && !done && (
        <div style={{
          position: "absolute", bottom: 0, left: 0, right: 0, height: 2,
          background: `linear-gradient(90deg, transparent, ${col}, transparent)`,
        }} />
      )}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 10 }}>
        <span style={{
          fontSize: 10, fontWeight: 600, letterSpacing: "0.6px",
          color: col,
          background: cb(idea.cat, 0.15),
          border: `1px solid ${cc(idea.cat, 0.2)}`,
          borderRadius: 6, padding: "2px 8px",
          display: "flex", alignItems: "center", gap: 4,
        }}>
          <span>{icon}</span> {idea.cat}
        </span>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <span style={{ fontSize: 10, color: dark ? "rgba(255,255,255,0.18)" : "rgba(0,0,0,0.22)" }}>#{displayNum}</span>
          <Checkbox checked={done} onChange={onToggle} />
        </div>
      </div>
      <h3 style={{
        margin: "0 0 7px",
        fontSize: 14, fontWeight: 600, lineHeight: 1.35,
        color: done
          ? (dark ? "rgba(255,255,255,0.35)" : "rgba(10,15,25,0.35)")
          : (dark ? "rgba(255,255,255,0.9)" : "rgba(10,15,25,0.9)"),
        textDecoration: done ? "line-through" : "none",
      }}>{idea.title}</h3>
      <p style={{ margin: 0, fontSize: 12, lineHeight: 1.65, color: dark ? "rgba(255,255,255,0.38)" : "rgba(10,15,25,0.5)" }}>
        {idea.desc}
      </p>
    </div>
  );
}

function SurpriseModal({ idea, done, onToggle, onClose, onNext }) {
  const dark = useContext(ThemeCtx);
  const cc = dark ? catColor : catColorL;
  const cb = dark ? catBg : catBgL;
  const icon = CAT_CONFIG[idea.cat]?.icon ?? "•";
  const col = cc(idea.cat);
  const displayNum = IDEA_NUM.get(idea.id) ?? idea.id;
  useEffect(() => {
    const h = (e) => { if (e.key === "Escape") onClose(); };
    window.addEventListener("keydown", h);
    return () => window.removeEventListener("keydown", h);
  }, [onClose]);
  return (
    <div
      onClick={onClose}
      style={{
        position: "fixed", inset: 0, zIndex: 999,
        display: "flex", alignItems: "center", justifyContent: "center",
        background: dark ? "rgba(0,0,0,0.7)" : "rgba(200,210,230,0.6)",
        backdropFilter: "blur(16px)",
        padding: 20,
      }}
    >
      <div
        onClick={e => e.stopPropagation()}
        style={{
          background: dark ? "rgba(16,20,28,0.97)" : "rgba(255,255,255,0.92)",
          border: `1px solid ${cc(idea.cat, 0.35)}`,
          borderRadius: 24,
          padding: "44px 40px",
          maxWidth: 560, width: "100%",
          textAlign: "center",
          boxShadow: dark
            ? `0 0 80px ${cc(idea.cat, 0.18)}, 0 40px 80px rgba(0,0,0,0.7)`
            : `0 0 60px ${cc(idea.cat, 0.12)}, 0 24px 60px rgba(0,0,0,0.15)`,
          animation: "fadeUp 0.25s ease both",
          position: "relative",
          backdropFilter: "blur(20px)",
        }}
      >
        <div style={{
          position: "absolute", top: -60, left: "50%", transform: "translateX(-50%)",
          width: 220, height: 220, borderRadius: "50%",
          background: `radial-gradient(circle, ${cc(idea.cat, 0.13)} 0%, transparent 70%)`,
          pointerEvents: "none",
        }} />
        <div style={{
          display: "inline-flex", alignItems: "center", gap: 6,
          fontSize: 11, fontWeight: 600, letterSpacing: "0.8px",
          color: col, background: cb(idea.cat, 0.2),
          border: `1px solid ${cc(idea.cat, 0.25)}`,
          borderRadius: 20, padding: "4px 14px", marginBottom: 20,
        }}>
          {icon} {idea.cat} · #{displayNum}
        </div>
        <h2 style={{
          fontSize: "clamp(22px, 4vw, 30px)", fontWeight: 700, margin: "0 0 14px",
          color: dark ? "rgba(255,255,255,0.95)" : "rgba(10,15,25,0.95)", lineHeight: 1.2,
        }}>{idea.title}</h2>
        <p style={{ color: dark ? "rgba(255,255,255,0.5)" : "rgba(10,15,25,0.55)", fontSize: 15, lineHeight: 1.7, margin: "0 0 32px" }}>
          {idea.desc}
        </p>
        <div style={{ display: "flex", gap: 10, justifyContent: "center", flexWrap: "wrap" }}>
          <button
            onClick={onToggle}
            style={{
              background: done ? "rgba(6,214,160,0.15)" : dark ? "rgba(255,255,255,0.06)" : "rgba(0,0,0,0.05)",
              border: `1px solid ${done ? "rgba(6,214,160,0.4)" : dark ? "rgba(255,255,255,0.14)" : "rgba(0,0,0,0.12)"}`,
              color: done ? "hsl(155,70%,50%)" : dark ? "rgba(255,255,255,0.85)" : "rgba(10,15,25,0.85)",
              borderRadius: 12, padding: "10px 20px", fontSize: 13, fontWeight: 500,
              cursor: "pointer", fontFamily: "inherit", transition: "all 0.15s",
            }}
          >{done ? "✓ Marked Done!" : "Mark as Done"}</button>
          <button
            onClick={onNext}
            style={{
              background: cb(idea.cat, 0.2), border: `1px solid ${cc(idea.cat, 0.35)}`,
              color: dark ? "rgba(255,255,255,0.9)" : "rgba(10,15,25,0.9)",
              borderRadius: 12, padding: "10px 20px",
              fontSize: 13, fontWeight: 600, cursor: "pointer", fontFamily: "inherit",
            }}
          >✦ Another One</button>
          <button
            onClick={onClose}
            style={{
              background: dark ? "rgba(255,255,255,0.04)" : "rgba(0,0,0,0.04)",
              border: dark ? "1px solid rgba(255,255,255,0.1)" : "1px solid rgba(0,0,0,0.1)",
              color: dark ? "rgba(255,255,255,0.45)" : "rgba(10,15,25,0.45)",
              borderRadius: 12, padding: "10px 18px",
              fontSize: 13, cursor: "pointer", fontFamily: "inherit",
            }}
          >Esc</button>
        </div>
      </div>
    </div>
  );
}

/* ── MAIN APP ── */
export default function App() {
  const [done, setDone] = useState({});
  const [storageReady, setStorageReady] = useState(false);
  const [search, setSearch] = useState("");
  const [activeCat, setActiveCat] = useState("All");
  const [filterMode, setFilterMode] = useState("all"); // all | todo | done
  const [page, setPage] = useState(1);
  const [modalIdea, setModalIdea] = useState(null);
  const [dark, setDark] = useState(() => {
    try { return localStorage.getItem("antislump_theme") === "dark"; } catch { return false; }
  });
  const [viewMode, setViewMode] = useState("card"); // card | list
  const [catsOpen, setCatsOpen] = useState(false);
  const gridRef = useRef(null);

  const toggleDark = useCallback(() => {
    setDark(d => {
      const next = !d;
      try { localStorage.setItem("antislump_theme", next ? "dark" : "light"); } catch {}
      return next;
    });
  }, []);

  // Load from localStorage
  useEffect(() => {
    try {
      const saved = localStorage.getItem(DONE_KEY);
      if (saved) setDone(JSON.parse(saved));
    } catch {}
    setStorageReady(true);
  }, []);

  const persistToggle = useCallback((id) => {
    setDone(prev => {
      const next = { ...prev, [id]: !prev[id] };
      try { localStorage.setItem(DONE_KEY, JSON.stringify(next)); } catch {}
      return next;
    });
  }, []);

  const filtered = useMemo(() => {
    const q = search.toLowerCase();
    return ALL_IDEAS.filter(i => {
      if (activeCat !== "All" && i.cat !== activeCat) return false;
      if (filterMode === "done" && !done[i.id]) return false;
      if (filterMode === "todo" && done[i.id]) return false;
      if (q) return i.title.toLowerCase().includes(q) || i.desc.toLowerCase().includes(q) || i.cat.toLowerCase().includes(q);
      return true;
    });
  }, [search, activeCat, filterMode, done]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PER_PAGE));
  const currentPage = Math.min(page, totalPages);
  const pageItems = filtered.slice((currentPage - 1) * PER_PAGE, currentPage * PER_PAGE);
  const doneCount = Object.values(done).filter(Boolean).length;
  const pct = Math.round((doneCount / ALL_IDEAS.length) * 100);

  const doSearch = (v) => { setSearch(v); setPage(1); };
  const doCat = (c) => { setActiveCat(c); setPage(1); };
  const doFilter = (f) => { setFilterMode(f); setPage(1); };
  const goPage = (p) => { setPage(p); gridRef.current?.scrollIntoView({ behavior: "smooth", block: "start" }); };

  const surprise = () => {
    const pool = filtered.filter(i => !done[i.id]);
    if (!pool.length) return;
    setModalIdea(pool[Math.floor(Math.random() * pool.length)]);
  };

  return (
    <ThemeCtx.Provider value={dark}>
    <div style={{
      minHeight: "100vh",
      background: dark ? "#08090d" : "linear-gradient(135deg, #eef1f8 0%, #e4eaf5 100%)",
      fontFamily: "'Google Sans', 'DM Sans', system-ui, sans-serif",
      color: dark ? "rgba(255,255,255,0.88)" : "rgba(10,15,25,0.88)",
    }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Google+Sans:wght@400;500;700&display=swap');
        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
        ::-webkit-scrollbar { width: 5px; background: transparent; }
        ::-webkit-scrollbar-thumb { background: rgba(128,128,128,0.2); border-radius: 99px; }
        button { font-family: inherit; cursor: pointer; }
        input { font-family: inherit; }
        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(12px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes pulse {
          0%,100% { opacity: 1; } 50% { opacity: 0.6; }
        }
        .glass-btn {
          background: ${dark ? "rgba(255,255,255,0.05)" : "rgba(255,255,255,0.7)"};
          border: 1px solid ${dark ? "rgba(255,255,255,0.1)" : "rgba(0,0,0,0.1)"};
          border-radius: 10px;
          color: ${dark ? "rgba(255,255,255,0.6)" : "rgba(10,15,25,0.6)"};
          padding: 7px 14px;
          font-size: 12px;
          font-weight: 500;
          transition: all 0.15s;
          letter-spacing: 0.3px;
        }
        .glass-btn:hover {
          background: ${dark ? "rgba(255,255,255,0.09)" : "rgba(255,255,255,0.9)"};
          color: ${dark ? "rgba(255,255,255,0.85)" : "rgba(10,15,25,0.9)"};
          border-color: ${dark ? "rgba(255,255,255,0.18)" : "rgba(0,0,0,0.18)"};
        }
        .glass-btn.active {
          background: ${dark ? "rgba(255,255,255,0.1)" : "rgba(255,255,255,0.95)"};
          color: ${dark ? "rgba(255,255,255,0.92)" : "rgba(10,15,25,0.95)"};
          border-color: ${dark ? "rgba(255,255,255,0.25)" : "rgba(0,0,0,0.22)"};
        }
      `}</style>

      {/* ── HEADER ── */}
      <div style={{ maxWidth: 1440, margin: "0 auto", padding: "56px 28px 0" }}>
        {/* Glow orbs */}
        <div style={{ position: "fixed", top: -80, left: "10%", width: 500, height: 500, borderRadius: "50%", background: `radial-gradient(circle, hsla(200,80%,50%,${dark ? 0.06 : 0.09}) 0%, transparent 70%)`, pointerEvents: "none" }} />
        <div style={{ position: "fixed", top: -60, right: "5%", width: 400, height: 400, borderRadius: "50%", background: `radial-gradient(circle, hsla(270,70%,60%,${dark ? 0.05 : 0.07}) 0%, transparent 70%)`, pointerEvents: "none" }} />

        <div style={{ maxWidth: 680, marginBottom: 48 }}>
          <div style={{
            display: "inline-flex", alignItems: "center", gap: 6,
            fontSize: 11, fontWeight: 600, letterSpacing: "1.5px", textTransform: "uppercase",
            color: dark ? "hsl(200,70%,65%)" : "hsl(200,65%,38%)",
            background: dark ? "hsla(200,70%,55%,0.1)" : "hsla(200,65%,50%,0.12)",
            border: dark ? "1px solid hsla(200,70%,55%,0.2)" : "1px solid hsla(200,65%,45%,0.25)",
            borderRadius: 20, padding: "4px 12px", marginBottom: 20,
          }}>
            🚫 The Antislump Collection
          </div>
          <h1 style={{
            fontSize: "clamp(28px, 5vw, 52px)", fontWeight: 700,
            lineHeight: 1.1, letterSpacing: "-1.5px", marginBottom: 18,
            ...(dark ? {
              background: "linear-gradient(135deg, rgba(255,255,255,0.95) 0%, rgba(255,255,255,0.45) 100%)",
              WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent",
            } : {
              color: "rgba(10,15,25,0.90)",
            }),
          }}>
            1000+ mini-projects to help you get out of your slump.
          </h1>
          <p style={{ fontSize: 17, lineHeight: 1.65, color: dark ? "rgba(255,255,255,0.42)" : "rgba(10,15,25,0.48)", maxWidth: 520, marginBottom: 16 }}>
            In a rut? Small wins from mini-projects build momentum. Momentum builds everything else.
          </p>
          <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "flex", flexDirection: "column", gap: 5 }}>
            {["Doable in under 1 hour.", "Tangible outputs.", "Little to no cost."].map(text => (
              <li key={text} style={{ display: "flex", alignItems: "center", gap: 7, fontSize: 12, color: dark ? "rgba(255,255,255,0.38)" : "rgba(10,15,25,0.45)" }}>
                <span style={{ color: "hsl(155,65%,48%)", fontSize: 13, lineHeight: 1 }}>✓</span>
                {text}
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* ── STICKY CONTROLS ── */}
      <div style={{
        position: "sticky", top: 0, zIndex: 100,
        background: dark ? "rgba(8,9,13,0.90)" : "rgba(238,241,248,0.92)",
        backdropFilter: "blur(24px)",
        borderBottom: dark ? "1px solid rgba(255,255,255,0.05)" : "1px solid rgba(0,0,0,0.07)",
      }}>
        {/* Thin progress bar pinned at very top */}
        {storageReady && (
          <div style={{ height: 3, background: dark ? "rgba(255,255,255,0.04)" : "rgba(0,0,0,0.06)" }}>
            <div style={{
              height: "100%", width: `${pct}%`,
              background: "linear-gradient(90deg, hsl(200,70%,55%), hsl(155,70%,55%))",
              transition: "width 0.5s ease",
            }} />
          </div>
        )}
        <div style={{ maxWidth: 1440, margin: "0 auto", padding: "10px 28px" }}>
          {/* Row 1: search + filter + surprise + progress count + theme toggle */}
          <div style={{ display: "flex", gap: 8, flexWrap: "wrap", alignItems: "center", marginBottom: 8 }}>
            <div style={{ position: "relative", flex: "1 1 200px", maxWidth: 340 }}>
              <span style={{ position: "absolute", left: 12, top: "50%", transform: "translateY(-50%)", fontSize: 14, color: dark ? "rgba(255,255,255,0.25)" : "rgba(0,0,0,0.28)", pointerEvents: "none" }}>⌕</span>
              <input
                value={search}
                onChange={e => doSearch(e.target.value)}
                placeholder="Search ideas, categories…"
                style={{
                  width: "100%",
                  background: dark ? "rgba(255,255,255,0.05)" : "rgba(255,255,255,0.75)",
                  border: dark ? "1px solid rgba(255,255,255,0.09)" : "1px solid rgba(0,0,0,0.1)",
                  borderRadius: 10,
                  padding: "8px 12px 8px 34px", fontSize: 13,
                  color: dark ? "rgba(255,255,255,0.85)" : "rgba(10,15,25,0.85)",
                  outline: "none",
                  transition: "border-color 0.2s",
                }}
                onFocus={e => e.target.style.borderColor = dark ? "rgba(255,255,255,0.22)" : "rgba(0,0,0,0.25)"}
                onBlur={e => e.target.style.borderColor = dark ? "rgba(255,255,255,0.09)" : "rgba(0,0,0,0.1)"}
              />
            </div>
            {/* Filter pills */}
            {[["all","All"],["todo","To Do"],["done","✓ Done"]].map(([v,l]) => (
              <button key={v} onClick={() => doFilter(v)}
                className={`glass-btn ${filterMode === v ? "active" : ""}`}
              >{l}</button>
            ))}
            <button
              onClick={surprise}
              style={{
                background: "linear-gradient(135deg, hsla(200,70%,55%,0.18), hsla(270,70%,60%,0.15))",
                border: "1px solid hsla(200,70%,55%,0.3)",
                borderRadius: 10, padding: "8px 18px", fontSize: 13, fontWeight: 600,
                color: dark ? "rgba(255,255,255,0.85)" : "rgba(10,15,25,0.85)",
                transition: "all 0.15s",
              }}
            >✦ Surprise Me</button>
            {storageReady && (
              <div style={{ fontSize: 11, color: dark ? "rgba(255,255,255,0.35)" : "rgba(10,15,25,0.45)", display: "flex", alignItems: "center", gap: 6 }}>
                <span style={{ fontWeight: 700, color: "hsl(155,65%,48%)" }}>{doneCount}</span>
                <span>/ {ALL_IDEAS.length} · {pct}%</span>
              </div>
            )}
            <div style={{ marginLeft: "auto", display: "flex", alignItems: "center", gap: 8 }}>
              <div style={{ fontSize: 11, color: dark ? "rgba(255,255,255,0.22)" : "rgba(10,15,25,0.35)", letterSpacing: "0.3px" }}>
                {filtered.length.toLocaleString()} ideas
              </div>
              {/* View toggle */}
              <div style={{
                display: "flex", borderRadius: 8, overflow: "hidden",
                border: dark ? "1px solid rgba(255,255,255,0.1)" : "1px solid rgba(0,0,0,0.1)",
              }}>
                {[["card","⊞"],["list","☰"]].map(([mode, icon]) => (
                  <button
                    key={mode}
                    onClick={() => setViewMode(mode)}
                    title={mode === "card" ? "Card view" : "List view"}
                    style={{
                      background: viewMode === mode
                        ? (dark ? "rgba(255,255,255,0.12)" : "rgba(255,255,255,0.95)")
                        : (dark ? "rgba(255,255,255,0.03)" : "rgba(255,255,255,0.5)"),
                      border: "none", padding: "6px 10px", fontSize: 15,
                      color: viewMode === mode
                        ? (dark ? "rgba(255,255,255,0.9)" : "rgba(10,15,25,0.9)")
                        : (dark ? "rgba(255,255,255,0.35)" : "rgba(10,15,25,0.4)"),
                      transition: "all 0.15s", lineHeight: 1,
                    }}
                  >{icon}</button>
                ))}
              </div>
              <button
                onClick={toggleDark}
                title={dark ? "Switch to light mode" : "Switch to dark mode"}
                style={{
                  background: dark ? "rgba(255,255,255,0.07)" : "rgba(255,255,255,0.75)",
                  border: dark ? "1px solid rgba(255,255,255,0.12)" : "1px solid rgba(0,0,0,0.12)",
                  borderRadius: 8, padding: "6px 10px", fontSize: 14,
                  transition: "all 0.15s", lineHeight: 1,
                }}
              >{dark ? "☀️" : "🌙"}</button>
            </div>
          </div>
          {/* Row 2: category pills (collapsible) */}
          <div>
            <button
              onClick={() => setCatsOpen(o => !o)}
              style={{
                display: "flex", alignItems: "center", gap: 6,
                background: "none", border: "none", padding: "2px 0 6px",
                fontSize: 11, fontWeight: 500, letterSpacing: "0.3px",
                color: dark ? "rgba(255,255,255,0.35)" : "rgba(10,15,25,0.4)",
                cursor: "pointer",
              }}
            >
              <span style={{
                display: "inline-block",
                transform: catsOpen ? "rotate(90deg)" : "rotate(0deg)",
                transition: "transform 0.2s",
                fontSize: 9,
              }}>▶</span>
              {catsOpen ? "Hide categories" : `Filter by category${activeCat !== "All" ? ` · ${CAT_CONFIG[activeCat]?.icon ?? ""} ${activeCat}` : ""}`}
            </button>
            {catsOpen && (
              <div style={{ display: "flex", gap: 5, flexWrap: "wrap", paddingBottom: 4 }}>
                {ALL_CATS.map(c => {
                  const cc = dark ? catColor : catColorL;
                  const cb = dark ? catBg : catBgL;
                  const active = activeCat === c;
                  const col = c === "All" ? (dark ? "rgba(255,255,255,0.55)" : "rgba(10,15,25,0.6)") : cc(c);
                  const cb2 = c === "All" ? (dark ? "rgba(255,255,255,0.06)" : "rgba(0,0,0,0.05)") : cb(c, 0.12);
                  const border = c === "All" ? (dark ? "rgba(255,255,255,0.12)" : "rgba(0,0,0,0.12)") : cc(c, 0.22);
                  return (
                    <button
                      key={c}
                      onClick={() => { doCat(c); setCatsOpen(false); }}
                      style={{
                        background: active
                          ? (c === "All" ? (dark ? "rgba(255,255,255,0.1)" : "rgba(255,255,255,0.85)") : cb(c, 0.2))
                          : (dark ? "rgba(255,255,255,0.03)" : "rgba(255,255,255,0.5)"),
                        border: `1px solid ${active ? border : (dark ? "rgba(255,255,255,0.06)" : "rgba(0,0,0,0.06)")}`,
                        borderRadius: 8, padding: "4px 11px",
                        fontSize: 11, fontWeight: active ? 600 : 400,
                        color: active ? col : (dark ? "rgba(255,255,255,0.35)" : "rgba(10,15,25,0.4)"),
                        transition: "all 0.14s",
                        letterSpacing: "0.3px",
                        display: "flex", alignItems: "center", gap: 4,
                      }}
                    >
                      {CAT_CONFIG[c]?.icon && <span>{CAT_CONFIG[c].icon}</span>}
                      {c}
                    </button>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* ── GRID ── */}
      <div ref={gridRef} style={{ maxWidth: 1440, margin: "0 auto", padding: "24px 28px 60px" }}>
        {pageItems.length === 0 ? (
          <div style={{ textAlign: "center", padding: "100px 0", color: dark ? "rgba(255,255,255,0.2)" : "rgba(10,15,25,0.3)" }}>
            <div style={{ fontSize: 48, marginBottom: 12 }}>🌌</div>
            <div style={{ fontSize: 16 }}>No ideas match. Try a different filter.</div>
          </div>
        ) : viewMode === "card" ? (
          <div style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
            gap: 10,
          }}>
            {pageItems.map((idea, idx) => (
              <IdeaCard
                key={idea.id}
                idea={idea}
                done={!!done[idea.id]}
                onToggle={() => persistToggle(idea.id)}
                delay={Math.min(idx * 18, 200)}
              />
            ))}
          </div>
        ) : (
          <div style={{
            borderRadius: 14, overflow: "hidden",
            border: dark ? "1px solid rgba(255,255,255,0.07)" : "1px solid rgba(0,0,0,0.07)",
            background: dark ? "rgba(255,255,255,0.02)" : "rgba(255,255,255,0.5)",
            backdropFilter: "blur(14px)",
          }}>
            {pageItems.map((idea, idx) => (
              <IdeaRow
                key={idea.id}
                idea={idea}
                done={!!done[idea.id]}
                onToggle={() => persistToggle(idea.id)}
                idx={idx}
              />
            ))}
          </div>
        )}

        {/* ── PAGINATION ── */}
        {totalPages > 1 && (
          <div style={{ display: "flex", gap: 6, justifyContent: "center", marginTop: 36, flexWrap: "wrap" }}>
            <button
              className="glass-btn"
              onClick={() => goPage(Math.max(1, currentPage - 1))}
              disabled={currentPage === 1}
              style={{ opacity: currentPage === 1 ? 0.35 : 1 }}
            >← Prev</button>

            {Array.from({ length: Math.min(9, totalPages) }, (_, i) => {
              let p;
              if (totalPages <= 9) { p = i + 1; }
              else if (currentPage <= 5) { p = i + 1; }
              else if (currentPage >= totalPages - 4) { p = totalPages - 8 + i; }
              else { p = currentPage - 4 + i; }
              return (
                <button
                  key={p}
                  onClick={() => goPage(p)}
                  className={`glass-btn ${p === currentPage ? "active" : ""}`}
                  style={{ minWidth: 36, padding: "7px 10px" }}
                >{p}</button>
              );
            })}

            <button
              className="glass-btn"
              onClick={() => goPage(Math.min(totalPages, currentPage + 1))}
              disabled={currentPage === totalPages}
              style={{ opacity: currentPage === totalPages ? 0.35 : 1 }}
            >Next →</button>
          </div>
        )}

        <div style={{ textAlign: "center", marginTop: 48, fontSize: 12 }}>
          <a
            href="https://murto.co"
            target="_blank"
            rel="noopener noreferrer"
            style={{
              color: dark ? "rgba(255,255,255,0.22)" : "rgba(10,15,25,0.3)",
              textDecoration: "none",
              transition: "color 0.15s",
            }}
            onMouseEnter={e => e.target.style.color = dark ? "rgba(255,255,255,0.55)" : "rgba(10,15,25,0.6)"}
            onMouseLeave={e => e.target.style.color = dark ? "rgba(255,255,255,0.22)" : "rgba(10,15,25,0.3)"}
          >
            A mini-project by Murto Hilali
          </a>
        </div>
      </div>

      {/* ── MODAL ── */}
      {modalIdea && (
        <SurpriseModal
          idea={modalIdea}
          done={!!done[modalIdea.id]}
          onToggle={() => persistToggle(modalIdea.id)}
          onClose={() => setModalIdea(null)}
          onNext={() => {
            const pool = filtered.filter(i => !done[i.id] && i.id !== modalIdea.id);
            if (pool.length) setModalIdea(pool[Math.floor(Math.random() * pool.length)]);
          }}
        />
      )}
    </div>
    </ThemeCtx.Provider>
  );
}
