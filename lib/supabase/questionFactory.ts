export type GeneratedPick={question:string;choices:string[];category:string;expiresMinutes:number};
const bank:GeneratedPick[]=[
{question:"You get $10,000, but it must be spent by midnight. What's your move?",choices:["Travel","Buy something big","Give some away","Experiences"],category:"Hypothetical",expiresMinutes:1440},
{question:"You can instantly master one ability. Pick it.",choices:["Any language","Any instrument","Cooking","Public speaking"],category:"Hypothetical",expiresMinutes:1440},
{question:"You can teleport once right now. Where are you going?",choices:["Beach","Big city","Mountains","Another country"],category:"Travel",expiresMinutes:1440},
{question:"You unexpectedly get a completely free day. What's first?",choices:["Sleep","Go somewhere","See friends","Do nothing"],category:"Everyday",expiresMinutes:1440},
{question:"Which small inconvenience would you erase forever?",choices:["Traffic","Waiting in lines","Spam calls","Slow Wi-Fi"],category:"Everyday",expiresMinutes:1440},
{question:"One late-night food survives. What's staying?",choices:["Pizza","Tacos","Wings","Burgers"],category:"Food",expiresMinutes:1440},
{question:"You're ordering for the whole table. What wins?",choices:["Pizza","Tacos","Chinese","BBQ"],category:"Food",expiresMinutes:1440},
{question:"Which matters most on a first date?",choices:["Conversation","Chemistry","Humor","How they treat people"],category:"Dating",expiresMinutes:1440},
{question:"Pick the strongest green flag.",choices:["Consistency","Humor","Ambition","Kindness"],category:"Dating",expiresMinutes:1440},
{question:"You can attend one for free tonight. Pick it.",choices:["Concert","Comedy show","Sports game","Festival"],category:"Entertainment",expiresMinutes:1440},
{question:"You get one entertainment subscription free forever.",choices:["Movies & TV","Music","Gaming","Live events"],category:"Entertainment",expiresMinutes:1440},
{question:"You find an extra $500 in your budget. What's the move?",choices:["Save it","Pay debt","Invest it","Enjoy it"],category:"Money",expiresMinutes:1440},
{question:"Pick one financial superpower.",choices:["Never pay rent","Free groceries","Free travel","No car costs"],category:"Money",expiresMinutes:1440},
{question:"Your next phone gets one perfect feature. Pick it.",choices:["Battery","Camera","Signal everywhere","Indestructible"],category:"Tech",expiresMinutes:1440},
{question:"You can keep only one device for a month.",choices:["Phone","Laptop","Tablet","TV"],category:"Tech",expiresMinutes:1440},
{question:"You get one wardrobe upgrade for free.",choices:["Shoes","Jackets","Everyday basics","Accessories"],category:"Style",expiresMinutes:1440},
{question:"For 24 hours, one rule disappears. Pick it.",choices:["No sleep needed","No traffic","Everything is free","No waiting"],category:"Wildcard",expiresMinutes:1440},
{question:"You wake up with one strange advantage.",choices:["Perfect luck","Perfect memory","Never get tired","Always know the time"],category:"Wildcard",expiresMinutes:1440}
];
export function generateCandidates(count=12){return [...bank].sort(()=>Math.random()-.5).slice(0,count)}
