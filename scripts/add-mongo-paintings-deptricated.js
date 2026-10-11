/*
    Author: Connor Kippes

    Adds all painting meta-data for initial setup to the database.
    This will not be necessary for future as Kasey will be able to
    directly add paintings to the mongo db.
*/

import mongoose from "mongoose";
import dotenv from "dotenv";

import Painting from "../src/model/painting.js";

dotenv.config();

const { MONGODB_URL } = process.env;

async function setupDb() {
    await mongoose.connect(MONGODB_URL);

    // Clear existing painting documents
    await Painting.deleteMany({});

    // Populate the database with the initial painting metadata
    await populateDb(Painting);

    console.log("Initial DB setup complete.");

    await mongoose.disconnect();
}

setupDb().catch((err) => {
    console.error("Initial DB setup failed:", err);
    process.exit(1);
});

async function populateDb(Painting) {
    let painting75 = new Painting({
        name: "Heatwave Butterfly",
        image: "HeatwaveButterfly.webp",
        dimensions: {
            length: 36,
            width: 24,
            depth: 1.5,
        },
        date: 2026,
        canvas: "Wood Panel",
        finish: "Epoxy Coating",
        desc: "Heatwave picture on a wood panel of a butterfly.",
        price: 350,
        sold: true,
    });

    await painting75.save();

    let painting74 = new Painting({
        name: "Heated",
        image: "Heated.webp",
        dimensions: {
            length: 6,
            width: 6,
            depth: 1.5,
        },
        date: 2026,
        canvas: "Wood Panel",
        finish: "Epoxy Coating",
        desc: "Heatwave pictures on a wood panel.",
        price: 75,
        mult: true,
        framed: true,
    });
    await painting74.save();

    let painting73 = new Painting({
        name: "Free as a Butterfly",
        image: "FreeAsAButterfly.webp",
        dimensions: {
            length: 20,
            width: 16,
            depth: 1.5,
        },
        date: 2026,
        paint: "Acrylic",
        canvas: "Wood Panel",
        finish: "Epoxy Coating",
        desc: "Mixed media art.",
        price: 175,
    });
    await painting73.save();

    let painting72 = new Painting({
        name: "Solo Flight",
        image: "SoloFlight.webp",
        dimensions: {
            length: 12,
            width: 12,
            depth: 0.875,
        },
        date: 2026,
        paint: "Acrylic",
        canvas: "Wood Panel",
        finish: "Epoxy Coating",
        desc: "Mixed media art.",
        price: 250,
    });

    await painting72.save();

    let painting71 = new Painting({
        name: "Metamorphosis",
        image: "Metamorphosis.webp",
        dimensions: {
            length: 12,
            width: 12,
            depth: 0.875,
        },
        date: 2026,
        paint: "Acrylic",
        canvas: "Wood Panel",
        finish: "Epoxy Coating",
        desc: "Mixed media art.",
        price: 65,
    });

    await painting71.save();

    let painting48 = new Painting({
        name: "3D Dot Fusion",
        image: "3DDotFusion.webp",
        dimensions: {
            length: 12,
            width: 12,
            depth: 0.875,
        },
        date: 2025,
        paint: "Acrylic",
        canvas: "Wood Panel",
        finish: "Epoxy Coating",
        price: 250,
        mult: true,
    });

    await painting48.save();

    let painting62 = new Painting({
        name: "Angel of Dreams",
        image: "AngelOfDreams.webp",
        dimensions: {
            length: 36,
            width: 48,
            depth: 1.5,
        },
        date: 2026,
        paint: "Acrylic",
        canvas: "Wood Panel",
        finish: "Epoxy Coating",
        desc: "Mixed media art.",
        price: 1695,
    });
    await painting62.save();

    let painting1 = new Painting({
        name: "Beyond the Limit",
        image: "BeyondTheLimit.webp",
        dimensions: {
            length: 24,
            width: 24,
            depth: 1.5,
        },
        paint: "Oil",
        canvas: "Wood Panel",
        finish: "Epoxy Coating",
        price: 750,
        mult: true,
    });

    await painting1.save();

    let painting58 = new Painting({
        name: "Blue Dasher",
        image: "BlueDasher.webp",
        dimensions: {
            length: 12,
            width: 12,
            depth: 0.875,
        },
        date: 2025,
        paint: "Acrylic",
        canvas: "Wood Panel",
        finish: "Epoxy Coating",
        desc: "Mixed media art of a blue dragonfly.",
        sold: true,
    });

    await painting58.save();

    let painting2 = new Painting({
        name: "Blue Pallete",
        image: "BluePallete.webp",
        dimensions: {
            length: 36,
            width: 36,
            depth: 1,
        },
        paint: "Oil",
        canvas: "Fabric Canvas",
        finish: "Textured Finish",
        sold: true,
    });

    await painting2.save();

    let painting35 = new Painting({
        name: "Butterflies",
        image: "Butterflies.webp",
        dimensions: {
            length: 10,
            width: 10,
            depth: 0.5,
        },
        date: 2025,
        paint: "Acrylic",
        canvas: "Wood Panel",
        finish: "Epoxy Coating",
        desc: "3 panel butterflies.",
        price: 150,
        mult: true,
    });

    await painting35.save();

    let painting3 = new Painting({
        name: "Butterflies in Flight",
        image: "ButterfliesInFlight.webp",
        dimensions: {
            length: 16,
            width: 24,
            depth: 1,
        },
        date: 2025,
        paint: "Oil",
        canvas: "Wood Panel",
        price: 175,
    });

    await painting3.save();

    let painting57 = new Painting({
        name: "Butterfly Effect",
        image: "ButterflyEffect.webp",
        dimensions: {
            length: 8,
            width: 10,
            depth: 1,
        },
        date: 2025,
        paint: "Acrylic",
        canvas: "Canvas",
        finish: "Thin Epoxy Coating",
        desc: "Mixed media art of two butterflies in floating frames.",
        framed: true,
        mult: true,
        price: 140,
    });

    await painting57.save();

    let painting4 = new Painting({
        name: "Circular Echo",
        image: "CircularEcho.webp",
        dimensions: {
            length: 30,
            width: 30,
            depth: 1.5,
        },
        paint: "Oil",
        canvas: "Canvas",
        price: 200,
    });

    await painting4.save();

    let painting5 = new Painting({
        name: "Colors in Motion",
        image: "ColorsInMotion.webp",
        dimensions: {
            length: 30,
            width: 36,
            depth: 1,
        },
        paint: "Acrylic",
        canvas: "Canvas",
        price: 400,
    });

    await painting5.save();

    let painting6 = new Painting({
        name: "Colors of Liberty",
        image: "ColorsOfLiberty.webp",
        dimensions: {
            length: 24,
            width: 30,
            depth: 1,
        },
        sold: true,
    });

    await painting6.save();

    let painting7 = new Painting({
        name: "Color Spectrum",
        image: "ColorSpectrum.webp",
        dimensions: {
            length: 36,
            width: 48,
            depth: 1.5,
        },
        paint: "Acrylic",
        canvas: "Wood Panel",
        finish: "Epoxy Coating",
        price: 1900,
    });

    await painting7.save();

    let painting56 = new Painting({
        name: "Colorful Flutter",
        image: "ColorfulFlutter.webp",
        dimensions: {
            length: 10,
            width: 10,
            depth: 1.5,
        },
        date: 2025,
        paint: "Acrylic",
        canvas: "Wood Panel",
        finish: "Epoxy Coating",
        desc: "Mixed media art of white and green butterflies.",
        price: 250,
        mult: true,
    });

    await painting56.save();

    let painting49 = new Painting({
        name: "Cosmic Dust",
        image: "CosmicDust.webp",
        dimensions: {
            length: 20,
            width: 20,
            depth: 0.875,
        },
        date: 2025,
        paint: "Acrylic",
        canvas: "Wood Panel",
        finish: "Epoxy Coating",
        price: 250,
    });

    await painting49.save();

    let painting68 = new Painting({
        name: "Cosmic Drift",
        image: "CosmicDrift.webp",
        dimensions: {
            length: 30,
            width: 30,
            depth: 2.5,
        },
        date: 2026,
        paint: "Acrylic",
        canvas: "Wood Panel",
        finish: "Epoxy Coating",
        sold: true,
    });

    await painting68.save();

    let painting8 = new Painting({
        name: "Cosmic Tides",
        image: "CosmicTides.webp",
        dimensions: {
            length: 16,
            width: 20,
            depth: 1,
        },
        paint: "Acrylic",
        sold: true,
    });

    await painting8.save();

    let painting45 = new Painting({
        name: "Dark Points",
        image: "DarkPoints.webp",
        date: 2025,
        sold: true,
    });

    await painting45.save();

    let painting30 = new Painting({
        name: "Discovery",
        image: "Discovery.webp",
        dimensions: {
            length: 24,
            width: 24,
            depth: 1.5,
        },
        date: 2025,
        paint: "Acrylic",
        canvas: "Wood Panel",
        finish: "Epoxy Coating",
        desc: "Mixed media art of a green butterfly.",
        price: 300,
    });

    await painting30.save();

    let painting9 = new Painting({
        name: "Dot Fusion",
        image: "DotFusion.webp",
        dimensions: {
            length: 48,
            width: 48,
            depth: 1,
        },
        sold: true,
    });

    await painting9.save();

    let painting10 = new Painting({
        name: "Dot Symphony",
        image: "DotSymphony.webp",
        sold: true,
    });
    await painting10.save();

    let painting61 = new Painting({
        name: "Double Lines",
        image: "DoubleLines.webp",
        dimensions: {
            length: 20,
            width: 20,
            depth: 0.875,
        },
        date: 2026,
        paint: "Acrylic",
        canvas: "Wood Panel",
        finish: "Epoxy Coating",
        price: 350,
    });

    await painting61.save();

    let painting29 = new Painting({
        name: "Dream",
        image: "Dream.webp",
        dimensions: {
            length: 24,
            width: 24,
            depth: 1.5,
        },
        date: 2025,
        paint: "Acrylic",
        canvas: "Wood Panel",
        finish: "Epoxy Coating",
        desc: "Mixed media art of a monarch butterfly.",
        price: 300,
    });

    await painting29.save();

    let painting66 = new Painting({
        name: "Dreams",
        image: "Dreams.webp",
        dimensions: {
            length: 10,
            width: 10,
            depth: 1,
        },
        date: 2025,
        paint: "Acrylic",
        canvas: "Wood Panel",
        finish: "Epoxy Coating",
        desc: "Mixed media art.",
        sold: true,
    });
    await painting66.save();

    let painting11 = new Painting({
        name: "Eternal Light",
        image: "EternalLight.webp",
        dimensions: {
            length: 36,
            width: 48,
            depth: 1,
        },
        paint: "Oil",
        framed: true,
        sold: true,
    });

    await painting11.save();

    let painting39 = new Painting({
        name: "Electric Waves",
        image: "ElectricWaves.webp",
        dimensions: {
            length: 48,
            width: 24,
            depth: 1,
        },
        canvas: "Canvas",
        mult: true,
        sold: true,
    });

    await painting39.save();

    let painting12 = new Painting({
        name: "Eternal Sunshine",
        image: "EternalSunshine.webp",
        dimensions: {
            length: 36,
            width: 48,
            depth: 1,
        },
        paint: "Acrylic",
        sold: true,
    });

    await painting12.save();

    let painting13 = new Painting({
        name: "Flowing Essence",
        image: "FlowingEssence.webp",
        dimensions: {
            length: 6,
            width: 6,
            depth: 1,
        },
        paint: "Acrylic",
        canvas: "Wood Panel",
        finish: "Epoxy Coating",
        mult: true,
        sold: true,
    });

    await painting13.save();

    let painting52 = new Painting({
        name: "Focus",
        image: "Focus.webp",
        dimensions: {
            length: 20,
            width: 20,
            depth: 0.875,
        },
        date: 2025,
        paint: "Acrylic",
        canvas: "Wood Panel",
        finish: "Epoxy Coating",
        price: 175,
    });

    await painting52.save();

    let painting65 = new Painting({
        name: "Free",
        image: "Free.webp",
        dimensions: {
            length: 16,
            width: 16,
            depth: 1,
        },
        date: 2025,
        paint: "Acrylic",
        canvas: "Wood Panel",
        finish: "Epoxy Coating",
        desc: "Mixed media art.",
        sold: true,
    });
    await painting65.save();

    let painting38 = new Painting({
        name: "Golden Giants",
        image: "GoldenGiants.webp",
        dimensions: {
            length: 30,
            width: 18,
            depth: 1.25,
        },
        date: 2025,
        paint: "Acrylic",
        canvas: "Wood Panel",
        finish: "Decorative High Gloss Coating",
        desc: "A sunflower painting made with pattette knife.",
        price: 175,
        sold: true,
    });

    await painting38.save();

    let painting14 = new Painting({
        name: "Hazy Drift",
        image: "HazyDrift.webp",
        dimensions: {
            length: 60,
            width: 36,
            depth: 1.25,
        },
        date: 2015,
        paint: "Acrylic",
        canvas: "Canvas",
        finish: "Varnish",
        price: 550,
    });
    await painting14.save();

    let painting64 = new Painting({
        name: "High Hopes",
        image: "HighHopes.webp",
        dimensions: {
            length: 16,
            width: 16,
            depth: 1,
        },
        date: 2025,
        paint: "Acrylic",
        canvas: "Wood Panel",
        finish: "Epoxy Coating",
        desc: "Mixed media art.",
        sold: true,
    });
    await painting64.save();

    let painting28 = new Painting({
        name: "Inspire",
        image: "Inspire.webp",
        dimensions: {
            length: 20,
            width: 20,
            depth: 0.875,
        },
        date: 2025,
        paint: "Acrylic",
        canvas: "Wood Panel",
        finish: "Epoxy Coating",
        desc: "Mixed media art.",
        price: 200,
    });

    await painting28.save();

    let painting60 = new Painting({
        name: "Journey Butterfly",
        image: "JourneyButterfly.webp",
        dimensions: {
            length: 48,
            width: 36,
            depth: 1.5,
        },
        date: 2026,
        paint: "Acrylic",
        canvas: "Wood Panel",
        finish: "Epoxy Coating",
        desc: "Mixed media art.",
        price: 1250,
    });

    await painting60.save();

    let painting15 = new Painting({
        name: "Liquid Dreamscapes",
        image: "LiquidDreamscapes.webp",
        sold: true,
    });

    await painting15.save();

    let painting16 = new Painting({
        name: "Liquid Horizons",
        image: "LiquidHorizons.webp",
        dimensions: {
            length: 48,
            width: 60,
            depth: 1,
        },
        date: 2025,
        paint: "Acrylic",
        canvas: "Canvas",
        finish: "Varnish",
        price: 995,
    });

    await painting16.save();

    let painting54 = new Painting({
        name: "Lines Ascending",
        image: "LinesAscending.webp",
        dimensions: {
            length: 24,
            width: 24,
            depth: 0.875,
        },
        date: 2025,
        paint: "Acrylic",
        canvas: "Wood Panel",
        finish: "Epoxy Coating",
        price: 475,
    });

    await painting54.save();

    let painting26 = new Painting({
        name: "Lines of Sight",
        image: "LinesOfSight.webp",
        dimensions: {
            length: 40,
            width: 16,
            depth: 0.5,
        },
        date: 2025,
        paint: "Acrylic",
        canvas: "Wood Panel",
        finish: "Epoxy Coating",
        desc: "Geometric design painting.",
        price: 250,
        sold: true,
    });

    await painting26.save();

    let painting47 = new Painting({
        name: "Love",
        image: "Love.webp",
        date: "2025",
        sold: true,
    });

    await painting47.save();

    let painting40 = new Painting({
        name: "Meeples",
        image: "Meeples.webp",
        dimensions: {
            length: 12,
            width: 12,
            depth: 1,
        },
        sold: true,
    });

    await painting40.save();

    let painting67 = new Painting({
        name: "Metomorphos",
        image: "Metomorphos.webp",
        dimensions: {
            length: 10,
            width: 10,
            depth: 1,
        },
        date: 2025,
        paint: "Acrylic",
        canvas: "Wood Panel",
        finish: "Epoxy Coating",
        desc: "Mixed media art.",
        sold: true,
    });
    await painting67.save();

    let painting37 = new Painting({
        name: "Mid Century Sputnik",
        image: "MidCenturySputnik.webp",
        dimensions: {
            length: 24,
            width: 24,
            depth: 0.875,
        },
        date: 2025,
        paint: "Acrylic",
        canvas: "Wood Panel",
        finish: "Epoxy Coating",
        price: 525,
    });

    await painting37.save();

    let painting43 = new Painting({
        name: "Mini Motion",
        image: "MiniMotion.webp",
        dimensions: {
            length: 11,
            width: 14,
            depth: 1.5,
        },
        canvas: "Canvas",
        sold: true,
    });

    await painting43.save();

    let painting24 = new Painting({
        name: "Monarchs Journey",
        image: "MonarchsJourney.webp",
        dimensions: {
            length: 24,
            width: 24,
            depth: 0.875,
        },
        date: 2026,
        paint: "Acrylic",
        canvas: "Wood Panel",
        finish: "Epoxy Coating",
        desc: "Mixed media art.",
        price: 275,
    });

    await painting24.save();

    let painting33 = new Painting({
        name: "Nights Burst",
        image: "NightsBurst.webp",
        date: 2025,
        sold: true,
    });

    await painting33.save();

    let painting44 = new Painting({
        name: "Ocean Clearing",
        image: "OceanClearing.webp",
        dimensions: {
            length: 11,
            width: 14,
            depth: 1.5,
        },
        canvas: "Wood Panel",
        sold: true,
        framed: true,
    });

    await painting44.save();

    let painting69 = new Painting({
        name: "Oceanic Depth",
        image: "OceanicDepth.webp",
        dimensions: {
            length: 10,
            width: 10,
            depth: 1.5,
        },
        date: 2026,
        paint: "Acrylic",
        canvas: "Wood Panel",
        finish: "Epoxy Coating",
        price: 175,
        mult: true,
        sold: true,
    });

    await painting69.save();

    let painting17 = new Painting({
        name: "Orbits in Motion",
        image: "OrbitsInMotion.webp",
        dimensions: {
            length: 8,
            width: 8,
            depth: 1,
        },
        canvas: "Wood Panel",
        sold: true,
        mult: true,
    });

    await painting17.save();

    let painting27 = new Painting({
        name: "Painted Ladies",
        image: "PaintedLadies.webp",
        dimensions: {
            length: 36,
            width: 36,
            depth: 1.5,
        },
        date: 2025,
        paint: "Acrylic",
        canvas: "Deep Wood Panel",
        finish: "Epoxy Coating",
        desc: "Mixed media art of butterflies on a journey.",
        price: 975,
    });

    await painting27.save();

    let painting46 = new Painting({
        name: "Perfectly Imperfect",
        image: "PerfectlyImperfect.webp",
        date: "2025",
        sold: true,
    });

    await painting46.save();

    let painting18 = new Painting({
        name: "Pinwheel",
        image: "Pinwheel.webp",
        dimensions: {
            length: 36,
            width: 48,
            depth: 1,
        },
        paint: "Acrylic",
        sold: true,
    });

    await painting18.save();

    let painting55 = new Painting({
        name: "Point of View",
        image: "PointOfView.webp",
        dimensions: {
            length: 20,
            width: 20,
            depth: 0.875,
        },
        date: 2025,
        paint: "Acrylic",
        canvas: "Wood Panel",
        finish: "Epoxy Coating",
        price: 250,
    });

    await painting55.save();

    let painting19 = new Painting({
        name: "Retro Vibe",
        image: "RetroVibe.webp",
        dimensions: {
            length: 36,
            width: 48,
            depth: 1,
        },
        paint: "Acrylic",
        canvas: "Wood Panel",
        finish: "Epoxy Coatings",
        sold: true,
    });

    await painting19.save();

    let painting59 = new Painting({
        name: "Scarlet Skimmer",
        image: "ScarletSkimmer.webp",
        dimensions: {
            length: 12,
            width: 12,
            depth: 0.875,
        },
        date: 2025,
        paint: "Acrylic",
        canvas: "Wood Panel",
        finish: "Epoxy Coating",
        desc: "Mixed media art of a scarlet dragonfly.",
        sold: true,
    });

    await painting59.save();

    let painting51 = new Painting({
        name: "Strength in Calm",
        image: "StrengthInCalm.webp",
        dimensions: {
            length: 24,
            width: 24,
            depth: 0.875,
        },
        date: 2025,
        paint: "Acrylic",
        canvas: "Wood Panel",
        finish: "Epoxy",
        desc: "Mixed media art.",
        price: 400,
    });

    await painting51.save();

    let painting42 = new Painting({
        name: "Setting Sun",
        image: "SettingSun.webp",
        dimensions: {
            length: 26,
            width: 32,
            depth: 1.5,
        },
        canvas: "Canvas",
        framed: true,
        sold: true,
    });

    await painting42.save();

    let painting63 = new Painting({
        name: "Sky Full of Stars",
        image: "SkyFullOfStars.webp",
        dimensions: {
            length: 36,
            width: 48,
            depth: 1.5,
        },
        date: 2026,
        paint: "Acrylic",
        canvas: "Wood Panel",
        finish: "Epoxy Coating",
        desc: "Mixed media art.",
        price: 1695,
    });
    await painting63.save();

    let painting20 = new Painting({
        name: "Spectrum of the Sea",
        image: "SpectrumOfTheSea.webp",
        dimensions: {
            length: 18,
            width: 24,
            depth: 1,
        },
        paint: "Acrylic",
        desc: "Floating Frame",
        framed: true,
        sold: true,
    });

    await painting20.save();

    let painting41 = new Painting({
        name: "Spiral",
        image: "Spiral.webp",
        dimensions: {
            length: 12,
            width: 6,
            depth: 1,
        },
        canvas: "Canvas",
        mult: true,
        sold: true,
    });

    await painting41.save();

    let painting25 = new Painting({
        name: "Starburst Sphere (Blue)",
        image: "StarburstSphereBlue.webp",
        dimensions: {
            length: 16,
            width: 16,
            depth: 0.875,
        },
        date: 2025,
        paint: "Acrylic",
        canvas: "Wood Panel",
        finish: "Epoxy Coating",
        price: 175,
        sold: true,
    });

    await painting25.save();

    let painting31 = new Painting({
        name: "Starburst Sphere (Green)",
        image: "StarburstSphereGreen.webp",
        dimensions: {
            length: 16,
            width: 16,
            depth: 0.875,
        },
        date: 2025,
        paint: "Acrylic",
        canvas: "Wood Panel",
        finish: "Epoxy Coating",
        price: 175,
    });

    await painting31.save();

    let painting21 = new Painting({
        name: "Strokes of Light",
        image: "StrokesOfLight.webp",
        dimensions: {
            length: 18,
            width: 24,
            depth: 1,
        },
        paint: "Oil",
        framed: true,
        sold: true,
    });

    await painting21.save();

    let painting22 = new Painting({
        name: "Sun's Awakening",
        image: "SunsAwakening.webp",
        dimensions: {
            length: 18,
            width: 24,
            depth: 1,
        },
        paint: "Acrylic",
        canvas: "Wood Panel",
        finish: "Epoxy Coating",
        price: 250,
        framed: true,
    });

    await painting22.save();

    let painting32 = new Painting({
        name: "Swallowtail in flight",
        image: "SwallowtailInflight.webp",
        dimensions: {
            length: 24,
            width: 24,
            depth: 0.875,
        },
        date: 2025,
        paint: "Acrylic",
        canvas: "Wood Panel",
        finish: "Epoxy Coating",
        desc: "Mixed media art of a yellow swallowtail butterfly.",
        price: 275,
        sold: true,
    });

    await painting32.save();

    let painting34 = new Painting({
        name: "The Longest Journey",
        image: "TheLongestJourney.webp",
        dimensions: {
            length: 39.06,
            width: 31.5,
            depth: 1.375,
        },
        date: 2025,
        paint: "Acrylic",
        canvas: "Canvas",
        finish: "Decorative High Gloss Coating",
        desc: "Mixed media art of birds migrating.",
        price: 450,
        sold: true,
    });
    await painting34.save();

    let painting36 = new Painting({
        name: "Tigers Forever",
        image: "TigersForever.webp",
        dimensions: {
            length: 39.06,
            width: 31.5,
            depth: 1.375,
        },
        date: 2025,
        paint: "Acrylic",
        canvas: "Canvas",
        finish: "Decorative High Gloss Coating",
        desc: "Mixed media art of a stoic tiger with emerald eyes.",
        price: 450,
    });
    await painting36.save();

    let painting23 = new Painting({
        name: "Transformation",
        image: "Transformation.webp",
        dimensions: {
            length: 49,
            width: 25,
            depth: 1.75,
        },
        date: 2025,
        paint: "Oil",
        canvas: "Canvas",
        finish: "Varnish",
        price: 275,
        framed: true,
    });

    await painting23.save();

    let painting50 = new Painting({
        name: "Twilights Glow",
        image: "TwilightsGlow.webp",
        dimensions: {
            length: 18,
            width: 24,
            depth: 1.5,
        },
        date: 2025,
        paint: "Acrylic",
        canvas: "Wood Panel",
        finish: "Epoxy Coating",
        price: 395,
        framed: true,
    });

    await painting50.save();

    let painting53 = new Painting({
        name: "Vertical Hues",
        image: "VerticalHues.webp",
        dimensions: {
            length: 20,
            width: 20,
            depth: 0.875,
        },
        date: 2025,
        paint: "Acrylic",
        canvas: "Wood Panel",
        finish: "Epoxy Coating",
        price: 350,
    });

    let painting70 = new Painting({
        name: "Wings of Hope",
        image: "WingsOfHope.webp",
        dimensions: {
            length: 20,
            width: 16,
            depth: 1.5,
        },
        date: 2025,
        paint: "Acrylic",
        canvas: "Wood Panel",
        finish: "Epoxy Coating",
        price: 350,
        desc: "Mixed media art.",
        framed: true,
        sold: true,
    });

    await painting70.save();
}
