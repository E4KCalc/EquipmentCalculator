export class StatEntry {
    constructor(type, value) {
        this.type = type;
        this.value = parseFloat(value) || 0;
    }
}
export class Gem {
    constructor(stats) {
        this.stats = stats;
    }
    getStatSum(statType) {
        return this.stats.filter(stat => stat.type === statType).reduce((a, b) => a + b.value, 0);
    }
}
export class EquipmentPart {
    constructor(type, name) {
        this.type = type;
        this.name = name;
        this.stats = [];
        this.gem = null;
    }
    setStats(stats) { this.stats = stats; }
    setGem(gem) { this.gem = gem; }
    getStatSum(statType) {
        let sum = this.stats.filter(stat => stat.type === statType).reduce((a, b) => a + b.value, 0);
        if (this.gem) sum += this.gem.getStatSum(statType);
        return sum;
    }
}
