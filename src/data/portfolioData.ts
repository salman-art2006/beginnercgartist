import portfolio1 from "@/assets/portfolio-1.jpg";
import portfolio2 from "@/assets/portfolio-2.jpg";
import portfolio3 from "@/assets/portfolio-3.jpg";
import portfolio4 from "@/assets/portfolio-4.jpg";
import portfolio5 from "@/assets/portfolio-5.jpg";
import portfolio6 from "@/assets/portfolio-6.jpg";

export interface PortfolioProject {
  id: string;
  title: string;
  category: string;
  description: string;
  longDescription: string;
  tools: string[];
  software: string[];
  image: string;
  galleryImages: string[];
  workflowSteps: { title: string; description: string }[];
  renderTime?: string;
  polyCount?: string;
  resolution?: string;
  downloadFileId?: string;
  downloadFileName?: string;
}

export const portfolioProjects: PortfolioProject[] = [
  {
    id: "ancient-temple",
    title: "Ancient Temple Ruins",
    category: "Exterior",
    description: "A crumbling temple overrun by nature, featuring god-ray lighting and moss-covered stone geometry.",
    longDescription: "This project explores the beauty of decay — an ancient stone temple slowly being reclaimed by nature. The scene features volumetric god-ray lighting streaming through collapsed roof sections, intricate moss growth across weathered stone surfaces, and carefully placed vegetation that tells the story of centuries passing. The architecture draws inspiration from Southeast Asian temple complexes, with ornate carvings partially obscured by organic overgrowth. Every element was designed to create a sense of sacred abandonment — a place where nature and human craftsmanship coexist in a delicate, cinematic balance.",
    tools: ["Blender", "Substance Painter", "HDRI Haven"],
    software: ["Blender 3.6", "Substance Painter 2024", "Photoshop"],
    image: portfolio1,
    galleryImages: [portfolio1, portfolio2, portfolio3],
    workflowSteps: [
      { title: "Reference & Concept", description: "Gathered 50+ reference images of Angkor Wat and Mayan ruins. Created a mood board focusing on lighting and vegetation patterns." },
      { title: "Blockout & Composition", description: "Built the temple structure using basic geometry to establish scale and camera composition. Tested multiple angles before committing." },
      { title: "Detailed Modeling", description: "Added architectural details — column carvings, stone bricks, broken edges. Used boolean operations for damage and decay effects." },
      { title: "Vegetation & Scatter", description: "Created moss, vines, and small plants using particle systems and Geo-Scatter. Hand-placed hero vegetation for focal points." },
      { title: "Materials & Texturing", description: "Layered procedural stone materials with painted moss masks. Used Substance Painter for hero asset textures." },
      { title: "Lighting & Rendering", description: "Sun lamp through roof opening for god rays. Volume cube for atmospheric haze. Rendered in Cycles at 2K with 512 samples." },
    ],
    renderTime: "~45 minutes per frame",
    polyCount: "2.4M triangles",
    resolution: "2560 × 1440",
    downloadFileId: "ancient-temple-blend",
    downloadFileName: "AncientTemple_v2.blend",
  },
  {
    id: "neon-alley",
    title: "Neon Alley",
    category: "Urban",
    description: "A rain-soaked cyberpunk alleyway with volumetric neon lighting and reflective wet surfaces.",
    longDescription: "Neon Alley is a love letter to cyberpunk aesthetics — a narrow urban corridor drenched in rain, illuminated by competing neon signs in hot pink, electric blue, and acid green. The wet pavement acts as a mirror, doubling the visual complexity and creating a dreamlike atmosphere. Steam rises from grates, trash bags pile against walls covered in holographic advertisements, and a single figure's shadow stretches across the ground. The scene explores how light and reflection can transform a mundane urban space into something otherworldly and cinematic.",
    tools: ["Blender", "Cycles", "Photoshop"],
    software: ["Blender 3.6", "Adobe Photoshop 2024"],
    image: portfolio2,
    galleryImages: [portfolio2, portfolio4, portfolio6],
    workflowSteps: [
      { title: "Concept Art Study", description: "Studied Blade Runner, Ghost in the Shell, and real-world Kowloon Walled City photography for visual direction." },
      { title: "Modular Building System", description: "Created modular wall panels, sign brackets, and pipe systems that snap together for flexible alleyway construction." },
      { title: "Neon Sign Creation", description: "Built emissive neon signs using curve objects converted to mesh with glass and emission shaders." },
      { title: "Wet Surface Shaders", description: "Developed a rain-wet shader with high roughness variation and subtle normal perturbation for realistic puddle reflections." },
      { title: "Atmospheric Effects", description: "Used volume scatter cubes with density noise textures for localized fog and steam effects around light sources." },
      { title: "Post-Processing", description: "Added chromatic aberration, bloom, and film grain in the compositor for a cinematic cyberpunk feel." },
    ],
    renderTime: "~1 hour per frame",
    polyCount: "1.8M triangles",
    resolution: "2560 × 1440",
  },
  {
    id: "aurora-cabin",
    title: "Aurora Cabin",
    category: "Exterior",
    description: "A cozy cabin under the aurora borealis, featuring snow particle systems and warm interior glow.",
    longDescription: "Aurora Cabin captures the quiet magic of a winter night in the far north. A small wooden cabin sits in a snow-covered clearing, its windows glowing with warm amber light that spills onto the surrounding snowdrifts. Above, the aurora borealis ripples across the sky in emerald and violet waves. Snow particles drift lazily through the air, catching the light. The scene is designed to evoke warmth and solitude — the idea that somewhere in the wilderness, there's a place of comfort and wonder. Every texture, from the rough-hewn timber to the crystalline snow, was crafted to feel tactile and real.",
    tools: ["Blender", "Quixel Megascans"],
    software: ["Blender 3.6", "Quixel Bridge"],
    image: portfolio3,
    galleryImages: [portfolio3, portfolio1, portfolio5],
    workflowSteps: [
      { title: "Scene Planning", description: "Sketched composition focusing on the cabin as a warm focal point against the cold landscape. Planned aurora placement." },
      { title: "Terrain & Snow", description: "Sculpted terrain with displacement modifiers. Created snow using particle systems with weight-painted distribution." },
      { title: "Cabin Modeling", description: "Built the cabin with detailed log construction, window frames, chimney, and a small porch with snow accumulation." },
      { title: "Aurora Shader", description: "Created the aurora using a translucent plane with animated noise textures driving emission color and opacity." },
      { title: "Lighting Design", description: "Cool HDRI for moonlight base. Warm point lights inside cabin. Subtle rim lighting on snow edges." },
      { title: "Final Polish", description: "Added snow particles, chimney smoke, and star field. Rendered in Cycles with denoising for clean, soft results." },
    ],
    renderTime: "~30 minutes per frame",
    polyCount: "3.1M triangles",
    resolution: "2560 × 1440",
    downloadFileId: "aurora-cabin-blend",
    downloadFileName: "AuroraCabin_Scene.blend",
  },
  {
    id: "sunken-city",
    title: "Sunken City",
    category: "Underwater",
    description: "An underwater cityscape with caustic lighting, floating debris, and bioluminescent flora.",
    longDescription: "Sunken City imagines what a metropolis might look like centuries after being submerged beneath the ocean. Towering structures covered in coral and barnacles rise from the seabed, their windows dark except for the occasional bioluminescent glow. Caustic light patterns dance across every surface as sunlight filters through the water above. Schools of fish navigate between buildings, and kelp forests have colonized the streets. The scene explores themes of impermanence and nature's ability to reclaim even our most ambitious constructions, creating an eerie yet beautiful underwater world.",
    tools: ["Blender", "EEVEE", "After Effects"],
    software: ["Blender 3.6", "Adobe After Effects 2024"],
    image: portfolio4,
    galleryImages: [portfolio4, portfolio2, portfolio6],
    workflowSteps: [
      { title: "Underwater Research", description: "Studied real underwater photography and shipwreck footage for color, light behavior, and organic growth patterns." },
      { title: "City Layout", description: "Designed a grid of submerged buildings at various stages of collapse, using array modifiers for structural repetition." },
      { title: "Organic Growth", description: "Created coral, barnacle, and kelp assets. Distributed using weight-painted particle systems for natural-looking coverage." },
      { title: "Caustic Lighting", description: "Projected animated caustic textures onto surfaces using spotlight cookies. Added volumetric scatter for underwater haze." },
      { title: "Bioluminescence", description: "Created emissive flora with animated intensity. Point lights with low range for localized glow effects." },
      { title: "Compositing", description: "Added depth fog, color grading toward blue-green, and floating particle overlay in After Effects." },
    ],
    renderTime: "~50 minutes per frame",
    polyCount: "4.2M triangles",
    resolution: "3840 × 2160",
    downloadFileId: "sunken-city-blend",
    downloadFileName: "SunkenCity_Final.blend",
  },
  {
    id: "desert-gateway",
    title: "Desert Gateway",
    category: "Exterior",
    description: "A monumental archway rising from sand dunes with dramatic sunset lighting and heat haze.",
    longDescription: "Desert Gateway presents a colossal stone archway emerging from endless sand dunes, bathed in the golden-hour light of a dramatic desert sunset. The monument stands as a silent sentinel — its origin unknown, its purpose forgotten. Wind-eroded surfaces tell of millennia of exposure, while sand drifts pile against its base. The sky transitions from deep amber at the horizon to violet overhead, and the heat shimmer effect adds a dreamlike quality to the distant landscape. This project was an exercise in scale, atmosphere, and the emotional power of a single architectural element in a vast, empty landscape.",
    tools: ["Blender", "Substance Designer"],
    software: ["Blender 3.6", "Substance Designer 2024"],
    image: portfolio5,
    galleryImages: [portfolio5, portfolio1, portfolio3],
    workflowSteps: [
      { title: "Concept & Scale", description: "Established the massive scale using a human figure reference. Designed the archway silhouette for maximum dramatic impact." },
      { title: "Sand Dune Landscape", description: "Created rolling dunes using landscape generation with displacement maps. Added wind-blown sand detail at dune crests." },
      { title: "Monument Modeling", description: "Sculpted the archway with erosion detail, cracks, and partially buried lower sections suggesting ancient origins." },
      { title: "Material Development", description: "Created weathered sandstone material in Substance Designer with layered erosion, sand accumulation, and color variation." },
      { title: "Sunset Lighting", description: "Low-angle sun lamp for golden-hour warmth. Gradient sky texture transitioning from amber to violet. Atmospheric volume for haze." },
      { title: "Heat Distortion", description: "Added subtle displacement-based heat shimmer effect in compositing for the desert atmosphere." },
    ],
    renderTime: "~25 minutes per frame",
    polyCount: "1.2M triangles",
    resolution: "3840 × 2160",
  },
  {
    id: "medieval-tavern",
    title: "Medieval Tavern",
    category: "Interior",
    description: "A warmly lit tavern interior with candle light, wooden beams, and scattered props telling stories.",
    longDescription: "The Medieval Tavern is an invitation to sit down, order an ale, and listen to stories. Every corner of this interior scene is packed with narrative detail — a half-finished chess game on a corner table, a bard's lute leaning against a chair, tankards left by patrons who stepped out into the night. Warm candlelight flickers across rough wooden surfaces, casting dancing shadows on stone walls. The scene combines architectural accuracy with atmospheric storytelling, creating a space that feels lived-in and authentic. It's the kind of place you can almost smell — old wood, candle wax, and roasting meat from the kitchen.",
    tools: ["Blender", "Cycles", "Quixel Bridge"],
    software: ["Blender 3.6", "Quixel Bridge", "Marmoset Toolbag"],
    image: portfolio6,
    galleryImages: [portfolio6, portfolio4, portfolio2],
    workflowSteps: [
      { title: "Floorplan & Layout", description: "Designed the tavern layout with a central hearth, bar counter, seating areas, and a staircase to an upper floor." },
      { title: "Structural Elements", description: "Modeled exposed wooden beams, stone walls, timber floor planks, and a thatched element near the entrance." },
      { title: "Prop Creation", description: "Created 30+ unique props — tankards, plates, candles, books, weapons, food items — each with its own material." },
      { title: "Storytelling Details", description: "Placed props to suggest narratives: a spilled drink, a wanted poster, dice on a table, a cloak draped over a chair." },
      { title: "Candlelight System", description: "Used point lights with warm color temperature at each candle position. Animated flicker using driver expressions." },
      { title: "Final Atmosphere", description: "Added dust particles in light beams, slight lens vignette, and warm color grading for a cozy, inviting mood." },
    ],
    renderTime: "~55 minutes per frame",
    polyCount: "5.8M triangles",
    resolution: "2560 × 1440",
    downloadFileId: "medieval-tavern-blend",
    downloadFileName: "MedievalTavern_v3.blend",
  },
];
