// Base de données des e-liquides Vap'Station (données réelles du site vapstation.com)
const vapStationData = {
    savage: {
        name: "Savage",
        icon: "🔥",
        color: "#ef4444",
        products: [
            { name: "Rhino", flavors: ["Pitaya", "Cassis"] },
            { name: "King", flavors: ["Amande crémeuse"] },
            { name: "Aquila", flavors: ["Limonade à la grenade"] },
            { name: "Baghera", flavors: ["Menthe givrée"] },
            { name: "Zephyros", flavors: ["Menthe chlorophylle"] },
            { name: "Gazelia", flavors: ["Pêche", "Poire", "Kiwi"] },
            { name: "Mangabey", flavors: ["Mangue", "Papaye", "Cassis", "Ultra frais"] },
            { name: "Venom", flavors: ["Pastèque", "Kiwi"] }
        ]
    },

    inca: {
        name: "Inca",
        icon: "🌿",
        color: "#059669",
        products: [
            { name: "Saca", flavors: ["Fraise"] },
            { name: "Maya", flavors: ["Cassis", "Raisin blanc", "Fruits rouges", "Frais"] },
            { name: "Amaru", flavors: ["Framboise bleue"] },
            { name: "Supay", flavors: ["Fruit du dragon", "Pomme", "Poire"] },
            { name: "Manco", flavors: ["Pêche gummie"] },
            { name: "Cuzko", flavors: ["Triple citron"] },
            { name: "Pacha", flavors: ["Fruit du dragon", "Fraise", "Frais"] },
            { name: "Killa", flavors: ["Fruit du dragon violet"] }
        ]
    },

    pupille: {
        name: "Pupille",
        icon: "👁️",
        color: "#7c3aed",
        products: [
            { name: "Dulce", flavors: ["Crème brulée"] },
            { name: "Unico", flavors: ["Guimauve"] },
            { name: "Napoli", flavors: ["Tarte café"] },
            { name: "Hazel", flavors: ["Classic blond"] }
        ]
    },

    elfes: {
        name: "Elfes",
        icon: "🧝‍♀️",
        color: "#10b981",
        products: [
            { name: "Lyra", flavors: ["Fruits rouges"] },
            { name: "Nayla", flavors: ["Mangue", "Cassis"] },
            { name: "Ragnor", flavors: ["Fraise des bois", "Cassis", "Framboise", "Frais"] },
            { name: "Sylas", flavors: ["Myrtille", "Mûre", "Groseille", "Frais"] }
        ]
    },

    atsu: {
        name: "Atsu",
        icon: "⛩️",
        color: "#b91c1c",
        products: [
            { name: "Akari", flavors: ["Fraises sucrées"] },
            { name: "Akiro", flavors: ["Citron intense"] },
            { name: "Eiko", flavors: ["Pêche gummie"] },
            { name: "Hinaya", flavors: ["Fraise", "Kiwi"] },
            { name: "Kairen", flavors: ["Fruits rouges", "Mûre", "Cassis"] },
            { name: "Kazan", flavors: ["Fraise", "Fruit du dragon"] },
            { name: "Kenta", flavors: ["Pastèque", "Kiwi"] },
            { name: "Kura", flavors: ["Cerise", "Fruits rouges"] },
            { name: "Mangabei", flavors: ["Mangue", "Papaye", "Cassis"] },
            { name: "Mizuha", flavors: ["Limonade", "Grenadine"] },
            { name: "Reika", flavors: ["Tropical"] }
        ]
    },

    classicLines: {
        name: "Classic Lines",
        icon: "🚬",
        color: "#78716c",
        products: [
            { name: "Cliff", flavors: ["Classic blond léger"] },
            { name: "Craig", flavors: ["Classic blond"] },
            { name: "Kildar", flavors: ["Classic sec", "Notes fruitées"] }
        ]
    },

    mintCollection: {
        name: "Mint Collection",
        icon: "❄️",
        color: "#06b6d4",
        products: [
            { name: "Astrae", flavors: ["Menthe verte"] },
            { name: "Eira", flavors: ["Menthe glaciale"] },
            { name: "Moya", flavors: ["Menthe douce"] },
            { name: "Skaal", flavors: ["Menthe givrée"] }
        ]
    }
};

function getProductsByRange(rangeName) {
    const range = vapStationData[rangeName];
    if (!range) return [];

    return range.products.map(product => ({
        ...product,
        range: rangeName,
        rangeName: range.name,
        rangeIcon: range.icon,
        rangeColor: range.color
    }));
}

function getAllProducts() {
    const allProducts = [];
    Object.keys(vapStationData).forEach(rangeName => {
        allProducts.push(...getProductsByRange(rangeName));
    });
    return allProducts;
}

function getRandomProducts(products, count = 10) {
    const shuffled = [...products].sort(() => 0.5 - Math.random());
    return shuffled.slice(0, count);
}

function generateAnswerChoices(correctFlavor, allFlavors, count = 4) {
    const choices = [correctFlavor];
    const otherFlavors = allFlavors.filter(flavor => flavor !== correctFlavor);

    while (choices.length < count && otherFlavors.length > 0) {
        const randomIndex = Math.floor(Math.random() * otherFlavors.length);
        const flavor = otherFlavors.splice(randomIndex, 1)[0];
        choices.push(flavor);
    }

    return choices.sort(() => 0.5 - Math.random());
}

function getAllFlavors() {
    const allFlavors = new Set();
    Object.keys(vapStationData).forEach(rangeName => {
        vapStationData[rangeName].products.forEach(product => {
            product.flavors.forEach(flavor => allFlavors.add(flavor));
        });
    });
    return Array.from(allFlavors);
}

function getTotalProductCount() {
    return getAllProducts().length;
}

if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        vapStationData,
        getProductsByRange,
        getAllProducts,
        getRandomProducts,
        generateAnswerChoices,
        getAllFlavors,
        getTotalProductCount
    };
}
