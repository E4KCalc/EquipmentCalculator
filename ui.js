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
                <span class="stat-selector-title">Filter Stats</span>
                <span class="accordion-arrow" id="accordion-arrow">&#9654;</span>
            </div>
            <div id="relevant-stats-accordion" class="accordion-content">
                <div id="relevant-stats-box"></div>
            </div>
        </div>
        <div class="equipment-grid" id="equipment-grid"></div>
    `;
    renderRelevantStatsBox();
    renderEquipmentGrid();
    setupEquipmentEvents();
    updateResults();

    // Akkordeon Funktionalität
    const accordionHeader = document.getElementById("accordion-toggle");
    const accordionContent = document.getElementById("relevant-stats-accordion");
    const accordionArrow = document.getElementById("accordion-arrow");
    let accordionOpen = false;
    accordionContent.style.display = "none";
    accordionArrow.style.transform = "rotate(0deg)";
    accordionHeader.addEventListener("click", () => {
        accordionOpen = !accordionOpen;
        if (accordionOpen) {
            accordionContent.style.display = "block";
            accordionArrow.style.transform = "rotate(90deg)";
        } else {
            accordionContent.style.display = "none";
            accordionArrow.style.transform = "rotate(0deg)";
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
                ${createDropdown(`${part.key}-stat${i}`, allowed)}
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
                    ${createDropdown(`${part.key}-gem-stat${i}`, allStats)}
                    <input type="number" name="${part.key}-gem-value${i}" class="stat-value" placeholder="%" min="0" style="width:54px;">
                </div>
            `;
        }
        gemBlock = `
            <div class="gem-block">
                <h5>Edelstein</h5>
                <div class="gem-stats">
                    ${gemStatsHtml}
                </div>
            </div>
        `;
    }

    // HELD-Extra-Felder als Dropdowns
    let extraFields = "";
    if (isHeld) {
        const heroExtraStats = getHeroExtraStats(currentMode);
        for (let i = 1; i <= 2; i++) {
            extraFields += `
                <div>
                    ${createDropdown(`held-extra-stat${i}`, heroExtraStats)}
                    <input type="number" name="held-extra-value${i}" class="stat-value" placeholder="%" min="0" style="width:54px;">
                </div>
            `;
        }
        if (extraFields) {
            extraFields = `
                <div class="held-extra">
                    <h5>Extra Effekte</h5>
                    <div class="held-extra-fields">
                        ${extraFields}
                    </div>
                </div>`;
        }
    }

    return `
        <div class="equipment-part">
            <h4>${part.name}</h4>
            <div class="stats">
                ${statsHtml}
            </div>
            ${gemBlock}
            ${extraFields}
        </div>
    `;
}

function createDropdown(name, options) {
    return `<select name="${name}" class="stat-type">
        <option value="">Wert wählen…</option>
        ${options.map(opt => `<option value="${opt.value}">${opt.label}</option>`).join("")}
    </select>`;
}

function setupEquipmentEvents() {
    const grid = document.getElementById("equipment-grid");
    grid.addEventListener("input", handleEquipmentInput);
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
    updateResults();
}

function updateResults() {
    const allStats = getAllStats(currentMode);
    const leftStats = STATS[currentMode].left;
    const rightStats = STATS[currentMode].right;

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

    let htmlLeft = '<h3>Basis Ausrüstungswerte</h3>';
    let htmlRight = '<h3>Gegen Burg­herren-Werte</h3>';

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
          <span>${val} / ${max}</span>
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
          <span>${val} / ${max}</span>
        </div>`;
    });

    // Ergebnisse in die Grid-Boxen schreiben
    document.getElementById("results-col-left").innerHTML = htmlLeft;
    document.getElementById("results-col-right").innerHTML = htmlRight;

    // Summierte Gesamtwerte als eigene hohe Box (im Grid!)
    updateSummaryResults(equipmentSetup);
}

function updateSummaryResults(equipmentSetup) {
    let html = `<h2>Summierte Gesamtwerte</h2>`;
    SUMMARY_STATS.forEach(stat => {
        let subDetails = [];
        let heldUsed = false;
        let onlyHeld = true;

        // Clamping für Einzel-Substats
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

        // Farblogik
        if (!onlyHeld && percNoHeld >= 98) color = "bg-green";
        else if (!onlyHeld && percNoHeld >= 85) color = "bg-yellow";
        if (heldUsed && percTotal >= 98) color = "bg-pink";

        html += `
        <div class="summary-bar ${color}">
            <div class="summary-bar-head" data-accordion="${stat.key}">
                <span style="font-weight:bold">${stat.label}</span>
                <span><b>${subSumTotal}</b> / ${stat.max !== null ? stat.max + " %" : "?"}</span>
                <span class="accordion-arrow" id="sum-arrow-${stat.key}">&#9654;</span>
            </div>
            <div class="summary-bar-body" id="sum-body-${stat.key}" style="display:none">
                ${subDetails.filter(x=>x.value)
                    .map(x => `<div style="margin:3px 0 3px 15px; font-size:0.98em">${x.label}: <b>${x.value}${x.max ? " / " + x.max : ""}</b></div>`)
                    .join("")}
            </div>
        </div>`;
    });

    let box = document.getElementById("summary-results");
    if (box) box.innerHTML = html;

    // Akkordeon
    SUMMARY_STATS.forEach(stat => {
        const header = document.querySelector(`.summary-bar-head[data-accordion='${stat.key}']`);
        const body = document.getElementById(`sum-body-${stat.key}`);
        const arrow = document.getElementById(`sum-arrow-${stat.key}`);
        if (header && body && arrow) {
            header.onclick = () => {
                const open = body.style.display === "block";
                body.style.display = open ? "none" : "block";
                arrow.style.transform = open ? "rotate(0deg)" : "rotate(90deg)";
            }
        }
    });
}
