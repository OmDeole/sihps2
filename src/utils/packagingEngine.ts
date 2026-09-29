import { PackagingParameters, PackagingSpecification, FilmLayer } from '../types/packaging';

export function calculatePackagingSpecification(params: PackagingParameters): PackagingSpecification {
  const isProduce = params.category === 'fresh_produce';
  const isHighFat = params.fatContent > 15;
  const isDryCrisp = params.moistureContent < 10 && params.waterActivity < 0.45;
  const isAcidic = params.pH < 4.5;
  const isChilled = params.storageType === 'chilled';
  const isFrozen = params.storageType === 'frozen';
  const isHighRiskTransit = params.transportationRisk === 'high_vibration' || params.transportationRisk === 'cold_chain_intermittent';

  // 1. Determine OTR (cc / m2 * 24h * 1 atm)
  let otrTarget = 50;
  let otrMin = 20;
  let otrMax = 100;
  let otrRationale = 'Standard polyolefin gas barrier providing moderate shelf-life stability.';

  if (isProduce) {
    if (params.respirationRateClass === 'extremely_high' || params.respirationRateValue > 100) {
      otrTarget = 18500;
      otrMin = 14000;
      otrMax = 25000;
      otrRationale = 'Extremely high respiration rate necessitates micro-perforated breathable film to prevent anaerobic alcohol fermentation and spoilage.';
    } else if (params.respirationRateClass === 'high' || params.respirationRateValue > 50) {
      otrTarget = 8500;
      otrMin = 6000;
      otrMax = 12000;
      otrRationale = 'High respiration requires laser-permeable film balancing aerobic oxygen demand with internal CO2 elevation (3-5% O2, 5-8% CO2).';
    } else {
      otrTarget = 3500;
      otrMin = 2000;
      otrMax = 5000;
      otrRationale = 'Moderate produce respiration requires breathable polyolefin allowing controlled oxygen transmission to prevent physiological decay.';
    }
  } else if (isHighFat && isDryCrisp) {
    // e.g. Potato chips, roasted nuts, coffee
    otrTarget = 1.5;
    otrMin = 0.5;
    otrMax = 2.5;
    otrRationale = 'High unsaturated fat content and crisp matrix require an ultra-high oxygen barrier (Met-PET or EVOH) to halt lipid auto-oxidation (rancidity).';
  } else if (params.category === 'meat_poultry_seafood') {
    if (params.customName.toLowerCase().includes('beef') || params.customName.toLowerCase().includes('red meat')) {
      otrTarget = 8.0;
      otrMin = 2.0;
      otrMax = 15.0;
      otrRationale = 'High-barrier thermoforming tray + EVOH lidding preserves 70-80% O2 flush to maintain bright cherry-red oxymyoglobin meat bloom.';
    } else {
      otrTarget = 5.0;
      otrMin = 1.0;
      otrMax = 12.0;
      otrRationale = 'Low OTR barrier prevents oxidation of sensitive muscle lipids and maintains protective CO2/N2 gas blend.';
    }
  } else if (isHighFat) {
    otrTarget = 2.0;
    otrMin = 0.8;
    otrMax = 4.0;
    otrRationale = 'Fatty matrix requires EVOH barrier layer to inhibit photo-oxidation and hexanal off-odor formation.';
  } else if (params.desiredShelfLifeDays > 180) {
    otrTarget = 1.0;
    otrMin = 0.1;
    otrMax = 2.0;
    otrRationale = 'Long extended ambient shelf life (>6 months) requires high-barrier metallized or EVOH substrate.';
  }

  // 2. Determine WVTR (g / m2 * 24h at 38°C, 90% RH)
  let wvtrTarget = 5.0;
  let wvtrMin = 2.0;
  let wvtrMax = 8.0;
  let wvtrRationale = 'Balanced moisture barrier suitable for ambient humidity fluctuations.';

  if (isDryCrisp) {
    wvtrTarget = 0.8;
    wvtrMin = 0.2;
    wvtrMax = 1.2;
    wvtrRationale = 'Critical low water activity food; moisture ingress above aw 0.40 triggers irreversible loss of crispness and texture collapse.';
  } else if (isProduce) {
    wvtrTarget = 65.0;
    wvtrMin = 40.0;
    wvtrMax = 95.0;
    wvtrRationale = 'Controlled moisture vapor transmission combined with antifog additives to prevent inner condensation droplets that encourage fungal growth.';
  } else if (isChilled && params.moistureContent > 60) {
    wvtrTarget = 3.5;
    wvtrMin = 1.5;
    wvtrMax = 5.0;
    wvtrRationale = 'High water activity product requires moisture retention to prevent weight loss, surface drying, and edge crusting.';
  } else if (isFrozen) {
    wvtrTarget = 1.2;
    wvtrMin = 0.5;
    wvtrMax = 2.0;
    wvtrRationale = 'Cryogenic moisture barrier prevents freezer burn, moisture sublimation, and ice recrystallization damage.';
  }

  // 3. Permselectivity & CO2TR
  const permselectivity = isProduce ? 3.8 : 4.2;
  const co2trTarget = Math.round(otrTarget * permselectivity);

  // 4. Physical & Mechanical Thickness
  let totalThickness = 65;
  let punctureResistance = 32;
  let tensileStrength = 85;
  let dartDrop = 280;

  if (isHighRiskTransit) {
    totalThickness += 15;
    punctureResistance += 18;
    tensileStrength += 25;
    dartDrop += 90;
  }
  if (params.packagingFormat === 'vacuum_pack' || params.packagingFormat === 'tray_lidding') {
    totalThickness = Math.max(totalThickness, 80);
    punctureResistance = Math.max(punctureResistance, 45);
  } else if (params.packagingFormat === 'flow_wrap') {
    totalThickness = isProduce ? 35 : 45;
  }

  // 5. Primary Material Recommendation & Layer Structure
  let materialName = 'Recyclable Mono-Material All-PE High Barrier Pouch';
  let materialCode = 'MDO-PE/PE-EVOH';
  let tradeNameExample = 'CircuFlex™ MonoBarrier PE';
  let structureDesc = 'MDO-PE (25 µm) / Tie Layer (3 µm) / EVOH (<5% w/w) / LLDPE Sealant (45 µm)';
  let opticalClarity: PackagingSpecification['physicalSpecs']['opticalClarity'] = 'High Gloss Transparent';
  let layers: FilmLayer[] = [];

  if (isProduce) {
    materialName = 'Laser Micro-Perforated Antifog BOPP / Recyclable PE';
    materialCode = 'BOPP-PERF-AF';
    tradeNameExample = 'FreshBreathe™ Micro-Vent 30';
    structureDesc = 'Antifog BOPP (25 µm) with precision laser micro-perforations (100 µm dia)';
    opticalClarity = 'High Gloss Transparent';
    totalThickness = 32;
    layers = [
      { layerOrder: 1, material: 'Antifog Surface Treated BOPP', thicknessMicron: 25, purpose: 'Anti-condensation clarity & dimensional stability', bioBasedOrRecyclable: true },
      { layerOrder: 2, material: 'Laser Micro-Perforation Array', thicknessMicron: 7, purpose: 'Calculated O2/CO2 gas respiration balancing', bioBasedOrRecyclable: true }
    ];
  } else if (isHighFat && isDryCrisp) {
    materialName = 'Mono-Material Recyclable Met-BOPP / Cast PP Barrier Laminate';
    materialCode = 'MET-BOPP/CPP';
    tradeNameExample = 'CircuCrisp™ Met-Shield';
    structureDesc = 'BOPP Print Web (20 µm) / Met-BOPP High Barrier (18 µm) / Cast PP Sealant (35 µm)';
    opticalClarity = 'Metalized Mirror';
    totalThickness = 73;
    layers = [
      { layerOrder: 1, material: 'High-Clarity Reverse-Printed BOPP', thicknessMicron: 20, purpose: 'Scuff resistance, print fidelity & rigidity', bioBasedOrRecyclable: true },
      { layerOrder: 2, material: 'Vacuum Metallized BOPP Barrier Layer', thicknessMicron: 18, purpose: 'Complete light barrier and ultra-low OTR/WVTR', bioBasedOrRecyclable: true },
      { layerOrder: 3, material: 'Low-SIT Cast Polypropylene (CPP)', thicknessMicron: 35, purpose: 'Hermetic heat seal and lipid resistance', bioBasedOrRecyclable: true }
    ];
  } else if (params.category === 'meat_poultry_seafood') {
    materialName = 'Recyclable High-Barrier Mono-PE Thermoformed Skin & Lidding';
    materialCode = 'PE/EVOH/PE-SKIN';
    tradeNameExample = 'AeroMeat™ Recyclable Barrier';
    structureDesc = 'Coextruded 7-Layer PE/EVOH/PE with metallocene seal layer';
    opticalClarity = 'High Gloss Transparent';
    totalThickness = 90;
    layers = [
      { layerOrder: 1, material: 'Oriented PE Outer Layer', thicknessMicron: 25, purpose: 'Mechanical toughness and thermal stability', bioBasedOrRecyclable: true },
      { layerOrder: 2, material: 'EVOH Gas Barrier Core (<5%)', thicknessMicron: 6, purpose: 'OTR < 2.0 to maintain MAP gas composition', bioBasedOrRecyclable: true },
      { layerOrder: 3, material: 'Metallocene LLDPE Sealant', thicknessMicron: 59, purpose: 'Hermetic seal through fat & moisture contamination', bioBasedOrRecyclable: true }
    ];
  } else {
    // Default high-performance circular mono-PE
    layers = [
      { layerOrder: 1, material: 'Machine-Direction Oriented PE (MDO-PE)', thicknessMicron: 25, purpose: 'High stiffness, heat resistance & print surface', bioBasedOrRecyclable: true },
      { layerOrder: 2, material: 'EVOH Ultra-Thin Barrier Layer (<4.8%)', thicknessMicron: 4, purpose: 'Gas barrier meeting CEFLEX recyclability guidelines', bioBasedOrRecyclable: true },
      { layerOrder: 3, material: 'Tough Plastomer LLDPE Sealant', thicknessMicron: 40, purpose: 'Broad seal window and hot-tack strength', bioBasedOrRecyclable: true }
    ];
  }

  // 6. MAP (Modified Atmosphere Packaging) calculation
  let mapApplicable = false;
  let initialO2 = 0;
  let initialCO2 = 0;
  let initialN2 = 100;
  let equilibriumTarget = 'Atmospheric ambient';
  let gasVolumeRatio = '1.0 : 1';
  let perforationReq = false;
  let microPerforationDetail: PackagingSpecification['mapRequirements']['microPerforationDetail'] = undefined;
  let mapRationale = 'Standard ambient gas equilibrium; inert nitrogen flush optional for lipid protection.';

  if (isProduce) {
    mapApplicable = true;
    initialO2 = 3;
    initialCO2 = 6;
    initialN2 = 91;
    equilibriumTarget = '2 - 5% O2, 4 - 8% CO2 at steady state';
    gasVolumeRatio = '1.5 : 1';
    perforationReq = params.respirationRateClass === 'high' || params.respirationRateClass === 'extremely_high';
    mapRationale = 'Controlled initial low O2 flush retards respiration kinetics, while 5-8% CO2 suppresses fungal and bacterial decay without inducing anaerobic injury.';
    if (perforationReq) {
      const holes = Math.round(params.respirationRateValue * 2.8);
      microPerforationDetail = {
        holeCountPerM2: Math.max(holes, 40),
        holeDiameterMicron: 95,
        targetOxygenUptakeBalance: `Balances ${params.respirationRateValue} mg CO2/kg*h uptake with OTR flux`
      };
    }
  } else if (params.category === 'meat_poultry_seafood') {
    mapApplicable = true;
    if (params.customName.toLowerCase().includes('beef') || params.customName.toLowerCase().includes('red meat')) {
      initialO2 = 75;
      initialCO2 = 25;
      initialN2 = 0;
      equilibriumTarget = '>65% O2 maintained through shelf life';
      gasVolumeRatio = '2.0 : 1 (Gas to meat volume)';
      mapRationale = '75% O2 binds to deoxymyoglobin forming bright cherry-red oxymyoglobin; 25% CO2 inhibits aerobic psychrotrophic bacteria (Pseudomonas).';
    } else {
      initialO2 = 0;
      initialCO2 = 35;
      initialN2 = 65;
      equilibriumTarget = '<0.5% residual O2, >30% CO2';
      gasVolumeRatio = '2.0 : 1';
      mapRationale = 'Zero O2 avoids rancidity of unsaturated lipids; 35% CO2 lowers cellular intracellular pH of bacteria to extend freshness.';
    }
  } else if (isHighFat || params.category === 'bakery_confectionery') {
    mapApplicable = true;
    initialO2 = 0.2;
    initialCO2 = 30;
    initialN2 = 69.8;
    equilibriumTarget = '<0.5% residual O2';
    gasVolumeRatio = '1.2 : 1';
    mapRationale = 'Nitrogen displacement of oxygen eliminates mold spore germination and prevents butterfat oxidation.';
  }

  // 7. Circular Economy & Sustainability Score
  const circularityScore = isProduce ? 88 : isHighFat && isDryCrisp ? 91 : 94;
  const recyclabilityStream = isProduce
    ? 'PE/PP Rigid & Flexible Mixed Stream (CEFLEX compliant)'
    : 'CEFLEX Class A Polyolefin Stream (95%+ Mono-Polymer)';
  const recyclabilityClass: 'Class A' | 'Class B' | 'Class C' = 'Class A';
  const baselineCarbon = 4.8; // kg CO2e / 1000 packs for standard multi-material non-recyclable laminates
  const currentCarbon = isProduce ? 1.8 : 2.2;
  const carbonReduction = Math.round(((baselineCarbon - currentCarbon) / baselineCarbon) * 100);

  // 8. Circular Alternative Swap (e.g. Bio-compostable NatureFlex or Molded Fiber)
  const circularAlternative: PackagingSpecification['circularAlternative'] = isProduce
    ? {
        materialName: 'Home-Compostable Cellulose NatureFlex™ + PLA Film',
        structureDescription: 'Bio-based regenerated wood cellulose (20 µm) with certified compostable heat seal coating (EN 13432 & TÜV Home Compostable)',
        circularityScore: 97,
        carbonFootprintKgCO2ePer1000Packs: 1.4,
        shelfLifeImpactDays: -1, // slight reduction in high humidity
        tradeOffNotes: '100% bio-derived and home compostable within 12 weeks; slightly higher raw resin cost (+18%).'
      }
    : {
        materialName: 'Compostable Bio-PBS / Cellulose High-Barrier Pouch',
        structureDescription: 'FSC-certified paper exterior (45 gsm) / Bio-PBS Sealant / Vacuum Bio-Barrier Layer',
        circularityScore: 95,
        carbonFootprintKgCO2ePer1000Packs: 1.6,
        shelfLifeImpactDays: 0,
        tradeOffNotes: 'Plastic-free consumer perception with certified industrial compostability; requires controlled heat-seal dwell time.'
      };

  // 9. Shelf Life Degradation Kinetic Curve
  const unprotectedDays = Math.max(1, Math.round(params.desiredShelfLifeDays * 0.18));
  const conventionalPackDays = Math.round(params.desiredShelfLifeDays * 0.65);
  const circuPackDays = params.desiredShelfLifeDays;
  const mapDays = Math.round(params.desiredShelfLifeDays * 1.35);

  const curvePoints = [];
  const maxDay = mapDays;
  const step = Math.max(1, Math.ceil(maxDay / 7));

  for (let d = 0; d <= maxDay; d += step) {
    // Unprotected decay
    const unprot = Math.max(0, Math.round(100 * Math.exp(- Math.pow(d / (unprotectedDays * 0.7), 1.8))));
    // Conventional pack decay
    const conv = Math.max(0, Math.round(100 * Math.exp(- Math.pow(d / (conventionalPackDays * 0.9), 2.2))));
    // CircuPack optimized decay
    const circu = Math.max(0, Math.round(100 * Math.exp(- Math.pow(d / (circuPackDays * 1.05), 2.8))));

    curvePoints.push({
      day: d,
      unprotectedQuality: unprot,
      conventionalQuality: conv,
      circuPackQuality: circu
    });
  }

  // 10. Cost Optimization & ROI Analysis
  const costPer1000 = Math.round(totalThickness * 0.42 + (mapApplicable ? 6.5 : 2.0));
  const baselineCost = Math.round(costPer1000 * 1.18); // Conventional multi-layer is often heavier and has landfill tax
  const packKg = (params.packWeightGram || 250) / 1000;
  const foodValuePer1000Packs = 1000 * packKg * 8.5; // average $8.50/kg food value
  const spoilageReductionPercent = isProduce ? 0.22 : 0.14; // save 14-22% spoilage
  const spoilageSaved = Math.round(foodValuePer1000Packs * spoilageReductionPercent);
  const roiMultiplier = Math.round((spoilageSaved / costPer1000) * 10) / 10;

  // 11. Traceability & Digital Product Passport (DPP)
  const dppBatchId = `CP-${params.category.substring(0, 3).toUpperCase()}-${Date.now().toString(36).toUpperCase()}`;
  const qrPayload = JSON.stringify({
    dppId: dppBatchId,
    commodity: params.customName,
    material: materialCode,
    totalGaugeMicrons: totalThickness,
    otrTarget,
    wvtrTarget,
    circularityScore,
    recyclabilityStream,
    compliance: ['EU 10/2011', 'FDA 21 CFR 177.1520', 'CEFLEX Design For Circularity'],
    carbonKgCO2e: currentCarbon,
    recommendedTempC: params.storageTempC,
    mapFlush: mapApplicable ? `${initialO2}% O2 / ${initialCO2}% CO2 / ${initialN2}% N2` : 'None'
  });

  return {
    id: `SPEC-${Date.now()}`,
    timestamp: new Date().toISOString(),
    foodName: params.customName,
    category: params.category,
    primaryRecommendation: {
      materialName,
      materialCode,
      tradeNameExample,
      structureDescription: structureDesc,
      totalThicknessMicron: totalThickness,
      layerBreakdown: layers,
      keyAdvantages: [
        '100% compliant with mono-material mechanical recycling infrastructure (Class A)',
        `Optimized OTR (${otrTarget} cc) engineered for ${params.customName} specific degradation pathway`,
        `Low WVTR (${wvtrTarget} g) protects product from humidity shifts and moisture weight loss`,
        'Eliminates unrecyclable multi-material aluminum foil/PVDC laminate layers'
      ],
      potentialLimitations: [
        'Requires calibrated temperature control during heat sealing (narrower window than foil)',
        'Storage in dry indoor warehousing recommended prior to packaging conversion'
      ]
    },
    barrierSpecs: {
      otr: {
        target: otrTarget,
        min: otrMin,
        max: otrMax,
        unit: 'cc / (m² · 24h · 1 atm)',
        testStandard: 'ASTM D3985 / ISO 15105-2 at 23°C, 0% RH',
        rationale: otrRationale
      },
      wvtr: {
        target: wvtrTarget,
        min: wvtrMin,
        max: wvtrMax,
        unit: 'g / (m² · 24h)',
        testStandard: 'ASTM F1249 / ISO 15106-3 at 38°C, 90% RH',
        rationale: wvtrRationale
      },
      co2tr: {
        target: co2trTarget,
        permselectivityBeta: permselectivity,
        rationale: `CO2TR calculated using calibrated polymer permselectivity ratio (β ≈ ${permselectivity}) to ensure proper internal equilibrium.`
      }
    },
    physicalSpecs: {
      filmThicknessTotalMicron: totalThickness,
      sealTemperatureRange: isProduce ? '105 - 125 °C' : '115 - 135 °C',
      hotTackStrength: isProduce ? 'Moderate (>2.5 N/15mm)' : 'High (>4.0 N/15mm)',
      sealIntegrityContamination: isHighFat ? 'Superior' : 'Good',
      tensileStrengthMpa: tensileStrength,
      punctureResistanceN: punctureResistance,
      dartDropG: dartDrop,
      opticalClarity
    },
    mapRequirements: {
      applicable: mapApplicable,
      initialGasComposition: {
        o2Percent: initialO2,
        co2Percent: initialCO2,
        n2Percent: initialN2
      },
      equilibriumGasTarget: equilibriumTarget,
      gasToProductVolumeRatio: gasVolumeRatio,
      perforationRequired: perforationReq,
      microPerforationDetail,
      preservativeGasRationale: mapRationale
    },
    circularity: {
      circularityScore,
      recyclabilityStream,
      recyclabilityClass,
      monoMaterialCompliance: true,
      pcrContentViablePercent: 30,
      carbonFootprintKgCO2ePer1000Packs: currentCarbon,
      baselineCarbonFootprintKgCO2e: baselineCarbon,
      carbonReductionPercent: carbonReduction,
      endOfLifePathway: isProduce
        ? 'Standard curbside flexible film recycling bin (or certified industrial composting)'
        : 'Mono-polyolefin mechanical recycling into high-grade post-consumer pellets',
      circularityBadges: [
        'CEFLEX Recyclable',
        'Mono-Polymer Design',
        'FSSAI / FDA Compliant',
        `-${carbonReduction}% CO₂e Saved`
      ]
    },
    circularAlternative,
    shelfLifePrediction: {
      unprotectedDays,
      conventionalPackDays,
      circuPackOptimizedDays: circuPackDays,
      mapOptimizedDays: mapDays,
      primaryLimitingFactor: isProduce
        ? 'Respiration kinetics, fungal rot (Botrytis), moisture transpiration'
        : isHighFat
        ? 'Lipid oxidation & free-radical aldehyde rancidity'
        : isDryCrisp
        ? 'Moisture absorption & critical water activity crispness loss'
        : 'Microbial bacterial proliferation & enzymatic degradation',
      spoilageMechanism: isProduce
        ? 'Enzymatic tissue softening and respiration sugar depletion'
        : isHighFat
        ? 'Autoxidation of unsaturated triglycerides'
        : 'Hydrolytic softening and staling',
      curvePoints
    },
    economicAnalysis: {
      estimatedMaterialCostPer1000PacksUSD: costPer1000,
      baselinePackagingCostUSD: baselineCost,
      projectedFoodSpoilageLossSavedUSD: spoilageSaved,
      roiMultiplier,
      paybackPeriodBatches: 1
    },
    traceabilityPassport: {
      dppBatchId,
      qrCodeData: qrPayload,
      standardsComplied: [
        'EU Regulation 10/2011 (Plastic Food Contact)',
        'US FDA 21 CFR 177.1520 (Polyolefin Polymers)',
        'ISO 22000 (Food Safety Management)',
        'CEFLEX Designing for a Circular Economy'
      ],
      recyclingInstructions: 'Empty contents completely. Dispose in soft plastic recycling stream #4 (LDPE) or local recycling depot.',
      foodContactCertification: 'Virgin Food-Grade Polymer with certified non-intentionally added substances (NIAS) migration screening.'
    }
  };
}
