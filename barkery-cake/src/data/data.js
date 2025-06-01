import cake1 from "../assets/cake1.png";
import cake2 from "../assets/cake2.png";
import cake3 from "../assets/cake3.png";
import cake4 from "../assets/cake4.png";
import cake5 from "../assets/cake5.png";
import cake6 from "../assets/cake6.png";
import sample1 from "../assets/sample1.png";
import sample2 from "../assets/sample2.png";
import sample3 from "../assets/sample3.png";
import product1 from "../assets/product1.png";
import product2 from "../assets/product2.png";
import product3 from "../assets/product3.png";
import product4 from "../assets/product4.png";
import product5 from "../assets/product5.png";
import product6 from "../assets/product6.png";
import muffin1 from "../assets/muffin1.jpeg";
import muffin2 from "../assets/muffin2.jpeg";
import muffin3 from "../assets/muffin3.jpeg";
import muffin4 from "../assets/muffin4.jpeg";
import muffin5 from "../assets/muffin5.jpeg";
import muffin6 from "../assets/muffin6.jpeg";
import croissant1 from "../assets/croissant1.jpeg";
import croissant2 from "../assets/croissant2.jpeg";
import croissant3 from "../assets/croissant3.jpeg";
import bread1 from "../assets/bread1.jpeg";
import bread2 from "../assets/bread2.jpeg";
import bread3 from "../assets/bread3.jpeg";
import bread4 from "../assets/bread4.jpeg";
import tart1 from "../assets/tart1.jpeg";
import tart2 from "../assets/tart2.jpeg";
import tart3 from "../assets/tart3.jpeg";
import tart4 from "../assets/tart4.jpeg";
import tart5 from "../assets/tart5.jpeg";

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

export const featuredTreat = [
  {
    id: 1,
    name: `Puff Pastry `,
    price: "$8",
    img: sample1,
  },
  {
    id: 2,
    name: `Doughnuts `,
    price: "$8",
    img: sample2,
  },
  {
    id: 3,
    name: `Brownies `,
    price: "$8",
    img: sample3,
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
          image: muffin6,
        },
        {
          id: 202,
          name: "Chocolate Chip Muffin",
          price: 3.99,
          description: "Loaded with chocolate chips",
          image: muffin5,
        },
        {
          id: 203,
          name: "Lemon Poppy Seed Muffin",
          price: 3.89,
          description: "Tangy lemon with poppy seeds",
          image: muffin3,
        },
        {
          id: 204,
          name: "Banana Nut Muffin",
          price: 3.79,
          description: "Classic banana with walnuts",
          image: muffin4,
        },
        {
          id: 205,
          name: "Cinnamon Swirl Muffin",
          price: 4.29,
          description: "Sweet cinnamon swirls in a soft muffin",
          image: muffin2,
        },
        {
          id: 206,
          name: "Pumpkin Spice Muffin",
          price: 4.49,
          description: "Seasonal pumpkin flavor with warm spices",
          image: muffin1,
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
          image: croissant1,
        },
        {
          id: 302,
          name: "Chocolate Croissant",
          price: 3.99,
          description: "Buttery croissant with chocolate filling",
          image: croissant2,
        },
        {
          id: 303,
          name: "Almond Croissant",
          price: 4.29,
          description: "Croissant filled with almond cream",
          image: croissant3,
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
          image: bread1,
        },
        {
          id: 402,
          name: "Whole Wheat Bread",
          price: 4.99,
          description: "Healthy whole wheat bread",
          image: bread2,
        },
        {
          id: 403,
          name: "Flat Bread",
          price: 3.49,
          description: "Soft flatbread topped with garlic and fresh herbs",
          image: bread3,
        },
        {
          id: 404,
          name: "Brioche Loaf",
          price: 6.49,
          description: "Rich and buttery brioche",
          image: bread4,
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
          image: tart1,
        },
        {
          id: 502,
          name: "Apple Tart",
          price: 6.49,
          description: "A rustic tart with sliced apples ",
          image: tart4,
        },
        {
          id: 503,
          name: "Lemon Tart",
          price: 5.79,
          description: "Tangy lemon curd in sweet pastry",
          image: tart2,
        },
        {
          id: 504,
          name: "Berry Tart",
          price: 6.29,
          description: "Mixed berries on vanilla cream",
          image: tart3,
        },
        {
          id: 505,
          name: "Almond Jam Tart",
          price: 5.49,
          description: "A delightful tart with a flaky pastry crust",
          image: tart5,
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
          image: cake1,
        },
        {
          id: 201,
          name: "Blueberry Muffin",
          price: 3.99,
          description: "Fresh blueberries in every bite",
          image: muffin1,
        },
        {
          id: 301,
          name: "Butter Croissant",
          price: 3.49,
          description: "Classic French butter croissant",
          image: croissant1,
        },
        {
          id: 401,
          name: "Sourdough Bread",
          price: 5.99,
          description: "Traditional sourdough with crispy crust",
          image: bread1,
        },
        {
          id: 303,
          name: "Almond Croissant",
          price: 4.29,
          description: "Croissant filled with almond cream",
          image: croissant3,
        },
        {
          id: 503,
          name: "Lemon Tart",
          price: 5.79,
          description: "Tangy lemon curd in sweet pastry",
          image: tart3,
        },
      ],
    },
  ],
};
