export interface WordMeaning {
  roman: string;
  english: string;
}

// Tamil word → meaning. Includes base forms AND common inflected/compound forms
// that appear throughout the Thirumanthiram.
export const WORD_LOOKUP: Record<string, WordMeaning> = {

  // ═══════════════════════════════════════════════════════
  // NUMBERS — base forms and compounds from the verse texts
  // ═══════════════════════════════════════════════════════
  'ஒன்று':           { roman: 'oṉṟu',        english: 'one' },
  'ஒன்றவன்':         { roman: 'oṉṟavaṉ',     english: 'the One (Shiva)' },
  'ஒன்றே':           { roman: 'oṉṟē',        english: 'only one' },
  'ஒன்றினுள்':       { roman: 'oṉṟiṉuḷ',    english: 'within the one' },
  'ஒன்றுமில்':       { roman: 'oṉṟumil',     english: 'none at all' },
  'இரண்டு':          { roman: 'iraṇṭu',      english: 'two' },
  'இரண்டவன்':        { roman: 'iraṇṭavaṉ',   english: 'He who is Two' },
  'இரண்டே':          { roman: 'iraṇṭē',      english: 'only two' },
  'மூன்று':          { roman: 'mūṉṟu',       english: 'three' },
  'மூன்றினுள்':      { roman: 'mūṉṟiṉuḷ',   english: 'within the three' },
  'மூன்றுமாய்':      { roman: 'mūṉṟumāy',    english: 'being all three' },
  'நான்கு':          { roman: 'nāṉku',       english: 'four' },
  'நான்கும்':        { roman: 'nāṉkum',      english: 'the four (also)' },
  'நான்குணர்ந்':     { roman: 'nāṉkuṇarn',   english: 'knowing the four' },
  'ஐந்து':           { roman: 'aintu',        english: 'five' },
  'ஐந்தும்':         { roman: 'aintum',       english: 'all five' },
  'தான்ஐந்து':       { roman: 'tāṉaintu',    english: 'He [and] the five' },
  'ஆறு':             { roman: 'āṟu',          english: 'six' },
  'ஆறும்':           { roman: 'āṟum',         english: 'all six' },
  'ஏழு':             { roman: 'ēḻu',          english: 'seven' },
  'ஏழும்':           { roman: 'ēḻum',         english: 'all seven' },
  'ஏழும்பர்':        { roman: 'ēḻumpar',      english: 'seven heavens' },
  'ஏழும்பர்ச்':      { roman: 'ēḻumparc',     english: 'seven heavens (sandhi)' },
  'ஏழுலகு':         { roman: 'ēḻulaku',      english: 'seven worlds' },
  'எட்டு':           { roman: 'eṭṭu',         english: 'eight' },
  'தெட்டே':          { roman: 'teṭṭē',        english: 'the eight' },
  'எட்டும்':         { roman: 'eṭṭum',        english: 'all eight' },
  'ஒன்பது':          { roman: 'oṉpatu',       english: 'nine' },
  'பத்து':           { roman: 'pattu',         english: 'ten' },
  'நூறு':            { roman: 'nūṟu',         english: 'hundred' },
  'ஆயிரம்':          { roman: 'āyiram',        english: 'thousand' },

  // ═══════════════════════════════════════════════════════
  // PRONOUNS & DEMONSTRATIVES
  // ═══════════════════════════════════════════════════════
  'தான்':            { roman: 'tāṉ',          english: 'self / himself' },
  'தானே':            { roman: 'tāṉē',         english: 'He Himself / alone' },
  'தானும்':          { roman: 'tāṉum',        english: 'himself also' },
  'தானிருந்':        { roman: 'tāṉirun',      english: 'He remained' },
  'தான்உணர்ந்':      { roman: 'tāṉuṇarn',     english: 'He realised' },
  'நான்':            { roman: 'nāṉ',          english: 'I' },
  'என்':             { roman: 'eṉ',           english: 'my' },
  'என்னை':           { roman: 'eṉṉai',        english: 'me' },
  'எனக்கு':          { roman: 'eṉakku',       english: 'to me' },
  'எனது':            { roman: 'eṉatu',        english: 'mine' },
  'நீ':              { roman: 'nī',            english: 'you' },
  'உன்':             { roman: 'uṉ',           english: 'your' },
  'உனக்கு':          { roman: 'uṉakku',       english: 'to you' },
  'உன்னை':           { roman: 'uṉṉai',        english: 'you (acc.)' },
  'நீர்':            { roman: 'nīr',           english: 'you (hon.) / water' },
  'நாம்':            { roman: 'nām',           english: 'we' },
  'நமக்கு':          { roman: 'namakku',       english: 'to us' },
  'அவன்':            { roman: 'avaṉ',          english: 'he / him' },
  'அவனே':            { roman: 'avaṉē',         english: 'He alone' },
  'அவனுக்கு':        { roman: 'avaṉukku',      english: 'to him' },
  'அவள்':            { roman: 'avaḷ',          english: 'she / her' },
  'அவர்':            { roman: 'avar',          english: 'he / they (hon.)' },
  'அவர்கள்':         { roman: 'avarkaḷ',       english: 'they (hon.)' },
  'இவன்':            { roman: 'ivaṉ',          english: 'this one / he' },
  'இவள்':            { roman: 'ivaḷ',          english: 'this woman / she' },
  'அது':             { roman: 'atu',           english: 'that / it' },
  'அதுவே':           { roman: 'atuvē',         english: 'that alone' },
  'இது':             { roman: 'itu',           english: 'this / it' },
  'இதுவே':           { roman: 'ituvē',         english: 'this alone' },
  'எது':             { roman: 'etu',           english: 'which / what' },
  'யான்':            { roman: 'yāṉ',           english: 'I (classical)' },
  'யாம்':            { roman: 'yām',           english: 'we (classical)' },
  'யார்':            { roman: 'yār',           english: 'who' },
  'எவர்':            { roman: 'evar',          english: 'whoever' },
  'எல்லாம்':         { roman: 'ellām',         english: 'all / everything' },

  // ═══════════════════════════════════════════════════════
  // COMMON VERBS — Past-tense 3rd person forms
  // ═══════════════════════════════════════════════════════
  'நின்றனன்':        { roman: 'niṉṟaṉaṉ',     english: 'stood / remained (He)' },
  'நின்றான்':        { roman: 'niṉṟāṉ',        english: 'He stood / remained' },
  'நின்று':          { roman: 'niṉṟu',         english: 'standing / remaining' },
  'நில்':            { roman: 'nil',           english: 'stand / remain' },
  'சென்றனன்':        { roman: 'ceṉṟaṉaṉ',     english: 'went / proceeded (He)' },
  'சென்றான்':        { roman: 'ceṉṟāṉ',        english: 'He went' },
  'சென்று':          { roman: 'ceṉṟu',         english: 'going / having gone' },
  'வென்றனன்':        { roman: 'veṉṟaṉaṉ',     english: 'conquered / transcended (He)' },
  'வென்றான்':        { roman: 'veṉṟāṉ',        english: 'He conquered' },
  'வென்று':          { roman: 'veṉṟu',         english: 'having conquered' },
  'விரிந்தனன்':      { roman: 'virintaṉaṉ',    english: 'expanded / spread (He)' },
  'விரிந்தான்':      { roman: 'virintāṉ',      english: 'He expanded' },
  'விரிந்து':        { roman: 'virintu',       english: 'expanding / having spread' },
  'இருந்தான்':       { roman: 'iruntāṉ',       english: 'He remained / abided' },
  'இருந்தனன்':       { roman: 'iruntaṉaṉ',     english: 'remained / abided (He)' },
  'இருந்து':         { roman: 'irundu',        english: 'being / remaining' },
  'இருக்கின்றான்':   { roman: 'irukkiṉṟāṉ',    english: 'He remains / abides' },
  'உணர்ந்தான்':      { roman: 'uṇarntāṉ',      english: 'He realised / knew' },
  'உணர்ந்தனன்':      { roman: 'uṇarntaṉaṉ',    english: 'realised / perceived (He)' },
  'உணர்ந்தெட்டே':    { roman: 'uṇarntēṭṭē',    english: 'knowing the eight' },
  'வந்தான்':         { roman: 'vantāṉ',        english: 'He came' },
  'வந்தனன்':         { roman: 'vantaṉaṉ',      english: 'came (He)' },
  'கண்டான்':         { roman: 'kaṇṭāṉ',        english: 'He saw' },
  'கண்டனன்':         { roman: 'kaṇṭaṉaṉ',      english: 'saw (He)' },
  'கொண்டான்':        { roman: 'koṇṭāṉ',        english: 'He took / held' },
  'தந்தான்':         { roman: 'tantāṉ',        english: 'He gave' },
  'தந்தனன்':         { roman: 'tantaṉaṉ',      english: 'gave (He)' },
  'அறிந்தான்':       { roman: 'ariṇtāṉ',       english: 'He knew' },
  'பெற்றான்':        { roman: 'peṟṟāṉ',        english: 'He attained / received' },
  'செய்தான்':        { roman: 'ceytāṉ',        english: 'He did / made' },
  'வைத்தான்':        { roman: 'vaittāṉ',       english: 'He placed / kept' },
  'பாடினான்':        { roman: 'pāṭiṉāṉ',       english: 'He sang' },
  'ஓதினான்':         { roman: 'ōtiṉāṉ',        english: 'He recited' },
  'வாழ்ந்தான்':      { roman: 'vāḻntāṉ',       english: 'He lived / prospered' },
  'கேட்டான்':        { roman: 'kēṭṭāṉ',        english: 'He heard / asked' },
  'தேடினான்':        { roman: 'tēṭiṉāṉ',       english: 'He searched / sought' },
  'கற்றான்':         { roman: 'kaṟṟāṉ',        english: 'He learnt' },
  'நடந்தான்':        { roman: 'naṭantāṉ',       english: 'He walked / occurred' },
  'ஆனான்':           { roman: 'āṉāṉ',          english: 'He became' },
  'ஆயினான்':         { roman: 'āyiṉāṉ',        english: 'He became (classical)' },
  'உய்ந்தான்':       { roman: 'uyintāṉ',       english: 'He was saved / liberated' },
  'நீங்கினான்':      { roman: 'nīṅkiṉāṉ',      english: 'He left / departed' },
  'தரித்தான்':       { roman: 'tarittāṉ',       english: 'He bore / wore' },
  'நினைத்தான்':      { roman: 'niṉaittāṉ',     english: 'He thought / meditated' },
  'உணர்':            { roman: 'uṇar',          english: 'realise / know' },
  'அறி':             { roman: 'aṟi',           english: 'know / understand' },
  'கேள்':            { roman: 'kēḷ',           english: 'listen / hear' },
  'செய்':            { roman: 'cey',           english: 'do / make' },

  // ═══════════════════════════════════════════════════════
  // COMMON NOUNS — Body, Nature, World
  // ═══════════════════════════════════════════════════════
  'உடல்':            { roman: 'uṭal',          english: 'body' },
  'உடம்பு':          { roman: 'uṭampu',        english: 'body / physical form' },
  'மனம்':            { roman: 'maṉam',         english: 'mind' },
  'உள்ளம்':          { roman: 'uḷḷam',         english: 'heart / inner being' },
  'நெஞ்சம்':         { roman: 'neñcam',        english: 'heart / chest' },
  'ஆன்மா':           { roman: 'āṉmā',          english: 'soul / self' },
  'உயிர்':           { roman: 'uyir',          english: 'life / soul / breath' },
  'உணர்வு':          { roman: 'uṇarvu',        english: 'awareness / consciousness' },
  'அறிவு':           { roman: 'aṟivu',         english: 'knowledge / intelligence' },
  'கண்':             { roman: 'kaṇ',           english: 'eye' },
  'கை':              { roman: 'kai',           english: 'hand' },
  'கால்':            { roman: 'kāl',           english: 'foot / leg' },
  'தலை':             { roman: 'talai',         english: 'head' },
  'வாய்':            { roman: 'vāy',           english: 'mouth / speech' },
  'செவி':            { roman: 'cevi',          english: 'ear' },
  'மூக்கு':          { roman: 'mūkku',         english: 'nose' },
  'நாக்கு':          { roman: 'nākku',         english: 'tongue' },
  'முகம்':           { roman: 'mukam',         english: 'face' },
  'மார்பு':          { roman: 'mārpu',         english: 'chest / heart' },
  'நெருப்பு':        { roman: 'neruppu',       english: 'fire' },
  'நெருப்':          { roman: 'nerup',         english: 'fire (sandhi)' },
  'மண்':             { roman: 'maṇ',           english: 'earth / soil' },
  'காற்று':          { roman: 'kāṟṟu',         english: 'wind / air' },
  'ஆகாயம்':          { roman: 'ākāyam',        english: 'sky / ether / space' },
  'விண்':            { roman: 'viṇ',           english: 'sky / heaven / space' },
  'கடல்':            { roman: 'kaṭal',         english: 'sea / ocean' },
  'மலை':             { roman: 'malai',         english: 'mountain / hill' },
  'வனம்':            { roman: 'vaṉam',         english: 'forest / grove' },
  'ஊர்':             { roman: 'ūr',            english: 'town / village / place' },
  'நாடு':            { roman: 'nāṭu',          english: 'land / country' },
  'உலகம்':           { roman: 'ulakam',        english: 'world' },
  'உலகு':            { roman: 'ulaku',         english: 'world (classical)' },
  'அண்டம்':          { roman: 'aṇṭam',         english: 'cosmos / universe' },
  'பிண்டம்':         { roman: 'piṇṭam',        english: 'body / microcosm' },
  'ஒளி':             { roman: 'oḷi',           english: 'light / luminosity' },
  'இருள்':           { roman: 'iruḷ',          english: 'darkness / ignorance' },
  'சுடர்':           { roman: 'cuṭar',         english: 'flame / radiance' },
  'ஞாயிறு':          { roman: 'ñāyiṟu',        english: 'sun' },
  'திங்கள்':         { roman: 'tiṅkaḷ',        english: 'moon / Monday' },
  'மழை':             { roman: 'maḻai',         english: 'rain' },
  'பூ':              { roman: 'pū',            english: 'flower' },
  'மரம்':            { roman: 'maram',         english: 'tree' },
  'இலை':             { roman: 'ilai',          english: 'leaf' },
  'பழம்':            { roman: 'paḻam',         english: 'fruit' },
  'விதை':            { roman: 'vitai',         english: 'seed' },
  'பால்':            { roman: 'pāl',           english: 'milk / portion / side' },
  'மலர்':            { roman: 'malar',         english: 'flower (classical)' },

  // ═══════════════════════════════════════════════════════
  // COMMON ADJECTIVES & ADVERBS
  // ═══════════════════════════════════════════════════════
  'நல்ல':            { roman: 'nalla',         english: 'good / virtuous' },
  'நல்':             { roman: 'nal',           english: 'good / virtuous' },
  'தீய':             { roman: 'tīya',          english: 'bad / evil' },
  'பெரிய':           { roman: 'periya',        english: 'great / large' },
  'பெரும்':          { roman: 'perum',         english: 'great (prefix)' },
  'சிறிய':           { roman: 'ciṟiya',        english: 'small / little' },
  'இன்ன':            { roman: 'iṉṉa',          english: 'sweet / pleasant' },
  'இன்னருள்':        { roman: 'iṉṉaruḷ',      english: 'sweet grace' },
  'கரிய':            { roman: 'kariya',        english: 'dark / black' },
  'கரும்':           { roman: 'karum',         english: 'dark (prefix)' },
  'வெண்':            { roman: 'veṇ',           english: 'white / bright' },
  'சிவந்த':          { roman: 'civanta',       english: 'red / crimson' },
  'புது':            { roman: 'putu',          english: 'new / fresh' },
  'பழைய':            { roman: 'paḻaiya',       english: 'old / ancient' },
  'ஆதி':             { roman: 'āti',           english: 'primordial / first / source' },
  'அந்த':            { roman: 'anta',          english: 'that (adjective)' },
  'இந்த':            { roman: 'inta',          english: 'this (adjective)' },
  'எந்த':            { roman: 'enta',          english: 'which (adjective)' },
  'மேல்':            { roman: 'mēl',           english: 'above / upper / on' },
  'கீழ்':            { roman: 'kīḻ',           english: 'below / lower' },
  'முன்':            { roman: 'muṉ',           english: 'before / in front' },
  'பின்':            { roman: 'piṉ',           english: 'after / behind' },
  'உள்':             { roman: 'uḷ',            english: 'within / inside' },
  'அம்பர்':          { roman: 'ampar',         english: 'sky / heaven' },
  'புறம்':           { roman: 'puṟam',         english: 'outside / exterior' },
  'அங்கு':           { roman: 'aṅku',          english: 'there' },
  'இங்கு':           { roman: 'iṅku',          english: 'here' },
  'எங்கும்':         { roman: 'eṅkum',         english: 'everywhere' },
  'எங்கு':           { roman: 'eṅku',          english: 'where' },
  'எப்போதும்':       { roman: 'eppōtum',       english: 'always / ever' },
  'என்றும்':         { roman: 'eṉṟum',         english: 'always / forever' },
  'இன்று':           { roman: 'iṉṟu',          english: 'today / now' },
  'நாளை':            { roman: 'nāḷai',         english: 'tomorrow' },
  'இப்போது':         { roman: 'ippōtu',        english: 'now' },
  'மிக':             { roman: 'mika',          english: 'very / greatly' },
  'மிகவும்':         { roman: 'mikavum',       english: 'very much / greatly' },

  // ═══════════════════════════════════════════════════════
  // PARTICLES & POSTPOSITIONS
  // ═══════════════════════════════════════════════════════
  'ஆம்':             { roman: 'ām',            english: 'is / yes / indeed' },
  'ஆகும்':           { roman: 'ākum',          english: 'becomes / is' },
  'ஆகி':             { roman: 'āki',           english: 'becoming / as' },
  'ஆய்':             { roman: 'āy',            english: 'being / as (classical)' },
  'மாய்':            { roman: 'māy',           english: 'being / as (classical)' },
  'உம்':             { roman: 'um',            english: 'and / also / too' },
  'ஏ':               { roman: 'ē',             english: '(emphasis particle)' },
  'இல்':             { roman: 'il',            english: 'in / at (locative)' },
  'இல்லை':           { roman: 'illai',         english: 'not / no / none' },
  'இல்லாத':          { roman: 'illāta',        english: 'without / devoid of' },
  'இன்':             { roman: 'iṉ',            english: 'of (genitive / locative)' },
  'கு':              { roman: 'ku',            english: 'to / for (dative)' },
  'ஆல்':             { roman: 'āl',            english: 'by / through (instrumental)' },
  'ஐ':               { roman: 'ai',            english: '(accusative particle)' },
  'ஓடு':             { roman: 'ōṭu',          english: 'with (sociative)' },
  'என':              { roman: 'eṉa',          english: 'as / saying / called' },
  'என்று':           { roman: 'eṉṟu',         english: 'saying / called / that' },
  'எனவே':            { roman: 'eṉavē',         english: 'therefore / thus' },
  'ஆனால்':           { roman: 'āṉāl',          english: 'but / however / if' },
  'அதனால்':          { roman: 'ataṉāl',        english: 'therefore / because of that' },
  'தவிர':            { roman: 'tavira',        english: 'except / besides / apart from' },
  'வரை':             { roman: 'varai',         english: 'until / as far as / up to' },
  'போல':             { roman: 'pōla',          english: 'like / as / similar to' },
  'போன்ற':           { roman: 'pōṉṟa',         english: 'like / similar to' },
  'மட்டும்':         { roman: 'maṭṭum',        english: 'only / just / until' },
  'அன்றி':           { roman: 'aṉṟi',          english: 'without / other than' },
  'அன்றே':           { roman: 'aṉṟē',          english: 'is it not / indeed' },
  'கொண்டு':          { roman: 'koṇṭu',         english: 'taking / with / having' },

  // ═══════════════════════════════════════════════════════
  // DIVINE NAMES & SPIRITUAL TERMS (Shiva & the divine)
  // ═══════════════════════════════════════════════════════
  'சிவம்':           { roman: 'civam',         english: 'Shiva / absolute goodness' },
  'சிவன்':           { roman: 'civaṉ',         english: 'Shiva' },
  'சிவனை':           { roman: 'civaṉai',       english: 'Shiva (acc.)' },
  'சிவனே':           { roman: 'civaṉē',        english: 'O Shiva' },
  'ஈசன்':            { roman: 'īcaṉ',          english: 'Lord Shiva' },
  'ஈசனே':            { roman: 'īcaṉē',         english: 'O Lord' },
  'இறை':             { roman: 'iṟai',          english: 'the Divine / God' },
  'இறைவன்':          { roman: 'iṟaivaṉ',       english: 'the Lord God' },
  'இறைவனை':          { roman: 'iṟaivaṉai',     english: 'the Lord (acc.)' },
  'இறைவனே':          { roman: 'iṟaivaṉē',      english: 'O Lord' },
  'ஆண்டவன்':         { roman: 'āṇṭavaṉ',       english: 'Lord / Ruler' },
  'பரமன்':           { roman: 'paraman',        english: 'the Supreme Being' },
  'பரனை':            { roman: 'paraṉai',        english: 'the Supreme (acc.)' },
  'பரம்':            { roman: 'param',          english: 'the Supreme / transcendent' },
  'நந்தி':           { roman: 'nanti',          english: 'Nandi / Primordial Guru' },
  'நந்தியை':         { roman: 'nantiyai',       english: 'Nandi (acc.)' },
  'நந்தியே':         { roman: 'nantiyē',        english: 'O Nandi' },
  'சக்தி':           { roman: 'cakti',          english: 'Shakti / divine energy' },
  'சத்தி':           { roman: 'catti',          english: 'Shakti (Tamil form)' },
  'உமை':             { roman: 'umai',           english: 'Uma / Parvati' },
  'அம்மை':           { roman: 'ammai',          english: 'Mother / Goddess' },
  'அம்பிகை':         { roman: 'ampikai',        english: 'the Mother Goddess' },
  'முருகன்':         { roman: 'murukaṉ',        english: 'Murugan (son of Shiva)' },
  'கணேசன்':          { roman: 'kaṇēcaṉ',        english: 'Ganesha' },
  'விநாயகன்':        { roman: 'vināyakaṉ',      english: 'Vinayaka / Ganesha' },
  'ருத்திரன்':       { roman: 'ruttiram',       english: 'Rudra / Shiva the Dissolver' },
  'நடராஜன்':         { roman: 'naṭarājaṉ',      english: 'Nataraja / Cosmic Dancer' },
  'சதாசிவம்':        { roman: 'catācivam',       english: 'Sadashiva / Eternal Shiva' },
  'சங்கரன்':         { roman: 'saṅkaraṉ',       english: 'Shankara / the Beneficent' },
  'திருமூலன்':       { roman: 'thirumūlaṉ',     english: 'Thirumoolar (the author)' },
  'திருமூலர்':       { roman: 'thirumūlar',     english: 'Thirumoolar' },
  'மூலன்':           { roman: 'mūlaṉ',          english: 'Mulan (Thirumoolar\'s form)' },

  // ═══════════════════════════════════════════════════════
  // GRACE & LIBERATION
  // ═══════════════════════════════════════════════════════
  'அருள்':           { roman: 'aruḷ',          english: 'grace / divine compassion' },
  'அருளால்':         { roman: 'aruḷāl',        english: 'by grace' },
  'அருளை':           { roman: 'aruḷai',        english: 'grace (acc.)' },
  'திருவருள்':       { roman: 'tiruvaruḷ',     english: 'sacred divine grace' },
  'முக்தி':          { roman: 'mukti',          english: 'liberation' },
  'மோட்சம்':         { roman: 'mōṭcam',         english: 'liberation / moksha' },
  'விடுதலை':         { roman: 'viṭuthalai',     english: 'liberation / freedom' },
  'முத்தி':          { roman: 'mutti',          english: 'liberation (Tantra 9)' },
  'கைவல்யம்':        { roman: 'kaivalyam',      english: 'absolute liberation' },
  'பேரின்பம்':        { roman: 'pēriṉpam',       english: 'supreme bliss' },
  'இன்பம்':          { roman: 'iṉpam',          english: 'joy / pleasure / bliss' },
  'துன்பம்':         { roman: 'tuṉpam',         english: 'sorrow / suffering' },

  // ═══════════════════════════════════════════════════════
  // SOUL, BONDS, KARMA
  // ═══════════════════════════════════════════════════════
  'ஆத்மா':           { roman: 'āttmā',           english: 'soul / atman' },
  'ஆவி':             { roman: 'āvi',             english: 'breath / spirit / life-force' },
  'பசு':             { roman: 'pacu',            english: 'soul / bound being' },
  'பதி':             { roman: 'pati',            english: 'Lord / God (Shiva)' },
  'பாசம்':           { roman: 'pācam',           english: 'bond / fetter / noose' },
  'ஆணவம்':           { roman: 'āṇavam',          english: 'primordial ego / egoism' },
  'கர்மம்':          { roman: 'karmam',          english: 'karma / action-residue' },
  'வினை':            { roman: 'vinai',           english: 'karma / action-residue' },
  'மாயை':            { roman: 'māyai',           english: 'illusion / material energy' },
  'மாயா':            { roman: 'māyā',            english: 'illusion / maya' },
  'பந்தம்':          { roman: 'bantham',         english: 'bondage / bond' },
  'சம்சாரம்':        { roman: 'camsāram',        english: 'cycle of rebirth' },
  'பிறப்பு':         { roman: 'piṟappu',         english: 'birth' },
  'இறப்பு':          { roman: 'iṟappu',          english: 'death' },
  'மரணம்':           { roman: 'maraṇam',         english: 'death / mortality' },
  'உழலுவர்':         { roman: 'uḻaluvar',        english: 'they wander / roam (rebirth)' },

  // ═══════════════════════════════════════════════════════
  // YOGA & PRACTICE
  // ═══════════════════════════════════════════════════════
  'யோகம்':           { roman: 'yōkam',           english: 'yoga / union' },
  'யோகி':            { roman: 'yōki',            english: 'yogi / practitioner' },
  'தவம்':            { roman: 'tavam',            english: 'austerity / tapas' },
  'தவமே':            { roman: 'tavamē',           english: 'austerity indeed' },
  'மந்திரம்':        { roman: 'manthiram',        english: 'mantra / sacred formula' },
  'நமசிவாய':         { roman: 'namasivāya',       english: 'Na-Ma-Si-Va-Ya (panchakshara)' },
  'ஜபம்':            { roman: 'japam',            english: 'japa / mantra repetition' },
  'குண்டலினி':       { roman: 'kuṇṭaliṉi',        english: 'kundalini / coiled energy' },
  'பிராணன்':         { roman: 'pirāṇan',          english: 'prana / life-force' },
  'பிராணாயாமம்':     { roman: 'pirāṇāyāmam',      english: 'pranayama / breath control' },
  'சுழுமுனை':        { roman: 'cuḻumuṉai',        english: 'sushumna / central channel' },
  'இடகலை':           { roman: 'iṭakalai',         english: 'ida / left lunar channel' },
  'பிங்கலை':         { roman: 'piṅkalai',         english: 'pingala / right solar channel' },
  'நாடி':            { roman: 'nāṭi',             english: 'nadi / subtle energy channel' },
  'சக்கரம்':         { roman: 'cakkaram',         english: 'chakra / energy centre' },
  'மூலாதாரம்':       { roman: 'mūlātāram',        english: 'muladhara / root chakra' },
  'ஆஞ்ஞை':           { roman: 'āñcai',            english: 'ajna / third eye chakra' },
  'சகஸ்ரதளம்':       { roman: 'cakasrataḷam',     english: 'sahasrara / crown chakra' },
  'கமலம்':           { roman: 'kamalam',          english: 'lotus (chakra / heart)' },
  'தியானம்':          { roman: 'tiyāṉam',          english: 'meditation / dhyana' },
  'சமாதி':           { roman: 'camāthi',          english: 'samadhi / complete absorption' },
  'ஆசனம்':           { roman: 'ācaṉam',           english: 'asana / yogic posture' },
  'தாரணை':           { roman: 'tāraṇai',          english: 'dharana / concentration' },
  'நியமம்':          { roman: 'niyamam',          english: 'niyama / observances' },
  'யமம்':            { roman: 'yamam',            english: 'yama / ethical restraints' },
  'முத்திரை':        { roman: 'muttirai',         english: 'mudra / sacred gesture' },
  'சித்தி':          { roman: 'citti',            english: 'siddhi / supernatural power' },
  'சித்தர்':         { roman: 'cittar',           english: 'siddhar / perfected one' },
  'கிரியை':          { roman: 'kiriyai',          english: 'kriya / ritual action' },
  'சரியை':           { roman: 'cariyai',          english: 'charya / right conduct' },
  'தீட்சை':          { roman: 'thīṭcai',          english: 'initiation / diksha' },
  'குரு':            { roman: 'guru',             english: 'spiritual teacher' },
  'சீடன்':           { roman: 'cīṭaṉ',           english: 'disciple / student' },
  'உபதேசம்':         { roman: 'upatēcam',         english: 'spiritual instruction' },

  // ═══════════════════════════════════════════════════════
  // PHILOSOPHY & COSMOLOGY
  // ═══════════════════════════════════════════════════════
  'ஞானம்':           { roman: 'ñāṉam',           english: 'jnana / direct knowing' },
  'அஞ்ஞானம்':        { roman: 'añcñānam',         english: 'ignorance / ajnana' },
  'சிவஞானம்':        { roman: 'civañānam',        english: 'knowledge of Shiva' },
  'தத்துவம்':        { roman: 'tattuam',          english: 'principle / category of reality' },
  'சித்தம்':         { roman: 'cittam',           english: 'mind-stuff / consciousness-field' },
  'துரீயம்':         { roman: 'thurīyam',         english: 'turiya / the fourth state' },
  'மோனம்':           { roman: 'mōṉam',            english: 'sacred silence' },
  'அன்பு':           { roman: 'anbu',             english: 'love / devotion' },
  'அன்பே':           { roman: 'anbē',             english: 'love itself' },
  'அன்பே சிவம்':     { roman: 'anbe sivam',        english: 'Love is Shiva' },
  'விவேகம்':         { roman: 'vivēkam',          english: 'spiritual discernment' },
  'வைராக்கியம்':     { roman: 'vairākkiyam',      english: 'vairagya / dispassion' },
  'நித்தியம்':       { roman: 'nittiyam',         english: 'nitya / the eternal' },
  'அனித்தியம்':      { roman: 'anittiyam',        english: 'anitya / impermanence' },
  'சத்':             { roman: 'cat',              english: 'sat / pure being' },
  'சித்':            { roman: 'cit',              english: 'chit / pure consciousness' },
  'ஆனந்தம்':         { roman: 'āṉantam',          english: 'ananda / divine bliss' },
  'சச்சிதானந்தம்':   { roman: 'caccitāṉantam',    english: 'Satchidananda (being-consciousness-bliss)' },
  'உண்மை':           { roman: 'uṇmai',            english: 'truth / the real' },
  'கடவுள்':          { roman: 'kaṭavuḷ',          english: 'God / the Divine' },
  'தெய்வம்':         { roman: 'teyvam',           english: 'deity / divine' },
  'இச்சை':           { roman: 'icai',             english: 'will / desire-power' },
  'அகம்':            { roman: 'akam',             english: 'inner / within / heart' },
  'அகந்தை':          { roman: 'akanthai',         english: 'ego / I-sense' },
  'சுயம்':           { roman: 'cuyam',            english: 'self / by itself' },
  'நிலை':            { roman: 'nilai',            english: 'state / ground / stability' },
  'ஊழ்':             { roman: 'ūḻ',              english: 'fate / cosmic law' },
  'நல்வினை':         { roman: 'nalvinai',         english: 'good karma / virtuous action' },
  'தீவினை':          { roman: 'tīvinai',          english: 'bad karma / evil action' },
  'அத்துவிதம்':      { roman: 'attuaitam',        english: 'advaita / non-duality' },

  // ═══════════════════════════════════════════════════════
  // SCRIPTURE & TRADITION
  // ═══════════════════════════════════════════════════════
  'வேதம்':           { roman: 'vētam',            english: 'Veda / sacred knowledge' },
  'தந்திரம்':        { roman: 'tanttiram',         english: 'tantra / sacred method' },
  'பாடல்':           { roman: 'pāṭal',            english: 'song / verse' },
  'திருமந்திரம்':    { roman: 'thirumanthiram',    english: 'the sacred mantra (this text)' },
  'திருமுறை':        { roman: 'tirumurai',         english: 'Tirumurai / sacred canon' },
  'தேவாரம்':         { roman: 'tēvāram',          english: 'Devaram / first seven Tirumurai' },
  'சாத்திரம்':       { roman: 'cātttiram',         english: 'shastra / sacred text' },
  'சைவம்':           { roman: 'caivam',            english: 'Shaivism' },
  'சைவ சித்தாந்தம்': { roman: 'caiva cittāntam',   english: 'Shaiva Siddhanta' },
  'நாயன்மார்':       { roman: 'nāyaṉmār',         english: 'Nayanmars / Shaiva saints' },
  'பஞ்சாக்கரம்':     { roman: 'bañcākṣaram',       english: 'panchakshara / five-lettered mantra' },
  'ஆகமம்':           { roman: 'ākamam',            english: 'agama / sacred text' },

  // ═══════════════════════════════════════════════════════
  // FIVE ACTS OF SHIVA (Aintozhil)
  // ═══════════════════════════════════════════════════════
  'ஐந்தொழில்':       { roman: 'aintoḻil',          english: 'five cosmic acts of Shiva' },
  'சிருட்டி':        { roman: 'ciruṭṭi',           english: 'creation (Srishti)' },
  'திதி':            { roman: 'titi',              english: 'preservation (Sthiti)' },
  'சம்காரம்':        { roman: 'camkāram',          english: 'dissolution (Samhara)' },
  'திரோதம்':         { roman: 'thirōtham',         english: 'concealment (Tirobhava)' },
  'அனுக்கிரகம்':     { roman: 'aṉukkirakam',       english: 'grace / liberation (Anugraha)' },

  // ═══════════════════════════════════════════════════════
  // FIVE ELEMENTS
  // ═══════════════════════════════════════════════════════
  'பஞ்சபூதம்':       { roman: 'pañcapūtam',        english: 'five elements' },
  'நிலம்':           { roman: 'nilam',             english: 'earth / ground / land' },
  'தண்ணீர்':         { roman: 'taṇṇīr',           english: 'water / cool water' },
  'கனல்':            { roman: 'kaṉal',             english: 'fire / flame' },
  'வளி':             { roman: 'vaḷi',              english: 'wind / air / prana' },

  // ═══════════════════════════════════════════════════════
  // WORSHIP & RITUAL
  // ═══════════════════════════════════════════════════════
  'பூஜை':            { roman: 'pūjai',             english: 'puja / ritual worship' },
  'திருவடி':         { roman: 'thiruvati',          english: 'sacred feet of Shiva' },
  'சேவடி':           { roman: 'cēvaṭi',            english: 'red feet / lotus feet of Shiva' },
  'வணக்கம்':         { roman: 'vaṇakkam',          english: 'reverence / salutation' },
  'தொண்டு':          { roman: 'thoṇṭu',            english: 'service / devoted service' },
  'சரண்':            { roman: 'caraṇ',             english: 'refuge / surrender' },
  'சரணம்':           { roman: 'caraṇam',           english: 'refuge / at the feet' },
  'திருநீறு':        { roman: 'tiruṉīṟu',          english: 'sacred ash / vibhuti' },
  'ருத்திராட்சம்':   { roman: 'ruttrāṭcam',         english: 'rudraksha / sacred beads' },
  'அபிஷேகம்':        { roman: 'apiṣēkam',          english: 'abhishekam / sacred anointing' },
  'நோன்பு':          { roman: 'nōṉpu',             english: 'vow / fast / observance' },
  'விரதம்':          { roman: 'viratam',           english: 'vow / religious fast' },
  'அஜபை':            { roman: 'ajapaî',            english: 'ajapa / spontaneous mantra' },

  // ═══════════════════════════════════════════════════════
  // SACRED PLACES & COSMOLOGICAL REALMS
  // ═══════════════════════════════════════════════════════
  'கைலாயம்':         { roman: 'kailāyam',          english: 'Kailash / Shiva\'s mountain abode' },
  'திருவம்பலம்':     { roman: 'tiruvampalam',       english: 'Chidambaram / hall of consciousness' },
  'சிவலோகம்':        { roman: 'civalōkam',          english: 'Sivaloka / realm of Shiva' },

  // ═══════════════════════════════════════════════════════
  // COMMON VERB ROOTS & PRESENT/FUTURE FORMS
  // ═══════════════════════════════════════════════════════
  'இருக்கும்':       { roman: 'irukkum',           english: 'will be / remains' },
  'செய்யும்':        { roman: 'ceyyum',            english: 'will do / does' },
  'வரும்':           { roman: 'varum',             english: 'will come / comes' },
  'போகும்':          { roman: 'pōkum',             english: 'will go / goes' },
  'கொள்ளும்':        { roman: 'koḷḷum',            english: 'will take / hold' },
  'தரும்':           { roman: 'tarum',             english: 'will give / gives' },
  'அறிவர்':          { roman: 'aṟivar',            english: 'they know / the wise' },
  'உணர்வர்':         { roman: 'uṇarvar',           english: 'they realise / perceive' },
  'உய்வர்':          { roman: 'uyvar',             english: 'they are saved / liberated' },
  'உளர்':            { roman: 'uḷar',              english: 'they exist / are' },
  'இலர்':            { roman: 'ilar',              english: 'they are not / do not have' },
  'ஆவர்':            { roman: 'āvar',              english: 'they become / will be' },
  'பெறுவர்':         { roman: 'peṟuvar',           english: 'they attain / receive' },

  // ═══════════════════════════════════════════════════════
  // ADDITIONAL COMMON NOUNS
  // ═══════════════════════════════════════════════════════
  'நூல்':            { roman: 'nūl',              english: 'text / book / thread' },
  'இடம்':            { roman: 'iṭam',              english: 'place / space' },
  'காலம்':           { roman: 'kālam',             english: 'time / era' },
  'கோயில்':          { roman: 'kōyil',             english: 'temple' },
  'பூமி':            { roman: 'pūmi',              english: 'earth / ground' },
  'வானம்':           { roman: 'vāṉam',             english: 'sky / heaven' },
  'சூரியன்':         { roman: 'cūriyaṉ',          english: 'sun' },
  'சந்திரன்':        { roman: 'cantiraṉ',          english: 'moon' },
  'நட்சத்திரம்':     { roman: 'naṭcattiram',       english: 'star' },
  'இரவு':            { roman: 'iravu',             english: 'night' },
  'பகல்':            { roman: 'pakal',             english: 'day' },
  'விடியல்':         { roman: 'viṭiyal',           english: 'dawn' },
  'மாலை':            { roman: 'mālai',             english: 'evening / garland' },
  'கற்பு':           { roman: 'kaṟpu',             english: 'chastity / fidelity' },
  'நேர்மை':          { roman: 'nērmai',            english: 'honesty / integrity' },
  'அறம்':            { roman: 'aṟam',              english: 'dharma / virtue / righteousness' },
  'பொருள்':          { roman: 'poruḷ',             english: 'wealth / meaning / thing' },
  'வீடு':            { roman: 'vīṭu',              english: 'home / liberation (veedu)' },
  'வீடுபேறு':        { roman: 'vīṭupēṟu',          english: 'liberation / final release' },
  'பிறவி':           { roman: 'piṟavi',            english: 'birth / incarnation' },
  'பிறவிப்பிணி':     { roman: 'piṟavippiṇi',       english: 'disease of birth / samsara' },
  'வாழ்க்கை':        { roman: 'vāḻkkai',           english: 'life / living' },
  'உலகியல்':         { roman: 'ulakiyal',          english: 'worldly ways / mundane life' },
  'கோபம்':           { roman: 'kōpam',             english: 'anger' },
  'ஆசை':             { roman: 'ācai',              english: 'desire / longing' },
  'காமம்':           { roman: 'kāmam',             english: 'desire / divine longing' },
  'மோகம்':           { roman: 'mōkam',             english: 'delusion / infatuation' },
  'பொறாமை':         { roman: 'poṟāmai',           english: 'jealousy / envy' },
  'மனிதன்':          { roman: 'maṉitaṉ',          english: 'human being / person' },
  'மனிதர்':          { roman: 'maṉitar',          english: 'humans / people' },
  'சீவன்':           { roman: 'cīvaṉ',            english: 'jiva / living soul' },
  'சீவர்':           { roman: 'cīvar',            english: 'jivas / living souls' },
  'அன்பன்':          { roman: 'aṉpaṉ',            english: 'devotee / the loving one' },
  'அடியான்':         { roman: 'aṭiyāṉ',           english: 'servant / devotee' },
  'அடியார்':         { roman: 'aṭiyār',           english: 'devotees / servants of God' },
  'முனிவர்':         { roman: 'muṉivar',          english: 'sage / ascetic' },
  'மகான்':           { roman: 'makāṉ',             english: 'great one / saint' },
  'தேவர்':           { roman: 'tēvar',             english: 'celestials / gods' },
  'தேவன்':           { roman: 'tēvaṉ',            english: 'god / celestial' },
  'தேவி':            { roman: 'tēvi',              english: 'goddess' },
  'உரை':             { roman: 'urai',              english: 'speech / commentary / say' },
  'சொல்':            { roman: 'col',              english: 'word / say' },
  'சொல்லும்':        { roman: 'collum',           english: 'word / that which says' },
  'வார்த்தை':        { roman: 'vārttai',           english: 'word / speech' },
  'பொய்':            { roman: 'poy',              english: 'falsehood / lie' },
  'மெய்':            { roman: 'mey',              english: 'truth / body / real' },
  'கீர்த்தி':        { roman: 'kīrtti',           english: 'glory / fame / praise' },
  'புகழ்':           { roman: 'pukaḻ',            english: 'fame / glory / praise' },
  'திரு':            { roman: 'tiru',             english: 'sacred / holy / blessed' },
};

