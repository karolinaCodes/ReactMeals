//The list of meals

import { useEffect, useState } from "react";

import Card from "../UI/Card";
import MealItem from "./MealItem/MealItem";
import classes from "./AvailableMeals.module.css";

const AvailableMeals = () => {
  const [meals, setMeals] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [httpError, setHttpError] = useState();
  //note down null
  //the ftn you pass to useEffect should not return a promise bc the cleanup ftn cant clean up a promise(this is how it used to be, so if doesnt work then this is problem), so need to save the fetching function in a variable and then call it in next line (both the ftn and calling it are in the useEffect ftn) *** when executed my own attempt I didnt have to do this bc it this async ftn worked in useEffect
  //all async ftn return a promise so need to await the response
  useEffect(() => {
    const fetchMeals = async () => {
      const response = await fetch(
        "https://react-http-7f588-default-rtdb.firebaseio.com/meals.json"
      );

      if (!response.ok) {
        throw new Error("Something went wrong!");
      }

      const responseData = await response.json();

      const loadedMeals = [];

      //note how to convert object to an array like this

      for (const key in responseData) {
        loadedMeals.push({
          id: key,
          name: responseData[key].name,
          description: responseData[key].description,
          price: responseData[key].price,
        });
      }

      setMeals(loadedMeals);
      setIsLoading(false);
    };

    fetchMeals().catch((error) => {
      setIsLoading(false);
      setHttpError(error.message);
    });
    //need to do catch like this and not typical way because fetchMeals is an async ftn and will return a promise and if throw an error inside a promise that promise will reject, need to await promise but then make useefect async ftn which not allowed, .catch handles the error that happen in a promise when they return a reponse
  }, []);

  //short-ciruit a component, you return some other jsx code
  if (isLoading) {
    return (
      <section className={classes.MealsLoading}>
        <p>Loading...</p>
      </section>
    );
  }

  if (httpError) {
    return (
      <section className={classes.MealsError}>
        <p>{httpError}</p>
      </section>
    );
  }

  const mealsList = meals.map((meal) => (
    <MealItem
      key={meal.id}
      id={meal.id}
      name={meal.name}
      description={meal.description}
      price={meal.price}
    />
  ));

  return (
    <section className={classes.meals}>
      <Card>
        <ul>{mealsList}</ul>
      </Card>
    </section>
  );
};

export default AvailableMeals;
