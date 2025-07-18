import { MODI, STATS, parts, getAllStats, getHeroExtraStats, SUMMARY_STATS } from "./stats.js";
import { EquipmentPart, Gem, StatEntry } from "./equipment.js";

export let currentMode = "feldherr";
let relevantStats = getAllStats(currentMode).map(stat => true);

let equipmentSetup = null;



function getActiveStatOptions() {
    const allStats = getAllStats(currentMode);
    return allStats.filter((stat, i) => relevantStats[i]);
}




export function renderAppRoot() {
    const root = document.getElementById("app-root");
    root.innerHTML = `
        <div class="accordion-box">
            <div class="accordion-header" id="accordion-toggle">
                <span class="stat-selector-title">Filter nach relevanten Stats (deavtivated)</span>
                <span class="accordion-arrow" id="accordion-arrow">&#9654;</span>
            </div>
            <div id="relevant-stats-accordion" class="accordion-content" style="height:0; display:none;">
                <div id="relevant-stats-box"></div>
            </div>
        </div>
        <div class="equipment-grid" id="equipment-grid"></div>
    `;
    renderRelevantStatsBox();
    renderEquipmentGrid();
    setupEquipmentEvents();
    updateResults();

    // Akkordeon Funktionalität mit sanfter Animation
    const accordionHeader = document.getElementById("accordion-toggle");
    const accordionContent = document.getElementById("relevant-stats-accordion");
    const accordionArrow = document.getElementById("accordion-arrow");
    let accordionOpen = false;

    accordionHeader.addEventListener("click", () => {
        accordionOpen = !accordionOpen;
        if (accordionOpen) {
            accordionContent.style.display = "block";
            let height = accordionContent.scrollHeight + "px";
            accordionContent.style.height = "0";
            // Neu:
            accordionContent.classList.add("open");
            requestAnimationFrame(() => {
                accordionContent.style.height = height;
            });
            accordionArrow.style.transform = "rotate(90deg)";
        } else {
            accordionContent.style.height = accordionContent.scrollHeight + "px";
            requestAnimationFrame(() => {
                accordionContent.style.height = "0";
            });
            accordionArrow.style.transform = "rotate(0deg)";
            // Nach der Animation: open entfernen & display:none
            accordionContent.addEventListener("transitionend", function handler() {
                accordionContent.style.display = "none";
                accordionContent.classList.remove("open");
                accordionContent.removeEventListener("transitionend", handler);
            });
        }
    });


}





export function setupNavbarEvents() {
    document.getElementById("nav-feldherr").addEventListener("click", () => {
        if (currentMode !== "feldherr") {
            currentMode = "feldherr";
            document.getElementById("nav-feldherr").classList.add("active");
            document.getElementById("nav-burgvogt").classList.remove("active");
            relevantStats = getAllStats(currentMode).map(stat => true);
            renderAppRoot();
        }
    });
    document.getElementById("nav-burgvogt").addEventListener("click", () => {
        if (currentMode !== "burgvogt") {
            currentMode = "burgvogt";
            document.getElementById("nav-feldherr").classList.remove("active");
            document.getElementById("nav-burgvogt").classList.add("active");
            relevantStats = getAllStats(currentMode).map(stat => true);
            renderAppRoot();
        }
    });
}





function renderRelevantStatsBox() {
    const box = document.getElementById("relevant-stats-box");
    const allStats = getAllStats(currentMode);
    box.innerHTML = allStats.map((stat, i) =>
        `<label>
            <input type="checkbox" class="relevant-stat-toggle" value="${stat.value}" ${relevantStats[i] ? "checked" : ""}>
            ${stat.label}
        </label>`
    ).join("");
    box.querySelectorAll(".relevant-stat-toggle").forEach(cb => {
        cb.addEventListener("change", e => {
            const idx = allStats.findIndex(stat => stat.value === e.target.value);
            relevantStats[idx] = e.target.checked;
            renderEquipmentGrid();
            updateResults();
        });
    });
}





// Rendert alle Ausrüstungs-Boxen, die Summary-Box und die Ergebnis-Boxen
function renderEquipmentGrid() {
    equipmentSetup = {};
    parts.forEach(part => {
        equipmentSetup[part.key] = new EquipmentPart(part.key, part.name);
    });
    const grid = document.getElementById("equipment-grid");

    // 5 Ausrüstungsteile (Rüstung, Waffe, Helm, Artefakt, Held)
    let html = parts.map(part => renderEquipmentPart(part)).join("");

    // Summary-Box ganz rechts oben im Grid (grid-row:1/span2, grid-column:6)
    html += `<div class="equipment-summary-part" id="summary-results"></div>`;

    // Untere Zeile: Ergebnis-Boxen im Grid positioniert (über CSS Grid)
    html += `
        <div id="results-col-left"></div>
        <div id="results-col-right"></div>
    `;

    grid.innerHTML = html;
}





