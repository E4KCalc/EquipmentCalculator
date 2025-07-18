export const MODI = ["feldherr", "burgvogt"];
export const parts = [
    { key: "ruestung", name: "Rüstung" },
    { key: "waffe", name: "Waffe" },
    { key: "helm", name: "Helm" },
    { key: "artefakt", name: "Artefakt" },
    { key: "held", name: "Held" }
];


export const STATS = {
    feldherr: {
        kampfkraft_einheitenlimit: [
            { value: "nahkampfkraft", label: "Nah-KK", max: 140 },
            { value: "fernkampfkraft", label: "Fern-KK", max: 140 },
            { value: "innenhofkampfkraft", label: "Innenhof-KK", max: 100 },
            { value: "einheitenlimitfront", label: "Limit Front", max: 50 },
            { value: "einheitenlimitflanke", label: "Limit Flanke", max: 50 }
        ],
        kampfkraft_einheitenlimit_vs_bh: [
            { value: "nahkampfkraft_vs_bh", label: "Nah-KK vs BH", max: 50, held: true, max_held: 50 },
            { value: "fernkampfkraft_vs_bh", label: "Fern-KK vs BH", max: 50, held: true, max_held: 50 },
            { value: "innenhofkampfkraft_vs_bh", label: "Innenhof-KK vs BH", max: 60, held: true, max_held: 60 },
            { value: "einheitenlimitfront_vs_bh", label: "Limit Front vs BH", max: 40, held: true, max_held: 40 },
            { value: "einheitenlimitflanke_vs_bh", label: "Limit Flanke vs BH", max: 40, held: true, max_held: 40 }
        ],
        zusatzwerte: [
            { value: "schildmaid", label: "Schildmaid", max: 1050, artefaktOnly: true },
            { value: "kampfkraft_angriff", label: "KK Angriff", max: 20 },
            { value: "kampfkraft_front", label: "KK Front", max: 20 },
            { value: "kampfkraft_flanke", label: "KK Flanke", max: 20 }
        ],
        other: [
            { value: "mauerschutz", label: "Mauerschutz", max: 160 },
            { value: "torschutz", label: "Torschutz", max: 160 },
            { value: "grabenschutz", label: "Grabenschutz", max: 120 },
            { value: "reisegeschwindigkeit", label: "Reisetempo", max: 100, held: false, max_held: 40 },
            { value: "beute", label: "Beutebonus", max: 100, held: false, max_held: 40 },
        ],
        other_vs_bh: [
            { value: "mauerschutz_vs_bh", label: "Mauers. vs BH", max: 60, held: true, max_held: 60 },
            { value: "torschutz_vs_bh", label: "Tors. vs BH", max: 60, held: true, max_held: 60 },
            { value: "grabenschutz_vs_bh", label: "Grabens. vs BH", max: 30, held: true, max_held: 30 }
        ]
    },
    burgvogt: {
        kampfkraft_einheitenlimit: [
            { value: "nahkampfkraft", label: "Nah-KK", max: 140 },
            { value: "fernkampfkraft", label: "Fern-KK", max: 140 },
            { value: "innenhofkampfkraft", label: "Innenhof-KK", max: 100 },
            { value: "einheitenlimitmauer", label: "Maurerlimit", max: 50 }
        ],
        kampfkraft_einheitenlimit_vs_bh: [
            { value: "nahkampfkraft_vs_bh", label: "Nah-KK vs BH", max: 50, held: true, max_held: 50 },
            { value: "fernkampfkraft_vs_bh", label: "Fern-KK vs BH", max: 50, held: true, max_held: 50 },
            { value: "innenhofkampfkraft_vs_bh", label: "Innenhof-KK vs BH", max: 60, held: true, max_held: 60 },
            { value: "einheitenlimitmauer_vs_bh", label: "Mauerlimit vs BH", max: 40, held: true, max_held: 40 }
        ],
        zusatzwerte: [
            { value: "beschuetzer_nordens", label: "Beschützer des Nordens", max: 1050, artefaktOnly: true },
            { value: "kampfkraft_hauptburg", label: "KK Hauptburg/Außenposten/Landmarke", max: 20 },
            { value: "kampfkraft_verteidiger", label: "KK Verteidiger", max: 20 },
            { value: "kampfkraft_front_verteidigung", label: "KK Front", max: 20 },
            { value: "kampfkraft_flanke_verteidigung", label: "KK Flanken", max: 20 }
        ],
        other: [
            { value: "mauerschutz", label: "Mauerschutz", max: 160 },
            { value: "torschutz", label: "Torschutz", max: 160 },
            { value: "grabenschutz", label: "Grabenschutz", max: 120 },
            { value: "angriffswarnung_vs_bh", label: "Frühere Angriffswarnung gegen Burgherren", max: 90 }
        ],
        other_vs_bh: [
            { value: "mauerschutz_vs_bh", label: "Mauers vs BH", max: 60, held: true, max_held: 60 },
            { value: "torschutz_vs_bh", label: "Tors vs BH", max: 60, held: true, max_held: 60 },
            { value: "grabenschutz_vs_bh", label: "Grabens vs BH", max: 30, held: true, max_held: 30 }
        ]
    }
};

