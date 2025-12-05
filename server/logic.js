// MATRIZ DE PESOS 
// Define o multiplicador de importância baseado no Arquétipo do Inimigo
const MATCHUP_WEIGHTS = {
    // Inimigo é TANQUE/ENGAGE (Ex: Ornn, Sejuani, Nautilus)
    "TANK": {
        "DPS": 2.0,      // Crucial: Precisa de dano contínuo para derreter HP
        "BURST": 0.5,    // Ruim: Burst não mata tanque
        "ENGAGE": 1.0,   // Neutro
        "PEEL": 1.5      // Bom: Precisa proteger o carry da iniciação deles
    },
    // Inimigo é POKE/SIEGE (Ex: Jayce, Xerath, Ezreal)
    "POKE": {
        "DPS": 0.8,      // Ruim: Difícil bater neles constantemente
        "BURST": 1.5,    // Bom: Se pegar, explode (são frágeis)
        "ENGAGE": 2.0,   // Crucial: TEM que pular neles para ganhar (Hard Engage)
        "PEEL": 1.0      // Neutro
    },
    // Inimigo é ASSASSIN/PICK-OFF (Ex: Zed, Kha'Zix, Blitzcrank)
    "ASSASSIN": {
        "DPS": 1.0,      // Neutro
        "BURST": 1.0,    // Neutro
        "ENGAGE": 0.8,   // Ruim: Eles fogem fácil
        "PEEL": 2.5      // Crucial: Se não tiver proteção (Lulu/Janna), o ADC morre
    },
    // Inimigo é SPLIT PUSH (Ex: Fiora, Tryndamere)
    "SPLIT": {
        "DPS": 1.0,
        "BURST": 1.2,    // Bom: Matar rápido 5v4
        "ENGAGE": 2.0,   // Crucial: Forçar luta 5v4 rápido enquanto o Splitter não chega
        "PEEL": 0.5      // Menos relevante: O foco é ataque, não defesa
    }
};

function calculateTier(score) {
    if (score >= 12) return "TIER S+ (EXODIA)"; // Pontuação muito alta (ex: 10 * 2.0)
    if (score >= 9) return "TIER S (GOD TIER)";
    if (score >= 7) return "TIER A (META)";
    if (score >= 5) return "TIER B (VIÁVEL)";
    if (score >= 3) return "TIER C (SITUACIONAL)";
    return "TIER D (TROLL PICK)";
}

function analyzeMatchup(enemyArchetype, teamStats) {
    // teamStats vem como: { DPS: 8, BURST: 4, ENGAGE: 10, PEEL: 5 }
    
    const weights = MATCHUP_WEIGHTS[enemyArchetype];
    
    if (!weights) {
        return { error: "Arquétipo inimigo inválido" };
    }

    let totalScore = 0;
    let totalWeight = 0;
    const details = [];

    // Cálculo da Média Ponderada
    for (const [stat, value] of Object.entries(teamStats)) {
        const weight = weights[stat];
        const weightedScore = value * weight;
        
        totalScore += weightedScore;
        totalWeight += weight;

        details.push({
            stat: stat,
            baseValue: value,
            multiplier: weight,
            finalPoints: weightedScore.toFixed(1),
            tip: weight >= 2.0 ? "CRUCIAL (Counter)" : (weight <= 0.8 ? "Ineficaz aqui" : "Normal")
        });
    }

    // A pontuação final é uma média ponderada ajustada para escala 0-15 (aprox)
    const finalScore = totalScore / (Object.keys(teamStats).length); 

    return {
        enemyArchetype,
        finalScore: finalScore.toFixed(1),
        tier: calculateTier(finalScore),
        details: details
    };
}

module.exports = { analyzeMatchup };