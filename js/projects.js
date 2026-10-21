/* ==========================================================
   Contenu des projets (FR / EN)
   Galerie : [fichier, légende FR, légende EN]
   Une vidéo (.mp4 / .webm / .mov) peut être ajoutée dans une galerie,
   elle sera jouée en boucle et sans son.
   ========================================================== */

const PROJECTS = [
  {
    id: "bioprinting",
    featured: true,
    cover: "bio-print.jpg",
    year: "2025 - 2026",
    fr: {
      title: "Bio-impression 3D",
      context: "Projet A4 - Creative Technology",
      lead: "Au lieu d'imprimer du plastique, une bio-imprimante dépose des bio-encres : des hydrogels pouvant contenir des cellules ou des graines vivantes. J'ai conçu et intégré un extrudeur dédié pour transformer une imprimante 3D conventionnelle, la COSMYX Nova, en bio-imprimante accessible aux communautés open-source et DIY.",
      meta: {
        Rôle: "Conception, prototypage, tests",
        Outils: "SolidWorks, Orca Slicer, Klipper, OctoPrint, Raspberry Pi",
      },
      sections: [
        { title: "Le prototype", items: [
          "Extrudeur à piston de seringue entraîné par moteur pas-à-pas",
          "Réduction par engrenages 1:4 et support sur mesure imprimé en 3D",
          "Paramètres d'extrusion entièrement pilotés depuis Orca Slicer",
          "Debug logiciel : flash de la carte SD du Raspberry Pi, configuration du firmware Klipper / OctoPrint",
        ]},
        { title: "Tests & évaluation", items: [
          "Calibration avec un hydrogel CMC + alginate : cœur 2D, cube creux, cube plein",
          "Hydrogel à la spiruline réticulé dans un bain de chlorure de calcium",
          "Reproduction de LivingLoom (CHI 2025) : bio-encre alginate + graines de chia intégrée au textile, germination en 3 jours",
        ]},
        { title: "Et ensuite", items: [
          "Vis-mère et roulement linéaire pour un porte-seringue plus robuste",
          "Intégration de l'extrudeur sur une imprimante Prusa",
        ]},
      ],
    },
    en: {
      title: "3D Bioprinting",
      context: "4th-year project - Creative Technology",
      lead: "Instead of plastic, a bioprinter deposits bio-inks: hydrogels that can carry living cells or seeds. I designed and integrated a dedicated extruder to turn a conventional 3D printer, the COSMYX Nova, into a bioprinter accessible to open-source and DIY communities.",
      meta: {
        Role: "Design, prototyping, testing",
        Tools: "SolidWorks, Orca Slicer, Klipper, OctoPrint, Raspberry Pi",
      },
      sections: [
        { title: "The prototype", items: [
          "Syringe-piston extruder driven by a stepper motor",
          "1:4 gear reduction and custom 3D-printed mount",
          "Extrusion parameters fully controlled from Orca Slicer",
          "Software debugging: flashing the Raspberry Pi SD card, configuring Klipper / OctoPrint firmware",
        ]},
        { title: "Tests & evaluation", items: [
          "Calibration with a CMC + alginate hydrogel: 2D heart, hollow cube, filled cube",
          "Spirulina hydrogel cross-linked in a calcium chloride bath",
          "Reproduction of LivingLoom (CHI 2025): alginate bio-ink with chia seeds integrated into textile, sprouting in 3 days",
        ]},
        { title: "Next steps", items: [
          "Lead screw and linear bearing for a sturdier syringe holder",
          "Integrating the extruder on a Prusa printer",
        ]},
      ],
    },
    gallery: [
      ["bio-extruder.jpg", "L'extrudeur à seringue sur la COSMYX Nova", "The syringe extruder on the COSMYX Nova"],
      ["bio-cube-print.jpg", "Test de calibration - CMC + alginate", "Calibration test - CMC + alginate"],
      ["bio-heart-print.jpg", "Test de calibration - CMC + alginate", "Calibration test - CMC + alginate"],
      ["bio-hollow-print.jpg", "Impression d'un cube en hydrogel", "Printing a hydrogel cube"],
      ["bio-cube.jpg", "Cube creux imprimé", "Printed hollow cube"],
      ["bio-cube-2.jpg", "Cube imprimé en hydrogel", "Printed hydrogel cube"],
      ["bio-spirulina-print.jpg", "Impression de l'hydrogel à la spiruline", "Printing the spirulina hydrogel"],
      ["bio-spirulina-print-2.jpg", "Hydrogel à la spiruline en cours d'impression", "Spirulina hydrogel being printed"],
      ["bio-star.jpg", "Étoile en hydrogel à la spiruline", "Spirulina hydrogel star"],
      ["bio-shapes.jpg", "Formes imprimées après réticulation", "Printed shapes after cross-linking"],
      ["bio-spirulina.jpg", "Hydrogel spiruline + alginate", "Spirulina + alginate hydrogel"],
      ["bio-chia.jpg", "Bio-encre alginate + graines de chia", "Alginate bio-ink with chia seeds"],
      ["bio-chia-lines.jpg", "Lignes de bio-encre aux graines de chia", "Chia seed bio-ink lines"],
      ["bio-textile.jpg", "Graines intégrées au textile", "Seeds integrated into textile"],
      ["bio-sprouts.jpg", "Germination après 3 jours", "Sprouting after 3 days"],
      ["bio-hardware.jpg", "Amélioration du porte-seringue", "Improving the syringe holder"],
    ],
    links: [
      { fr: "Documentation Notion", en: "Notion documentation", href: "https://app.notion.com/p/Design-d-une-t-te-de-Bio-impression-pour-l-imprimante-3D-Cosmyx-NOVA-2f5678be33bc807cba10facaf6355be2" },
    ],
  },

  {
    id: "martinique",
    featured: true,
    cover: "mq-station.jpg",
    year: "2026",
    fr: {
      title: "Observatoire météo du Lamentin",
      context: "Stage A4 - Ville du Lamentin × MyGwave",
      lead: "Quatre mois en Martinique, à la Maison de la Résilience, pour renforcer la résilience du territoire face au climat : installation et calibration d'un réseau de stations météo, traitement des données jusqu'à un portail web public avec IA intégrée, station météo solaire et éclairage autonome de la signalétique d'évacuation tsunami.",
      meta: {
        Période: "Avril - août 2026",
        Outils: "Python (Pandas), ESP32, impression 3D, GitHub Pages",
      },
      sections: [
        { title: "Stations météo", items: [
          "Installation et calibration des capteurs Ecowitt : station mécanique, ultrasonique, pluviomètre, console, gateway",
          "Adaptation terrain : cales et modélisation 3D d'un support double imprimé",
          "Scripts Python : nettoyage, synchronisation avec Météo-France, comparaison des stations, détection des écarts",
        ]},
        { title: "Portail web", items: [
          "Observatoire météo du Lamentin publié sur GitHub Pages",
          "Indicateurs clés, graphiques interactifs, sélection du mois",
          "IA intégrée pour générer les bulletins mensuels, téléchargeables en PDF",
        ]},
        { title: "Hardware autonome", items: [
          "Station météo low-tech : panneau solaire, batterie, servomoteurs, capteurs, écran",
          "Signalétique tsunami éclairée : LED IP65, panneau solaire 20 W, batterie LiFePO4 12 V, 3 prototypes",
          "Début des travaux sur un simulateur de yole « bwa drésé », avec Parallèle 14",
        ]},
        { title: "Restitution", items: [
          "Présentation de nos travaux devant une quarantaine d'élus, d'agents territoriaux et d'acteurs locaux",
          "Une étape importante qui a permis de partager nos résultats et d'accompagner la poursuite du projet sur le territoire",
          "Lettre de remerciement du maire du Lamentin",
        ]},
      ],
    },
    en: {
      title: "Le Lamentin Weather Observatory",
      context: "4th-year internship - Ville du Lamentin × MyGwave",
      lead: "Four months in Martinique, at the Maison de la Résilience, to strengthen the territory's climate resilience: installing and calibrating a weather station network, processing the data all the way to a public web portal with built-in AI, a solar-powered weather station and autonomous lighting for tsunami evacuation signage.",
      meta: {
        Period: "April - August 2026",
        Tools: "Python (Pandas), ESP32, 3D printing, GitHub Pages",
      },
      sections: [
        { title: "Weather stations", items: [
          "Installing and calibrating Ecowitt sensors: mechanical and ultrasonic stations, rain gauge, console, gateway",
          "Field adaptation: shims and a 3D-modelled, printed dual bracket",
          "Python scripts: cleaning, syncing with Météo-France, cross-comparing stations, detecting discrepancies",
        ]},
        { title: "Web portal", items: [
          "Le Lamentin weather observatory published on GitHub Pages",
          "Key indicators, interactive charts, month selection",
          "Built-in AI generating the monthly reports, downloadable as PDF",
        ]},
        { title: "Autonomous hardware", items: [
          "Low-tech weather station: solar panel, battery, servomotors, sensors, display",
          "Lit tsunami signage: IP65 LEDs, 20 W solar panel, 12 V LiFePO4 battery, 3 prototypes",
          "Early work on a “bwa drésé” yole simulator, with Parallèle 14",
        ]},
        { title: "Final presentation", items: [
          "Presented our work to around forty elected officials, local government staff and local stakeholders",
          "A key milestone to share our results and support the continuation of the project in the territory",
          "Thank-you letter from the Mayor of Le Lamentin",
        ]},
      ],
    },
    gallery: [
      ["mq-presentation.jpg", "Présentation devant les élus et acteurs locaux", "Presentation to elected officials and local stakeholders"],
      ["mq-restitution.jpg", "Démonstration d'une station météo", "Weather station demonstration"],
      ["mq-installation.jpg", "Installation d'une station Ecowitt", "Installing an Ecowitt station"],
      ["mq-station.jpg", "Station ultrasonique sur son support", "Ultrasonic station on its bracket"],
      ["mq-bracket.jpg", "Support double modélisé et imprimé en 3D", "3D-modelled and printed dual bracket"],
      ["mq-mechanical.jpg", "Station mécanique installée", "Mechanical station installed"],
      ["mq-dashboard.jpg", "Portail de l'observatoire météo", "Weather observatory portal"],
      ["mq-windrose.jpg", "Rose des vents - mai 2026", "Wind rose - May 2026"],
      ["mq-lowtech.jpg", "Prototype de station low-tech autonome", "Autonomous low-tech station prototype"],
      ["mq-tsunami.jpg", "Panneau tsunami éclairé, prototype fonctionnel", "Lit tsunami sign, functional prototype"],
      ["mq-lettre-maire.jpg", "Lettre de remerciement du maire du Lamentin", "Thank-you letter from the Mayor of Le Lamentin"],
    ],
    links: [
      { fr: "Voir l'observatoire météo", en: "Visit the weather observatory", href: "https://audetrikay.github.io/observatoire-meteo-lamentin/" },
    ],
  },

  {
    id: "orika",
    cover: "orika.jpg",
    year: "2025 - 2026",
    fr: {
      title: "ORIKA",
      context: "Projet A4 - Creative Technology",
      lead: "Un porte-monnaie en cuir qui tient tout seul : pas de couture, pas de colle, juste une seule pièce de cuir de récupération, découpée et pliée comme un origami. Conçu à trois étudiants en Creative Technology, du premier pliage papier jusqu'à une campagne Kickstarter financée à plus de 350 %.",
      meta: {
        Rôle: "Design produit, prototypage, lancement",
        Campagne: "772 € collectés sur 220 €, 21 contributeurs",
      },
      sections: [
        { title: "Le défi", items: [
          "Un objet en cuir peut-il exister sans aucune force extérieure pour le maintenir ?",
          "La forme doit naître uniquement de la tension naturelle du cuir",
          "Cuir de récupération (chutes de Cuir de Paname) : chaque pièce se comporte différemment",
        ]},
        { title: "Prototypage", items: [
          "Prototypes papier : plier, déplier, réinventer la géométrie jusqu'à ce que la structure tienne seule",
          "Premières versions en cuir découpées à la main, puis abandon de la languette de fermeture qui générait trop de chutes",
          "Itérations avec et sans refendeuse, avec et sans emporte-pièce, en atelier",
          "Ajout d'une fermeture élastique discrète et d'un petit charm, la signature d'ORIKA",
        ]},
        { title: "Lancement", items: [
          "Campagne Kickstarter du 26 mars au 15 avril 2026",
          "Packs de 1 ou 2 ORIKA, avec choix des couleurs",
          "Production, logistique et expédition aux contributeurs",
          "Dimensions : 24,4 × 24,4 cm ouvert, 9 × 6 × 0,5 cm fermé",
        ]},
      ],
    },
    en: {
      title: "ORIKA",
      context: "4th-year project - Creative Technology",
      lead: "A leather wallet that holds itself together: no stitches, no glue, just one continuous piece of upcycled leather, cut and folded like origami. Designed by three Creative Technology students, from the first paper fold to a Kickstarter campaign funded at over 350%.",
      meta: {
        Role: "Product design, prototyping, launch",
        Campaign: "€772 raised of €220, 21 backers",
      },
      sections: [
        { title: "The challenge", items: [
          "Could a leather object exist without any external force holding it together?",
          "The form has to emerge purely from the natural tension of the leather",
          "Upcycled leather scraps (Cuir de Paname): every piece behaves differently",
        ]},
        { title: "Prototyping", items: [
          "Paper prototypes: folding, unfolding and reinventing the geometry until the structure held itself",
          "First hand-cut leather versions, then dropping the closing tab that created too much waste",
          "Iterations with and without a splitter, with and without a die, at the workshop",
          "A subtle elastic closure and a small charm, ORIKA's signature",
        ]},
        { title: "Launch", items: [
          "Kickstarter campaign from 26 March to 15 April 2026",
          "Packs of 1 or 2 ORIKA, with colour choice",
          "Production, logistics and shipping to backers",
          "Dimensions: 24.4 × 24.4 cm open, 9 × 6 × 0.5 cm closed",
        ]},
      ],
    },
    gallery: [
      ["orika.jpg", "Les portefeuilles ORIKA", "The ORIKA wallets"],
      ["orika-papier.jpg", "Premiers prototypes en papier", "Early paper prototypes"],
      ["orika-chutes.jpg", "Sélection de chutes de cuir chez Cuir de Paname", "Leather scraps selection at Cuir de Paname"],
      ["orika-main.jpg", "Première version découpée à la main", "First hand-cut version"],
      ["orika-refente.jpg", "Refente du cuir en atelier", "Leather splitting at the workshop"],
      ["orika-emporte-piece.jpg", "Découpe à l'emporte-pièce en atelier", "Die-cutting at the workshop"],
      ["orika-comparaison-decoupe.jpg", "Découpe à la main vs emporte-pièce", "Hand-cut vs die-cut"],
      ["orika-comparaison-refente.jpg", "Avant et après refente", "Before and after splitting"],
      ["orika-minimal.jpg", "Prototype minimal", "Minimal prototype"],
      ["orika-final.jpg", "L'ORIKA final", "The final ORIKA"],
    ],
    links: [
      { fr: "Voir la campagne Kickstarter", en: "See the Kickstarter campaign", href: "https://www.kickstarter.com/projects/orika/orika" },
    ],
  },

  /* --- How to Make (Almost) Anything : un mini-projet par atelier --- */
  {
    id: "hmaa-montre",
    cover: "hmaa-pcb-montre.jpg",
    year: "2025 - 2026",
    fr: {
      title: "Montre pour coureurs",
      context: "HM(A)A - majeure Creative Technology",
      lead: "Premier atelier de How to Make (Almost) Anything, cours de la majeure Creative Technology inspiré du MIT : conception d'un PCB de montre intelligente pensée pour les coureurs, puis assemblage et soudure d'une console de type Gameboy.",
      meta: { Outils: "KiCad, XIAO ESP32-S3, soudure" },
      sections: [
        { title: "Électronique & PCB", items: [
          "Schéma et routage sous KiCad d'une montre intelligente autour d'un XIAO ESP32-S3",
          "Moteur vibrant et LED RGB intégrés au PCB",
          "Assemblage et soudure d'une console de type Gameboy",
        ]},
      ],
    },
    en: {
      title: "Smartwatch for runners",
      context: "HM(A)A - Creative Technology major",
      lead: "First workshop of How to Make (Almost) Anything, an MIT-inspired course in the Creative Technology major: designing the PCB of a smartwatch for runners, then assembling and soldering a Gameboy-style console.",
      meta: { Tools: "KiCad, XIAO ESP32-S3, soldering" },
      sections: [
        { title: "Electronics & PCB", items: [
          "KiCad schematic and routing of a smartwatch built around a XIAO ESP32-S3",
          "Vibration motor and RGB LED integrated on the PCB",
          "Assembling and soldering a Gameboy-style console",
        ]},
      ],
    },
    gallery: [
      ["hmaa-pcb-montre.jpg", "PCB de la montre conçu sous KiCad", "Smartwatch PCB designed in KiCad"],
    ],
    links: [],
  },

  {
    id: "hmaa-flute",
    cover: "cloud.jpg",
    year: "2025 - 2026",
    fr: {
      title: "Flûte de pan « nuage »",
      context: "HM(A)A - majeure Creative Technology",
      lead: "Atelier modélisation et impression 3D de How to Make (Almost) Anything : la consigne était de créer un instrument à vent, on a choisi d'inventer le nôtre, une flûte de pan cachée dans un nuage.",
      meta: { Outils: "Rhino 3D, Fusion 360, Bambu Studio" },
      sections: [
        { title: "Du croquis à l'instrument", items: [
          "Test d'un tube seul (un do), puis d'une version à fente, avant de garder la plus simple",
          "Version avec toutes les notes, puis un nuage plus volumineux et réaliste",
          "Modèle final en PLA effet marbre, environ 2 h 30 d'impression, perles transparentes en guise de pluie",
        ]},
      ],
    },
    en: {
      title: "“Cloud” pan flute",
      context: "HM(A)A - Creative Technology major",
      lead: "3D modelling and printing workshop of How to Make (Almost) Anything: the brief was to build a wind instrument, we chose to invent our own, a pan flute hidden inside a cloud.",
      meta: { Tools: "Rhino 3D, Fusion 360, Bambu Studio" },
      sections: [
        { title: "From sketch to instrument", items: [
          "Testing a single tube (a C note), then a slotted version, before keeping the simplest one",
          "A version with every note, then a fuller, more realistic cloud",
          "Final model in marble-effect PLA, about 2.5 h of printing, transparent beads as raindrops",
        ]},
      ],
    },
    gallery: [
      ["cloud.jpg", "Flûte de pan « nuage »", "“Cloud” pan flute"],
      ["hmaa-flute-croquis.jpg", "Croquis : un nuage + une flûte de pan", "Sketch: a cloud + a pan flute"],
      ["hmaa-flute-tube.jpg", "Test d'un tube seul", "Single tube test"],
      ["hmaa-flute-slicer.jpg", "Préparation de l'impression", "Preparing the print"],
      ["hmaa-flute-modele.jpg", "Modèle 3D final du nuage", "Final 3D model of the cloud"],
    ],
    links: [
      { fr: "Documentation", en: "Documentation", href: "https://oil-giraffe-c54.notion.site/Documentation-HMAA-2nd-workshop-294bf791352280d5ad24d0cfab967bf9" },
    ],
  },

  {
    id: "hmaa-arbo",
    cover: "hmaa-arbo-final.jpg",
    year: "2025 - 2026",
    fr: {
      title: "Arbo Laser",
      context: "HM(A)A - majeure Creative Technology",
      lead: "Atelier découpe de How to Make (Almost) Anything : créer un objet 3D assemblé à partir d'une technique de découpe. Un arbre décoratif en bois découpé au laser, habillé de feuilles et d'oiseaux.",
      meta: { Outils: "Rhino 3D, découpe laser, Cricut" },
      sections: [
        { title: "Fabrication", items: [
          "Premier prototype à la Cricut pour valider la forme et l'assemblage",
          "Passage à la découpe laser pour des détails plus fins et une finition plus propre",
          "Feuilles et oiseaux découpés à la Cricut, colorés à la main puis assemblés sur la structure",
        ]},
      ],
    },
    en: {
      title: "Arbo Laser",
      context: "HM(A)A - Creative Technology major",
      lead: "Cutting workshop of How to Make (Almost) Anything: building an assembled 3D object with a cutting technique. A laser-cut decorative wooden tree, dressed with leaves and birds.",
      meta: { Tools: "Rhino 3D, laser cutting, Cricut" },
      sections: [
        { title: "Making", items: [
          "First Cricut prototype to validate the shape and the assembly",
          "Moving to laser cutting for finer details and a cleaner finish",
          "Cricut-cut leaves and birds, hand-coloured and assembled onto the structure",
        ]},
      ],
    },
    gallery: [
      ["hmaa-arbo-final.jpg", "Arbo Laser final", "Final Arbo Laser"],
      ["hmaa-arbo-laser.jpg", "Structure découpée au laser", "Laser-cut structure"],
      ["hmaa-arbo-feuilles.jpg", "Feuilles découpées à la Cricut et colorées", "Cricut-cut, hand-coloured leaves"],
    ],
    links: [
      { fr: "Documentation", en: "Documentation", href: "https://oil-giraffe-c54.notion.site/Documentation-HMAA-2nd-workshop-294bf791352280d5ad24d0cfab967bf9" },
    ],
  },

  {
    id: "hmaa-vga",
    cover: "maze.jpg",
    year: "2025 - 2026",
    fr: {
      title: "Signal vidéo VGA",
      context: "HM(A)A - majeure Creative Technology",
      lead: "Atelier images de How to Make (Almost) Anything : jouer en temps réel avec les couleurs d'une vidéo grâce à l'électronique, puis générer des images et des jeux sur un écran VGA avec un Arduino.",
      meta: { Outils: "Raspberry Pi, soudure, Arduino, VGAX, C++" },
      sections: [
        { title: "PCB vidéo", items: [
          "Soudure d'un PCB qui modifie les couleurs d'une vidéo (Raspberry Pi) avec 3 potentiomètres R, G, B",
          "Debug des soudures au multimètre jusqu'à obtenir les trois couleurs",
        ]},
        { title: "Arduino + VGA", items: [
          "Motifs générés par équations avec la bibliothèque VGAX",
          "« Stickman VS Cactus », inspiré du jeu du dinosaure de Google, avec un bouton poussoir",
          "Un labyrinthe : le joueur est le pixel jaune, piloté au clavier",
        ]},
      ],
    },
    en: {
      title: "VGA video signal",
      context: "HM(A)A - Creative Technology major",
      lead: "Image workshop of How to Make (Almost) Anything: playing with a video's colours in real time through electronics, then generating images and games on a VGA screen with an Arduino.",
      meta: { Tools: "Raspberry Pi, soldering, Arduino, VGAX, C++" },
      sections: [
        { title: "Video PCB", items: [
          "Soldering a PCB that changes a video's colours (Raspberry Pi) with 3 R, G, B potentiometers",
          "Debugging the solder joints with a multimeter until all three colours worked",
        ]},
        { title: "Arduino + VGA", items: [
          "Patterns generated from equations with the VGAX library",
          "“Stickman VS Cactus”, inspired by Google's dinosaur game, with a push button",
          "A maze: the player is the yellow pixel, driven from the keyboard",
        ]},
      ],
    },
    gallery: [
      ["maze.jpg", "Labyrinthe VGA piloté par Arduino", "Arduino-driven VGA maze"],
      ["hmaa-vga-composants.jpg", "Composants du PCB vidéo", "Video PCB components"],
      ["hmaa-vga-pcb.jpg", "Plan du PCB vidéo", "Video PCB layout"],
      ["hmaa-vga-test.jpg", "Premier test : seulement le vert", "First test: green only"],
      ["hmaa-vga-couleurs.jpg", "Réglage des couleurs aux potentiomètres", "Tuning colours with the potentiometers"],
      ["hmaa-vga-schema.jpg", "Schéma Arduino + VGA (VGAX)", "Arduino + VGA schematic (VGAX)"],
      ["hmaa-vga-arduino.jpg", "Montage Arduino sur breadboard", "Arduino breadboard build"],
    ],
    links: [
      { fr: "Documentation", en: "Documentation", href: "https://bow-chalk-0b1.notion.site/HMAA-Week-3-Process-images-2dfcb55dd23580b585add97a6f65caca" },
    ],
  },

  {
    id: "hmaa-ia",
    cover: "hmaa-ia-perceptron.jpg",
    year: "2025 - 2026",
    fr: {
      title: "Apprendre l'IA",
      context: "HM(A)A - majeure Creative Technology",
      lead: "Atelier intelligence artificielle de How to Make (Almost) Anything : comprendre les réseaux de neurones à la main, puis concevoir des interactions volontairement « étranges » pilotées par la vision par ordinateur.",
      meta: { Outils: "Teachable Machine, p5.js, ml5.js (FaceMesh)" },
      sections: [
        { title: "Comprendre", items: [
          "Reconnaissance de postures de yoga avec Teachable Machine",
          "Perceptron et convolution calculés à la main, puis codés en p5.js",
        ]},
        { title: "Weird interactions", items: [
          "Composer son numéro de téléphone en « mangeant » les chiffres à l'écran",
          "An attentive Machine : un poème révélé mot à mot en ouvrant la bouche, qui s'efface quand on part",
        ]},
      ],
    },
    en: {
      title: "Learning AI",
      context: "HM(A)A - Creative Technology major",
      lead: "Artificial intelligence workshop of How to Make (Almost) Anything: understanding neural networks by hand, then designing deliberately “weird” interactions driven by computer vision.",
      meta: { Tools: "Teachable Machine, p5.js, ml5.js (FaceMesh)" },
      sections: [
        { title: "Understanding", items: [
          "Yoga pose recognition with Teachable Machine",
          "Perceptron and convolution computed by hand, then coded in p5.js",
        ]},
        { title: "Weird interactions", items: [
          "Dialling a phone number by “eating” the digits on screen",
          "An attentive Machine: a poem revealed word by word by opening your mouth, fading when you leave",
        ]},
      ],
    },
    gallery: [
      ["hmaa-ia-perceptron.jpg", "Perceptron entraîné à la main", "Perceptron trained by hand"],
      ["hmaa-ia-convolution.jpg", "Convolution calculée à la main", "Convolution computed by hand"],
      ["hmaa-ia-yoga.jpg", "Base de données de postures (Teachable Machine)", "Pose dataset (Teachable Machine)"],
    ],
    links: [
      { fr: "Documentation", en: "Documentation", href: "https://bow-chalk-0b1.notion.site/HMAA-Week-4-Learning-AI-2fccb55dd235802e83e1c0e6e72970eb" },
    ],
  },

  {
    id: "mycelium",
    cover: "mycelium.jpg",
    year: "2024 - 2025",
    fr: {
      title: "Mycélium 3000",
      context: "PIX (A3) - projet de préparation Creative Technology",
      lead: "Contribution à un projet de recherche appliquée en biotechnologies, au biolab : travailler le mycélium, la partie végétative du champignon, pour en faire une alternative au cuir animal, puis tester s'il pourrait servir à construire des structures sur Mars.",
      meta: {
        Thèmes: "Biotechnologies, cuir de mycélium, construction spatiale",
        Lieu: "Biolab & FabLab du Pôle Léonard de Vinci",
      },
      sections: [
        { title: "Cuir de mycélium", items: [
          "Alternative durable au cuir animal, dont l'élevage et le tannage pèsent lourd sur l'environnement",
          "Culture sur un substrat semi-liquide (agar-agar, malt, eau distillée) et pain de champignon (pleurotes)",
          "Incubation à 28 °C, récolte de la couche de mycélium, pressage puis finition à la cire d'abeille",
        ]},
        { title: "Mycélium sur Mars", items: [
          "Problème : envoyer une charge en orbite coûte environ 10 000 $ par livre (source : NASA, Advanced Space Transportation Program) et beaucoup de CO2",
          "Création d'un simulant de régolithe martien à partir de composants accessibles",
          "Briques moulées dans un moule imprimé en 3D, à 20 %, 50 % et 80 % de régolithe",
          "La brique à 20 % est devenue la plus solide, le plus rapidement",
        ]},
        { title: "Ce que j'ai appris", items: [
          "Biologie des champignons : fonctionnement, adaptabilité, résistance",
          "Structurer un protocole et un papier de recherche",
          "Modélisation et impression 3D, soudure, outils du FabLab",
        ]},
      ],
    },
    en: {
      title: "Mycelium 3000",
      context: "PIX (3rd year) - Creative Technology preparation project",
      lead: "Contribution to an applied biotechnology research project in the biolab: working mycelium, the vegetative part of fungi, into an alternative to animal leather, then testing whether it could be used to build structures on Mars.",
      meta: {
        Topics: "Biotechnology, mycelium leather, space construction",
        Place: "Biolab & FabLab, Pôle Léonard de Vinci",
      },
      sections: [
        { title: "Mycelium leather", items: [
          "A sustainable alternative to animal leather, whose farming and tanning weigh heavily on the environment",
          "Grown on a semi-liquid substrate (agar-agar, malt, distilled water) with oyster mushroom spawn",
          "Incubated at 28 °C, mycelium layer harvested, pressed and finished with beeswax",
        ]},
        { title: "Mycelium on Mars", items: [
          "The problem: launching payload to orbit costs about $10,000 per pound (source: NASA, Advanced Space Transportation Program) and a lot of CO2",
          "Making a Martian regolith simulant from accessible components",
          "Bricks cast in a 3D-printed mould, with 20%, 50% and 80% regolith",
          "The 20% brick became the strongest, the fastest",
        ]},
        { title: "What I learned", items: [
          "Fungal biology: how it works, adapts and resists",
          "Structuring a research protocol and paper",
          "3D modelling and printing, soldering, FabLab tools",
        ]},
      ],
    },
    gallery: [
      ["mycelium.jpg", "Échantillons de cuir de mycélium", "Mycelium leather samples"],
      ["myc-culture.jpg", "Préparation du substrat", "Preparing the substrate"],
      ["myc-incubateur.jpg", "Cultures en incubateur", "Cultures in the incubator"],
      ["myc-bocaux.jpg", "Cultures en cours", "Cultures in progress"],
      ["myc-substrat.jpg", "Couche de mycélium sur substrat", "Mycelium layer on substrate"],
      ["myc-brique.jpg", "Mycélium colonisant le mélange", "Mycelium colonising the mix"],
      ["myc-echantillon.jpg", "Échantillon mycélium + régolithe", "Mycelium + regolith sample"],
    ],
    links: [],
  },

  {
    id: "raid",
    cover: "raid.jpg",
    year: "2026",
    fr: {
      title: "Raid du Loup Perdu",
      context: "LéoSurvival - association sportive",
      lead: "Deux raids et un trail au cœur de la forêt de Meudon, le 30 mai 2026. Je l'ai organisé avec le bureau de l'association LéoSurvival, en tant que trésorière : 350 participants, plus de 200 finishers et trois parcours de 6 à 22 km.",
      meta: {
        Rôle: "Trésorière, organisation avec le bureau de l'association",
        Participants: "350",
      },
      sections: [
        { title: "L'événement", items: [
          "3 parcours : raid découverte de 6 km en duo, raid de 15 km et trail de 22 km",
          "42,3 km de parcours au total en pleine forêt",
          "Défis multisports et système de points sur le raid découverte",
        ]},
        { title: "L'organisation", items: [
          "Budget, tarifs et inscriptions en ligne",
          "Sécurité, bénévoles et partenaires",
          "T-shirts, médailles et récompenses pour les podiums",
        ]},
      ],
    },
    en: {
      title: "Raid du Loup Perdu",
      context: "LéoSurvival - sports association",
      lead: "Two adventure races and a trail run in the heart of the Meudon forest, on 30 May 2026. I organized it with the board of the LéoSurvival association, as Treasurer: 350 participants, over 200 finishers and three routes from 6 to 22 km.",
      meta: {
        Role: "Treasurer, organized with the association's board",
        Participants: "350",
      },
      sections: [
        { title: "The event", items: [
          "3 routes: a 6 km discovery race in pairs, a 15 km race and a 22 km trail",
          "42.3 km of routes in total, deep in the forest",
          "Multisport challenges and a points system on the discovery race",
        ]},
        { title: "Organization", items: [
          "Budget, pricing and online registration",
          "Safety, volunteers and partners",
          "T-shirts, medals and podium prizes",
        ]},
      ],
    },
    gallery: [["raid.jpg", "Affiche du Raid du Loup Perdu", "Raid du Loup Perdu poster"]],
    links: [
      { fr: "Voir le site du raid", en: "Visit the race website", href: "https://raid-loup-perdu.dossardclub.fr/" },
    ],
  },
];
