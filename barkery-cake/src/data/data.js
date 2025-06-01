import cake1 from "../assets/cake1.png";
import cake2 from "../assets/cake2.png";
import cake3 from "../assets/cake3.png";
import cake4 from "../assets/cake4.png";
import cake5 from "../assets/cake5.png";
import cake6 from "../assets/cake6.png";
import product1 from "../assets/product1.png";
import product2 from "../assets/product2.png";
import product3 from "../assets/product3.png";
import product4 from "../assets/product4.png";
import product5 from "../assets/product5.png";
import product6 from "../assets/product6.png";

export const products = [
  {
    id: 1,
    name: `Whole Grain Bread`,
    price: "40$",
    img: product1,
  },
  {
    id: 2,
    name: "Whole Grain Bread",
    price: "40$",
    img: product2,
  },
  {
    id: 3,
    name: "Whole Grain Bread",
    price: "40$",
    img: product3,
  },
  {
    id: 4,
    name: "Whole Grain Bread",
    price: "40$",
    img: product4,
  },
  {
    id: 5,
    name: "Whole Grain Bread",
    price: "40$",
    img: product5,
  },
  {
    id: 6,
    name: "Whole Grain Bread",
    price: "40$",
    img: product6,
  },
];

export const data = {
  categories: [
    {
      id: 1,
      name: "Cake",
      products: [
        {
          id: 101,
          name: "Chocolate Fudge Cake",
          price: 24.99,
          description: "Rich chocolate cake with fudge frosting",
          image: cake1,
        },
        {
          id: 102,
          name: "Red Velvet Cake",
          price: 26.99,
          description: "Classic red velvet with cream cheese frosting",
          image: cake2,
        },
        {
          id: 103,
          name: "Carrot Cake",
          price: 22.99,
          description: "Moist carrot cake with cream cheese frosting",
          image: cake3,
        },
        {
          id: 104,
          name: "Cheesecake",
          price: 28.99,
          description: "Classic New York style cheesecake",
          image: cake4,
        },
        {
          id: 105,
          name: "Lemon Drizzle Cake",
          price: 23.99,
          description: "Zesty lemon cake with a tangy drizzle glaze",
          image: cake5,
        },
        {
          id: 106,
          name: "Vanilla Sponge Cake",
          price: 21.99,
          description:
            "Light and fluffy vanilla cake with buttercream frosting",
          image: cake6,
        },
      ],
    },
    {
      id: 2,
      name: "Muffins",
      products: [
        {
          id: 201,
          name: "Blueberry Muffin",
          price: 3.99,
          description: "Fresh blueberries in every bite",
          image: "muffin1.jpeg",
        },
        {
          id: 202,
          name: "Chocolate Chip Muffin",
          price: 3.99,
          description: "Loaded with chocolate chips",
          image: "muffin2.jpeg",
        },
        {
          id: 203,
          name: "Banana Nut Muffin",
          price: 3.79,
          description: "Classic banana with walnuts",
          image: "muffin3.jpeg",
        },
        {
          id: 204,
          name: "Lemon Poppy Seed Muffin",
          price: 3.89,
          description: "Tangy lemon with poppy seeds",
          image: "muffin4.jpeg",
        },
      ],
    },
    {
      id: 3,
      name: "Croissant",
      products: [
        {
          id: 301,
          name: "Butter Croissant",
          price: 3.49,
          description: "Classic French butter croissant",
          image: "croissant1.jpeg",
        },
        {
          id: 302,
          name: "Chocolate Croissant",
          price: 3.99,
          description: "Buttery croissant with chocolate filling",
          image: "croissant2.jpeg",
        },
        {
          id: 303,
          name: "Almond Croissant",
          price: 4.29,
          description: "Croissant filled with almond cream",
          image: "croissant3.jpeg",
        },
      ],
    },
    {
      id: 4,
      name: "Bread",
      products: [
        {
          id: 401,
          name: "Sourdough Bread",
          price: 5.99,
          description: "Traditional sourdough with crispy crust",
          image: "bread1.jpeg",
        },
        {
          id: 402,
          name: "Whole Wheat Bread",
          price: 4.99,
          description: "Healthy whole wheat bread",
          image: "bread2.jpeg",
        },
        {
          id: 403,
          name: "Baguette",
          price: 3.49,
          description: "Classic French baguette",
          image: "bread3.jpeg",
        },
        {
          id: 404,
          name: "Brioche Loaf",
          price: 6.49,
          description: "Rich and buttery brioche",
          image: "bread4.jpeg",
        },
      ],
    },
    {
      id: 5,
      name: "Tart",
      products: [
        {
          id: 501,
          name: "Fruit Tart",
          price: 5.99,
          description: "Assorted fresh fruits on custard",
          image: "tart1.jpeg",
        },
        {
          id: 502,
          name: "Chocolate Tart",
          price: 6.49,
          description: "Rich chocolate ganache in shortcrust",
          image: "tart2.jpeg",
        },
        {
          id: 503,
          name: "Lemon Tart",
          price: 5.79,
          description: "Tangy lemon curd in sweet pastry",
          image: "tart3.jpeg",
        },
        {
          id: 504,
          name: "Berry Tart",
          price: 6.29,
          description: "Mixed berries on vanilla cream",
          image: "tart4.jpeg",
        },
      ],
    },
    {
      id: 6,
      name: "Favorite",
      products: [
        {
          id: 101,
          name: "Chocolate Fudge Cake",
          price: 24.99,
          description: "Rich chocolate cake with fudge frosting",
          image: "cake1.png",
        },
        {
          id: 103,
          name: "Carrot Cake",
          price: 22.99,
          description: "Moist carrot cake with cream cheese frosting",
          image: "cake3.png",
        },
        {
          id: 201,
          name: "Blueberry Muffin",
          price: 3.99,
          description: "Fresh blueberries in every bite",
          image: "muffin1.jpeg",
        },
        {
          id: 203,
          name: "Banana Nut Muffin",
          price: 3.79,
          description: "Classic banana with walnuts",
          image: "muffin3.jpeg",
        },
        {
          id: 301,
          name: "Butter Croissant",
          price: 3.49,
          description: "Classic French butter croissant",
          image: "croissant1.jpeg",
        },
        {
          id: 303,
          name: "Almond Croissant",
          price: 4.29,
          description: "Croissant filled with almond cream",
          image: "croissant3.jpeg",
        },
        {
          id: 401,
          name: "Sourdough Bread",
          price: 5.99,
          description: "Traditional sourdough with crispy crust",
          image: "bread1.jpeg",
        },
        {
          id: 404,
          name: "Brioche Loaf",
          price: 6.49,
          description: "Rich and buttery brioche",
          image: "bread4.jpeg",
        },
        {
          id: 501,
          name: "Fruit Tart",
          price: 5.99,
          description: "Assorted fresh fruits on custard",
          image: "tart1.jpeg",
        },
        {
          id: 503,
          name: "Lemon Tart",
          price: 5.79,
          description: "Tangy lemon curd in sweet pastry",
          image: "tart3.jpeg",
        },
      ],
    },
  ],
};
