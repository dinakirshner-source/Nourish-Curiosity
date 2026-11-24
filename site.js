// Edit this file to change your name, bio, projects and seasons.
export const SITE = {
  name: 'Dina',
  title: 'Inside my head',
  bio: [
    "Hello. I'm Dina, a product marketer based in New York[1].",
    "By day I lead product marketing at Tubi. The rest of the time I follow my curiosity[2], and this site is my working notebook of what I'm reading, making and wondering about.",
    "Right now that's Nourish Curiosity[3], a self-directed residency in Copenhagen across four subjects that disagree with each other.",
    "Come in, look around, and take what is useful."
  ],
  notes: [
    "Lead Product Marketing Manager at Tubi, working where story, product and audience meet.",
    "My day job uses one set of skills; my curiosity goes further. This site is where the rest gets to play.",
    "Behavioural economics, civil engineering, systems thinking, and aesthetics, taste and cultural capital. See Projects."
  ]
}
// Add a project here and it appears under Projects.
export const PROJECTS = [
  { id: 'nourish', title: 'Nourish Curiosity', status: 'Open season', blurb: 'A self-directed intellectual residency in Copenhagen. Each season I take on one subject through readings, fieldwork and making.' }
]
// One season = one subject (index into SUBJECTS in curriculum.js). Add a line each quarter.
export const SEASONS = [
  { name: 'Season One', subject: 0 },
  { name: 'Season Two', subject: 1 },
  { name: 'Season Three', subject: 2 },
  { name: 'Season Four', subject: 3 }
]
