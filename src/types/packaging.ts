export type FoodCategory =
  | 'fresh_produce'
  | 'bakery_confectionery'
  | 'dairy_beverages'
  | 'meat_poultry_seafood'
  | 'dry_foods_cereals'
  | 'sauces_liquids';

export type StorageType = 'ambient' | 'chilled' | 'frozen';

export type RespirationRateClass = 'very_low' | 'low' | 'moderate' | 'high' | 'extremely_high' | 'not_applicable';

export type TransportationRisk =
  | 'standard'
  | 'high_vibration'
  | 'marine_humidity'
  | 'cold_chain_intermittent';

export type PackagingFormat =
  | 'standup_pouch'
  | 'flat_pouch'
  | 'tray_lidding'
  | 'flow_wrap'
  | 'vacuum_pack'
  | 'rigid_container';

export interface FoodCommodity {
  id: string;
  name: string;
  category: FoodCategory;
  standardMoisture: number; // % w/w
  waterActivity: number; // aw (0.0 to 1.0)
  fatContent: number; // % w/w
  pH: number;
  respirationRateClass: RespirationRateClass;
  respirationRateValue: number; // mg CO2 / kg*h at typical temp
  sensitivityToMoisture: 'Critical' | 'High' | 'Moderate' | 'Low';
  sensitivityToO2: 'Critical' | 'High' | 'Moderate' | 'Low';
  sensitivityToLight: 'Critical' | 'High' | 'Moderate' | 'Low';
  typicalTempC: number;
  recommendedStorageType: StorageType;
  targetShelfLifeDays: number;
  vulnerabilitySummary: string;
}

export interface PackagingParameters {
  commodityId: string;
  customName: string;
  category: FoodCategory;
  moistureContent: number; // %
  waterActivity: number; // aw
  fatContent: number; // %
  pH: number;
  respirationRateClass: RespirationRateClass;
  respirationRateValue: number; // mg CO2 / kg*h
  desiredShelfLifeDays: number;
  storageTempC: number;
  storageType: StorageType;
  relativeHumidity: number; // %
  transportationRisk: TransportationRisk;
  packagingFormat: PackagingFormat;
  packWeightGram: number;
}

export interface OnboardingProfile {
  completed: boolean;
  businessType: string;
  industrySector: string;
  companyAge: string;
  annualRevenue: string;
  productionScale: string;
  primaryChallenge: string;
  distributionLogistics: string;
  packagingMachinery: string;
  circularityGoal: string;
  regulatoryRegion: string;
}

export interface FilmLayer {
  layerOrder: number;
  material: string;
  thicknessMicron: number;
  purpose: string;
  bioBasedOrRecyclable: boolean;
}

export interface PackagingSpecification {
  id: string;
  timestamp: string;
  foodName: string;
  category: FoodCategory;
  
  // Primary Material Recommendation
  primaryRecommendation: {
    materialName: string;
    materialCode: string;
    tradeNameExample: string;
    structureDescription: string;
    totalThicknessMicron: number;
    layerBreakdown: FilmLayer[];
    keyAdvantages: string[];
    potentialLimitations: string[];
  };

  // Barrier & Permeability Specifications
  barrierSpecs: {
    otr: {
      target: number; // cc / (m2 * 24h * 1 atm)
      min: number;
      max: number;
      unit: string;
      testStandard: string;
      rationale: string;
    };
    wvtr: {
      target: number; // g / (m2 * 24h)
      min: number;
      max: number;
      unit: string;
      testStandard: string;
      rationale: string;
    };
    co2tr: {
      target: number; // cc / (m2 * 24h * 1 atm)
      permselectivityBeta: number; // CO2TR / OTR ratio
      rationale: string;
    };
  };

  // Physical & Mechanical Specifications
  physicalSpecs: {
    filmThicknessTotalMicron: number;
    sealTemperatureRange: string; // e.g. "115 - 135 °C"
    hotTackStrength: string; // e.g. "High (>3.5 N/15mm)"
    sealIntegrityContamination: 'Superior' | 'Good' | 'Fair';
    tensileStrengthMpa: number;
    punctureResistanceN: number;
    dartDropG: number;
    opticalClarity: 'High Gloss Transparent' | 'Matte Translucent' | 'Opaque Light Barrier' | 'Metalized Mirror';
  };

  // MAP (Modified Atmosphere Packaging) Requirements
  mapRequirements: {
    applicable: boolean;
    initialGasComposition: {
      o2Percent: number;
      co2Percent: number;
      n2Percent: number;
    };
    equilibriumGasTarget: string;
    gasToProductVolumeRatio: string;
    perforationRequired: boolean;
    microPerforationDetail?: {
      holeCountPerM2: number;
      holeDiameterMicron: number;
      targetOxygenUptakeBalance: string;
    };
    preservativeGasRationale: string;
  };

  // Circular Economy & Sustainability
  circularity: {
    circularityScore: number; // 0 - 100
    recyclabilityStream: string; // e.g. "CEFLEX Monomaterial Polyolefin Stream", "Industrial Compost EN13432"
    recyclabilityClass: 'Class A' | 'Class B' | 'Class C';
    monoMaterialCompliance: boolean;
    pcrContentViablePercent: number;
    carbonFootprintKgCO2ePer1000Packs: number;
    baselineCarbonFootprintKgCO2e: number;
    carbonReductionPercent: number;
    endOfLifePathway: string;
    circularityBadges: string[];
  };

  // Sustainable Alternative Swap
  circularAlternative: {
    materialName: string;
    structureDescription: string;
    circularityScore: number;
    carbonFootprintKgCO2ePer1000Packs: number;
    shelfLifeImpactDays: number; // e.g. -5 days or 0
    tradeOffNotes: string;
  };

  // Shelf-Life Degradation Projection
  shelfLifePrediction: {
    unprotectedDays: number;
    conventionalPackDays: number;
    circuPackOptimizedDays: number;
    mapOptimizedDays: number;
    primaryLimitingFactor: string;
    spoilageMechanism: string;
    curvePoints: {
      day: number;
      unprotectedQuality: number; // 0 - 100
      conventionalQuality: number;
      circuPackQuality: number;
    }[];
  };

  // Cost & Spoilage Optimization
  economicAnalysis: {
    estimatedMaterialCostPer1000PacksUSD: number;
    baselinePackagingCostUSD: number;
    projectedFoodSpoilageLossSavedUSD: number;
    roiMultiplier: number;
    paybackPeriodBatches: number;
  };

  // Digital Product Passport & Traceability
  traceabilityPassport: {
    dppBatchId: string;
    qrCodeData: string;
    standardsComplied: string[];
    recyclingInstructions: string;
    foodContactCertification: string;
  };
}

export interface PackagingMaterialDBItem {
  id: string;
  name: string;
  code: string;
  category: 'Polyolefin' | 'Polyester' | 'Bio-polymer' | 'Laminate Foil' | 'Cellulose / Paper' | 'Polyamide';
  densityGcm3: number;
  otrAt23C: number; // cc / (m2 * 24h * 1 atm) at 25 um
  wvtrAt38C: number; // g / (m2 * 24h) at 25 um
  tensileStrengthMpa: number;
  punctureResistanceN: number;
  heatSealTempRangeC: string;
  recyclabilityTier: 'Circular / Widely Recyclable' | 'Compostable' | 'Specialist Stream' | 'Non-Recyclable Multilayer';
  circularityScore: number;
  typicalUses: string;
  bioBased: boolean;
}
