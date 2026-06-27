/* Gobblr seed data — turkey profiles.
 * Photos are free-to-use stock from Pexels (Pexels License), self-hosted under
 * images/<id>.jpeg. If a photo fails to load, app.js swaps in a generated
 * turkey-glyph fallback so the grid never breaks. */

const px = (id) => `images/${id}.jpeg`;

const TRIBES = [
  "Tom", "Hen", "Jake", "Jenny", "Heritage", "Wild",
  "Broad-Breasted", "Free-Range", "Bourbon Red", "Slate", "Bronze",
];

const LOOKING_FOR = [
  "Roosting buddies", "Strut partners", "Cornfield dates",
  "Long gobbles & friendship", "Free-range fun", "Flock-mates",
  "Networking", "Right now",
];

// id pools from Pexels turkey search
const PHOTOS = {
  gus:        [7525058, 12043816],
  henrietta:  [14104539, 10054607],
  ralph:      [14104536, 13051235],
  butterball: [18243057, 20282027],
  maple:      [34623942, 32154942],
  drumstick:  [13931845, 32154943],
  gizzard:    [30392225, 9328849],
  cornelius:  [29029194, 27174105],
  wattlda:    [8552654, 31853589],
  bronson:    [32154953, 4734931],
  feathers:   [31853587, 15895025],
  giblet:     [12001576, 32154952],
  plucky:     [31853586, 9890545],
  tom:        [18530838, 24507154],
};

