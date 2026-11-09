// ============================================================================
// CAMBRIDGE ENGLISH: PRE A1 STARTERS — DATOS OFICIALES VOLUMEN 1 Y VOLUMEN 2
// Simulador Interactivo 3.º Grado — Examen: Sábado 14 de noviembre de 2026
// ============================================================================

window.STARTERS_DATA = {
  student: {
    defaultName: "Alumno/a",
    grade: "3.º Grado (CABA)",
    examDate: "2026-11-14T09:00:00-03:00",
    examDateFormatted: "Sábado 14 de noviembre de 2026"
  },

  // Estuche ("Ziploc virtual") con lápiz negro, goma y los 9 colores exactos de la citación
  pencilCase: [
    { id: "pencil", label: "PENCIL", es: "Lápiz negro", hex: "#1e293b", type: "pencil", icon: "✏️" },
    { id: "eraser", label: "ERASER", es: "Goma de borrar", hex: "#f8fafc", type: "eraser", icon: "🧼" },
    { id: "red",    label: "RED",    es: "Rojo",         hex: "#ef4444", fillHex: "rgba(239, 68, 68, 0.72)", type: "color" },
    { id: "blue",   label: "BLUE",   es: "Azul",         hex: "#2563eb", fillHex: "rgba(37, 99, 235, 0.72)", type: "color" },
    { id: "yellow", label: "YELLOW", es: "Amarillo",     hex: "#eab308", fillHex: "rgba(250, 204, 21, 0.78)", type: "color" },
    { id: "green",  label: "GREEN",  es: "Verde",        hex: "#16a34a", fillHex: "rgba(22, 163, 74, 0.72)", type: "color" },
    { id: "orange", label: "ORANGE", es: "Naranja",      hex: "#f97316", fillHex: "rgba(249, 115, 22, 0.76)", type: "color" },
    { id: "purple", label: "PURPLE / VIOLET", es: "Violeta", hex: "#9333ea", fillHex: "rgba(147, 51, 234, 0.72)", type: "color" },
    { id: "pink",   label: "PINK",   es: "Rosa",         hex: "#ec4899", fillHex: "rgba(236, 72, 153, 0.72)", type: "color" },
    { id: "brown",  label: "BROWN",  es: "Marrón",       hex: "#854d0e", fillHex: "rgba(133, 77, 14, 0.74)", type: "color" },
    { id: "grey",   label: "GREY",   es: "Gris",         hex: "#64748b", fillHex: "rgba(100, 116, 139, 0.72)", type: "color" }
  ],

  // Lista oficial de los 20 nombres propios que entran en Listening Part 2 (Wordlist pág. 17/31)
  officialNames: [
    "Alex", "Alice", "Ann", "Anna", "Ben", "Bill", "Dan", "Eva", "Grace", "Hugo",
    "Jill", "Kim", "Lucy", "Mark", "Matt", "May", "Nick", "Pat", "Sam", "Sue", "Tom"
  ],

  // Equivalencias numéricas oficiales (0 a 20) para Listening Part 2 y R&W Part 5
  numberWords: {
    "0": ["0", "zero"],
    "1": ["1", "one"],
    "2": ["2", "two"],
    "3": ["3", "three"],
    "4": ["4", "four"],
    "5": ["5", "five"],
    "6": ["6", "six"],
    "7": ["7", "seven"],
    "8": ["8", "eight"],
    "9": ["9", "nine"],
    "10": ["10", "ten"],
    "11": ["11", "eleven"],
    "12": ["12", "twelve"],
    "13": ["13", "thirteen"],
    "14": ["14", "fourteen"],
    "15": ["15", "fifteen"],
    "16": ["16", "sixteen"],
    "17": ["17", "seventeen"],
    "18": ["18", "eighteen"],
    "19": ["19", "nineteen"],
    "20": ["20", "twenty"]
  },

  volumes: {
    // ========================================================================
    // VOLUMEN 1 (Sample Papers 2018 — Volume 1)
    // ========================================================================
    vol1: {
      id: "vol1",
      title: "Sample Paper — Volume 1",
      subtitle: "Examen Oficial de Muestra N.º 1",
      badge: "Volumen 1",

      listening: {
        durationMinutes: 20,
        fullAudio: " pre-a1-starters-a1-movers-a2-flyers-vol-1/starters-sample-listening-2018.mp3".trim(),

        part1: {
          title: "Part 1",
          subtitle: "– 5 questions –",
          instruction: "Listen and draw lines. There is one example.",
          tipEs: "Elegí el lápiz negro (PENCIL) en tu Ziploc y trazá una línea desde cada nombre hasta la persona correcta en el parque. (Sobrará 1 nombre).",
          audio: "assets/audio/vol1/part1.mp3",
          sceneImg: "assets/images/vol1/l_p1_scene.webp",
          example: {
            nameId: "Pat",
            targetId: "boy_with_cats",
            description: "Pat → boy holding one cat in his arms"
          },
          names: [
            { id: "Sue",  label: "Sue",  x: 12.5, y: 3.0,  box: [5.5, 0.5, 19.5, 6.2] },
            { id: "Ann",  label: "Ann",  x: 38.0, y: 3.0,  box: [31.0, 0.5, 45.0, 6.2] },
            { id: "Lucy", label: "Lucy", x: 64.5, y: 3.0,  box: [57.5, 0.5, 71.5, 6.2] },
            { id: "Nick", label: "Nick", x: 89.0, y: 3.0,  box: [82.0, 0.5, 96.0, 6.2] },
            { id: "Pat",  label: "Pat",  x: 10.0, y: 97.2, box: [4.0, 94.0, 17.5, 99.5], isExample: true },
            { id: "Jill", label: "Jill", x: 49.2, y: 97.2, box: [42.5, 94.0, 56.0, 99.5] },
            { id: "Dan",  label: "Dan",  x: 89.0, y: 97.2, box: [82.0, 94.0, 96.0, 99.5] }
          ],
          targets: [
            { id: "girl_behind_tree",   label: "girl behind the pear tree", x: 77.0, y: 37.5, box: [68.0, 32.0, 84.0, 44.0] },
            { id: "girl_feeding_ducks", label: "girl feeding the ducks",    x: 58.0, y: 62.5, box: [50.0, 46.5, 68.5, 79.0] },
            { id: "boy_with_kite",      label: "boy in red T-shirt with kite", x: 37.5, y: 46.5, box: [24.5, 35.5, 48.5, 56.5] },
            { id: "girl_reading",       label: "girl reading on bench",     x: 19.0, y: 31.5, box: [11.5, 22.5, 25.5, 40.5] },
            { id: "boy_on_bike",        label: "boy riding a bike",         x: 45.5, y: 27.5, box: [37.5, 18.5, 52.5, 36.5] },
            { id: "boy_with_cats",      label: "boy with the cats (Pat)",   x: 14.5, y: 60.0, box: [5.5, 48.5, 23.5, 70.5], isExample: true },
            { id: "boy_in_tree",        label: "boy up in the pear tree",   x: 80.0, y: 23.5, box: [73.0, 13.5, 86.5, 32.0] }
          ],
          markingKey: [
            { q: 1, nameId: "Lucy", targetId: "girl_behind_tree",   desc: "Lucy → girl behind tree (niña detrás del árbol de peras)" },
            { q: 2, nameId: "Jill", targetId: "girl_feeding_ducks", desc: "Jill → girl feeding ducks (niña dándole pan a los patos)" },
            { q: 3, nameId: "Dan",  targetId: "boy_with_kite",      desc: "Dan → boy with kite (niño de remera roja con barrilete)" },
            { q: 4, nameId: "Ann",  targetId: "girl_reading",       desc: "Ann → girl reading (niña leyendo en el banco)" },
            { q: 5, nameId: "Nick", targetId: "boy_on_bike",        desc: "Nick → boy on bike (niño andando en bicicleta)" }
          ],
          tapescript: `R: Look at Part 1. Look at the picture. Listen and look. There is one example.
Mch: Here's a photo of me and my friends in the park, Miss Box.
F: Oh yes! Who's that? The boy with the cats.
Mch: His name's Pat. He's holding one cat in his arms! Pat loves animals.
F: That's good.
R: Can you see the line? This is an example. Now you listen and draw lines.

[1] F: There's a girl here, too. She's behind the pear tree!
Mch: Yes. She's funny. Her name's Lucy.
F: And what's Lucy doing behind that tree?
Mch: Sorry! I don't know. Playing a game?

[2] Mch: And there's Jill. She's got some bread in her hand.
F: Is she giving it to the ducks?
Mch: Yes! Jill loves ducks.
F: Me too!

[3] F: That's a great kite!
Mch: Yes, that's Dan's kite.
F: Is Dan the boy in the red T-shirt?
Mch: Yes, that's right.

[4] F: One person is reading. What's her name?
Mch: The girl with the book?
F: Yes.
Mch: That's my friend Ann. Reading is Ann's favourite hobby.

[5] F: And what's that boy's name? The boy on the bike.
Mch: That's Nick. Nick's in my class at school.
F: Oh! He's got a nice bike!
Mch: I know! It's new. He loves it.`
        },

        part2: {
          title: "Part 2",
          subtitle: "– 5 questions –",
          instruction: "Read the question. Listen and write a name or a number. There are two examples.",
          tipEs: "Escuchá con atención el deletreo letra por letra o el número. Podés escribir los números en cifras (ej. 15) o en letras (fifteen).",
          audio: "assets/audio/vol1/part2.mp3",
          sceneImg: "assets/images/vol1/l_p2_scene.webp",
          examples: [
            { prompt: "What is the new girl’s name?", answer: "Kim" },
            { prompt: "How old is the new girl?", answer: "8" }
          ],
          questions: [
            { q: 1, prompt: "What is Kim’s family name?", prefix: "", suffix: "", accepted: ["wall"], displayKey: "Wall (W-A-L-L)", hintEs: "El profesor dice que es su apellido también: W-A-L-L." },
            { q: 2, prompt: "Where does Kim live?", prefix: "in", suffix: "Street", accepted: ["sun"], displayKey: "Sun (S-U-N)", hintEs: "Vive detrás del zoológico en S-U-N Street." },
            { q: 3, prompt: "What number is Kim’s house?", prefix: "", suffix: "", accepted: ["15", "fifteen"], displayKey: "15 / fifteen", hintEs: "Es la casa número 15 con puerta rosa." },
            { q: 4, prompt: "What is the name of Kim’s horse?", prefix: "", suffix: "", accepted: ["tiger"], displayKey: "Tiger (T-I-G-E-R)", hintEs: "Su caballo tiene nombre de felino: T-I-G-E-R." },
            { q: 5, prompt: "How old is Kim’s horse?", prefix: "", suffix: "", accepted: ["7", "seven"], displayKey: "7 / seven", hintEs: "Su caballo tiene 7 (seven) años." }
          ],
          tapescript: `R: Part 2. Look at the picture. Listen and write a name or a number. There are two examples.
Fch: Hello. I'm new in class.
M: What's your name, please?
Fch: Kim.
M: Is that K-I-M?
Fch: Yes. Kim.
M: How old are you, Kim?
Fch: I'm 8 today.
M: 8 today? Happy birthday!
Fch: Thank you.

[1] M: What's your family name, please?
Fch: It's Wall. W-A-L-L.
M: Wall? (ha, ha) That's my name, too.

[2] M: Where do you live, Kim?
Fch: In Sun Street.
M: Sun Street?
Fch: Yes. S-U-N. It's behind the zoo.

[3] M: What number's your house?
Fch: It's 15.
M: 15. Oh, is it that house with the big garden?
Fch: Yes, it is. And it's got a pink door!

[4] M: What have you got in your bag?
Fch: Apples for my horse. I go to see him with my friend.
M: What's your horse's name?
Fch: Tiger. That's T-I-G-E-R.

[5] M: How old is your horse?
Fch: He's seven.
M: Seven?
Fch: Yes. And he can run and jump.`
        },

        part3: {
          title: "Part 3",
          subtitle: "– 5 questions –",
          instruction: "Listen and tick (✔) the box. There is one example.",
          tipEs: "Hacé clic en el casillero A, B o C para poner un tilde (✔). ¡Cuidado con las trampas porque en el audio nombran las 3 opciones!",
          audio: "assets/audio/vol1/part3.mp3",
          example: {
            prompt: "What animal has Alex got in his bedroom?",
            options: {
              A: "assets/images/vol1/l_p3_ex_A.webp",
              B: "assets/images/vol1/l_p3_ex_B.webp",
              C: "assets/images/vol1/l_p3_ex_C.webp"
            },
            answer: "B"
          },
          questions: [
            {
              q: 1,
              prompt: "Which picture are May and Sam looking at?",
              options: {
                A: "assets/images/vol1/l_p3_q1_A.webp",
                B: "assets/images/vol1/l_p3_q1_B.webp",
                C: "assets/images/vol1/l_p3_q1_C.webp"
              },
              answer: "B",
              hintEs: "Sam dice que en la foto están 'Mum, my grandpa and my cousin, Tom' (no están ni Dad ni Grandma)."
            },
            {
              q: 2,
              prompt: "What are Mrs Good’s class doing this afternoon?",
              options: {
                A: "assets/images/vol1/l_p3_q2_A.webp",
                B: "assets/images/vol1/l_p3_q2_B.webp",
                C: "assets/images/vol1/l_p3_q2_C.webp"
              },
              answer: "A",
              hintEs: "Están en el patio ('taking photos for our class book')."
            },
            {
              q: 3,
              prompt: "What is Mum’s favourite fruit?",
              options: {
                A: "assets/images/vol1/l_p3_q3_A.webp",
                B: "assets/images/vol1/l_p3_q3_B.webp",
                C: "assets/images/vol1/l_p3_q3_C.webp"
              },
              answer: "A",
              hintEs: "Ante la pregunta por las naranjas ('oranges'), Mum dice: 'OK. They're my favourites'."
            },
            {
              q: 4,
              prompt: "Which dog is Anna’s?",
              options: {
                A: "assets/images/vol1/l_p3_q4_A.webp",
                B: "assets/images/vol1/l_p3_q4_B.webp",
                C: "assets/images/vol1/l_p3_q4_C.webp"
              },
              answer: "B",
              hintEs: "El perro de Anna está sucio ('dirty') y es joven ('young')."
            },
            {
              q: 5,
              prompt: "What is Lucy wearing?",
              options: {
                A: "assets/images/vol1/l_p3_q5_A.webp",
                B: "assets/images/vol1/l_p3_q5_B.webp",
                C: "assets/images/vol1/l_p3_q5_C.webp"
              },
              answer: "C",
              hintEs: "Lucy dice: 'I'm wearing my jeans' y su mamá pregunta 'And your new T-shirt?' → 'Yes'."
            }
          ],
          tapescript: `R: Part 3. Look at the pictures. Now listen and look. There is one example.
What animal has Alex got in his bedroom?
Fch: Mum, Alex has got an animal in his bedroom.
F: What is it? A fish?
Fch: No, a lizard. Can I have one?
F: OK. But please don't ask for a snake!

[1] Which picture are May and Sam looking at?
Fch: This picture's nice, Sam. Who's in it?
Mch: Mum, my grandpa and my cousin, Tom.
Fch: Where's your dad and your grandma?
Mch: They're not in this picture, May.

[2] What are Mrs Good's class doing this afternoon?
M: Where are your class this afternoon, Mrs Good? At their swimming lesson?
F: No, they're in the playground.
M: Are they playing football?
F: Not today. They're taking photos for our class book.

[3] What is Mum's favourite fruit?
Mch: Mum, can we have this coconut?
F: Well, they're very nice but I can't open them.
Mch: What about these oranges?
F: OK. They're my favourites. And let's have this pineapple too.

[4] Which dog is Anna's?
Mch: Is that your dog, Anna?
Fch: No, my dog's dirty.
Mch: Is it young?
Fch: Yes. My brother's dog is that old one.

[5] What is Lucy wearing?
F: (shouting up the stairs) Lucy, your skirt's on the bed.
Fch: Thanks, Mum but I don't want it. I'm wearing my jeans.
F: And your new T-shirt?
Fch: Yes. It's great!`
        },

        part4: {
          title: "Part 4",
          subtitle: "– 5 questions –",
          instruction: "Listen and colour. There is one example.",
          tipEs: "Elegí uno de los 9 lápices de colores en tu Ziploc virtual y pintá el globo exacto que indica el audio. Si te equivocás, usá la goma (ERASER).",
          audio: "assets/audio/vol1/part4.mp3",
          sceneImg: "assets/images/vol1/l_p4_scene.webp",
          objectNoun: "balloon",
          example: {
            desc: "Balloon next to the photo of the family → RED (ya coloreado)",
            color: "red"
          },
          zones: [
            {
              id: "balloon_boy_hand",
              q: 1,
              label: "Balloon in the small boy's hand",
              esLabel: "Globo en la mano del niño pequeño",
              expectedColor: "yellow",
              x: 49.8, y: 14.2, rx: 5.0, ry: 4.1,
              box: [44.0, 9.5, 55.5, 19.0]
            },
            {
              id: "balloon_between_boxes",
              q: 2,
              label: "Balloon between the boxes",
              esLabel: "Globo entre las cajas en el piso",
              expectedColor: "pink",
              x: 67.8, y: 85.8, rx: 4.8, ry: 4.3,
              box: [62.5, 81.0, 73.2, 90.8]
            },
            {
              id: "balloon_under_table",
              q: 3,
              label: "Balloon under the table",
              esLabel: "Globo debajo de la mesa",
              expectedColor: "green",
              x: 39.5, y: 59.5, rx: 5.2, ry: 2.9,
              box: [33.5, 56.2, 45.8, 63.0]
            },
            {
              id: "balloon_on_chair",
              q: 4,
              label: "Balloon on the chair",
              esLabel: "Globo sobre la silla",
              expectedColor: "brown",
              x: 58.8, y: 56.5, rx: 4.6, ry: 3.1,
              box: [53.5, 52.8, 64.2, 60.2]
            },
            {
              id: "balloon_behind_cat",
              q: 5,
              label: "Balloon behind the cat",
              esLabel: "Globo detrás del gato",
              expectedColor: "orange",
              x: 36.5, y: 73.8, rx: 5.5, ry: 4.0,
              box: [30.0, 69.2, 43.0, 78.5]
            },
            {
              id: "balloon_on_table",
              q: null,
              isDistractor: true,
              label: "Balloon on the table (distractor)",
              esLabel: "Globo sobre la mesa (distractor - no pintar)",
              expectedColor: null,
              x: 21.0, y: 41.0, rx: 4.1, ry: 3.5,
              box: [16.2, 36.8, 25.8, 45.2]
            },
            {
              id: "balloon_under_chair",
              q: null,
              isDistractor: true,
              label: "Long balloon under the chair (distractor)",
              esLabel: "Globo largo bajo la silla (distractor - no pintar)",
              expectedColor: null,
              x: 65.0, y: 68.0, rx: 4.6, ry: 4.8,
              box: [59.5, 62.5, 70.5, 73.5]
            }
          ],
          tapescript: `R: Part 4. Look at the picture. Listen and look. There is one example.
M: Look! It's the girl's birthday today.
Fch: I can see lots of balloons! I've got my pencils here. Can I colour one?
M: Yes! A balloon is next to the photo of the family. Colour that one, please.
Fch: OK. What colour?
M: Make the balloon next to the photo, red.

[1] M: Colour the balloon in the small boy's hand now.
Fch: Sorry? The balloon in the boy's hand?
M: Yes. Have you got a yellow pencil?
Fch: Yes, I have.
M: Great! Colour it with that pencil, then.

[2] M: And can you see a balloon between the boxes?
Fch: Yes!
M: Well done! Colour that balloon now, please.
Fch: What colour for the balloon between the boxes?
M: Would you like to colour it pink?
Fch: Yes!

[3] M: Now colour the balloon under the table.
Fch: The balloon under the table? OK!
M: You can choose the colour!
Fch: Green! I love that colour!
M: Me too!

[4] M: There's a balloon on the chair. Find that one, please.
Fch: I can see it.
M: Good. Make that balloon brown.
Fch: OK! I'm colouring that balloon, the one on the chair, now.

[5] Fch: And which balloon can I colour now?
M: The one behind the cat. Colour that balloon!
Fch: Can I make it orange?
M: Yes. Thank you!`
        }
      },

      readingWriting: {
        durationMinutes: 20,

        part1: {
          title: "Part 1",
          subtitle: "– 5 questions –",
          instruction: "Look and read. Put a tick (✔) or a cross (✘) in the box. There are two examples.",
          tipEs: "Mirá cada dibujo y leé la oración. Si coincide con la imagen poné tilde (✔); si no coincide, poné cruz (✘).",
          examples: [
            { img: "assets/images/vol1/rw_p1_ex1.webp", sentence: "These are grapes.", answer: "tick" },
            { img: "assets/images/vol1/rw_p1_ex2.webp", sentence: "This is a house.", answer: "cross" }
          ],
          questions: [
            { q: 1, img: "assets/images/vol1/rw_p1_q1.webp", sentence: "This is a helicopter.", answer: "cross", hintEs: "Es una moto (motorbike), no un helicóptero (✘)." },
            { q: 2, img: "assets/images/vol1/rw_p1_q2.webp", sentence: "This is a clock.",      answer: "tick",  hintEs: "Sí, es un reloj (clock) (✔)." },
            { q: 3, img: "assets/images/vol1/rw_p1_q3.webp", sentence: "These are shells.",     answer: "tick",  hintEs: "Sí, son caracoles de mar (shells) (✔)." },
            { q: 4, img: "assets/images/vol1/rw_p1_q4.webp", sentence: "This is a sock.",       answer: "cross", hintEs: "Son zapatos (shoes), no una media (sock) (✘)." },
            { q: 5, img: "assets/images/vol1/rw_p1_q5.webp", sentence: "These are chairs.",     answer: "tick",  hintEs: "Sí, son sillas (chairs) (✔)." }
          ]
        },

        part2: {
          title: "Part 2",
          subtitle: "– 5 questions –",
          instruction: "Look and read. Write yes or no.",
          tipEs: "Mirá bien la escena del living room y escribí exactamente 'yes' o 'no' en cada línea.",
          sceneImg: "assets/images/vol1/rw_p2_scene.webp",
          examples: [
            { sentence: "There are two armchairs in the living room.", answer: "yes" },
            { sentence: "The big window is open.", answer: "no" }
          ],
          questions: [
            { q: 1, sentence: "The man has got black hair and glasses.", answer: "yes", hintEs: "El hombre que toca la guitarra tiene pelo negro y anteojos (yes)." },
            { q: 2, sentence: "There is a lamp on the bookcase.",        answer: "yes", hintEs: "Arriba de la biblioteca hay una lámpara amarilla (yes)." },
            { q: 3, sentence: "Some of the children are singing.",       answer: "no",  hintEs: "Dos niños están bailando y una niña está leyendo; ninguno está cantando (no)." },
            { q: 4, sentence: "The woman is holding some drinks.",       answer: "yes", hintEs: "La mujer sostiene dos vasos con bebida (yes)." },
            { q: 5, sentence: "The cat is sleeping under an armchair.",  answer: "yes", hintEs: "El gato naranja duerme debajo del sillón de la derecha (yes)." }
          ]
        },

        part3: {
          title: "Part 3",
          subtitle: "– 5 questions –",
          instruction: "Look at the pictures. Look at the letters. Write the words.",
          tipEs: "Ordená las letras de la jaula para escribir el nombre de cada animal. Podés escribir con el teclado o tocar las fichitas de letras.",
          example: {
            img: "assets/images/vol1/rw_p3_ex_img.webp",
            lettersImg: "assets/images/vol1/rw_p3_ex_letters.webp",
            scrambled: ["e", "a", "n", "s", "k"],
            answer: "snake"
          },
          questions: [
            { q: 1, img: "assets/images/vol1/rw_p3_q1_img.webp", lettersImg: "assets/images/vol1/rw_p3_q1_letters.webp", scrambled: ["k", "c", "u", "d"], answer: "duck", hintEs: "Pato en inglés: d-u-c-k." },
            { q: 2, img: "assets/images/vol1/rw_p3_q2_img.webp", lettersImg: "assets/images/vol1/rw_p3_q2_letters.webp", scrambled: ["e", "u", "m", "s", "o"], answer: "mouse", hintEs: "Ratón en inglés: m-o-u-s-e." },
            { q: 3, img: "assets/images/vol1/rw_p3_q3_img.webp", lettersImg: "assets/images/vol1/rw_p3_q3_letters.webp", scrambled: ["h", "p", "i", "o", "p"], answer: "hippo", hintEs: "Hipopótamo en inglés (con doble p): h-i-p-p-o." },
            { q: 4, img: "assets/images/vol1/rw_p3_q4_img.webp", lettersImg: "assets/images/vol1/rw_p3_q4_letters.webp", scrambled: ["o", "n", "m", "y", "k", "e"], answer: "monkey", hintEs: "Mono en inglés: m-o-n-k-e-y." },
            { q: 5, img: "assets/images/vol1/rw_p3_q5_img.webp", lettersImg: "assets/images/vol1/rw_p3_q5_letters.webp", scrambled: ["h", "i", "e", "n", "c", "c", "k"], answer: "chicken", hintEs: "Gallina/pollo en inglés: c-h-i-c-k-e-n." }
          ]
        },

        part4: {
          title: "Part 4",
          subtitle: "– 5 questions –",
          instruction: "Read this. Choose a word from the box. Write the correct word next to numbers 1–5. There is one example.",
          tipEs: "Elegí una palabra de la caja ilustrada para cada espacio (1 a 5). Podés hacer clic en una tarjeta para ponerla en el espacio seleccionado o escribirla.",
          passageTitle: "Lizards",
          mainImg: "assets/images/vol1/rw_p4_main.webp",
          exampleWord: "animals",
          segments: [
            { type: "text", text: "Lots of lizards are very small " },
            { type: "example", word: "animals" },
            { type: "text", text: " but some are really big.\n\nMany lizards are green, grey or yellow. Some like eating " },
            { type: "blank", q: 1, answer: "spiders", hintEs: "Comen arañas ('spiders') y fruta." },
            { type: "text", text: " and some like eating fruit.\n\nA lizard can run on its four " },
            { type: "blank", q: 2, answer: "legs", hintEs: "Corre sobre sus cuatro patas ('legs')." },
            { type: "text", text: " and it has a long " },
            { type: "blank", q: 3, answer: "tail", hintEs: "Tiene una cola ('tail') larga al final del cuerpo." },
            { type: "text", text: " at the end of its body.\n\nMany lizards live in " },
            { type: "blank", q: 4, answer: "trees", hintEs: "Muchas lagartijas viven en los árboles ('trees')." },
            { type: "text", text: " but, at the beach, you can find some lizards on the " },
            { type: "blank", q: 5, answer: "sand", hintEs: "En la playa las encontrás sobre la arena ('sand')." },
            { type: "text", text: ". Lizards love sleeping in the sun!" }
          ],
          wordBox: [
            { word: "animals", img: "assets/images/vol1/rw_p4_animals.webp", isExample: true },
            { word: "tail",    img: "assets/images/vol1/rw_p4_tail.webp" },
            { word: "balloon", img: "assets/images/vol1/rw_p4_balloon.webp" },
            { word: "trees",   img: "assets/images/vol1/rw_p4_trees.webp" },
            { word: "legs",    img: "assets/images/vol1/rw_p4_legs.webp" },
            { word: "spiders", img: "assets/images/vol1/rw_p4_spiders.webp" },
            { word: "teacher", img: "assets/images/vol1/rw_p4_teacher.webp" },
            { word: "sand",    img: "assets/images/vol1/rw_p4_sand.webp" }
          ]
        },

        part5: {
          title: "Part 5",
          subtitle: "– 5 questions –",
          instruction: "Look at the pictures and read the questions. Write one-word answers.",
          tipEs: "¡Atención! La respuesta es SIEMPRE UNA SOLA PALABRA (o un número). Mirá las palabras que ya están escritas antes de la línea punteada.",
          scenes: [
            {
              sceneNum: 1,
              img: "assets/images/vol1/rw_p5_scene1.webp",
              examples: [
                { prompt: "Where are the people?", prefix: "in the", answer: "kitchen" },
                { prompt: "How many children are there?", prefix: "", answer: "two" }
              ],
              questions: [
                {
                  q: 1,
                  prompt: "What are the children playing with?",
                  prefix: "some toy",
                  accepted: ["spiders", "spider"],
                  displayKey: "spiders",
                  hintEs: "Están jugando con arañas de juguete ('some toy spiders')."
                }
              ]
            },
            {
              sceneNum: 2,
              img: "assets/images/vol1/rw_p5_scene2.webp",
              examples: [],
              questions: [
                {
                  q: 2,
                  prompt: "What is Mum standing on?",
                  prefix: "a",
                  accepted: ["chair", "seat"],
                  displayKey: "chair",
                  hintEs: "Mamá está parada sobre una silla ('a chair')."
                },
                {
                  q: 3,
                  prompt: "Where is the spider?",
                  prefix: "on Mum’s",
                  accepted: ["shoe", "shoes", "slipper", "slippers"],
                  displayKey: "shoe(s) / slipper(s)",
                  hintEs: "La araña está sobre el zapato/pantufla de mamá ('shoe' o 'shoes')."
                }
              ]
            },
            {
              sceneNum: 3,
              img: "assets/images/vol1/rw_p5_scene3.webp",
              examples: [],
              questions: [
                {
                  q: 4,
                  prompt: "Who is pointing?",
                  prefix: "the",
                  accepted: ["girl", "blonde girl", "sister", "daughter", "the girl", "a girl"],
                  displayKey: "(blonde) girl / sister / daughter",
                  hintEs: "Está señalando la niña ('the girl')."
                },
                {
                  q: 5,
                  prompt: "Where are the children?",
                  prefix: "in the",
                  accepted: ["garden", "yard", "backyard", "outside", "door", "doorway", "door frame"],
                  displayKey: "garden / (back)yard / outside / door(way)",
                  hintEs: "Los niños están en el jardín ('in the garden')."
                }
              ]
            }
          ]
        }
      },

      speaking: {
        durationMinutes: 5,
        sceneTitle: "Family in the Kitchen (Familia desayunando en la cocina)",
        sceneImg: "assets/images/vol1/sp_scene.webp",
        objectCards: [
          { id: "1/1", num: "1/1", name: "robot",        es: "robot",            img: "assets/images/vol1/sp_card_1.webp" },
          { id: "1/2", num: "1/2", name: "crocodile",    es: "cocodrilo",        img: "assets/images/vol1/sp_card_2.webp" },
          { id: "1/3", num: "1/3", name: "carrot",       es: "zanahoria",        img: "assets/images/vol1/sp_card_3.webp" },
          { id: "1/4", num: "1/4", name: "T-shirt",      es: "remera azul",      img: "assets/images/vol1/sp_card_4.webp" },
          { id: "1/5", num: "1/5", name: "orange juice", es: "jugo de naranja",  img: "assets/images/vol1/sp_card_5.webp" },
          { id: "1/6", num: "1/6", name: "frog",         es: "rana",             img: "assets/images/vol1/sp_card_6.webp" },
          { id: "1/7", num: "1/7", name: "pen",          es: "lapicera",         img: "assets/images/vol1/sp_card_7.webp" },
          { id: "1/8", num: "1/8", name: "baseball cap", es: "gorra",            img: "assets/images/vol1/sp_card_8.webp" }
        ],
        summaryOfProcedures: [
          "The usher introduces the child to the examiner.",
          "1. After asking the child ‘What’s your name?’, the examiner familiarises the child with the picture first and then asks the child to point out certain items on the scene picture, e.g. ‘Where’s the door?’ The examiner then asks the child to put two object cards in various locations on the scene picture, e.g. ‘Put the robot on the red chair.’",
          "2. The examiner asks questions about two of the people or things in the scene picture, e.g. ‘What’s this?’ (Answer: banana) ‘What colour is it?’ (Answer: yellow). The examiner also asks the child to describe an object from the scene, e.g. ‘Tell me about this box.’",
          "3. The examiner asks questions about four object cards, e.g. ‘What’s this?’ (Answer: (orange) juice) and ‘What do you drink for lunch?’",
          "4. The examiner asks questions about the child, e.g. ‘Which sport do you like?’"
        ],
        examinerSteps: [
          {
            id: "v1_sp_intro",
            part: "Intro & Part 1a",
            whatExaminerDoes: "Greets the candidate, checks name, and shows the Kitchen scene picture.",
            whatExaminerSays: "Hello. What’s your name?\nLook at this picture. This is a kitchen. The family are having breakfast.\nHere’s the man.\n• Where’s the door?\n• Where are the bananas?\n• Where’s the blue toy box?",
            minResponse: "{studentName}.\n(Points to the white door, the bananas on the table, and the blue box with toys).",
            backupQuestions: "• Is this the door? (pointing)\n• Are these the bananas?\n• Is this the toy box?"
          },
          {
            id: "v1_sp_p1b",
            part: "Part 1b (Object Cards on Scene)",
            whatExaminerDoes: "Spreads out the 8 Object Cards (1/1 to 1/8) and points to one example, then gives two placement instructions.",
            whatExaminerSays: "Now look at these. Which is the robot?\n• I’m putting the robot on the red chair.\n• Now you put the robot under the table.\n• Which is the carrot / frog?\n• Put the carrot between the milk and the bananas.\n• Which is the pen?\n• Put the pen next to the clock.",
            minResponse: "(Points to object card and drags/places it on the scene picture in the requested location).",
            backupQuestions: "• Where is the robot?\n• Put it under the table (pointing under the table).\n• Is this the carrot? Put it here."
          },
          {
            id: "v1_sp_p2",
            part: "Part 2 (Scene Questions + Tell me about...)",
            whatExaminerDoes: "Removes object cards and points to objects/people in the Kitchen scene.",
            whatExaminerSays: "• (Points to banana) What’s this? What colour is it? How many bananas are there?\n• (Points to the man) What’s the man doing?\n• (Points to the blue toy box) Tell me about this box.",
            minResponse: "• (A) banana. Yellow. Three.\n• Reading (a newspaper).\n• It’s blue / big. There are toys in it.",
            backupQuestions: "• Is it a banana? Is it yellow? Are there three?\n• Is he reading?\n• What colour is the box? What’s in the box?"
          },
          {
            id: "v1_sp_p3",
            part: "Part 3 (4 Object Cards + Personal Link)",
            whatExaminerDoes: "Picks 4 Object Cards one by one (e.g. 1/5 orange juice, 1/2 crocodile, 1/4 T-shirt, 1/8 baseball cap).",
            whatExaminerSays: "1. [Card 1/5] What’s this? Do you like orange juice? What do you drink for lunch?\n2. [Card 1/2] What’s this? Have you got a crocodile? What’s your favourite animal?\n3. [Card 1/4] What’s this? Are you wearing a T-shirt today? What colour is your T-shirt?\n4. [Card 1/8] What’s this? Have you got a cap?",
            minResponse: "1. (Orange) juice. Yes/No. Water / juice.\n2. (A) crocodile. No. Dog / cat.\n3. (A) T-shirt. Yes/No. Blue / white.\n4. (A) (baseball) cap / hat. Yes/No.",
            backupQuestions: "• Is it orange juice? Do you drink water for lunch?\n• Is it a crocodile? Do you like dogs?\n• Is it a T-shirt?"
          },
          {
            id: "v1_sp_p4",
            part: "Part 4 (Personal Questions)",
            whatExaminerDoes: "Puts away all pictures and asks 3 personal questions directly to {studentName}.",
            whatExaminerSays: "Now, {studentName}:\n• How old are you?\n• Which sport do you like?\n• Who do you play with at school?\nOK, thank you, {studentName}. Goodbye!",
            minResponse: "• Eight / Nine.\n• Football / tennis / swimming.\n• My friends (e.g. Ben / Tom).\n• Goodbye!",
            backupQuestions: "• Are you eight or nine?\n• Do you like football?\n• Do you play with your friends?"
          }
        ]
      }
    },

    // ========================================================================
    // VOLUMEN 2 (Sample Papers 2018 — Volume 2)
    // ========================================================================
    vol2: {
      id: "vol2",
      title: "Sample Paper — Volume 2",
      subtitle: "Examen Oficial de Muestra N.º 2",
      badge: "Volumen 2",

      listening: {
        durationMinutes: 20,

        part1: {
          title: "Part 1",
          subtitle: "– 5 questions –",
          instruction: "Listen and draw lines. There is one example.",
          tipEs: "Elegí el lápiz negro (PENCIL) en tu Ziploc y trazá una línea desde cada nombre hasta la persona correcta en el parque/cancha de tenis. (Sobrará 1 nombre).",
          audio: "assets/audio/vol2/part1.mp3",
          sceneImg: "assets/images/vol2/l_p1_scene.webp",
          example: {
            nameId: "Tom",
            targetId: "boy_with_kite",
            description: "Tom → boy flying his kite in the tree"
          },
          names: [
            { id: "Alice", label: "Alice", x: 8.8,  y: 2.7,  box: [2.5, 0.5, 15.5, 5.8] },
            { id: "Tom",   label: "Tom",   x: 35.5, y: 2.7,  box: [28.5, 0.5, 42.5, 5.8], isExample: true },
            { id: "Kim",   label: "Kim",   x: 63.2, y: 2.7,  box: [56.5, 0.5, 70.0, 5.8] },
            { id: "Matt",  label: "Matt",  x: 90.3, y: 2.7,  box: [83.5, 0.5, 97.0, 5.8] },
            { id: "Nick",  label: "Nick",  x: 14.2, y: 97.2, box: [7.5, 94.0, 21.0, 99.5] },
            { id: "Grace", label: "Grace", x: 50.0, y: 97.2, box: [42.0, 94.0, 58.0, 99.5] },
            { id: "Bill",  label: "Bill",  x: 85.0, y: 97.2, box: [78.5, 94.0, 91.5, 99.5] }
          ],
          targets: [
            { id: "girl_red_racket",       label: "girl with red tennis racket", x: 44.5, y: 79.0, box: [33.5, 64.0, 56.5, 92.5] },
            { id: "girl_on_chair_tablet",  label: "girl on chair with tablet",   x: 46.5, y: 37.0, box: [39.5, 28.5, 53.5, 44.5] },
            { id: "boy_grey_shorts_bike",  label: "boy in grey shorts by bike",  x: 71.5, y: 42.5, box: [63.5, 31.5, 78.5, 52.5] },
            { id: "boy_holding_bread",     label: "boy holding bread for birds", x: 78.5, y: 81.0, box: [70.5, 69.5, 88.5, 92.5] },
            { id: "girl_running_pink",     label: "girl running in pink T-shirt", x: 20.5, y: 32.5, box: [15.5, 25.5, 26.5, 38.5] },
            { id: "boy_with_kite",         label: "boy with kite (Tom)",         x: 33.0, y: 32.0, box: [27.5, 24.5, 38.5, 39.5], isExample: true },
            { id: "boy_playing_tennis",    label: "boy with green/blue racket",  x: 20.0, y: 47.0, box: [11.5, 38.5, 30.5, 56.5] }
          ],
          markingKey: [
            { q: 1, nameId: "Grace", targetId: "girl_red_racket",      desc: "Grace → girl with red racket (niña de pelo largo con raqueta roja)" },
            { q: 2, nameId: "Alice", targetId: "girl_on_chair_tablet", desc: "Alice → girl on a chair (niña sentada jugando con la tablet)" },
            { q: 3, nameId: "Bill",  targetId: "boy_grey_shorts_bike", desc: "Bill → boy in grey shorts (niño de shorts grises junto a su bici)" },
            { q: 4, nameId: "Matt",  targetId: "boy_holding_bread",    desc: "Matt → boy holding bread (niño dándole pan a los pájaros)" },
            { q: 5, nameId: "Kim",   targetId: "girl_running_pink",    desc: "Kim → girl in pink shirt (niña corriendo con remera rosa)" }
          ],
          tapescript: `R: Look at Part 1. Now look at the picture. Listen and look. There is one example.
M: Hi! This is the park next to our house.
F: Wow! And do you know these children?
M: Yes. There's Tom. He's flying his kite.
F: But Tom's kite is in the tree now!
M: That's right!
R: Can you see the line? This is an example. Now you listen and draw lines.

[1] M: Who's that? The girl with the red tennis racket?
F: That's Grace, I like her long hair.
M: Yes. I like Grace's hair too.

[2] M: And can you see Alice?
F: Sorry? Alice?
M: Yes. She's the girl with the tablet.
F: Oh! The girl on the chair?
M: Yes, she's playing a game on it.

[3] F: What's that boy's name?
M: The boy in the grey shorts? That's Bill.
F: And is that Bill's bike?
M: Yes. It's cool.

[4] F: Who's that boy? He's holding some bread.
M: That's Matt. The bread is for the birds.
F: Does Matt like coming to the park?
M: Yes. He loves it.

[5] F: And who's that girl? She's running …
M: The girl in the pink T-shirt? That's Kim.
F: Oh.
M: Kim likes playing here too.
F: Well, it's a really fantastic park!`
        },

        part2: {
          title: "Part 2",
          subtitle: "– 5 questions –",
          instruction: "Read the question. Listen and write a name or a number. There are two examples.",
          tipEs: "Prestá atención al deletreo letra por letra y a los números (podés escribirlos con números como 12 o con palabras como twelve).",
          audio: "assets/audio/vol2/part2.mp3",
          sceneImg: "assets/images/vol2/l_p2_scene.webp",
          examples: [
            { prompt: "What is the girl’s name?", answer: "Pat" },
            { prompt: "How old is she?", answer: "9" }
          ],
          questions: [
            { q: 1, prompt: "How many cousins has Pat got?", prefix: "", suffix: "", accepted: ["12", "twelve"], displayKey: "12 / twelve", hintEs: "Pat tiene 12 (twelve) primos en su casa hoy." },
            { q: 2, prompt: "What is the name of Pat’s favourite game?", prefix: "", suffix: "", accepted: ["duck"], displayKey: "Duck (D-U-C-K)", hintEs: "El juego favorito de Pat se llama D-U-C-K." },
            { q: 3, prompt: "Which beach does Pat like to go to?", prefix: "", suffix: "Beach", accepted: ["shell"], displayKey: "Shell (S-H-E-L-L)", hintEs: "Le gusta ir a S-H-E-L-L Beach." },
            { q: 4, prompt: "How many books has Pat got?", prefix: "", suffix: "", accepted: ["20", "twenty"], displayKey: "20 / twenty", hintEs: "Tiene 20 (twenty) libros en su armario." },
            { q: 5, prompt: "What is the teacher’s name?", prefix: "Mr.", suffix: "", accepted: ["lorry"], displayKey: "Lorry (L-O-R-R-Y)", hintEs: "El maestro del libro se llama Mr L-O-R-R-Y." }
          ],
          tapescript: `R: Part 2. Look at the picture. Listen and write a name or a number. There are two examples.
M: Who's this girl?
Fch: She's my friend, Pat.
M: Sorry, what's her name?
Fch: It's Pat. You spell that, P-A-T.
M: How old is she?
Fch: She's nine now.
M: Nine?
Fch: Yes. It's her birthday today.

[1] Fch: Pat's cousins are at her house today.
M: That's good! How many cousins has she got?
Fch: She's got twelve.
M: Pardon! How many?
Fch: Twelve.

[2] Fch: I like playing with Pat.
M: What's her favourite game?
Fch: The name of her favourite game is 'DUCK'!
M: Duck? Do you spell that D-U-C-K?
Fch: Yes, it's a very funny game.

[3] M: And where does Pat like going?
Fch: She likes going to the beach.
M: Which one?
Fch: She likes going to Shell Beach. You spell that S-H-E-L-L.

[4] Fch: Pat likes reading, too.
M: Does she? How many books has she got?
Fch: She's got twenty books in her cupboard.
M: Twenty! Wow!

[5] Fch: Pat's reading her favourite book. It's about a really funny teacher.
M: Oh! What's the teacher's name?
Fch: His name is Mr Lorry. You spell that L-O-R-R-Y.`
        },

        part3: {
          title: "Part 3",
          subtitle: "– 5 questions –",
          instruction: "Listen and tick (✔) the box. There is one example.",
          tipEs: "Hacé clic en el casillero A, B o C para poner un tilde (✔).",
          audio: "assets/audio/vol2/part3.mp3",
          example: {
            prompt: "Where is Lucy now?",
            options: {
              A: "assets/images/vol2/l_p3_ex_A.webp",
              B: "assets/images/vol2/l_p3_ex_B.webp",
              C: "assets/images/vol2/l_p3_ex_C.webp"
            },
            answer: "A"
          },
          questions: [
            {
              q: 1,
              prompt: "Who is Dad talking to on the phone?",
              options: {
                A: "assets/images/vol2/l_p3_q1_A.webp",
                B: "assets/images/vol2/l_p3_q1_B.webp",
                C: "assets/images/vol2/l_p3_q1_C.webp"
              },
              answer: "B",
              hintEs: "Mamá dice: 'He's phoning Grandpa about dinner' (Opción B)."
            },
            {
              q: 2,
              prompt: "What is the crocodile doing?",
              options: {
                A: "assets/images/vol2/l_p3_q2_A.webp",
                B: "assets/images/vol2/l_p3_q2_B.webp",
                C: "assets/images/vol2/l_p3_q2_C.webp"
              },
              answer: "A",
              hintEs: "La niña dice: 'It's playing a guitar! Look!' (Opción A)."
            },
            {
              q: 3,
              prompt: "Where are Hugo’s pens?",
              options: {
                A: "assets/images/vol2/l_p3_q3_A.webp",
                B: "assets/images/vol2/l_p3_q3_B.webp",
                C: "assets/images/vol2/l_p3_q3_C.webp"
              },
              answer: "B",
              hintEs: "Hugo dice: 'Oh – mine are there, next to the TV' (Opción B)."
            },
            {
              q: 4,
              prompt: "Which boy is Sam?",
              options: {
                A: "assets/images/vol2/l_p3_q4_A.webp",
                B: "assets/images/vol2/l_p3_q4_B.webp",
                C: "assets/images/vol2/l_p3_q4_C.webp"
              },
              answer: "A",
              hintEs: "Sam tiene campera negra y pantalón marrón ('black jacket... wearing brown trousers', Opción A)."
            },
            {
              q: 5,
              prompt: "Which is the girl’s favourite picture?",
              options: {
                A: "assets/images/vol2/l_p3_q5_A.webp",
                B: "assets/images/vol2/l_p3_q5_B.webp",
                C: "assets/images/vol2/l_p3_q5_C.webp"
              },
              answer: "C",
              hintEs: "La niña dice: 'My favourite is the one of the goats' (Opción C)."
            }
          ],
          tapescript: `R: Part 3. Look at the pictures. Now listen and look. There is one example.
Where is Lucy now?
Fch: Where's Lucy? She isn't in the living room.
Mch: I know. She's in the kitchen with Mum.
Fch: Oh, OK. Thanks. Where are you going Mark?
Mch: I want my hat. It's in my bedroom.

[1] Who is Dad talking to on the phone?
Mch: Who's Dad talking to, Mum?
F: He's phoning Grandpa about dinner.
Mch: Can Alex, my friend from school, have dinner with us?
F: Not today.

[2] What is the crocodile doing?
Fch: I love the crocodile in this story. It's funny. It doesn't like swimming.
Mch: So what's it doing? Eating?
Fch: Not now. It's playing a guitar! Look!

[3] Where are Hugo's pens?
Mch: I can't find my pens, Grandma. They aren't on my desk.
F: Are those yours, Hugo? The pens under the lamp?
Mch: No, they're Sue's. Oh – mine are there, next to the TV. I can see them now.

[4] Which boy is Sam?
Fch: Look Dad. There's Sam. He's my new friend.
M: The boy in the jeans and black jacket?
Fch: Not him. Sam's got a black jacket but he's wearing brown trousers.

[5] Which is the girl's favourite picture?
Fch: These paintings are great, Mrs Door. Those flowers are beautiful.
F: Thank you! Which painting is your favourite? The one of the houses?
Fch: That's nice, but no. My favourite is the one of the goats. I love that.`
        },

        part4: {
          title: "Part 4",
          subtitle: "– 5 questions –",
          instruction: "Listen and colour. There is one example.",
          tipEs: "Elegí uno de los 9 lápices de colores en tu Ziploc virtual y pintá el ananá/piña (pineapple) exacto que indica el audio.",
          audio: "assets/audio/vol2/part4.mp3",
          sceneImg: "assets/images/vol2/l_p4_scene.webp",
          objectNoun: "pineapple",
          example: {
            desc: "Pineapple on the clock → YELLOW (ya coloreada)",
            color: "yellow"
          },
          zones: [
            {
              id: "pineapple_in_box",
              q: 1,
              label: "Pineapple in the box",
              esLabel: "Piña dentro de la caja (abajo a la izquierda)",
              expectedColor: "green",
              x: 15.2, y: 73.8, rx: 4.8, ry: 5.0,
              box: [9.8, 68.0, 20.5, 79.5]
            },
            {
              id: "pineapple_under_lemons",
              q: 2,
              label: "Pineapple under the lemons",
              esLabel: "Piña debajo de la mesita con limones (abajo a la derecha)",
              expectedColor: "purple",
              x: 86.8, y: 84.5, rx: 4.8, ry: 5.0,
              box: [81.2, 78.5, 92.2, 90.2]
            },
            {
              id: "pineapple_on_computer",
              q: 3,
              label: "Pineapple on the computer",
              esLabel: "Piña en la pantalla de la computadora",
              expectedColor: "orange",
              x: 87.5, y: 41.2, rx: 4.2, ry: 4.2,
              box: [82.5, 36.0, 92.2, 46.0]
            },
            {
              id: "pineapple_between_watermelons",
              q: 4,
              label: "Pineapple between the two watermelons",
              esLabel: "Piña entre las dos sandías en el estante",
              expectedColor: "blue",
              x: 13.5, y: 31.2, rx: 4.6, ry: 4.8,
              box: [8.2, 25.0, 18.8, 36.8]
            },
            {
              id: "pineapple_on_board",
              q: 5,
              label: "Pineapple on the board behind the woman",
              esLabel: "Piña en el cartel/pizarra detrás de la vendedora",
              expectedColor: "red",
              x: 52.5, y: 9.2, rx: 4.8, ry: 4.8,
              box: [47.2, 3.5, 57.8, 14.8]
            },
            {
              id: "pineapple_in_hands",
              q: null,
              isDistractor: true,
              label: "Pineapple in the boy's hands (distractor)",
              esLabel: "Piña en las manos del niño (distractor - no pintar)",
              expectedColor: null,
              x: 50.2, y: 36.2, rx: 4.8, ry: 4.8,
              box: [45.0, 30.5, 55.5, 41.8]
            }
          ],
          tapescript: `R: Part 4. Look at the picture. Listen and look. There is one example.
Fch: There's a lot of fruit in this picture! Is it a shop?
M: Yes, it is. Can you see the pineapple on the clock?
Fch: The pineapple on the clock. Oh yes! Can I colour it yellow, please?
M: Yes, you can.

[1] M: Can you colour the pineapple in the box now?
Fch: The pineapple in the box?
M: That's right. Colour it green, please.
Fch: OK! I love that colour! There!

[2] M: Now find the pineapple under the lemons.
Fch: Under the lemons?
M: Yes. Colour that pineapple purple.
Fch: OK. I'm doing that now.
M: Fantastic! Thank you.

[3] Fch: There's a picture of a pineapple on the computer too. Look!
M: On the computer? Oh yes!
Fch: Can I colour that pineapple orange?
M: Yes, you can. That's great!

[4] M: And … I know! Can you see the pineapple between the two watermelons?
Fch: The one between the watermelons? Yes I can.
M: Good. Colour that pineapple blue.
Fch: OK. That's funny.

[5] M: And can you colour this pineapple now?
Fch: Which pineapple? The one on the board?
M: Yes! The pineapple on the board. Colour it red.
Fch: OK. I'm colouring that one now.
M: Very good. Thanks!`
        }
      },

      readingWriting: {
        durationMinutes: 20,

        part1: {
          title: "Part 1",
          subtitle: "– 5 questions –",
          instruction: "Look and read. Put a tick (✔) or a cross (✘) in the box. There are two examples.",
          tipEs: "Mirá cada dibujo y leé la oración. Si coincide con la imagen poné tilde (✔); si no coincide, poné cruz (✘).",
          examples: [
            { img: "assets/images/vol2/rw_p1_ex1.webp", sentence: "This is a bus.",     answer: "tick" },
            { img: "assets/images/vol2/rw_p1_ex2.webp", sentence: "These are snakes.",  answer: "cross" }
          ],
          questions: [
            { q: 1, img: "assets/images/vol2/rw_p1_q1.webp", sentence: "This is a mat.",          answer: "cross", hintEs: "Es un espejo (mirror), no una alfombra (mat) (✘)." },
            { q: 2, img: "assets/images/vol2/rw_p1_q2.webp", sentence: "This is an ear.",         answer: "tick",  hintEs: "Sí, es una oreja (ear) (✔)." },
            { q: 3, img: "assets/images/vol2/rw_p1_q3.webp", sentence: "These are coconuts.",     answer: "cross", hintEs: "Son papas (potatoes), no cocos (coconuts) (✘)." },
            { q: 4, img: "assets/images/vol2/rw_p1_q4.webp", sentence: "This is a sofa.",         answer: "tick",  hintEs: "Sí, es un sillón/sofá (sofa) (✔)." },
            { q: 5, img: "assets/images/vol2/rw_p1_q5.webp", sentence: "These are helicopters.",  answer: "tick",  hintEs: "Sí, son helicópteros (helicopters) (✔)." }
          ]
        },

        part2: {
          title: "Part 2",
          subtitle: "– 5 questions –",
          instruction: "Look and read. Write yes or no.",
          tipEs: "Mirá la escena de los niños pescando y escribí 'yes' o 'no' en cada línea.",
          sceneImg: "assets/images/vol2/rw_p2_scene.webp",
          examples: [
            { sentence: "The boys are wearing blue shorts.", answer: "yes" },
            { sentence: "Two cows are looking at the sun.",  answer: "no" }
          ],
          questions: [
            { q: 1, sentence: "The children are fishing in the sea.",       answer: "no",  hintEs: "Están pescando en un río en el campo, no en el mar (no)." },
            { q: 2, sentence: "There’s an old boot in the water.",          answer: "no",  hintEs: "La bota vieja ya la sacó del agua con la caña; está en el aire (no)." },
            { q: 3, sentence: "You can see three fish in the picture.",     answer: "yes", hintEs: "Hay tres pescados en el pasto junto al bolso (yes)." },
            { q: 4, sentence: "The child with black hair is sitting down.", answer: "yes", hintEs: "El niño de pelo negro y remera amarilla está sentado en la silla (yes)." },
            { q: 5, sentence: "There’s a green frog on the bag.",           answer: "yes", hintEs: "Arriba de la mochila amarilla hay una ranita verde (yes)." }
          ]
        },

        part3: {
          title: "Part 3",
          subtitle: "– 5 questions –",
          instruction: "Look at the pictures. Look at the letters. Write the words.",
          tipEs: "Ordená las letras que están sobre el libro para escribir cada palabra de la escuela.",
          example: {
            img: "assets/images/vol2/rw_p3_ex_img.webp",
            lettersImg: "assets/images/vol2/rw_p3_ex_letters.webp",
            scrambled: ["k", "s", "d", "e"],
            answer: "desk"
          },
          questions: [
            { q: 1, img: "assets/images/vol2/rw_p3_q1_img.webp", lettersImg: "assets/images/vol2/rw_p3_q1_letters.webp", scrambled: ["p", "p", "r", "a", "e"], answer: "paper", hintEs: "Papel en inglés: p-a-p-e-r." },
            { q: 2, img: "assets/images/vol2/rw_p3_q2_img.webp", lettersImg: "assets/images/vol2/rw_p3_q2_letters.webp", scrambled: ["u", "r", "r", "e", "l"], answer: "ruler", hintEs: "Regla en inglés: r-u-l-e-r." },
            { q: 3, img: "assets/images/vol2/rw_p3_q3_img.webp", lettersImg: "assets/images/vol2/rw_p3_q3_letters.webp", scrambled: ["r", "s", "r", "e", "a", "e"], answer: "eraser", hintEs: "Goma de borrar en inglés (con 6 letras): e-r-a-s-e-r." },
            { q: 4, img: "assets/images/vol2/rw_p3_q4_img.webp", lettersImg: "assets/images/vol2/rw_p3_q4_letters.webp", scrambled: ["c", "l", "n", "e", "p", "i"], answer: "pencil", hintEs: "Lápiz en inglés: p-e-n-c-i-l." },
            { q: 5, img: "assets/images/vol2/rw_p3_q5_img.webp", lettersImg: "assets/images/vol2/rw_p3_q5_letters.webp", scrambled: ["h", "t", "r", "a", "e", "c", "e"], answer: "teacher", hintEs: "Maestra/profesor en inglés: t-e-a-c-h-e-r." }
          ]
        },

        part4: {
          title: "Part 4",
          subtitle: "– 5 questions –",
          instruction: "Read this. Choose a word from the box. Write the correct word next to numbers 1–5. There is one example.",
          tipEs: "Elegí una palabra de la caja ilustrada para cada espacio (1 a 5).",
          passageTitle: "A horse",
          mainImg: "assets/images/vol2/rw_p4_main.webp",
          exampleWord: "legs",
          segments: [
            { type: "text", text: "Horses are beautiful animals. The one in the picture has four long " },
            { type: "example", word: "legs" },
            { type: "text", text: ", two big " },
            { type: "blank", q: 1, answer: "eyes", hintEs: "Dos grandes ojos ('two big eyes') y una cara larga." },
            { type: "text", text: " and a long face. It has a brown " },
            { type: "blank", q: 2, answer: "tail", hintEs: "Tiene una cola ('tail') marrón en su cuerpo." },
            { type: "text", text: " on its body too. Lots of " },
            { type: "blank", q: 3, answer: "people", hintEs: "Mucha gente ('people') disfruta andar a caballo." },
            { type: "text", text: " enjoy riding horses. Some families have a horse for a pet. At the end of the " },
            { type: "blank", q: 4, answer: "day", hintEs: "Al final del día ('at the end of the day'), limpian a su caballo." },
            { type: "text", text: ", they clean their horse and give it " },
            { type: "blank", q: 5, answer: "food", hintEs: "Le dan comida ('food') y agua." },
            { type: "text", text: " and water. Horses like eating apples and carrots!" }
          ],
          wordBox: [
            { word: "legs",    img: "assets/images/vol2/rw_p4_legs.webp", isExample: true },
            { word: "people",  img: "assets/images/vol2/rw_p4_people.webp" },
            { word: "food",    img: "assets/images/vol2/rw_p4_food.webp" },
            { word: "balloon", img: "assets/images/vol2/rw_p4_balloon.webp" },
            { word: "eyes",    img: "assets/images/vol2/rw_p4_eyes.webp" },
            { word: "door",    img: "assets/images/vol2/rw_p4_door.webp" },
            { word: "day",     img: "assets/images/vol2/rw_p4_day.webp" },
            { word: "tail",    img: "assets/images/vol2/rw_p4_tail.webp" }
          ]
        },

        part5: {
          title: "Part 5",
          subtitle: "– 5 questions –",
          instruction: "Look at the pictures and read the questions. Write one-word answers.",
          tipEs: "Mirá los 3 cuadros de la historieta y respondé con UNA SOLA PALABRA (o número).",
          scenes: [
            {
              sceneNum: 1,
              img: "assets/images/vol2/rw_p5_scene1.webp",
              examples: [
                { prompt: "What are the children doing?", prefix: "", answer: "running" },
                { prompt: "Where is the bird?", prefix: "in a", answer: "tree" }
              ],
              questions: [
                {
                  q: 1,
                  prompt: "Where’s the woman’s hat?",
                  prefix: "on the",
                  accepted: ["table"],
                  displayKey: "table",
                  hintEs: "El sombrero amarillo está sobre la mesa ('on the table')."
                }
              ]
            },
            {
              sceneNum: 2,
              img: "assets/images/vol2/rw_p5_scene2.webp",
              examples: [],
              questions: [
                {
                  q: 2,
                  prompt: "Who’s pointing?",
                  prefix: "the",
                  accepted: ["children", "kids", "girl and boy", "boy and girl"],
                  displayKey: "children / kids",
                  hintEs: "Ambos niños están señalando al pájaro ('the children' o 'the kids')."
                },
                {
                  q: 3,
                  prompt: "What has the bird got in its mouth?",
                  prefix: "the",
                  accepted: ["hat", "woman's hat", "sunhat"],
                  displayKey: "hat",
                  hintEs: "El pájaro lleva el sombrero ('the hat') en el pico."
                }
              ]
            },
            {
              sceneNum: 3,
              img: "assets/images/vol2/rw_p5_scene3.webp",
              examples: [],
              questions: [
                {
                  q: 4,
                  prompt: "How many birds are there now?",
                  prefix: "",
                  accepted: ["3", "three"],
                  displayKey: "3 / three",
                  hintEs: "Ahora hay 3 (three) pájaros (la mamá y los 2 pichones en el nido)."
                },
                {
                  q: 5,
                  prompt: "What are the birds doing?",
                  prefix: "",
                  accepted: ["singing", "whistling"],
                  displayKey: "singing / whistling",
                  hintEs: "Mirá las notas musicales: los pájaros están cantando ('singing')."
                }
              ]
            }
          ]
        }
      },

      speaking: {
        durationMinutes: 5,
        sceneTitle: "At the Beach & On the Boat (En la playa y en el barco)",
        sceneImg: "assets/images/vol2/sp_scene.webp",
        objectCards: [
          { id: "2/1", num: "2/1", name: "apple",     es: "manzana verde",    img: "assets/images/vol2/sp_card_1.webp" },
          { id: "2/2", num: "2/2", name: "pencil",    es: "lápiz azul",       img: "assets/images/vol2/sp_card_2.webp" },
          { id: "2/3", num: "2/3", name: "kite",      es: "barrilete",        img: "assets/images/vol2/sp_card_3.webp" },
          { id: "2/4", num: "2/4", name: "spider",    es: "araña",            img: "assets/images/vol2/sp_card_4.webp" },
          { id: "2/5", num: "2/5", name: "chocolate", es: "chocolate",        img: "assets/images/vol2/sp_card_5.webp" },
          { id: "2/6", num: "2/6", name: "milk",      es: "leche",            img: "assets/images/vol2/sp_card_6.webp" },
          { id: "2/7", num: "2/7", name: "ruler",     es: "regla",            img: "assets/images/vol2/sp_card_7.webp" },
          { id: "2/8", num: "2/8", name: "cupboard",  es: "ropero / armario", img: "assets/images/vol2/sp_card_8.webp" }
        ],
        summaryOfProcedures: [
          "The usher introduces the child to the examiner.",
          "1. The examiner greets the candidate and checks the candidate’s name. This part is unassessed. The examiner starts the test by demonstrating what is required and then asks the child to point to objects on the scene picture, e.g. 'Where's the sun?' The examiner asks the candidate to point to two object cards and gives instructions to place them in different locations on the scene picture, e.g. 'Put the apple in front of the birds.'",
          "2. The examiner asks the candidate some questions about the scene picture, e.g. ‘What’s this?’ (Answer: a fish) ‘What colour is it?’ (Answer: pink). The examiner also asks the child to describe an object from the scene, e.g. ‘Tell me about this man.’",
          "3. The examiner asks the candidate questions about four of the object cards, e.g. ‘What’s this?’ (Answer: a spider) and ‘What’s your favourite animal?’",
          "4. The examiner asks the candidate some personal questions on topics such as age, family, school and friends, e.g. ‘What’s in your classroom?’"
        ],
        examinerSteps: [
          {
            id: "v2_sp_intro",
            part: "Intro & Part 1a",
            whatExaminerDoes: "Greets the candidate, checks name, and shows the Beach & Boat scene picture.",
            whatExaminerSays: "Hello. What’s your name?\nLook at this picture. It’s a sunny day at the beach. Here’s the boat.\n• Where’s the sun?\n• Where are the dogs?\n• Where’s the yellow hat?",
            minResponse: "{studentName}.\n(Points to the sun in the sky, the two dogs on the boat, and the yellow hat in the water).",
            backupQuestions: "• Is this the sun? (pointing)\n• Are these the dogs?\n• Is this the hat?"
          },
          {
            id: "v2_sp_p1b",
            part: "Part 1b (Object Cards on Scene)",
            whatExaminerDoes: "Spreads out the 8 Object Cards (2/1 to 2/8), demonstrates placing one card, then gives two instructions.",
            whatExaminerSays: "Now look at these. Which is the apple?\n• I’m putting the apple on the boat.\n• Now you put the apple in front of the birds.\n• Which is the kite / spider?\n• Put the kite between the two trees.\n• Which is the chocolate?\n• Put the chocolate next to the boy in the car.",
            minResponse: "(Points to object card and drags/places it on the scene picture in the requested location).",
            backupQuestions: "• Where is the apple?\n• Put it in front of the birds (pointing to the two white birds on the rock).\n• Is this the kite? Put it between the trees."
          },
          {
            id: "v2_sp_p2",
            part: "Part 2 (Scene Questions + Tell me about...)",
            whatExaminerDoes: "Removes object cards and points to items/people in the Beach & Boat scene.",
            whatExaminerSays: "• (Points to pink fish) What’s this? What colour is it? How many fish are there?\n• (Points to boy in water with ball) What’s this boy doing?\n• (Points to the man on the boat with sunglasses) Tell me about this man.",
            minResponse: "• (A) fish. Pink. Five.\n• Playing (with a ball) / swimming.\n• He’s wearing sunglasses / a green T-shirt. He’s sitting on the boat.",
            backupQuestions: "• Is it a fish? Is it pink? Are there five fish?\n• Is he playing with a ball?\n• Is he wearing glasses? Is he happy?"
          },
          {
            id: "v2_sp_p3",
            part: "Part 3 (4 Object Cards + Personal Link)",
            whatExaminerDoes: "Picks 4 Object Cards one by one (e.g. 2/4 spider, 2/5 chocolate, 2/2 pencil, 2/6 milk).",
            whatExaminerSays: "1. [Card 2/4] What’s this? Do you like spiders? What’s your favourite animal?\n2. [Card 2/5] What’s this? Do you eat chocolate? What’s your favourite food?\n3. [Card 2/2] What’s this? Have you got a blue pencil in your pencil case?\n4. [Card 2/6] What’s this? Do you drink milk for breakfast?",
            minResponse: "1. (A) spider. Yes/No. Dog / tiger / cat.\n2. Chocolate. Yes/No. Pizza / burgers / ice cream.\n3. (A) pencil. Yes/No.\n4. Milk. Yes/No.",
            backupQuestions: "• Is it a spider? Do you like dogs?\n• Is it chocolate? Do you like pizza?\n• Is it a pencil?"
          },
          {
            id: "v2_sp_p4",
            part: "Part 4 (Personal Questions)",
            whatExaminerDoes: "Puts away all pictures and asks 3 personal questions directly to {studentName}.",
            whatExaminerSays: "Now, {studentName}:\n• What’s in your classroom?\n• What’s your teacher’s name?\n• What do you do after school?\nOK, thank you, {studentName}. Goodbye!",
            minResponse: "• Desks / chairs / board / books.\n• (Teacher’s name).\n• Play football / watch TV / play games.\n• Goodbye!",
            backupQuestions: "• Are there desks in your classroom?\n• Is your teacher a man or a woman?\n• Do you play games after school?"
          }
        ]
      }
    }
  }
};