// Common Tamil suffixes ordered from longest to shortest for correct stripping
const STRIP_SUFFIXES = [
  // Verbal past-tense suffixes
  'ந்தனன்', 'றனன்', 'ந்தான்', 'றான்', 'னன்', 'நாள்', 'னார்',
  // Case suffixes
  'க்கு', 'இல்', 'இன்', 'ஆல்', 'ஓடு', 'ஐ',
  // Plural
  'கள்',
  // Emphasis / particles
  'ஏ', 'உம்', 'தான்',
  // Verbal noun / adverb
  'ந்து', 'று',
];

export function lookupTamilWord(word: string): WordMeaning | undefined {
  if (!word) return undefined;

  // 1. Exact match
  if (WORD_LOOKUP[word]) return WORD_LOOKUP[word];

  // 2. Strip common suffixes and try again
  for (const suffix of STRIP_SUFFIXES) {
    if (word.endsWith(suffix) && word.length > suffix.length + 1) {
      const stem = word.slice(0, -suffix.length);
      if (WORD_LOOKUP[stem]) return WORD_LOOKUP[stem];
    }
  }

  // 3. Prefix match — if any dict key is a long-enough prefix of this word
  let best: WordMeaning | undefined;
  let bestLen = 0;
  for (const key of Object.keys(WORD_LOOKUP)) {
    if (key.length > 2 && word.startsWith(key) && key.length > bestLen) {
      best = WORD_LOOKUP[key];
      bestLen = key.length;
    }
  }
  return best;
}
