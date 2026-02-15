import beerStage1 from '../assets/images/beer_stage_1.png';
import beerStage2 from '../assets/images/beer_stage_2.png';
import beerStage3 from '../assets/images/beer_stage_3.png';
import beerStage4 from '../assets/images/beer_stage_4.png';
import beerStage5 from '../assets/images/beer_stage_5.png';

// Beer evolution stages — image + threshold + display size
export const BEER_STAGES = [
    { threshold: 0, image: beerStage1, size: 150, label: 'Pinte basique' },
    { threshold: 100, image: beerStage2, size: 180, label: 'Ambrée artisanale' },
    { threshold: 1000, image: beerStage3, size: 220, label: 'IPA premium' },
    { threshold: 10000, image: beerStage4, size: 260, label: 'Lager dorée XL' },
    { threshold: 100000, image: beerStage5, size: 300, label: 'Bière légendaire' },
];

// Upgrades — auto-production boosters (beer-themed)
export const INITIAL_UPGRADES = [
    {
        id: 'curseur',
        name: 'Tire-bouchon',
        description: 'Un tire-bouchon automatique qui ouvre les bouteilles.',
        icon: '🍾',
        baseCost: 15,
        bonus: 0.1,
        count: 0,
    },
    {
        id: 'grandmere',
        name: 'Grand-mère brasseuse',
        description: 'Mamie brasse de la bière maison dans sa cave.',
        icon: '👵',
        baseCost: 100,
        bonus: 1,
        count: 0,
    },
    {
        id: 'ferme',
        name: 'Champ de houblon',
        description: 'Un champ de houblon bio pour la production artisanale.',
        icon: '🌾',
        baseCost: 1100,
        bonus: 8,
        count: 0,
    },
    {
        id: 'brasserie',
        name: 'Micro-brasserie',
        description: 'Une micro-brasserie qui produit des fûts en continu.',
        icon: '🍺',
        baseCost: 12000,
        bonus: 47,
        count: 0,
    },
    {
        id: 'usine',
        name: 'Méga-brasserie',
        description: 'Une méga-brasserie industrielle avec cuves géantes.',
        icon: '🏭',
        baseCost: 130000,
        bonus: 260,
        count: 0,
    },
    {
        id: 'banque',
        name: 'Pub franchisé',
        description: 'Une chaîne de pubs qui vend vos bières dans le monde entier.',
        icon: '🍻',
        baseCost: 1400000,
        bonus: 1400,
        count: 0,
    },
    {
        id: 'temple',
        name: 'Abbaye brassicole',
        description: 'Des moines trappistes brassent la bière sacrée.',
        icon: '⛪',
        baseCost: 20000000,
        bonus: 7800,
        count: 0,
    },
    {
        id: 'portail',
        name: 'Portail de bière cosmique',
        description: 'Un portail dimensionnel qui importe de la bière extraterrestre.',
        icon: '🌀',
        baseCost: 330000000,
        bonus: 44000,
        count: 0,
    },
];

// Click multiplier upgrades (beer-themed)
export const INITIAL_MULTIPLIERS = [
    {
        id: 'multi_1',
        name: 'Double pression',
        description: '+1 bière par clic',
        icon: '🍺',
        baseCost: 100,
        bonus: 1,
        count: 0,
    },
    {
        id: 'multi_2',
        name: 'Jitter Click',
        description: '+5 bières par clic',
        icon: '🖱️',
        baseCost: 500,
        bonus: 5,
        count: 0,
    },
    {
        id: 'multi_3',
        name: 'Tireuse turbo',
        description: '+25 bières par clic',
        icon: '💪',
        baseCost: 5000,
        bonus: 25,
        count: 0,
    },
    {
        id: 'multi_4',
        name: 'Cascade de houblon',
        description: '+100 bières par clic',
        icon: '⚡',
        baseCost: 50000,
        bonus: 100,
        count: 0,
    },
];

// Cost scaling formula
export const getUpgradeCost = (baseCost, count) =>
    Math.floor(baseCost * Math.pow(1.15, count));

// Prestige
export const PRESTIGE_THRESHOLD = 1000000;
export const PRESTIGE_BONUS = 0.05; // +5% permanent production per prestige level

// Number formatting
export const formatNumber = (num) => {
    if (num >= 1e12) return (num / 1e12).toFixed(1) + ' T';
    if (num >= 1e9) return (num / 1e9).toFixed(1) + ' B';
    if (num >= 1e6) return (num / 1e6).toFixed(1) + ' M';
    if (num >= 1e3) return (num / 1e3).toFixed(1) + ' K';
    return Math.floor(num).toString();
};
