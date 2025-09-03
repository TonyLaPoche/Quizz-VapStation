// Base de données des e-liquides Vap Station (données réelles du site vapstation.com)
const vapStationData = {
    // Gamme Savage - E-liquides intenses et puissants
    savage: {
        name: "Savage",
        icon: "🔥",
        color: "#ef4444",
        products: [
            {
                name: "Rhino",
                flavors: ["Pitaya", "Cassis"]
            },
            {
                name: "King",
                flavors: ["Amande cremeuse"]
            },
            {
                name: "Aquila",
                flavors: ["Limonade grenade", "Frais"]
            },
            {
                name: "Baghera",
                flavors: ["Menthe givrée"]
            },
            {
                name: "Zephyros",
                flavors: ["Menthe chlorophile"]
            },
            {
                name: "Gazelia",
                flavors: ["Pêche", "Poire", "Kiwi"]
            },
            
            {
                name: "Mangabey",
                flavors: ["Mangue", "Papaye", "Cassis glacé"]
            },
            {
                name: "Venom",
                flavors: ["Pastèque", "Kiwi glacée"]
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
                name: "Saca",
                flavors: ["Fraises"]
            },
            {
                name: "Maya",
                flavors: ["Cassis", "Raisin blanc", "Fruit rouges frais"]
            },
            {
                name: "Amaru",
                flavors: ["Framboise bleu"]
            },
            {
                name: "Supay",
                flavors: ["Pomme", "Poire", "Fruit du dragon"]
            },
            {
                name: "Manco",
                flavors: ["Ice Tea pêche"]
            },
            {
                name: "Cuzco",
                flavors: ["Triple Citron"]
            },
            {
                name: "Pacha",
                flavors: ["Fruit du dragon frais", "Fraise"]
            },
            {
                name: "Killa",
                flavors: ["Fruit du dragon violet"]
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
                flavors: ["Crème brûlée", "Vanille", "Caramel"]
            },
            {
                name: "Unico",
                flavors: ["Marshmallow"]
            },
            {
                name: "Napoli",
                flavors: ["Tarte au café"]
            },
            {
                name: "Hazel",
                flavors: ["Classic", "Neutre", "Tabac", "Fruit à coques"]
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
                flavors: ["Fruits rouges"]
            },
            {
                name: "Nayla",
                flavors: ["Cassis", "Mangue"]
            },
            {
                name: "Ragnar",
                flavors: ["Fraises", "Framboises", "frais", "Cassis"]
            },
            {
                name: "Sylas",
                flavors: ["Myrtille", "Mûre", "Groseille", "Fraîcheur"]
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
