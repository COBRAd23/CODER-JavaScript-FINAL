// Datos de los cursos
const coursesData = [
    {
        id: 1,
        name: "JavaScript Moderno",
        price: 49999,
        duration: "12 semanas",
        level: "Intermedio",
        description: "Domina JavaScript ES6+, async/await, y las últimas características del lenguaje.",
        image: "https://picsum.photos/seed/js-course/600/400",
        imageAlt: "JavaScript Moderno",
        category: "Desarrollo Web",
        stock: 50
    },
    {
        id: 2,
        name: "React & Next.js",
        price: 69999,
        duration: "10 semanas",
        level: "Avanzado",
        description: "Crea aplicaciones web modernas con React 18 y Next.js 13.",
        image: "https://images.unsplash.com/photo-1551650975-87deedd944c3?w=600&h=400&fit=crop",
        imageAlt: "React & Next.js",
        category: "Frontend",
        stock: 35
    },
    {
        id: 3,
        name: "Node.js Backend",
        price: 59999,
        duration: "8 semanas",
        level: "Intermedio",
        description: "Desarrolla APIs RESTful y aplicaciones backend con Node.js y Express.",
        image: "https://images.unsplash.com/photo-1461749280684-dccba630e2f6?w=600&h=400&fit=crop",
        imageAlt: "Node.js Backend",
        category: "Backend",
        stock: 40
    },
    {
        id: 4,
        name: "Python para Data Science",
        price: 79999,
        duration: "14 semanas",
        level: "Intermedio-Avanzado",
        description: "Aprende análisis de datos con Python, Pandas y Scikit-learn.",
        image: "https://picsum.photos/seed/python-data/600/400",
        imageAlt: "Python para Data Science",
        category: "Data Science",
        stock: 30
    },
    {
        id: 5,
        name: "Diseño UX/UI",
        price: 54999,
        duration: "6 semanas",
        level: "Principiante",
        description: "Fundamentos de diseño de experiencia de usuario e interfaces.",
        image: "https://images.unsplash.com/photo-1561070791-2526d30994b5?w=600&h=400&fit=crop",
        imageAlt: "Diseño UX/UI",
        category: "Diseño",
        stock: 45
    },
    {
        id: 6,
        name: "TypeScript Avanzado",
        price: 44999,
        duration: "7 semanas",
        level: "Avanzado",
        description: "Tipado fuerte, generics, decorators y patrones en TypeScript.",
        image: "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?w=600&h=400&fit=crop",
        imageAlt: "TypeScript Avanzado",
        category: "Desarrollo Web",
        stock: 25
    }
];

// Constantes del negocio
const BUSINESS_CONFIG = {
    TAX_RATE: 0.10,          // 10% IVA
    SHIPPING_COST: 15000,    // Costo de envío
    MIN_PURCHASE: 20000,     // Compra mínima para descuentos
    DISCOUNT_RATE: 0.10,     // 10% de descuento en compras grandes
    MAX_ITEMS: 5,            // Máximo de items por curso
};

// Exportar los datos
export { coursesData, BUSINESS_CONFIG };