// Einzelne Ausrüstung (ohne eigene .equipment-part drumherum!)
function renderEquipmentPart(part) {
    let statsHtml = '';
    const allStats = getAllStats(currentMode);

    let isHeld = part.key === "held";
    let allowed;
    if (isHeld) {
        if (currentMode === "feldherr") {
            allowed = allStats.filter(opt =>
                (opt.held === true) ||
                (opt.value === "reisegeschwindigkeit" || opt.value === "beute")
            );
        } else if (currentMode === "burgvogt") {
            allowed = allStats.filter(opt =>
                (opt.held === true && opt.max_held) || (opt.held === "burgvogt")
            );
            allowed = allowed.filter(opt => opt.value !== "reisegeschwindigkeit" && opt.value !== "beute");
        }
    } else {
        allowed = allStats.filter(opt =>
            (!opt.value.endsWith("_vs_bh") && (!opt.held || opt.held === undefined || opt.held === false || opt.value === "beute" || opt.value === "reisegeschwindigkeit"))
        );
    }

    for (let i = 1; i <= 4; i++) {
        statsHtml += `
            <div>
                ${createGroupedDropdown(`${part.key}-stat${i}`, currentMode, "", part.key, false)}
                <input type="number" name="${part.key}-value${i}" class="stat-value" placeholder="%" min="0" style="width:54px;">
            </div>
        `;
    }

    let gemBlock = "";
    if (!isHeld) {
        let gemStatsHtml = "";
        for (let i = 1; i <= 4; i++) {
            gemStatsHtml += `
                <div>
                    ${createGroupedDropdown(`${part.key}-gem-stat${i}`, currentMode, "", part.key, true)}
                    <input type="number" name="${part.key}-gem-value${i}" class="stat-value" placeholder="%" min="0" style="width:54px;">
                </div>
            `;
        }
        gemBlock = `
            <div class="gem-block">
                <div class="gem-header" style="cursor:pointer; user-select:none; display:flex; align-items:center; justify-content:space-between; padding: 6px 10px; font-weight:600; color:#2eb4ad; border-radius: 10px;">
                    <span>Edelstein</span>
                    <span class="gem-arrow" style="transition: transform 0.3s;">&#9654;</span>
                </div>
                <div class="gem-stats open" style="overflow:hidden; height:auto;">
                    ${gemStatsHtml}
                </div>
            </div>
        `;
    }

    let extraFields = "";
    if (isHeld) {
        const heroExtraStats = getHeroExtraStats(currentMode);
        for (let i = 1; i <= 2; i++) {
            extraFields += `
                <div>
                    ${createGroupedDropdown(`held-extra-stat${i}`, currentMode, "", part.key, false)}
                    <input type="number" name="held-extra-value${i}" class="stat-value" placeholder="%" min="0" style="width:54px;">
                </div>
            `;
        }
        if (extraFields) {
            extraFields = `
                <div class="held-extra">
                    <h5>Extra Werte (Held)</h5>
                    <div class="held-extra-fields">
                        ${extraFields}
                    </div>
                </div>`;
        }
    }

    return `
        <div class="equipment-part">
            <div class="equipment-part-header">
                <h4>${part.name}</h4>
                <button class="reset-btn" type="button" title="Zurücksetzen" data-reset="${part.key}">
                    <span class="reset-icon">&#8635;</span>
                </button>
            </div>
            <div class="stats">
                ${statsHtml}
            </div>
            ${gemBlock}
            ${extraFields}
        </div>
    `;
}





