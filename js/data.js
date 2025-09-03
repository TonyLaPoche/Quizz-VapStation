// Base de données des e-liquides Vap Station
const vapStationData = {
    // Gamme Savage - E-liquides intenses et puissants
    savage: {
        name: "Savage",
        icon: "🔥",
        color: "#ef4444",
        products: [
            {
                name: "Savage Mango",
                flavors: ["Mangue", "Fruits tropicaux", "Sucré"]
            },
            {
                name: "Savage Berry",
                flavors: ["Fruits rouges", "Myrtille", "Framboise", "Acidulé"]
            },
            {
                name: "Savage Mint",
                flavors: ["Menthe glaciale", "Fraîcheur intense", "Eucalyptus"]
            },
            {
                name: "Savage Apple",
                flavors: ["Pomme verte", "Acidulé", "Croquant"]
            },
            {
                name: "Savage Grape",
                flavors: ["Raisin", "Fruits noirs", "Juteux"]
            },
            {
                name: "Savage Watermelon",
                flavors: ["Pastèque", "Rafraîchissant", "Été"]
            },
            {
                name: "Savage Cola",
                flavors: ["Cola", "Pétillant", "Caramel", "Vanille"]
            },
            {
                name: "Savage Ice",
                flavors: ["Menthe polaire", "Fraîcheur extrême", "Cristallin"]
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
                name: "Inca Gold",
                flavors: ["Tabac blond", "Caramel", "Vanille", "Noisette"]
            },
            {
                name: "Inca Royal",
                flavors: ["Tabac brun", "Miel", "Épices douces", "Boisé"]
            },
            {
                name: "Inca Forest",
                flavors: ["Fruits des bois", "Cassis", "Mûre", "Terreux"]
            },
            {
                name: "Inca Sunset",
                flavors: ["Pêche", "Abricot", "Mangue", "Crémeux"]
            },
            {
                name: "Inca Storm",
                flavors: ["Menthe", "Eucalyptus", "Pin", "Fraîcheur"]
            },
            {
                name: "Inca Dream",
                flavors: ["Vanille", "Crème", "Biscuit", "Douceur"]
            },
            {
                name: "Inca Fire",
                flavors: ["Cannelle", "Épices", "Chaleur", "Piquant"]
            },
            {
                name: "Inca Ocean",
                flavors: ["Fruits de mer", "Iodé", "Salé", "Minéral"]
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
                name: "Pupille Vision",
                flavors: ["Fruits exotiques", "Passion", "Litchi", "Floral"]
            },
            {
                name: "Pupille Focus",
                flavors: ["Café", "Chocolat", "Caramel", "Intense"]
            },
            {
                name: "Pupille Illusion",
                flavors: ["Bonbon", "Fruité", "Acidulé", "Coloré"]
            },
            {
                name: "Pupille Mystery",
                flavors: ["Saveur mystère", "Complexe", "Surprenant", "Unique"]
            },
            {
                name: "Pupille Clarity",
                flavors: ["Menthe douce", "Thé vert", "Zen", "Apaisant"]
            },
            {
                name: "Pupille Spark",
                flavors: ["Agrumes", "Citron", "Orange", "Pétillant"]
            },
            {
                name: "Pupille Depth",
                flavors: ["Fruits noirs", "Cassis", "Profond", "Intense"]
            },
            {
                name: "Pupille Bright",
                flavors: ["Fruits jaunes", "Ananas", "Mangue", "Lumineux"]
            }
        ]
    },

    // 4ème Gamme - À compléter quand vous vous souviendrez du nom
    mystery: {
        name: "Gamme Mystère",
        icon: "❓",
        color: "#f59e0b",
        products: [
            {
                name: "Produit Mystère 1",
                flavors: ["Saveur à définir", "Arôme inconnu", "À découvrir"]
            },
            {
                name: "Produit Mystère 2",
                flavors: ["Saveur à définir", "Arôme inconnu", "À découvrir"]
            },
            {
                name: "Produit Mystère 3",
                flavors: ["Saveur à définir", "Arôme inconnu", "À découvrir"]
            },
            {
                name: "Produit Mystère 4",
                flavors: ["Saveur à définir", "Arôme inconnu", "À découvrir"]
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
