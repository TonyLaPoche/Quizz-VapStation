// Base de données des e-liquides Vap Station (données réelles du site vapstation.com)
const vapStationData = {
    // Gamme Savage - E-liquides intenses et puissants
    savage: {
        name: "Savage",
        icon: "🔥",
        color: "#ef4444",
        products: [
            {
                name: "Aquila",
                flavors: ["Grenade", "Limonade", "Rafraîchissant", "Estival"]
            },
            {
                name: "Baguera",
                flavors: ["Fraîcheur polaire", "Givrée", "Menthe glaciale", "Grand Nord"]
            },
            {
                name: "Gazelia",
                flavors: ["Pêche sucrée", "Poire juteuse", "Kiwi acidulé", "Fruités"]
            },
            {
                name: "King",
                flavors: ["Amande grillée", "Riche", "Profond", "Gourmand"]
            },
            {
                name: "Mangabey",
                flavors: ["Mangue", "Papaye", "Ananas", "Tropical"]
            },
            {
                name: "Venom",
                flavors: ["Pastèque fraîche", "Kiwi savoureux", "Juteux", "Sucré"]
            }
        ]
    },

    // Gamme Inca - E-liquides premium aux saveurs complexes
    inca: {
        name: "Inca",
        icon: "🌿",
        color: "#059669",
        products: [
            {
                name: "Amaru",
                flavors: ["Framboise", "Framboise bleue", "Duo exceptionnel", "Sucré"]
            },
            {
                name: "Chacana",
                flavors: ["Tabac blond", "Neutre", "Classic", "Équilibré"]
            },
            {
                name: "Cuzko",
                flavors: ["Triple citron", "Agrumes", "Acidulé", "Intense"]
            },
            {
                name: "Killa",
                flavors: ["Fruit du dragon violet", "Exotique", "Délicat", "Unique"]
            },
            {
                name: "Manco",
                flavors: ["Bonbons à la pêche", "Sucré", "Gourmand", "Intense"]
            },
            {
                name: "Maya",
                flavors: ["Cassis", "Raisin blanc", "Fruits rouges", "Fraîcheur"]
            },
            {
                name: "Pacha",
                flavors: ["Fruit du dragon frais", "Fraise juteuse", "Délicat", "Sucré"]
            }
        ]
    },

    // Gamme Pupille - E-liquides surprenants et innovants
    pupille: {
        name: "Pupille",
        icon: "👁️",
        color: "#7c3aed",
        products: [
            {
                name: "Dulce",
                flavors: ["Crème brûlée", "Vanille", "Dessert", "Gourmand"]
            },
            {
                name: "Iris",
                flavors: ["Fruits rouges", "Acidulé", "Pétillant", "Vivace"]
            },
            {
                name: "Luna",
                flavors: ["Myrtille", "Cassis", "Fruits noirs", "Intense"]
            },
            {
                name: "Nero",
                flavors: ["Café", "Chocolat noir", "Amer", "Puissant"]
            },
            {
                name: "Opale",
                flavors: ["Menthe douce", "Fraîcheur", "Subtile", "Rafraîchissant"]
            },
            {
                name: "Saphir",
                flavors: ["Fruits exotiques", "Passion", "Mangue", "Tropical"]
            }
        ]
    },

    // Gamme Elfes - E-liquides magiques et envoûtants
    elfes: {
        name: "Elfes",
        icon: "🧝‍♀️",
        color: "#10b981",
        products: [
            {
                name: "Lyra",
                flavors: ["Fruits rouges", "Mélange délicat", "Gourmand", "Équilibré"]
            },
            {
                name: "Nayla",
                flavors: ["Cassis", "Mangue", "Exotique", "Fruité"]
            },
            {
                name: "Ragnar",
                flavors: ["Fraises des bois", "Framboises", "Mûres", "Cassis", "Fraîcheur"]
            },
            {
                name: "Ravena",
                flavors: ["Myrtille", "Mûre", "Groseille", "Fruité intense"]
            },
            {
                name: "Sylas",
                flavors: ["Myrtille", "Mûre", "Groseille", "Fraîcheur"]
            },
            {
                name: "Theron",
                flavors: ["Pomme verte", "Acidulé", "Croquant", "Rafraîchissant"]
            }
        ]
    }
};

// Fonction pour obtenir tous les produits d'une gamme
function getProductsByRange(rangeName) {
    return vapStationData[rangeName]?.products || [];
}

// Fonction pour obtenir tous les produits mélangés
function getAllProducts() {
    let allProducts = [];
    Object.keys(vapStationData).forEach(rangeName => {
        const range = vapStationData[rangeName];
        range.products.forEach(product => {
            allProducts.push({
                ...product,
                range: rangeName,
                rangeName: range.name,
                rangeIcon: range.icon,
                rangeColor: range.color
            });
        });
    });
    return allProducts;
}

// Fonction pour obtenir des produits aléatoirement
function getRandomProducts(products, count = 10) {
    const shuffled = [...products].sort(() => 0.5 - Math.random());
    return shuffled.slice(0, count);
}

// Fonction pour générer des réponses multiples
function generateAnswerChoices(correctFlavor, allFlavors, count = 4) {
    const choices = [correctFlavor];
    const otherFlavors = allFlavors.filter(flavor => flavor !== correctFlavor);
    
    // Ajouter des réponses aléatoirement
    while (choices.length < count && otherFlavors.length > 0) {
        const randomIndex = Math.floor(Math.random() * otherFlavors.length);
        const flavor = otherFlavors.splice(randomIndex, 1)[0];
        choices.push(flavor);
    }
    
    // Mélanger les choix
    return choices.sort(() => 0.5 - Math.random());
}

// Fonction pour obtenir tous les arômes disponibles
function getAllFlavors() {
    const allFlavors = new Set();
    Object.keys(vapStationData).forEach(rangeName => {
        vapStationData[rangeName].products.forEach(product => {
            product.flavors.forEach(flavor => {
                allFlavors.add(flavor);
            });
        });
    });
    return Array.from(allFlavors);
}

// Export pour utilisation dans d'autres fichiers
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        vapStationData,
        getProductsByRange,
        getAllProducts,
        getRandomProducts,
        generateAnswerChoices,
        getAllFlavors
    };
}