export function createGroupedDropdown(name, mode, selectedValue = "", partKey = "", isGem = false) {
    // Definierte Reihenfolge und CSS-Klassen für Gruppen
    const groupOrder = [
        { key: "kampfkraft_einheitenlimit", label: "Kampfkraft & Einheitenlimit", class: "optgroup-kampfkraft" },
        { key: "kampfkraft_einheitenlimit_vs_bh", label: "Kampfkraft & Einheitenlimit gegen Burgherren", class: "optgroup-kampfkraft-vsbh" },
        { key: "zusatzwerte", label: "Zusatzwerte", class: "optgroup-zusatzwerte" },
        { key: "other", label: "Sonstige Werte", class: "optgroup-other" },
        { key: "other_vs_bh", label: "Sonstige Werte gegen Burgherren", class: "optgroup-other-vsbh" }
    ];
    // Stats für den aktuellen Modus(FH, BV) holen
    const statGroups = groupOrder.map(g => {
        let opts = (STATS[mode][g.key] || []);
        if (g.key === "zusatzwerte" && partKey) {
            if (partKey !== "artefakt" || isGem) {
                opts = opts.filter(opt => !opt.artefaktOnly);
            }
        }
        return {
            label: g.label,
            className: g.class,
            options: opts
        };
    });

    // HTML-Select aufbauen (NEU: optgroup bekommt class)
    return `
    <select name="${name}" class="stat-type">
        <option value="">select...</option>
        ${statGroups.map(group =>
            group.options.length
                ? `<optgroup label="${group.label}" class="${group.className}">
                    ${group.options.map(opt =>
                        `<option value="${opt.value}"${selectedValue === opt.value ? " selected" : ""}>${opt.label}${opt.max ? ` (max ${opt.max})` : ""}</option>`
                    ).join("")}
                </optgroup>`
                : ""
        ).join("")}
    </select>
    `;
}





function setupEquipmentEvents() {
    const grid = document.getElementById("equipment-grid");
    grid.addEventListener("input", handleEquipmentInput);

    // Akkordeon für Edelstein
    grid.querySelectorAll(".gem-header").forEach(header => {
        const gemStats = header.nextElementSibling;
        const arrow = header.querySelector(".gem-arrow");
        // Standardmäßig geöffnet:
        gemStats.classList.add("open");
        gemStats.style.height = "auto";
        arrow.style.transform = "rotate(90deg)";

        header.addEventListener("click", () => {
            const isOpen = gemStats.classList.contains("open");

            if (isOpen) {
                // Schließen
                gemStats.style.height = gemStats.scrollHeight + "px";
                gemStats.classList.remove("open");
                requestAnimationFrame(() => {
                    gemStats.style.height = "0";
                });
                arrow.style.transform = "rotate(0deg)";
                gemStats.addEventListener("transitionend", function handler() {
                    gemStats.style.height = "0";
                    gemStats.removeEventListener("transitionend", handler);
                });
            } else {
                // Öffnen
                gemStats.style.display = "block";
                gemStats.style.height = "0";
                requestAnimationFrame(() => {
                    gemStats.style.height = gemStats.scrollHeight + "px";
                });
                arrow.style.transform = "rotate(90deg)";
                gemStats.addEventListener("transitionend", function handler() {
                    gemStats.classList.add("open");
                    gemStats.style.height = "auto";
                    gemStats.removeEventListener("transitionend", handler);
                });
            }
        });
    });

    // Reset-Button für jede Equipment-Box
    grid.querySelectorAll(".reset-btn").forEach(btn => {
        btn.addEventListener("click", (e) => {
            const partKey = btn.getAttribute("data-reset");
            // Alle Inputs in der entsprechenden Box leeren:
            const box = btn.closest('.equipment-part');
            if (!box) return;
            box.querySelectorAll("input[type='number'], select").forEach(input => {
                if (input.type === "number") {
                    input.value = "";
                } else if (input.tagName === "SELECT") {
                    input.selectedIndex = 0;
                }
            });
            handleEquipmentInput();
        });
    });
}





function handleEquipmentInput() {
    parts.forEach(part => {
        let statsArr = [];
        let gemStatsArr = [];
        for (let i = 1; i <= 4; i++) {
            const statSel = document.querySelector(`[name='${part.key}-stat${i}']`);
            const statVal = document.querySelector(`[name='${part.key}-value${i}']`);
            if (statSel && statSel.value && statVal && statVal.value !== "") {
                statsArr.push(new StatEntry(statSel.value, statVal.value));
            }
            if (part.key !== "held") {
                const gemSel = document.querySelector(`[name='${part.key}-gem-stat${i}']`);
                const gemVal = document.querySelector(`[name='${part.key}-gem-value${i}']`);
                if (gemSel && gemSel.value && gemVal && gemVal.value !== "") {
                    gemStatsArr.push(new StatEntry(gemSel.value, gemVal.value));
                }
            }
        }
        // Für Held: Extra-Stats (Dropdowns)
        if (part.key === "held") {
            for (let i = 1; i <= 2; i++) {
                const extraSel = document.querySelector(`[name='held-extra-stat${i}']`);
                const extraVal = document.querySelector(`[name='held-extra-value${i}']`);
                if (extraSel && extraSel.value && extraVal && extraVal.value !== "") {
                    statsArr.push(new StatEntry(extraSel.value, extraVal.value));
                }
            }
        }
        equipmentSetup[part.key].setStats(statsArr);
        if (part.key !== "held") {
            equipmentSetup[part.key].setGem(gemStatsArr.length ? new Gem(gemStatsArr) : null);
        }
    });
    showInputSuccessFeedback(event.target);
    updateResults();
    updateFieldHighlighting();
}