const TURKEYS = [
  {
    id: "gus", name: "Gus Gobbler", age: 4, online: true, dist: 0.2,
    tribe: "Tom", height: "3'9\"", weight: "24 lbs", wattle: "Crimson",
    headline: "Big strut energy. Will trade corn for compliments.",
    bio: "Heritage tom, fully free-range. I gobble before noon and I will not apologize. Looking for someone to share a dust bath and watch the sun set over the silo. No city pigeons.",
    looking: ["Strut partners", "Cornfield dates", "Long gobbles & friendship"],
    stats: { Strut: "Elite", Plumage: "Iridescent", Roost: "High branch", Gobble: "Baritone" },
    photos: PHOTOS.gus,
  },
  {
    id: "henrietta", name: "Henrietta", age: 3, online: true, dist: 0.4,
    tribe: "Hen", height: "2'8\"", weight: "11 lbs", wattle: "Soft pink",
    headline: "Nest-builder. Foodie (literally, I am food-motivated).",
    bio: "Quietly confident hen who knows the best foraging spots within a 3-mile range. Swipe if you can keep up on a morning scratch-about. Allergic to drama and foxes.",
    looking: ["Roosting buddies", "Flock-mates"],
    stats: { Strut: "Subtle", Plumage: "Warm bronze", Roost: "Low & cozy", Gobble: "Melodic" },
    photos: PHOTOS.henrietta,
  },
  {
    id: "ralph", name: "Ralph", age: 5, online: false, last: "12 gobbles ago", dist: 0.7,
    tribe: "Wild", height: "4'1\"", weight: "21 lbs", wattle: "Royal blue & red",
    headline: "Wild-caught. Emotionally available. Mostly.",
    bio: "Spent my whole life in the back forty and I like it that way. Green-field guy, big on long walks that are technically just looking for bugs together.",
    looking: ["Free-range fun", "Strut partners"],
    stats: { Strut: "Untamed", Plumage: "Field camo", Roost: "Oak, third limb", Gobble: "Echoing" },
    photos: PHOTOS.ralph,
  },
  {
    id: "butterball", name: "Butterball", age: 2, online: true, dist: 1.1,
    tribe: "Broad-Breasted", height: "3'2\"", weight: "38 lbs", wattle: "Generous",
    headline: "Thicc. Warm. A whole snack (not literally, please).",
    bio: "Yes the name is a lot. No I don't want to talk about November. Looking for a flock that values personality over portion size. I give great wing-hugs.",
    looking: ["Roosting buddies", "Long gobbles & friendship"],
    stats: { Strut: "Deliberate", Plumage: "Snow white", Roost: "Ground floor", Gobble: "Resonant" },
    photos: PHOTOS.butterball,
  },
  {
    id: "maple", name: "Maple", age: 3, online: true, dist: 1.4,
    tribe: "Bourbon Red", height: "3'0\"", weight: "14 lbs", wattle: "Deep red",
    headline: "Autumn personified. Pumpkin-spice but make it sincere.",
    bio: "Bourbon Red hen with a thing for crunchy leaves and golden hour. I'll bring the acorns if you bring the conversation. Romantic but will absolutely out-forage you.",
    looking: ["Cornfield dates", "Flock-mates"],
    stats: { Strut: "Graceful", Plumage: "Russet & gold", Roost: "Maple, naturally", Gobble: "Sweet" },
    photos: PHOTOS.maple,
  },
  {
    id: "drumstick", name: "Drumstick", age: 4, online: false, last: "an hour ago", dist: 1.9,
    tribe: "Jake", height: "3'5\"", weight: "18 lbs", wattle: "Maturing",
    headline: "Young jake, big dreams, questionable strut technique.",
    bio: "Still working on the fan display but the heart's in the right place. Gym turkey (I run from the dog daily). Looking for someone patient and into cardio.",
    looking: ["Right now", "Free-range fun"],
    stats: { Strut: "In progress", Plumage: "Glossy", Roost: "Wherever", Gobble: "Cracking" },
    photos: PHOTOS.drumstick,
  },
  {
    id: "gizzard", name: "Gizzard", age: 6, online: true, dist: 2.3,
    tribe: "Slate", height: "3'7\"", weight: "20 lbs", wattle: "Slate-blue",
    headline: "Old soul. Knows every fence-gap in the county.",
    bio: "Distinguished slate gentleman. I've seen things (mostly tractors). Looking for someone to grow old and molt with. Sapiosexual — impress me with your worm knowledge.",
    looking: ["Long gobbles & friendship", "Roosting buddies"],
    stats: { Strut: "Stately", Plumage: "Smoke grey", Roost: "Heritage barn", Gobble: "Weathered" },
    photos: PHOTOS.gizzard,
  },
  {
    id: "cornelius", name: "Cornelius", age: 3, online: true, dist: 2.8,
    tribe: "Heritage", height: "3'3\"", weight: "16 lbs", wattle: "Classic red",
    headline: "Heritage breed, modern values. Reads books (pecks at them).",
    bio: "Pedigree without the ego. I value good fences and better boundaries. Looking for a co-parent for 14 eggs, give or take. Must love mud.",
    looking: ["Flock-mates", "Networking"],
    stats: { Strut: "Refined", Plumage: "Heritage bronze", Roost: "Restored coop", Gobble: "Articulate" },
    photos: PHOTOS.cornelius,
  },
  {
    id: "wattlda", name: "WattleDaddy", age: 5, online: false, last: "yesterday", dist: 3.4,
    tribe: "Tom", height: "4'0\"", weight: "26 lbs", wattle: "Legendary",
    headline: "The wattle speaks for itself. Confidence not included separately.",
    bio: "Look, the username is bold and so am I. Alpha of the north pasture. Swipe if you can handle a tom who peaks at 5am. Snood game unmatched.",
    looking: ["Right now", "Strut partners"],
    stats: { Strut: "Dominant", Plumage: "Blue-black sheen", Roost: "Tallest pine", Gobble: "Thunderous" },
    photos: PHOTOS.wattlda,
  },
  {
    id: "bronson", name: "Bronson", age: 4, online: true, dist: 4.0,
    tribe: "Bronze", height: "3'8\"", weight: "22 lbs", wattle: "Burnished",
    headline: "Bronze and beautiful. Low drama, high preen.",
    bio: "Standard Bronze, non-standard charm. Into sunrise struts, shared grit, and not being anyone's centerpiece. Let's keep it casual and free-range.",
    looking: ["Free-range fun", "Cornfield dates"],
    stats: { Strut: "Smooth", Plumage: "Metallic bronze", Roost: "South fence", Gobble: "Rich" },
    photos: PHOTOS.bronson,
  },
  {
    id: "feathers", name: "Feathers McGraw", age: 3, online: true, dist: 4.6,
    tribe: "Free-Range", height: "3'1\"", weight: "13 lbs", wattle: "Understated",
    headline: "Mysterious. Possibly a criminal mastermind. Great preener.",
    bio: "I don't say much but my plumage does the talking. Independent free-ranger, allergic to coops and commitment-shaming. Disappear into the corn with me.",
    looking: ["Right now", "Free-range fun"],
    stats: { Strut: "Calculated", Plumage: "Sleek charcoal", Roost: "Undisclosed", Gobble: "Rare" },
    photos: PHOTOS.feathers,
  },
  {
    id: "giblet", name: "Giblet", age: 2, online: false, last: "3 hours ago", dist: 5.5,
    tribe: "Jenny", height: "2'6\"", weight: "9 lbs", wattle: "Petite pink",
    headline: "Smol but mighty. Will fight a hawk for you.",
    bio: "Tiny jenny, enormous personality. New to the flock and looking to make friends before anything serious. I peck first and ask questions later, sorry in advance.",
    looking: ["Flock-mates", "Networking"],
    stats: { Strut: "Bouncy", Plumage: "Speckled cream", Roost: "Hay bale", Gobble: "Chirpy" },
    photos: PHOTOS.giblet,
  },
  {
    id: "plucky", name: "Plucky", age: 4, online: true, dist: 6.2,
    tribe: "Wild", height: "3'9\"", weight: "19 lbs", wattle: "Vivid",
    headline: "Survivor of two Thanksgivings. Living every day like it counts.",
    bio: "I've outrun the farmer and I'll outrun your red flags too. Adventurous, a little feral, deeply loyal once you're in my flock. Bring snacks and good intentions.",
    looking: ["Strut partners", "Long gobbles & friendship"],
    stats: { Strut: "Fearless", Plumage: "Wild bronze", Roost: "Deep woods", Gobble: "Bold" },
    photos: PHOTOS.plucky,
  },
  {
    id: "tom", name: "Tom Featherton III", age: 7, online: false, last: "2 days ago", dist: 8.1,
    tribe: "Heritage", height: "4'2\"", weight: "27 lbs", wattle: "Aristocratic",
    headline: "Old money plumage. Looking for my Hen-in-waiting.",
    bio: "Third-generation heritage tom from the estate flock. Seeking elegance, a firm grip on perch etiquette, and someone who appreciates a slow, deliberate fan display. No jakes.",
    looking: ["Long gobbles & friendship", "Networking"],
    stats: { Strut: "Regal", Plumage: "Estate bronze", Roost: "Manor cupola", Gobble: "Dignified" },
    photos: PHOTOS.tom,
  },
];

