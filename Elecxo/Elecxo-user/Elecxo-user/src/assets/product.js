const electronicProducts = [
    {
        id: 1,
        name: "Apple iPhone 13 Pro",
        ratings: 4.8,
        category: "Mobiles",
        rate: 999,
        description: "The iPhone 13 Pro features a stunning Super Retina XDR display, A15 Bionic chip, and a pro camera system for stunning photos and videos.",
        image: "https://pngimg.com/d/iphone_12_PNG18.png"
    },
    {
        id: 2,
        name: "Samsung Galaxy S21 Ultra",
        ratings: 4.7,
        category: "Mobiles",
        rate: 1199,
        description: "The Samsung Galaxy S21 Ultra boasts a dynamic AMOLED 2X display, Exynos 2100 chipset, and a versatile quad-camera setup.",
        image: "https://images.samsung.com/is/image/samsung/p6pim/hk_en/galaxy-s21/gallery/hk-en-galaxy-s21-5g-g991-sm-g9910zigtgy-368805533?$624_624_PNG$"
    },
    {
        id: 3,
        name: "Sony WH-1000XM4",
        ratings: 4.6,
        category: "Headphones",
        rate: 349,
        description: "Industry-leading noise cancellation, exceptional sound quality, and up to 30 hours of battery life make these headphones a top choice.",
        image: "https://sony.scene7.com/is/image/sonyglobalsolutions/360-RA-category-icon-20221202?$S7Product$&fmt=png-alpha"
    },
    {
        id: 4,
        name: "Bose QuietComfort 45",
        ratings: 4.5,
        category: "Headphones",
        rate: 329,
        description: "The Bose QuietComfort 45 offers world-class noise cancellation, balanced audio, and a comfortable fit for long listening sessions.",
        image: "https://assets.bose.com/content/dam/cloudassets/Bose_DAM/Web/consumer_electronics/global/products/headphones/qc45/product_silo_images/QC45-LE_Right-Angle_1200x1022_Midnight-Blue_RGB.jpg/jcr:content/renditions/cq5dam.web.1920.1920.jpeg"
    },
    {
        id: 5,
        name: "Apple Watch Series 7",
        ratings: 4.7,
        category: "Wearables",
        rate: 399,
        description: "The Apple Watch Series 7 features a larger, more durable display, advanced health monitoring, and fast charging.",
        image: "https://i0.wp.com/cellbuddy.in/buddy/wp-content/uploads/2022/09/Series-7-41-_-45mm-GPS-Blue.png?fit=800%2C800&ssl=1"
    },
    {
        id: 6,
        name: "MacBook Pro 14-inch",
        ratings: 4.9,
        category: "Laptops",
        rate: 1999,
        description: "The MacBook Pro 14-inch comes with the powerful M1 Pro chip, a stunning Liquid Retina XDR display, and all-day battery life.",
        image: "https://atlas-content-cdn.pixelsquid.com/stock-images/apple-macbook-pro-14-inch-silver-Ka8Ke1E-600.jpg"
    },
    {
        id: 7,
        name: "Dell XPS 13",
        ratings: 4.6,
        category: "Laptops",
        rate: 1299,
        description: "The Dell XPS 13 is a sleek and powerful ultrabook with an InfinityEdge display, 11th Gen Intel Core processors, and long battery life.",
        image: "https://images-cdn.ubuy.co.in/635db62feaed300587621b54-dell-xps-13-9310-touchscreen-13-4-inch.jpg"
    },
    {
        id: 8,
        name: "Sony Bravia XR A80J",
        ratings: 4.8,
        category: "Televisions",
        rate: 1999,
        description: "The Sony Bravia XR A80J features a 4K OLED display, Cognitive Processor XR, and Acoustic Surface Audio+ for an immersive viewing experience.",
        image: "https://financialexpresswpcontent.s3.amazonaws.com/uploads/2021/10/sony-a80j2.png"
    },
    {
        id: 9,
        name: "Apple Watch Series 8",
        ratings: 4.7,
        category: "Wearables",
        rate: 399,
        description: "The Apple Watch Series 8 features a larger, more durable display, advanced health monitoring, and fast charging.",
        image: "https://i0.wp.com/cellbuddy.in/buddy/wp-content/uploads/2022/09/Series-7-41-_-45mm-GPS-Blue.png?fit=800%2C800&ssl=1"
    },
    {
        id: 10,
        name: "Apple Watch Ultra 9",
        ratings: 4.7,
        category: "Wearables",
        rate: 399,
        description: "The Apple Watch Ultra 9 features a more rugged design, advanced health tracking, and extreme durability.",
        image: "https://i0.wp.com/cellbuddy.in/buddy/wp-content/uploads/2022/09/Series-7-41-_-45mm-GPS-Blue.png?fit=800%2C800&ssl=1"
    },
    {
        id: 11,
        name: "LG C1 OLED",
        ratings: 4.7,
        category: "Televisions",
        rate: 1799,
        description: "The LG C1 OLED TV offers stunning picture quality, Dolby Vision IQ, and HDMI 2.1 support for next-gen gaming.",
        image: "https://www.lg.com/content/dam/channel/wcms/in/images/tvs/oled48c1xtz_atr_eail_in_c/gallery/OLED48C1XTZ-DZ-05.jpg"
    },
    {
        id: 12,
        name: "Canon EOS R5",
        ratings: 4.8,
        category: "Cameras",
        rate: 3899,
        description: "The Canon EOS R5 is a full-frame mirrorless camera with 8K video recording, 45MP resolution, and advanced autofocus.",
        image: "https://i.pcmag.com/imagery/articles/0311VwJ7y9BQi7vkjLtfuiw-1..v1594234890.jpg"
    },
    {
        id: 13,
        name: "Sony Alpha 7 IV",
        ratings: 4.7,
        category: "Cameras",
        rate: 2499,
        description: "The Sony Alpha 7 IV features a 33MP full-frame sensor, 4K 60p video, and real-time eye autofocus for both photos and videos.",
        image: "https://images-cdn.ubuy.co.in/65f314399d244b6db90b1676-sony-alpha-a7-iv-full-frame-mirrorless.jpg"
    },
    {
        id: 14,
        name: "Amazon Echo Dot (4th Gen)",
        ratings: 4.4,
        category: "Smart Home",
        rate: 49,
        description: "The Amazon Echo Dot (4th Gen) is a compact smart speaker with Alexa, improved sound quality, and voice control for your smart home.",
        image: "https://i.pcmag.com/imagery/reviews/04e3bEzJD7ng3WviIdH5URF-1.fit_scale.size_760x427.v1601313845.jpg"
    },
    {
        id: 15,
        name: "Apple iPhone 14 Pro",
        ratings: 4.8,
        category: "Mobiles",
        rate: 999,
        description: "The iPhone 14 Pro features a stunning Super Retina XDR display, A16 Bionic chip, and a pro camera system for stunning photos and videos.",
        image: "https://pngimg.com/d/iphone_12_PNG18.png"
    },
    {
        id: 16,
        name: "Apple iPhone 13 Pro (256GB, Red)",
        ratings: 4.8,
        category: "Mobiles",
        rate: 999,
        description: "The iPhone 13 Pro features a stunning Super Retina XDR display, A15 Bionic chip, and a pro camera system for stunning photos and videos.",
        image: "https://pngimg.com/d/iphone_12_PNG18.png"
    }
];

export default electronicProducts;