function updateFieldHighlighting() {
    // Mapping von Stat-Typ zu Gruppe/Klasse
    const statToGroup = {};
    const groupOrder = [
        { key: "kampfkraft_einheitenlimit", class: "optgroup-kampfkraft" },
        { key: "kampfkraft_einheitenlimit_vs_bh", class: "optgroup-kampfkraft-vsbh" },
        { key: "zusatzwerte", class: "optgroup-zusatzwerte" },
        { key: "other", class: "optgroup-other" },
        { key: "other_vs_bh", class: "optgroup-other-vsbh" }
    ];
    // Alle Stat-Gruppen und Werte einmal durchgehen (für aktuellen Modus)
    const allStats = getAllStats(currentMode);
    groupOrder.forEach(g => {
        const arr = (STATS[currentMode][g.key] || []);
        arr.forEach(stat => { statToGroup[stat.value] = g.class; });
    });

    // Stat-Dropdowns markieren
    document.querySelectorAll('.stat-type').forEach(sel => {
        // Bisheriges Highlight
        if (sel.value && sel.value !== "") sel.classList.add('has-value');
        else sel.classList.remove('has-value');

        // Alle Farbklassen entfernen
        sel.classList.remove(
            'optgroup-kampfkraft',
            'optgroup-kampfkraft-vsbh',
            'optgroup-zusatzwerte',
            'optgroup-other',
            'optgroup-other-vsbh'
        );
        // Neue hinzufügen, wenn Wert gewählt
        if (statToGroup[sel.value]) {
            sel.classList.add(statToGroup[sel.value]);
        }
    });

    // Wertefelder hervorheben wie gehabt
    document.querySelectorAll('.stat-value').forEach(inp => {
        if (inp.value && inp.value !== "") inp.classList.add('has-value');
        else inp.classList.remove('has-value');
    });
}




function showInputSuccessFeedback(inputEl) {
    if (!inputEl) return;
    inputEl.classList.add("input-success");
    setTimeout(() => inputEl.classList.remove("input-success"), 500);
}




export function setupDarkModeToggle() {
    const darkToggle = document.getElementById("toggle-dark-mode");
    if (darkToggle) {
        darkToggle.onclick = () => {
            document.body.classList.toggle("dark-mode");
            // Text des Buttons wechseln
            if (document.body.classList.contains("dark-mode")) {
                darkToggle.textContent = "☀️ Light Mode";
            } else {
                darkToggle.textContent = "🌙 Dark Mode";
            }
        };
    }
}





function updateResults() {
    const allStats = getAllStats(currentMode);
    const leftStats = STATS[currentMode].kampfkraft_einheitenlimit || [];
    const rightStats = STATS[currentMode].kampfkraft_einheitenlimit_vs_bh || [];

    const activeStats = allStats.filter((stat, i) => relevantStats[i]).map(stat => stat.value);

    const totals = {};
    allStats.forEach(stat => totals[stat.value] = 0);
    Object.values(equipmentSetup).forEach(part => {
        if (part.type !== "held") {
            allStats.forEach(stat => {
                totals[stat.value] += part.getStatSum(stat.value);
            });
        }
    });

    let htmlLeft = '<h3>Kampfkraft & Einheitenlimit</h3>';
    let htmlRight = '<h3>Kampfkraft & Einheitenlimit vs BH</h3>';

    // Linke Spalte
    leftStats.forEach(stat => {
        if (!activeStats.includes(stat.value) || stat.held === true || stat.held === "burgvogt") return;
        const val = totals[stat.value] || 0;
        const max = stat.max;
        const perc = Math.min((val / max) * 100, 100);
        let bg = "bg-red";
        if (perc >= 99.9) bg = "bg-green";
        else if (perc >= 85) bg = "bg-yellow";
        htmlLeft += `<div class="statbar ${bg}">
        ${stat.label}
        <span>${val.toFixed(1)} / ${max}</span>
        </div>`;
    });
    // Rechte Spalte
    rightStats.forEach(stat => {
        if (!activeStats.includes(stat.value)) return;
        const val = totals[stat.value] || 0;
        const max = stat.max;
        const perc = Math.min((val / max) * 100, 100);
        let bg = "bg-red";
        if (perc >= 99.9) bg = "bg-green";
        else if (perc >= 85) bg = "bg-yellow";
        htmlRight += `<div class="statbar ${bg}">
        ${stat.label}
        <span>${val.toFixed(1)} / ${max}</span>
        </div>`;
    });

    // Ergebnisse in die Grid-Boxen schreiben
    document.getElementById("results-col-left").innerHTML = htmlLeft;
    document.getElementById("results-col-right").innerHTML = htmlRight;

    // Summierte Gesamtwerte als eigene hohe Box (im Grid!)
    updateSummaryResults(equipmentSetup);
}