// Your own profile
const ME = {
  id: "me", name: "You", age: 3, tribe: "Free-Range", dist: 0,
  height: "3'4\"", weight: "15 lbs", wattle: "Showing promise",
  headline: "New to Gobblr. Be gentle, I'm fresh out of the egg.",
  bio: "Just a turkey trying to find my flock. Add a photo and a bio to start getting gobbles!",
  looking: ["Flock-mates", "Long gobbles & friendship"],
  stats: { Strut: "Developing", Plumage: "TBD", Roost: "Open to offers", Gobble: "Practicing" },
  photos: [14104539],
};

// Conversations
const CHATS = [
  {
    with: "henrietta", unread: 2,
    messages: [
      { from: "them", text: "okay your strut in photo 2 is unreal 😍", t: "9:02 AM" },
      { from: "me", text: "ha appreciate it, took 40 takes and a lot of corn", t: "9:04 AM" },
      { from: "them", text: "lol relatable. forage date this weekend?", t: "9:05 AM" },
      { from: "them", text: "i know a field with PREMIUM grubs", t: "9:05 AM" },
    ],
  },
  {
    with: "gus", unread: 0,
    messages: [
      { from: "them", text: "Gobble gobble 🦃", t: "Yesterday" },
      { from: "me", text: "smooth opener tbh", t: "Yesterday" },
      { from: "them", text: "it's the only line I've got but it works 60% of the time, every time", t: "Yesterday" },
    ],
  },
  {
    with: "maple", unread: 1,
    messages: [
      { from: "them", text: "leaves are crunchy today. thinking of you.", t: "8:40 AM" },
    ],
  },
  {
    with: "plucky", unread: 0,
    messages: [
      { from: "me", text: "two thanksgivings?? you're a legend", t: "Mon" },
      { from: "them", text: "i contain multitudes (and stuffing-adjacent trauma)", t: "Mon" },
      { from: "me", text: "😂 drinks at the waterer?", t: "Mon" },
      { from: "them", text: "say less. 6pm by the trough", t: "Mon" },
    ],
  },
];

// Who gobbled (tapped) you
const GOBBLES = ["wattlda", "drumstick", "bronson", "feathers", "giblet"];
