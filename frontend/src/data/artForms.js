
export const artForms = [
  // 1. Warli Painting
  {
    id: 'warli-painting',
    name: 'Warli Painting',
    region: 'Maharashtra',
    thumbnail: '/artImages/warli1.jpg',
    galleryImages: [
      '/artImages/warli2.jpg',
      '/artImages/warli3.jpg',
      '/artImages/warli4.jpg'
    ],
    description: 'Ritualistic art known for its monochromatic stick-figures and geometric patterns depicting social life.',
    materials: 'Rice paste and water on a base of cow dung and red earth.',
    details: {
      stylesAndCharacteristics: `
        <ul>
          <li><strong>Circles:</strong> represent the sun and moon.</li>
          <li><strong>Triangles:</strong> symbolize mountains, trees, or animals.</li>
          <li><strong>Squares:</strong> sacred space, often devoted to the Mother Goddess.</li>
        </ul>
        <p>Figures are mostly stick-like humans and animals, shown dancing, farming, or hunting in rhythmic patterns.</p>
      `,
      themesAndSymbolism: `
        <ul>
          <li><strong>Mother Goddess:</strong> central symbol of fertility and prosperity.</li>
          <li><strong>Daily life:</strong> farming, fishing, hunting, dancing.</li>
          <li><strong>Tarpa dance:</strong> men and women dancing in a spiral around a tarpa player.</li>
          <li><strong>Animals, birds, and nature:</strong> depicted as part of harmony with human life.</li>
        </ul>
      `,
      techniqueAndStyle: `
        <p>The walls are coated with cow dung and red mud, creating a brown canvas. White pigment is made from <strong>rice paste mixed with water and gum</strong>. Bamboo sticks are used as brushes. The paintings are two-dimensional, with no perspective, and every element is interconnected in balanced compositions.</p>
      `
    }
  },
  // 2. Madhubani Painting
  {
    id: 'madhubani-painting',
    name: 'Madhubani Painting',
    region: 'Bihar',
    thumbnail: '/artImages/madhu1.png',
    galleryImages: [
      '/artImages/madhu2.jpg',
      '/artImages/madhu3.jpg',
      '/artImages/madhu4.jpg'
    ],
    description: 'Vibrant paintings from the Mithila region known for intricate line work and mythological themes.',
    materials: 'Natural pigments on paper or canvas, applied with twigs, nib-pens, and brushes.',
    details: {
      stylesAndCharacteristics: `
        <ul>
          <li><strong>Bharni (Filling):</strong> Characterized by filling the entire canvas with vibrant colors.</li>
          <li><strong>Kachni (Line Art):</strong> Uses intricate line work and hatching, often with a limited color palette.</li>
          <li><strong>Tantrik:</strong> Focuses on religious and spiritual symbols and deities.</li>
          <li><strong>Godna:</strong> A tattoo-like style using simple, repetitive patterns.</li>
          <li><strong>Kohbar:</strong> Specifically created for wedding ceremonies, symbolizing prosperity and fertility.</li>
        </ul>
      `,
      themesAndSymbolism: `
        <p>The art is deeply rooted in Hindu mythology, depicting deities like <strong>Rama, Sita, Krishna, and Shiva</strong>. Natural elements such as the sun, moon, and symbolic animals like fish (fertility) and peacocks (love) are central to the narratives.</p>
      `,
      techniqueAndStyle: `
        <p>Artists use tools like twigs, matchsticks, and fine nib-pens. The paintings are known for their <strong>double-line borders</strong> and dense patterns that fill every available space, creating a rich, detailed composition.</p>
      `
    }
  },
  // 3. Gond Painting
  {
    id: 'gond-painting',
    name: 'Gond Painting',
    region: 'Madhya Pradesh',
    thumbnail: '/artImages/gond1.jpg',
    galleryImages: [
      '/artImages/gond2.jpg',
      '/artImages/gond3.jpg',
      '/artImages/gond4.jpg'
    ],
    description: 'Vibrant tribal art filled with intricate patterns of dots and dashes depicting nature and folklore.',
    materials: 'Natural pigments on paper and canvas, originally done on hut walls.',
    details: {
      stylesAndCharacteristics: `
        <p>The most defining feature is the use of intricate patterns—<strong>dots, dashes, lines, and curves</strong>—to fill the outlines of figures. This detailed infilling, known as "patina," gives the art a unique texture and sense of movement.</p>
      `,
      themesAndSymbolism: `
        <p>Gond art is a reflection of the tribe's deep connection with nature. Common themes include folkloric deities, spirits, and the flora and fauna of the forest. The art embodies the belief that <strong>every element of nature is inhabited by a spirit</strong>.</p>
      `,
      techniqueAndStyle: `
        <p>The process starts with a detailed outline, which is then meticulously filled with patterns. The vibrant colors are traditionally sourced from natural materials like <strong>charcoal, colored soil, plant sap, and leaves</strong>.</p>
      `
    }
  },
  // 4. Kalamkari Painting
  {
    id: 'kalamkari-painting',
    name: 'Kalamkari Painting',
    region: 'Andhra Pradesh',
    thumbnail: '/artImages/kalam1.jpg',
    galleryImages: [
      '/artImages/kalam2.jpg',
      '/artImages/kalam3.jpg',
      '/artImages/kalam4.jpg'
    ],
    description: 'An ancient style of hand-painting on textile using a tamarind pen ("kalam") and natural dyes.',
    materials: 'Natural dyes on cotton or silk fabric.',
    details: {
      stylesAndCharacteristics: `
        <ul>
          <li><strong>Srikalahasti Style:</strong> Completely hand-drawn using a "kalam" (pen) for freehand drawing.</li>
          <li><strong>Machilipatnam Style:</strong> Uses hand-carved wooden blocks for printing patterns and outlines.</li>
        </ul>
      `,
      themesAndSymbolism: `
        <p>The art form is a powerful medium for storytelling, often depicting scenes from Hindu epics like the <strong>Ramayana and Mahabharata</strong>. Motifs include gods, goddesses, floral patterns, and paisleys.</p>
      `,
      techniqueAndStyle: `
        <p>Kalamkari involves a meticulous, multi-step process. The fabric is first treated to prevent smudging. Artists then use a <strong>tamarind pen</strong> to draw and fill in colors, which are all derived from natural sources.</p>
      `
    }
  },
  // 5. Pithora Painting
  {
    id: 'pithora-painting',
    name: 'Pithora Painting',
    region: 'Gujarat & Madhya Pradesh',
    thumbnail: '/artImages/pithora1.jpg',
    galleryImages: [
      '/artImages/pithora2.jpg',
      '/artImages/pithora3.jpg',
      '/artImages/pithora4.jpg'
    ],
    description: 'Ritualistic wall paintings by the Rathwa and Bhilala tribes, depicting the wedding of the god Pithora Baba.',
    materials: 'Natural pigments on plaster walls.',
    details: {
      stylesAndCharacteristics: `
        <p>The paintings are characterized by their vibrant, crowded compositions. A defining feature is a <strong>wavy line</strong> that separates the earthly realm from the divine. All figures are shown in profile.</p>
      `,
      themesAndSymbolism: `
        <p>The central theme is the depiction of the <strong>wedding procession of the god Pithora Baba</strong>. The entire canvas is filled with gods, goddesses, animals, and scenes from daily life, symbolizing abundance and prosperity.</p>
      `,
      techniqueAndStyle: `
        <p>The art is a sacred ritual performed on the walls of homes. The artists, known as <strong>Lakharas</strong>, use bright pigments mixed with milk and liquor from the Mahua tree, and the entire painting is completed in a single session accompanied by chanting.</p>
      `
    }
  },
  // 6. Tanjore Painting
  {
    id: 'tanjore-painting',
    name: 'Tanjore Painting',
    region: 'Tamil Nadu',
    thumbnail: '/artImages/tanjore1.jpg',
    galleryImages: [
      '/artImages/tanjore2.jpg',
      '/artImages/tanjore3.jpg',
      '/artImages/tanjore4.jpg'
    ],
    description: 'A classical South Indian art known for its rich colors, gold foil overlays, and gem inlays.',
    materials: 'Gold foil, semi-precious stones, and pigments on a wooden plank.',
    details: {
      stylesAndCharacteristics: `
        <p>The most defining feature is the use of <strong>real 22-carat gold foil</strong>, which is layered over embossed areas to create a three-dimensional effect. The figures are typically round-faced with serene, almond-shaped eyes.</p>
      `,
      themesAndSymbolism: `
        <p>Themes are predominantly devotional, with the central figure being a Hindu deity like <strong>Krishna, Lakshmi, or Ganesha</strong>. The painting is considered a sacred icon and is often placed in prayer rooms.</p>
      `,
      techniqueAndStyle: `
        <p>The process involves "Gesso work," where a mixture of limestone and a binding agent is used to create a raised surface. Gold foil and semi-precious stones are then set onto these areas before the final painting is done.</p>
      `
    }
  },
  // 7. Cheriyal Scroll Painting
  {
    id: 'cheriyal-scroll-painting',
    name: 'Cheriyal Scroll Painting',
    region: 'Telangana',
    thumbnail: '/artImages/cheri1.jpg',
    galleryImages: [
      '/artImages/cheri2.jpg',
      '/artImages/cheri3.jpg',
      '/artImages/cheri4.jpg'
    ],
    description: 'A stylized narrative art form where stories are depicted on long, vertical scrolls of khadi cloth.',
    materials: 'Natural pigments on hand-spun khadi cloth treated with tamarind seed paste.',
    details: {
      stylesAndCharacteristics: `
        <p>The art is presented in a comic-strip-like format, with panels separating different scenes of a story. A defining feature is the use of a <strong>brilliant red background</strong>, which makes the stylized figures stand out.</p>
      `,
      themesAndSymbolism: `
        <p>The scrolls serve as a visual aid for storytellers, narrating tales from the <strong>Ramayana, Mahabharata, and local folk mythologies</strong>. The art reflects the lifestyle and traditions of the region.</p>
      `,
      techniqueAndStyle: `
        <p>The Khadi canvas is stiffened with a mixture of tamarind seed paste and rice starch. Artists first sketch the outlines and then apply natural colors in a sequence, finishing with a <strong>sharp black outline</strong> to define the characters.</p>
      `
    }
  },
  // 8. Phad Painting
  {
    id: 'phad-painting',
    name: 'Phad Painting',
    region: 'Rajasthan',
    thumbnail: '/artImages/phad1.jpg',
    galleryImages: [
      '/artImages/phad2.jpg',
      '/artImages/phad3.jpeg',
      '/artImages/phad4.jpeg'
    ],
    description: 'A narrative scroll painting tradition depicting the heroic deeds of folk deities like Pabuji and Devnarayan.',
    materials: 'Natural pigments on a hand-spun cloth (phad) stiffened with starch.',
    details: {
      stylesAndCharacteristics: `
        <p>These are large, horizontal scrolls where the entire life story of a deity is depicted in a single, complex composition. The figures are bold and strong, and their scale is determined by their social status in the narrative. <strong>Vibrant orange and red colors</strong> are used prominently.</p>
      `,
      themesAndSymbolism: `
        <p>The art is centered on the heroic exploits of Rajasthani folk deities, primarily <strong>Pabuji and Devnarayan</strong>. The scroll acts as a mobile temple for storyteller-priests known as Bhopas.</p>
      `,
      techniqueAndStyle: `
        <p>The canvas ('phad') is stiffened with boiled flour and gum. A unique tradition is that the artist paints the <strong>eyes of the main deity last</strong>, a ritual that is believed to breathe life into the painting.</p>
      `
    }
  },
  // 9. Miniature Painting
  {
    id: 'miniature-painting',
    name: 'Miniature Painting',
    region: 'Northern India (esp. Rajasthan, Punjab)',
    thumbnail: '/artImages/mini1.jpg',
    galleryImages: [
      '/artImages/mini2.jpg',
      '/artImages/mini3.jpg',
      '/artImages/mini4.jpeg'
    ],
    description: 'A broad genre of highly detailed and intricate paintings of a small size, with major schools like Mughal and Rajasthani.',
    materials: 'Natural stone pigments, often with gold and silver, on paper or ivory.',
    details: {
      stylesAndCharacteristics: `
        <ul>
          <li><strong>Mughal School:</strong> Focused on realism, with themes of court scenes, portraits, and historical events. Known for its fine, delicate brushstrokes.</li>
          <li><strong>Rajasthani School:</strong> More lyrical and emotional, with themes of devotion and romance, especially the divine love of <strong>Radha and Krishna</strong>. Characterized by bold, vibrant colors.</li>
        </ul>
      `,
      themesAndSymbolism: `
        <p>Themes vary widely by school, from the secular and historical records of the Mughals to the deeply devotional and romantic narratives of the Rajput courts.</p>
      `,
      techniqueAndStyle: `
        <p>The art is an act of precision and patience, using handmade paper and extremely fine brushes, sometimes made from a <strong>single squirrel hair</strong>. The colors are derived from minerals, vegetables, and precious metals.</p>
      `
    }
  },
  // 10. Pattachitra
  {
    id: 'pattachitra',
    name: 'Pattachitra',
    region: 'Odisha',
    thumbnail: '/artImages/patta4.jpg',
    galleryImages: [
      '/artImages/patta3.jpeg',
      '/artImages/patta2.jpg',
      '/artImages/patta1.png'
    ],
    description: 'A traditional, cloth-based scroll painting from Odisha, known for its mythological narratives and decorative borders.',
    materials: 'Natural pigments on a cloth canvas (patta) coated with a tamarind seed paste.',
    details: {
      stylesAndCharacteristics: `
        <p>Pattachitra is known for its classical, stylized figures and the inclusion of intricate, decorative borders around the central artwork. The paintings are rich in detail, with a strong emphasis on lines and patterns. <strong>The characters are typically shown in profile or three-quarter profile.</strong></p>
      `,
      themesAndSymbolism: `
        <p>The themes are predominantly mythological, with a strong focus on the cult of <strong>Lord Jagannath</strong>, a form of Lord Vishnu. The paintings depict stories from the Hindu epics, the Puranas, and the legends surrounding the Jagannath temple in Puri.</p>
      `,
      techniqueAndStyle: `
        <p>The canvas ('patta') is prepared by coating a piece of cloth with a mixture of chalk and gum made from tamarind seeds. The artists, known as 'Chitrakars', use colors derived from natural sources like conch shells for white and lamp soot for black. After painting, the artwork is given a lacquer coating to make it water-resistant and durable.</p>
      `
    }
  }
];