export function updateSummaryResults(equipmentSetup) {
    let ModeOption = "Feldherr"
    if (currentMode !== "feldherr") {
        ModeOption = "Burgvogt"
    }

    let html = `<h2>${ModeOption} Gesamtwerte</h2>`;
    SUMMARY_STATS.forEach(stat => {
        let subDetails = [];
        let heldUsed = false;
        let onlyHeld = true;

        let statSubSum = 0;
        let statSubSumHeld = 0;

        stat.substats.forEach(sub => {
            let value = 0;
            if (sub.held) {
                value = equipmentSetup.held ? equipmentSetup.held.getStatSum(sub.value) : 0;
                if (value) heldUsed = true;
                statSubSumHeld += Math.min(value, sub.max ?? value);
            } else {
                value = Object.values(equipmentSetup)
                    .filter(p => p.type !== "held")
                    .reduce((a, p) => a + p.getStatSum(sub.value), 0);
                statSubSum += Math.min(value, sub.max ?? value);
                onlyHeld = false;
            }
            subDetails.push({
                label: sub.label,
                value: value,
                max: sub.max
            });
        });

        let subSumTotal = statSubSum + statSubSumHeld;
        if (subSumTotal === 0) return;

        let color = "bg-red";
        let maxNoHeld = stat.substats.filter(s => !s.held).reduce((a, s) => a + (s.max ?? 0), 0);
        let maxHeld = stat.substats.filter(s => s.held).reduce((a, s) => a + (s.max ?? 0), 0);

        let percNoHeld = (statSubSum / maxNoHeld) * 100;
        let percTotal = (subSumTotal / (maxNoHeld + maxHeld)) * 100;

        if (!onlyHeld && percNoHeld >= 98) color = "bg-green";
        else if (!onlyHeld && percNoHeld >= 85) color = "bg-yellow";
        if (heldUsed && percTotal >= 98) color = "bg-pink";

        html += `
        <div class="summary-bar ${color}">
            <div class="summary-bar-head" data-accordion="${stat.key}">
                <span style="font-weight:bold">${stat.label}</span>
                <span><b>${subSumTotal.toFixed(1)}</b> / ${stat.max !== null ? stat.max + " %" : "?"}</span>
                <span class="accordion-arrow" id="sum-arrow-${stat.key}">&#9654;</span>
            </div>
            <div class="summary-bar-body" id="sum-body-${stat.key}" style="height:0; display:none; overflow:hidden;">
                ${subDetails.filter(x=>x.value)
                    .map(x => `<div style="margin:3px 0 3px 15px; font-size:0.98em">${x.label}: <b>${x.value.toFixed(1)}${x.max ? " / " + x.max : ""}</b></div>`)
                    .join("")}
            </div>
        </div>`;
    });

    let box = document.getElementById("summary-results");
    if (box) box.innerHTML = html;

    // Akkordeons für Summary Bars mit sanfter Animation
    SUMMARY_STATS.forEach(stat => {
        const header = document.querySelector(`.summary-bar-head[data-accordion='${stat.key}']`);
        const body = document.getElementById(`sum-body-${stat.key}`);
        const arrow = document.getElementById(`sum-arrow-${stat.key}`);
        if (header && body && arrow) {
            header.onclick = () => {
                const open = body.classList.contains("open");
                if (open) {
                    body.style.height = body.scrollHeight + "px";
                    body.classList.remove("open");
                    requestAnimationFrame(() => {
                        body.style.height = "0";
                    });
                    arrow.style.transform = "rotate(0deg)";
                    body.addEventListener("transitionend", function handler() {
                        body.style.display = "none";
                        body.removeEventListener("transitionend", handler);
                    });
                } else {
                    body.style.display = "block";
                    body.style.height = "0";
                    requestAnimationFrame(() => {
                        body.style.height = body.scrollHeight + "px";
                    });
                    arrow.style.transform = "rotate(90deg)";
                    body.addEventListener("transitionend", function handler() {
                        body.classList.add("open");
                        body.style.height = "auto";
                        body.removeEventListener("transitionend", handler);
                    });
                }
            };
        }
    });
}