// Helfer zum Zusammenführen aller Stats für aktuelle Modi (wird von der UI benötigt!)
export function getAllStats(mode) {
    const m = STATS[mode];
    return [].concat(
        m.kampfkraft_einheitenlimit || [],
        m.kampfkraft_einheitenlimit_vs_bh || [],
        m.zusatzwerte || [],
        m.other || [],
        m.other_vs_bh || []
    );
}

export function getHeroExtraStats(mode) {
    if (mode === "feldherr") {
        return [
            { value: "extra_welle", label: "+1 Extra Welle", isPercent: false },
            { value: "metangriff", label: "Angriffsstärke für Met-Einheiten", isPercent: true }
        ];
    } else if (mode === "burgvogt") {
        return [
            { value: "metproduktion", label: "Erhöhte Metproduktion", isPercent: true },
            { value: "baugeschwindigkeit", label: "Baugeschwindigkeit", isPercent: true },
            { value: "oeffentliche_ordnung", label: "Öffentliche Ordnung", isPercent: false },
            { value: "rekrutierung", label: "Rekrutrierungsgeschwindigkeit", isPercent: true },
            { value: "lazarettplaetze", label: "Lazarettplätze", isPercent: false },
            { value: "rohstofftransport", label: "Rohstofftransportkapazität", isPercent: true }
        ];
    }
    return [];
}


