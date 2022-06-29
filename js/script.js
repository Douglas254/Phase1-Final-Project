// My javaScript code here
// API URL
const baseURL = "https://www.themealdb.com/api/json/v1/1/random.php";
const generateMealBtn = document.getElementById("generateBtn");
const mealTitle = document.getElementById("title");
const instructions = document.getElementById("instructions");
const category = document.getElementById("category");
const area = document.getElementById("area");
const tags = document.getElementById("tags");
const image = document.querySelector(".img-fluid");
const embedVideo = document.getElementById("recipeVideo");
const list = document.getElementById("list");
const like = document.querySelector(".like");
let countLike = document.querySelector(".countLike").innerText;

generateMealBtn.addEventListener("click", () => {
  getMeal();
});

document.addEventListener("DOMContentLoaded", () => {
  getComments();
  document
    .getElementById("commentForm")
    .addEventListener("submit", handleSubmit);
});

like.addEventListener("click", () => {
  const counArea = document.getElementById("count");
  const count = parseInt(countLike++, 10);
  counArea.innerText = count;
});

// function get the random meal
const getMeal = () => {
  fetch(baseURL)
    .then((res) => res.json())
    .then((resData) => {
      displayMeal(resData.meals[0]);
    })
    .catch((error) => {
      console.log(error);
    });
};

const displayMeal = (mealObj) => {
  const ingredients = [];
  for (let i = 1; i <= 20; i++) {
    if (mealObj[`strIngredient${i}`]) {
      ingredients.push(
        `${mealObj[`strIngredient${i}`]} - ${mealObj[`strMeasure${i}`]}`
      );
    } else {
      break;
    }
  }

  mealTitle.innerText = mealObj.strMeal;
  instructions.innerText = mealObj.strInstructions;
  category.innerText = mealObj.strCategory;
  area.innerText = mealObj.strArea;
  tags.innerText = mealObj.strTags?.split(",").join(", ");
  image.src = mealObj.strMealThumb;
  embedVideo.src = `https://www.youtube.com/embed/${mealObj.strYoutube.slice(
    -11
  )}`;

  //   iterate through the array and return string
  list.innerHTML = `${ingredients
    .map((ingredient) => `<li>${ingredient}</li>`)
    .join("")}`;
};

// function for getting user input and validation when user submit a blank comment
const handleSubmit = (e) => {
  e.preventDefault();
  let commentObj = {
    comment: e.target.input.value,
  };
  console.log(commentObj);
  if (commentObj.comment === "") {
    alert("You can not submit a blank comment");
  } else {
    submitForm(commentObj);
  }
};

// function to submit the form input
const submitForm = (commentObj) => {
  fetch("http://localhost:3000/comments", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(commentObj),
  })
    .then((res) => res.json())
    .then((comments) => console.log(comments));
};

// function to fetch the comments from local db and display on the browser
const getComments = () => {
  fetch("http://localhost:3000/comments")
    .then((res) => res.json())
    .then((resData) => {
      resData.forEach((comment) => {
        console.log(comment);
        const p = document.createElement("p");
        document.querySelector(".comments").append(p);
        p.innerText = comment["comment"];
      });
    });
};
