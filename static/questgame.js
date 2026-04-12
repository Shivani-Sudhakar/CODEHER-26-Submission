// ============================================================
//  QUEST GAME ENGINE v2 — RPG Combat Quiz with Levels & Hearts
// ============================================================

(function () {
    'use strict';

    // ============================================================
    //  QUIZ QUESTION BANK (by skill ID) — 3 difficulty tiers
    //  ~250+ unique questions, 4-5 per tier per skill
    // ============================================================
    const QUIZ_BANK = {
        programming: {
            easy: [
                { q: "What does HTML stand for?", opts: ["Hyper Text Markup Language", "Home Tool Markup Language", "Hyperlinks Text Mark Language", "Hyper Tool Multi Language"], ans: 0 },
                { q: "Which symbol starts a comment in Python?", opts: ["//", "#", "/*", "--"], ans: 1 },
                { q: "CSS stands for?", opts: ["Computer Style Sheets", "Cascading Style Sheets", "Creative Style System", "Coded Style Scripts"], ans: 1 },
                { q: "Which tag creates a paragraph in HTML?", opts: ["<p>", "<para>", "<text>", "<pg>"], ans: 0 },
                { q: "What does 'print()' do in Python?", opts: ["Reads input", "Outputs text to console", "Saves a file", "Closes program"], ans: 1 },
            ],
            medium: [
                { q: "Which language runs natively in browsers?", opts: ["Python", "Java", "JavaScript", "C++"], ans: 2 },
                { q: "What does API stand for?", opts: ["Application Programming Interface", "Applied Program Integration", "Automatic Protocol Interface", "Advanced Programming Input"], ans: 0 },
                { q: "Output of: print(2 ** 3)?", opts: ["6", "8", "5", "9"], ans: 1 },
                { q: "Which keyword defines a function in Python?", opts: ["func", "function", "def", "define"], ans: 2 },
                { q: "JSON stands for?", opts: ["JavaScript Object Notation", "Java Source Open Network", "Join Standard Object Naming", "Java Syntax Object Node"], ans: 0 },
            ],
            hard: [
                { q: "Which data structure uses FIFO?", opts: ["Stack", "Queue", "Tree", "Graph"], ans: 1 },
                { q: "What is a closure in programming?", opts: ["A syntax error", "A function with access to outer scope", "A closed loop", "A type of variable"], ans: 1 },
                { q: "Time complexity of binary search?", opts: ["O(n)", "O(n²)", "O(log n)", "O(1)"], ans: 2 },
                { q: "What is recursion?", opts: ["Looping forever", "A function calling itself", "A type of error", "Memory leak"], ans: 1 },
            ]
        },
        mathematics: {
            easy: [
                { q: "What is √144?", opts: ["11", "12", "13", "14"], ans: 1 },
                { q: "If x + 5 = 12, x = ?", opts: ["5", "6", "7", "8"], ans: 2 },
                { q: "What is 15% of 200?", opts: ["25", "30", "35", "40"], ans: 1 },
                { q: "What is 7 × 8?", opts: ["54", "56", "58", "64"], ans: 1 },
                { q: "Value of π (approx)?", opts: ["2.14", "3.14", "4.14", "1.14"], ans: 1 },
            ],
            medium: [
                { q: "Next prime after 7?", opts: ["9", "10", "11", "13"], ans: 2 },
                { q: "What is log₁₀(1000)?", opts: ["2", "3", "4", "10"], ans: 1 },
                { q: "3! (factorial) equals?", opts: ["3", "6", "9", "12"], ans: 1 },
                { q: "Solve: 2x - 4 = 10", opts: ["5", "6", "7", "8"], ans: 2 },
                { q: "Sum of angles in a triangle?", opts: ["90°", "180°", "270°", "360°"], ans: 1 },
            ],
            hard: [
                { q: "Area of triangle: base=10, height=6?", opts: ["30", "60", "16", "20"], ans: 0 },
                { q: "Derivative of x²?", opts: ["x", "2x", "x²", "2"], ans: 1 },
                { q: "Integral of 2x?", opts: ["x", "x²", "2x²", "x² + C"], ans: 3 },
                { q: "Sin(90°) = ?", opts: ["0", "0.5", "1", "-1"], ans: 2 },
            ]
        },
        logic: {
            easy: [
                { q: "Which structure uses LIFO?", opts: ["Queue", "Stack", "Array", "List"], ans: 1 },
                { q: "Binary search requires data to be:", opts: ["Random", "Sorted", "Unique", "Small"], ans: 1 },
                { q: "True AND False = ?", opts: ["True", "False", "Error", "Null"], ans: 1 },
                { q: "NOT True = ?", opts: ["True", "False", "0", "Null"], ans: 1 },
            ],
            medium: [
                { q: "Binary tree node max children?", opts: ["1", "2", "3", "4"], ans: 1 },
                { q: "Which sort has O(n log n) average?", opts: ["Bubble Sort", "Merge Sort", "Insertion Sort", "Selection Sort"], ans: 1 },
                { q: "What is a hash table for?", opts: ["Sorting", "Fast lookup", "Recursion", "Drawing"], ans: 1 },
                { q: "Linked list advantage over array?", opts: ["Faster search", "Dynamic size", "Less memory", "Random access"], ans: 1 },
            ],
            hard: [
                { q: "In Big O, which is fastest?", opts: ["O(n²)", "O(n log n)", "O(n)", "O(1)"], ans: 3 },
                { q: "Which solves overlapping subproblems?", opts: ["Greedy", "Dynamic Programming", "Brute Force", "Backtracking"], ans: 1 },
                { q: "Worst case of quicksort?", opts: ["O(n)", "O(n log n)", "O(n²)", "O(log n)"], ans: 2 },
                { q: "BFS uses which structure?", opts: ["Stack", "Queue", "Tree", "Heap"], ans: 1 },
            ]
        },
        physics: {
            easy: [
                { q: "SI unit of force?", opts: ["Joule", "Watt", "Newton", "Pascal"], ans: 2 },
                { q: "Speed of light ≈?", opts: ["3×10⁶ m/s", "3×10⁸ m/s", "3×10¹⁰ m/s", "3×10⁴ m/s"], ans: 1 },
                { q: "Water boils at?", opts: ["90°C", "100°C", "110°C", "120°C"], ans: 1 },
                { q: "Which is a unit of energy?", opts: ["Newton", "Joule", "Pascal", "Ampere"], ans: 1 },
            ],
            medium: [
                { q: "Newton's 2nd Law?", opts: ["F = ma", "E = mc²", "P = mv", "V = IR"], ans: 0 },
                { q: "A moving car has which energy?", opts: ["Potential", "Kinetic", "Thermal", "Chemical"], ans: 1 },
                { q: "Ohm's Law relates:", opts: ["Mass & force", "Voltage, current & resistance", "Speed & time", "Energy & mass"], ans: 1 },
                { q: "Sound travels fastest through:", opts: ["Air", "Water", "Vacuum", "Steel"], ans: 3 },
            ],
            hard: [
                { q: "LED stands for?", opts: ["Light Emitting Diode", "Low Energy Device", "Laser Emitting Display", "Light Electronic Detector"], ans: 0 },
                { q: "g on Earth ≈?", opts: ["8.9 m/s²", "9.8 m/s²", "10.8 m/s²", "7.8 m/s²"], ans: 1 },
                { q: "E = mc² was proposed by?", opts: ["Newton", "Einstein", "Bohr", "Hawking"], ans: 1 },
                { q: "Planck's constant relates to?", opts: ["Gravity", "Quantum energy", "Magnetism", "Friction"], ans: 1 },
            ]
        },
        english: {
            easy: [
                { q: "Synonym of 'abundant'?", opts: ["Scarce", "Plentiful", "Tiny", "Narrow"], ans: 1 },
                { q: "Past tense of 'run'?", opts: ["Runned", "Ran", "Running", "Runs"], ans: 1 },
                { q: "'He is tall.' — 'tall' is:", opts: ["Noun", "Verb", "Adjective", "Adverb"], ans: 2 },
                { q: "Plural of 'child'?", opts: ["Childs", "Children", "Childes", "Child"], ans: 1 },
            ],
            medium: [
                { q: "'She speaks fluently' — 'fluently' is:", opts: ["Noun", "Adjective", "Adverb", "Verb"], ans: 2 },
                { q: "Correct spelling?", opts: ["Accomodate", "Accommodate", "Acomodate", "Acommodate"], ans: 1 },
                { q: "What is a 'synonym'?", opts: ["Opposite meaning", "Same meaning", "No meaning", "Sound alike"], ans: 1 },
                { q: "Which is a conjunction?", opts: ["And", "Run", "Beautiful", "Quickly"], ans: 0 },
            ],
            hard: [
                { q: "A 'metaphor' is:", opts: ["Comparison using 'like'", "Direct comparison without 'like'", "A rhyming word", "An opposite word"], ans: 1 },
                { q: "Antonym of 'transparent'?", opts: ["Clear", "Opaque", "Visible", "Bright"], ans: 1 },
                { q: "What is an 'oxymoron'?", opts: ["Exaggeration", "Contradictory terms together", "Sound imitation", "Repeated sounds"], ans: 1 },
                { q: "'Alliteration' involves:", opts: ["Rhyming words", "Repeating initial sounds", "Opposite meanings", "Exaggeration"], ans: 1 },
            ]
        },
        cs_fundamentals: {
            easy: [
                { q: "CPU stands for?", opts: ["Central Processing Unit", "Computer Personal Unit", "Central Program Utility", "Core Processing Unit"], ans: 0 },
                { q: "1 byte = ? bits", opts: ["4", "8", "16", "32"], ans: 1 },
                { q: "RAM stands for?", opts: ["Read Access Memory", "Random Access Memory", "Run Active Module", "Rapid Access Machine"], ans: 1 },
                { q: "Which stores data permanently?", opts: ["RAM", "CPU", "Hard Drive", "Cache"], ans: 2 },
            ],
            medium: [
                { q: "Which is NOT an OS?", opts: ["Linux", "Windows", "Oracle", "macOS"], ans: 2 },
                { q: "Binary of decimal 10?", opts: ["1010", "1001", "1100", "1110"], ans: 0 },
                { q: "IP address identifies:", opts: ["A file type", "A device on network", "A program", "A user"], ans: 1 },
                { q: "SSD stands for?", opts: ["Solid State Drive", "System Storage Disk", "Super Speed Device", "Solid System Data"], ans: 0 },
            ],
            hard: [
                { q: "Which protocol for web browsing?", opts: ["FTP", "SMTP", "HTTP", "SSH"], ans: 2 },
                { q: "URL stands for?", opts: ["Uniform Resource Locator", "Universal Record Link", "Unified Resource Library", "User Request Link"], ans: 0 },
                { q: "TCP/IP relates to?", opts: ["Graphics", "Networking", "Databases", "Security"], ans: 1 },
                { q: "DNS stands for?", opts: ["Data Network System", "Domain Name System", "Digital Name Service", "Dynamic Node Server"], ans: 1 },
            ]
        },
        problem_solving: {
            easy: [
                { q: "Next: 2, 6, 12, 20, ?", opts: ["28", "30", "32", "24"], ans: 1 },
                { q: "Debugging means:", opts: ["Writing fast", "Finding/fixing errors", "Deleting code", "Compiling"], ans: 1 },
                { q: "Next: 1, 4, 9, 16, ?", opts: ["20", "24", "25", "36"], ans: 2 },
                { q: "An algorithm is:", opts: ["A bug type", "Step-by-step instructions", "A programming language", "A hardware device"], ans: 1 },
            ],
            medium: [
                { q: "Fibonacci: 1,1,2,3,5,8,?", opts: ["11", "13", "10", "15"], ans: 1 },
                { q: "Flowchart diamond = ?", opts: ["Process", "Decision", "Start/End", "Data"], ans: 1 },
                { q: "Pseudocode is:", opts: ["Real code", "Plain language algorithm", "Machine code", "Binary code"], ans: 1 },
                { q: "Divide and conquer breaks problems into:", opts: ["Bigger chunks", "Smaller sub-problems", "Random parts", "Equal halves only"], ans: 1 },
            ],
            hard: [
                { q: "Bat+ball=₹110. Bat costs ₹100 more. Ball=?", opts: ["₹10", "₹5", "₹15", "₹20"], ans: 1 },
                { q: "Which breaks problems into smaller parts?", opts: ["Divide and Conquer", "Brute Force", "Trial and Error", "Random"], ans: 0 },
                { q: "Greedy algorithm always picks:", opts: ["Random choice", "Locally optimal choice", "Global optimal", "Last choice"], ans: 1 },
                { q: "Memoization is:", opts: ["Memorizing code", "Caching computed results", "Writing memos", "Logging errors"], ans: 1 },
            ]
        },
        communication: {
            easy: [
                { q: "Key element of active listening?", opts: ["Interrupting", "Eye contact", "Looking at phone", "Talking more"], ans: 1 },
                { q: "Non-verbal communication includes:", opts: ["Emails", "Body language", "Text messages", "Reports"], ans: 1 },
                { q: "Speaking clearly is called:", opts: ["Articulation", "Mumbling", "Whispering", "Shouting"], ans: 0 },
                { q: "Feedback helps to:", opts: ["Confuse people", "Improve communication", "Waste time", "Create conflict"], ans: 1 },
            ],
            medium: [
                { q: "Best approach in a team meeting?", opts: ["Dominate", "Listen and contribute", "Stay silent", "Criticize"], ans: 1 },
                { q: "Professional email should be:", opts: ["Very long", "Clear and concise", "Full of emojis", "All caps"], ans: 1 },
                { q: "Conflict resolution requires:", opts: ["Aggression", "Understanding both sides", "Ignoring issues", "Blaming others"], ans: 1 },
                { q: "Good presentation starts with:", opts: ["Apology", "Strong opening hook", "Reading slides", "Long intro"], ans: 1 },
            ],
            hard: [
                { q: "'Empathy' in communication is:", opts: ["Speaking loudly", "Understanding others' feelings", "Using big words", "Being aggressive"], ans: 1 },
                { q: "Assertive communication is:", opts: ["Aggressive demands", "Expressing needs respectfully", "Staying silent", "Being passive"], ans: 1 },
                { q: "The '7-38-55 rule' is about:", opts: ["Time management", "Words/tone/body language split", "Email format", "Meeting schedule"], ans: 1 },
            ]
        },
        biology: {
            easy: [
                { q: "Powerhouse of the cell?", opts: ["Nucleus", "Mitochondria", "Ribosome", "Golgi body"], ans: 1 },
                { q: "DNA stands for?", opts: ["Deoxyribonucleic Acid", "Dynamic Nucleic Acid", "Dual Nitrogen Acid", "Deoxy Nitrogen Acid"], ans: 0 },
                { q: "Plants make food through:", opts: ["Respiration", "Photosynthesis", "Digestion", "Fermentation"], ans: 1 },
                { q: "Largest organ in human body:", opts: ["Liver", "Heart", "Skin", "Brain"], ans: 2 },
            ],
            medium: [
                { q: "Photosynthesis occurs in?", opts: ["Mitochondria", "Chloroplasts", "Nucleus", "Ribosome"], ans: 1 },
                { q: "Universal blood donor type?", opts: ["A+", "B+", "AB+", "O-"], ans: 3 },
                { q: "RNA differs from DNA by having:", opts: ["Thymine", "Uracil", "Adenine", "Cytosine"], ans: 1 },
                { q: "White blood cells fight:", opts: ["Hunger", "Infections", "Thirst", "Sleep"], ans: 1 },
            ],
            hard: [
                { q: "Chromosomes in humans?", opts: ["23", "44", "46", "48"], ans: 2 },
                { q: "Insulin is produced by?", opts: ["Liver", "Pancreas", "Kidneys", "Stomach"], ans: 1 },
                { q: "CRISPR is used for?", opts: ["Cooking", "Gene editing", "Painting", "Music"], ans: 1 },
                { q: "Mitosis produces how many cells?", opts: ["1", "2", "4", "8"], ans: 1 },
            ]
        },
        chemistry: {
            easy: [
                { q: "Chemical symbol for Gold?", opts: ["Go", "Gd", "Au", "Ag"], ans: 2 },
                { q: "pH of pure water?", opts: ["5", "7", "9", "14"], ans: 1 },
                { q: "H₂O is the formula for:", opts: ["Salt", "Water", "Sugar", "Acid"], ans: 1 },
                { q: "Elements in periodic table (~)?", opts: ["100", "118", "150", "200"], ans: 1 },
            ],
            medium: [
                { q: "Which gas do we breathe in?", opts: ["Carbon Dioxide", "Nitrogen", "Oxygen", "Hydrogen"], ans: 2 },
                { q: "NaCl is?", opts: ["Sugar", "Baking Soda", "Common Salt", "Vinegar"], ans: 2 },
                { q: "An isotope has:", opts: ["Same element, different neutrons", "Different element", "A molecule", "An ion"], ans: 0 },
                { q: "Acids have pH:", opts: ["Above 7", "Below 7", "Exactly 7", "No pH"], ans: 1 },
            ],
            hard: [
                { q: "Atomic number of Carbon?", opts: ["4", "6", "8", "12"], ans: 1 },
                { q: "Which is a noble gas?", opts: ["Oxygen", "Nitrogen", "Helium", "Hydrogen"], ans: 2 },
                { q: "Avogadro's number?", opts: ["6.022×10²³", "3.14×10⁸", "9.8×10²", "1.6×10⁻¹⁹"], ans: 0 },
                { q: "Benzene formula?", opts: ["C₆H₆", "C₂H₆", "CH₄", "C₃H₈"], ans: 0 },
            ]
        },
        anatomy: {
            easy: [
                { q: "Bones in adult human body?", opts: ["186", "206", "256", "306"], ans: 1 },
                { q: "Femur is in the?", opts: ["Arm", "Leg", "Chest", "Head"], ans: 1 },
                { q: "Brain is protected by?", opts: ["Ribs", "Skull", "Spine", "Pelvis"], ans: 1 },
                { q: "Heart has how many chambers?", opts: ["2", "3", "4", "5"], ans: 2 },
            ],
            medium: [
                { q: "Trachea = ?", opts: ["Food pipe", "Windpipe", "Blood vessel", "Nerve"], ans: 1 },
                { q: "Red blood cells made in?", opts: ["Liver", "Bone Marrow", "Spleen", "Kidneys"], ans: 1 },
                { q: "Largest bone in body?", opts: ["Humerus", "Femur", "Tibia", "Skull"], ans: 1 },
                { q: "Blood is filtered by:", opts: ["Lungs", "Heart", "Kidneys", "Stomach"], ans: 2 },
            ],
            hard: [
                { q: "Which chamber pumps blood to body?", opts: ["Right atrium", "Left atrium", "Right ventricle", "Left ventricle"], ans: 3 },
                { q: "Nervous system's basic unit?", opts: ["Cell", "Neuron", "Tissue", "Organ"], ans: 1 },
                { q: "Hemoglobin carries:", opts: ["Nutrients", "Oxygen", "Hormones", "Waste"], ans: 1 },
            ]
        },
        empathy: {
            easy: [
                { q: "Empathy means:", opts: ["Feeling sorry", "Understanding another's feelings", "Being strict", "Ignoring emotions"], ans: 1 },
                { q: "Showing empathy involves:", opts: ["Judging", "Listening carefully", "Giving orders", "Being indifferent"], ans: 1 },
                { q: "An empathetic person:", opts: ["Only talks", "Considers others' views", "Ignores feelings", "Is always happy"], ans: 1 },
                { q: "Empathy vs Sympathy:", opts: ["Same thing", "Empathy=feeling with, Sympathy=feeling for", "Opposite", "Unrelated"], ans: 1 },
            ],
            medium: [
                { q: "Empathy in medicine builds:", opts: ["Walls", "Patient trust", "Paperwork", "Nothing"], ans: 1 },
                { q: "EI includes:", opts: ["Only IQ", "Self-awareness and empathy", "Physical strength", "Memory"], ans: 1 },
                { q: "Active listening shows:", opts: ["Boredom", "Empathy and respect", "Superiority", "Impatience"], ans: 1 },
                { q: "Burnout can reduce:", opts: ["Salary", "Empathy", "Height", "Speed"], ans: 1 },
            ],
            hard: [
                { q: "Patient confidentiality means:", opts: ["Sharing freely", "Keeping info private", "Publishing results", "Telling everyone"], ans: 1 },
                { q: "Compassion fatigue affects:", opts: ["Machines", "Healthcare workers", "Buildings", "Software"], ans: 1 },
                { q: "Therapeutic communication is:", opts: ["Casual chat", "Purposeful patient interaction", "Texting", "Silent treatment"], ans: 1 },
            ]
        },
        research: {
            easy: [
                { q: "A hypothesis is:", opts: ["A proven fact", "A testable prediction", "A random guess", "Final conclusion"], ans: 1 },
                { q: "Research starts with:", opts: ["Conclusion", "A question", "Publication", "Award"], ans: 1 },
                { q: "Data means:", opts: ["Opinions", "Collected information", "Guesses", "Theories"], ans: 1 },
                { q: "A survey collects:", opts: ["Blood samples", "Responses from people", "Weather data", "Chemicals"], ans: 1 },
            ],
            medium: [
                { q: "Peer review means:", opts: ["Friends checking", "Expert evaluation", "Self-review", "Teacher grading"], ans: 1 },
                { q: "A control group gets:", opts: ["Treatment", "No treatment", "Extra treatment", "More food"], ans: 1 },
                { q: "Qualitative data is:", opts: ["Numerical", "Descriptive", "Binary", "Random"], ans: 1 },
                { q: "Plagiarism is:", opts: ["Original work", "Copying without credit", "A research method", "A chart type"], ans: 1 },
            ],
            hard: [
                { q: "Double-blind study means:", opts: ["No one sees", "Neither subjects nor researchers know groups", "Done in dark", "Two experiments"], ans: 1 },
                { q: "P-value < 0.05 means:", opts: ["Not significant", "Statistically significant", "Error", "No data"], ans: 1 },
                { q: "Meta-analysis combines:", opts: ["Chemicals", "Multiple study results", "Two patients", "Lab equipment"], ans: 1 },
            ]
        },
        critical_thinking: {
            easy: [
                { q: "Critical thinking involves:", opts: ["Criticizing others", "Analyzing evidence objectively", "Always disagreeing", "Following blindly"], ans: 1 },
                { q: "A fact is:", opts: ["An opinion", "Something proven true", "A guess", "A wish"], ans: 1 },
                { q: "Bias means:", opts: ["Fairness", "Unfair preference", "Accuracy", "Logic"], ans: 1 },
                { q: "Evidence-based decisions use:", opts: ["Feelings only", "Data and facts", "Rumors", "Assumptions"], ans: 1 },
            ],
            medium: [
                { q: "Confirmation bias is:", opts: ["Confirming results", "Favoring info matching beliefs", "Being confident", "Double-checking"], ans: 1 },
                { q: "A logical fallacy is:", opts: ["Strong argument", "Flawed reasoning", "Math formula", "Law"], ans: 1 },
                { q: "Correlation does NOT mean:", opts: ["Relationship", "Causation", "Connection", "Link"], ans: 1 },
                { q: "Source credibility depends on:", opts: ["Font size", "Author expertise and evidence", "Website color", "Article length"], ans: 1 },
            ],
            hard: [
                { q: "Ad hominem fallacy attacks:", opts: ["The argument", "The person", "The evidence", "The conclusion"], ans: 1 },
                { q: "Occam's Razor suggests:", opts: ["Use scissors", "Simplest explanation usually best", "Cut details", "Shave variables"], ans: 1 },
                { q: "Straw man fallacy:", opts: ["Building scarecrows", "Misrepresenting someone's argument", "Using data", "Asking questions"], ans: 1 },
                { q: "Deductive reasoning goes from:", opts: ["Specific to general", "General to specific", "Random to ordered", "Simple to complex"], ans: 1 },
            ]
        },
        public_speaking: {
            easy: [
                { q: "Eye contact while speaking:", opts: ["Is rude", "Builds connection", "Should be avoided", "Doesn't matter"], ans: 1 },
                { q: "Stage fright is:", opts: ["A disease", "Fear of public speaking", "A stage type", "A lighting effect"], ans: 1 },
                { q: "Speaking pace should be:", opts: ["Very fast", "Moderate and varied", "Extremely slow", "Monotone"], ans: 1 },
                { q: "Practice helps with:", opts: ["Nothing", "Building confidence", "Making more errors", "Forgetting content"], ans: 1 },
            ],
            medium: [
                { q: "Good speech opening should:", opts: ["Be boring", "Grab attention", "Start with apology", "Read from paper"], ans: 1 },
                { q: "Visual aids should be:", opts: ["Text-heavy", "Simple and clear", "Invisible", "Distracting"], ans: 1 },
                { q: "Pauses in speaking:", opts: ["Show weakness", "Add emphasis and clarity", "Should be avoided", "Are mistakes"], ans: 1 },
                { q: "Know your audience means:", opts: ["Memorize names", "Tailor content to listeners", "Ignore them", "Speak louder"], ans: 1 },
            ],
            hard: [
                { q: "Rhetoric means:", opts: ["Lying", "Art of persuasive speaking", "Loud voice", "Speed reading"], ans: 1 },
                { q: "Ethos, Pathos, Logos are:", opts: ["Greek gods", "Persuasion appeals", "Dance styles", "Food types"], ans: 1 },
                { q: "Impromptu speaking is:", opts: ["Prepared speech", "Speaking without preparation", "Written essay", "Silent communication"], ans: 1 },
            ]
        },
        history: {
            easy: [
                { q: "Indian Constitution adopted in:", opts: ["1947", "1949", "1950", "1952"], ans: 2 },
                { q: "Who discovered America?", opts: ["Vasco da Gama", "Columbus", "Magellan", "Cook"], ans: 1 },
                { q: "India got independence in:", opts: ["1945", "1946", "1947", "1948"], ans: 2 },
                { q: "Mahatma Gandhi is called:", opts: ["Iron Man", "Father of the Nation", "Emperor", "King"], ans: 1 },
            ],
            medium: [
                { q: "Father of Indian Constitution?", opts: ["Gandhi", "Nehru", "B.R. Ambedkar", "Patel"], ans: 2 },
                { q: "World War II ended in:", opts: ["1943", "1944", "1945", "1946"], ans: 2 },
                { q: "French Revolution started in:", opts: ["1776", "1789", "1799", "1812"], ans: 1 },
                { q: "First President of India?", opts: ["Nehru", "Rajendra Prasad", "Gandhi", "Ambedkar"], ans: 1 },
            ],
            hard: [
                { q: "Magna Carta signed in:", opts: ["1066", "1215", "1415", "1776"], ans: 1 },
                { q: "UN was established in:", opts: ["1940", "1945", "1950", "1955"], ans: 1 },
                { q: "Cold War was between:", opts: ["UK & France", "USA & USSR", "India & China", "Germany & Japan"], ans: 1 },
            ]
        },
        gk: {
            easy: [
                { q: "Capital of India?", opts: ["Mumbai", "Kolkata", "New Delhi", "Chennai"], ans: 2 },
                { q: "Red Planet?", opts: ["Venus", "Mars", "Jupiter", "Saturn"], ans: 1 },
                { q: "Largest ocean?", opts: ["Atlantic", "Indian", "Arctic", "Pacific"], ans: 3 },
                { q: "How many continents?", opts: ["5", "6", "7", "8"], ans: 2 },
            ],
            medium: [
                { q: "Currency of Japan?", opts: ["Yuan", "Won", "Yen", "Ringgit"], ans: 2 },
                { q: "Smallest country by area?", opts: ["Monaco", "Vatican City", "San Marino", "Liechtenstein"], ans: 1 },
                { q: "Olympic rings count?", opts: ["4", "5", "6", "7"], ans: 1 },
                { q: "Largest planet?", opts: ["Saturn", "Jupiter", "Neptune", "Uranus"], ans: 1 },
            ],
            hard: [
                { q: "Longest river in the world?", opts: ["Amazon", "Ganga", "Nile", "Mississippi"], ans: 2 },
                { q: "Who wrote 'Hamlet'?", opts: ["Dickens", "Shakespeare", "Tolkien", "Hemingway"], ans: 1 },
                { q: "Most abundant element in Earth's crust?", opts: ["Iron", "Silicon", "Oxygen", "Carbon"], ans: 2 },
            ]
        },
        financial_literacy: {
            easy: [
                { q: "GDP stands for?", opts: ["Gross Domestic Product", "General Domestic Price", "Global Dev Plan", "Grand Domestic Performance"], ans: 0 },
                { q: "A budget is:", opts: ["A savings account", "Plan for income & expenses", "A loan", "A tax form"], ans: 1 },
                { q: "Saving money means:", opts: ["Spending everything", "Keeping money for future", "Borrowing more", "Ignoring bills"], ans: 1 },
                { q: "A bank account stores:", opts: ["Food", "Money", "Clothes", "Books"], ans: 1 },
            ],
            medium: [
                { q: "Compound interest charges on:", opts: ["Principal only", "Principal + interest", "Nothing", "Fixed rate"], ans: 1 },
                { q: "Inflation means:", opts: ["Prices decreasing", "Prices increasing over time", "Currency strengthening", "Market crash"], ans: 1 },
                { q: "Stock market is for:", opts: ["Buying groceries", "Trading company shares", "Paying taxes", "Getting loans"], ans: 1 },
                { q: "EMI stands for:", opts: ["Extra Money Interest", "Equated Monthly Installment", "Electronic Money Input", "Easy Money Index"], ans: 1 },
            ],
            hard: [
                { q: "ROI stands for:", opts: ["Return on Investment", "Rate of Interest", "Risk of Inflation", "Revenue or Income"], ans: 0 },
                { q: "Diversification means:", opts: ["All money in one place", "Spreading investments", "Avoiding investments", "Borrowing money"], ans: 1 },
                { q: "A mutual fund is:", opts: ["A bank account", "Pooled investment from many investors", "A loan type", "Government bond only"], ans: 1 },
                { q: "Bull market means:", opts: ["Prices falling", "Prices rising", "No change", "Market closed"], ans: 1 },
            ]
        },
        marketing: {
            easy: [
                { q: "4 Ps of marketing?", opts: ["Price, Product, Place, Promotion", "Plan, Produce, Publish, Profit", "People, Process, Perform, Pay", "Price, Plan, Promote, Produce"], ans: 0 },
                { q: "A brand is:", opts: ["A product only", "Identity and reputation", "A price tag", "A store"], ans: 1 },
                { q: "Target audience means:", opts: ["Everyone", "Specific group of customers", "Competitors", "Employees"], ans: 1 },
                { q: "Advertising promotes:", opts: ["Hides products", "Products/services", "Reduces sales", "Increases costs"], ans: 1 },
            ],
            medium: [
                { q: "SEO stands for:", opts: ["Social Engine Operation", "Search Engine Optimization", "Sales Engine Output", "System Engagement Online"], ans: 1 },
                { q: "Social media marketing uses:", opts: ["TV only", "Platforms like Instagram/FB", "Newspapers only", "Radio only"], ans: 1 },
                { q: "USP stands for:", opts: ["Unique Sales Plan", "Unique Selling Proposition", "Universal Service Point", "User Support Program"], ans: 1 },
                { q: "Market research helps:", opts: ["Ignore customers", "Understand customer needs", "Increase waste", "Reduce quality"], ans: 1 },
            ],
            hard: [
                { q: "CTR stands for:", opts: ["Click Through Rate", "Customer Transfer Rate", "Content To Revenue", "Campaign Track Record"], ans: 0 },
                { q: "SWOT stands for:", opts: ["Sales, Work, Output, Time", "Strengths, Weaknesses, Opportunities, Threats", "System, Workflow, Operation, Target", "Strategy, Win, Optimize, Test"], ans: 1 },
                { q: "CRM stands for:", opts: ["Customer Relationship Management", "Cost Revenue Model", "Creative Resource Management", "Central Reporting Module"], ans: 0 },
            ]
        },
        leadership: {
            easy: [
                { q: "A good leader should:", opts: ["Command only", "Inspire and empower", "Do everything alone", "Avoid feedback"], ans: 1 },
                { q: "Leadership involves:", opts: ["Only giving orders", "Guiding and motivating", "Working alone", "Avoiding responsibility"], ans: 1 },
                { q: "Teamwork means:", opts: ["Working alone", "Collaborating with others", "Competing against team", "Ignoring others"], ans: 1 },
                { q: "A mentor is:", opts: ["A competitor", "An experienced guide", "A stranger", "A critic only"], ans: 1 },
            ],
            medium: [
                { q: "Delegation means:", opts: ["Do it yourself", "Assigning tasks to others", "Avoiding work", "Quitting"], ans: 1 },
                { q: "Servant leadership focuses on:", opts: ["Self-interest", "Serving the team", "Punishing errors", "Micromanaging"], ans: 1 },
                { q: "Decision-making requires:", opts: ["Only speed", "Analysis and judgment", "Guessing", "Flipping a coin"], ans: 1 },
                { q: "Accountability means:", opts: ["Blaming others", "Taking responsibility", "Hiding mistakes", "Making excuses"], ans: 1 },
            ],
            hard: [
                { q: "EQ measures:", opts: ["IQ", "Emotional intelligence", "Fitness", "Tech skills"], ans: 1 },
                { q: "Transformational leadership:", opts: ["Maintains status quo", "Inspires change/innovation", "Avoids change", "Uses fear"], ans: 1 },
                { q: "Situational leadership adapts to:", opts: ["Weather", "Context and team maturity", "Personal moods", "Office location"], ans: 1 },
            ]
        },
        creativity: {
            easy: [
                { q: "Brainstorming is:", opts: ["Studying brains", "Generating ideas freely", "Criticizing ideas", "Copying"], ans: 1 },
                { q: "Creativity means:", opts: ["Copying others", "Thinking of new ideas", "Following rules only", "Being rigid"], ans: 1 },
                { q: "Innovation is:", opts: ["Nothing new", "Implementing creative ideas", "Avoiding change", "Repeating old methods"], ans: 1 },
                { q: "Mind mapping helps:", opts: ["Sleep", "Organize ideas visually", "Cook food", "Drive cars"], ans: 1 },
            ],
            medium: [
                { q: "Design thinking is:", opts: ["Only for designers", "Human-centered problem solving", "Drawing pictures", "Computer design"], ans: 1 },
                { q: "Iteration means:", opts: ["Doing once", "Repeating and improving", "Giving up", "Starting fresh"], ans: 1 },
                { q: "Lateral thinking involves:", opts: ["Straight logic", "Looking at problems differently", "Following rules", "Memorizing"], ans: 1 },
                { q: "Creativity can be:", opts: ["Only born with", "Learned and practiced", "Never improved", "Only for artists"], ans: 1 },
            ],
            hard: [
                { q: "A prototype is:", opts: ["Final product", "Early model for testing", "Marketing plan", "Report"], ans: 1 },
                { q: "SCAMPER technique is for:", opts: ["Running", "Creative idea generation", "Cooking", "Driving"], ans: 1 },
                { q: "Divergent thinking produces:", opts: ["One answer", "Many possible solutions", "No answers", "Exact copies"], ans: 1 },
            ]
        },
        negotiation: {
            easy: [
                { q: "Win-win negotiation:", opts: ["Only you win", "Both benefit", "Nobody wins", "Stronger wins"], ans: 1 },
                { q: "Negotiation is:", opts: ["Fighting", "Discussion to reach agreement", "Giving up", "Ignoring others"], ans: 1 },
                { q: "Compromise means:", opts: ["Getting everything", "Both sides giving a little", "Walking away", "Winning alone"], ans: 1 },
                { q: "Good negotiators:", opts: ["Only talk", "Listen and understand needs", "Threaten", "Lie"], ans: 1 },
            ],
            medium: [
                { q: "BATNA stands for:", opts: ["Best Alternative To Negotiated Agreement", "Business Agreement Terms", "Buy And Trade New Assets", "Best Ask To Negotiate"], ans: 0 },
                { q: "Preparation before negotiation:", opts: ["Not needed", "Essential for success", "Waste of time", "Only for experts"], ans: 1 },
                { q: "Body language in negotiation:", opts: ["Irrelevant", "Communicates confidence", "Should be hidden", "Is distracting"], ans: 1 },
                { q: "Walking away can be:", opts: ["Always bad", "Sometimes a valid strategy", "Never acceptable", "Illegal"], ans: 1 },
            ],
            hard: [
                { q: "Anchoring is:", opts: ["Dropping anchor", "Setting first offer as reference", "Ending deal", "Walking away"], ans: 1 },
                { q: "ZOPA is:", opts: ["A place", "Overlap where deal can happen", "A person", "A document"], ans: 1 },
                { q: "Principled negotiation focuses on:", opts: ["Positions", "Interests behind positions", "Threats", "Power"], ans: 1 },
            ]
        },
        digital_literacy: {
            easy: [
                { q: "Cloud computing is:", opts: ["Computing in sky", "Storing data via internet", "Weather forecasting", "A laptop type"], ans: 1 },
                { q: "A strong password has:", opts: ["Just numbers", "Mix of letters, numbers, symbols", "Your name", "Single word"], ans: 1 },
                { q: "Wi-Fi stands for:", opts: ["Wireless Fidelity", "Wired Finance", "Wide Frequency", "Web Interface"], ans: 0 },
                { q: "Email attachment is:", opts: ["A virus always", "A file sent with email", "Spam", "An ad"], ans: 1 },
            ],
            medium: [
                { q: "Phishing means:", opts: ["Online fishing", "Fraudulent info theft", "A search engine", "Social media posting"], ans: 1 },
                { q: "VPN stands for:", opts: ["Virtual Private Network", "Very Public Network", "Visual Processing Node", "Video Play Network"], ans: 0 },
                { q: "Malware is:", opts: ["Good software", "Malicious software", "A hardware device", "A browser"], ans: 1 },
                { q: "HTTPS is secure because it:", opts: ["Is faster", "Encrypts data", "Is newer", "Uses more colors"], ans: 1 },
            ],
            hard: [
                { q: "2FA is:", opts: ["Two passwords", "Extra security verification layer", "Two accounts", "Double login"], ans: 1 },
                { q: "Blockchain is:", opts: ["A game", "Distributed ledger technology", "A browser", "A virus"], ans: 1 },
                { q: "Ransomware is:", opts: ["Helpful tool", "Malware locking data for payment", "Browser plugin", "Operating system"], ans: 1 },
            ]
        }
    };

    // Enemy characters
    const ENEMIES = {
        programming: { emoji: '🐛', name: 'Code Bug', color: '#ff4444' },
        mathematics: { emoji: '👹', name: 'Math Demon', color: '#ff6b6b' },
        logic: { emoji: '🧙‍♂️', name: 'Logic Wizard', color: '#9a6fd8' },
        physics: { emoji: '⚡', name: 'Force Phantom', color: '#ffa94d' },
        english: { emoji: '📖', name: 'Grammar Ghost', color: '#4fa8d1' },
        cs_fundamentals: { emoji: '🤖', name: 'Cyber Golem', color: '#4fa8d1' },
        problem_solving: { emoji: '🧩', name: 'Puzzle Master', color: '#c8a2ff' },
        communication: { emoji: '🗣️', name: 'Silence Wraith', color: '#8be09b' },
        biology: { emoji: '🦠', name: 'Bio Beast', color: '#4CAF50' },
        chemistry: { emoji: '🧪', name: 'Acid Alchemist', color: '#ff9800' },
        anatomy: { emoji: '💀', name: 'Bone Reaper', color: '#e0e0e0' },
        empathy: { emoji: '🥶', name: 'Cold Heart', color: '#64b5f6' },
        research: { emoji: '🔬', name: 'Data Dragon', color: '#ab47bc' },
        critical_thinking: { emoji: '🧠', name: 'Mind Minotaur', color: '#ec407a' },
        public_speaking: { emoji: '👻', name: 'Stage Phantom', color: '#78909c' },
        history: { emoji: '⚔️', name: 'Time Knight', color: '#8d6e63' },
        gk: { emoji: '🌍', name: 'World Sphinx', color: '#26a69a' },
        financial_literacy: { emoji: '💸', name: 'Debt Dragon', color: '#ffd859' },
        marketing: { emoji: '📢', name: 'Noise Troll', color: '#ff7043' },
        leadership: { emoji: '👑', name: 'Chaos King', color: '#ffd54f' },
        creativity: { emoji: '🎭', name: 'Blank Canvas', color: '#ba68c8' },
        negotiation: { emoji: '🤝', name: 'Deal Breaker', color: '#ef5350' },
        digital_literacy: { emoji: '🦹', name: 'Hacker Villain', color: '#66bb6a' },
    };

    // Difficulty config per level
    const LEVEL_CONFIG = [
        { tier: 'easy',   time: 20, label: 'Lv.1 — EASY',   heroDmg: 15, enemyDmg: 15, xpBase: 20 },
        { tier: 'easy',   time: 18, label: 'Lv.2 — EASY',   heroDmg: 18, enemyDmg: 18, xpBase: 25 },
        { tier: 'medium', time: 15, label: 'Lv.3 — MEDIUM', heroDmg: 20, enemyDmg: 22, xpBase: 35 },
        { tier: 'medium', time: 12, label: 'Lv.4 — HARD',   heroDmg: 25, enemyDmg: 25, xpBase: 45 },
        { tier: 'hard',   time: 10, label: 'BOSS — Q5',     heroDmg: 30, enemyDmg: 30, xpBase: 60 },
    ];

    // ============================================================
    //  GAME STATE
    // ============================================================
    let gs = null;

    // ============================================================
    //  LAUNCH
    // ============================================================
    window.launchQuestGame = function (skillId, skillName, heroEmoji, heroName, xpReward, coinReward, onComplete) {
        const bank = QUIZ_BANK[skillId];
        if (!bank) { if (onComplete) onComplete(true, xpReward, coinReward); return; }

        // Pick 5 unique questions: 2 easy, 2 medium, 1 hard
        const pick = (arr, n) => [...arr].sort(() => Math.random() - 0.5).slice(0, n);
        const easy = pick(bank.easy || [], 2);
        const med = pick(bank.medium || [], 2);
        const hard = pick(bank.hard || [], 1);
        let questions = [...easy, ...med, ...hard];
        // Deduplicate & pad if not enough
        const seen = new Set(questions.map(q => q.q));
        while (questions.length < 5) {
            const pool = [...(bank.easy||[]), ...(bank.medium||[]), ...(bank.hard||[])].filter(q => !seen.has(q.q));
            if (pool.length === 0) break;
            const extra = pool[Math.floor(Math.random() * pool.length)];
            seen.add(extra.q);
            questions.push(extra);
        }

        const enemy = ENEMIES[skillId] || { emoji: '👾', name: 'Unknown Foe', color: '#ff4444' };

        gs = {
            skillId, skillName,
            hero: { emoji: heroEmoji, name: heroName, hearts: 5, maxHearts: 5 },
            enemy: { ...enemy, hearts: 5, maxHearts: 5 },
            questions,
            currentQ: 0,
            combo: 0, maxCombo: 0, correct: 0,
            xpEarned: 0, coinsEarned: 0,
            xpReward, coinReward,
            onComplete, answered: false, timer: null
        };

        renderOverlay();
        showLevel();
    };

    // ============================================================
    //  RENDER OVERLAY
    // ============================================================
    function renderOverlay() {
        const old = document.getElementById('questGameOverlay');
        if (old) old.remove();

        const ov = document.createElement('div');
        ov.id = 'questGameOverlay';
        ov.className = 'qg-overlay';
        ov.innerHTML = `<div class="qg-container">
            <div class="qg-header">
                <h2 class="qg-title">⚔️ SKILL QUEST: ${gs.skillName}</h2>
                <div class="qg-question-count">Question <span id="qgQNum">1</span>/5</div>
            </div>

            <!-- ARENA -->
            <div class="qg-arena">
                <div class="qg-fighter qg-hero-side">
                    <div class="qg-hearts" id="qgHeroHearts">${heartsHTML(gs.hero.hearts)}</div>
                    <div class="qg-char" id="qgHeroChar">${gs.hero.emoji}</div>
                    <div class="qg-char-label">${gs.hero.name}</div>
                    <div class="qg-float-text" id="qgHeroFloat"></div>
                </div>
                <div class="qg-vs-center">
                    <div class="qg-vs-badge">VS</div>
                    <div class="qg-countdown" id="qgCountdown">
                        <svg class="qg-ring" viewBox="0 0 80 80">
                            <circle class="qg-ring-bg" cx="40" cy="40" r="34"/>
                            <circle class="qg-ring-fg" id="qgRingFg" cx="40" cy="40" r="34"/>
                        </svg>
                        <span class="qg-ring-num" id="qgTimerNum">20</span>
                    </div>
                </div>
                <div class="qg-fighter qg-enemy-side">
                    <div class="qg-hearts" id="qgEnemyHearts">${heartsHTML(gs.enemy.hearts)}</div>
                    <div class="qg-char" id="qgEnemyChar">${gs.enemy.emoji}</div>
                    <div class="qg-char-label" style="color:${gs.enemy.color}">${gs.enemy.name}</div>
                    <div class="qg-float-text" id="qgEnemyFloat"></div>
                </div>
            </div>

            <!-- LEVEL PROGRESS -->
            <div class="qg-level-track" id="qgLevelTrack">
                <div class="qg-lvl active" data-lvl="0"><span>1</span></div>
                <div class="qg-lvl-dots">· · · · · · ·</div>
                <div class="qg-lvl" data-lvl="1"><span>2</span></div>
                <div class="qg-lvl-dots">· · · · · · ·</div>
                <div class="qg-lvl" data-lvl="2"><span>3</span></div>
                <div class="qg-lvl-dots">· · · · · · ·</div>
                <div class="qg-lvl" data-lvl="3"><span>4</span></div>
                <div class="qg-lvl-dots">· · · · · · ·</div>
                <div class="qg-lvl boss" data-lvl="4"><span>Q5</span></div>
            </div>

            <!-- DIFFICULTY & COMBO -->
            <div class="qg-diff-row">
                <span class="qg-diff-badge" id="qgDiffBadge">Lv.1 — EASY</span>
                <span class="qg-combo-badge" id="qgCombo" style="display:none">🔥 <span id="qgComboN">0</span>x COMBO</span>
            </div>

            <!-- QUESTION -->
            <div class="qg-question" id="qgQuestion"></div>

            <!-- OPTIONS -->
            <div class="qg-options" id="qgOptions"></div>

            <!-- FEEDBACK -->
            <div class="qg-feedback" id="qgFeedback" style="display:none"></div>

            <!-- XP BAR -->
            <div class="qg-xp-bar">
                <span>XP: <strong id="qgXp">0</strong></span>
                <span>Combo: <strong id="qgMaxCombo">0</strong>x</span>
                <span>Score: <strong id="qgScore">0</strong>/5</span>
            </div>
        </div>`;
        document.body.appendChild(ov);
        requestAnimationFrame(() => ov.classList.add('qg-show'));
    }

    function heartsHTML(count) {
        let s = '';
        for (let i = 0; i < 5; i++) s += i < count ? '❤️' : '🖤';
        return s;
    }

    // ============================================================
    //  SHOW LEVEL / QUESTION
    // ============================================================
    function showLevel() {
        if (gs.currentQ >= 5) { endGame(gs.hero.hearts > 0); return; }
        if (gs.hero.hearts <= 0) { endGame(false); return; }
        if (gs.enemy.hearts <= 0) { endGame(true); return; }

        const cfg = LEVEL_CONFIG[gs.currentQ];
        const q = gs.questions[gs.currentQ];
        gs.answered = false;

        // Update UI
        document.getElementById('qgQNum').textContent = gs.currentQ + 1;
        document.getElementById('qgDiffBadge').textContent = cfg.label;
        document.getElementById('qgDiffBadge').className = 'qg-diff-badge ' +
            (cfg.tier === 'easy' ? 'easy' : cfg.tier === 'medium' ? 'medium' : 'hard');
        document.getElementById('qgQuestion').textContent = q.q;

        // Update level track
        document.querySelectorAll('.qg-lvl').forEach(el => {
            const lvl = parseInt(el.dataset.lvl);
            el.classList.remove('active', 'done');
            if (lvl < gs.currentQ) el.classList.add('done');
            if (lvl === gs.currentQ) el.classList.add('active');
        });

        // Options
        const optDiv = document.getElementById('qgOptions');
        optDiv.innerHTML = '';
        const allLabels = ['A', 'B', 'C', 'D'];
        q.opts.forEach((opt, i) => {
            const btn = document.createElement('button');
            btn.className = 'qg-opt-btn';
            btn.innerHTML = `<span class="qg-opt-label">${allLabels[i]}</span> — ${opt}`;
            btn.addEventListener('click', () => handleAnswer(i));
            optDiv.appendChild(btn);
        });

        document.getElementById('qgFeedback').style.display = 'none';

        // Circular countdown timer
        let timeLeft = cfg.time;
        const circumference = 2 * Math.PI * 34; // r=34
        const ringFg = document.getElementById('qgRingFg');
        const timerNum = document.getElementById('qgTimerNum');
        const countdown = document.getElementById('qgCountdown');

        ringFg.style.strokeDasharray = circumference;
        ringFg.style.strokeDashoffset = '0';
        timerNum.textContent = timeLeft;
        countdown.className = 'qg-countdown';

        clearInterval(gs.timer);
        gs.timer = setInterval(() => {
            timeLeft--;
            timerNum.textContent = Math.max(0, timeLeft);
            const pct = 1 - (timeLeft / cfg.time);
            ringFg.style.strokeDashoffset = (pct * circumference).toString();

            // Color transitions
            if (timeLeft <= 3) {
                ringFg.style.stroke = '#ff4444';
                countdown.className = 'qg-countdown qg-timer-critical';
            } else if (timeLeft <= cfg.time * 0.4) {
                ringFg.style.stroke = '#ffa94d';
            } else {
                ringFg.style.stroke = '#4CAF50';
            }

            if (timeLeft <= 0) { clearInterval(gs.timer); handleAnswer(-1); }
        }, 1000);
    }

    // ============================================================
    //  HANDLE ANSWER
    // ============================================================
    function handleAnswer(sel) {
        if (gs.answered) return;
        gs.answered = true;
        clearInterval(gs.timer);

        const q = gs.questions[gs.currentQ];
        const cfg = LEVEL_CONFIG[gs.currentQ];
        const correct = sel === q.ans;
        const opts = document.querySelectorAll('.qg-opt-btn');
        const fb = document.getElementById('qgFeedback');

        opts.forEach((btn, i) => {
            btn.style.pointerEvents = 'none';
            if (i === q.ans) btn.classList.add('qg-correct');
            if (i === sel && !correct) btn.classList.add('qg-wrong');
        });

        if (correct) {
            gs.combo++;
            if (gs.combo > gs.maxCombo) gs.maxCombo = gs.combo;
            gs.correct++;

            // Hearts damage
            const heartsLost = gs.combo >= 3 ? 2 : 1;
            gs.enemy.hearts = Math.max(0, gs.enemy.hearts - heartsLost);
            document.getElementById('qgEnemyHearts').innerHTML = heartsHTML(gs.enemy.hearts);

            // XP
            const xpGain = cfg.xpBase + (gs.combo * 10);
            gs.xpEarned += xpGain;

            // Animate
            animateAttack('hero');
            showFloatText('enemy', `-${heartsLost} ❤️`, '#ff4444');
            showFloatText('hero', `XP +${xpGain}`, '#aadeab');
            showCombo();
            updateStats();

            fb.style.display = 'block';
            fb.className = 'qg-feedback qg-fb-correct';
            fb.innerHTML = `✅ Correct! <span class="qg-xp-gain">+${xpGain} XP</span>`;
        } else {
            gs.combo = 0;
            gs.hero.hearts = Math.max(0, gs.hero.hearts - 1);
            document.getElementById('qgHeroHearts').innerHTML = heartsHTML(gs.hero.hearts);

            animateAttack('enemy');
            showFloatText('hero', `-1 ❤️`, '#ff4444');
            hideCombo();
            updateStats();

            fb.style.display = 'block';
            fb.className = 'qg-feedback qg-fb-wrong';
            fb.innerHTML = sel === -1
                ? `⏰ Time's up! Answer: <strong>${q.opts[q.ans]}</strong>`
                : `❌ Wrong! Answer: <strong>${q.opts[q.ans]}</strong>`;
        }

        if (gs.enemy.hearts <= 0) { setTimeout(() => endGame(true), 1300); return; }
        if (gs.hero.hearts <= 0) { setTimeout(() => endGame(false), 1300); return; }

        gs.currentQ++;
        setTimeout(() => showLevel(), 2000);
    }

    // ============================================================
    //  ANIMATIONS & UI HELPERS
    // ============================================================
    function animateAttack(who) {
        const heroEl = document.getElementById('qgHeroChar');
        const enemyEl = document.getElementById('qgEnemyChar');
        if (who === 'hero') {
            heroEl.classList.add('qg-attack-right');
            setTimeout(() => { heroEl.classList.remove('qg-attack-right'); enemyEl.classList.add('qg-hit'); setTimeout(() => enemyEl.classList.remove('qg-hit'), 400); }, 300);
        } else {
            enemyEl.classList.add('qg-attack-left');
            setTimeout(() => { enemyEl.classList.remove('qg-attack-left'); heroEl.classList.add('qg-hit'); setTimeout(() => heroEl.classList.remove('qg-hit'), 400); }, 300);
        }
    }

    function showFloatText(side, text, color) {
        const el = document.getElementById(side === 'hero' ? 'qgHeroFloat' : 'qgEnemyFloat');
        if (!el) return;
        el.textContent = text;
        el.style.color = color;
        el.classList.remove('qg-float-anim');
        el.offsetHeight;
        el.classList.add('qg-float-anim');
    }

    function showCombo() {
        const el = document.getElementById('qgCombo');
        if (el && gs.combo >= 2) {
            el.style.display = 'inline-flex';
            document.getElementById('qgComboN').textContent = gs.combo;
            el.classList.add('qg-combo-pop');
            setTimeout(() => el.classList.remove('qg-combo-pop'), 500);
        }
    }
    function hideCombo() { const el = document.getElementById('qgCombo'); if (el) el.style.display = 'none'; }

    function updateStats() {
        document.getElementById('qgXp').textContent = gs.xpEarned;
        document.getElementById('qgMaxCombo').textContent = gs.maxCombo;
        document.getElementById('qgScore').textContent = gs.correct;
    }

    // ============================================================
    //  END GAME
    // ============================================================
    function endGame(victory) {
        clearInterval(gs.timer);
        const c = document.querySelector('.qg-container');
        if (!c) return;

        let finalXp = victory ? gs.xpReward + gs.xpEarned : Math.floor(gs.xpEarned / 2);
        let finalCoins = victory ? gs.coinReward : 0;
        const comboBonus = gs.maxCombo >= 3 ? Math.floor(finalXp * 0.25) : 0;
        finalXp += comboBonus;

        c.innerHTML = `<div class="qg-end-screen ${victory ? 'qg-victory' : 'qg-defeat'}">
            <div class="qg-end-emoji">${victory ? '🏆' : '💀'}</div>
            <h2 class="qg-end-title">${victory ? 'VICTORY!' : 'DEFEATED!'}</h2>
            <p class="qg-end-sub">${victory
            ? `You defeated ${gs.enemy.name}! ${gs.skillName} conquered!`
            : `${gs.enemy.name} won. Train and retry!`}</p>
            <div class="qg-end-stats">
                <div class="qg-end-stat"><span class="qg-end-val">${gs.correct}/5</span><span class="qg-end-lbl">CORRECT</span></div>
                <div class="qg-end-stat"><span class="qg-end-val">${gs.maxCombo}x</span><span class="qg-end-lbl">MAX COMBO</span></div>
                <div class="qg-end-stat"><span class="qg-end-val">+${finalXp}</span><span class="qg-end-lbl">XP EARNED</span></div>
                <div class="qg-end-stat"><span class="qg-end-val">+${finalCoins}</span><span class="qg-end-lbl">COINS</span></div>
            </div>
            ${comboBonus > 0 ? `<div class="qg-bonus">🔥 Combo Bonus: +${comboBonus} XP!</div>` : ''}
            <div class="qg-end-actions">
                ${!victory ? '<button class="qg-retry-btn" id="qgRetry">⚔️ Retry</button>' : ''}
                <button class="qg-close-btn" id="qgClose">${victory ? '✅ Collect Rewards' : '← Back'}</button>
            </div>
        </div>`;

        if (victory) spawnCelebration();

        document.getElementById('qgClose').addEventListener('click', () => {
            const ov = document.getElementById('questGameOverlay');
            if (ov) { ov.classList.remove('qg-show'); setTimeout(() => ov.remove(), 400); }
            if (gs.onComplete) gs.onComplete(victory, finalXp, finalCoins);
        });
        const retry = document.getElementById('qgRetry');
        if (retry) retry.addEventListener('click', () => {
            document.getElementById('questGameOverlay').remove();
            window.launchQuestGame(gs.skillId, gs.skillName, gs.hero.emoji, gs.hero.name, gs.xpReward, gs.coinReward, gs.onComplete);
        });
    }

    function spawnCelebration() {
        const em = ['⭐','🌟','✨','💫','🎉','🎊','💰','🏆'];
        const c = document.querySelector('.qg-end-screen');
        if (!c) return;
        for (let i = 0; i < 20; i++) {
            const p = document.createElement('span');
            p.className = 'qg-celeb';
            p.textContent = em[Math.floor(Math.random()*em.length)];
            p.style.left = Math.random()*100+'%';
            p.style.animationDelay = Math.random()*2+'s';
            p.style.animationDuration = (2+Math.random()*2)+'s';
            c.appendChild(p);
        }
    }

})();
