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
        left: [
            { value: "nahkampfkraft", label: "Nahkampfkraft", max: 140 },
            { value: "fernkampfkraft", label: "Fernkampfkraft", max: 140 },
            { value: "innenhofkampfkraft", label: "Innenhofkampfkraft", max: 100 },
            { value: "einheitenlimitfront", label: "Einheitenlimit Front", max: 50 },
            { value: "einheitenlimitflanke", label: "Einheitenlimit Flanke", max: 50 },
            { value: "mauerschutz", label: "Mauerschutz", max: 160 },
            { value: "torschutz", label: "Torschutz", max: 160 },
            { value: "grabenschutz", label: "Grabenschutz", max: 120 },
            { value: "reisegeschwindigkeit", label: "Reisetempo", max: 100, held: false, max_held: 40 },
            { value: "beute", label: "Beutebonus", max: 100, held: false, max_held: 40 }
        ],
        right: [
            { value: "nahkampfkraft_vs_bh", label: "Nahkampfkraft gegen Burgherren", max: 50, held: true, max_held: 50 },
            { value: "fernkampfkraft_vs_bh", label: "Fernkampfkraft gegen Burgherren", max: 50, held: true, max_held: 50 },
            { value: "innenhofkampfkraft_vs_bh", label: "Innenhofkampfkraft gegen Burgherren", max: 60, held: true, max_held: 60 },
            { value: "einheitenlimitfront_vs_bh", label: "Einheitenlimit Front gegen Burgherren", max: 40, held: true, max_held: 40 },
            { value: "einheitenlimitflanke_vs_bh", label: "Einheitenlimit Flanke gegen Burgherren", max: 40, held: true, max_held: 40 },
            { value: "mauerschutz_vs_bh", label: "Mauerschutz gegen Burgherren", max: 60, held: true, max_held: 60 },
            { value: "torschutz_vs_bh", label: "Torschutz gegen Burgherren", max: 60, held: true, max_held: 60 },
            { value: "grabenschutz_vs_bh", label: "Grabenschutz gegen Burgherren", max: 30, held: true, max_held: 30 }
        ],
        other: [
            { value: "kampfkraft_flanke", label: "Kampfkraft an den Flanken", max: 20 },
            { value: "kampfkraft_front", label: "Kampfkraft an der Front", max: 20 },
            { value: "kampfkraft_angriff", label: "Kampfkraft beim Angriff", max: 20 },
            { value: "schildmaid", label: "SchildmaidUnterstützung", max: 1050 }
        ]
    },
    burgvogt: {
        left: [
            { value: "nahkampfkraft", label: "Nahkampfkraft", max: 140 },
            { value: "fernkampfkraft", label: "Fernkampfkraft", max: 140 },
            { value: "innenhofkampfkraft", label: "Innenhof", max: 100 },
            { value: "kampfkraft_flanke", label: "Kampfkraft an den Flanken", max: 20 },
            { value: "kampfkraft_front", label: "Kampfkraft an der Front", max: 20 },
            { value: "mauerschutz", label: "Mauerschutz", max: 160 },
            { value: "torschutz", label: "Torschutz", max: 160 },
            { value: "grabenschutz", label: "Grabenschutz", max: 120 },
            { value: "kampfkraft_verteidigung", label: "Kampfkraft für Verteidiger", max: 20 },
            { value: "einheitenlimitmauer", label: "Einheitenlimit auf der Mauer", max: 50 },
            { value: "beschuetzer_nordens", label: "Beschützer des Nordens", max: 1050 },
            { value: "angriffswarnung", label: "frühere Angriffswarnung", max: 100 }
        ],
        right: [
            { value: "nahkampfkraft_vs_bh", label: "Nahkampfkraft gegen Burgherren", max: 50, held: true, max_held: 50 },
            { value: "fernkampfkraft_vs_bh", label: "Fernkampfkraft gegen Burgherren", max: 50, held: true, max_held: 50 },
            { value: "innenhofkampfkraft_vs_bh", label: "Innenhof gegen Burgherren", max: 60, held: true, max_held: 60 },
            { value: "einheitenlimitmauer_vs_bh", label: "Einheitenlimit auf der Mauer gegen Burgherren", max: 40, held: true, max_held: 40 },
            { value: "mauerschutz_vs_bh", label: "Mauerschutz gegen Burgherren", max: 60, held: true, max_held: 60 },
            { value: "torschutz_vs_bh", label: "Torschutz gegen Burgherren", max: 60, held: true, max_held: 60 },
            { value: "grabenschutz_vs_bh", label: "Grabenschutz gegen Burgherren", max: 30, held: true, max_held: 30 },
            { value: "angriffswarnung_vs_bh", label: "frühere Angriffswarnung gegen Burgherren", max: 90, held: true, max_held: 90 }
        ],
        other: [
            // Burgvogt-Helden-Extras siehe unten!
        ]
    }
};

export function getAllStats(mode) {
    // Kombiniert left, right und other
    return [].concat(STATS[mode].left, STATS[mode].right, STATS[mode].other);
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

// "Superwerte" für das neue Feature (Summary Bars)
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