export const SUMMARY_STATS = [
    {
        key: "nahkampfkraft_gesamt",
        label: "Nahkampfkraft",
        max: 240,
        substats: [
            { value: "nahkampfkraft", label: "Nahkampf bei Angriff", max: 140 },
            { value: "nahkampfkraft_vs_bh", label: "Nahkampf gegen Burgherren", max: 50 },
            { value: "nahkampfkraft_vs_bh", label: "Nahkampf gegen Burgherren (Held)", max: 50, held: true }
        ]
    },
    {
        key: "fernkampfkraft_gesamt",
        label: "Fernkampfkraft",
        max: 240,
        substats: [
            { value: "fernkampfkraft", label: "Fernkampf bei Angriff", max: 140 },
            { value: "fernkampfkraft_vs_bh", label: "Fernkampf gegen Burgherren", max: 50 },
            { value: "fernkampfkraft_vs_bh", label: "Fernkampf gegen Burgherren (Held)", max: 50, held: true }
        ]
    },
    {
        key: "innenhofkampfkraft_gesamt",
        label: "Innenhofkampfkraft",
        max: 220,
        substats: [
            { value: "innenhofkampfkraft", label: "Innenhof bei Angriff", max: 100 },
            { value: "innenhofkampfkraft_vs_bh", label: "Innenhof gegen Burgherren", max: 60 },
            { value: "innenhofkampfkraft_vs_bh", label: "Innenhof gegen Burgherren (Held)", max: 60, held: true }
        ]
    },
    {
        key: "kampfkraft_angriff_gesamt",
        label: "Kampfkraft beim Angriff",
        max: 20,
        substats: [{ value: "kampfkraft_angriff", label: "Kampfkraft beim Angriff", max: 20 }]
    },
    {
        key: "kampfkraft_front_gesamt",
        label: "Kampfkraft Front",
        max: 20,
        substats: [{ value: "kampfkraft_front", label: "Kampfkraft Front", max: 20 }]
    },
    {
        key: "kampfkraft_flanke_gesamt",
        label: "Kampfkraft Flanke",
        max: 20,
        substats: [{ value: "kampfkraft_flanke", label: "Kampfkraft Flanke", max: 20 }]
    },
    // -------------
    {
        key: "beschuetzer_nordens",
        label: "Beschützer des Nordens",
        max: 1050,
        substats: [{ value: "beschuetzer_nordens", label: "Beschützer des Nordens", max: 1050 }]
    },
    {
        key: "kampfkraft_hauptburg",
        label: "KK Hauptburg/Außenposten/Landmarke",
        max: 20,
        substats: [{ value: "kampfkraft_hauptburg", label: "KK Hauptburg/Außenposten/Landmarke", max: 20 }]
    },
    {
        key: "kampfkraft_verteidiger",
        label: "KK Verteidiger",
        max: 20,
        substats: [{ value: "kampfkraft_verteidiger", label: "KK Verteidiger", max: 20 }]
    },
    {
        key: "kampfkraft_front_verteidigung",
        label: "KK Front (Verteidigung)",
        max: 20,
        substats: [{ value: "kampfkraft_front_verteidigung", label: "KK Front (Verteidigung)", max: 20 }]
    },
    {
        key: "kampfkraft_flanke_verteidigung",
        label: "KK Flanke (Verteidigung)",
        max: 20,
        substats: [{ value: "kampfkraft_flanke_verteidigung", label: "KK Flanke (Verteidigung)", max: 20 }]
    },
    // -------------
    {
        key: "mauerschutz_gesamt",
        label: "Mauerschutz",
        max: 280,
        substats: [
            { value: "mauerschutz", label: "Mauerschutz bei Angriff", max: 160 },
            { value: "mauerschutz_vs_bh", label: "Mauerschutz gegen Burgherren", max: 60 },
            { value: "mauerschutz_vs_bh", label: "Mauerschutz gegen Burgherren (Held)", max: 60, held: true }
        ]
    },
    {
        key: "torschutz_gesamt",
        label: "Torschutz",
        max: 280,
        substats: [
            { value: "torschutz", label: "Torschutz bei Angriff", max: 160 },
            { value: "torschutz_vs_bh", label: "Torschutz gegen Burgherren", max: 60 },
            { value: "torschutz_vs_bh", label: "Torschutz gegen Burgherren (Held)", max: 60, held: true }
        ]
    },
    {
        key: "grabenschutz_gesamt",
        label: "Grabenschutz",
        max: 180,
        substats: [
            { value: "grabenschutz", label: "Grabenschutz bei Angriff", max: 120 },
            { value: "grabenschutz_vs_bh", label: "Grabenschutz gegen Burgherren", max: 30 },
            { value: "grabenschutz_vs_bh", label: "Grabenschutz gegen Burgherren (Held)", max: 30, held: true }
        ]
    },
    // -------------
    {
        key: "einheitenlimitfront_gesamt",
        label: "Einheitenlimit Front",
        max: 130,
        substats: [
            { value: "einheitenlimitfront", label: "Einheitenlimit an der Front", max: 50 },
            { value: "einheitenlimitfront_vs_bh", label: "Einheitenlimit an der Front gegen Burgherren", max: 40 },
            { value: "einheitenlimitfront_vs_bh", label: "Einheitenlimit an der Front gegen Burgherren (Held)", max: 40, held: true }
        ]
    },
    {
        key: "einheitenlimitflanke_gesamt",
        label: "Einheitenlimit Flanke",
        max: 130,
        substats: [
            { value: "einheitenlimitflanke", label: "Einheitenlimit an der Flanke", max: 50 },
            { value: "einheitenlimitflanke_vs_bh", label: "Einheitenlimit an der Flanke gegen Burgherren", max: 40 },
            { value: "einheitenlimitflanke_vs_bh", label: "Einheitenlimit an der Flanke gegen Burgherren (Held)", max: 40, held: true }
        ]
    },
    {
        key: "schildmaid",
        label: "SchildmaidUnterstützung",
        max: 1050,
        substats: [{ value: "schildmaid", label: "SchildmaidUnterstützung", max: 1050 }]
    },
    {
        key: "metangriff",
        label: "Angriffsstärke für Met-Einheiten",
        max: null,
        substats: [{ value: "metangriff", label: "Angriffsstärke für Met-Einheiten", max: null, held: true }]
    },
    // -------------
    {
        key: "reisegeschwindigkeit",
        label: "Reisetempo",
        max: 100,
        substats: [{ value: "reisegeschwindigkeit", label: "Reisetempo", max: 100 }]
    },
    {
        key: "angriffswarnung_vs_bh",
        label: "Spätere Entdeckung der Armee beim Angriff auf Burgherren",
        max: 90,
        substats: [{ value: "angriffswarnung_vs_bh", label: "Spätere Entdeckung", max: 90 }]
    },
    {
        key: "extra_welle",
        label: "Zusätzliche Welle",
        max: 1,
        substats: [{ value: "extra_welle", label: "Zusätzliche Welle", max: 1, held: true }]
    },
    {
        key: "beute",
        label: "Beutebonus",
        max: 50,
        substats: [{ value: "beute", label: "Beutebonus", max: 50 }]
    }
];
